const fs = require('fs');

console.log('=== COMPREHENSIVE GUIDED TOUR VERIFICATION ===\n');

// 1. Check HTML for popover elements
['frontend/index.html', 'index.html'].forEach(file => {
  const html = fs.readFileSync(file, 'utf8');
  console.log(`Checking ${file}:`);

  const requiredIds = [
    'placify-tour-container',
    'placify-tour-backdrop',
    'placify-tour-spotlight',
    'placify-tour-popover',
    'tour-step-badge',
    'tour-step-view-tag',
    'tour-step-title',
    'tour-step-what-is-this',
    'tour-step-what-to-do',
    'tour-step-what-next',
    'tour-prev-btn',
    'tour-next-btn',
    'tour-skip-btn',
    'tour-skip-x-btn',
    'roadmap-profile-summary-bar'
  ];

  for (const id of requiredIds) {
    const found = html.includes(`id="${id}"`);
    console.log(`  - Element id="${id}": ${found ? 'PASS' : 'FAIL'}`);
    if (!found) throw new Error(`Missing ${id} in ${file}`);
  }
});

// 2. Check CSS rules in styles.css and frontend/styles.css
['frontend/styles.css', 'styles.css'].forEach(file => {
  const css = fs.readFileSync(file, 'utf8');
  console.log(`\nChecking ${file}:`);

  const requiredRules = [
    '.placify-tour-highlighted-element',
    '.placify-tour-popover',
    '.tour-qa-block',
    '.tour-qa-label',
    '.tour-qa-text'
  ];

  for (const rule of requiredRules) {
    const found = css.includes(rule);
    console.log(`  - CSS rule ${rule}: ${found ? 'PASS' : 'FAIL'}`);
    if (!found) throw new Error(`Missing ${rule} in ${file}`);
  }
});

// 3. Check Tour Engine in frontend/js/app.js
['frontend/js/app.js', 'js/app.js'].forEach(file => {
  const js = fs.readFileSync(file, 'utf8');
  console.log(`\nChecking ${file}:`);

  const requiredSnippets = [
    'AUTH_TOUR_STEPS = [',
    "view: 'roadmap'",
    "view: 'dailyHub'",
    "view: 'interviewQuestions'",
    "view: 'techNews'",
    "view: 'progressAnalytics'",
    "view: 'internships'",
    "view: 'myApplications'",
    'whatIsThis',
    'whatToDo',
    'whatNext',
    'navigateToTourView',
    'positionSpotlightAndPopover',
    'startGuidedTour',
    'endGuidedTour',
    'renderTourStep'
  ];

  for (const snip of requiredSnippets) {
    const found = js.includes(snip);
    console.log(`  - JS snippet "${snip}": ${found ? 'PASS' : 'FAIL'}`);
    if (!found) throw new Error(`Missing ${snip} in ${file}`);
  }
});

// 4. Verify the 12 steps content & order in AUTH_TOUR_STEPS
const jsContent = fs.readFileSync('frontend/js/app.js', 'utf8');
const match = jsContent.match(/const AUTH_TOUR_STEPS = (\[[\s\S]*?\]);/);
if (!match) throw new Error('Could not find AUTH_TOUR_STEPS in app.js');

// Parse the steps array by evaluating safely in sandbox
const vm = require('vm');
const steps = vm.runInNewContext(match[1]);

console.log(`\nVerified AUTH_TOUR_STEPS count: ${steps.length} steps`);
const expectedOrder = [
  { view: 'roadmap', title: 'Roadmap Overview' },
  { view: 'roadmap', title: 'Domain & Proficiency Profile' },
  { view: 'roadmap', title: 'Roadmap Hierarchy & Views' },
  { view: 'roadmap', title: 'Phase Cards & Objectives' },
  { view: 'roadmap', title: 'Start Journey & Enter Daily Hub' },
  { view: 'dailyHub', title: 'Daily Hub & Task Execution' },
  { view: 'interviewQuestions', title: 'Interview Preparation Studio' },
  { view: 'techNews', title: 'Real-Time Tech News Feed' },
  { view: 'progressAnalytics', title: 'Mastery & Progress Analytics' },
  { view: 'internships', title: 'Curated Internship Opportunities' },
  { view: 'myApplications', title: 'My Applications Tracker' },
  { view: null, title: 'Placify AI Assistant' }
];

steps.forEach((s, i) => {
  console.log(`  Step ${i + 1}: [${s.view || 'Global'}] "${s.title}"`);
  console.log(`    - What is this: ${s.whatIsThis.substring(0, 60)}...`);
  console.log(`    - What to do: ${s.whatToDo.substring(0, 60)}...`);
  console.log(`    - What next: ${s.whatNext.substring(0, 60)}...`);

  if (s.title !== expectedOrder[i].title) {
    throw new Error(`Step ${i + 1} title mismatch: got "${s.title}", expected "${expectedOrder[i].title}"`);
  }
  if (s.view !== expectedOrder[i].view) {
    throw new Error(`Step ${i + 1} view mismatch: got "${s.view}", expected "${expectedOrder[i].view}"`);
  }
});

console.log('\n=== ALL GUIDED TOUR TESTS PASSED SUCCESSFULLY! ===\n');
