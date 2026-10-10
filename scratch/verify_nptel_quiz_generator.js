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

async function runTests() {
  console.log('=== TEST 1: Full-Stack Web Development (BEGINNER, 5 Qs) ===');
  const t1 = await postJSON('http://localhost:5000/api/quiz/generate', {
    userId: 'u_beg_' + Date.now(),
    domain: 'fullstack',
    level: 'BEGINNER',
    questionCount: 5,
    forceNew: true
  });
  console.log('✅ Received', t1.questions.length, 'questions');
  console.log('Types:', t1.questions.map(q => q.type));
  t1.questions.forEach((q, i) => {
    console.log(`Q${i+1} [${q.type}] (${q.difficulty}): ${q.question.slice(0, 70)}...`);
    if (q.options.length > 0) console.log(`   Options (${q.options.length}):`, q.options.slice(0, 2), '...');
    console.log(`   Correct:`, q.correct);
  });

  console.log('\n=== TEST 2: Full-Stack Web Development (INTERMEDIATE, 5 Qs) ===');
  const t2 = await postJSON('http://localhost:5000/api/quiz/generate', {
    userId: 'u_int_' + Date.now(),
    domain: 'fullstack',
    level: 'INTERMEDIATE',
    questionCount: 5,
    forceNew: true
  });
  console.log('✅ Received', t2.questions.length, 'questions');
  console.log('Types:', t2.questions.map(q => q.type));
  t2.questions.forEach((q, i) => {
    console.log(`Q${i+1} [${q.type}] (${q.difficulty}): ${q.question.slice(0, 70)}...`);
    if (q.codeSnippet) console.log(`   CodeSnippet: ${q.codeSnippet.replace(/\n/g, ' ').slice(0, 60)}...`);
    console.log(`   Correct:`, q.correct);
  });

  console.log('\n=== TEST 3: Full-Stack Web Development (ADVANCED, 5 Qs) ===');
  const t3 = await postJSON('http://localhost:5000/api/quiz/generate', {
    userId: 'u_adv_' + Date.now(),
    domain: 'fullstack',
    level: 'ADVANCED',
    questionCount: 5,
    forceNew: true
  });
  console.log('✅ Received', t3.questions.length, 'questions');
  console.log('Types:', t3.questions.map(q => q.type));
  t3.questions.forEach((q, i) => {
    console.log(`Q${i+1} [${q.type}] (${q.difficulty}): ${q.question.slice(0, 70)}...`);
    console.log(`   Correct:`, q.correct);
  });

  console.log('\n=== TEST 4: DSA in C++ (INTERMEDIATE, 5 Qs) ===');
  const t4 = await postJSON('http://localhost:5000/api/quiz/generate', {
    userId: 'u_dsa_' + Date.now(),
    domain: 'dsa',
    level: 'INTERMEDIATE',
    dsaLanguage: 'C++',
    questionCount: 5,
    forceNew: true
  });
  console.log('✅ Received', t4.questions.length, 'questions');
  console.log('Types:', t4.questions.map(q => q.type));
  t4.questions.forEach((q, i) => {
    console.log(`Q${i+1} [${q.type}] (${q.difficulty}): ${q.question.slice(0, 70)}...`);
    if (q.codeSnippet) console.log(`   CodeSnippet: ${q.codeSnippet.replace(/\n/g, ' ').slice(0, 60)}...`);
    console.log(`   Correct:`, q.correct);
  });

  console.log('\n=== TEST 5: Data Science & ML (ADVANCED, 5 Qs) ===');
  const t5 = await postJSON('http://localhost:5000/api/quiz/generate', {
    userId: 'u_ds_' + Date.now(),
    domain: 'datascience',
    level: 'ADVANCED',
    questionCount: 5,
    forceNew: true
  });
  console.log('✅ Received', t5.questions.length, 'questions');
  console.log('Types:', t5.questions.map(q => q.type));
  t5.questions.forEach((q, i) => {
    console.log(`Q${i+1} [${q.type}] (${q.difficulty}): ${q.question.slice(0, 70)}...`);
    console.log(`   Correct:`, q.correct);
  });

  console.log('\n🎉 ALL NPTEL DIAGNOSTIC QUIZ GENERATION TESTS PASSED!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
