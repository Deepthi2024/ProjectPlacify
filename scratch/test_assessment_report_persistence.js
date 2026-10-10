const http = require('http');

function postJSON(url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      },
      res => {
        let raw = '';
        res.on('data', chunk => (raw += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(raw) });
          } catch (e) {
            resolve({ status: res.statusCode, text: raw });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getJSON(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname,
        method: 'GET'
      },
      res => {
        let raw = '';
        res.on('data', chunk => (raw += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(raw) });
          } catch (e) {
            resolve({ status: res.statusCode, text: raw });
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Assessment Report Persistence & Restoration Test Suite...');
  const baseUrl = 'http://localhost:5000';

  // 1. Register User A
  const userAEmail = `test_pers_${Date.now()}@example.com`;
  const regResA = await postJSON(`${baseUrl}/api/auth/register`, {
    name: 'Alice Persona',
    email: userAEmail,
    password: 'password123',
    chosen_domain: 'Full-Stack Web Development',
    timeline_months: 3,
    daily_hours: 2.5
  });
  console.log('1. User A registered:', regResA.status, regResA.data?.profile?.user_id);
  const userAId = regResA.data.profile.user_id;

  // 2. Submit Diagnostic Assessment for User A
  const evalPayloadA = {
    user_id: userAId,
    domain: 'Full-Stack Web Development',
    answers: [
      { id: 'q1', question: 'What is JSX?', user_answer: '1', correct_answer: '1', topic: 'React & UI Architecture', difficulty: 'BEGINNER', is_correct: true },
      { id: 'q2', question: 'What is Node event loop?', user_answer: '0', correct_answer: '0', topic: 'Node.js & Backend Architecture', difficulty: 'INTERMEDIATE', is_correct: true },
      { id: 'q3', question: 'What is SQL Indexing?', user_answer: '2', correct_answer: '1', topic: 'Database Engineering & Schema Design', difficulty: 'ADVANCED', is_correct: false }
    ],
    topic_evaluations: [
      {
        topic: 'React & UI Architecture',
        correct_count: 1,
        total_questions: 1,
        score_pct: 100,
        proficiency_level: 'STRONG',
        beginner_accuracy: 100,
        intermediate_accuracy: 100,
        advanced_accuracy: 0,
        weak_concepts: [],
        reason: 'Mastered JSX syntax'
      },
      {
        topic: 'Node.js & Backend Architecture',
        correct_count: 1,
        total_questions: 1,
        score_pct: 100,
        proficiency_level: 'INTERMEDIATE',
        beginner_accuracy: 100,
        intermediate_accuracy: 100,
        advanced_accuracy: 0,
        weak_concepts: [],
        reason: 'Solid event loop knowledge'
      },
      {
        topic: 'Database Engineering & Schema Design',
        correct_count: 0,
        total_questions: 1,
        score_pct: 0,
        proficiency_level: 'WEAK',
        beginner_accuracy: 100,
        intermediate_accuracy: 100,
        advanced_accuracy: 0,
        weak_concepts: ['B-Tree Indexing'],
        reason: 'Missed index traversal'
      }
    ]
  };

  const evalResA = await postJSON(`${baseUrl}/api/quiz/evaluate`, evalPayloadA);
  console.log('2. User A assessment evaluated & saved:', evalResA.status, evalResA.data?.evaluation?.score_pct);
  if (evalResA.status !== 200 || !evalResA.data.evaluation) {
    throw new Error('Failed to save User A evaluation');
  }

  // 3. Test GET /api/quiz/evaluation/:userId for User A
  const getEvalA = await getJSON(`${baseUrl}/api/quiz/evaluation/${userAId}`);
  console.log('3. Retrieved User A evaluation from MongoDB:', getEvalA.status, getEvalA.data?.evaluation?.score_pct + '%');
  if (getEvalA.status !== 200 || !getEvalA.data.evaluation) {
    throw new Error('Failed to retrieve User A evaluation');
  }
  const evalDataA = getEvalA.data.evaluation;
  console.log('   - Score:', evalDataA.score_pct + '%');
  console.log('   - Skill Level:', evalDataA.skill_level);
  console.log('   - Knowledge Gaps Count:', evalDataA.knowledgeGaps.length);
  console.log('   - Intermediate Topics Count:', evalDataA.intermediateTopics.length);
  console.log('   - Strong Topics Count:', evalDataA.strongTopics.length);
  console.log('   - Topic Evaluations Count:', evalDataA.topicEvaluations.length);

  if (evalDataA.knowledgeGaps.length !== 1 || evalDataA.knowledgeGaps[0].topic !== 'Database Engineering & Schema Design') {
    throw new Error('User A Knowledge gaps do not match expected!');
  }
  if (evalDataA.strongTopics.length !== 1 || evalDataA.strongTopics[0].topic !== 'React & UI Architecture') {
    throw new Error('User A Strong topics do not match expected!');
  }

  // 4. Test User B Isolation (User B has no evaluation yet)
  const userBEmail = `test_pers_b_${Date.now()}@example.com`;
  const regResB = await postJSON(`${baseUrl}/api/auth/register`, {
    name: 'Bob Isolation',
    email: userBEmail,
    password: 'password123',
    chosen_domain: 'Cybersecurity & Ethical Hacking',
    timeline_months: 6,
    daily_hours: 2.0
  });
  const userBId = regResB.data.profile.user_id;
  const getEvalB = await getJSON(`${baseUrl}/api/quiz/evaluation/${userBId}`);
  console.log('4. User B evaluation status (should be 404):', getEvalB.status);
  if (getEvalB.status !== 404) {
    throw new Error('User B should not have an evaluation yet!');
  }

  // 5. Test User A Login & Profile check
  const loginResA = await postJSON(`${baseUrl}/api/auth/login`, {
    email: userAEmail,
    password: 'password123'
  });
  console.log('5. User A Login successful:', loginResA.status, 'quiz_completed:', loginResA.data?.profile?.quiz_completed, 'last_route:', loginResA.data?.profile?.last_route);
  if (!loginResA.data?.profile?.quiz_completed || loginResA.data?.profile?.last_route !== 'assessmentReport') {
    throw new Error('User A profile does not have quiz_completed=true or last_route=assessmentReport');
  }

  // 6. Test User A Roadmap Generation on demand (when user clicks Build Personalized Milestone Roadmap)
  const genRoadmapRes = await postJSON(`${baseUrl}/api/roadmap/generate`, {
    user_id: userAId,
    quizEvaluation: evalDataA
  });
  console.log('6. Roadmap generated on demand:', genRoadmapRes.status, 'success:', genRoadmapRes.data?.success);
  if (genRoadmapRes.status !== 200 || !genRoadmapRes.data.roadmap) {
    throw new Error('Roadmap generation failed!');
  }

  console.log('🎉 ALL PERSISTENCE & RESTORATION TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
