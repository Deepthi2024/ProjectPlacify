/**
 * Internship Service Layer
 * Handles domain-to-keyword translation, personalization, provider querying,
 * data normalization, de-duplication, expired listing filtering, and HTTPS validation.
 */

const { fetchRawInternshipsFromProviders } = require('./internshipProvider');

/**
 * Domain-to-Keywords Mapping Engine
 */
const DOMAIN_KEYWORD_MAP = {
  datascience: [
    "Data Science Intern",
    "Data Analyst Intern",
    "Machine Learning Intern",
    "Python Intern",
    "AI ML Intern"
  ],
  ai_llm: [
    "AI Intern",
    "Machine Learning Intern",
    "Deep Learning Intern",
    "Artificial Intelligence Intern",
    "GenAI Intern"
  ],
  cybersecurity: [
    "Cybersecurity Intern",
    "Information Security Intern",
    "SOC Intern",
    "Cyber Security Analyst Intern",
    "Ethical Hacking Intern"
  ],
  fullstack: [
    "Web Development Intern",
    "Frontend Developer Intern",
    "Backend Developer Intern",
    "Full Stack Developer Intern",
    "React Developer Intern"
  ],
  dsa: [
    "Software Developer Intern",
    "Software Engineering Intern",
    "SDE Intern",
    "Java Intern",
    "C++ Intern"
  ],
  data_analytics: [
    "Data Analyst Intern",
    "Business Intelligence Intern",
    "Data Analytics Intern",
    "SQL Analyst Intern"
  ],
  devops: [
    "Cloud Intern",
    "DevOps Intern",
    "AWS Cloud Intern",
    "Cloud Infrastructure Intern",
    "Kubernetes Intern"
  ],
  cloud: [
    "Cloud Computing Intern",
    "AWS Intern",
    "Cloud Engineer Intern",
    "DevOps Intern"
  ],
  mobile: [
    "Android Developer Intern",
    "Mobile App Developer Intern",
    "Flutter Intern",
    "React Native Intern",
    "iOS Intern"
  ],
  android: [
    "Android Developer Intern",
    "Mobile Application Intern",
    "Java Android Intern",
    "Kotlin Intern"
  ],
  system_design: [
    "Software Architect Intern",
    "Backend Engineer Intern",
    "System Software Intern"
  ]
};

/**
 * Convert selected domain into relevant search keywords
 */
function getKeywordsForDomain(rawDomain) {
  if (!rawDomain) return ["Software Engineer Intern", "Tech Intern"];

  const domainClean = String(rawDomain).toLowerCase().trim();

  // Check direct key match
  if (DOMAIN_KEYWORD_MAP[domainClean]) {
    return DOMAIN_KEYWORD_MAP[domainClean];
  }

  // Check string inclusion
  if (domainClean.includes('data science')) return DOMAIN_KEYWORD_MAP.datascience;
  if (domainClean.includes('ai') || domainClean.includes('machine learning') || domainClean.includes('artificial intelligence')) return DOMAIN_KEYWORD_MAP.ai_llm;
  if (domainClean.includes('cyber') || domainClean.includes('security') || domainClean.includes('hacking')) return DOMAIN_KEYWORD_MAP.cybersecurity;
  if (domainClean.includes('web') || domainClean.includes('fullstack') || domainClean.includes('full stack') || domainClean.includes('frontend') || domainClean.includes('backend')) return DOMAIN_KEYWORD_MAP.fullstack;
  if (domainClean.includes('software') || domainClean.includes('dsa') || domainClean.includes('algorithm')) return DOMAIN_KEYWORD_MAP.dsa;
  if (domainClean.includes('analytics') || domainClean.includes('analyst')) return DOMAIN_KEYWORD_MAP.data_analytics;
  if (domainClean.includes('cloud') || domainClean.includes('aws') || domainClean.includes('devops')) return DOMAIN_KEYWORD_MAP.devops;
  if (domainClean.includes('android') || domainClean.includes('mobile') || domainClean.includes('flutter') || domainClean.includes('ios')) return DOMAIN_KEYWORD_MAP.mobile;

  // Generic fallback for custom domains
  const cleanTitle = rawDomain.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return [
    `${cleanTitle} Intern`,
    `${cleanTitle} Developer Intern`,
    `${cleanTitle} Analyst Intern`
  ];
}

/**
 * Common skill keywords list for automatic skill tag extraction
 */
const KNOWN_SKILLS = [
  "Python", "SQL", "Pandas", "NumPy", "Scikit-Learn", "PyTorch", "TensorFlow", "Machine Learning", "Deep Learning", "AI",
  "JavaScript", "TypeScript", "React", "Node.js", "Express", "HTML", "CSS", "REST API", "GraphQL", "MongoDB", "PostgreSQL", "MySQL",
  "Java", "C++", "C#", "Data Structures", "Algorithms", "OOP", "Git", "GitHub",
  "Linux", "Docker", "Kubernetes", "AWS", "Azure", "Cloud", "DevOps", "CI/CD",
  "Android", "Kotlin", "Flutter", "React Native", "Swift", "iOS",
  "Cybersecurity", "Network Security", "Ethical Hacking", "SOC", "Penetration Testing", "Wireshark",
  "Tableau", "Power BI", "Excel", "Data Analysis", "Statistics"
];

/**
 * Extract matched skill tags from job title & description
 */
