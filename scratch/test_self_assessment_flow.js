const http = require('http');

function postJSON(urlStr, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const bodyStr = JSON.stringify(data);
    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr)
      }
    }, (res) => {
      let respBody = '';
      res.on('data', chunk => respBody += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(respBody);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.error || respBody}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse JSON response: ${respBody}`));
        }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

async function runVerification() {
  console.log('🧪 Starting Verification Test for Self-Assessment Flow...');

  const testUser = {
    name: 'Self Assess User',
    email: `self_assess_${Date.now()}@example.com`,
    password: 'Password123!',
    chosen_domain: 'fullstack',
    timeline_months: 6,
    daily_hours: 3
  };

  // Step 1: Register user
  console.log('1️⃣ Registering test user...');
  const regRes = await postJSON('http://localhost:5000/api/auth/register', testUser);
  console.log('   Registered user_id:', regRes.profile.user_id);
  console.log('   Initial quiz_completed:', regRes.profile.quiz_completed);
  if (regRes.profile.quiz_completed !== false) {
    throw new Error('New user should have quiz_completed = false');
  }

  // Step 2: Submit Self-Assessment (Skip Quiz) with INTERMEDIATE level
  console.log('2️⃣ Submitting Manual Self-Assessment (INTERMEDIATE level)...');
  const evalRes = await postJSON('http://localhost:5000/api/quiz/evaluate', {
    user_id: regRes.profile.user_id,
    domain: 'Full-Stack Web Development',
    is_self_assessed: true,
    skill_level: 'INTERMEDIATE',
    topic_evaluations: [
      { topic: 'JavaScript & ES6+', proficiency_level: 'INTERMEDIATE', score_pct: 65 },
      { topic: 'React.js Architecture', proficiency_level: 'WEAK', score_pct: 30 }
    ]
  });
  console.log('   Quiz Evaluate response message:', evalRes.message);

  // Step 3: Generate Dynamic Roadmap with Self-Assessed Evaluation
  console.log('3️⃣ Generating Dynamic Roadmap with Self-Assessed Evaluation...');
  const roadmapRes = await postJSON('http://localhost:5000/api/roadmap/generate', {
    user_id: regRes.profile.user_id,
    quizEvaluation: {
      is_self_assessed: true,
      skill_level: 'INTERMEDIATE',
      score_pct: 65,
      topic_evaluations: [
        { topic: 'JavaScript & ES6+', proficiency_level: 'INTERMEDIATE', score_pct: 65 },
        { topic: 'React.js Architecture', proficiency_level: 'WEAK', score_pct: 30 }
      ]
    }
  });
  console.log('   Roadmap overall_level:', roadmapRes.roadmap.overall_level);
  if (roadmapRes.roadmap.overall_level !== 'INTERMEDIATE') {
    throw new Error(`Expected roadmap overall_level to be INTERMEDIATE, got ${roadmapRes.roadmap.overall_level}`);
  }

  // Step 4: Login as user and verify quiz_completed is true
  console.log('4️⃣ Testing user re-login to verify quiz_completed persistence...');
  const loginRes = await postJSON('http://localhost:5000/api/auth/login', {
    email: testUser.email,
    password: testUser.password
  });
  console.log('   Login quiz_completed:', loginRes.profile.quiz_completed);
  if (loginRes.profile.quiz_completed !== true) {
    throw new Error('quiz_completed should be true after self-assessment!');
  }

  console.log('🎉 ALL SELF-ASSESSMENT VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runVerification().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
