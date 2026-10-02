const { getKnowledgeGraph } = require('../engine/knowledgeGraph');
const { buildUserSkillProfile } = require('../engine/skillProfiler');
const { generateIntelligentRoadmap } = require('../engine/roadmapPlanner');

const testDomains = [
  { key: 'fullstack', name: 'Full-Stack Web Development' },
  { key: 'datascience', name: 'Data Science & Machine Learning' },
  { key: 'cybersecurity', name: 'Cybersecurity & Ethical Hacking' }
];

console.log('================================================================');
console.log('TRACING COMPLETE ROADMAP PIPELINE FOR 3 DOMAINS');
console.log('================================================================\n');

testDomains.forEach(({ key, name }) => {
  console.log(`\n------------------------------------------------------------`);
  console.log(`DOMAIN: ${name} (${key})`);
  console.log(`------------------------------------------------------------`);

  // 1. Mock diagnostic quiz evaluation
  const mockQuizEval = {
    domain: key,
    score_pct: 60,
    skill_level: 'INTERMEDIATE',
    answers: [
      { topic: 'Linux', subtopic: 'Permissions', is_correct: true },
      { topic: 'Networking', subtopic: 'TCP/IP', is_correct: false }
    ]
  };

  // 2. Knowledge Graph
  const graph = getKnowledgeGraph(key);
  console.log(`Knowledge Graph Domain Name: "${graph.domainName}" (${graph.domainId})`);
  console.log(`Knowledge Graph Topics Count: ${graph.topics ? graph.topics.length : 0}`);
  if (graph.topics) {
    graph.topics.forEach((t, i) => {
      console.log(`  Topic ${i+1}: "${t.name}" (subtopics: ${t.subtopics ? t.subtopics.length : 0})`);
      if (t.subtopics) {
        t.subtopics.forEach(s => {
          console.log(`    Subtopic: "${s.name}" (skills: ${s.skills ? s.skills.length : 0})`);
          if (s.skills) {
            s.skills.forEach(sk => {
              console.log(`      Skill: ${sk.skillId} - "${sk.skillName}" (subskills: ${sk.subskills ? sk.subskills.length : 0})`);
            });
          }
        });
      }
    });
  }

  // 3. Skill Profile
  const skillProfile = buildUserSkillProfile({
    userId: `user_${key}`,
    domain: key,
    quizEvaluation: mockQuizEval
  });
  console.log(`\nMastery Profile (Total Skills in Profile: ${skillProfile.skills.length}):`);
  skillProfile.skills.forEach(sk => {
    console.log(`  - [${sk.skillId}] ${sk.skillName}: score=${sk.masteryScore}%, tier=${sk.masteryTier}, level=${sk.level}`);
  });

  // 4. Roadmap Generation
  const roadmap = generateIntelligentRoadmap({
    userId: `user_${key}`,
    domain: key,
    timeline_months: 3,
    daily_hours: 2.0,
    skillProfile,
    userLevel: 'INTERMEDIATE'
  });

  console.log(`\nGenerated Roadmap Structure:`);
  console.log(`  - Domain: ${roadmap.domain}`);
  console.log(`  - Timeline: ${roadmap.timeline_months} Months`);
  console.log(`  - Monthly Roadmap Length: ${roadmap.monthly_roadmap.length}`);

  roadmap.monthly_roadmap.forEach(m => {
    console.log(`\n  Month ${m.month_number}: "${m.title}"`);
    console.log(`    Goal: ${m.objective}`);
    console.log(`    Topics: ${m.topics.join(', ')}`);
    console.log(`    Subtopics: ${m.subtopics.join(', ')}`);
    m.weeks.forEach(w => {
      console.log(`      Week ${w.week_number}: "${w.title}" (SkillId: ${w.skillId})`);
      const d1 = w.days[0];
      const d7 = w.days[6];
      if (d1 && d1.tasks[0]) {
        console.log(`        Day ${d1.day_number} Task 1: [${d1.tasks[0].id}] ${d1.tasks[0].title} (topic: ${d1.tasks[0].topic}, subtopic: ${d1.tasks[0].subtopic})`);
      }
      if (d7 && d7.tasks[0]) {
        console.log(`        Day ${d7.day_number} Task 1: [${d7.tasks[0].id}] ${d7.tasks[0].title}`);
      }
    });
  });
});
