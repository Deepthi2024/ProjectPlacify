/**
 * News Ranking Service - Computes personalized relevance scores for news articles based on user profile, domain, skills, and roadmap.
 */

// Domain keyword mappings for domain relevance calculation
const DOMAIN_KEYWORD_MAP = {
  datascience: ['data science', 'artificial intelligence', 'machine learning', 'data analytics', 'llms', 'generative ai', 'python', 'sql', 'pandas', 'deep learning', 'ai', 'big data', 'nlp'],
  ai_ml: ['artificial intelligence', 'machine learning', 'deep learning', 'llms', 'generative ai', 'python', 'pytorch', 'tensorflow', 'neural', 'ai', 'nlp'],
  webdev: ['web development', 'react', 'javascript', 'node.js', 'frontend', 'backend', 'fullstack', 'css', 'html', 'typescript', 'express', 'next.js', 'web'],
  fullstack: ['web development', 'react', 'javascript', 'node.js', 'frontend', 'backend', 'fullstack', 'sql', 'mongodb', 'rest api', 'express', 'typescript'],
  cybersecurity: ['cybersecurity', 'security', 'encryption', 'ethical hacking', 'network security', 'vulnerabilities', 'malware', 'zero-trust', 'breach', 'firewall'],
  cloud_devops: ['cloud computing', 'devops', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'infrastructure', 'ci/cd', 'microservices', 'linux', 'serverless'],
  dsa: ['algorithms', 'data structures', 'computer science', 'c++', 'java', 'programming', 'coding', 'problem solving', 'system design']
};

/**
 * Calculates domain relevance score (0.0 to 1.0)
 */
function calculateDomainScore(article, domainKey) {
  const normalizedDomain = (domainKey || 'fullstack').toLowerCase().trim();
  const domainKeywords = DOMAIN_KEYWORD_MAP[normalizedDomain] || DOMAIN_KEYWORD_MAP['fullstack'];

  const articleText = `${article.title || ''} ${article.description || ''} ${article.category || ''} ${(article.topics || []).join(' ')}`.toLowerCase();

  let matches = 0;
  for (const kw of domainKeywords) {
    if (articleText.includes(kw)) {
      matches++;
    }
  }

  if (matches >= 3) return 1.0;
  if (matches === 2) return 0.8;
  if (matches === 1) return 0.5;
  return 0.2; // Baseline minimum for general tech
}

/**
 * Calculates skill relevance score (0.0 to 1.0)
 */
function calculateSkillScore(article, userSkills, userGaps) {
  const articleSkills = (article.skills || []).map(s => s.toLowerCase());
  const articleText = `${article.title || ''} ${article.description || ''}`.toLowerCase();

  if (articleSkills.length === 0 && (!userSkills || userSkills.length === 0)) {
    return 0.5;
  }

  const allUserSkills = (userSkills || []).map(s => s.toLowerCase());
  const allUserGaps = (userGaps || []).map(g => g.toLowerCase());

  let score = 0.2;

  // Gap matching gets high priority (user needs learning!)
  for (const gap of allUserGaps) {
    if (articleSkills.includes(gap) || articleText.includes(gap)) {
      score += 0.4;
      break;
    }
  }

  // Active skill matching
  for (const skill of allUserSkills) {
    if (articleSkills.includes(skill) || articleText.includes(skill)) {
      score += 0.3;
      break;
    }
  }

  return Math.min(score, 1.0);
}

/**
 * Calculates level relevance score (0.0 to 1.0)
 */
function calculateLevelScore(article, userLevel) {
  const level = (userLevel || 'BEGINNER').toUpperCase();
  const text = `${article.title || ''} ${article.description || ''}`.toLowerCase();

  if (level === 'BEGINNER') {
    if (text.includes('intro') || text.includes('guide') || text.includes('beginner') || text.includes('basics') || text.includes('getting started')) {
      return 1.0;
    }
    return 0.7;
  } else if (level === 'INTERMEDIATE') {
    if (text.includes('framework') || text.includes('release') || text.includes('practice') || text.includes('update') || text.includes('tools')) {
      return 1.0;
    }
    return 0.8;
  } else if (level === 'ADVANCED') {
    if (text.includes('architecture') || text.includes('performance') || text.includes('scaling') || text.includes('research') || text.includes('deep dive')) {
      return 1.0;
    }
    return 0.8;
  }

  return 0.7;
}

/**
 * Calculates freshness score (0.0 to 1.0)
 */
function calculateFreshnessScore(publishedAt) {
  if (!publishedAt) return 0.5;

  const publishedDate = new Date(publishedAt);
  const now = new Date();
  const diffHours = Math.max(0, (now - publishedDate) / (1000 * 60 * 60));

  if (diffHours <= 6) return 1.0;
  if (diffHours <= 24) return 0.85;
  if (diffHours <= 72) return 0.7;
  if (diffHours <= 168) return 0.5;
  return 0.3;
}

/**
 * Calculates source quality score (0.0 to 1.0)
 */
function calculateSourceScore(sourceName) {
  const source = (sourceName || '').toLowerCase();
  const topSources = ['hacker news', 'techcrunch', 'wired', 'ars technica', 'mit technology review', 'github', 'dev.to', 'the verge', 'infoq'];
  if (topSources.some(s => source.includes(s))) {
    return 1.0;
  }
  return 0.8;
}

/**
 * Ranks an array of articles for a user profile
 */
function rankArticlesForUser(articles, userProfile = {}, skillProfile = {}, roadmapData = {}) {
  // Sort all tech-related news chronologically by publishedAt date without domain bias
  const sorted = [...articles];
  sorted.sort((a, b) => {
    const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return timeB - timeA;
  });
  return sorted;
}

module.exports = {
  rankArticlesForUser,
  calculateDomainScore,
  calculateSkillScore,
  calculateFreshnessScore
};
