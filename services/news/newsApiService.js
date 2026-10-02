/**
 * NewsAPI Service - Fetches technology news from NewsAPI.org
 */

async function fetchFromNewsApi() {
  const apiKey = process.env.NEWS_API_KEY || '3572dbcad9ff42e6acfae2a1e7ed1846';
  if (!apiKey) {
    console.warn('[NewsAPI Service] NEWS_API_KEY is not configured in .env. Skipping NewsAPI fetch.');
    return [];
  }

  const queryKeywords = 'technology OR "artificial intelligence" OR "machine learning" OR "software engineering" OR "web development" OR "cybersecurity" OR "python" OR "react" OR "cloud computing"';
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(queryKeywords)}&language=en&sortBy=publishedAt&pageSize=30&apiKey=${apiKey}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PlacifyTechNewsAggregator/1.0'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[NewsAPI Service] HTTP error ${response.status}: ${errorText}`);
      return [];
    }

    const data = await response.json();
    if (data.status !== 'ok' || !Array.isArray(data.articles)) {
      console.error('[NewsAPI Service] Invalid API response:', data);
      return [];
    }

    return data.articles.map(article => ({
      sourceType: 'newsapi',
      sourceId: article.url || article.title,
      title: article.title || '',
      description: article.description || article.content || '',
      url: article.url || '',
      imageUrl: article.urlToImage || '',
      sourceName: article.source && article.source.name ? article.source.name : 'NewsAPI',
      author: article.author || '',
      publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date()
    }));
  } catch (err) {
    console.error('[NewsAPI Service] Network or parsing error:', err.message);
    return [];
  }
}

module.exports = {
  fetchFromNewsApi
};
