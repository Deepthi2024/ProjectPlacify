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

function addDaysToDate(dateInput, daysToAdd) {
  const d = new Date(dateInput);
  d.setDate(d.getDate() + daysToAdd);
  return d;
}

function formatDateLong(dateInput) {
  const d = new Date(dateInput);
  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  return d.toLocaleDateString('en-US', options);
}

async function runJourneyTestSuite() {
  console.log('==========================================');
  console.log('🧪 PLACIFY "START MY JOURNEY" SUITE');
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
  // TEST 1: NEW USER JOURNEY START
  // --------------------------------------------------------
  console.log('📌 TEST 1: New user journey start flow');
  const user1Email = `journey_test1_${Date.now()}@placify.ai`;
  const reg1 = await postJSON('http://localhost:5000/api/auth/register', {
    name: 'Journey User 1',
    email: user1Email,
    password: 'password123',
    chosen_domain: 'fullstack',
    timeline_months: 4,
    daily_hours: 2.0
  });

  const u1_id = reg1.profile.user_id;
  assert(u1_id && u1_id.startsWith('usr_'), `User 1 created: ${u1_id}`);
  assert(reg1.profile.journey_started === false, `Initial journey_started is false`);

  // Submit quiz evaluation
  const eval1 = await postJSON('http://localhost:5000/api/quiz/evaluate', {
    user_id: u1_id,
    domain: 'Full-Stack Web Development',
    answers: [
      { id: 'q1', topic: 'JavaScript Fundamentals', user_answer: 1, correct_answer: 1 },
      { id: 'q2', topic: 'REST API & Backend Architecture', user_answer: 1, correct_answer: 1 }
    ]
  });

  // Generate initial roadmap
  const gen1 = await postJSON('http://localhost:5000/api/roadmap/generate', {
    user_id: u1_id,
    quizEvaluation: eval1.evaluation
  });
  assert(gen1.roadmap && gen1.roadmap.journey_started === false, `Initial roadmap journey_started is false`);

  // Start journey using device local date (Thursday Aug 13, 2026)
  const clientDeviceDate = '2026-08-13T10:00:00.000Z';
  const startRes1 = await postJSON('http://localhost:5000/api/roadmap/start', {
    user_id: u1_id,
    start_date: clientDeviceDate
  });

  assert(startRes1.success === true, `Start journey endpoint returned success`);
  assert(startRes1.journey_started === true, `journey_started set to true`);
  assert(new Date(startRes1.journey_start_date).toISOString() === new Date(clientDeviceDate).toISOString(), `journey_start_date set to device date`);


  // --------------------------------------------------------
  // TEST 2: DATE SEQUENCE & WEEKDAYS
  // --------------------------------------------------------
  console.log('\n📌 TEST 2: Date sequence and weekday alignment');
  const startDateObj = new Date(startRes1.journey_start_date);
  const day1Date = addDaysToDate(startDateObj, 0);
  const day2Date = addDaysToDate(startDateObj, 1);
  const day8Date = addDaysToDate(startDateObj, 7);

  assert(formatDateLong(day1Date) === 'Thursday, August 13, 2026', `Day 1 is Thursday, August 13, 2026 (got ${formatDateLong(day1Date)})`);
  assert(formatDateLong(day2Date) === 'Friday, August 14, 2026', `Day 2 is Friday, August 14, 2026 (got ${formatDateLong(day2Date)})`);
  assert(formatDateLong(day8Date) === 'Thursday, August 20, 2026', `Day 8 is Thursday, August 20, 2026 (got ${formatDateLong(day8Date)})`);


  // --------------------------------------------------------
  // TEST 3: MONTH BOUNDARY TRANSITION
  // --------------------------------------------------------
  console.log('\n📌 TEST 3: Month boundary transition handling');
  const monthEndStart = new Date('2026-08-30T10:00:00.000Z');
  const day1Boundary = addDaysToDate(monthEndStart, 0); // Aug 30
  const day2Boundary = addDaysToDate(monthEndStart, 1); // Aug 31
  const day3Boundary = addDaysToDate(monthEndStart, 2); // Sept 1
  const day4Boundary = addDaysToDate(monthEndStart, 3); // Sept 2

  assert(day1Boundary.getDate() === 30 && day1Boundary.getMonth() === 7, `Aug 30 is correct`);
  assert(day2Boundary.getDate() === 31 && day2Boundary.getMonth() === 7, `Aug 31 is correct`);
  assert(day3Boundary.getDate() === 1 && day3Boundary.getMonth() === 8, `Sept 1 transition is correct`);
  assert(day4Boundary.getDate() === 2 && day4Boundary.getMonth() === 8, `Sept 2 transition is correct`);


  // --------------------------------------------------------
  // TEST 4: EXISTING USER LOGIN RESUME
  // --------------------------------------------------------
  console.log('\n📌 TEST 4: Existing user login resume journey');
  const login1 = await postJSON('http://localhost:5000/api/auth/login', {
    email: user1Email,
    password: 'password123'
  });

  assert(login1.profile && login1.profile.journey_started === true, `Logged in profile maintains journey_started = true`);
  assert(new Date(login1.profile.journey_start_date).toISOString() === new Date(clientDeviceDate).toISOString(), `Logged in profile maintains original journey_start_date`);

  const fetchedRm = await getJSON(`http://localhost:5000/api/roadmap/user/${u1_id}`);
  assert(fetchedRm.roadmap && fetchedRm.roadmap.journey_started === true, `Fetched roadmap retains journey_started = true`);
  assert(new Date(fetchedRm.roadmap.journey_start_date).toISOString() === new Date(clientDeviceDate).toISOString(), `Fetched roadmap retains original journey_start_date`);


  // --------------------------------------------------------
  // TEST 5: DUPLICATE START PROTECTION
  // --------------------------------------------------------
  console.log('\n📌 TEST 5: Duplicate start protection');
  const laterDate = '2026-09-01T10:00:00.000Z'; // Attempt to overwrite with Sept 1
  const duplicateRes = await postJSON('http://localhost:5000/api/roadmap/start', {
    user_id: u1_id,
    start_date: laterDate
  });

  assert(duplicateRes.success === true, `Duplicate request handled successfully`);
  assert(new Date(duplicateRes.journey_start_date).toISOString() === new Date(clientDeviceDate).toISOString(), `Original journey_start_date preserved (NOT overwritten by Sept 1)`);


  // --------------------------------------------------------
  // TEST 6: TIMELINE PRESERVATION (2m, 4m, 6m)
  // --------------------------------------------------------
  console.log('\n📌 TEST 6: Timeline preservation (2m, 4m, 6m)');
  const timelines = [2, 4, 6];
  for (const tMonths of timelines) {
    const tEmail = `timeline_${tMonths}_${Date.now()}@placify.ai`;
    const regT = await postJSON('http://localhost:5000/api/auth/register', {
      name: `${tMonths} Month User`,
      email: tEmail,
      password: 'password123',
      chosen_domain: 'fullstack',
      timeline_months: tMonths,
      daily_hours: 2.0
    });
    const genT = await postJSON('http://localhost:5000/api/roadmap/generate', { user_id: regT.profile.user_id });
    assert(genT.roadmap.timeline_months === tMonths, `Timeline ${tMonths} months preserved in roadmap`);
    assert(genT.roadmap.monthly_roadmap.length === tMonths, `Roadmap contains exactly ${tMonths} monthly modules`);
  }

  console.log('\n==========================================');
  console.log(`📊 SUMMARY: Passed ${passed}, Failed ${failed}`);
  console.log('==========================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runJourneyTestSuite().catch(err => {
  console.error('❌ Validation error:', err);
  process.exit(1);
});
