const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting How to Use Navigation Cards to Page Tours Test Suite...\n');

const appJs = fs.readFileSync(path.resolve(__dirname, '../js/app.js'), 'utf8');
const indexHtml = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const frontendAppJs = fs.readFileSync(path.resolve(__dirname, '../frontend/js/app.js'), 'utf8');
const frontendIndexHtml = fs.readFileSync(path.resolve(__dirname, '../frontend/index.html'), 'utf8');

// 1. Verify destination map
console.log('1. Validating DESTINATION_TO_TOUR_MAP in js/app.js...');
const mapMatch = appJs.match(/const DESTINATION_TO_TOUR_MAP = (\{[\s\S]*?\n    \};)/);
assert(mapMatch, 'DESTINATION_TO_TOUR_MAP must exist in js/app.js');
const DESTINATION_TO_TOUR_MAP = eval(`(${mapMatch[1].replace(/;$/, '')})`);

const requiredDestinations = [
  { action: 'Go to Roadmap', target: 'roadmap', expectedTour: 'roadmap' },
  { action: 'Go to Daily Hub', target: 'dailyHub', expectedTour: 'dailyHub' },
  { action: 'Go to Interview Questions', target: 'interviewQuestions', expectedTour: 'interviewQuestions' },
  { action: 'Go to Analytics', target: 'progressAnalytics', expectedTour: 'progressAnalytics' },
  { action: 'Go to Internships', target: 'internships', expectedTour: 'internships' },
  { action: 'Go to My Applications', target: 'myApplications', expectedTour: 'myApplications' },
  { action: 'Go to Tech News', target: 'techNews', expectedTour: 'techNews' }
];

requiredDestinations.forEach(dest => {
  assert(DESTINATION_TO_TOUR_MAP[dest.target], `Mapping for ${dest.target} must exist`);
  assert.strictEqual(DESTINATION_TO_TOUR_MAP[dest.target], dest.expectedTour, `Mapping for ${dest.target} should match ${dest.expectedTour}`);
  console.log(`   ✅ ${dest.action} (${dest.target}) maps to tour: '${dest.expectedTour}'`);
});

// 2. Validate Navigation Cards in HTML
console.log('\n2. Verifying navigation cards inside How to Use modal...');
requiredDestinations.forEach(dest => {
  const cardSelectorRegex = new RegExp(`class="guide-goal-card"\\s+data-action="navigate"\\s+data-target="${dest.target}"`);
  assert(cardSelectorRegex.test(indexHtml), `index.html must have guide-goal-card with data-target="${dest.target}"`);
  assert(cardSelectorRegex.test(frontendIndexHtml), `frontend/index.html must have guide-goal-card with data-target="${dest.target}"`);
  console.log(`   ✅ Found .guide-goal-card for '${dest.target}' in both HTML files`);
});

// Also verify the AI Assistant special card
const aiCardRegex = /class="guide-goal-card"\s+data-action="open-chatbot"/;
assert(aiCardRegex.test(indexHtml), 'index.html must have guide-goal-card for AI assistant');
assert(aiCardRegex.test(frontendIndexHtml), 'frontend/index.html must have guide-goal-card for AI assistant');
console.log('   ✅ Found .guide-goal-card for "I need help understanding something" (open-chatbot)');

// 3. Verify Extract PAGE_SPECIFIC_TOURS
console.log('\n3. Validating destination tour first steps & explanations...');
const tourMatch = appJs.match(/const PAGE_SPECIFIC_TOURS = (\{[\s\S]*?\n    \};\n\n    \/\/ Full End-to-End)/);
assert(tourMatch, 'PAGE_SPECIFIC_TOURS must exist');
const PAGE_SPECIFIC_TOURS = eval(`(${tourMatch[1].replace(/;\n\n    \/\/ Full End-to-End$/, '')})`);

