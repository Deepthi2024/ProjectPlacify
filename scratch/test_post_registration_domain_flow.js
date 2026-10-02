const http = require('http');

function postJSON(urlStr, data, method = 'POST') {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const bodyStr = JSON.stringify(data);
    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

function getJSON(urlStr) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const req = http.get(urlStr, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
  });
}

async function runTest() {
  console.log('🧪 Starting Verification: Post-Registration Domain Selection Flow...\n');

  const testEmail = `test_postreg_${Date.now()}@example.com`;
  const regPayload = {
    name: 'Post-Reg Tester',
    email: testEmail,
    password: 'password123',
    timeline_months: 6,
    daily_hours: 3.0
  };

  console.log(`1. Registering user without chosen_domain (${testEmail})...`);
  const regRes = await postJSON('http://localhost:5000/api/auth/register', regPayload);
  console.log('   Status:', regRes.status);
  console.log('   Response:', regRes.data);

  if (regRes.status !== 201 || !regRes.data.profile) {
    console.error('❌ Registration failed');
    process.exit(1);
  }

  const userId = regRes.data.profile.user_id;
  const initialDomain = regRes.data.profile.chosen_domain;
  console.log(`   User ID: ${userId}, Initial chosen_domain: ${initialDomain}`);

  if (initialDomain !== null) {
    console.error('❌ Expected chosen_domain to be null at registration!');
    process.exit(1);
  }
  console.log('   ✅ Initial chosen_domain is correctly NULL\n');

  console.log(`2. Updating domain via PATCH /api/user/${userId}/domain to "datascience"...`);
  const patchRes = await postJSON(`http://localhost:5000/api/user/${userId}/domain`, { chosen_domain: 'datascience' }, 'PATCH');
  console.log('   Status:', patchRes.status);
  console.log('   Response:', patchRes.data);

  if (patchRes.status !== 200 || !patchRes.data.profile || patchRes.data.profile.chosen_domain !== 'datascience') {
    console.error('❌ PATCH domain update failed!');
    process.exit(1);
  }
  console.log('   ✅ PATCH domain update successful!\n');

  console.log(`3. Verifying updated user profile via GET /api/user/${userId}...`);
  const getRes = await getJSON(`http://localhost:5000/api/user/${userId}`);
  console.log('   Status:', getRes.status);
  console.log('   Fetched Profile Domain:', getRes.data.profile ? getRes.data.profile.chosen_domain : null);

  if (getRes.status === 200 && getRes.data.profile.chosen_domain === 'datascience') {
    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! Post-registration domain selection flow works perfectly!');
  } else {
    console.error('❌ Failed to verify user profile via GET endpoint');
    process.exit(1);
  }
}

runTest().catch(err => {
  console.error('Test Error:', err);
  process.exit(1);
});
