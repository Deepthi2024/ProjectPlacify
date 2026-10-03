/**
 * Internship Provider Adapter Layer
 * Provides abstraction over external job & internship APIs (Adzuna, Remotive, Arbeitnow, Jooble/JSearch).
 * Easily extensible to add new job/internship data providers.
 */

require('dotenv').config();
const https = require('https');
const http = require('http');
const { URL } = require('url');

/**
 * Helper function to perform HTTP/HTTPS GET requests with custom headers and timeout
 */
function fetchJson(urlStr, options = {}, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(urlStr);
      const transport = parsedUrl.protocol === 'https:' ? https : http;

      const reqOptions = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Placify-Internship-Aggregator/1.0',
          'Accept': 'application/json',
          ...(options.headers || {})
        }
      };

      const req = transport.request(reqOptions, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const data = JSON.parse(body);
              resolve(data);
            } catch (err) {
              reject(new Error(`JSON Parse Error: ${err.message}`));
            }
          } else {
            reject(new Error(`HTTP Error ${res.statusCode}: ${res.statusMessage}`));
          }
        });
      });

      req.on('error', (err) => reject(err));
      req.setTimeout(timeoutMs, () => {
        req.destroy();
        reject(new Error(`Request timeout after ${timeoutMs}ms`));
      });

      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Provider 1: Adzuna Jobs & Internships API
 */
async function fetchAdzunaInternships(queryKeywords, location = 'India', page = 1, limit = 20) {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    console.warn('[InternshipProvider] Adzuna credentials missing in .env');
    return [];
  }

  // Determine Adzuna country code (default 'in' for India, 'us' for US, 'gb' for UK, etc.)
  let countryCode = 'in';
  const locLower = String(location).toLowerCase();
  if (locLower.includes('us') || locLower.includes('united states') || locLower.includes('america')) {
    countryCode = 'us';
  } else if (locLower.includes('uk') || locLower.includes('united kingdom') || locLower.includes('britain')) {
    countryCode = 'gb';
  } else if (locLower.includes('canada')) {
    countryCode = 'ca';
  } else if (locLower.includes('australia')) {
    countryCode = 'au';
  }

  // Pick primary keyword string
  const primaryKeyword = Array.isArray(queryKeywords) ? queryKeywords[0] : (queryKeywords || 'Intern');

  const apiUrl = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/${page}?app_id=${encodeURIComponent(appId)}&app_key=${encodeURIComponent(appKey)}&what=${encodeURIComponent(primaryKeyword)}&results_per_page=${limit}&sort_by=date`;

  try {
    const data = await fetchJson(apiUrl);
    if (!data || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map(item => ({
      rawId: String(item.id || ''),
      title: item.title || '',
      company: item.company?.display_name || 'Organization Not Specified',
      location: item.location?.display_name || (countryCode === 'in' ? 'India' : 'Remote / Global'),
      workMode: (item.location?.display_name || item.title || '').toLowerCase().includes('remote') ? 'Remote' :
                (item.location?.display_name || item.title || '').toLowerCase().includes('hybrid') ? 'Hybrid' : 'On-site',
      description: item.description || '',
      stipend: (item.salary_min || item.salary_max)
        ? (countryCode === 'in' ? `₹${Math.round(item.salary_min || item.salary_max).toLocaleString('en-IN')}/year` : `$${Math.round(item.salary_min || item.salary_max).toLocaleString()}/year`)
        : 'Stipend / Salary Disclosed on Application',
      deadline: 'Open / Rolling Admissions',
      postedDate: item.created || new Date().toISOString(),
      source: 'Adzuna Jobs',
      applicationUrl: item.redirect_url || '',
      sourceUrl: item.redirect_url || ''
    }));
  } catch (err) {
    console.warn(`[InternshipProvider] Adzuna fetch failed for keyword "${primaryKeyword}":`, err.message);
    return [];
  }
}

/**
 * Provider 2: Remotive Remote Tech Jobs API (Public Free API)
 */
async function fetchRemotiveInternships(queryKeywords, limit = 15) {
  const keyword = Array.isArray(queryKeywords) ? queryKeywords.join(' ') : (queryKeywords || 'intern');
  const apiUrl = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(keyword)}&limit=${limit}`;

  try {
    const data = await fetchJson(apiUrl, {}, 6000);
    if (!data || !Array.isArray(data.jobs)) {
      return [];
    }

    return data.jobs.map(item => ({
      rawId: String(item.id || ''),
      title: item.title || '',
      company: item.company_name || 'Tech Company',
      location: item.candidate_required_location || 'Remote Worldwide',
      workMode: 'Remote',
      description: item.description ? item.description.replace(/<[^>]*>?/gm, '').substring(0, 300) + '...' : '',
      stipend: item.salary || 'Competitive Stipend / Disclosed on Application',
      deadline: 'Open / Rolling',
      postedDate: item.publication_date || new Date().toISOString(),
      source: 'Remotive Remote',
      applicationUrl: item.url || '',
      sourceUrl: item.url || ''
    }));
  } catch (err) {
    console.warn('[InternshipProvider] Remotive fetch notice:', err.message);
    return [];
  }
}

