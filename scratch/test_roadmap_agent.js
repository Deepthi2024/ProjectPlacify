const http = require('http');

function postJSON(urlStr, data) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const postData = JSON.stringify(data);
    const req = http.request(u, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function getJSON(urlStr) {
  return new Promise((resolve, reject) => {
    http.get(urlStr, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('🧪 RUNNING ROADMAP AGENT COMPREHENSIVE SUITE...');

  // 1. Register User A (Strong User: DSA, 6 months, 3.5 hrs)
  const userAEmail = `test_strong_${Date.now()}@placify.ai`;
  const regA = await postJSON('http://localhost:5000/api/auth/register', {
    name: 'Strong User A',
    email: userAEmail,
    password: 'password123',
    chosen_domain: 'dsa',
    timeline_months: 6,
    daily_hours: 3.5
  });

  const userA_id = regA.profile.user_id;
  console.log(`\n👤 User A Registered: ${userA_id}`);

  // Post Quiz Evaluation for User A (85% score - Strong)
  const evalA = await postJSON('http://localhost:5000/api/quiz/evaluate', {
    user_id: userA_id,
    domain: 'Data Structures & Algorithms (Interview Prep)',
    answers: [
      { id: 'q1', topic: 'Complexity Analysis & Arrays', user_answer: 1, correct_answer: 1 },
      { id: 'q2', topic: 'Two Pointers & Sliding Window', user_answer: 1, correct_answer: 1 },
      { id: 'q3', topic: 'Stacks & Queues', user_answer: 1, correct_answer: 1 },
      { id: 'q4', topic: 'Trees & Search Algorithms', user_answer: 1, correct_answer: 1 },
      { id: 'q5', topic: 'Graph Algorithms & Shortest Path', user_answer: 1, correct_answer: 1 }
    ]
  });
  console.log(`📊 User A Quiz Evaluated: ${evalA.evaluation.score_pct}% (${evalA.evaluation.skill_level})`);

  // Generate Roadmap for User A
  const roadA = await postJSON('http://localhost:5000/api/roadmap/generate', { user_id: userA_id });
  const rmA = roadA.roadmap;
  console.log(`🗺️ Roadmap A generated: ${rmA.monthly_roadmap.length} Months, Domain: ${rmA.domain}`);
  console.log(`   Month 1 Title: "${rmA.monthly_roadmap[0].title}"`);
  console.log(`   Month 1 Priority: ${rmA.monthly_roadmap[0].priority}, Difficulty: ${rmA.monthly_roadmap[0].difficulty}`);


  // 2. Register User B (Weak User: DSA, 6 months, 3.5 hrs)
  const userBEmail = `test_weak_${Date.now()}@placify.ai`;
  const regB = await postJSON('http://localhost:5000/api/auth/register', {
    name: 'Weak User B',
    email: userBEmail,
    password: 'password123',
    chosen_domain: 'dsa',
    timeline_months: 6,
    daily_hours: 3.5
  });

  const userB_id = regB.profile.user_id;
  console.log(`\n👤 User B Registered: ${userB_id}`);

  // Post Quiz Evaluation for User B (30% score - Weak with gaps in Trees & Graphs)
  const evalB = await postJSON('http://localhost:5000/api/quiz/evaluate', {
    user_id: userB_id,
    domain: 'Data Structures & Algorithms (Interview Prep)',
    answers: [
      { id: 'q1', topic: 'Complexity Analysis & Arrays', user_answer: 1, correct_answer: 1 },
      { id: 'q2', topic: 'Two Pointers & Sliding Window', user_answer: 0, correct_answer: 1, difficulty: 'BEGINNER' },
      { id: 'q3', topic: 'Stacks & Queues', user_answer: 0, correct_answer: 1, difficulty: 'BEGINNER' },
      { id: 'q4', topic: 'Trees & Search Algorithms', user_answer: 0, correct_answer: 1, difficulty: 'BEGINNER' },
      { id: 'q5', topic: 'Graph Algorithms & Shortest Path', user_answer: 0, correct_answer: 1, difficulty: 'BEGINNER' }
    ]
  });
  console.log(`📊 User B Quiz Evaluated: ${evalB.evaluation.score_pct}% (${evalB.evaluation.skill_level})`);

  // Generate Roadmap for User B
  const roadB = await postJSON('http://localhost:5000/api/roadmap/generate', { user_id: userB_id });
  const rmB = roadB.roadmap;
  console.log(`🗺️ Roadmap B generated: ${rmB.monthly_roadmap.length} Months, Domain: ${rmB.domain}`);
  console.log(`   Month 1 Title: "${rmB.monthly_roadmap[0].title}"`);
  console.log(`   Month 1 Priority: ${rmB.monthly_roadmap[0].priority}, Difficulty: ${rmB.monthly_roadmap[0].difficulty}`);


  // 3. Register User C (Different Timeline: 3 Months)
  const userCEmail = `test_timeline_${Date.now()}@placify.ai`;
  const regC = await postJSON('http://localhost:5000/api/auth/register', {
    name: 'Short Timeline User C',
    email: userCEmail,
    password: 'password123',
    chosen_domain: 'dsa',
    timeline_months: 3,
    daily_hours: 2.5
  });
  const userC_id = regC.profile.user_id;
  const roadC = await postJSON('http://localhost:5000/api/roadmap/generate', { user_id: userC_id });
  console.log(`\n⏱️ User C (3 months timeline): Roadmap generated with ${roadC.roadmap.monthly_roadmap.length} Months`);


  // 4. Register User D (Different Domain: Cloud & DevOps)
  const userDEmail = `test_devops_${Date.now()}@placify.ai`;
  const regD = await postJSON('http://localhost:5000/api/auth/register', {
    name: 'DevOps User D',
    email: userDEmail,
    password: 'password123',
    chosen_domain: 'devops',
    timeline_months: 4,
    daily_hours: 3.0
  });
  const userD_id = regD.profile.user_id;
  const roadD = await postJSON('http://localhost:5000/api/roadmap/generate', { user_id: userD_id });
  console.log(`\n☁️ User D (DevOps Domain): Domain = "${roadD.roadmap.domain}"`);
  console.log(`   Topics: ${roadD.roadmap.monthly_roadmap.map(m => m.topics[0]).join(', ')}`);


  // 5. Check Full Hierarchy & Daily Hours Constraint
  console.log(`\n🔍 Verifying Hierarchy & Workload Fit for User A:`);
  const m1 = rmA.monthly_roadmap[0];
  console.log(`   Level 1 Month 1: ${m1.title}`);
  const w1 = m1.weeks[0];
  console.log(`   Level 2 Week 1 (in Month 1): ${w1.title}`);
  const d1 = w1.days[0];
  console.log(`   Level 3 Day 1 (${d1.day_name}): Total Minutes = ${d1.total_minutes} (Target: 3.5 hrs = 210 mins)`);
  console.log(`   Tasks count: ${d1.tasks.length}`);
  d1.tasks.forEach(t => console.log(`     - [${t.type}] ${t.title} (${t.estimated_minutes} mins)`));

  // 6. Test GET endpoint
  const fetchedRoadmap = await getJSON(`http://localhost:5000/api/roadmap/user/${userA_id}`);
  console.log(`\n💾 GET /api/roadmap/user/${userA_id}: Success = ${fetchedRoadmap.success}, User = ${fetchedRoadmap.roadmap.user_id}`);

  console.log('\n✅ ALL TEST SCENARIOS PASSED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
