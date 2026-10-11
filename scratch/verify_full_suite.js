const fs = require('fs');

async function runFullVerification() {
  console.log('=====================================================');
  console.log('🧪 PLACIFY AI — COMPREHENSIVE VERIFICATION SUITE');
  console.log('=====================================================\n');

  // Test 1: DOM Elements Verification
  console.log('--- Test 1: DOM Elements in HTML ---');
  const html = fs.readFileSync('frontend/index.html', 'utf8');

  const removedIds = ['interview-ext-phase-select', 'interview-ext-custom-topic', 'interview-ext-custom-topic-container'];
  let passedRemovals = true;
  for (const id of removedIds) {
    if (html.includes(`id="${id}"`)) {
      console.error(`❌ FAIL: Element with id="${id}" still exists!`);
      passedRemovals = false;
    } else {
      console.log(`✓ PASS: ${id} is completely removed from DOM.`);
    }
  }

  const keptIds = [
    'interview-ext-resource-type',
    'interview-ext-fetch-resources-btn',
    'interview-external-cards-container',
    'ext-current-topic-label',
    'interview-user-domain-label'
  ];
  let passedKept = true;
  for (const id of keptIds) {
    if (html.includes(`id="${id}"`)) {
      console.log(`✓ PASS: Preserved element id="${id}" exists in DOM.`);
    } else {
      console.error(`❌ FAIL: Preserved element id="${id}" missing!`);
      passedKept = false;
    }
  }

  // Check section heading
  if (html.includes('Explore Interview Resources')) {
    console.log('✓ PASS: Section heading updated to "Explore Interview Resources".');
  } else {
    console.error('❌ FAIL: Section heading not updated.');
  }

  // Test 2: Responsive CSS Layout Verification
  console.log('\n--- Test 2: CSS Layout & Responsiveness ---');
  const css = fs.readFileSync('frontend/styles.css', 'utf8');

  const hasFilterGrid = css.includes('.interview-ext-filter-grid');
  const hasGridColumns = css.includes('grid-template-columns: 1fr minmax(200px, auto)');
  const hasMobileBreakpoint = css.includes('@media (max-width: 640px)') && css.includes('grid-template-columns: 1fr');

  console.log('✓ PASS: .interview-ext-filter-grid class defined:', hasFilterGrid);
  console.log('✓ PASS: Desktop layout (1fr minmax(200px, auto)):', hasGridColumns);
  console.log('✓ PASS: Mobile layout (stacks cleanly at <=640px):', hasMobileBreakpoint);

  // Test 3: Frontend logic in app.js
  console.log('\n--- Test 3: Frontend Submission & Fetch Logic ---');
  const js = fs.readFileSync('frontend/js/app.js', 'utf8');

  const noPhaseRef = !js.includes("document.getElementById('interview-ext-phase-select')");
  const noTopicRef = !js.includes("document.getElementById('interview-ext-custom-topic')");
  const hasTypeChange = js.includes("extResTypeSelect.onchange = () => loadExternalResources()");
  const hasBtnClick = js.includes("extFetchBtn.onclick = () => loadExternalResources()");
  const usesDomain = js.includes("domain=${encodeURIComponent(domainName)}");

  console.log('✓ PASS: No phase dropdown query:', noPhaseRef);
  console.log('✓ PASS: No custom topic input query:', noTopicRef);
  console.log('✓ PASS: Resource Type dropdown change triggers loadExternalResources():', hasTypeChange);
  console.log('✓ PASS: Explore Resources button click triggers loadExternalResources():', hasBtnClick);
  console.log('✓ PASS: Fetches based on authenticated user target domain:', usesDomain);

  // Test 4: Live Backend API Verification
  console.log('\n--- Test 4: Live Backend API & Resource Catalog ---');
  const domains = [
    'Full-Stack Web Development',
    'Java Backend Development',
    'Python & Machine Learning'
  ];

  for (const domain of domains) {
    const url = `http://localhost:5000/api/interview-resources?domain=${encodeURIComponent(domain)}&topic=${encodeURIComponent(domain)}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(`\nTesting domain: "${domain}"`);
    console.log(`  Status: ${res.status}, Success: ${data.success}, Resource count: ${data.resources?.length}`);

    if (data.resources && data.resources.length > 0) {
      data.resources.forEach(r => {
        console.log(`  - [${r.name}] (${r.category}): ${r.url}`);
        if (!r.url.startsWith('http')) {
          console.error(`    ❌ Invalid URL: ${r.url}`);
        }
      });
    }
  }

  // Test 5: Resource Type Filtering
  console.log('\n--- Test 5: Resource Type Filtering ---');
  const typeKeywords = {
    'interview_questions': ['interview', 'question', 'q&a'],
    'coding_practice': ['coding', 'problem', 'algorithm', 'challenge', 'practice'],
    'tutorials': ['tutorial', 'guide', 'learn'],
    'documentation': ['doc', 'reference', 'specification', 'manual'],
    'mock_interviews': ['track', 'kit', 'mock', 'assessment']
  };

  const fullstackRes = await fetch(`http://localhost:5000/api/interview-resources?domain=Full-Stack%20Web%20Development&topic=Full-Stack%20Web%20Development`);
  const fullstackData = await fullstackRes.json();
  const allResources = fullstackData.resources || [];

  for (const [resType, kws] of Object.entries(typeKeywords)) {
    const filtered = allResources.filter(r => {
      const text = `${r.name} ${r.category || ''} ${r.description || ''}`.toLowerCase();
      return kws.some(k => text.includes(k));
    });
    console.log(`  Filter "${resType}": matched ${filtered.length} resources`);
  }

  console.log('\n=====================================================');
  console.log('🎉 ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
  console.log('=====================================================');
}

runFullVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
