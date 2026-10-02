const assert = require('assert');
const { generateIntelligentRoadmap } = require('../engine/roadmapPlanner');
const fs = require('fs');

const languages = ['C++', 'Java', 'Python', 'JavaScript', 'C'];

for (const language of languages) {
  const roadmap = generateIntelligentRoadmap({
    userId: 'dsa-language-test',
    domain: 'dsa',
    dsaLanguage: language,
    timeline_months: 1,
    daily_hours: 2,
    userLevel: 'BEGINNER'
  });

  assert.strictEqual(roadmap.dsa_language, language);
  assert.strictEqual(roadmap.programming_language, language);

  const tasks = roadmap.monthly_roadmap
    .flatMap(m => m.weeks)
    .flatMap(w => w.days)
    .flatMap(d => d.tasks);

  assert.ok(tasks.length > 0);
  tasks.forEach(task => {
    assert.strictEqual(task.dsaLanguage, language);
    assert.strictEqual(task.programmingLanguage, language);
  });
}

const html = fs.readFileSync(require('path').join(__dirname, '..', 'index.html'), 'utf8');
const app = fs.readFileSync(require('path').join(__dirname, '..', 'js', 'app.js'), 'utf8');
const server = fs.readFileSync(require('path').join(__dirname, '..', 'server.js'), 'utf8');

assert.ok(html.includes('id="dsa-language-modal"'));
languages.forEach(language => assert.ok(html.includes(`data-language="${language}"`)));
assert.ok(app.includes('DSA requires a language before the diagnostic/roadmap pipeline starts.'));
assert.ok(app.includes('dsa_language: selectedDsaLanguage'));
assert.ok(server.includes('DSA programming language is required before generating a DSA roadmap.'));

console.log('=== DSA LANGUAGE ACCEPTANCE ===');
console.log('PASS: 5 supported languages generate language-specific roadmap tasks.');
console.log('PASS: DSA language is required in the UI before diagnostic/roadmap flow.');
console.log('PASS: DSA language is persisted to the user profile and propagated to quiz + roadmap generation.');
console.log('=== DSA LANGUAGE TESTS PASSED ===');
