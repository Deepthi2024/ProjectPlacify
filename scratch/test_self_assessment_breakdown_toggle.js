const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');

console.log('--- 1. Checking id="topic-proficiency-breakdown-section" in index.html ---');
if (!indexHtml.includes('id="topic-proficiency-breakdown-section"')) {
  console.error('FAIL: id="topic-proficiency-breakdown-section" missing in index.html');
  process.exit(1);
}
console.log('PASS: topic-proficiency-breakdown-section id exists in index.html');

console.log('\n--- 2. Checking conditional logic in app.js ---');
if (!appJs.includes('if (isSelfAssessed) {') || !appJs.includes("breakdownSection.style.display = 'none';")) {
  console.error('FAIL: isSelfAssessed hide check missing in app.js');
  process.exit(1);
}
console.log('PASS: isSelfAssessed hide logic is in app.js');

console.log('\n--- 3. Testing logic via mock DOM elements ---');

function createMockElement(id) {
  return {
    id,
    style: {},
    innerHTML: '',
    textContent: '',
    className: '',
    closest: () => null,
    parentElement: null
  };
}

const elements = {
  'tier-score-display': createMockElement('tier-score-display'),
  'tier-label-display': createMockElement('tier-label-display'),
  'gaps-list-container': createMockElement('gaps-list-container'),
  'gap-count-num': createMockElement('gap-count-num'),
  'intermediate-list-container': createMockElement('intermediate-list-container'),
  'intermediate-count-num': createMockElement('intermediate-count-num'),
  'mastered-list-container': createMockElement('mastered-list-container'),
  'mastered-count-num': createMockElement('mastered-count-num'),
  'topic-proficiency-breakdown-section': createMockElement('topic-proficiency-breakdown-section'),
  'topic-proficiency-table-container': createMockElement('topic-proficiency-table-container')
};

const mockDocument = {
  getElementById: (id) => elements[id] || null
};

// Simulate evaluation object for self-assessed user
const selfAssessedEval = {
  isSelfAssessed: true,
  skillTier: 'INTERMEDIATE',
  scorePct: 65,
  topicEvaluations: [
    { topic: 'JavaScript Fundamentals', score_pct: 65, proficiencyLevel: 'INTERMEDIATE' }
  ]
};

// Simulate evaluation object for quiz user
const quizEval = {
  isSelfAssessed: false,
  skillTier: 'INTERMEDIATE',
  scorePct: 75,
  topicEvaluations: [
    { topic: 'JavaScript Fundamentals', score_pct: 75, proficiencyLevel: 'INTERMEDIATE', totalQuestions: 5, correctAnswers: 4 }
  ]
};

// Extract renderAssessmentReport body
const fnMatch = appJs.match(/function renderAssessmentReport\(evaluation, roadmap\) \{([\s\S]*?)\n  \}/);
if (!fnMatch) {
  console.error('FAIL: Could not extract renderAssessmentReport');
  process.exit(1);
}

const renderFn = new Function('evaluation', 'roadmap', 'document', 'window', fnMatch[1]);

// Test 1: Self-Assessed User
renderFn(selfAssessedEval, null, mockDocument, {});
const breakdownSection = elements['topic-proficiency-breakdown-section'];
const tableContainer = elements['topic-proficiency-table-container'];

console.log('Self-assessed breakdown section display:', breakdownSection.style.display);
console.log('Self-assessed table container innerHTML length:', tableContainer.innerHTML.length);

if (breakdownSection.style.display !== 'none' || tableContainer.innerHTML !== '') {
  console.error('FAIL: Breakdown section was not hidden for self-assessed user!');
  process.exit(1);
}
console.log('PASS: Breakdown section is cleanly hidden for self-assessed user!');

// Test 2: Quiz User
renderFn(quizEval, null, mockDocument, {});
console.log('Quiz user breakdown section display:', breakdownSection.style.display);
console.log('Quiz user table container contains table:', tableContainer.innerHTML.includes('<table'));

if (breakdownSection.style.display !== 'block' || !tableContainer.innerHTML.includes('<table')) {
  console.error('FAIL: Breakdown section was not displayed for quiz user!');
  process.exit(1);
}
console.log('PASS: Breakdown section is properly displayed for quiz user!');

console.log('\n🎉 ALL CONDITIONAL DISPLAY CHECKS PASSED!');
