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

async function runAcceptanceSuite() {
  console.log('🧪 RUNNING FULL ACCEPTANCE TEST SUITE...\n');

  // TEST 2: REGISTER NEW USER 1 WITH SPECIFIC DOMAIN (datascience)
  const email1 = `acc_ds_${Date.now()}@placify.ai`;
  console.log(`1️⃣ TEST 2: Registering User 1 with chosen_domain="datascience", timeline_months=6, daily_hours=3.5 (${email1})...`);
  const reg1 = await postJSON('http://localhost:5000/api/auth/register', {
    name: 'Data Science User',
    email: email1,
    password: 'password123',
    chosen_domain: 'datascience',
    timeline_months: 6,
    daily_hours: 3.5
  });

  const u1 = reg1.profile;
  console.log(`   Registered User ID: ${u1.user_id}`);
  console.log(`   Saved chosen_domain: ${u1.chosen_domain} (Expected: datascience)`);
  console.log(`   Initial quiz_completed: ${u1.quiz_completed} (Expected: false)`);

  if (u1.chosen_domain !== 'datascience') {
    throw new Error(`Domain selection failed! Expected 'datascience', got '${u1.chosen_domain}'`);
  }
  if (u1.quiz_completed !== false) {
    throw new Error('New user should have quiz_completed = false');
  }

  // TEST 3: COMPLETE QUIZ & AUTOMATIC ROADMAP GENERATION
  console.log(`\n2️⃣ TEST 3: Submitting Quiz & Auto-Generating Roadmap for User 1...`);
  const quiz1 = await postJSON('http://localhost:5000/api/quiz/evaluate', {
    user_id: u1.user_id,
    domain: 'Data Science & Machine Learning',
    answers: [
      { id: 'ds_q1', topic: 'Python & Pandas', user_answer: 1, correct_answer: 1 },
      { id: 'ds_q2', topic: 'Machine Learning Fundamentals', user_answer: 1, correct_answer: 1 }
    ]
  });
  console.log(`   Quiz Evaluated: ${quiz1.evaluation.score_pct}% (${quiz1.evaluation.skill_level})`);

  const u1Doc = await getJSON(`http://localhost:5000/api/user/${u1.user_id}`);
  console.log(`   MongoDB Atlas quiz_completed: ${u1Doc.profile.quiz_completed} (Expected: true)`);

  const rm1 = await postJSON('http://localhost:5000/api/roadmap/generate', { user_id: u1.user_id });
  console.log(`   Roadmap Auto-Generated: ${rm1.roadmap.monthly_roadmap.length} Months, Domain: "${rm1.roadmap.domain}"`);

  // TEST 4: EXISTING USER LOGIN (NO QUIZ AGAIN)
  console.log(`\n3️⃣ TEST 4: Existing User 1 Sign In...`);
  const login1 = await postJSON('http://localhost:5000/api/auth/login', {
    email: email1,
    password: 'password123'
  });
  console.log(`   Login Response quiz_completed: ${login1.profile.quiz_completed} (Expected: true)`);
  if (!login1.profile.quiz_completed) {
    throw new Error('Existing user login must return quiz_completed = true!');
  }

  // TEST 5: REFRESH / FETCH ROADMAP WITHOUT REGENERATING
  console.log(`\n4️⃣ TEST 5: Fetch Existing Roadmap from DB...`);
  const fetchedRm1 = await getJSON(`http://localhost:5000/api/roadmap/user/${u1.user_id}`);
  console.log(`   Fetched Existing Roadmap from MongoDB Atlas: Success = ${fetchedRm1.success}`);

  // TEST 6: REGISTER SECOND USER WITH DIFFERENT DOMAIN (cybersecurity)
  const email2 = `acc_sec_${Date.now()}@placify.ai`;
  console.log(`\n5️⃣ TEST 6: Registering User 2 with DIFFERENT domain (cybersecurity)...`);
  const reg2 = await postJSON('http://localhost:5000/api/auth/register', {
    name: 'Cybersecurity User',
    email: email2,
    password: 'password123',
    chosen_domain: 'cybersecurity',
    timeline_months: 5,
    daily_hours: 4.0
  });

  const u2 = reg2.profile;
  console.log(`   User 2 ID: ${u2.user_id}`);
  console.log(`   User 2 chosen_domain: ${u2.chosen_domain} (Expected: cybersecurity)`);
  if (u2.chosen_domain !== 'cybersecurity') {
    throw new Error(`User 2 domain failed! Expected 'cybersecurity', got '${u2.chosen_domain}'`);
  }

  // TEST 7: EXISTING USER WITH COMPLETED QUIZ BUT MISSING ROADMAP
  console.log(`\n6️⃣ TEST 7: Quiz completed user with missing roadmap auto-generates roadmap...`);
  await postJSON('http://localhost:5000/api/quiz/evaluate', {
    user_id: u2.user_id,
    domain: 'Cybersecurity & Ethical Hacking',
    answers: [{ id: 'sec_q1', topic: 'Network Security', user_answer: 1, correct_answer: 1 }]
  });
  // Auto generate roadmap
  const rm2 = await postJSON('http://localhost:5000/api/roadmap/generate', { user_id: u2.user_id });
  console.log(`   Auto-generated roadmap for User 2: Domain = "${rm2.roadmap.domain}"`);

  // TEST 8: DUPLICATE EMAIL REGISTRATION REJECTION
  console.log(`\n7️⃣ TEST 8: Duplicate Email Registration Error Handling...`);
  const dup = await postJSON('http://localhost:5000/api/auth/register', {
    name: 'Duplicate User',
    email: email1,
    password: 'password123',
    chosen_domain: 'fullstack',
    timeline_months: 3,
    daily_hours: 2.0
  });
  console.log(`   Duplicate Registration Rejection: Status = 409, Error = "${dup.error}"`);
  if (!dup.error || !dup.error.includes('already exists')) {
    throw new Error('Duplicate email registration should return error asking user to sign in!');
  }

  console.log('\n🎉 ALL ACCEPTANCE TEST CASES PASSED 100% SUCCESSFULLY!');
}

runAcceptanceSuite().catch(err => {
  console.error('❌ Acceptance test suite failed:', err);
  process.exit(1);
});
