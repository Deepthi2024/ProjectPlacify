const assert = require('assert');
const fs = require('fs');

console.log('=== TEST SUITE: Contextual Page Guides ("What can I do here?") ===');

// 1. Check HTML buttons in index.html & frontend/index.html
['index.html', 'frontend/index.html'].forEach(filePath => {
  const html = fs.readFileSync(filePath, 'utf8');
  const requiredKeys = [
    'roadmap',
    'dailyHub',
    'interviewQuestions',
    'techNews',
    'progressAnalytics',
    'internships',
    'myApplications',
    'domainSelection',
    'diagnostic',
    'assessmentReport'
  ];

  requiredKeys.forEach(key => {
    assert(html.includes(`data-page-help="${key}"`), `${filePath} must contain button for ${key}`);
  });
  console.log(`✔ Test 1: All 10 required page buttons verified in ${filePath}`);
});

// 2. Mock environment to test ContextualPageGuide in Node
const documentElements = {};
global.document = {
  getElementById: (id) => {
    if (!documentElements[id]) {
      documentElements[id] = {
        id,
        style: {},
        innerHTML: '',
        remove: function() { this.removed = true; },
        addEventListener: () => {}
      };
    }
    return documentElements[id];
  },
  createElement: (tag) => {
    const el = {
      tagName: tag,
      className: '',
      id: '',
      attributes: {},
      style: {},
      innerHTML: '',
      children: [],
      setAttribute: function(k, v) { this.attributes[k] = v; },
      querySelector: function(sel) {
        if (sel === '.guide-banner-close-btn') {
          return { addEventListener: (evt, fn) => { this._closeListener = fn; } };
        }
        if (sel === '.guide-banner-open-full-btn') {
          return { addEventListener: (evt, fn) => { this._openFullListener = fn; } };
        }
        return null;
      },
      querySelectorAll: function() { return []; },
      remove: function() { this.removed = true; },
      scrollIntoView: function() {}
    };
    return el;
  },
  querySelectorAll: (sel) => {
    return [];
  }
};

global.window = {
  location: { pathname: '/roadmap' },
  scrollTo: () => {}
};

// Load ContextualPageGuide definition from js/app.js
const appJs = fs.readFileSync('js/app.js', 'utf8');
const defsMatch = appJs.match(/const PAGE_HELP_DEFINITIONS = (\{[\s\S]*?\n  \});/);
assert(defsMatch, 'PAGE_HELP_DEFINITIONS must be found in js/app.js');

const cleanDefsCode = defsMatch[1].trim().replace(/;$/, '');
const PAGE_HELP_DEFINITIONS = eval(`(${cleanDefsCode})`);

const guideComponentMatch = appJs.match(/const ContextualPageGuide = (\{[\s\S]*?\n  \});/);
assert(guideComponentMatch, 'ContextualPageGuide must be found in js/app.js');

const cleanGuideCode = guideComponentMatch[1].trim().replace(/;$/, '');
const ContextualPageGuide = eval(`(${cleanGuideCode})`);

// 3. Verify each required page definition content
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
  'default'
];

expectedPages.forEach(key => {
  const def = PAGE_HELP_DEFINITIONS[key];
  assert(def, `Definition for ${key} must exist`);
  assert(def.title && def.title.length > 5, `${key} must have descriptive title`);
  assert(def.icon && def.icon.startsWith('ph-'), `${key} must have icon`);
  assert(def.purpose && def.purpose.length > 20, `${key} must have meaningful purpose`);
  assert(def.actions && (Array.isArray(def.actions) ? def.actions.length > 0 : def.actions.length > 20), `${key} must have key actions`);
  assert(def.impact && def.impact.length > 20, `${key} must have career impact`);
  assert(def.nextStep && def.nextStep.length > 15, `${key} must have recommended next step`);

  // Render check
  const rendered = ContextualPageGuide.render(key);
  assert(rendered.innerHTML.includes(def.title), `Rendered HTML must include title: ${def.title}`);
  assert(rendered.innerHTML.includes('KEY ACTIONS'), 'Rendered HTML must include KEY ACTIONS header');
  assert(rendered.innerHTML.includes('CAREER IMPACT'), 'Rendered HTML must include CAREER IMPACT header');
  assert(rendered.innerHTML.includes('RECOMMENDED NEXT STEP'), 'Rendered HTML must include RECOMMENDED NEXT STEP header');
  assert(rendered.innerHTML.includes('Full Guide'), 'Rendered HTML must include Full Guide button');
  assert(rendered.innerHTML.includes('guide-banner-close-btn'), 'Rendered HTML must include close button');
  console.log(`✔ Verified guide for [${key}]: "${def.title}" (3 cards rendered)`);
});

// 4. Test Fallback behavior
const unknownRendered = ContextualPageGuide.render('unknown_page_xyz');
assert(unknownRendered.innerHTML.includes('KEY ACTIONS'), 'Fallback guide must render 3 cards');
console.log('✔ Verified fallback guide for unknown page route.');

// 5. Verify Close and Full Guide event behavior
const banner = ContextualPageGuide.render('roadmap');
assert(typeof banner._closeListener === 'function', 'Close button must have click listener');
banner._closeListener({ stopPropagation: () => {} });
assert(banner.removed === true, 'Clicking close button must remove banner');

const banner2 = ContextualPageGuide.render('roadmap');
assert(typeof banner2._openFullListener === 'function', 'Full Guide button must have click listener');
const modal = document.getElementById('placify-guide-modal');
banner2._openFullListener({ stopPropagation: () => {} });
assert(banner2.removed === true, 'Clicking Full Guide must remove inline banner');
assert(modal.style.display === 'flex', 'Clicking Full Guide must open placify-guide-modal');
console.log('✔ Verified Close and Full Guide interactions.');

console.log('\n🎉 ALL CONTEXTUAL PAGE GUIDE TESTS PASSED SUCCESSFULLY!');
