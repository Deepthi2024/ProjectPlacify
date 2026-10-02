/**
 * Tavily News Service - Fetches live real-world technology news via Tavily Search API
 */

async function fetchFromTavilyNews() {
  const apiKey = process.env.TAVILY_API_KEY || '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';
  if (!apiKey) {
    console.warn('[TavilyNews Service] TAVILY_API_KEY is not configured in .env. Skipping Tavily fetch.');
    return [];
  }

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query: 'latest tech news software artificial intelligence cloud cybersecurity web development breaking',
        topic: 'news',
        days: 2,
        max_results: 15
      })
    });

    if (!response.ok) {
      console.error(`[TavilyNews Service] HTTP error ${response.status}`);
      return [];
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((result, idx) => ({
      sourceType: 'tavily',
      sourceId: result.url || `tavily-${idx}-${Date.now()}`,
      title: result.title || '',
      description: result.content || result.snippet || result.title || '',
      url: result.url || '',
      imageUrl: '',
      sourceName: 'Real-Time Web News',
      author: 'Tavily News',
      publishedAt: result.published_date ? new Date(result.published_date) : new Date()
    }));
  } catch (err) {
    console.error('[TavilyNews Service] Error fetching news:', err.message);
    return [];
  }
}

module.exports = {
  fetchFromTavilyNews
};
