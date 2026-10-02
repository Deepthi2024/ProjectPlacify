/**
 * Test Script: End-to-End News API Endpoint & MongoDB Aggregation
 */

require('dotenv').config();
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e) {}

const mongoose = require('mongoose');
const { aggregateAndStoreNews } = require('../services/news/newsAggregator');
const NewsArticle = require('../models/NewsArticle');
const { rankArticlesForUser } = require('../services/news/newsRanking');

async function testEndToEndNews() {
  console.log('=== TEST: MongoDB Connection & News Aggregation ===');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB Atlas.');

  // Execute aggregation
  const aggResult = await aggregateAndStoreNews();
  console.log('Aggregator result:', aggResult);

  // Check stored articles in MongoDB
  const count = await NewsArticle.countDocuments({ isActive: true });
  console.log(`Active NewsArticles stored in MongoDB: ${count}`);

  if (count === 0) {
    console.error('❌ FAIL: No articles in MongoDB.');
  } else {
    console.log('✅ PASS: Articles successfully cached in MongoDB collection "news_articles".');
  }

  // Retrieve articles for Data Science user
  const sampleUser = { chosen_domain: 'datascience', current_skill_level: 'INTERMEDIATE' };
  const articles = await NewsArticle.find({ isActive: true }).sort({ publishedAt: -1 }).limit(20).lean();
  const ranked = rankArticlesForUser(articles, sampleUser);

  console.log(`\n📰 Top 3 Personalized Articles for ${sampleUser.chosen_domain.toUpperCase()} User:`);
  ranked.slice(0, 3).forEach((art, idx) => {
    console.log(`${idx + 1}. [${art.source.name}] ${art.title} (Topics: ${(art.topics || []).join(', ')})`);
  });

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB.');
}

testEndToEndNews().catch(console.error);
