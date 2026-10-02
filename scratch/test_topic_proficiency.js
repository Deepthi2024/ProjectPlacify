const http = require('http');

function postJSON(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => resolve({ status: res.statusCode, json: JSON.parse(responseBody) }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function test() {
  try {
    console.log('==================================================');
    console.log('1. Registering user for AI & LLM Systems Engineering...');
    console.log('==================================================');
    const email = `ai_prof_test_${Date.now()}@example.com`;
    const regRes = await postJSON('/api/auth/register', {
      name: 'AI Engineering Candidate',
      email,
      password: 'password123',
      chosen_domain: 'ai_llm',
      timeline_weeks: 4,
      daily_hours: 2.0
    });
    console.log('Registration Status:', regRes.status);
    const userId = regRes.json.profile.user_id;

    console.log('\n==================================================');
    console.log('2. Submitting 10 Diagnostic Answers with Mixed Topic Performance...');
    console.log('==================================================');

    // 10 questions across 5 topics:
    // Topic 1: RAG & Knowledge Retrieval (2/2 correct => 100% STRONG)
    // Topic 2: Vector Embeddings & Similarity Metrics (1/2 correct => 50% INTERMEDIATE)
    // Topic 3: Prompt Engineering & Reasoning (0/2 correct => 0% WEAK)
    // Topic 4: Vector Databases & Indexing (2/2 correct => 100% STRONG)
    // Topic 5: Agentic Tool Calling & Guardrails (0/2 correct => 0% WEAK)
    const answers = [
      { id: 'ai_q1', topic: 'RAG & Knowledge Retrieval', user_answer: 'Correct', correct_answer: 'Correct', difficulty: 'BEGINNER' },
      { id: 'ai_q2', topic: 'RAG & Knowledge Retrieval', user_answer: 'Correct', correct_answer: 'Correct', difficulty: 'INTERMEDIATE' },

      { id: 'ai_q3', topic: 'Vector Embeddings & Similarity Metrics', user_answer: 'Correct', correct_answer: 'Correct', difficulty: 'BEGINNER' },
      { id: 'ai_q4', topic: 'Vector Embeddings & Similarity Metrics', user_answer: 'Wrong', correct_answer: 'Correct', difficulty: 'INTERMEDIATE' },

      { id: 'ai_q5', topic: 'Prompt Engineering & Reasoning', user_answer: 'Wrong', correct_answer: 'Correct', difficulty: 'BEGINNER' },
      { id: 'ai_q6', topic: 'Prompt Engineering & Reasoning', user_answer: 'Wrong', correct_answer: 'Correct', difficulty: 'INTERMEDIATE' },

      { id: 'ai_q7', topic: 'Vector Databases & Indexing', user_answer: 'Correct', correct_answer: 'Correct', difficulty: 'BEGINNER' },
      { id: 'ai_q8', topic: 'Vector Databases & Indexing', user_answer: 'Correct', correct_answer: 'Correct', difficulty: 'ADVANCED' },

      { id: 'ai_q9', topic: 'Agentic Tool Calling & Guardrails', user_answer: 'Wrong', correct_answer: 'Correct', difficulty: 'BEGINNER' },
      { id: 'ai_q10', topic: 'Agentic Tool Calling & Guardrails', user_answer: 'Wrong', correct_answer: 'Correct', difficulty: 'ADVANCED' }
    ];

    const evalRes = await postJSON('/api/quiz/evaluate', {
      user_id: userId,
      domain: 'AI & LLM Systems Engineering',
      answers
    });

    console.log('Quiz Evaluation Status:', evalRes.status);
    console.log('Overall Score:', evalRes.json.evaluation.score_pct + '%');
    console.log('Overall Skill Level:', evalRes.json.evaluation.skill_level);
    console.log('Total Questions Evaluated:', evalRes.json.evaluation.total_questions);

    console.log('\n📊 PER-TOPIC PROFICIENCY BREAKDOWN:');
    const topicEvals = evalRes.json.evaluation.topic_evaluations;
    topicEvals.forEach(t => {
      let icon = t.proficiency_level === 'STRONG' ? '🟢' : (t.proficiency_level === 'INTERMEDIATE' ? '🟡' : '🔴');
      console.log(`  ${icon} Topic: "${t.topic}" -> Level: ${t.proficiency_level} (${t.score_pct}% - ${t.correct_count}/${t.total_questions} correct)`);
    });

    const strongCount = topicEvals.filter(t => t.proficiency_level === 'STRONG').length;
    const interCount = topicEvals.filter(t => t.proficiency_level === 'INTERMEDIATE').length;
    const weakCount = topicEvals.filter(t => t.proficiency_level === 'WEAK').length;

    if (strongCount === 2 && interCount === 1 && weakCount === 2 && evalRes.json.evaluation.total_questions === 10) {
      console.log('\n✅ ALL PER-TOPIC PROFICIENCY EVALUATION CHECKS PASSED SUCCESSFULLY!');
    } else {
      console.error('\n❌ Topic evaluation assertion mismatch!');
    }

  } catch (err) {
    console.error('Test error:', err);
  }
}

test();
