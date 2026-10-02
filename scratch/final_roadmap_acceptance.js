const { getKnowledgeGraph, getAllSkillsInGraph } = require('../engine/knowledgeGraph');
const { buildUserSkillProfile } = require('../engine/skillProfiler');
const { generateIntelligentRoadmap, validateRoadmap, validateDailyTasks } = require('../engine/roadmapPlanner');
const { recalculateAdaptiveRoadmap } = require('../engine/adaptiveEngine');

const domains = ['fullstack','datascience','cybersecurity','devops','dsa','mobile','ai_llm','system_design'];
const levels = ['BEGINNER','INTERMEDIATE','ADVANCED'];

function flatten(roadmap) {
  return roadmap.monthly_roadmap.flatMap(m => m.weeks);
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('=== PLACIFY FINAL ROADMAP ACCEPTANCE ===');

for (const domain of domains) {
  const graph = getKnowledgeGraph(domain);
  assert(graph && getAllSkillsInGraph(graph).length >= 10, `${domain}: knowledge graph missing skills`);
  const starts = {};
  for (const level of levels) {
    const profile = buildUserSkillProfile({ userId:`${domain}_${level}`, domain, quizEvaluation:{score_pct: level==='BEGINNER'?20:level==='INTERMEDIATE'?65:90, skill_level:level} });
    const rm = generateIntelligentRoadmap({ userId:`${domain}_${level}`, domain, timeline_months:2, daily_hours:2, skillProfile:profile, userLevel:level });
    const v = validateRoadmap(rm);
    assert(v.valid, `${domain}/${level}: ${v.errors.join('; ')}`);
    const weeks = flatten(rm);
    assert(weeks.length===8, `${domain}/${level}: expected 8 weeks`);
    starts[level] = weeks.slice(0,4).map(w=>w.skillId).join('|');
    const d1 = weeks[0].days[0];
    assert(d1.tasks.length===2, `${domain}/${level}: 2h/day should create 2 tasks`);
    assert(d1.tasks.every(t=>t.skillId && t.subtopic), `${domain}/${level}: task taxonomy incomplete`);
    assert(d1.tasks[0].title !== weeks[0].days[2].tasks[0].title || d1.tasks[0].taskType !== weeks[0].days[2].tasks[0].taskType, `${domain}/${level}: daily activities repeat`);
  }
  assert(new Set(Object.values(starts)).size===3, `${domain}: levels are not differentiated: ${JSON.stringify(starts)}`);
  console.log(`PASS ${domain}: ${graph.domainName} | 3 distinct levels`);
}

// Quiz-gap personalization: same declared level, different weak skills => different first focus.
{
  const skills = getAllSkillsInGraph(getKnowledgeGraph('dsa'));
  const a = skills[0], b = skills[Math.min(5, skills.length-1)];
  const mk = (weak) => buildUserSkillProfile({
    userId:`gap_${weak.skillId}`, domain:'dsa',
    quizEvaluation:{skill_level:'INTERMEDIATE', score_pct:55, answers:[
      {skillId:weak.skillId, is_correct:false},
      ...skills.slice(1,5).filter(s=>s.skillId!==weak.skillId).map(s=>({skillId:s.skillId,is_correct:true}))
    ]}
  });
  const r1 = generateIntelligentRoadmap({userId:'gap1',domain:'dsa',timeline_months:2,daily_hours:2,skillProfile:mk(a),userLevel:'INTERMEDIATE',quizEvaluation:{skill_level:'INTERMEDIATE'}});
  const r2 = generateIntelligentRoadmap({userId:'gap2',domain:'dsa',timeline_months:2,daily_hours:2,skillProfile:mk(b),userLevel:'INTERMEDIATE',quizEvaluation:{skill_level:'INTERMEDIATE'}});
  assert(r1.quiz_aligned && r2.quiz_aligned, 'quiz_aligned flag missing');
  assert(r1.monthly_roadmap[0].focus_skills[0].skillId !== r2.monthly_roadmap[0].focus_skills[0].skillId, 'quiz gaps do not change focus');
  console.log('PASS quiz-gap personalization changes roadmap focus');
}

// Zero score must remain zero, not become 100% through || fallbacks.
{
  const p = buildUserSkillProfile({userId:'zero',domain:'dsa',quizEvaluation:{skill_level:'BEGINNER',topic_evaluations:[{topic:'Arrays, Hash Maps & Two Pointers',score_pct:0,correct_count:0,total_questions:5}]}});
  const arr = p.skills.find(s=>s.topic === 'Arrays, Hash Maps & Two Pointers');
  assert(arr && arr.masteryScore === 0 && arr.evidence.correct === 0 && arr.evidence.total === 5, 'zero-score evidence bug remains');
  console.log('PASS zero-score quiz evidence');
}

// Daily workload and week estimate are internally consistent.
{
  const rm = generateIntelligentRoadmap({userId:'hours',domain:'fullstack',timeline_months:1,daily_hours:3,skillProfile:null,userLevel:'INTERMEDIATE'});
  for (const w of flatten(rm)) {
    const actual = w.days.reduce((s,d)=>s+d.estimated_minutes,0)/60;
    assert(Math.abs(actual-w.estimated_hours)<0.01, 'week estimated_hours mismatch');
    assert(w.days.slice(0,6).every(d=>d.estimated_minutes===180), '3h/day workload not filled correctly');
    assert(w.days.every(d=>d.tasks.length >= 2 && d.tasks.length <= 3), 'every day must contain 2-3 tasks');
  }
  console.log('PASS daily-hours workload + week estimates');
}

console.log('=== ALL FINAL ROADMAP TESTS PASSED ===');

(async () => {
  const profile = buildUserSkillProfile({userId:'adaptive',domain:'dsa',quizEvaluation:{skill_level:'INTERMEDIATE',score_pct:60}});
  const base = generateIntelligentRoadmap({userId:'adaptive',domain:'dsa',timeline_months:1,daily_hours:2,skillProfile:profile,userLevel:'INTERMEDIATE'});
  const completed = base.monthly_roadmap[0].weeks[0].days[0].tasks[0];
  completed.status = 'COMPLETED'; completed.completed = true;
  const fakeProfileModel = { findOneAndUpdate: async () => ({}) };
  const fakeRoadmapModel = { findOneAndUpdate: async (q, update) => update };
  const adapted = await recalculateAdaptiveRoadmap({
    user:{user_id:'adaptive',chosen_domain:'dsa',timeline_months:1,daily_hours:2,current_skill_level:'INTERMEDIATE'},
    skillProfile:profile,
    currentRoadmap:base,
    taskCompletionData:null,
    dbModels:{UserSkillProfile:fakeProfileModel,Roadmap:fakeRoadmapModel}
  });
  const preserved = adapted.monthly_roadmap.flatMap(m=>m.weeks).flatMap(w=>w.days).flatMap(d=>d.tasks).some(t=>t.skillId===completed.skillId && t.subtopic===completed.subtopic && t.taskType===completed.taskType && t.status==='COMPLETED');
  assert(preserved, 'adaptive replanning did not preserve a completed semantic task');
  assert(adapted.curriculum_version==='v4_adaptive_replanned', 'adaptive roadmap version not updated');
  console.log('PASS adaptive replanning preserves completed work');
})().catch(err => { console.error(err); process.exitCode=1; });
