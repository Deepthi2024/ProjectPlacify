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
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data, error: e.message });
        }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

async function runTests() {
  console.log('========================================================');
  console.log('🧪 RUNNING COMPREHENSIVE NPTEL DIAGNOSTIC QUIZ SUITE');
  console.log('========================================================\n');

  // Test 1: Full-Stack Web Development - BEGINNER (5 questions)
  console.log('▶ Test 1: Full-Stack Web Dev - BEGINNER (5 questions)');
  const res1 = await postJSON('http://localhost:5000/api/quiz/generate', {
    userId: 'test_user_1',
    domain: 'fullstack',
    level: 'BEGINNER',
    questionCount: 5,
    forceNew: true
  });
  if (res1.status !== 200 || !res1.data.questions || res1.data.questions.length !== 5) {
    throw new Error(`Test 1 Failed: Status ${res1.status}, data: ${JSON.stringify(res1.data)}`);
  }
  console.log(`✅ Success: ${res1.data.questions.length} questions received.`);
  console.log(`   Types: ${res1.data.questions.map(q => q.type).join(', ')}`);
  console.log(`   Correct indices/values: ${res1.data.questions.map(q => JSON.stringify(q.correct)).join(', ')}\n`);

  // Test 2: Full-Stack Web Development - INTERMEDIATE (5 questions)
  console.log('▶ Test 2: Full-Stack Web Dev - INTERMEDIATE (5 questions)');
  const res2 = await postJSON('http://localhost:5000/api/quiz/generate', {
    userId: 'test_user_2',
    domain: 'fullstack',
    level: 'INTERMEDIATE',
    questionCount: 5,
    forceNew: true
  });
  if (res2.status !== 200 || !res2.data.questions || res2.data.questions.length !== 5) {
    throw new Error(`Test 2 Failed: Status ${res2.status}, data: ${JSON.stringify(res2.data)}`);
  }
  console.log(`✅ Success: ${res2.data.questions.length} questions received.`);
  console.log(`   Types: ${res2.data.questions.map(q => q.type).join(', ')}`);
  console.log(`   Snippet presence: ${res2.data.questions.map(q => !!q.codeSnippet).join(', ')}\n`);

  // Test 3: Full-Stack Web Development - ADVANCED (5 questions)
  console.log('▶ Test 3: Full-Stack Web Dev - ADVANCED (5 questions)');
  const res3 = await postJSON('http://localhost:5000/api/quiz/generate', {
    userId: 'test_user_3',
    domain: 'fullstack',
    level: 'ADVANCED',
    questionCount: 5,
    forceNew: true
  });
  if (res3.status !== 200 || !res3.data.questions || res3.data.questions.length !== 5) {
    throw new Error(`Test 3 Failed: Status ${res3.status}, data: ${JSON.stringify(res3.data)}`);
  }
  console.log(`✅ Success: ${res3.data.questions.length} questions received.`);
  console.log(`   Types: ${res3.data.questions.map(q => q.type).join(', ')}`);
  console.log(`   Sample question: ${res3.data.questions[0].question.substring(0, 60)}...\n`);

  // Test 4: DSA in C++ (10 questions)
  console.log('▶ Test 4: DSA in C++ - INTERMEDIATE (10 questions)');
  const res4 = await postJSON('http://localhost:5000/api/quiz/generate', {
    userId: 'test_user_4',
    domain: 'dsa',
    dsaLanguage: 'C++',
    level: 'INTERMEDIATE',
    questionCount: 10,
    forceNew: true
  });
  if (res4.status !== 200 || !res4.data.questions || res4.data.questions.length !== 10) {
    throw new Error(`Test 4 Failed: Status ${res4.status}, data: ${JSON.stringify(res4.data)}`);
  }
  console.log(`✅ Success: ${res4.data.questions.length} questions received.`);
  console.log(`   Types: ${res4.data.questions.map(q => q.type).join(', ')}\n`);

  // Test 5: Cloud & DevOps - ADVANCED (5 questions)
  console.log('▶ Test 5: Cloud & DevOps - ADVANCED (5 questions)');
  const res5 = await postJSON('http://localhost:5000/api/quiz/generate', {
    userId: 'test_user_5',
    domain: 'cloud_devops',
    level: 'ADVANCED',
    questionCount: 5,
    forceNew: true
  });
  if (res5.status !== 200 || !res5.data.questions || res5.data.questions.length !== 5) {
    throw new Error(`Test 5 Failed: Status ${res5.status}, data: ${JSON.stringify(res5.data)}`);
  }
  console.log(`✅ Success: ${res5.data.questions.length} questions received.`);
  console.log(`   Types: ${res5.data.questions.map(q => q.type).join(', ')}\n`);

  console.log('========================================================');
  console.log('🎉 ALL FINAL NPTEL DIAGNOSTIC ASSESSMENT TESTS PASSED!');
  console.log('========================================================');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
