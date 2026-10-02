const http = require('http');
const assert = require('assert');

function postJSON(urlStr, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const bodyText = JSON.stringify(data);
    const req = http.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyText)
      }
    }, res => {
      let buf = '';
      res.on('data', chunk => buf += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(buf);
          resolve({ status: res.statusCode, json: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: buf });
        }
      });
    });
    req.on('error', reject);
    req.write(bodyText);
    req.end();
  });
}

async function runPipelineVerification() {
  console.log('===========================================================');
  console.log('VERIFYING QUIZ QUESTION GENERATION & RENDERING PIPELINE');
  console.log('===========================================================');

  const testCases = [
    { domain: 'fullstack', level: 'BEGINNER', count: 5 },
    { domain: 'datascience', level: 'INTERMEDIATE', count: 10 },
    { domain: 'cybersecurity', level: 'ADVANCED', count: 5 }
  ];

  for (const tc of testCases) {
    console.log(`\n--- Requesting ${tc.count} questions for ${tc.domain} (${tc.level}) ---`);
    const res = await postJSON('http://localhost:5000/api/quiz/generate', {
      userId: `test_user_pipeline_${Date.now()}`,
      questionCount: tc.count,
      domain: tc.domain,
      level: tc.level,
      forceNew: true
    });

    console.log(`STATUS: ${res.status}`);
    assert.strictEqual(res.status, 200, 'Generation endpoint should return 200 OK');

    const quiz = res.json;
    assert.ok(quiz && Array.isArray(quiz.questions), 'Response must contain a valid questions array');
    console.log(`Generated Question Count: ${quiz.questions.length}`);
    console.log(`Requested Question Count: ${tc.count}`);
    console.log(`Domain: ${quiz.domain}`);
    console.log(`Level: ${quiz.level}`);

    assert.strictEqual(quiz.questions.length, tc.count, `Must generate exactly ${tc.count} questions`);

    // Verify required UI fields for every question item
    quiz.questions.forEach((q, idx) => {
      assert.ok(q.id, `Question ${idx + 1} must have a valid ID`);
      assert.ok(q.question, `Question ${idx + 1} must have text`);
      assert.ok(q.type, `Question ${idx + 1} must have a question type`);
      assert.ok(q.correct !== undefined, `Question ${idx + 1} must have a correct answer field`);
      assert.ok(q.topic, `Question ${idx + 1} must have a topic`);
      assert.ok(q.difficulty, `Question ${idx + 1} must have a difficulty`);

      const isTextOrNumeric = ['NUMERICAL', 'FILL_BLANK', 'FILL_IN_THE_BLANK', 'SHORT_ANSWER'].includes((q.type || '').toUpperCase());
      if (!isTextOrNumeric) {
        assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Choice question ${idx + 1} (${q.type}) must have at least 2 options`);
      }
    });

    console.log(`✅ ${tc.count} questions successfully generated & validated for ${tc.domain}!`);
  }

  console.log('\n===========================================================');
  console.log('🎉 QUESTION GENERATION & RENDERING PIPELINE VERIFIED 100%!');
  console.log('===========================================================');
}

runPipelineVerification().catch(err => {
  console.error('❌ Pipeline verification failed:', err);
  process.exit(1);
});
