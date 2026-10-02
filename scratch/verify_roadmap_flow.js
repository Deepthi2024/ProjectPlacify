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

async function runValidationSuite() {
  console.log('==========================================');
  console.log('🧪 PLACIFY ROADMAP GENERATION VALIDATION');
  console.log('==========================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // --------------------------------------------------------
  // TEST 1: NEW USER LOW SCORE (30%)
  // --------------------------------------------------------
  console.log('📌 TEST 1: New user with LOW quiz score (30%)');
  const lowEmail = `test_low_${Date.now()}@placify.ai`;
  const regLow = await postJSON('http://localhost:5000/api/auth/register', {
    name: 'Low Score User',
    email: lowEmail,
    password: 'password123',
    chosen_domain: 'fullstack',
    timeline_months: 4,
    daily_hours: 2.0
  });

  const lowUserId = regLow.profile.user_id;
  assert(lowUserId && lowUserId.startsWith('usr_'), `User created with valid user_id: ${lowUserId}`);

  // Answers resulting in ~30% score (3 correct out of 10)
  const lowAnswers = [
    { id: 'fs_js_q1', topic: 'JavaScript Fundamentals', user_answer: 1, correct_answer: 1, difficulty: 'BEGINNER' }, // correct
    { id: 'fs_js_q2', topic: 'JavaScript Fundamentals', user_answer: 0, correct_answer: 2, difficulty: 'BEGINNER' },
    { id: 'fs_api_q1', topic: 'REST API & Backend Architecture', user_answer: 1, correct_answer: 1, difficulty: 'BEGINNER' }, // correct
    { id: 'fs_api_q2', topic: 'REST API & Backend Architecture', user_answer: 0, correct_answer: 1, difficulty: 'BEGINNER' },
    { id: 'fs_react_q1', topic: 'React & UI Architecture', user_answer: 1, correct_answer: 1, difficulty: 'BEGINNER' }, // correct
    { id: 'fs_react_q2', topic: 'React & UI Architecture', user_answer: 0, correct_answer: 1, difficulty: 'BEGINNER' },
    { id: 'fs_db_q1', topic: 'Database Management', user_answer: 3, correct_answer: 0, difficulty: 'BEGINNER' },
    { id: 'fs_db_q2', topic: 'Database Management', user_answer: 0, correct_answer: 1, difficulty: 'BEGINNER' },
    { id: 'fs_sec_q1', topic: 'Web Security', user_answer: 0, correct_answer: 1, difficulty: 'BEGINNER' },
    { id: 'fs_sec_q2', topic: 'Web Security', user_answer: 0, correct_answer: 1, difficulty: 'BEGINNER' }
  ];

  const evalLow = await postJSON('http://localhost:5000/api/quiz/evaluate', {
    user_id: lowUserId,
    domain: 'Full-Stack Web Development',
    answers: lowAnswers
  });

  assert(evalLow.evaluation && evalLow.evaluation.user_id === lowUserId, `Quiz evaluation created for user ${lowUserId}`);
  assert(evalLow.evaluation.score_pct === 30, `Quiz evaluation score is exactly 30% (got ${evalLow.evaluation.score_pct}%)`);
  assert(evalLow.evaluation.skill_level === 'BEGINNER', `Skill level is BEGINNER (got ${evalLow.evaluation.skill_level})`);

  // Generate roadmap for low score user
  const genLow = await postJSON('http://localhost:5000/api/roadmap/generate', {
    user_id: lowUserId,
    quizEvaluation: evalLow.evaluation
  });

  const rmLow = genLow.roadmap;
  assert(rmLow && rmLow.user_id === lowUserId, `Roadmap generated with correct user_id: ${rmLow.user_id}`);
  assert(rmLow.quiz_score === 30, `Roadmap quiz_score is 30% (got ${rmLow.quiz_score})`);
  assert(rmLow.monthly_roadmap[0].difficulty === 'BEGINNER', `Month 1 difficulty is BEGINNER for weak performance (got ${rmLow.monthly_roadmap[0].difficulty})`);
  assert(rmLow.monthly_roadmap[0].title.includes('Remedial') || rmLow.monthly_roadmap[0].difficulty === 'BEGINNER', `Month 1 reflects remedial/foundations focus`);


  // --------------------------------------------------------
  // TEST 2: NEW USER HIGH SCORE (90%)
  // --------------------------------------------------------
  console.log('\n📌 TEST 2: New user with HIGH quiz score (90%)');
  const highEmail = `test_high_${Date.now()}@placify.ai`;
  const regHigh = await postJSON('http://localhost:5000/api/auth/register', {
    name: 'High Score User',
    email: highEmail,
    password: 'password123',
    chosen_domain: 'fullstack',
    timeline_months: 4,
    daily_hours: 2.0
  });

  const highUserId = regHigh.profile.user_id;
  assert(highUserId && highUserId.startsWith('usr_'), `User created with valid user_id: ${highUserId}`);

  // Answers resulting in 90% score (9 correct out of 10)
  const highAnswers = [
    { id: 'fs_js_q1', topic: 'JavaScript Fundamentals', user_answer: 1, correct_answer: 1 },
    { id: 'fs_js_q2', topic: 'JavaScript Fundamentals', user_answer: 2, correct_answer: 2 },
    { id: 'fs_api_q1', topic: 'REST API & Backend Architecture', user_answer: 1, correct_answer: 1 },
    { id: 'fs_api_q2', topic: 'REST API & Backend Architecture', user_answer: 1, correct_answer: 1 },
    { id: 'fs_react_q1', topic: 'React & UI Architecture', user_answer: 1, correct_answer: 1 },
    { id: 'fs_react_q2', topic: 'React & UI Architecture', user_answer: 1, correct_answer: 1 },
    { id: 'fs_db_q1', topic: 'Database Management', user_answer: 0, correct_answer: 0 },
    { id: 'fs_db_q2', topic: 'Database Management', user_answer: 1, correct_answer: 1 },
    { id: 'fs_sec_q1', topic: 'Web Security', user_answer: 1, correct_answer: 1 },
    { id: 'fs_sec_q2', topic: 'Web Security', user_answer: 0, correct_answer: 1 } // 1 incorrect
  ];

  const evalHigh = await postJSON('http://localhost:5000/api/quiz/evaluate', {
    user_id: highUserId,
    domain: 'Full-Stack Web Development',
    answers: highAnswers
  });

  assert(evalHigh.evaluation && evalHigh.evaluation.user_id === highUserId, `Quiz evaluation created for user ${highUserId}`);
  assert(evalHigh.evaluation.score_pct === 90, `Quiz evaluation score is exactly 90% (got ${evalHigh.evaluation.score_pct}%)`);
  assert(evalHigh.evaluation.skill_level === 'ADVANCED', `Skill level is ADVANCED (got ${evalHigh.evaluation.skill_level})`);

  // Generate roadmap for high score user
  const genHigh = await postJSON('http://localhost:5000/api/roadmap/generate', {
    user_id: highUserId,
    quizEvaluation: evalHigh.evaluation
  });

  const rmHigh = genHigh.roadmap;
  assert(rmHigh && rmHigh.user_id === highUserId, `Roadmap generated with correct user_id: ${rmHigh.user_id}`);
  assert(rmHigh.quiz_score === 90, `Roadmap quiz_score is 90% (got ${rmHigh.quiz_score})`);
  assert(rmHigh.monthly_roadmap[0].difficulty === 'ADVANCED', `Month 1 difficulty is ADVANCED for strong performance (got ${rmHigh.monthly_roadmap[0].difficulty})`);
  assert(rmHigh.monthly_roadmap[0].title.includes('Fast-Track') || rmHigh.monthly_roadmap[0].difficulty === 'ADVANCED', `Month 1 reflects fast-track advanced application`);


  // --------------------------------------------------------
  // TEST 3: EXISTING USER LOGIN RESUME
  // --------------------------------------------------------
  console.log('\n📌 TEST 3: Existing user login & resume saved roadmap');
  const loginRes = await postJSON('http://localhost:5000/api/auth/login', {
    email: highEmail,
    password: 'password123'
  });

  assert(loginRes.profile && loginRes.profile.user_id === highUserId, `Login successful for user ${highUserId}`);
  assert(loginRes.profile.quiz_completed === true, `Existing user quiz_completed is true`);

  const fetchedRm = await getJSON(`http://localhost:5000/api/roadmap/user/${highUserId}`);
  assert(fetchedRm.success && fetchedRm.roadmap, `Existing user roadmap fetched successfully`);
  assert(fetchedRm.roadmap.quiz_score === 90, `Fetched existing roadmap preserves original quiz_score 90% (got ${fetchedRm.roadmap.quiz_score})`);
  assert(fetchedRm.roadmap.user_id === highUserId, `Fetched roadmap user_id matches logged-in user`);


  // --------------------------------------------------------
  // TEST 4: PERSISTENCE & NO FALLBACK TO 50%
  // --------------------------------------------------------
  console.log('\n📌 TEST 4: Persistence verification after re-querying');
  const lowFetchedRm = await getJSON(`http://localhost:5000/api/roadmap/user/${lowUserId}`);
  assert(lowFetchedRm.success && lowFetchedRm.roadmap, `Low score user roadmap fetched successfully`);
  assert(lowFetchedRm.roadmap.quiz_score === 30, `Low score user roadmap persists 30% score (got ${lowFetchedRm.roadmap.quiz_score})`);
  assert(lowFetchedRm.roadmap.monthly_roadmap[0].difficulty === 'BEGINNER', `Low score user roadmap persists BEGINNER difficulty`);

  console.log('\n==========================================');
  console.log(`📊 SUMMARY: Passed ${passed}, Failed ${failed}`);
  console.log('==========================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runValidationSuite().catch(err => {
  console.error('❌ Validation error:', err);
  process.exit(1);
});
