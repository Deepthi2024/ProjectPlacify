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
    const newDomains = [
      { id: 'cybersecurity', name: 'Cybersecurity & Ethical Hacking', prefix: 'sec_q' },
      { id: 'mobile', name: 'Mobile App Development (React Native & Flutter)', prefix: 'mob_q' },
      { id: 'ai_llm', name: 'AI & LLM Systems Engineering', prefix: 'ai_q' },
      { id: 'system_design', name: 'System Design & Distributed Architecture', prefix: 'sys_q' }
    ];

    for (const d of newDomains) {
      console.log(`\n==========================================`);
      console.log(`Testing Domain: ${d.name} (${d.id})`);
      console.log(`==========================================`);
      
      const email = `test_${d.id}_${Date.now()}@example.com`;
      const regRes = await postJSON('/api/auth/register', {
        name: `Tester ${d.id}`,
        email,
        password: 'password123',
        chosen_domain: d.id,
        timeline_weeks: 6,
        daily_hours: 4.0
      });
      console.log('Registration status:', regRes.status);
      console.log('Registered Profile Domain:', regRes.json.profile.chosen_domain);

      const userId = regRes.json.profile.user_id;

      // Construct 8 questions for evaluation
      const mockAnswers = Array.from({ length: 8 }, (_, i) => ({
        id: `${d.prefix}${i + 1}`,
        question: `Question ${i + 1} for ${d.name}`,
        user_answer: `Correct Option ${i + 1}`,
        correct_answer: `Correct Option ${i + 1}`,
        topic: `Topic ${i + 1}`,
        difficulty: i < 2 ? 'BEGINNER' : (i >= 6 ? 'ADVANCED' : 'INTERMEDIATE')
      }));

      const evalRes = await postJSON('/api/quiz/evaluate', {
        user_id: userId,
        domain: d.name,
        answers: mockAnswers
      });

      console.log('Quiz Eval status:', evalRes.status);
      console.log('Recorded Domain in DB:', evalRes.json.evaluation.domain);
      console.log('Score:', evalRes.json.evaluation.score_pct + '%');
      console.log('Evaluated total questions:', evalRes.json.evaluation.total_questions);
      console.log('Skill level:', evalRes.json.evaluation.skill_level);

      if (evalRes.json.evaluation.domain === d.name && evalRes.json.evaluation.total_questions === 8) {
        console.log(`✅ ${d.name} TEST PASSED!`);
      } else {
        console.error(`❌ ${d.name} TEST FAILED!`);
      }
    }

    console.log(`\n🎉 ALL NEW DOMAIN & 8-QUESTION EVALUATION TESTS COMPLETED!`);
  } catch (err) {
    console.error('Test error:', err);
  }
}

test();
