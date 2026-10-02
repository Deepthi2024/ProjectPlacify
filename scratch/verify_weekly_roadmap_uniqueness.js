const { getKnowledgeGraph } = require('../engine/knowledgeGraph');
const { buildUserSkillProfile } = require('../engine/skillProfiler');
const { generateIntelligentRoadmap, validateRoadmap } = require('../engine/roadmapPlanner');

const testCases = [
  {
    domain: 'devops',
    domainName: 'Cloud Engineering & DevOps',
    timeline_months: 6,
    daily_hours: 2.5,
    userLevel: 'BEGINNER'
  },
  {
    domain: 'datascience',
    domainName: 'Data Science & Machine Learning',
    timeline_months: 5,
    daily_hours: 2.0,
    userLevel: 'BEGINNER'
  },
  {
    domain: 'fullstack',
    domainName: 'Full-Stack Web Development',
    timeline_months: 4,
    daily_hours: 2.0,
    userLevel: 'INTERMEDIATE'
  },
  {
    domain: 'cybersecurity',
    domainName: 'Cybersecurity & Ethical Hacking',
    timeline_months: 3,
    daily_hours: 2.0,
    userLevel: 'ADVANCED'
  }
];

console.log('================================================================');
console.log('VERIFYING WEEKLY & DAILY ROADMAP ALLOCATION ACROSS 4 DOMAINS');
console.log('================================================================\n');

let allPassed = true;

testCases.forEach(({ domain, domainName, timeline_months, daily_hours, userLevel }) => {
  console.log(`\n------------------------------------------------------------`);
  console.log(`TESTING DOMAIN: "${domainName}" (${domain})`);
  console.log(`Params: Level=${userLevel}, Timeline=${timeline_months}m (${timeline_months * 4} Weeks), Hours=${daily_hours}h/day`);
  console.log(`------------------------------------------------------------`);

  const mockQuizEval = {
    domain,
    score_pct: userLevel === 'BEGINNER' ? 0 : (userLevel === 'INTERMEDIATE' ? 50 : 85),
    skill_level: userLevel
  };

  const skillProfile = buildUserSkillProfile({
    userId: `user_${domain}`,
    domain,
    quizEvaluation: mockQuizEval
  });

  const roadmap = generateIntelligentRoadmap({
    userId: `user_${domain}`,
    domain,
    timeline_months,
    daily_hours,
    skillProfile,
    userLevel
  });

  // 1. Validate complete roadmap structure
  const valResult = validateRoadmap(roadmap);
  console.log(`Validation Passed: ${valResult.valid} (Errors: ${valResult.errors.length})`);

  if (!valResult.valid) {
    console.error('Validation errors:', valResult.errors);
    allPassed = false;
  }

  // 2. Inspect Month 1 -> Weeks 1-4
  const month1 = roadmap.monthly_roadmap[0];
  console.log(`\n--- Month 1: "${month1.title}" ---`);
  console.log(`Weekly Allocation for Month 1:`);

  const month1WeekTopics = [];
  month1.weeks.forEach(w => {
    const topicStr = w.subtopics[0] || w.title;
    month1WeekTopics.push(topicStr);
    console.log(`  Week ${w.week_number}: conceptId: "${w.skillId}", title: "${topicStr}"`);
  });

  // Check Month 1 Weeks Uniqueness
  const uniqueMonth1Weeks = new Set(month1WeekTopics.map(t => t.toLowerCase().trim()));
  if (uniqueMonth1Weeks.size === 4) {
    console.log(`✅ SUCCESS: Month 1 has 4 100% UNIQUE weekly concepts!`);
  } else {
    console.error(`❌ FAILURE: Duplicate weekly concepts found in Month 1! Unique count: ${uniqueMonth1Weeks.size}/4`);
    allPassed = false;
  }

  // 3. Inspect Week 1 -> Days 1-7
  const week1 = month1.weeks[0];
  console.log(`\nDaily Allocation for Week 1 ("${week1.title}"):`);
  const week1DailyTopics = [];
  week1.days.forEach(d => {
    week1DailyTopics.push(d.topic);
    console.log(`  Day ${d.day_number}: "${d.topic}"`);
    console.log(`    Task 1: [${d.tasks[0].taskType}] ${d.tasks[0].title}`);
    console.log(`    Task 2: [${d.tasks[1].taskType}] ${d.tasks[1].title}`);
  });

  const days1to6 = week1DailyTopics.slice(0, 6);
  const uniqueDays1to6 = new Set(days1to6.map(t => t.toLowerCase().trim()));
  if (uniqueDays1to6.size === 6) {
    console.log(`✅ SUCCESS: Week 1 has 6 100% UNIQUE daily topics for Days 1-6!`);
  } else {
    console.error(`❌ FAILURE: Duplicate daily topics in Days 1-6! Unique count: ${uniqueDays1to6.size}/6`);
    allPassed = false;
  }

  // 4. Scan ENTIRE roadmap across all weeks for duplicate concept keys
  let totalWeeks = 0;
  const globalAssignedConcepts = new Set();
  let duplicateWeeklyFound = false;

  roadmap.monthly_roadmap.forEach(m => {
    m.weeks.forEach(w => {
      totalWeeks++;
      const rawTitle = (w.subtopics[0] || w.title || '').replace(/^Week \d+:\s*/i, '').trim().toLowerCase();
      const cKey = `${w.baseSkillId || w.skillId}::${rawTitle}`;
      if (globalAssignedConcepts.has(cKey)) {
        console.error(`❌ DUPLICATE WEEK CONCEPT: "${rawTitle}" in Month ${m.month_number} Week ${w.week_number}`);
        duplicateWeeklyFound = true;
      } else {
        globalAssignedConcepts.add(cKey);
      }
    });
  });

  if (!duplicateWeeklyFound) {
    console.log(`✅ GLOBAL WEEK CHECK PASSED: All ${totalWeeks} weeks across ${timeline_months} months have 100% UNIQUE concepts!`);
  } else {
    allPassed = false;
  }
});

console.log('\n================================================================');
if (allPassed) {
  console.log('🎉 ALL WEEKLY & DAILY ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
} else {
  console.error('❌ SOME ACCEPTANCE TESTS FAILED!');
}
console.log('================================================================');
