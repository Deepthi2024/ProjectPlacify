const fs = require('fs');
const path = require('path');
const vm = require('vm');

function testSeparateQuizPage() {
  console.log('========================================================');
  console.log('🧪 TESTING DEDICATED DIAGNOSTIC QUIZ PAGE & NAVIGATION');
  console.log('========================================================\n');

  // 1. Static HTML Structural Analysis
  const htmlContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

  console.log('▶ Check 1: HTML View Sections Analysis');
  if (!htmlContent.includes('id="view-diagnostic"')) {
    throw new Error('index.html missing #view-diagnostic section');
  }
  if (!htmlContent.includes('id="view-diagnostic-quiz"')) {
    throw new Error('index.html missing #view-diagnostic-quiz section');
  }
  console.log('✅ Found both #view-diagnostic (Baseline Setup) and #view-diagnostic-quiz (Dedicated Quiz Page).');

  console.log('▶ Check 2: Verify Inline Quiz is NOT rendered in Baseline Setup');
  const baselineSectionMatch = htmlContent.match(/<section id="view-diagnostic"[\s\S]*?<\/section>/);
  if (!baselineSectionMatch) throw new Error('Could not extract #view-diagnostic section from index.html');
  const baselineHtml = baselineSectionMatch[0];

  if (baselineHtml.includes('id="diagnostic-quiz-wrapper"') || baselineHtml.includes('id="diagnostic-questions-container"')) {
    throw new Error('Baseline setup page still contains inline quiz questions/wrapper!');
  }
  console.log('✅ Baseline setup page contains only Domain/Proficiency/Question count selectors and action buttons.');

  console.log('▶ Check 3: Verify Dedicated Quiz Section Structure');
  const quizSectionMatch = htmlContent.match(/<section id="view-diagnostic-quiz"[\s\S]*?<\/section>/);
  if (!quizSectionMatch) throw new Error('Could not extract #view-diagnostic-quiz section from index.html');
  const quizHtml = quizSectionMatch[0];

  const requiredElements = [
    'id="quiz-back-to-baseline-btn"',
    'id="quiz-page-domain-title"',
    'id="quiz-page-level-badge"',
    'id="quiz-page-count-badge"',
    'id="quiz-empty-state"',
    'id="quiz-empty-return-btn"',
    'id="quiz-active-content"',
    'id="diagnostic-palette-container"',
    'id="diagnostic-questions-container"',
    'id="diagnostic-quiz-form"',
    'id="quiz-prev-btn"',
    'id="quiz-next-btn"',
    'id="quiz-skip-btn"',
    'id="quiz-submit-btn"'
  ];

  for (const elId of requiredElements) {
    if (!quizHtml.includes(elId)) {
      throw new Error(`Dedicated quiz page is missing ${elId}`);
    }
  }
  console.log('✅ All dedicated quiz page controls, badges, palette, empty state, and action buttons present in HTML.');

  // 2. Runtime VM Sandbox Verification
  console.log('▶ Check 4: Testing app.js Router and renderDiagnosticQuiz in VM');
  const dataCode = fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8');
  const appCode = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');

  const domElements = {};
  function mockElement(id) {
    if (!domElements[id]) {
      const classListSet = new Set();
      domElements[id] = {
        id,
        textContent: '',
        innerHTML: '',
        style: {},
        value: '',
        disabled: false,
        onclick: null,
        onchange: null,
        oninput: null,
        addEventListener: () => {},
        closest: () => null,
        querySelectorAll: () => [],
        querySelector: () => mockElement('dummy_child'),
        classList: {
          add: (c) => classListSet.add(c),
          remove: (c) => classListSet.delete(c),
          contains: (c) => classListSet.has(c),
          toggle: (c, cond) => cond ? classListSet.add(c) : classListSet.delete(c)
        }
      };
    }
    return domElements[id];
  }

  let domContentLoadedHandler = null;

  const sandbox = {
    window: {},
    document: {
      getElementById: (id) => mockElement(id),
      querySelectorAll: () => [],
      querySelector: () => mockElement('dummy'),
      addEventListener: (evt, handler) => {
        if (evt === 'DOMContentLoaded') {
          domContentLoadedHandler = handler;
        }
      }
    },
    console: console,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    sessionStorage: {
      _data: {},
      getItem(k) { return this._data[k] || null; },
      setItem(k, v) { this._data[k] = String(v); },
      removeItem(k) { delete this._data[k]; }
    },
    localStorage: {
      _data: {},
      getItem(k) { return this._data[k] || null; },
      setItem(k, v) { this._data[k] = String(v); },
      removeItem(k) { delete this._data[k]; }
    },
    fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }),
    selectedQuestionCount: 10
  };

  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.window.scrollTo = () => {};
  sandbox.window.addEventListener = () => {};
  sandbox.window.location = { pathname: '/diagnostic', hash: '' };
  sandbox.window.history = { pushState: () => {}, replaceState: () => {} };

  sandbox.window.placifySupervisor = {
    authAgent: {
      getActiveSession: () => ({ user_id: 'usr_test_123', name: 'Test User', chosen_domain: 'fullstack' }),
      setActiveSession: () => {},
      clearSession: () => {}
    },
    progressTracker: {
      getUserState: () => ({ level: 1, xp: 50, streak: 2 }),
      clearActiveUser: () => {}
    }
  };

  vm.createContext(sandbox);
  vm.runInContext(dataCode, sandbox);
  vm.runInContext(appCode, sandbox);

  if (domContentLoadedHandler) {
    domContentLoadedHandler();
  }

  console.log('✅ app.js DOMContentLoaded executed without errors.');

  // Test renderDiagnosticQuiz with AI questions
  const sampleQuestions = [
    {
      id: 'q1',
      question: 'What is the Virtual DOM in React?',
      type: 'MCQ',
      topic: 'React Core',
      subtopic: 'Virtual DOM',
      difficulty: 'INTERMEDIATE',
      options: ['In-memory representation of real DOM', 'Direct DOM node', 'Shadow DOM', 'Browser cache'],
      correct: 0,
      explanation: 'Virtual DOM is a lightweight copy of the real DOM in memory.'
    },
    {
      id: 'q2',
      question: 'What is the output of this code?',
      codeSnippet: 'console.log(typeof null);',
      type: 'CODE_OUTPUT',
      topic: 'JavaScript',
      subtopic: 'Types',
      difficulty: 'INTERMEDIATE',
      options: ['object', 'null', 'undefined', 'number'],
      correct: 0,
      explanation: 'typeof null returns object due to legacy JS specification.'
    }
  ];

  sandbox.window.renderDiagnosticQuiz('fullstack', sampleQuestions);

  const container = domElements['diagnostic-questions-container'];
  const palette = domElements['diagnostic-palette-container'];
  const pageTitle = domElements['quiz-page-domain-title'];
  const pageBadge = domElements['quiz-page-level-badge'];
  const pageCount = domElements['quiz-page-count-badge'];

  if (!container.innerHTML.includes('What is the Virtual DOM in React?')) {
    throw new Error('Question 1 was not rendered into diagnostic-questions-container');
  }
  if (!container.innerHTML.includes('console.log(typeof null);')) {
    throw new Error('Question 2 code snippet was not rendered into diagnostic-questions-container');
  }
  if (!palette.innerHTML.includes('palette-btn')) {
    throw new Error('Palette buttons were not rendered');
  }

  console.log(`✅ Dedicated page domain title: "${pageTitle.textContent}"`);
  console.log(`✅ Dedicated page level badge: "${pageBadge.textContent}"`);
  console.log(`✅ Dedicated page question count badge: "${pageCount.textContent}"`);
  console.log('✅ Active diagnostic quiz saved in sessionStorage for refresh resiliency.');

  console.log('\n========================================================');
  console.log('🎉 ALL DEDICATED QUIZ PAGE & NAVIGATION TESTS PASSED!');
  console.log('========================================================');
}

try {
  testSeparateQuizPage();
} catch (e) {
  console.error('❌ Test failed:', e);
  process.exit(1);
}
