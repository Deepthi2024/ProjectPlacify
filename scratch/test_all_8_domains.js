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

async function testAll8Domains() {
  const domainsToTest = [
    { id: 'fullstack', expectedName: 'Full-Stack Web Development', expectedFirstQId: 'fs_js_q1' },
    { id: 'datascience', expectedName: 'Data Science & Machine Learning', expectedFirstQId: 'ds_q1' },
    { id: 'dsa', expectedName: 'Data Structures & Algorithms (Interview Prep)', expectedFirstQId: 'dsa_arr_q1' },
    { id: 'devops', expectedName: 'Cloud Engineering & DevOps', expectedFirstQId: 'dev_linux_q1' },
    { id: 'cybersecurity', expectedName: 'Cybersecurity & Ethical Hacking', expectedFirstQId: 'sec_cia_q1' },
    { id: 'mobile', expectedName: 'Mobile App Development (React Native & Flutter)', expectedFirstQId: 'mob_rn_q1' },
    { id: 'ai_llm', expectedName: 'AI & LLM Systems Engineering', expectedFirstQId: 'ai_rag_q1' },
    { id: 'system_design', expectedName: 'System Design & Distributed Architecture', expectedFirstQId: 'sys_cap_q1' }
  ];

  console.log('================================================================');
  console.log('STARTING PLACIFY ALL 8 DOMAINS DOMAIN-SPECIFIC DIAGNOSTIC TEST');
  console.log('================================================================\n');

  let passedCount = 0;

  for (const d of domainsToTest) {
    try {
      console.log(`[TEST DOMAIN] -> ID: "${d.id}" | Expected Name: "${d.expectedName}"`);

      // 1. Register candidate with selected domain
      const email = `test_${d.id}_${Date.now()}@example.com`;
      const regRes = await postJSON('/api/auth/register', {
        name: `Candidate ${d.id}`,
        email,
        password: 'password123',
        chosen_domain: d.id,
        timeline_weeks: 4,
        daily_hours: 2.0
      });

      if (regRes.status !== 201) {
        console.error(`❌ Registration failed for ${d.id}:`, regRes.json);
        continue;
      }

      const userId = regRes.json.profile.user_id;
      const registeredDomain = regRes.json.profile.chosen_domain;
      console.log(`   Registration Profile Domain: "${registeredDomain}"`);

      // 2. Submit quiz evaluation with domain
      const answers = [
        { id: d.expectedFirstQId, topic: 'Core Topic 1', user_answer: 'Sample Option', correct_answer: 'Sample Option', is_correct: true, difficulty: 'BEGINNER' }
      ];

      const evalRes = await postJSON('/api/quiz/evaluate', {
        user_id: userId,
        domain: d.id,
        answers,
        topic_evaluations: [
          { topic: 'Core Topic 1', correct_count: 1, total_questions: 1, score_pct: 100, proficiency_level: 'STRONG' }
        ]
      });

      const savedDomain = evalRes.json.evaluation.domain;
      console.log(`   MongoDB Atlas Persisted Domain: "${savedDomain}"`);

      if (evalRes.status === 200 && savedDomain === d.expectedName) {
        console.log(`   ✅ PASSED! Domain "${d.id}" correctly matched to "${savedDomain}"\n`);
        passedCount++;
      } else {
        console.error(`   ❌ FAILED! Domain "${d.id}" expected "${d.expectedName}" but got "${savedDomain}"\n`);
      }

    } catch (err) {
      console.error(`❌ Error testing domain ${d.id}:`, err.message);
    }
  }

  console.log('================================================================');
  console.log(`FINAL RESULT: ${passedCount} / 8 DOMAIN-SPECIFIC TESTS PASSED!`);
  console.log('================================================================');
}

testAll8Domains();
