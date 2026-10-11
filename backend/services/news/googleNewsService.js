/**
 * Google Tech News Service - Fetches live breaking technology & company news from Google News RSS.
 * Covers Google, OpenAI, Microsoft, Meta, Apple, Nvidia, AI breakthroughs, and industry trends.
 */

async function fetchFromGoogleNews() {
  try {
    const rssTopics = [
      'Google+OpenAI+Microsoft+Meta+AI+technology+breakthrough',
      'artificial+intelligence+trending+tech+startup+engineering',
      'cybersecurity+cloud+computing+software+release'
    ];

    const allArticles = [];

    for (const topicQuery of rssTopics) {
      try {
        const url = `https://news.google.com/rss/search?q=${topicQuery}&hl=en-US&gl=US&ceid=US:en`;
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PlacifyTechNewsAggregator/2.0'
          }
        });

        if (!res.ok) continue;
        const text = await res.text();

        const itemMatches = text.matchAll(/<item>([\s\S]*?)<\/item>/g);
        for (const m of itemMatches) {
          const itemXml = m[1];
          const titleM = itemXml.match(/<title>(.*?)<\/title>/);
          const linkM = itemXml.match(/<link>(.*?)<\/link>/);
          const pubM = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
          const sourceM = itemXml.match(/<source[^>]*>(.*?)<\/source>/);

          let rawTitle = titleM ? titleM[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : '';
          let sourceName = sourceM ? sourceM[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : 'Google Tech News';
          let cleanTitle = rawTitle;

          if (rawTitle.includes(' - ')) {
            const parts = rawTitle.split(' - ');
            sourceName = parts.pop().trim();
            cleanTitle = parts.join(' - ').trim();
          }

          if (!cleanTitle || cleanTitle.length < 5) continue;
          const articleUrl = linkM ? linkM[1].trim() : '';
          const pubDateStr = pubM ? pubM[1].trim() : new Date().toISOString();

          allArticles.push({
            sourceType: 'googlenews',
            sourceId: articleUrl || cleanTitle,
            title: cleanTitle,
            description: `${cleanTitle} - Breaking technology and company news reported by ${sourceName}.`,
            url: articleUrl,
            imageUrl: '',
            sourceName: sourceName || 'Google News',
            author: sourceName,
            publishedAt: new Date(pubDateStr)
          });
        }
      } catch (e) {
        console.warn('[GoogleNews Service] Single RSS feed fetch warning:', e.message);
      }
    }

    return allArticles;
  } catch (err) {
    console.error('[GoogleNews Service] Global fetch error:', err.message);
    return [];
  }
}

module.exports = {
  fetchFromGoogleNews
};
