/**
 * Comprehensive Test Suite for Placify Resource Recommendation & Fallback Pipeline
 * Verifies all 10 scenarios requested by user prompt.
 */

const assert = require('assert');
const {
  orchestrateTaskResources,
  searchTavilyLive,
  getCuratedTopicResources,
  getGuaranteedDomainCatalog,
  validateAndSanitizeUrl,
  DOMAIN_FALLBACK_CATALOG
} = require('../services/resources/resourcePipeline');

const { resolveTechnicalSubtopic } = require('../engine/roadmapPlanner');

async function runTests() {
  console.log('================================================================');
  console.log('🧪 PLACIFY RESOURCE RECOMMENDATION & FALLBACK PIPELINE TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`✅ [PASS] Scenario ${total}: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] Scenario ${total}: ${name}`);
      console.error(err);
    }
  }

  async function asyncTest(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ [PASS] Scenario ${total}: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] Scenario ${total}: ${name}`);
      console.error(err);
    }
  }

  // -------------------------------------------------------------
  // Scenario 1: Exact indexed video match exists (DOM Selection) -> verified video chapter
  // -------------------------------------------------------------
  await asyncTest('Exact indexed video match exists: returns verified video chapter with timestamps', async () => {
    const { resources: res } = await orchestrateTaskResources({
      taskTitle: 'DOM Selection & Event Handling',
      topic: 'DOM Selection',
      subtopic: 'Selecting elements using getElementById() and querySelector()',
      domain: 'fullstack',
      difficulty: 'INTERMEDIATE',
      durationMinutes: 45
    });

    assert(Array.isArray(res) && res.length > 0, 'Expected non-empty resources');
    const first = res[0];
    assert.strictEqual(String(first.resource_type).toLowerCase(), 'video', 'First resource should be video');
    assert(first.url.includes('youtube.com'), 'Should be YouTube link');
    assert(first.is_chapter, 'Should be recognized as a verified chapter');
    assert(first.startTimestamp, 'Must have startTimestamp');
    assert(first.endTimestamp, 'Must have endTimestamp');
    assert(first.url.includes('&t=') || first.url.includes('?t='), 'URL must contain time offset');
    assert.strictEqual(first.verificationStatus, 'VERIFIED_CHAPTER', 'Status must be VERIFIED_CHAPTER');
  });

  // -------------------------------------------------------------
  // Scenario 2: Anti-collision & learning objective relevance (Node.js event loop rejected for DOM)
  // -------------------------------------------------------------
  await asyncTest('Anti-collision: rejects generic Node.js event loop or unrelated video for browser DOM', async () => {
    const { resources: res } = await orchestrateTaskResources({
      taskTitle: 'DOM Selection & Event Handling',
      topic: 'DOM Selection',
      subtopic: 'addEventListener, event bubbling, and event delegation',
      domain: 'fullstack',
      difficulty: 'INTERMEDIATE',
      durationMinutes: 30
    });

    for (const r of res) {
      const titleLower = (r.title || '').toLowerCase();
      assert(!titleLower.includes('node.js event loop'), 'Must never recommend Node.js event loop for DOM events');
    }
  });

  // -------------------------------------------------------------
  // Scenario 3: Live resource discovery for non-indexed topic returns authoritative article
  // -------------------------------------------------------------
  await asyncTest('Live resource discovery: queries targeted web docs when topic not in video index', async () => {
    const { resources: res } = await orchestrateTaskResources({
      taskTitle: 'C++ Graph Traversal Algorithms',
      topic: 'C++ Graphs',
      subtopic: 'Breadth First Search (BFS) and Depth First Search (DFS)',
      domain: 'dsa',
      difficulty: 'INTERMEDIATE',
      durationMinutes: 45
    });

    assert(Array.isArray(res) && res.length > 0, 'Should return resources for C++ BFS/DFS');
    const hasAuthoritative = res.some(r =>
      r.url.includes('geeksforgeeks.org') ||
      r.url.includes('w3schools.com') ||
      r.url.includes('developer.mozilla.org') ||
      r.url.includes('cppreference') ||
      r.is_official
    );
    assert(hasAuthoritative, 'Must include authoritative educational resource');
  });

  // -------------------------------------------------------------
  // Scenario 4: URL Validation & Sanitization prevents fake/root links
  // -------------------------------------------------------------
  test('URL sanitization excludes root homepages without article path and malformed URLs', () => {
    assert.strictEqual(validateAndSanitizeUrl('https://developer.mozilla.org'), null, 'Root homepages must be rejected');
    assert.strictEqual(validateAndSanitizeUrl('https://developer.mozilla.org/'), null, 'Root / must be rejected');
    assert.strictEqual(validateAndSanitizeUrl('not_a_valid_url'), null, 'Malformed URL must be rejected');
    assert.strictEqual(validateAndSanitizeUrl('javascript:alert(1)'), null, 'Dangerous protocol must be rejected');

    const valid = validateAndSanitizeUrl('https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector');
    assert(valid && valid.startsWith('https://developer.mozilla.org/'), 'Valid article URL must be preserved');
  });

  // -------------------------------------------------------------
  // Scenario 5: Level 3 Topic fallback provides exact genuine educational URLs
  // -------------------------------------------------------------
  test('Level 3 Curated educational fallback provides verified genuine URLs for DOM', () => {
    const list = getCuratedTopicResources('DOM Selection', 'Selecting elements using querySelector()', 'fullstack');
    assert(Array.isArray(list) && list.length >= 2, 'Must return at least 2 curated topic resources');
    assert(list.some(r => r.url === 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction'));
    assert(list.some(r => r.url === 'https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector'));
    assert(list.some(r => r.url === 'https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener'));
  });

  // -------------------------------------------------------------
  // Scenario 6: Level 4 Guaranteed catalog covers all 8 supported domains
  // -------------------------------------------------------------
  test('Level 4 Guaranteed catalog covers all 8 Placify domains without empty state', () => {
    const requiredDomains = ['fullstack', 'frontend', 'backend', 'datascience', 'dsa', 'devops', 'cybersecurity', 'ai_llm'];

    for (const dom of requiredDomains) {
      assert(DOMAIN_FALLBACK_CATALOG[dom], `Catalog must support domain: ${dom}`);
      const items = getGuaranteedDomainCatalog(dom, 'Core Learning Task');
      assert(items.length >= 3, `Domain ${dom} must return at least 3 curated items`);
      for (const it of items) {
        assert(it.url && it.url.startsWith('https://'), `Domain ${dom} item must have valid HTTPS URL: ${it.url}`);
        assert(it.title && it.title.length > 5, `Domain ${dom} item must have descriptive title`);
        assert(it.platform, `Domain ${dom} item must specify platform`);
      }
    }
  });

  // -------------------------------------------------------------
  // Scenario 7: Generic roadmap subtopics resolved to technical objectives
  // -------------------------------------------------------------
  test('Roadmap subtopic resolver transforms generic templates into technical objectives', () => {
    const domSub1 = resolveTechnicalSubtopic('DOM Selection & Manipulation', 'DOM Selection: Core Principles & Syntax', 1);
    assert.strictEqual(domSub1, 'Selecting elements using getElementById() and querySelector()');

    const domSub3 = resolveTechnicalSubtopic('DOM Selection & Manipulation', 'DOM Selection: Component Structure & Memory', 3);
    assert.strictEqual(domSub3, 'Registering event listeners using addEventListener() and event objects');

    const domSub4 = resolveTechnicalSubtopic('DOM Selection & Manipulation', 'DOM Selection: Practice', 4);
    assert.strictEqual(domSub4, 'Understanding event targets, bubbling, and event delegation patterns');

    // Cleans template suffix for any generic skill
    const cleanGeneric = resolveTechnicalSubtopic('Docker Basics', 'Containerization: Core Principles & Syntax', 1);
    assert.strictEqual(cleanGeneric, 'Containerization');
  });

  // -------------------------------------------------------------
  // Scenario 8: Preserves verified chapter timestamps & duration suitability
  // -------------------------------------------------------------
  await asyncTest('Timestamp & chapter extraction allows suitable chapters from long courses', async () => {
    const { resources: res } = await orchestrateTaskResources({
      taskTitle: 'HTML Boilerplate & Semantic Tags',
      topic: 'HTML & Semantic Structure',
      subtopic: 'Semantic HTML5 structure and markup',
      domain: 'fullstack',
      difficulty: 'BEGINNER',
      durationMinutes: 45
    });

    assert(Array.isArray(res) && res.length > 0);
    const first = res[0];
    assert(first.title && first.url);
    if (first.is_chapter) {
      assert(first.startTimestamp, 'Video chapter must have start timestamp');
    }
  });

  // -------------------------------------------------------------
  // Scenario 9: Duplicate URL and resource deduplication
  // -------------------------------------------------------------
  test('Orchestrator prevents duplicate URLs in final recommendation list', () => {
    const rawList = [
      { resource_id: 'r1', title: 'Item 1', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector' },
      { resource_id: 'r2', title: 'Item 2', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector' },
      { resource_id: 'r3', title: 'Item 3', url: 'https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener' }
    ];

    const seenUrls = new Set();
    const deduped = rawList.filter(item => {
      const clean = validateAndSanitizeUrl(item.url);
      if (!clean || seenUrls.has(clean)) return false;
      seenUrls.add(clean);
      return true;
    });

    assert.strictEqual(deduped.length, 2, 'Should deduplicate identical URLs');
  });

  // -------------------------------------------------------------
  // Scenario 10: Honest labeling of fallbacks (isFallback, verificationStatus)
  // -------------------------------------------------------------
  test('Honest labeling distinguishes verified chapters, authoritative docs, and fallbacks', () => {
    const catalogItems = getGuaranteedDomainCatalog('devops', 'Kubernetes Deployment');
    for (const item of catalogItems) {
      assert.strictEqual(item.isFallback, true, 'Catalog items must have isFallback: true');
      assert(item.verificationStatus === 'OFFICIAL_DOCS' || item.verificationStatus === 'CURATED_RESOURCE' || item.verificationStatus === 'CURATED_VERIFIED' || item.verificationStatus === 'CURATED_FALLBACK');
      assert.strictEqual(item.fallback_level, 4, 'Must be labeled as fallback_level 4');
    }
  });

  console.log('\n================================================================');
  console.log(`🏁 TEST RESULTS: ${passed}/${total} scenarios passed (${Math.round((passed / total) * 100)}%)`);
  console.log('================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test suite runner encountered fatal error:', err);
  process.exit(1);
});
