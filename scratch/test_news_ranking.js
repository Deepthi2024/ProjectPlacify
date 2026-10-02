/**
 * Test Script: Personalized News Ranking Algorithm
 */

const { rankArticlesForUser } = require('../services/news/newsRanking');

const sampleArticles = [
  {
    title: 'New Open-Source PyTorch Model Released for Large-Scale AI & Machine Learning',
    description: 'A revolutionary deep learning framework built for Python data science pipelines.',
    category: 'AI',
    topics: ['Artificial Intelligence', 'Machine Learning', 'Python'],
    skills: ['Python', 'PyTorch', 'Machine Learning'],
    source: { name: 'TechCrunch' },
    publishedAt: new Date()
  },
  {
    title: 'React 19 Release: Major Frontend Performance Optimizations & Server Components',
    description: 'Deep dive into new React features, JavaScript bundlers, and Node.js backend integration.',
    category: 'WebDev',
    topics: ['Web Development', 'React', 'JavaScript'],
    skills: ['React', 'JavaScript', 'Node.js'],
    source: { name: 'Hacker News' },
    publishedAt: new Date()
  },
  {
    title: 'Critical Zero-Day Vulnerability Found in Linux Kernel & Cloud Firewalls',
    description: 'Security researchers advise immediate patching for network security and encryption protocols.',
    category: 'Cybersecurity',
    topics: ['Cybersecurity', 'Security'],
    skills: ['Security', 'Linux'],
    source: { name: 'Ars Technica' },
    publishedAt: new Date()
  }
];

function testPersonalizedRanking() {
  console.log('=== TEST: Personalized Ranking per Domain ===');

  // User 1: Data Science
  const dsUser = { chosen_domain: 'datascience', current_skill_level: 'INTERMEDIATE' };
  const dsRanked = rankArticlesForUser(sampleArticles, dsUser);
  console.log('\n📊 Top Article for Data Science User:');
  console.log(`Title: "${dsRanked[0].title}" (Category: ${dsRanked[0].category})`);

  // User 2: Web Development
  const webUser = { chosen_domain: 'webdev', current_skill_level: 'INTERMEDIATE' };
  const webRanked = rankArticlesForUser(sampleArticles, webUser);
  console.log('\n📊 Top Article for Web Development User:');
  console.log(`Title: "${webRanked[0].title}" (Category: ${webRanked[0].category})`);

  // User 3: Cybersecurity
  const secUser = { chosen_domain: 'cybersecurity', current_skill_level: 'ADVANCED' };
  const secRanked = rankArticlesForUser(sampleArticles, secUser);
  console.log('\n📊 Top Article for Cybersecurity User:');
  console.log(`Title: "${secRanked[0].title}" (Category: ${secRanked[0].category})`);

  // Verification Assertions
  const passDS = dsRanked[0].category === 'AI';
  const passWeb = webRanked[0].category === 'WebDev';
  const passSec = secRanked[0].category === 'Cybersecurity';

  if (passDS && passWeb && passSec) {
    console.log('\n✅ PASS: Personalized ranking correctly prioritizes domain-relevant news for each distinct user!');
  } else {
    console.error('\n❌ FAIL: Ranking mismatch detected.', { passDS, passWeb, passSec });
  }
}

testPersonalizedRanking();
