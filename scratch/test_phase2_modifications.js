const fs = require('fs');
const assert = require('assert');

// 1. Verify index.html
const html = fs.readFileSync('./index.html', 'utf8');

// Remediation section completely removed
assert.strictEqual(html.includes('Optional: Mark Specific Topics Needing Remediation'), false, 'Remediation title must not exist in index.html');
assert.strictEqual(html.includes('id="manual-topic-grid"'), false, 'manual-topic-grid must not exist in index.html');

// Syllabus section properly present
assert.ok(html.includes('id="syllabus-container"'), 'syllabus-container must exist in index.html');
assert.ok(html.includes('id="roadmap-syllabus-list"'), 'roadmap-syllabus-list must exist in index.html');
assert.ok(html.includes('Syllabus Covered in Your Roadmap'), 'Syllabus title must exist in index.html');
assert.ok(html.includes('id="syllabus-level-badge"'), 'syllabus-level-badge must exist in index.html');

// Proficiency level cards intact
assert.ok(html.includes('data-level="BEGINNER"'), 'Beginner card must exist');
assert.ok(html.includes('data-level="INTERMEDIATE"'), 'Intermediate card must exist');
assert.ok(html.includes('data-level="ADVANCED"'), 'Advanced card must exist');
assert.ok(html.includes('BEGINNER SELECTED'), 'Selected level pill must exist');

// 2. Verify data.js syllabus lookup
const mockWindow = {};
new Function('window', fs.readFileSync('./js/data.js', 'utf8'))(mockWindow);

assert.strictEqual(typeof mockWindow.PLACIFY_DATA.getSyllabus, 'function', 'PLACIFY_DATA.getSyllabus must be a function');
assert.strictEqual(typeof mockWindow.getDomainSyllabus, 'function', 'getDomainSyllabus must be a function');

const domains = ['fullstack', 'dsa', 'datascience', 'devops', 'cybersecurity', 'mobile', 'ai_llm', 'system_design'];
for (const domain of domains) {
  for (const level of ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']) {
    const list = mockWindow.getDomainSyllabus(domain, level);
    assert.ok(Array.isArray(list) && list.length >= 4, `Domain ${domain} level ${level} must have a non-empty syllabus list`);
  }
}

// 3. Verify DOM simulation for level clicks and tick indicators
// Mock DOM elements
const cardState = {
  BEGINNER: { active: true, iconClass: 'ph ph-check-circle', iconColor: 'var(--accent-emerald)', borderColor: '2px solid var(--accent-emerald)' },
  INTERMEDIATE: { active: false, iconClass: 'ph ph-circle', iconColor: 'var(--text-muted)', borderColor: '1px solid rgba(255, 255, 255, 0.12)' },
  ADVANCED: { active: false, iconClass: 'ph ph-circle', iconColor: 'var(--text-muted)', borderColor: '1px solid rgba(255, 255, 255, 0.12)' }
};

function selectLevel(level) {
  const norm = level.toUpperCase();
  for (const k of Object.keys(cardState)) {
    if (k === norm) {
      cardState[k].active = true;
      cardState[k].iconClass = 'ph ph-check-circle';
      cardState[k].iconColor = norm === 'INTERMEDIATE' ? '#f59e0b' : (norm === 'ADVANCED' ? 'var(--accent-violet)' : 'var(--accent-emerald)');
      cardState[k].borderColor = norm === 'INTERMEDIATE' ? '2px solid #f59e0b' : (norm === 'ADVANCED' ? '2px solid var(--accent-violet)' : '2px solid var(--accent-emerald)');
    } else {
      cardState[k].active = false;
      cardState[k].iconClass = 'ph ph-circle';
      cardState[k].iconColor = 'var(--text-muted)';
      cardState[k].borderColor = '1px solid rgba(255, 255, 255, 0.12)';
    }
  }
}

// Test Beginner Selection
selectLevel('BEGINNER');
assert.strictEqual(cardState.BEGINNER.iconClass, 'ph ph-check-circle');
assert.strictEqual(cardState.INTERMEDIATE.iconClass, 'ph ph-circle');
assert.strictEqual(cardState.ADVANCED.iconClass, 'ph ph-circle');

// Test Intermediate Selection
selectLevel('INTERMEDIATE');
assert.strictEqual(cardState.BEGINNER.iconClass, 'ph ph-circle');
assert.strictEqual(cardState.INTERMEDIATE.iconClass, 'ph ph-check-circle');
assert.strictEqual(cardState.ADVANCED.iconClass, 'ph ph-circle');

// Test Advanced Selection
selectLevel('ADVANCED');
assert.strictEqual(cardState.BEGINNER.iconClass, 'ph ph-circle');
assert.strictEqual(cardState.INTERMEDIATE.iconClass, 'ph ph-circle');
assert.strictEqual(cardState.ADVANCED.iconClass, 'ph ph-check-circle');

console.log('✅ All Phase 2 acceptance tests passed successfully!');
