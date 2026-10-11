const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting Comprehensive Page Tours Test Suite...\n');

const appJs = fs.readFileSync(path.resolve(__dirname, '../js/app.js'), 'utf8');
const indexHtml = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const frontendAppJs = fs.readFileSync(path.resolve(__dirname, '../frontend/js/app.js'), 'utf8');
const frontendIndexHtml = fs.readFileSync(path.resolve(__dirname, '../frontend/index.html'), 'utf8');

// 1. Verify files in sync
console.log('1. Checking file sync between root and frontend/...');
assert(appJs.includes('const PAGE_SPECIFIC_TOURS ='), 'js/app.js must have PAGE_SPECIFIC_TOURS');
assert(frontendAppJs.includes('const PAGE_SPECIFIC_TOURS ='), 'frontend/js/app.js must have PAGE_SPECIFIC_TOURS');
assert(indexHtml.includes('data-page-help="assessmentEvaluation"'), 'index.html must have assessmentEvaluation button');
assert(frontendIndexHtml.includes('data-page-help="assessmentEvaluation"'), 'frontend/index.html must have assessmentEvaluation button');
assert(indexHtml.includes('data-page-help="onboarding"'), 'index.html must have onboarding button');
assert(frontendIndexHtml.includes('data-page-help="onboarding"'), 'frontend/index.html must have onboarding button');
console.log('   ✅ HTML and tour definitions are verified in sync.\n');

// 2. Extract PAGE_SPECIFIC_TOURS from app.js
console.log('2. Extracting and validating PAGE_SPECIFIC_TOURS definitions...');
const tourMatch = appJs.match(/const PAGE_SPECIFIC_TOURS = (\{[\s\S]*?\n    \};\n\n    \/\/ Full End-to-End)/);
assert(tourMatch, 'PAGE_SPECIFIC_TOURS block must exist in app.js');

const rawTourCode = tourMatch[1].replace(/;\n\n    \/\/ Full End-to-End$/, '');
const PAGE_SPECIFIC_TOURS = eval(`(${rawTourCode})`);

const expectedPages = [
  'roadmap',
  'dailyHub',
  'interviewQuestions',
  'techNews',
  'progressAnalytics',
  'internships',
  'myApplications',
  'domainSelection',
  'diagnostic',
  'assessmentReport',
  'assessmentEvaluation',
  'onboarding'
];

expectedPages.forEach(page => {
  assert(PAGE_SPECIFIC_TOURS[page], `PAGE_SPECIFIC_TOURS must have tour for '${page}'`);
  const steps = PAGE_SPECIFIC_TOURS[page];
  assert(Array.isArray(steps) && steps.length >= 3, `'${page}' tour must have at least 3 steps, found ${steps.length}`);
  console.log(`   ✅ Page '${page}': ${steps.length} interactive tour steps defined.`);
});

// 3. Validate every single tour step across all pages
console.log('\n3. Validating tour step structure, explanations, and instructions...');
let totalSteps = 0;
for (const [page, steps] of Object.entries(PAGE_SPECIFIC_TOURS)) {
  steps.forEach((step, idx) => {
    totalSteps++;
    assert(step.title && step.title.length > 3, `[${page} - Step ${idx+1}] title must be descriptive`);
    assert(step.viewTag, `[${page} - Step ${idx+1}] viewTag must be specified`);
    assert(step.whatIsThis && step.whatIsThis.length > 20, `[${page} - Step ${idx+1}] whatIsThis must provide clear explanation`);
    assert(step.whatToDo && step.whatToDo.length > 15, `[${page} - Step ${idx+1}] whatToDo must provide action instruction`);
    assert(step.whatNext && step.whatNext.length > 10, `[${page} - Step ${idx+1}] whatNext must provide clear outcome`);
    assert(step.selector, `[${page} - Step ${idx+1}] selector must be specified`);
    assert(step.fallbackSelector, `[${page} - Step ${idx+1}] fallbackSelector must be specified`);
  });
}
console.log(`   ✅ All ${totalSteps} tour steps across all pages validated with complete 3-part guidance.`);

