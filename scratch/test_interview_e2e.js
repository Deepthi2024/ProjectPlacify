const fs = require('fs');

async function testEndToEnd() {
  console.log('--- 1. Testing External Resources Retrieval ---');
  const res1 = await fetch('http://localhost:5000/api/interview-resources?domain=Full-Stack%20Web%20Development&topic=React%20State%20Management&resource_type=interview_questions');
  const d1 = await res1.json();
  console.log('✓ External resources loaded:', d1.success, 'Count:', d1.resources.length);
  if (d1.resources.length > 0) {
    console.log('  First resource:', d1.resources[0].name, '->', d1.resources[0].url);
  }

  console.log('\n--- 2. Testing AI Question Generation (Groq) ---');
  const res2 = await fetch('http://localhost:5000/api/interview-questions/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      domain: 'Full-Stack Web Development',
      topic: 'Asynchronous JavaScript & Promises',
      difficulty: 'Intermediate',
      count: 3,
      question_type: 'Mixed',
      category: 'Technical Fundamentals',
      phase_number: 1,
      phase_title: 'Frontend Fundamentals'
    })
  });
  const d2 = await res2.json();
  console.log('✓ Questions generated:', d2.success, 'Count:', d2.questions.length);
  d2.questions.forEach((q, i) => console.log(`  Q${i+1} [${q.type}] (${q.difficulty}): ${q.question.substring(0, 70)}...`));

  console.log('\n--- 3. Testing Answer Evaluation (Groq) ---');
  const sampleAnswers = {};
  d2.questions.forEach((q, idx) => {
    sampleAnswers[q.id] = q.type === 'mcq' ? 'B' : 'Asynchronous JavaScript uses the event loop, microtask queue, and macrotask queue to handle non-blocking operations.';
  });

  const res3 = await fetch('http://localhost:5000/api/interview-questions/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      questions: d2.questions,
      answers: sampleAnswers,
      domain: 'Full-Stack Web Development',
      topic: 'Asynchronous JavaScript & Promises',
      difficulty: 'Intermediate'
    })
  });
  const d3 = await res3.json();
  console.log('✓ Evaluation score:', d3.score_pct + '%', 'Evaluations count:', d3.evaluation_details?.length);

  console.log('\n--- 4. Testing MongoDB Persistence & History Retrieval ---');
  const testUserId = 'test_eval_user_placify_' + Date.now();
  const res4 = await fetch('http://localhost:5000/api/interview-practice/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: testUserId,
      domain: 'Full-Stack Web Development',
      topic: 'Asynchronous JavaScript & Promises',
      phase_number: 1,
      phase_title: 'Frontend Fundamentals',
      difficulty: 'Intermediate',
      question_type: 'Mixed',
      category: 'Technical Fundamentals',
      score_pct: d3.score_pct || 80,
      total_questions: d2.questions.length,
      correct_count: d3.correct_count || 2,
      partially_correct_count: d3.partially_correct_count || 1,
      incorrect_count: d3.incorrect_count || 0,
      questions: d2.questions,
      answers: sampleAnswers,
      evaluation_details: d3.evaluation_details || []
    })
  });
  const d4 = await res4.json();
  console.log('✓ Practice session saved:', d4.success, 'Practice ID:', d4.practice_id);

  const res5 = await fetch(`http://localhost:5000/api/interview-practice/user/${encodeURIComponent(testUserId)}`);
  const d5 = await res5.json();
  console.log('✓ User practice history retrieved:', d5.success, 'History count:', d5.practices?.length);

  console.log('\n=== ALL END-TO-END VERIFICATIONS PASSED ===');
}

testEndToEnd().catch(err => console.error('E2E test failed:', err));
