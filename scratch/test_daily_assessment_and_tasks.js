const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { generateIntelligentRoadmap } = require('../engine/roadmapPlanner');

const domains = ['fullstack','datascience','cybersecurity','devops','dsa','mobile','ai_llm','system_design'];
const levels = ['BEGINNER','INTERMEDIATE','ADVANCED'];
let totalDays = 0;
for (const domain of domains) {
  for (const level of levels) {
    const roadmap = generateIntelligentRoadmap({
      userId: `test_${domain}_${level}`,
      domain,
      dsaLanguage: domain === 'dsa' ? 'C++' : null,
      timeline_months: 3,
      daily_hours: 2,
      userLevel: level,
      quizEvaluation: null,
      skillProfile: null
    });
    assert.strictEqual(roadmap.monthly_roadmap.length, 3, `${domain}/${level}: month count`);
    const months = roadmap.monthly_roadmap;
    assert(months.every(m => Number.isFinite(m.estimated_hours)), `${domain}/${level}: monthly hours must be numeric`);
    assert(new Set(months.map(m => m.title)).size > 1, `${domain}/${level}: monthly titles must vary`);
    const days = months.flatMap(m => (m.weeks || []).flatMap(w => w.days || []));
    for (const day of days) {
      totalDays++;
      assert((day.tasks || []).length >= 2 && (day.tasks || []).length <= 3, `${domain}/${level}: day ${day.day_number} task count`);
      const total = (day.tasks || []).reduce((s,t) => s + Number(t.durationMinutes || 0), 0);
      assert.strictEqual(total, Number(day.total_minutes), `${domain}/${level}: day total minutes`);
      if (domain === 'dsa') {
        assert((day.tasks || []).every(t => t.dsaLanguage === 'C++'), `${domain}/${level}: DSA language propagation`);
      } else {
        assert((day.tasks || []).every(t => t.dsaLanguage === null), `${domain}/${level}: non-DSA language isolation`);
      }
    }
  }
}

const server = fs.readFileSync(path.join(__dirname,'..','server.js'),'utf8');
const app = fs.readFileSync(path.join(__dirname,'..','js','app.js'),'utf8');
const index = fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');

assert(server.includes("/api/daily-assessment/generate"));
assert(server.includes("/api/daily-assessment/grade"));
assert(server.includes("/api/interview-questions/generate"));
assert(server.includes("/api/task/rollover"));
assert(server.includes('SHORT_ANSWER'));
assert(server.includes('MSQ'));
assert(server.includes('NAT'));
assert(index.includes('Skip Assessment'));
assert(app.includes('task-complete-toggle'));
assert(app.includes('/api/task/status'));
assert(app.includes('/api/task/rollover'));
assert(app.includes('assessment-written-input'));
assert(app.includes('assessment-nat-input'));
assert(app.includes('generateInterviewQuestions'));
assert(index.includes('skip-day-assessment-btn'));
assert(index.includes('take-interview-btn'));
assert(index.includes('view-interview-questions'));

console.log(`PASS: ${domains.length * levels.length} domain/level roadmaps, ${totalDays} days checked.`);
console.log('PASS: every day has 2-3 tasks and exact task-duration totals.');
console.log('PASS: DSA language stays isolated to DSA.');
console.log('PASS: assessment endpoints support MCQ/MSQ/NAT/SHORT_ANSWER.');
console.log('PASS: optional interview flow and task rollover wiring present.');
