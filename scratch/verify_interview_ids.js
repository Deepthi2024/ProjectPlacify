const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('js/app.js', 'utf8');

const idsToCheck = [
  'view-interview-questions',
  'interview-landing-hub',
  'select-option-external-btn',
  'select-option-placify-btn',
  'interview-external-workflow',
  'interview-placify-workflow',
  'interview-user-domain-label',
  'interview-ext-phase-select',
  'interview-ext-custom-topic',
  'interview-ext-resource-type',
  'interview-ext-fetch-resources-btn',
  'interview-external-cards-container',
  'interview-config-form',
  'interview-cfg-domain',
  'interview-cfg-phase-select',
  'interview-cfg-custom-topic',
  'interview-cfg-difficulty',
  'interview-cfg-count',
  'interview-cfg-type',
  'interview-cfg-category',
  'generate-interview-practice-btn',
  'interview-practice-loading',
  'interview-practice-error',
  'interview-practice-error-msg',
  'btn-retry-generate-questions',
  'interview-practice-runner',
  'interview-question-palette',
  'interview-active-question-card',
  'interview-prev-q-btn',
  'interview-next-q-btn',
  'interview-clear-q-btn',
  'interview-submit-practice-btn',
  'interview-practice-results',
  'interview-history-section',
  'interview-history-list'
];

const missing = idsToCheck.filter(id => !html.includes(`id="${id}"`));
console.log('Missing IDs in HTML:', missing.length === 0 ? 'None (All 35 IDs present and verified!)' : missing);
