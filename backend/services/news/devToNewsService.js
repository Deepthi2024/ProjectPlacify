/**
 * Dev.to Service - Fetches live developer community news & articles from Dev.to API
 */

async function fetchFromDevTo(limit = 20) {
  try {
    const url = `https://dev.to/api/articles?per_page=${limit}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PlacifyTechNewsAggregator/1.0'
      }
    });

    if (!response.ok) {
      console.error(`[DevTo Service] HTTP error ${response.status}`);
      return [];
    }

    const articles = await response.json();
    if (!Array.isArray(articles)) {
      return [];
    }

    return articles.map(article => ({
      sourceType: 'devto',
      sourceId: String(article.id),
      title: article.title || '',
      description: article.description || article.title || '',
      url: article.url || '',
      imageUrl: article.cover_image || article.social_image || '',
      sourceName: 'DEV Community',
      author: article.user ? article.user.name || article.user.username : 'DEV Author',
      publishedAt: article.published_at ? new Date(article.published_at) : new Date()
    }));
  } catch (err) {
    console.error('[DevTo Service] Error fetching articles:', err.message);
    return [];
  }
}

module.exports = {
  fetchFromDevTo
};
