/**
 * Hacker News Service - Fetches technology stories from Firebase Hacker News API
 */

async function fetchFromHackerNews(limit = 35) {
  try {
    const topStoriesUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json';
    const response = await fetch(topStoriesUrl);
    if (!response.ok) {
      console.error(`[HackerNews Service] Failed to fetch top stories: ${response.status}`);
      return [];
    }

    const storyIds = await response.json();
    if (!Array.isArray(storyIds)) {
      return [];
    }

    const selectedIds = storyIds.slice(0, limit);
    const storyPromises = selectedIds.map(async id => {
      try {
        const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        if (!itemRes.ok) return null;
        return await itemRes.json();
      } catch (e) {
        return null;
      }
    });

    const items = await Promise.all(storyPromises);
    const validItems = items.filter(item => item && item.type === 'story' && item.title && !item.deleted && !item.dead);

    return validItems.map(item => ({
      sourceType: 'hackernews',
      sourceId: String(item.id),
      title: item.title || '',
      description: item.text || item.title || '',
      url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
      imageUrl: '',
      sourceName: 'Hacker News',
      author: item.by || '',
      publishedAt: item.time ? new Date(item.time * 1000) : new Date()
    }));
  } catch (err) {
    console.error('[HackerNews Service] Network or fetch error:', err.message);
    return [];
  }
}

module.exports = {
  fetchFromHackerNews
};