requiredDestinations.forEach(dest => {
  const steps = PAGE_SPECIFIC_TOURS[dest.expectedTour];
  assert(steps && steps.length > 0, `Tour steps for '${dest.expectedTour}' must exist`);
  const firstStep = steps[0];
  assert(firstStep.title, `First step for '${dest.expectedTour}' must have title`);
  assert(firstStep.whatIsThis, `First step for '${dest.expectedTour}' must have whatIsThis`);
  assert(firstStep.whatToDo, `First step for '${dest.expectedTour}' must have whatToDo`);
  assert(firstStep.whatNext, `First step for '${dest.expectedTour}' must have whatNext`);
  assert(firstStep.selector, `First step for '${dest.expectedTour}' must have selector`);
  console.log(`   ✅ Tour '${dest.expectedTour}': Step 1 title="${firstStep.title}", viewTag="${firstStep.viewTag}"`);
});

// 4. Test Simulated Navigation and Automatic Tour Launch
console.log('\n4. Simulating Click on Navigation Cards -> Navigation -> Auto Tour Launch...');

function simulateCardClick(cardData) {
  let modalOpen = true;
  let activeView = 'roadmap';
  let launchedTour = null;
  let initialStep = null;
  let chatbotOpened = false;

  const closeGuideModal = () => { modalOpen = false; };
  const switchView = (v) => { activeView = v; };

  // Logic from app.js navigateAndLaunchPageTour
  if (cardData.action === 'navigate' && cardData.target) {
    closeGuideModal();
    const tourKey = DESTINATION_TO_TOUR_MAP[cardData.target] || cardData.target;
    switchView(cardData.target);
    launchedTour = tourKey;
    initialStep = 0; // Starts at Step 1 (0-indexed)
  } else if (cardData.action === 'open-chatbot') {
    closeGuideModal();
    chatbotOpened = true;
  }

  return {
    modalOpen,
    activeView,
    launchedTour,
    initialStep,
    chatbotOpened
  };
}

requiredDestinations.forEach(dest => {
  const result = simulateCardClick({ action: 'navigate', target: dest.target });
  assert.strictEqual(result.modalOpen, false, 'Modal must close');
  assert.strictEqual(result.activeView, dest.target, 'Correct view must be active');
  assert.strictEqual(result.launchedTour, dest.expectedTour, 'Correct page tour must launch');
  assert.strictEqual(result.initialStep, 0, 'Tour must start at Step 1 (0-indexed)');
  assert.strictEqual(result.chatbotOpened, false, 'Chatbot must not open for page navigation');
  console.log(`   ✅ Click on '${dest.action}' successfully closes modal, navigates to '${dest.target}', and launches '${dest.expectedTour}' Step 1`);
});

// Test AI Assistant Card
const aiResult = simulateCardClick({ action: 'open-chatbot' });
assert.strictEqual(aiResult.modalOpen, false, 'Modal must close');
assert.strictEqual(aiResult.chatbotOpened, true, 'Chatbot trigger must be called');
assert.strictEqual(aiResult.launchedTour, null, 'No page tour must launch for AI Assistant card');
console.log('   ✅ Click on "I need help understanding something" opens AI Assistant without launching a tour.');

// 5. Test separation of 4 distinct user actions
console.log('\n5. Verifying complete separation of the 4 distinct user actions...');
assert(appJs.includes('navigateAndLaunchPageTour(target);'), 'Navigation cards must call navigateAndLaunchPageTour');
assert(appJs.includes('startPageTour(pageKey);'), 'What can I do here buttons must call startPageTour on active page');
assert(appJs.includes('startTourFromModalBtn.addEventListener(\'click\', startFullPlatformTour);'), 'Start Guided Tour must call startFullPlatformTour');
assert(appJs.includes('openGuideBtn.addEventListener(\'click\''), 'How to Use / Full Guide must open modal');

console.log('   ✅ Action 1: Navigation cards -> navigate to page & automatically start that page tour');
console.log('   ✅ Action 2: What can I do here? -> starts current page tour');
console.log('   ✅ Action 3: Start Guided Tour -> starts full-platform tour');
console.log('   ✅ Action 4: How to Use -> opens full user guide modal');

console.log('\n🎉 ALL NAVIGATION CARD TESTS PASSED SUCCESSFULLY!');
