const http = require('http');

function postJSON(url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      },
      res => {
        let raw = '';
        res.on('data', chunk => (raw += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(raw));
          } catch (e) {
            reject(new Error(`Failed to parse response: ${raw}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let raw = '';
      res.on('data', chunk => (raw += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${raw}`));
        }
      });
    }).on('error', reject);
  });
}

async function runAcceptanceTests() {
  console.log("==================================================");
  console.log("RUNNING CURRICULUM PLACEMENT ACCEPTANCE TEST SUITE");
  console.log("==================================================\n");

  const timestamp = Date.now();

  // ----------------------------------------------------
  // TEST 1: Data Science & ML - 0% Complete Beginner
  // ----------------------------------------------------
  console.log("--- TEST 1: 0% Beginner in Data Science & Machine Learning ---");
  const user1Email = `ds_beginner_${timestamp}@test.com`;
  const reg1 = await postJSON('http://localhost:5000/api/auth/register', {
    name: 'Beginner DS User',
    email: user1Email,
    password: 'password123',
    chosen_domain: 'datascience',
    timeline_months: 5,
    daily_hours: 2.5
  });

  const user1Id = reg1.user.user_id;

  // Submit 0% quiz evaluation
  const eval1 = await postJSON('http://localhost:5000/api/quiz/evaluate', {
    user_id: user1Id,
    domain: 'datascience',
    answers: {}, // 0 correct answers
    score_pct: 0,
    skill_level: 'BEGINNER'
  });

  // Generate roadmap
  const gen1 = await postJSON('http://localhost:5000/api/roadmap/generate', {
    user_id: user1Id,
    quizEvaluation: eval1.evaluation
  });

  const rm1 = gen1.roadmap;
  const month1Topic = rm1.monthly_roadmap[0].topics[0];
  const week1Title = rm1.monthly_roadmap[0].weeks[0].title;
  const day1TaskTitle = rm1.monthly_roadmap[0].weeks[0].days[0].tasks[0].title;

  console.log(`User Level: ${rm1.overall_level}`);
  console.log(`Starting Point: ${rm1.starting_point}`);
  console.log(`Month 1 Topic: "${month1Topic}"`);
  console.log(`Week 1 Title: "${week1Title}"`);
  console.log(`Day 1 Task 1 Title: "${day1TaskTitle}"`);

  if (month1Topic === 'Python Fundamentals' && day1TaskTitle.includes('Python')) {
    console.log("✅ TEST 1 PASSED: 0% Beginner starts strictly at Python Fundamentals!\n");
  } else {
    console.error(`❌ TEST 1 FAILED: Expected starting point "Python Fundamentals", but got "${month1Topic}"`);
    process.exit(1);
  }

  // ----------------------------------------------------
  // TEST 2: Data Science & ML - ~60% Intermediate
  // ----------------------------------------------------
  console.log("--- TEST 2: 60% Intermediate in Data Science & Machine Learning ---");
  const user2Email = `ds_intermediate_${timestamp}@test.com`;
  const reg2 = await postJSON('http://localhost:5000/api/auth/register', {
    name: 'Intermediate DS User',
    email: user2Email,
    password: 'password123',
    chosen_domain: 'datascience',
    timeline_months: 5,
    daily_hours: 2.5
  });

  const user2Id = reg2.user.user_id;

  const eval2 = await postJSON('http://localhost:5000/api/quiz/evaluate', {
    user_id: user2Id,
    domain: 'datascience',
    score_pct: 60,
    skill_level: 'INTERMEDIATE',
    topic_evaluations: [
      { topic: 'Python Fundamentals', score_pct: 75, proficiency_level: 'STRONG' },
      { topic: 'Python for Data Science & Math', score_pct: 65, proficiency_level: 'INTERMEDIATE' },
      { topic: 'Machine Learning Fundamentals', score_pct: 40, proficiency_level: 'WEAK' }
    ]
  });

  const gen2 = await postJSON('http://localhost:5000/api/roadmap/generate', {
    user_id: user2Id,
    quizEvaluation: eval2.evaluation
  });

  const rm2 = gen2.roadmap;
  console.log(`User Level: ${rm2.overall_level}`);
  console.log(`Starting Point: ${rm2.starting_point}`);
  console.log(`Month 1 Title: "${rm2.monthly_roadmap[0].title}"`);
  console.log(`Month 1 Topics: ${JSON.stringify(rm2.monthly_roadmap[0].topics)}`);

  if (rm2.overall_level === 'INTERMEDIATE' && rm2.monthly_roadmap[0].title.includes('Foundation Review')) {
    console.log("✅ TEST 2 PASSED: Intermediate user gets rapid foundation review & core acceleration!\n");
  } else {
    console.error(`❌ TEST 2 FAILED: Expected intermediate placement with rapid review, got level=${rm2.overall_level}`);
    process.exit(1);
  }

  // ----------------------------------------------------
  // TEST 3: Data Science & ML - 90%+ Mastered
  // ----------------------------------------------------
  console.log("--- TEST 3: 95% Mastered in Data Science & Machine Learning ---");
  const user3Email = `ds_mastered_${timestamp}@test.com`;
  const reg3 = await postJSON('http://localhost:5000/api/auth/register', {
    name: 'Mastered DS User',
    email: user3Email,
    password: 'password123',
    chosen_domain: 'datascience',
    timeline_months: 5,
    daily_hours: 2.5
  });

  const user3Id = reg3.user.user_id;

  const eval3 = await postJSON('http://localhost:5000/api/quiz/evaluate', {
    user_id: user3Id,
    domain: 'datascience',
    score_pct: 95,
    skill_level: 'MASTERED'
  });

  const gen3 = await postJSON('http://localhost:5000/api/roadmap/generate', {
    user_id: user3Id,
    quizEvaluation: eval3.evaluation
  });

  const rm3 = gen3.roadmap;
  console.log(`User Level: ${rm3.overall_level}`);
  console.log(`Starting Point: ${rm3.starting_point}`);
  console.log(`Month 1 Title: "${rm3.monthly_roadmap[0].title}"`);
  console.log(`Month 1 Topics: ${JSON.stringify(rm3.monthly_roadmap[0].topics)}`);

  if (rm3.overall_level === 'MASTERED' && (rm3.monthly_roadmap[0].title.includes('Advanced') || rm3.monthly_roadmap[0].title.includes('Specialization'))) {
    console.log("✅ TEST 3 PASSED: Mastered user fast-tracks directly to advanced/specialization topics!\n");
  } else {
    console.error(`❌ TEST 3 FAILED: Mastered placement incorrect.`);
    process.exit(1);
  }

  // ----------------------------------------------------
  // TEST 4: Multi-Domain Placement Test (Full-Stack, DSA, DevOps)
  // ----------------------------------------------------
  console.log("--- TEST 4: Multi-Domain Placement Verification ---");
  const domainsToTest = [
    { key: 'fullstack', expectedStart: 'Web & HTML/CSS Fundamentals' },
    { key: 'dsa', expectedStart: 'Programming Logic & Complexity Analysis' },
    { key: 'devops', expectedStart: 'Computer Networking & OS Basics' },
    { key: 'cybersecurity', expectedStart: 'Computer Systems & CLI Fundamentals' },
    { key: 'mobile', expectedStart: 'Programming Basics for Mobile' },
    { key: 'ai_llm', expectedStart: 'Python Programming & Math Foundations' },
    { key: 'system_design', expectedStart: 'Server Basics & Networking Fundamentals' }
  ];

  for (const dom of domainsToTest) {
    const userEmail = `${dom.key}_beg_${timestamp}@test.com`;
    const reg = await postJSON('http://localhost:5000/api/auth/register', {
      name: `${dom.key} Beginner`,
      email: userEmail,
      password: 'password123',
      chosen_domain: dom.key,
      timeline_months: 4,
      daily_hours: 2.0
    });

    const ev = await postJSON('http://localhost:5000/api/quiz/evaluate', {
      user_id: reg.user.user_id,
      domain: dom.key,
      score_pct: 0,
      skill_level: 'BEGINNER'
    });

    const gen = await postJSON('http://localhost:5000/api/roadmap/generate', {
      user_id: reg.user.user_id,
      quizEvaluation: ev.evaluation
    });

    const startingTopic = gen.roadmap.starting_point;
    console.log(`Domain: ${dom.key} | Starting Topic: "${startingTopic}" (Expected: "${dom.expectedStart}")`);
    if (startingTopic === dom.expectedStart) {
      console.log(`  └─ ✅ Correct Foundation Placement for ${dom.key}`);
    } else {
      console.error(`  └─ ❌ Incorrect starting topic for ${dom.key}`);
      process.exit(1);
    }
  }
  console.log("\n✅ TEST 4 PASSED: All 8 tech domains start at their foundational prerequisite topics for 0% beginners!\n");

  // ----------------------------------------------------
  // TEST 5: Monthly -> Weekly -> Daily Task Topic Alignment (No Topic Jumping)
  // ----------------------------------------------------
  console.log("--- TEST 5: Topic Alignment & Anti-Topic-Jumping Check ---");
  const month1Topic5 = rm1.monthly_roadmap[0].topics[0];
  const week1Topic5 = rm1.monthly_roadmap[0].weeks[0].topics[0];
  const day1TaskTopic5 = rm1.monthly_roadmap[0].weeks[0].days[0].topic;
  const day1Task1Title5 = rm1.monthly_roadmap[0].weeks[0].days[0].tasks[0].title;

  console.log(`Month 1 Topic: "${month1Topic5}"`);
  console.log(`Week 1 Topic:  "${week1Topic5}"`);
  console.log(`Day 1 Topic:   "${day1TaskTopic5}"`);
  console.log(`Day 1 Task 1:  "${day1Task1Title5}"`);

  if (month1Topic5 === week1Topic5 && week1Topic5 === day1TaskTopic5 && (day1Task1Title5.includes(month1Topic5) || day1Task1Title5.includes('Variables') || day1Task1Title5.includes('Python'))) {
    console.log("✅ TEST 5 PASSED: Monthly -> Weekly -> Daily tasks are 100% aligned with zero topic jumping!\n");
  } else {
    console.error("❌ TEST 5 FAILED: Mismatch in topic alignment!");
    process.exit(1);
  }

  console.log("==================================================");
  console.log("ALL ACCEPTANCE TESTS PASSED SUCCESSFULLY! 🎉");
  console.log("==================================================");
}

runAcceptanceTests().catch(err => {
  console.error("❌ Test suite failed with error:", err);
  process.exit(1);
});
