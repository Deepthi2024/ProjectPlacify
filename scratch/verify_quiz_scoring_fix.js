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

async function runTests() {
  console.log('====================================================');
  console.log('RUNNING COMPREHENSIVE QUIZ SCORING VERIFICATION SUITE');
  console.log('====================================================');

  const testUserId = `test_user_score_${Date.now()}`;

  // TEST 1: All answers correct (10/10 => 100%)
  console.log('\n--- TEST 1: All 10 Answers Correct (Expected 100%) ---');
  const t1Answers = Array.from({ length: 10 }, (_, i) => ({
    id: `q_${i + 1}`,
    question: `Test Question ${i + 1}`,
    type: 'MCQ',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correct_answer: 0,
    user_answer: 0, // index match
    topic: 'Testing'
  }));

  const res1 = await postJSON('http://localhost:5000/api/quiz/evaluate', {
    user_id: testUserId,
    domain: 'fullstack',
    answers: t1Answers
  });

  console.log(`STATUS: ${res1.status}`);
  console.log('RES1 JSON:', JSON.stringify(res1.json, null, 2));
  console.log(`CORRECT: ${res1.json.evaluation.correct_count}/${res1.json.evaluation.total_questions}`);
  assert.strictEqual(res1.json.evaluation.score_pct, 100, 'Test 1 score_pct should be 100%');
  assert.strictEqual(res1.json.evaluation.correct_count, 10, 'Test 1 correct_count should be 10');
  assert.strictEqual(res1.json.evaluation.total_questions, 10, 'Test 1 total_questions should be 10');
  console.log('✅ TEST 1 PASSED!');

  // TEST 2: Half correct (5/10 => 50%)
  console.log('\n--- TEST 2: Half Correct (Expected 50%) ---');
  const t2Answers = Array.from({ length: 10 }, (_, i) => ({
    id: `q_${i + 1}`,
    question: `Test Question ${i + 1}`,
    type: 'MCQ',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correct_answer: 0,
    user_answer: i < 5 ? 0 : 1,
    topic: 'Testing'
  }));

  const res2 = await postJSON('http://localhost:5000/api/quiz/evaluate', {
    user_id: testUserId,
    domain: 'fullstack',
    answers: t2Answers
  });

  console.log(`SCORE_PCT: ${res2.json.evaluation.score_pct}%`);
  assert.strictEqual(res2.json.evaluation.score_pct, 50, 'Test 2 score_pct should be 50%');
  assert.strictEqual(res2.json.evaluation.correct_count, 5, 'Test 2 correct_count should be 5');
  console.log('✅ TEST 2 PASSED!');

  // TEST 3: All incorrect (0/10 => 0%)
  console.log('\n--- TEST 3: All Answers Incorrect (Expected 0%) ---');
  const t3Answers = Array.from({ length: 10 }, (_, i) => ({
    id: `q_${i + 1}`,
    question: `Test Question ${i + 1}`,
    type: 'MCQ',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correct_answer: 0,
    user_answer: 1,
    topic: 'Testing'
  }));

  const res3 = await postJSON('http://localhost:5000/api/quiz/evaluate', {
    user_id: testUserId,
    domain: 'fullstack',
    answers: t3Answers
  });

  console.log(`SCORE_PCT: ${res3.json.evaluation.score_pct}%`);
  assert.strictEqual(res3.json.evaluation.score_pct, 0, 'Test 3 score_pct should be 0%');
  console.log('✅ TEST 3 PASSED!');

  // TEST 4: Mixed Question Types across all supported types
  console.log('\n--- TEST 4 & 5 & 6 & 7: Mixed Question Types & Answer Representation Normalization ---');
  const t4Answers = [
    {
      id: 'q_mcq_index',
      question: 'MCQ represented as index',
      type: 'MCQ',
      options: ['Alpha', 'Beta', 'Gamma', 'Delta'],
      correct_answer: 0,
      user_answer: 0, // index match
      topic: 'Mixed'
    },
    {
      id: 'q_mcq_letter',
      question: 'MCQ represented as letter',
      type: 'MCQ',
      options: ['Alpha', 'Beta', 'Gamma', 'Delta'],
      correct_answer: 'B', // letter
      user_answer: 1, // index 1 is 'Beta' (B)
      topic: 'Mixed'
    },
    {
      id: 'q_mcq_text',
      question: 'MCQ represented as text',
      type: 'MCQ',
      options: ['Alpha', 'Beta', 'Gamma', 'Delta'],
      correct_answer: 'Gamma',
      user_answer: 'gamma', // text match case insensitive
      topic: 'Mixed'
    },
    {
      id: 'q_msq_order',
      question: 'MSQ with different selection order',
      type: 'MSQ',
      options: ['Opt 0', 'Opt 1', 'Opt 2', 'Opt 3'],
      correct_answer: [0, 2],
      user_answer: [2, 0], // different order
      topic: 'Mixed'
    },
    {
      id: 'q_true_false',
      question: 'True/False boolean vs string',
      type: 'TRUE_FALSE',
      correct_answer: true,
      user_answer: 'True', // string boolean match
      topic: 'Mixed'
    },
    {
      id: 'q_numerical',
      question: 'Numerical answer float tolerance',
      type: 'NUMERICAL',
      correct_answer: 42.0,
      user_answer: '42', // float match
      topic: 'Mixed'
    },
    {
      id: 'q_short_answer',
      question: 'Short answer with extra whitespace and caps',
      type: 'SHORT_ANSWER',
      correct_answer: '  React.js  ',
      user_answer: 'react.js', // trimmed & case-insensitive match
      topic: 'Mixed'
    }
  ];

  const res4 = await postJSON('http://localhost:5000/api/quiz/evaluate', {
    user_id: testUserId,
    domain: 'fullstack',
    answers: t4Answers
  });

  console.log(`SCORE_PCT: ${res4.json.evaluation.score_pct}%`);
  console.log(`CORRECT: ${res4.json.evaluation.correct_count}/${res4.json.evaluation.total_questions}`);
  assert.strictEqual(res4.json.evaluation.correct_count, 7, 'All 7 mixed question types should evaluate as correct');
  assert.strictEqual(res4.json.evaluation.score_pct, 100, 'Test 4 score_pct should be 100%');
  console.log('✅ TEST 4, 5, 6, 7 PASSED!');

  // TEST 8: User-Selected Question Count Denominator (e.g. 5 questions selected -> 5 correct => 100%)
  console.log('\n--- TEST 8: Denominator set to actual presented count (5 questions => 100%) ---');
  const t8Answers = Array.from({ length: 5 }, (_, i) => ({
    id: `q_5_${i + 1}`,
    question: `Question ${i + 1}`,
    type: 'MCQ',
    options: ['A', 'B', 'C', 'D'],
    correct_answer: 1,
    user_answer: 1,
    topic: 'Denominator'
  }));

  const res8 = await postJSON('http://localhost:5000/api/quiz/evaluate', {
    user_id: testUserId,
    domain: 'fullstack',
    answers: t8Answers
  });

  console.log(`SCORE_PCT: ${res8.json.evaluation.score_pct}%`);
  console.log(`CORRECT: ${res8.json.evaluation.correct_count}/${res8.json.evaluation.total_questions}`);
  assert.strictEqual(res8.json.evaluation.total_questions, 5, 'Total questions denominator must be 5');
  assert.strictEqual(res8.json.evaluation.correct_count, 5, 'Correct count must be 5');
  assert.strictEqual(res8.json.evaluation.score_pct, 100, '5/5 score must be 100%');
  console.log('✅ TEST 8 PASSED!');

  console.log('\n====================================================');
  console.log('🎉 ALL 8 TEST CASES SUCCEEDED PERFECTLY!');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
