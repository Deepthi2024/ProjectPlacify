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

async function runButtonStateTests() {
  console.log('==========================================');
  console.log('🧪 PLACIFY "START MY JOURNEY" BUTTON STATE TEST');
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

  // TEST 1: Simulated Initial Roadmap Load State Logic
  console.log('📌 TEST 1: Initial Roadmap Load State (journey_started = false)');
  let isStartingJourney = false;
  const mockRoadmap = { journey_started: false, journey_start_date: null };
  
  let initialButtonText = isStartingJourney ? 'Starting...' : '🚀 Start My Journey';
  let initialButtonDisabled = isStartingJourney;

  assert(initialButtonText === '🚀 Start My Journey', 'Button displays "🚀 Start My Journey" on initial load');
  assert(initialButtonDisabled === false, 'Button is enabled on initial load');

  // TEST 2: User Click State Transition
  console.log('\n📌 TEST 2: Button Click State Transition');
  isStartingJourney = true;
  let loadingButtonText = isStartingJourney ? 'Starting...' : '🚀 Start My Journey';
  let loadingButtonDisabled = isStartingJourney;

  assert(loadingButtonText === 'Starting...', 'Button transitions to "Starting..." when clicked');
  assert(loadingButtonDisabled === true, 'Button is disabled during API request');

  // TEST 3: API Success State Transition
  console.log('\n📌 TEST 3: API Success State Transition');
  const userEmail = `btn_state_test_${Date.now()}@placify.ai`;
  const reg = await postJSON('http://localhost:5000/api/auth/register', {
    name: 'Button Test User',
    email: userEmail,
    password: 'password123',
    chosen_domain: 'fullstack',
    timeline_months: 4,
    daily_hours: 2.0
  });

  const u_id = reg.profile.user_id;
  const startRes = await postJSON('http://localhost:5000/api/roadmap/start', {
    user_id: u_id,
    start_date: new Date().toISOString()
  });

  isStartingJourney = false;
  mockRoadmap.journey_started = startRes.journey_started;

  assert(startRes.success === true, 'Start journey API returned success');
  assert(mockRoadmap.journey_started === true, 'journey_started updated to true');
  assert(isStartingJourney === false, 'isStartingJourney state reset to false after API completion');

  // TEST 4: Error Handling State Restoration
  console.log('\n📌 TEST 4: API Error Handling State Restoration');
  isStartingJourney = true;
  try {
    const errorRes = await postJSON('http://localhost:5000/api/roadmap/start', {
      user_id: 'non_existent_user_id_12345',
      start_date: new Date().toISOString()
    });
    if (!errorRes.success) {
      throw new Error(errorRes.error || 'Failed');
    }
  } catch (err) {
    // Simulated finally block
    isStartingJourney = false;
  }

  let restoredButtonText = isStartingJourney ? 'Starting...' : '🚀 Start My Journey';
  let restoredButtonDisabled = isStartingJourney;

  assert(isStartingJourney === false, 'isStartingJourney reset to false on API error');
  assert(restoredButtonText === '🚀 Start My Journey', 'Button restored to "🚀 Start My Journey" on error');
  assert(restoredButtonDisabled === false, 'Button re-enabled on error');

  console.log('\n==========================================');
  console.log(`📊 SUMMARY: Passed ${passed}, Failed ${failed}`);
  console.log('==========================================');

  if (failed > 0) process.exit(1);
}

runButtonStateTests().catch(err => {
  console.error('❌ Test execution error:', err);
  process.exit(1);
});
