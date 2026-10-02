/**
 * News Aggregator Service - Coordinates multi-source fetching, normalization, deduplication, classification, and MongoDB caching.
 */

const NewsArticle = require('../../models/NewsArticle');
const { fetchFromGoogleNews } = require('./googleNewsService');
const { fetchFromNewsApi } = require('./newsApiService');
const { fetchFromHackerNews } = require('./hackerNewsService');
const { fetchFromTavilyNews } = require('./tavilyNewsService');
const { fetchFromDevTo } = require('./devToNewsService');
const { classifyArticle } = require('./newsClassifier');

/**
 * Checks if text contains basic tech indicators
 */
function isTechRelated(title, description) {
  const text = `${title || ''} ${description || ''}`.toLowerCase();
  const keywords = [
    'tech', 'ai', 'software', 'code', 'coding', 'developer', 'python', 'java', 'js',
    'javascript', 'react', 'node', 'web', 'data', 'cloud', 'cyber', 'security',
    'algorithm', 'model', 'llm', 'gpt', 'database', 'sql', 'system', 'app', 'computing',
    'open source', 'api', 'framework', 'linux', 'server', 'docker', 'kubernetes',
    'hacker', 'startup', 'engineering', 'chip', 'semiconductor', 'hardware', 'mobile',
    'challenge', 'release', 'framework', 'vulnerability', 'web scraping', 'agent',
    'google', 'openai', 'microsoft', 'meta', 'apple', 'nvidia', 'amazon', 'intel'
  ];
  return keywords.some(kw => text.includes(kw));
}

/**
 * Normalize title for secondary deduplication
 */
function normalizeTitle(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Main aggregate & store function
 */
async function aggregateAndStoreNews() {
  console.log('📰 [NewsAggregator] Starting multi-source live news aggregation process...');
  
  // 1. Fetch from sources concurrently (Google News RSS, Tavily Search, HackerNews, NewsAPI, Dev.to)
  const [googleArticles, newsApiArticles, hackerNewsArticles, tavilyArticles, devToArticles] = await Promise.all([
    fetchFromGoogleNews().catch(err => {
      console.error('[NewsAggregator] Google News fetch failed:', err.message);
      return [];
    }),
    fetchFromNewsApi().catch(err => {
      console.error('[NewsAggregator] NewsAPI fetch failed:', err.message);
      return [];
    }),
    fetchFromHackerNews().catch(err => {
      console.error('[NewsAggregator] Hacker News fetch failed:', err.message);
      return [];
    }),
    fetchFromTavilyNews().catch(err => {
      console.error('[NewsAggregator] Tavily News fetch failed:', err.message);
      return [];
    }),
    fetchFromDevTo().catch(err => {
      console.error('[NewsAggregator] Dev.to fetch failed:', err.message);
      return [];
    })
  ]);

  const rawArticles = [...googleArticles, ...tavilyArticles, ...hackerNewsArticles, ...newsApiArticles, ...devToArticles];
  console.log(`📰 [NewsAggregator] Retrieved ${rawArticles.length} raw articles (${googleArticles.length} Google News, ${tavilyArticles.length} Tavily, ${hackerNewsArticles.length} HN, ${newsApiArticles.length} NewsAPI, ${devToArticles.length} Dev.to).`);

  if (rawArticles.length === 0) {
    console.warn('📰 [NewsAggregator] No external articles retrieved. Preserving existing MongoDB news cache.');
    return { success: false, storedCount: 0, reason: 'No new articles fetched' };
  }

  // 2. Validate & filter invalid or non-tech articles
  const validArticles = rawArticles.filter(art => {
    if (!art.title || art.title.trim().length < 5) return false;
    if (!art.url || !art.url.startsWith('http')) return false;
    return isTechRelated(art.title, art.description);
  });

  // 3. Deduplicate in memory
  const uniqueArticles = [];
  const seenSourceIds = new Set();
  const seenTitles = new Set();
  const seenUrls = new Set();

  for (const art of validArticles) {
    const sourceKey = `${art.sourceType}:${art.sourceId}`;
    const normTitle = normalizeTitle(art.title);
    const normUrl = art.url.trim().toLowerCase();

    if (seenSourceIds.has(sourceKey) || seenTitles.has(normTitle) || seenUrls.has(normUrl)) {
      continue;
    }

    seenSourceIds.add(sourceKey);
    seenTitles.add(normTitle);
    seenUrls.add(normUrl);
    uniqueArticles.push(art);
  }

  console.log(`📰 [NewsAggregator] ${uniqueArticles.length} unique technology articles passed normalization & deduplication.`);

  // 4. Process, Classify & Persist to MongoDB
  let storedCount = 0;
  let updatedCount = 0;

  for (const art of uniqueArticles) {
    try {
      // Check if article already exists in DB
      let existing = await NewsArticle.findOne({
        $or: [
          { url: art.url },
          { sourceType: art.sourceType, sourceId: art.sourceId }
        ]
      });

      if (existing) {
        // Update freshness/status without re-running classification unnecessarily
        existing.fetchedAt = new Date();
        existing.isActive = true;
        await existing.save();
        updatedCount++;
      } else {
        // Classify new article
        const classification = await classifyArticle(art.title, art.description);

        const newDoc = new NewsArticle({
          title: art.title.trim(),
          description: art.description.trim(),
          summary: classification.summary,
          url: art.url.trim(),
          imageUrl: art.imageUrl || '',
          source: { name: art.sourceName || 'Tech Source' },
          author: art.author || '',
          publishedAt: art.publishedAt || new Date(),
          category: classification.category || 'General Tech',
          topics: classification.topics || [],
          skills: classification.skills || [],
          sourceType: art.sourceType,
          sourceId: art.sourceId,
          fetchedAt: new Date(),
          isActive: true
        });

        await newDoc.save();
        storedCount++;
      }
    } catch (err) {
      if (err.code !== 11000) { // Ignore duplicate key errors silently
        console.error(`📰 [NewsAggregator] Failed to store article "${art.title}":`, err.message);
      }
    }
  }

  console.log(`📰 [NewsAggregator] Completed aggregation. New stored: ${storedCount}, Updated: ${updatedCount}.`);
  return {
    success: true,
    storedCount,
    updatedCount,
    totalProcessed: uniqueArticles.length
  };
}

module.exports = {
  aggregateAndStoreNews
};
