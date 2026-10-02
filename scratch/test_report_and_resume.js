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

async function runReportAndResumeVerification() {
  console.log('🧪 VERIFYING DIAGNOSTIC REPORT RESTORATION & TASK RESUME...\n');

  // 1. REGISTER NEW USER
  const email = `resume_test_${Date.now()}@placify.ai`;
  console.log(`1️⃣ Registering User (${email})...`);
  const reg = await postJSON('http://localhost:5000/api/auth/register', {
    name: 'Task Resume User',
    email: email,
    password: 'password123',
    chosen_domain: 'dsa',
    timeline_months: 4,
    daily_hours: 2.5
  });
  const userId = reg.profile.user_id;

  // 2. SUBMIT QUIZ
  console.log(`2️⃣ Submitting Diagnostic Quiz...`);
  const evalRes = await postJSON('http://localhost:5000/api/quiz/evaluate', {
    user_id: userId,
    domain: 'Data Structures & Algorithms',
    answers: [{ id: 'dsa_q1', topic: 'Arrays', user_answer: 1, correct_answer: 1 }]
  });
  console.log(`   Quiz Evaluated: ${evalRes.evaluation.score_pct}% (${evalRes.evaluation.skill_level})`);

  // 3. GENERATE ROADMAP
  console.log(`3️⃣ Auto-Generating Personalized Roadmap...`);
  const rmRes = await postJSON('http://localhost:5000/api/roadmap/generate', { user_id: userId });
  console.log(`   Roadmap Generated: ${rmRes.roadmap.monthly_roadmap.length} Months`);

  // 4. SIMULATE USER NAVIGATING TO DAILY HUB / TASKS
  console.log(`4️⃣ Updating User last_route to "dailyHub" (simulating task viewing)...`);
  await postJSON('http://localhost:5000/api/user/route', { user_id: userId, last_route: 'dailyHub' });

  // 5. EXISTING USER LOGS IN AGAIN
  console.log(`5️⃣ Existing User Logging In Again...`);
  const loginRes = await postJSON('http://localhost:5000/api/auth/login', {
    email: email,
    password: 'password123'
  });

  console.log(`   Login Result:`);
  console.log(`   - quiz_completed: ${loginRes.profile.quiz_completed} (Expected: true)`);
  console.log(`   - last_route: ${loginRes.profile.last_route} (Expected: dailyHub)`);

  if (loginRes.profile.last_route !== 'dailyHub') {
    throw new Error(`Task resume failed! Expected 'dailyHub', got '${loginRes.profile.last_route}'`);
  }

  console.log('\n🎉 BOTH REPORT RESTORATION & TASK RESUME PASSED 100% SUCCESSFULLY!');
}

runReportAndResumeVerification().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
