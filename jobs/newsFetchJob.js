/**
 * News Fetch Job - Idempotent background job to trigger news aggregation periodically.
 */

const NewsArticle = require('../models/NewsArticle');
const { aggregateAndStoreNews } = require('../services/news/newsAggregator');

let jobTimer = null;
let isRunning = false;

const INTERVAL_MINUTES = 25;
const INTERVAL_MS = INTERVAL_MINUTES * 60 * 1000;

async function executeNewsFetch() {
  if (isRunning) {
    console.log('⏳ [NewsFetchJob] News fetch already in progress, skipping turn.');
    return;
  }

  isRunning = true;
  try {
    console.log(`⏰ [NewsFetchJob] Triggering news fetch at ${new Date().toISOString()}`);
    await aggregateAndStoreNews();
  } catch (err) {
    console.error('❌ [NewsFetchJob] Background fetch error:', err.message);
  } finally {
    isRunning = false;
  }
}

async function startNewsFetchJob() {
  if (jobTimer) {
    console.log('ℹ️ [NewsFetchJob] Job is already running.');
    return;
  }

  console.log(`🚀 [NewsFetchJob] Starting background scheduler (Interval: ${INTERVAL_MINUTES} mins).`);

  // Initial check: if database is empty or latest article is older than 25 mins, run fetch immediately
  try {
    const latestArticle = await NewsArticle.findOne({ isActive: true }).sort({ fetchedAt: -1 });
    if (!latestArticle || (Date.now() - new Date(latestArticle.fetchedAt).getTime()) > INTERVAL_MS) {
      console.log('📰 [NewsFetchJob] News cache is empty or stale. Executing immediate initial fetch...');
      executeNewsFetch();
    } else {
      console.log(`📰 [NewsFetchJob] Existing news cache is fresh (Latest fetch: ${latestArticle.fetchedAt.toISOString()}).`);
    }
  } catch (err) {
    console.warn('⚠️ [NewsFetchJob] Error checking news cache status:', err.message);
  }

  // Set recurring interval
  jobTimer = setInterval(() => {
    executeNewsFetch();
  }, INTERVAL_MS);
}

function stopNewsFetchJob() {
  if (jobTimer) {
    clearInterval(jobTimer);
    jobTimer = null;
    console.log('🛑 [NewsFetchJob] Background scheduler stopped.');
  }
}

module.exports = {
  startNewsFetchJob,
  stopNewsFetchJob,
  executeNewsFetch
};