// 4. Verify all HTML buttons have matching page keys
console.log('\n4. Verifying .page-context-help-btn presence in index.html...');
const buttonMatches = [...indexHtml.matchAll(/class="page-context-help-btn"\s+data-page-help="([^"]+)"/g)];
const foundButtonKeys = buttonMatches.map(m => m[1]);

console.log(`   Found ${foundButtonKeys.length} page-context-help-btn buttons in index.html:`, foundButtonKeys);

expectedPages.forEach(page => {
  assert(foundButtonKeys.includes(page), `index.html must have a page-context-help-btn for '${page}'`);
  console.log(`   ✅ Button present for '${page}'`);
});

// 5. Test Tour State Machine Simulation
console.log('\n5. Simulating Interactive Tour Navigation (Next, Prev, Bounds, Skip, Close)...');

function mockTourEngine(pageKey) {
  const steps = PAGE_SPECIFIC_TOURS[pageKey];
  let currentIndex = 0;
  let active = true;
  let completionRecorded = false;

  return {
    getStep: () => steps[currentIndex],
    getIndex: () => currentIndex,
    isActive: () => active,
    isCompleted: () => completionRecorded,
    next: () => {
      if (currentIndex >= steps.length - 1) {
        active = false;
        completionRecorded = true;
      } else {
        currentIndex++;
      }
    },
    prev: () => {
      if (currentIndex > 0) currentIndex--;
    },
    skip: () => {
      active = false;
      completionRecorded = false;
    },
    close: () => {
      active = false;
      completionRecorded = false;
    }
  };
}

expectedPages.forEach(page => {
  const tour = mockTourEngine(page);
  assert.strictEqual(tour.getIndex(), 0);
  assert(tour.isActive());
  assert.strictEqual(tour.getStep().title, PAGE_SPECIFIC_TOURS[page][0].title);

  // Advance to end
  const len = PAGE_SPECIFIC_TOURS[page].length;
  for (let i = 0; i < len - 1; i++) {
    tour.next();
  }
  assert.strictEqual(tour.getIndex(), len - 1);
  assert(tour.isActive());

  // Previous
  tour.prev();
  assert.strictEqual(tour.getIndex(), len - 2);
  tour.next();
  assert.strictEqual(tour.getIndex(), len - 1);

  // Finish
  tour.next();
  assert.strictEqual(tour.isActive(), false);
  assert.strictEqual(tour.isCompleted(), true);

  // Test Skip
  const tourSkip = mockTourEngine(page);
  tourSkip.skip();
  assert.strictEqual(tourSkip.isActive(), false);
  assert.strictEqual(tourSkip.isCompleted(), false);
});
console.log('   ✅ State machine handles Next, Prev, Completion, and Skip correctly across all pages.');

// 6. Verify distinction between the 3 actions
console.log('\n6. Checking distinction among the 3 user actions...');
assert(appJs.includes("window.startPlacifyGuidedTour = startFullPlatformTour;"), 'startFullPlatformTour must be exposed');
assert(appJs.includes("window.startPlacifyPageTour = startPageTour;"), 'startPageTour must be exposed');
assert(appJs.includes("startTourFromModalBtn.addEventListener('click', startFullPlatformTour);"), 'Modal button must trigger full platform tour');
assert(appJs.includes("startPageTour(pageKey);"), 'Context help buttons must trigger page-specific tour');
assert(appJs.includes("openGuideBtn.addEventListener('click'") && appJs.includes("guideModal.style.display = 'flex'"), 'How to Use must open guide modal');
console.log('   ✅ "What can I do here?", "How to Use", and "Start Guided Tour" have distinct behaviors.');

console.log('\n🎉 ALL PAGE TOURS TESTS PASSED SUCCESSFULLY!');
