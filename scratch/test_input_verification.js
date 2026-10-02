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
      res.on('end', () => resolve(JSON.parse(body)));
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
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });
}

async function verifyInputModifications() {
  console.log('🧪 VERIFYING REGISTRATION INPUT MODIFICATION (MONTHS & MANUAL HOURS)...\n');

  // TEST CASE 1: 6 Months & 3.5 Hours
  const email1 = `v_tc1_${Date.now()}@placify.ai`;
  console.log(`1️⃣ TEST CASE 1: Registering timeline_months=6, daily_hours=3.5 (${email1})...`);
  const tc1 = await postJSON('http://localhost:5000/api/auth/register', {
    name: 'Test User 1',
    email: email1,
    password: 'password123',
    chosen_domain: 'dsa',
    timeline_months: 6,
    daily_hours: 3.5
  });

  console.log(`   MongoDB Atlas Stored Profile:`);
  console.log(`   - timeline_months: ${tc1.profile.timeline_months} (Type: ${typeof tc1.profile.timeline_months})`);
  console.log(`   - daily_hours: ${tc1.profile.daily_hours} (Type: ${typeof tc1.profile.daily_hours})`);

  if (tc1.profile.timeline_months !== 6 || tc1.profile.daily_hours !== 3.5) {
    throw new Error('Test Case 1 failed! Values not stored correctly.');
  }

  // TEST CASE 2: 12 Months & 2.5 Hours
  const email2 = `v_tc2_${Date.now()}@placify.ai`;
  console.log(`\n2️⃣ TEST CASE 2: Registering timeline_months=12, daily_hours=2.5 (${email2})...`);
  const tc2 = await postJSON('http://localhost:5000/api/auth/register', {
    name: 'Test User 2',
    email: email2,
    password: 'password123',
    chosen_domain: 'fullstack',
    timeline_months: 12,
    daily_hours: 2.5
  });
  console.log(`   - timeline_months: ${tc2.profile.timeline_months}`);
  console.log(`   - daily_hours: ${tc2.profile.daily_hours}`);
  if (tc2.profile.timeline_months !== 12 || tc2.profile.daily_hours !== 2.5) {
    throw new Error('Test Case 2 failed!');
  }

  // TEST CASE 3: 3 Months & 1.5 Hours
  const email3 = `v_tc3_${Date.now()}@placify.ai`;
  console.log(`\n3️⃣ TEST CASE 3: Registering timeline_months=3, daily_hours=1.5 (${email3})...`);
  const tc3 = await postJSON('http://localhost:5000/api/auth/register', {
    name: 'Test User 3',
    email: email3,
    password: 'password123',
    chosen_domain: 'cybersecurity',
    timeline_months: 3,
    daily_hours: 1.5
  });
  console.log(`   - timeline_months: ${tc3.profile.timeline_months}`);
  console.log(`   - daily_hours: ${tc3.profile.daily_hours}`);
  if (tc3.profile.timeline_months !== 3 || tc3.profile.daily_hours !== 1.5) {
    throw new Error('Test Case 3 failed!');
  }

  // TEST CASE 4: LOGIN RESPONSE VERIFICATION
  console.log(`\n4️⃣ TEST CASE 4: Logging in user from Test Case 1 (${email1})...`);
  const loginTc1 = await postJSON('http://localhost:5000/api/auth/login', {
    email: email1,
    password: 'password123'
  });
  console.log(`   Login API Response Payload:`);
  console.log(`   - timeline_months: ${loginTc1.profile.timeline_months}`);
  console.log(`   - daily_hours: ${loginTc1.profile.daily_hours}`);
  if (loginTc1.profile.timeline_months !== 6 || loginTc1.profile.daily_hours !== 3.5) {
    throw new Error('Test Case 4 (Login API) failed!');
  }

  // TEST CASE 5: ROADMAP MONTHS DURATION VERIFICATION
  console.log(`\n5️⃣ TEST CASE 5: Submitting Quiz & Generating Roadmap for 6-Month user...`);
  await postJSON('http://localhost:5000/api/quiz/evaluate', {
    user_id: tc1.profile.user_id,
    domain: 'Data Structures & Algorithms',
    answers: [{ id: 'dsa_q1', topic: 'Arrays', user_answer: 1, correct_answer: 1 }]
  });
  const rm = await postJSON('http://localhost:5000/api/roadmap/generate', { user_id: tc1.profile.user_id });
  console.log(`   Generated Roadmap: ${rm.roadmap.monthly_roadmap.length} Months (Expected: 6)`);
  if (rm.roadmap.monthly_roadmap.length !== 6) {
    throw new Error(`Roadmap month count mismatch! Expected 6, got ${rm.roadmap.monthly_roadmap.length}`);
  }

  console.log('\n🎉 ALL INPUT MODIFICATION TEST CASES PASSED 100% SUCCESSFULLY!');
}

verifyInputModifications().catch(err => {
  console.error('❌ Input modification verification failed:', err);
  process.exit(1);
});
