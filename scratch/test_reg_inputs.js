const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('🧪 Starting Placify Registration Inputs & Login Verification...\n');

  try {
    // ---------------------------------------------------------
    // TEST CASE 1
    // ---------------------------------------------------------
    console.log('--- TEST CASE 1 ---');
    const email1 = `test1_${Date.now()}@example.com`;
    const regRes1 = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User 1',
        email: email1,
        password: 'Password123!',
        chosen_domain: 'dsa',
        timeline_months: 6,
        daily_hours: 3.5
      })
    });
    const regData1 = await regRes1.json();
    console.log('Registration 1 status:', regRes1.status);
    console.log('Registration 1 profile:', regData1.profile);

    if (regData1.profile && regData1.profile.timeline_months === 6 && regData1.profile.daily_hours === 3.5) {
      console.log('✅ TEST CASE 1 PASSED: timeline_months = 6, daily_hours = 3.5');
    } else {
      console.error('❌ TEST CASE 1 FAILED:', regData1);
    }

    // ---------------------------------------------------------
    // TEST CASE 2
    // ---------------------------------------------------------
    console.log('\n--- TEST CASE 2 ---');
    const email2 = `test2_${Date.now()}@example.com`;
    const regRes2 = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User 2',
        email: email2,
        password: 'Password123!',
        chosen_domain: 'fullstack',
        timeline_months: 12,
        daily_hours: 2.5
      })
    });
    const regData2 = await regRes2.json();
    console.log('Registration 2 status:', regRes2.status);
    console.log('Registration 2 profile:', regData2.profile);

    if (regData2.profile && regData2.profile.timeline_months === 12 && regData2.profile.daily_hours === 2.5) {
      console.log('✅ TEST CASE 2 PASSED: timeline_months = 12, daily_hours = 2.5');
    } else {
      console.error('❌ TEST CASE 2 FAILED:', regData2);
    }

    // ---------------------------------------------------------
    // TEST CASE 3
    // ---------------------------------------------------------
    console.log('\n--- TEST CASE 3 ---');
    const email3 = `test3_${Date.now()}@example.com`;
    const regRes3 = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User 3',
        email: email3,
        password: 'Password123!',
        chosen_domain: 'backend',
        timeline_months: 3,
        daily_hours: 1.5
      })
    });
    const regData3 = await regRes3.json();
    console.log('Registration 3 status:', regRes3.status);
    console.log('Registration 3 profile:', regData3.profile);

    if (regData3.profile && regData3.profile.timeline_months === 3 && regData3.profile.daily_hours === 1.5) {
      console.log('✅ TEST CASE 3 PASSED: timeline_months = 3, daily_hours = 1.5');
    } else {
      console.error('❌ TEST CASE 3 FAILED:', regData3);
    }

    // ---------------------------------------------------------
    // TEST CASE 4 — LOGIN
    // ---------------------------------------------------------
    console.log('\n--- TEST CASE 4 (LOGIN) ---');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email1,
        password: 'Password123!'
      })
    });
    const loginData = await loginRes.json();
    console.log('Login status:', loginRes.status);
    console.log('Login profile:', loginData.profile);

    if (loginData.profile && loginData.profile.timeline_months === 6 && loginData.profile.daily_hours === 3.5) {
      console.log('✅ TEST CASE 4 PASSED: Login returns timeline_months = 6, daily_hours = 3.5');
    } else {
      console.error('❌ TEST CASE 4 FAILED:', loginData);
    }

    // ---------------------------------------------------------
    // TEST CASE 5 — VALIDATION (INVALID INPUTS)
    // ---------------------------------------------------------
    console.log('\n--- TEST CASE 5 (VALIDATION) ---');
    const invalidRes1 = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Invalid User',
        email: `invalid_${Date.now()}@example.com`,
        password: 'Password123!',
        chosen_domain: 'dsa',
        timeline_months: 0,
        daily_hours: 3.5
      })
    });
    console.log('Invalid timeline_months=0 response status:', invalidRes1.status);
    if (invalidRes1.status === 400) {
      console.log('✅ VALIDATION PASSED: Rejected timeline_months = 0 with 400');
    } else {
      console.error('❌ VALIDATION FAILED: Allowed timeline_months = 0');
    }

    const invalidRes2 = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Invalid User 2',
        email: `invalid2_${Date.now()}@example.com`,
        password: 'Password123!',
        chosen_domain: 'dsa',
        timeline_months: 6,
        daily_hours: -2
      })
    });
    console.log('Invalid daily_hours=-2 response status:', invalidRes2.status);
    if (invalidRes2.status === 400) {
      console.log('✅ VALIDATION PASSED: Rejected daily_hours = -2 with 400');
    } else {
      console.error('❌ VALIDATION FAILED: Allowed daily_hours = -2');
    }

    console.log('\n🎉 ALL API & VALIDATION TEST CASES EXECUTED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Error executing tests:', err.message);
  }
}

runTests();
