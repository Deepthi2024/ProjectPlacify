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
  console.log('🧪 Starting Verification Test for Randomized 10-Question Diagnostic Quiz Flow...');

  const testUser = {
    name: 'Quiz Test User',
    email: `random_quiz_${Date.now()}@example.com`,
    password: 'Password123!',
    chosen_domain: 'datascience',
    timeline_months: 4,
    daily_hours: 2
  };

  // Step 1: Register user
  console.log('1️⃣ Registering test user...');
  const regRes = await postJSON('http://localhost:5000/api/auth/register', testUser);
  console.log('   Registered user_id:', regRes.profile.user_id);

  // Step 2: Submit Randomized 10-question evaluation
  console.log('2️⃣ Submitting 10-Question Randomized Evaluation...');
  const sample10Questions = [
    { question_id: 'ds_q1', topic: 'Python for Data Science', difficulty: 'BEGINNER', is_correct: true, user_answer: 'Pandas', type: 'MCQ' },
    { question_id: 'ds_q2', topic: 'Data Preprocessing & EDA', difficulty: 'BEGINNER', is_correct: true, user_answer: 'StandardScaler', type: 'MCQ' },
    { question_id: 'ds_q3', topic: 'Supervised Learning', difficulty: 'INTERMEDIATE', is_correct: true, user_answer: 'Random Forest', type: 'MCQ' },
    { question_id: 'ds_q4', topic: 'Unsupervised Learning', difficulty: 'INTERMEDIATE', is_correct: false, user_answer: 'DBSCAN', type: 'MCQ' },
    { question_id: 'ds_q5', topic: 'Model Evaluation Metrics', difficulty: 'INTERMEDIATE', is_correct: true, user_answer: 'F1-Score', type: 'MSQ' },
    { question_id: 'ds_q6', topic: 'Neural Networks & Deep Learning', difficulty: 'ADVANCED', is_correct: true, user_answer: 'Adam', type: 'CODE_OUTPUT' },
    { question_id: 'ds_q7', topic: 'Natural Language Processing', difficulty: 'ADVANCED', is_correct: false, user_answer: 'BERT', type: 'SCENARIO_BASED' },
    { question_id: 'ds_q8', topic: 'Big Data & Cloud Analytics', difficulty: 'ADVANCED', is_correct: true, user_answer: 'PySpark', type: 'NUMERICAL' },
    { question_id: 'ds_q9', topic: 'Statistics & Probability', difficulty: 'BEGINNER', is_correct: true, user_answer: 'Normal Distribution', type: 'MCQ' },
    { question_id: 'ds_q10', topic: 'Feature Engineering', difficulty: 'INTERMEDIATE', is_correct: true, user_answer: 'One-Hot Encoding', type: 'MCQ' }
  ];

  const evalRes = await postJSON('http://localhost:5000/api/quiz/evaluate', {
    user_id: regRes.profile.user_id,
    domain: 'Data Science & Machine Learning',
    questions: sample10Questions,
    declaredSelfLevel: 'INTERMEDIATE'
  });
  console.log('   Quiz Score:', evalRes.evaluation.overallScore + '%');
  console.log('   Assigned Skill Level:', evalRes.evaluation.overallSkillLevel);

  // Step 3: Generate Dynamic Roadmap
  console.log('3️⃣ Generating Dynamic Roadmap...');
  const roadmapRes = await postJSON('http://localhost:5000/api/roadmap/generate', {
    user_id: regRes.profile.user_id,
    quizEvaluation: evalRes.evaluation
  });
  console.log('   Roadmap overall_level:', roadmapRes.roadmap.overall_level);
  console.log('   Total phases generated:', roadmapRes.roadmap.phases.length);

  // Step 4: Login as user and verify quiz_completed persistence
  console.log('4️⃣ Testing user re-login...');
  const loginRes = await postJSON('http://localhost:5000/api/auth/login', {
    email: testUser.email,
    password: testUser.password
  });
  console.log('   Login quiz_completed:', loginRes.profile.quiz_completed);
  if (loginRes.profile.quiz_completed !== true) {
    throw new Error('quiz_completed should be true after evaluation!');
  }

  console.log('🎉 ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runVerification().catch(err => {
  console.error('❌ Verification failed:', err.message);
  process.exit(1);
});
