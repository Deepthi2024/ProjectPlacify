const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('========================================');
console.log('VERIFYING FIX FOR allDiagnostics REFERENCE ERROR');
console.log('========================================');

const dataCode = fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8');
const appCode = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');

const domElements = {};
function mockElement(id) {
  if (!domElements[id]) {
    domElements[id] = {
      id,
      textContent: '',
      innerHTML: '',
      style: {},
      onclick: null,
      addEventListener: () => {},
      closest: () => null,
      querySelectorAll: () => [],
      querySelector: () => mockElement('dummy_child'),
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false
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
  fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }),
  selectedQuestionCount: 10
};

sandbox.window = sandbox;
sandbox.globalThis = sandbox;

// Set placifySupervisor & scrollTo on window
sandbox.window.scrollTo = () => {};
sandbox.window.placifySupervisor = {
  authAgent: { getActiveSession: () => null, login: () => {}, register: () => {} },
  domainChatbot: { askChatbot: () => {} }
};

vm.createContext(sandbox);

try {
  vm.runInContext(dataCode, sandbox);
  console.log('✅ js/data.js loaded into sandbox successfully.');

  vm.runInContext(appCode, sandbox);
  console.log('✅ js/app.js loaded into sandbox successfully without syntax errors.');

  if (domContentLoadedHandler) {
    domContentLoadedHandler();
    console.log('✅ DOMContentLoaded handler fired.');
  }

  const renderFn = sandbox.window.renderDiagnosticQuiz;
  if (typeof renderFn !== 'function') {
    throw new Error('window.renderDiagnosticQuiz is not a function');
  }

  // Test 1: renderDiagnosticQuiz with default static questions
  renderFn('fullstack', null);
  console.log('✅ renderDiagnosticQuiz("fullstack", null) executed successfully without ReferenceError!');

  // Test 2: renderDiagnosticQuiz with custom AI-generated questions
  const mockCustomQuestions = [
    { id: 'q1', question: 'What is Node.js?', topic: 'Backend', options: ['A', 'B'], correct: 0 },
    { id: 'q2', question: 'What is React?', topic: 'Frontend', options: ['C', 'D'], correct: 1 }
  ];
  renderFn('fullstack', mockCustomQuestions);
  console.log('✅ renderDiagnosticQuiz("fullstack", customQuestions) executed successfully without ReferenceError!');

  console.log('\n========================================');
  console.log('🎉 ALL DIAGNOSTICS REFERENCE FIX VERIFIED 100%! 🎉');
  console.log('========================================');
} catch (err) {
  console.error('❌ Verification failed:', err);
  process.exit(1);
}
