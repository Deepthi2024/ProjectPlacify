const http = require('http');

function generateQuiz(userId, questionCount, domain, level) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ userId, questionCount, domain, level, forceNew: true });
    console.log(`\n----------------------------------------`);
    console.log(`[TEST REQUEST] User: ${userId} | Domain: ${domain} | Level: ${level} | Requested Count: ${questionCount}`);
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/quiz/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      },
      timeout: 600000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode !== 200) {
            console.error(`Status ${res.statusCode}:`, parsed);
            return reject(new Error(parsed.error || 'Request failed'));
          }
          console.log(`Status: ${res.statusCode}`);
          console.log(`Quiz ID: ${parsed.quizId}`);
          console.log(`Domain Returned: ${parsed.domain} (${parsed.domainId})`);
          console.log(`Level Returned: ${parsed.level}`);
          console.log(`Random Seed: ${parsed.randomSeed}`);
          console.log(`Returned Question Count: ${parsed.questions ? parsed.questions.length : 0}`);
          resolve(parsed);
        } catch (e) {
          console.error('Raw response body:', body);
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runSuite() {
  try {
    const delay = () => new Promise(r => setTimeout(r, 1500));

    console.log('========================================');
    console.log('STARTING PLACIFY DIAGNOSTIC QUIZ TEST SUITE');
    console.log('========================================');

    // TEST 1: Question Counts (5, 10, 15, 20, 25, 30)
    const countsToTest = [5, 10, 15, 20, 25, 30];
    for (const count of countsToTest) {
      const res = await generateQuiz(`test_user_count_${count}`, count, 'datascience', 'BEGINNER');
      if (!res.questions || res.questions.length !== count) {
        throw new Error(`❌ COUNT MISMATCH! Requested ${count}, got ${res.questions ? res.questions.length : 0}`);
      }
      console.log(`✅ Count Test ${count} PASSED: returned exactly ${count} questions.`);
      await delay();
    }

    // TEST 2: Randomness Test across 3 Users (Same domain, level, count)
    console.log('\n--- RANDOMNESS TEST ACROSS 3 USERS (Data Science, BEGINNER, 20 Qs) ---');
    const u1 = await generateQuiz('user_alpha', 20, 'datascience', 'BEGINNER');
    await delay();
    const u2 = await generateQuiz('user_beta', 20, 'datascience', 'BEGINNER');
    await delay();
    const u3 = await generateQuiz('user_gamma', 20, 'datascience', 'BEGINNER');
    await delay();

    if (u1.questions.length !== 20 || u2.questions.length !== 20 || u3.questions.length !== 20) {
      throw new Error('❌ Randomness test failed: count mismatch.');
    }
    if (u1.randomSeed === u2.randomSeed || u2.randomSeed === u3.randomSeed) {
      throw new Error('❌ Randomness test failed: seeds are not unique!');
    }
    console.log('✅ Randomness Test PASSED: All 3 users received exactly 20 questions with unique seeds!');
    console.log(`   User 1 Seed: ${u1.randomSeed}`);
    console.log(`   User 2 Seed: ${u2.randomSeed}`);
    console.log(`   User 3 Seed: ${u3.randomSeed}`);

    // TEST 3: Level Specificity Test (INTERMEDIATE)
    console.log('\n--- LEVEL SPECIFICITY TEST (Data Science, INTERMEDIATE, 20 Qs) ---');
    const interRes = await generateQuiz('user_intermediate', 20, 'datascience', 'INTERMEDIATE');
    if (interRes.level !== 'INTERMEDIATE' || interRes.questions.length !== 20) {
      throw new Error('❌ Level test failed.');
    }
    console.log('✅ Level Specificity Test PASSED!');
    await delay();

    // TEST 4: Domain Specificity Test (Cybersecurity)
    console.log('\n--- DOMAIN SPECIFICITY TEST (Cybersecurity, BEGINNER, 20 Qs) ---');
    const cyberRes = await generateQuiz('user_cyber', 20, 'cybersecurity', 'BEGINNER');
    if (cyberRes.domainId !== 'cybersecurity' || cyberRes.questions.length !== 20) {
      throw new Error('❌ Domain test failed.');
    }
    console.log('✅ Domain Specificity Test PASSED!');

    console.log('\n========================================');
    console.log('🎉 ALL DIAGNOSTIC QUIZ TESTS PASSED 100%! 🎉');
    console.log('========================================');

  } catch (err) {
    console.error('❌ Test suite failed:', err);
    process.exit(1);
  }
}

runSuite();
