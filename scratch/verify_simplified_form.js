const fs = require('fs');

console.log('=== VERIFYING SIMPLIFIED EXTERNAL INTERVIEW RESOURCES FORM ===\n');

// 1. Verify HTML in frontend/index.html and index.html
['frontend/index.html', 'index.html'].forEach(file => {
  const html = fs.readFileSync(file, 'utf8');
  console.log(`Checking ${file}:`);

  const hasPhaseField = html.includes('id="interview-ext-phase-select"');
  const hasTopicField = html.includes('id="interview-ext-custom-topic"');
  const hasResourceType = html.includes('id="interview-ext-resource-type"');
  const hasExploreBtn = html.includes('id="interview-ext-fetch-resources-btn"');
  const hasCardsContainer = html.includes('id="interview-external-cards-container"');
  const hasHeading = html.includes('Explore Interview Resources');
  const hasGridClass = html.includes('class="interview-ext-filter-grid"');

  console.log('  1. Roadmap Phase / Day field removed:', !hasPhaseField ? 'PASS' : 'FAIL');
  console.log('  2. Specific Topic / Concept field removed:', !hasTopicField ? 'PASS' : 'FAIL');
  console.log('  3. Resource Type dropdown preserved:', hasResourceType ? 'PASS' : 'FAIL');
  console.log('  4. Explore Resources button preserved:', hasExploreBtn ? 'PASS' : 'FAIL');
  console.log('  5. Cards container preserved:', hasCardsContainer ? 'PASS' : 'FAIL');
  console.log('  6. Heading updated to "Explore Interview Resources":', hasHeading ? 'PASS' : 'FAIL');
  console.log('  7. Responsive grid container class present:', hasGridClass ? 'PASS' : 'FAIL');

  if (hasPhaseField || hasTopicField || !hasResourceType || !hasExploreBtn || !hasHeading || !hasGridClass) {
    throw new Error(`HTML check failed for ${file}`);
  }
});

// 2. Verify CSS in frontend/styles.css and styles.css
['frontend/styles.css', 'styles.css'].forEach(file => {
  const css = fs.readFileSync(file, 'utf8');
  console.log(`\nChecking ${file}:`);
  const hasGridRule = css.includes('.interview-ext-filter-grid');
  const hasMediaRule = css.includes('@media (max-width: 640px)') && css.includes('interview-ext-filter-grid');
  console.log('  1. .interview-ext-filter-grid defined:', hasGridRule ? 'PASS' : 'FAIL');
  console.log('  2. Mobile responsive media query defined:', hasMediaRule ? 'PASS' : 'FAIL');

  if (!hasGridRule || !hasMediaRule) {
    throw new Error(`CSS check failed for ${file}`);
  }
});

// 3. Verify JS in frontend/js/app.js and js/app.js
['frontend/js/app.js', 'js/app.js'].forEach(file => {
  const js = fs.readFileSync(file, 'utf8');
  console.log(`\nChecking ${file}:`);
  const hasPhaseRef = js.includes("document.getElementById('interview-ext-phase-select')");
  const hasTopicRef = js.includes("document.getElementById('interview-ext-custom-topic')");
  const hasResType = js.includes("document.getElementById('interview-ext-resource-type')");
  const hasFetchBtn = js.includes("document.getElementById('interview-ext-fetch-resources-btn')");
  const passesDomain = js.includes("domain=${encodeURIComponent(domainName)}");

  console.log('  1. No ext-phase-select queries:', !hasPhaseRef ? 'PASS' : 'FAIL');
  console.log('  2. No ext-custom-topic queries:', !hasTopicRef ? 'PASS' : 'FAIL');
  console.log('  3. Resource Type dropdown query exists:', hasResType ? 'PASS' : 'FAIL');
  console.log('  4. Explore Resources button query exists:', hasFetchBtn ? 'PASS' : 'FAIL');
  console.log('  5. Passes target domain to resource API:', passesDomain ? 'PASS' : 'FAIL');

  if (hasPhaseRef || hasTopicRef || !hasResType || !hasFetchBtn || !passesDomain) {
    throw new Error(`JS check failed for ${file}`);
  }
});

console.log('\n=== ALL STATIC CODE CHECKS PASSED ===\n');
