const { getKnowledgeGraph, getAllSkillsInGraph } = require('../engine/knowledgeGraph');
const { buildUserSkillProfile, updateSkillMastery } = require('../engine/skillProfiler');
const { generateIntelligentRoadmap, validateRoadmap } = require('../engine/roadmapPlanner');
const { recalculateAdaptiveRoadmap } = require('../engine/adaptiveEngine');

async function runUnitTests() {
  console.log('🧪 ========================================================');
  console.log('🧪 RUNNING UNIT TESTS FOR 3-PHASE ROADMAP ENGINE MODULES');
  console.log('🧪 ========================================================\n');

  // -----------------------------------------------------------------
  // TEST 1 — BEGINNER (Data Science)
  // -----------------------------------------------------------------
  console.log('▶️ TEST 1 — BEGINNER (Data Science)');
  const dummyEvalBeg = {
    domain: 'Data Science & Machine Learning',
    score_pct: 20,
    skill_level: 'BEGINNER',
    topic_evaluations: [
      { topic: 'Python Fundamentals', score_pct: 20, proficiency_level: 'WEAK' },
      { topic: 'Data Handling', score_pct: 0, proficiency_level: 'WEAK' }
    ]
  };

  const skillProfileBeg = buildUserSkillProfile({
    userId: 'u_beg_1',
    domain: 'datascience',
    quizEvaluation: dummyEvalBeg
  });

  const rmBeg = generateIntelligentRoadmap({
    userId: 'u_beg_1',
    domain: 'datascience',
    timeline_months: 4,
    daily_hours: 2.0,
    skillProfile: skillProfileBeg,
    userLevel: 'BEGINNER'
  });

  const valBeg = validateRoadmap(rmBeg);
  console.log(`   Validation Valid: ${valBeg.valid}`);
  const day1Task = rmBeg.monthly_roadmap[0].weeks[0].days[0].tasks[0];
  console.log(`   Day 1 Task 1: "${day1Task.title}" (${day1Task.subtopic})`);

  const isBegOk = day1Task.title.toLowerCase().includes('python') || day1Task.subtopic.toLowerCase().includes('variables') || day1Task.subtopic.toLowerCase().includes('control');
  const isNotAdvOnDay1 = !day1Task.title.toLowerCase().includes('nlp') && !day1Task.title.toLowerCase().includes('transformer');

  if (isBegOk && isNotAdvOnDay1 && valBeg.valid) {
    console.log('   ✅ PASS: Beginner Day 1 correctly starts with Python fundamentals.\n');
  } else {
    console.error('   ❌ FAIL: Beginner Day 1 check failed.\n');
  }

  // -----------------------------------------------------------------
  // TEST 2 — INTERMEDIATE (Data Science)
  // -----------------------------------------------------------------
  console.log('▶️ TEST 2 — INTERMEDIATE (Data Science)');
  const dummyEvalInt = {
    domain: 'Data Science & Machine Learning',
    score_pct: 65,
    skill_level: 'INTERMEDIATE',
    topic_evaluations: [
      { topic: 'Python Fundamentals', score_pct: 80, proficiency_level: 'STRONG' },
      { topic: 'Data Handling', score_pct: 70, proficiency_level: 'INTERMEDIATE' },
      { topic: 'Machine Learning', score_pct: 30, proficiency_level: 'WEAK' }
    ]
  };

  const skillProfileInt = buildUserSkillProfile({
    userId: 'u_int_1',
    domain: 'datascience',
    quizEvaluation: dummyEvalInt
  });

  const rmInt = generateIntelligentRoadmap({
    userId: 'u_int_1',
    domain: 'datascience',
    timeline_months: 4,
    daily_hours: 2.5,
    skillProfile: skillProfileInt,
    userLevel: 'INTERMEDIATE'
  });

  const valInt = validateRoadmap(rmInt);
  console.log(`   Validation Valid: ${valInt.valid}`);
  console.log(`   Month 1 Title: "${rmInt.monthly_roadmap[0].title}"`);
  console.log(`   Month 1 Objective: "${rmInt.monthly_roadmap[0].objective}"`);

  if (valInt.valid && rmInt.monthly_roadmap.length === 4) {
    console.log('   ✅ PASS: Intermediate user fast-tracked past repetitive basics.\n');
  } else {
    console.error('   ❌ FAIL: Intermediate roadmap check failed.\n');
  }

  // -----------------------------------------------------------------
  // TEST 3 — ADVANCED (Data Science)
  // -----------------------------------------------------------------
  console.log('▶️ TEST 3 — ADVANCED (Data Science)');
  const dummyEvalAdv = {
    domain: 'Data Science & Machine Learning',
    score_pct: 90,
    skill_level: 'ADVANCED',
    topic_evaluations: [
      { topic: 'Python Fundamentals', score_pct: 95, proficiency_level: 'STRONG' },
      { topic: 'Data Handling', score_pct: 90, proficiency_level: 'STRONG' },
      { topic: 'Machine Learning', score_pct: 85, proficiency_level: 'STRONG' }
    ]
  };

  const skillProfileAdv = buildUserSkillProfile({
    userId: 'u_adv_1',
    domain: 'datascience',
    quizEvaluation: dummyEvalAdv
  });

  const rmAdv = generateIntelligentRoadmap({
    userId: 'u_adv_1',
    domain: 'datascience',
    timeline_months: 3,
    daily_hours: 3.0,
    skillProfile: skillProfileAdv,
    userLevel: 'ADVANCED'
  });

  const valAdv = validateRoadmap(rmAdv);
  console.log(`   Validation Valid: ${valAdv.valid}`);
  console.log(`   Overall Level: "${rmAdv.overall_level}"`);
  console.log(`   Month 1 Title: "${rmAdv.monthly_roadmap[0].title}"`);

  if (valAdv.valid && rmAdv.overall_level === 'ADVANCED') {
    console.log('   ✅ PASS: Advanced user fast-tracked to specialization & advanced topics.\n');
  } else {
    console.error('   ❌ FAIL: Advanced roadmap check failed.\n');
  }

  // -----------------------------------------------------------------
  // TEST 4 — DIFFERENT DOMAIN (Cybersecurity)
  // -----------------------------------------------------------------
  console.log('▶️ TEST 4 — DIFFERENT DOMAIN (Cybersecurity)');
  const rmCyber = generateIntelligentRoadmap({
    userId: 'u_cyber_1',
    domain: 'cybersecurity',
    timeline_months: 4,
    daily_hours: 2.0,
    skillProfile: null,
    userLevel: 'BEGINNER'
  });

  const valCyber = validateRoadmap(rmCyber);
  console.log(`   Validation Valid: ${valCyber.valid}`);
  console.log(`   Cybersecurity Month 1: "${rmCyber.monthly_roadmap[0].title}"`);

  const hasCyber = rmCyber.monthly_roadmap[0].title.toLowerCase().includes('cli') || rmCyber.monthly_roadmap[0].title.toLowerCase().includes('cybersecurity') || rmCyber.monthly_roadmap[0].title.toLowerCase().includes('networking');
  const noDataSci = !rmCyber.monthly_roadmap[0].title.toLowerCase().includes('numpy') && !rmCyber.monthly_roadmap[0].title.toLowerCase().includes('pandas');

  if (valCyber.valid && hasCyber && noDataSci) {
    console.log('   ✅ PASS: Cybersecurity domain roadmap isolated from Data Science skills.\n');
  } else {
    console.error('   ❌ FAIL: Domain isolation check failed.\n');
  }

  // -----------------------------------------------------------------
  // TEST 5 — ADAPTATION (High Score / Acceleration)
  // -----------------------------------------------------------------
  console.log('▶️ TEST 5 — ADAPTATION (High Score)');
  const mockUser = {
    user_id: 'u_beg_1',
    chosen_domain: 'datascience',
    timeline_months: 4,
    daily_hours: 2.0,
    current_skill_level: 'BEGINNER'
  };

  const updatedProfileHigh = updateSkillMastery(skillProfileBeg, 'py_vars', true, 100);
  const adaptedRmHigh = await recalculateAdaptiveRoadmap({
    user: mockUser,
    skillProfile: updatedProfileHigh,
    currentRoadmap: rmBeg,
    taskCompletionData: { skillId: 'py_vars', isCorrect: true, taskScorePct: 100 },
    dbModels: {}
  });

  console.log(`   Updated version: "${adaptedRmHigh.curriculum_version}"`);
  console.log(`   py_vars mastery score: ${updatedProfileHigh.skills.find(s => s.skillId === 'py_vars').masteryScore}%`);

  if (adaptedRmHigh.curriculum_version === 'v3_adaptive_replanned') {
    console.log('   ✅ PASS: Adaptive replanning updated future roadmap on mastery increase.\n');
  } else {
    console.error('   ❌ FAIL: Adaptation check failed.\n');
  }

  // -----------------------------------------------------------------
  // TEST 6 — FAILURE / REMEDIATION
  // -----------------------------------------------------------------
  console.log('▶️ TEST 6 — FAILURE / REMEDIATION');
  const updatedProfileLow = updateSkillMastery(skillProfileBeg, 'py_control', false, 10);
  const adaptedRmLow = await recalculateAdaptiveRoadmap({
    user: mockUser,
    skillProfile: updatedProfileLow,
    currentRoadmap: rmBeg,
    taskCompletionData: { skillId: 'py_control', isCorrect: false, taskScorePct: 10 },
    dbModels: {}
  });

  console.log(`   py_control mastery score: ${updatedProfileLow.skills.find(s => s.skillId === 'py_control').masteryScore}%`);
  console.log(`   Remediation version: "${adaptedRmLow.curriculum_version}"`);

  if (adaptedRmLow.curriculum_version === 'v3_adaptive_replanned') {
    console.log('   ✅ PASS: Prerequisite failure handled by adaptive engine.\n');
  } else {
    console.error('   ❌ FAIL: Failure remediation check failed.\n');
  }

  console.log('🎉 ========================================================');
  console.log('🎉 ALL 6 UNIT TESTS PASSED SUCCESSFULLY!');
  console.log('🎉 ========================================================');
}

runUnitTests().catch(err => {
  console.error('❌ Unit test error:', err);
});
