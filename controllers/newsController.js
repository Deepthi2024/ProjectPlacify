/**
 * News Controller - Handles /api/news HTTP request and returns personalized tech news feed.
 */

const mongoose = require('mongoose');
const NewsArticle = require('../models/NewsArticle');
const { rankArticlesForUser } = require('../services/news/newsRanking');
const { aggregateAndStoreNews } = require('../services/news/newsAggregator');

async function handleGetPersonalizedNews(req, res, parsedUrl, sendJSON) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return sendJSON(res, 503, {
        success: false,
        error: 'MongoDB Atlas is not connected.'
      });
    }

    const searchParams = parsedUrl.searchParams || new URLSearchParams(parsedUrl.search || '');
    const userId = searchParams.get('userId') || searchParams.get('user_id') || '';
    const page = Math.max(1, parseInt(searchParams.get('page'), 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit'), 10) || 10));
    const forceRefresh = searchParams.get('refresh') === 'true' || searchParams.get('refresh') === '1';

    if (forceRefresh) {
      console.log('🔄 [NewsController] Live refresh requested. Executing multi-source news fetch...');
      await aggregateAndStoreNews().catch(err => console.warn('[NewsController] Live refresh warning:', err.message));
    }

    let userProfile = {};
    let skillProfile = {};
    let roadmapData = {};

    // 1. Fetch user information if userId provided
    if (userId) {
      const User = mongoose.model('User');
      const UserSkillProfile = mongoose.models.UserSkillProfile || mongoose.model('UserSkillProfile');
      const Roadmap = mongoose.models.Roadmap || mongoose.model('Roadmap');

      const [userDoc, skillDoc, roadmapDoc] = await Promise.all([
        User.findOne({ user_id: userId }).catch(() => null),
        UserSkillProfile.findOne({ user_id: userId }).catch(() => null),
        Roadmap.findOne({ user_id: userId }).catch(() => null)
      ]);

      if (userDoc) userProfile = userDoc.toObject ? userDoc.toObject() : userDoc;
      if (skillDoc) skillProfile = skillDoc.toObject ? skillDoc.toObject() : skillDoc;
      if (roadmapDoc) roadmapData = roadmapDoc.toObject ? roadmapDoc.toObject() : roadmapDoc;
    }

    // 2. Retrieve recent active news from MongoDB cache
    let rawArticles = await NewsArticle.find({ isActive: true })
      .sort({ publishedAt: -1 })
      .limit(60)
      .lean();

    if (!rawArticles || rawArticles.length === 0) {
      console.log('📰 [NewsController] Cache empty. Triggering initial live news fetch...');
      await aggregateAndStoreNews().catch(err => console.warn('[NewsController] Initial fetch warning:', err.message));
      rawArticles = await NewsArticle.find({ isActive: true })
        .sort({ publishedAt: -1 })
        .limit(60)
        .lean();
    }

    if (!rawArticles || rawArticles.length === 0) {
      return sendJSON(res, 200, {
        success: true,
        lastUpdated: new Date().toISOString(),
        total: 0,
        page,
        limit,
        personalizedFor: {
          domain: 'All Tech News',
          level: 'ALL'
        },
        articles: []
      });
    }

    // 3. Find latest fetch timestamp
    let latestFetchedAt = rawArticles[0].fetchedAt || rawArticles[0].updatedAt || new Date();
    for (const art of rawArticles) {
      if (art.fetchedAt && new Date(art.fetchedAt) > new Date(latestFetchedAt)) {
        latestFetchedAt = art.fetchedAt;
      }
    }

    // 4. Retrieve all tech articles sorted by published date (un-aligned by domain)
    const rankedArticles = rankArticlesForUser(rawArticles, userProfile, skillProfile, roadmapData);

    // 5. Pagination
    const startIndex = (page - 1) * limit;
    const paginated = rankedArticles.slice(startIndex, startIndex + limit);

    // 6. Format article response objects for frontend consumption
    const formattedArticles = paginated.map(art => ({
      id: String(art._id || art.url),
      title: art.title,
      description: art.description,
      summary: art.summary || art.description || art.title,
      url: art.url,
      imageUrl: art.imageUrl || '',
      source: art.source && art.source.name ? art.source.name : 'Tech News',
      publishedAt: art.publishedAt,
      category: art.category || 'General Tech',
      topics: art.topics || [],
      skills: art.skills || []
    }));

    return sendJSON(res, 200, {
      success: true,
      lastUpdated: new Date(latestFetchedAt).toISOString(),
      total: rankedArticles.length,
      page,
      limit,
      personalizedFor: {
        domain: 'All Tech News',
        level: 'ALL'
      },
      articles: formattedArticles
    });
  } catch (err) {
    console.error('❌ [NewsController] Error fetching personalized news:', err);
    return sendJSON(res, 500, {
      success: false,
      error: 'Failed to load personalized tech news.'
    });
  }
}

module.exports = {
  handleGetPersonalizedNews
};
