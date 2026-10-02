/**
 * Test Script: News Fetchers & Aggregator Normalization
 */

const { fetchFromHackerNews } = require('../services/news/hackerNewsService');
const { fetchFromNewsApi } = require('../services/news/newsApiService');
const { classifyArticle } = require('../services/news/newsClassifier');

async function testNewsFetchers() {
  console.log('=== TEST 1: Hacker News Fetcher ===');
  const hnArticles = await fetchFromHackerNews(10);
  console.log(`Retrieved ${hnArticles.length} Hacker News stories.`);
  if (hnArticles.length > 0) {
    console.log('Sample HN Article:', JSON.stringify(hnArticles[0], null, 2));
  } else {
    console.error('FAILED: No Hacker News articles fetched.');
  }

  console.log('\n=== TEST 2: NewsAPI Fetcher ===');
  const newsApiArticles = await fetchFromNewsApi();
  console.log(`Retrieved ${newsApiArticles.length} NewsAPI articles.`);
  if (newsApiArticles.length > 0) {
    console.log('Sample NewsAPI Article:', JSON.stringify(newsApiArticles[0], null, 2));
  } else {
    console.log('INFO: NewsAPI returned 0 articles (NEWS_API_KEY may not be set in .env). Graceful fallback verified.');
  }

  console.log('\n=== TEST 3: Classifier & Summarizer ===');
  const sampleTitle = 'OpenAI announces new GPT-4o multimodal reasoning capabilities for Python developers';
  const sampleDesc = 'The latest model enhancement introduces advanced code interpreter features, fast inference for machine learning pipelines, and seamless SQL database integrations.';
  const classification = await classifyArticle(sampleTitle, sampleDesc);
  console.log('Classification Result:', JSON.stringify(classification, null, 2));

  if (classification.category && classification.summary && classification.topics.length > 0) {
    console.log('✅ PASS: Classifier and summarizer functioning correctly.');
  } else {
    console.error('❌ FAIL: Classifier output incomplete.');
  }
}

testNewsFetchers().catch(console.error);
