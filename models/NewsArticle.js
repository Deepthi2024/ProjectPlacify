const mongoose = require('mongoose');

const newsArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    summary: { type: String, default: '' },
    url: { type: String, required: true, unique: true, trim: true },
    imageUrl: { type: String, default: '' },
    source: {
      name: { type: String, default: 'Tech News' }
    },
    author: { type: String, default: '' },
    publishedAt: { type: Date, default: Date.now, index: true },
    category: { type: String, default: 'General Tech' },
    topics: [{ type: String }],
    skills: [{ type: String }],
    sourceType: { type: String, required: true }, // 'newsapi' | 'hackernews'
    sourceId: { type: String, default: '' },
    fetchedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true, index: true }
  },
  {
    timestamps: true
  }
);

// Compound index for source lookup and deduplication
newsArticleSchema.index({ sourceType: 1, sourceId: 1 });
newsArticleSchema.index({ publishedAt: -1, isActive: 1 });

const NewsArticle = mongoose.models.NewsArticle || mongoose.model('NewsArticle', newsArticleSchema, 'news_articles');

module.exports = NewsArticle;
