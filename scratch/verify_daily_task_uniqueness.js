const { getKnowledgeGraph } = require('../engine/knowledgeGraph');
const { buildUserSkillProfile } = require('../engine/skillProfiler');
const { generateIntelligentRoadmap, validateRoadmap, validateDailyTasks } = require('../engine/roadmapPlanner');

const testCases = [
  {
    domain: 'datascience',
    domainName: 'Data Science & Machine Learning',
    timeline_months: 5,
    daily_hours: 2.5,
    userLevel: 'BEGINNER'
  },
  {
    domain: 'fullstack',
    domainName: 'Full-Stack Web Development',
    timeline_months: 4,
    daily_hours: 2.0,
    userLevel: 'BEGINNER'
  },
  {
    domain: 'cybersecurity',
    domainName: 'Cybersecurity & Ethical Hacking',
    timeline_months: 3,
    daily_hours: 2.0,
    userLevel: 'INTERMEDIATE'
  },
  {
    domain: 'devops',
    domainName: 'Cloud Engineering & DevOps',
    timeline_months: 3,
    daily_hours: 2.0,
    userLevel: 'ADVANCED'
  }
];

console.log('================================================================');
console.log('VERIFYING DAILY TASK UNICITY & CONCEPT ALLOCATION ACROSS DOMAINS');
console.log('================================================================\n');

let allPassed = true;

testCases.forEach(({ domain, domainName, timeline_months, daily_hours, userLevel }) => {
  console.log(`\n------------------------------------------------------------`);
  console.log(`TESTING DOMAIN: "${domainName}" (${domain})`);
  console.log(`Params: Level=${userLevel}, Timeline=${timeline_months}m, Hours=${daily_hours}h/day`);
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

  // 2. Inspect Month 1 -> Week 1 -> Days 1-7
  const month1 = roadmap.monthly_roadmap[0];
  const week1 = month1.weeks[0];

  console.log(`\n--- Month 1: "${month1.title}" ---`);
  console.log(`--- Week 1: "${week1.title}" ---`);
  console.log(`Daily Topic Distribution for Week 1:`);

  const week1Topics = [];
  week1.days.forEach(d => {
    week1Topics.push(d.topic);
    console.log(`  Day ${d.day_number}: "${d.topic}"`);
    console.log(`    Task 1: [${d.tasks[0].taskType}] ${d.tasks[0].title}`);
    console.log(`    Task 2: [${d.tasks[1].taskType}] ${d.tasks[1].title}`);
  });

  // Check Days 1-6 uniqueness
  const days1to6Topics = week1Topics.slice(0, 6);
  const uniqueDays1to6 = new Set(days1to6Topics.map(t => t.toLowerCase().trim()));

  if (uniqueDays1to6.size === 6) {
    console.log(`✅ SUCCESS: Week 1 has 6 100% UNIQUE daily topics for Days 1-6!`);
  } else {
    console.error(`❌ FAILURE: Duplicate topics found in Days 1-6! Unique count: ${uniqueDays1to6.size}/6`);
    allPassed = false;
  }

  // Check Day 7 Assessment
  const day7Task = week1.days[6].tasks.find(t => t.taskStage === 'ASSESSMENT' || t.taskType === 'ASSESSMENT');
  if (day7Task) {
    console.log(`✅ SUCCESS: Day 7 contains required Capstone Assessment task ("${day7Task.title}")`);
  } else {
    console.error(`❌ FAILURE: Day 7 is missing Capstone Assessment task!`);
    allPassed = false;
  }

  // 3. Scan ENTIRE roadmap for any duplicate daily topic within ANY week
  let duplicateTopicFoundAnywhere = false;
  roadmap.monthly_roadmap.forEach(m => {
    m.weeks.forEach(w => {
      const dailyTopicsInWeek = new Set();
      w.days.forEach(d => {
        if (d.day_number % 7 !== 0) { // Days 1-6
          const norm = d.topic.toLowerCase().trim();
          if (dailyTopicsInWeek.has(norm)) {
            duplicateTopicFoundAnywhere = true;
            console.error(`❌ DUPLICATE DETECTED in Month ${m.month_number} Week ${w.week_number} Day ${d.day_number}: "${d.topic}"`);
          } else {
            dailyTopicsInWeek.add(norm);
          }
        }
      });
    });
  });

  if (!duplicateTopicFoundAnywhere) {
    console.log(`✅ GLOBAL CHECK PASSED: Zero duplicate daily topics across ALL ${roadmap.monthly_roadmap.length * 4} weeks!`);
  } else {
    allPassed = false;
  }
});

console.log('\n================================================================');
if (allPassed) {
  console.log('🎉 ALL ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
} else {
  console.error('❌ SOME ACCEPTANCE TESTS FAILED!');
}
console.log('================================================================');