function extractSkillTags(title, description, userSkills = []) {
  const combinedText = `${title || ''} ${description || ''}`.toLowerCase();
  const matched = new Set();

  // Include matching user skills first if mentioned
  if (Array.isArray(userSkills)) {
    userSkills.forEach(skill => {
      if (skill && combinedText.includes(String(skill).toLowerCase())) {
        matched.add(skill);
      }
    });
  }

  // Extract from known skills list
  KNOWN_SKILLS.forEach(skill => {
    if (combinedText.includes(skill.toLowerCase())) {
      matched.add(skill);
    }
  });

  return Array.from(matched).slice(0, 6);
}

/**
 * Validate and sanitize application URL
 */
function sanitizeApplicationUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;

  let clean = rawUrl.trim();
  if (clean.startsWith('http://')) {
    clean = 'https://' + clean.substring(7);
  }

  if (!clean.startsWith('https://')) {
    return null;
  }

  try {
    const parsed = new URL(clean);
    // Block suspicious or javascript: schemes
    if (parsed.protocol !== 'https:') return null;
    return clean;
  } catch (err) {
    return null;
  }
}

/**
 * Filter out expired/closed listings
 */
function isListingExpired(listing) {
  if (!listing) return true;

  // Check explicit status flags
  if (listing.closed === true || listing.expired === true) return true;

  // Check deadline date if present
  if (listing.deadline && listing.deadline !== 'Open / Rolling' && listing.deadline !== 'Open / Rolling Admissions') {
    const d = new Date(listing.deadline);
    if (!isNaN(d.getTime()) && d < new Date()) {
      return true;
    }
  }

  return false;
}

/**
 * Remove duplicate listings based on ID, URL, or Title + Company
 */
function deduplicateListings(listings) {
  const seenIds = new Set();
  const seenUrls = new Set();
  const seenTitleCompany = new Set();

  return listings.filter(item => {
    if (!item) return false;

    // Check rawId / id
    if (item.id && seenIds.has(item.id)) return false;

    // Check application URL
    if (item.applicationUrl && seenUrls.has(item.applicationUrl)) return false;

    // Check title + company key
    const key = `${(item.title || '').toLowerCase().trim()}::${(item.company || '').toLowerCase().trim()}`;
    if (seenTitleCompany.has(key)) return false;

    if (item.id) seenIds.add(item.id);
    if (item.applicationUrl) seenUrls.add(item.applicationUrl);
    seenTitleCompany.add(key);

    return true;
  });
}

/**
 * Main Service Function to get personalized internship recommendations
 */
async function getRecommendedInternships({
  domain = 'fullstack',
  skills = [],
  location = 'India',
  remote = false,
  page = 1,
  limit = 20,
  customKeywords = ''
}) {
  // 1. Determine search keywords based on domain and custom keywords
  let searchKeywords = [];
  if (customKeywords && customKeywords.trim()) {
    searchKeywords = [customKeywords.trim(), ...getKeywordsForDomain(domain)];
  } else {
    searchKeywords = getKeywordsForDomain(domain);
  }

  // 2. Fetch raw items from provider adapter
  const rawListings = await fetchRawInternshipsFromProviders({
    keywords: searchKeywords,
    location,
    remote,
    page: Number(page) || 1,
    limit: Number(limit) || 20
  });

  if (!Array.isArray(rawListings) || rawListings.length === 0) {
    return {
      success: true,
      total: 0,
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      domain,
      searchKeywords,
      internships: [],
      message: "No relevant internships found for your current domain. Try updating your skills or search preferences."
    };
  }

  // 3. Normalize, sanitize URLs, and attach skills
  const normalized = rawListings.map((raw, idx) => {
    const validUrl = sanitizeApplicationUrl(raw.applicationUrl || raw.sourceUrl);
    if (!validUrl) return null;

    const titleClean = (raw.title || 'Internship Opportunity').replace(/<[^>]*>?/gm, '').trim();
    const companyClean = (raw.company || 'Organization').replace(/<[^>]*>?/gm, '').trim();
    const descClean = (raw.description || '').replace(/<[^>]*>?/gm, '').trim();

    const extractedSkills = extractSkillTags(titleClean, descClean, skills);

    return {
      id: raw.rawId ? `internship_${raw.rawId}` : `internship_${idx}_${Date.now()}`,
      title: titleClean,
      company: companyClean,
      location: raw.location || (remote ? 'Remote' : 'India'),
      workMode: raw.workMode || (remote ? 'Remote' : 'Hybrid / On-site'),
      description: descClean.length > 280 ? descClean.substring(0, 280) + '...' : descClean,
      skills: extractedSkills.length > 0 ? extractedSkills : [domain],
      stipend: raw.stipend || 'Competitive Stipend / Market Standard',
      deadline: raw.deadline || 'Open / Rolling Admissions',
      postedDate: raw.postedDate || new Date().toISOString(),
      source: raw.source || 'Placify Jobs Partner',
      applicationUrl: validUrl,
      sourceUrl: validUrl
    };
  }).filter(item => item !== null);

  // 4. Exclude expired listings
  const activeListings = normalized.filter(item => !isListingExpired(item));

  // 5. Remove duplicates
  const uniqueListings = deduplicateListings(activeListings);

  // 6. Calculate pagination slice
  const startIndex = (page - 1) * limit;
  const paginatedListings = uniqueListings.slice(startIndex, startIndex + limit);

  return {
    success: true,
    total: uniqueListings.length,
    page: Number(page) || 1,
    limit: Number(limit) || 20,
    domain,
    searchKeywords,
    internships: paginatedListings
  };
}

module.exports = {
  getKeywordsForDomain,
  extractSkillTags,
  sanitizeApplicationUrl,
  isListingExpired,
  deduplicateListings,
  getRecommendedInternships
};
