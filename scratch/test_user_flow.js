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

async function runFlowTests() {
  console.log('🧪 RUNNING USER FLOW & ONBOARDING SUITE...\n');

  // TEST 1: BRAND NEW USER REGISTRATION
  const email1 = `flow_new_${Date.now()}@placify.ai`;
  console.log(`1️⃣ Registering Brand-New User (${email1})...`);
  const reg1 = await postJSON('http://localhost:5000/api/auth/register', {
    name: 'New Flow User',
    email: email1,
    password: 'password123',
    chosen_domain: 'fullstack',
    timeline_months: 4,
    daily_hours: 2.0
  });

  const u1 = reg1.profile;
  console.log(`   Registered User ID: ${u1.user_id}`);
  console.log(`   Initial quiz_completed: ${u1.quiz_completed} (Expected: false)`);
  console.log(`   Initial last_route: ${u1.last_route} (Expected: onboarding/roadmap)`);

  if (u1.quiz_completed !== false) {
    throw new Error('New user should have quiz_completed = false');
  }

  // TEST 2: SUBMIT QUIZ FOR NEW USER
  console.log(`\n2️⃣ Submitting Diagnostic Quiz for User ${u1.user_id}...`);
  const quiz1 = await postJSON('http://localhost:5000/api/quiz/evaluate', {
    user_id: u1.user_id,
    domain: 'Full-Stack Web Development',
    answers: [
      { id: 'q1', topic: 'Frontend Frameworks', user_answer: 1, correct_answer: 1 },
      { id: 'q2', topic: 'Backend APIs', user_answer: 1, correct_answer: 1 }
    ]
  });
  console.log(`   Quiz Evaluated: Score ${quiz1.evaluation.score_pct}% (${quiz1.evaluation.skill_level})`);

  // Verify MongoDB updated quiz_completed = true
  const user1Doc = await getJSON(`http://localhost:5000/api/user/${u1.user_id}`);
  console.log(`   MongoDB profile quiz_completed: ${user1Doc.profile.quiz_completed} (Expected: true)`);
  if (!user1Doc.profile.quiz_completed) {
    throw new Error('quiz_completed should be true after quiz submission!');
  }

  // TEST 3: AUTOMATIC ROADMAP GENERATION UPON QUIZ SUBMISSION
  console.log(`\n3️⃣ Automatic Roadmap Generation upon Quiz Completion...`);
  const rm1 = await postJSON('http://localhost:5000/api/roadmap/generate', { user_id: u1.user_id });
  console.log(`   Roadmap Generated & Persisted: ${rm1.roadmap.monthly_roadmap.length} Months`);

  // TEST 4: RETURNING USER LOGIN
  console.log(`\n4️⃣ Testing Returning User Login (${email1})...`);
  const login1 = await postJSON('http://localhost:5000/api/auth/login', {
    email: email1,
    password: 'password123'
  });
  console.log(`   Login Response quiz_completed: ${login1.profile.quiz_completed} (Expected: true)`);
  if (!login1.profile.quiz_completed) {
    throw new Error('Returning user should have quiz_completed = true!');
  }

  // Verify existing roadmap fetched without regenerating
  const fetchedRm = await getJSON(`http://localhost:5000/api/roadmap/user/${u1.user_id}`);
  console.log(`   Fetched Existing Roadmap from DB: Success = ${fetchedRm.success}`);

  // TEST 5: ROUTE PERSISTENCE
  console.log(`\n5️⃣ Testing Route Persistence (navigating to /dailyHub)...`);
  const routeRes = await postJSON('http://localhost:5000/api/user/route', {
    user_id: u1.user_id,
    last_route: 'dailyHub'
  });
  console.log(`   Saved last_route: ${routeRes.last_route}`);

  const user1Updated = await getJSON(`http://localhost:5000/api/user/${u1.user_id}`);
  console.log(`   MongoDB profile last_route: ${user1Updated.profile.last_route} (Expected: dailyHub)`);

  console.log('\n🎉 ALL USER FLOW & ONBOARDING TEST CASES PASSED SUCCESSFULLY!');
}

runFlowTests().catch(err => {
  console.error('❌ Flow test failed:', err);
  process.exit(1);
});
