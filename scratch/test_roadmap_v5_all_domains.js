const assert = require('assert');
const fs = require('fs');
const { generateIntelligentRoadmap, validateRoadmap } = require('../engine/roadmapPlanner');
const { getKnowledgeGraph, getAllSkillsInGraph } = require('../engine/knowledgeGraph');

const domains = ['fullstack','datascience','cybersecurity','devops','dsa','mobile','ai_llm','system_design'];
for (const domain of domains) {
  const roadmap = generateIntelligentRoadmap({
    userId: `v5-${domain}`,
    domain,
    timeline_months: 6,
    daily_hours: 2,
    userLevel: 'BEGINNER',
    dsaLanguage: domain === 'dsa' ? 'C++' : null
  });
  const validation = validateRoadmap(roadmap);
  assert(validation.valid, `${domain}: ${validation.errors.join('; ')}`);
  assert.strictEqual(roadmap.monthly_roadmap.length, 6);

  const titles = roadmap.monthly_roadmap.map(m => m.title);
  assert.strictEqual(new Set(titles).size, titles.length, `${domain}: repeated month titles`);
  roadmap.monthly_roadmap.forEach((month, mi) => {
    assert(Number.isFinite(month.estimated_hours) && month.estimated_hours > 0, `${domain}: month ${mi+1} hours invalid`);
    const actualHours = month.weeks.reduce((sum,w)=>sum+w.days.reduce((s,d)=>s+d.tasks.reduce((x,t)=>x+Number(t.durationMinutes||t.estimated_minutes||0),0),0),0)/60;
    assert(Math.abs(actualHours-month.estimated_hours)<0.01, `${domain}: month ${mi+1} hours mismatch`);
    month.weeks.forEach(w => {
      assert(w.days.every(d => d.tasks.length >= 2 && d.tasks.length <= 3), `${domain}: day has not 2-3 tasks`);
      assert(Math.abs(w.estimated_hours - w.days.reduce((s,d)=>s+d.total_minutes,0)/60)<0.01, `${domain}: week hours mismatch`);
    });
  });
  const allTasks = roadmap.monthly_roadmap.flatMap(m=>m.weeks).flatMap(w=>w.days).flatMap(d=>d.tasks);
  if (domain === 'dsa') assert(allTasks.every(t=>t.dsaLanguage==='C++' && t.programmingLanguage==='C++'), 'DSA language missing');
  else assert(allTasks.every(t=>t.dsaLanguage===null && t.programmingLanguage===null), `${domain}: DSA language leaked`);
  console.log(`PASS ${domain}: 6 unique month themes, valid hours, 2-3 tasks/day`);
}

const dsa = generateIntelligentRoadmap({userId:'dsa-beginner',domain:'dsa',timeline_months:3,daily_hours:2,userLevel:'BEGINNER',dsaLanguage:'C++'});
const firstWeeks = dsa.monthly_roadmap.flatMap(m=>m.weeks).slice(0,4).map(w=>w.skillId);
assert.deepStrictEqual(firstWeeks, ['dsa_programming_basics','dsa_control_flow','dsa_functions_arrays_strings','dsa_big_o_analysis'], 'DSA beginner prerequisite sequence incorrect');
console.log('PASS DSA beginner sequence: programming basics -> control flow -> functions/arrays/strings -> Big-O');

const app = fs.readFileSync('js/app.js','utf8');
const server = fs.readFileSync('server.js','utf8');
assert(app.includes('/api/task/status'), 'frontend task status API missing');
assert(app.includes('task-complete-toggle'), 'frontend task completion control missing');
assert(server.includes("parsedUrl.pathname === '/api/task/status'"), 'backend task status route missing');
assert(server.includes("roadmapDoc.markModified('monthly_roadmap')"), 'task status persistence missing');
console.log('PASS individual task completion: UI control + persistent backend route present');

console.log('=== V5 ROADMAP ALL-DOMAIN TESTS PASSED ===');
