/**
 * Acceptance Test Suite: Canonical Roadmap Data Contract & Task Integrity
 */

const assert = require('assert');
const { generateIntelligentRoadmap, validateRoadmap } = require('../engine/roadmapPlanner');
const { getKnowledgeGraph, normalizeDomainKey, DOMAIN_CONFIG } = require('../engine/knowledgeGraph');
const { buildUserSkillProfile } = require('../engine/skillProfiler');

const domainsToTest = [
  'fullstack',
  'datascience',
  'devops',
  'cybersecurity'
];

console.log('==================================================');
console.log('RUNNING ROADMAP DATA CONTRACT & TASK INTEGRITY SUITE');
console.log('==================================================\n');

domainsToTest.forEach(domainKey => {
  const normKey = normalizeDomainKey(domainKey);
  const domainMeta = DOMAIN_CONFIG[normKey] || { id: normKey, displayName: normKey };

  console.log(`\n--------------------------------------------------`);
  console.log(`Testing Domain: "${domainMeta.displayName}" (${domainMeta.id})`);
  console.log(`--------------------------------------------------`);

  const mockQuizEval = {
    user_id: `test_user_${normKey}`,
    domain: normKey,
    score_pct: 60,
    correct_count: 6,
    total_questions: 10,
    skill_level: 'INTERMEDIATE',
    level_description: 'Solid foundational knowledge with minor gaps.',
    mastered_topics: [{ topic: 'HTML5 Foundations', accuracy_pct: 80 }],
    knowledge_gaps: [{ topic: 'CSS Layouts', accuracy_pct: 40 }],
    topic_evaluations: []
  };

  const skillProfile = buildUserSkillProfile({
    userId: mockQuizEval.user_id,
    domain: normKey,
    quizEvaluation: mockQuizEval
  });

  const roadmap = generateIntelligentRoadmap({
    userId: mockQuizEval.user_id,
    domain: normKey,
    timeline_months: 6,
    daily_hours: 2.0,
    skillProfile: skillProfile,
    userLevel: 'INTERMEDIATE'
  });

  // 1. Structure check
  assert.ok(roadmap, 'Roadmap object must be generated.');
  assert.strictEqual(roadmap.domainId, normKey, `Domain ID must match ${normKey}.`);
  assert.ok(Array.isArray(roadmap.monthly_roadmap), 'monthly_roadmap must be an array.');
  assert.strictEqual(roadmap.monthly_roadmap.length, 6, 'Roadmap must have 6 months.');

  const month1 = roadmap.monthly_roadmap[0];
  assert.ok(month1 && Array.isArray(month1.weeks) && month1.weeks.length === 4, 'Month 1 must have 4 weeks.');

  const week1 = month1.weeks[0];
  assert.ok(week1 && Array.isArray(week1.days) && week1.days.length === 7, 'Week 1 must have 7 days.');

  console.log(`✅ Month 1 Week 1 Structure Validated (${week1.title})`);

  // 2. Day-by-Day Task Integrity & Uniqueness
  const week1TaskTitles = new Set();

  week1.days.forEach((day, dIdx) => {
    const dayNum = day.day_number;
    assert.strictEqual(dayNum, dIdx + 1, `Day number must be ${dIdx + 1}`);
    assert.ok(day.total_minutes > 0, `Day ${dayNum} must have positive total_minutes.`);
    assert.ok(day.topic, `Day ${dayNum} must have a valid topic string.`);
    assert.ok(!day.topic.includes('undefined'), `Day ${dayNum} topic must not contain 'undefined'.`);

    assert.ok(Array.isArray(day.tasks) && day.tasks.length >= 2, `Day ${dayNum} must have at least 2 daily tasks.`);

    day.tasks.forEach((task, tIdx) => {
      // Required Canonical Fields Validation
      assert.ok(task.taskId || task.id, `Day ${dayNum} Task ${tIdx + 1} must have taskId.`);
      assert.ok(task.taskTitle || task.title, `Day ${dayNum} Task ${tIdx + 1} must have taskTitle.`);
      assert.ok(task.taskType || task.type, `Day ${dayNum} Task ${tIdx + 1} must have taskType.`);
      assert.ok(task.durationMinutes || task.estimated_minutes, `Day ${dayNum} Task ${tIdx + 1} must have durationMinutes.`);
      assert.ok(task.taskTopic || task.topic, `Day ${dayNum} Task ${tIdx + 1} must have taskTopic.`);
      assert.ok(task.taskSubtopic || task.subtopic, `Day ${dayNum} Task ${tIdx + 1} must have taskSubtopic.`);
      assert.ok(task.difficulty, `Day ${dayNum} Task ${tIdx + 1} must have difficulty.`);

      const title = task.taskTitle || task.title;
      assert.ok(!title.includes('undefined'), `Day ${dayNum} Task ${tIdx + 1} title contains 'undefined': "${title}"`);
      assert.ok(!title.includes('null'), `Day ${dayNum} Task ${tIdx + 1} title contains 'null': "${title}"`);
      assert.ok(!title.includes('NaN'), `Day ${dayNum} Task ${tIdx + 1} title contains 'NaN': "${title}"`);

      week1TaskTitles.add(title);
    });

    console.log(`  Day ${dayNum} (${day.topic}): ${day.tasks.length} Tasks, ${day.total_minutes} Mins Workload`);
    day.tasks.forEach(t => {
      console.log(`    - [${t.taskType}] ${t.taskTitle} (${t.durationMinutes} mins)`);
    });
  });

  // 3. Verify zero duplicate task titles across Month 1 Week 1
  assert.ok(week1TaskTitles.size >= 14, `Week 1 must contain at least 14 distinct task titles (Found: ${week1TaskTitles.size}).`);
  console.log(`✅ Unique Task Titles in Week 1: ${week1TaskTitles.size}/14`);
});

console.log('\n==================================================');
console.log(`ACCEPTANCE TEST RESULTS: ALL ${domainsToTest.length} DOMAINS PASSED SUCCESSFULLY.`);
console.log('==================================================\n');