/**
 * Provider 3: Arbeitnow Public Tech Jobs API (Public Free API)
 */
async function fetchArbeitnowInternships(queryKeywords) {
  const apiUrl = `https://www.arbeitnow.com/api/job-board-api`;

  try {
    const data = await fetchJson(apiUrl, {}, 5000);
    if (!data || !Array.isArray(data.data)) {
      return [];
    }

    const keywordList = Array.isArray(queryKeywords)
      ? queryKeywords.map(k => k.toLowerCase())
      : [String(queryKeywords).toLowerCase()];

    // Filter jobs matching any keyword
    const filtered = data.data.filter(item => {
      const text = `${item.title || ''} ${item.description || ''} ${(item.tags || []).join(' ')}`.toLowerCase();
      return keywordList.some(kw => text.includes(kw) || text.includes('intern') || text.includes('trainee'));
    });

    return filtered.slice(0, 15).map(item => ({
      rawId: String(item.slug || item.url || Math.random()),
      title: item.title || '',
      company: item.company_name || 'Tech Firm',
      location: item.location || 'Remote / Hybrid',
      workMode: item.remote ? 'Remote' : 'On-site',
      description: item.description ? item.description.replace(/<[^>]*>?/gm, '').substring(0, 300) + '...' : '',
      stipend: 'Standard Industry Stipend',
      deadline: 'Open',
      postedDate: item.created_at ? new Date(item.created_at * 1000).toISOString() : new Date().toISOString(),
      source: 'Arbeitnow Tech',
      applicationUrl: item.url || '',
      sourceUrl: item.url || ''
    }));
  } catch (err) {
    console.warn('[InternshipProvider] Arbeitnow fetch notice:', err.message);
    return [];
  }
}

/**
 * Unified Provider Fetcher
 * Aggregates raw internship listings across configured providers
 */
async function fetchRawInternshipsFromProviders({ keywords, location, remote, page = 1, limit = 25 }) {
  const keywordArray = Array.isArray(keywords) ? keywords : [keywords];
  const allResults = [];

  // Execute Adzuna primary provider fetch for each keyword up to limit
  const adzunaPromises = [];
  for (const kw of keywordArray.slice(0, 2)) {
    adzunaPromises.push(fetchAdzunaInternships([kw], location, page, Math.ceil(limit / 2)));
  }

  // Also include Remotive public provider fetch
  const remotivePromise = fetchRemotiveInternships(keywordArray[0], Math.ceil(limit / 2));

  try {
    const results = await Promise.allSettled([...adzunaPromises, remotivePromise]);
    results.forEach(res => {
      if (res.status === 'fulfilled' && Array.isArray(res.value)) {
        allResults.push(...res.value);
      }
    });

    // If initial results are sparse (< 5), fallback to Arbeitnow or generic keyword fetch
    if (allResults.length < 5) {
      const fallbackResults = await fetchArbeitnowInternships(keywordArray).catch(() => []);
      allResults.push(...fallbackResults);
    }
  } catch (err) {
    console.error('[InternshipProvider] Error orchestrating provider queries:', err.message);
  }

  return allResults;
}

module.exports = {
  fetchAdzunaInternships,
  fetchRemotiveInternships,
  fetchArbeitnowInternships,
  fetchRawInternshipsFromProviders
};
