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
    console.log('1. Registering Candidate for Full-Stack NPTEL Assessment...');
    console.log('==================================================');
    const email = `nptel_test_${Date.now()}@example.com`;
    const regRes = await postJSON('/api/auth/register', {
      name: 'NPTEL Test Candidate',
      email,
      password: 'password123',
      chosen_domain: 'fullstack',
      timeline_weeks: 6,
      daily_hours: 4.0
    });

    console.log('Registration Status:', regRes.status);
    const userId = regRes.json.profile.user_id;

    console.log('\n==================================================');
    console.log('2. Submitting 30 NPTEL Diagnostic Answers across 6 Topics...');
    console.log('==================================================');

    // 30 Question formatted answers:
    const mockAnswersArray = [
      // Topic 1: JavaScript Fundamentals (4/5 correct)
      { id: 'fs_js_q1', topic: 'JavaScript Fundamentals', subtopic: 'Scope & Hoisting', type: 'MCQ', difficulty: 'BEGINNER', user_answer: 'undefined', correct_answer: 'undefined', is_correct: true },
      { id: 'fs_js_q2', topic: 'JavaScript Fundamentals', subtopic: 'Event Loop & Async Programming', type: 'CODE_OUTPUT', difficulty: 'BEGINNER', user_answer: '1, 4, 3, 2', correct_answer: '1, 4, 3, 2', is_correct: true },
      { id: 'fs_js_q3', topic: 'JavaScript Fundamentals', subtopic: 'Closures & Memory', type: 'MSQ', difficulty: 'INTERMEDIATE', user_answer: 'Option 1; Option 2; Option 4', correct_answer: 'Option 1; Option 2; Option 4', is_correct: true },
      { id: 'fs_js_q4', topic: 'JavaScript Fundamentals', subtopic: 'Prototype Chain', type: 'ASSERTION_REASONING', difficulty: 'INTERMEDIATE', user_answer: 'Both A and R are true, and R is the correct explanation of A.', correct_answer: 'Both A and R are true, and R is the correct explanation of A.', is_correct: true },
      { id: 'fs_js_q5', topic: 'JavaScript Fundamentals', subtopic: 'Event Loop & Node.js Microtasks', type: 'NUMERICAL', difficulty: 'ADVANCED', user_answer: '5', correct_answer: '10', is_correct: false },

      // Topic 2: REST API & Backend Architecture (2/5 correct)
      { id: 'fs_api_q1', topic: 'REST API & Backend Architecture', subtopic: 'HTTP Methods & Idempotency', type: 'MCQ', difficulty: 'BEGINNER', user_answer: 'PUT', correct_answer: 'PUT', is_correct: true },
      { id: 'fs_api_q2', topic: 'REST API & Backend Architecture', subtopic: 'HTTP Status Codes', type: 'MCQ', difficulty: 'BEGINNER', user_answer: '401 Unauthorized', correct_answer: '401 Unauthorized', is_correct: true },
      { id: 'fs_api_q3', topic: 'REST API & Backend Architecture', subtopic: 'Middleware & Request Pipeline', type: 'MSQ', difficulty: 'INTERMEDIATE', user_answer: 'Parsing incoming JSON', correct_answer: 'Parsing incoming JSON; Authentication', is_correct: false },
      { id: 'fs_api_q4', topic: 'REST API & Backend Architecture', subtopic: 'API Rate Limiting', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', user_answer: 'In-memory Map', correct_answer: 'Redis cluster', is_correct: false },
      { id: 'fs_api_q5', topic: 'REST API & Backend Architecture', subtopic: 'GraphQL vs REST', type: 'APPLICATION_BASED', difficulty: 'ADVANCED', user_answer: 'Disabling parameters', correct_answer: 'DataLoader batching', is_correct: false },

      // Topic 3: React & UI Architecture (3/5 correct)
      { id: 'fs_react_q1', topic: 'React & UI Architecture', subtopic: 'Virtual DOM & Reconciliation', type: 'MCQ', difficulty: 'BEGINNER', user_answer: 'To provide a unique identity so React can efficiently diff', correct_answer: 'To provide a unique identity so React can efficiently diff', is_correct: true },
      { id: 'fs_react_q2', topic: 'React & UI Architecture', subtopic: 'React Hooks Rules', type: 'CONCEPTUAL', difficulty: 'BEGINNER', user_answer: 'React relies on exact call order of hooks across re-renders', correct_answer: 'React relies on exact call order of hooks across re-renders', is_correct: true },
      { id: 'fs_react_q3', topic: 'React & UI Architecture', subtopic: 'State Management & Memoization', type: 'MSQ', difficulty: 'INTERMEDIATE', user_answer: 'React.memo; useCallback; useMemo', correct_answer: 'React.memo; useCallback; useMemo', is_correct: true },
      { id: 'fs_react_q4', topic: 'React & UI Architecture', subtopic: 'SSR & Hydration', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', user_answer: 'Disabled JS', correct_answer: 'Server HTML differs from client VDOM', is_correct: false },
      { id: 'fs_react_q5', topic: 'React & UI Architecture', subtopic: 'Concurrent Mode & Fiber Architecture', type: 'CONCEPTUAL', difficulty: 'ADVANCED', user_answer: 'Web Workers', correct_answer: 'Interruptible rendering', is_correct: false },

      // Topic 4: Database Management (5/5 correct)
      { id: 'fs_db_q1', topic: 'Database Management', subtopic: 'ACID Transactions', type: 'MCQ', difficulty: 'BEGINNER', user_answer: 'All operations succeed completely or all are rolled back', correct_answer: 'All operations succeed completely or all are rolled back', is_correct: true },
      { id: 'fs_db_q2', topic: 'Database Management', subtopic: 'SQL Joins', type: 'CODE_OUTPUT', difficulty: 'BEGINNER', user_answer: '2', correct_answer: '2', is_correct: true },
      { id: 'fs_db_q3', topic: 'Database Management', subtopic: 'Database Indexing', type: 'MSQ', difficulty: 'INTERMEDIATE', user_answer: 'Improves SELECT; Slows INSERT; Increases disk space', correct_answer: 'Improves SELECT; Slows INSERT; Increases disk space', is_correct: true },
      { id: 'fs_db_q4', topic: 'Database Management', subtopic: 'Normalization Forms', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', user_answer: 'In 2NF and no transitive functional dependencies', correct_answer: 'In 2NF and no transitive functional dependencies', is_correct: true },
      { id: 'fs_db_q5', topic: 'Database Management', subtopic: 'Isolation Levels & Concurrency', type: 'NUMERICAL', difficulty: 'ADVANCED', user_answer: '0', correct_answer: '0', is_correct: true },

      // Topic 5: Web Security (1/5 correct)
      { id: 'fs_sec_q1', topic: 'Web Security', subtopic: 'XSS Prevention', type: 'MCQ', difficulty: 'BEGINNER', user_answer: 'Sanitizing/escaping user inputs and CSP', correct_answer: 'Sanitizing/escaping user inputs and CSP', is_correct: true },
      { id: 'fs_sec_q2', topic: 'Web Security', subtopic: 'SQL Injection', type: 'CODE_OUTPUT', difficulty: 'BEGINNER', user_answer: 'Safe query', correct_answer: 'Concatenation query', is_correct: false },
      { id: 'fs_sec_q3', topic: 'Web Security', subtopic: 'CSRF Defenses', type: 'MSQ', difficulty: 'INTERMEDIATE', user_answer: 'Wrong options', correct_answer: 'SameSite; Tokens; Origin headers', is_correct: false },
      { id: 'fs_sec_q4', topic: 'Web Security', subtopic: 'Authentication & Hashing', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', user_answer: 'Output length', correct_answer: 'Extremely fast enabling rainbow tables', is_correct: false },
      { id: 'fs_sec_q5', topic: 'Web Security', subtopic: 'CORS & Preflight Requests', type: 'SCENARIO_BASED', difficulty: 'ADVANCED', user_answer: 'No preflight', correct_answer: 'HTTP OPTIONS preflight', is_correct: false },

      // Topic 6: System Design & Deployment (3/5 correct)
      { id: 'fs_sys_q1', topic: 'System Design & Deployment', subtopic: 'Horizontal Scaling', type: 'MCQ', difficulty: 'BEGINNER', user_answer: 'Session state stored externally', correct_answer: 'Session state stored externally', is_correct: true },
      { id: 'fs_sys_q2', topic: 'System Design & Deployment', subtopic: 'Reverse Proxies', type: 'MCQ', difficulty: 'BEGINNER', user_answer: 'SSL termination, static file caching', correct_answer: 'SSL termination, static file caching', is_correct: true },
      { id: 'fs_sys_q3', topic: 'System Design & Deployment', subtopic: 'Caching Strategies', type: 'MSQ', difficulty: 'INTERMEDIATE', user_answer: 'Check cache first; DB on miss; TTL expiration', correct_answer: 'Check cache first; DB on miss; TTL expiration', is_correct: true },
      { id: 'fs_sys_q4', topic: 'System Design & Deployment', subtopic: 'Microservices & Message Queues', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', user_answer: 'REST call', correct_answer: 'Async Message Queue', is_correct: false },
      { id: 'fs_sys_q5', topic: 'System Design & Deployment', subtopic: 'Zero-Downtime Deployment', type: 'NUMERICAL', difficulty: 'ADVANCED', user_answer: '50', correct_answer: '0', is_correct: false }
    ];

    const topicEvaluations = [
      { topic: 'JavaScript Fundamentals', correct_count: 4, total_questions: 5, score_pct: 80, proficiency_level: 'STRONG', beginner_accuracy: 100, intermediate_accuracy: 100, advanced_accuracy: 0, reason: 'High accuracy (80%) with solid beginner/intermediate foundation.' },
      { topic: 'REST API & Backend Architecture', correct_count: 2, total_questions: 5, score_pct: 40, proficiency_level: 'WEAK', beginner_accuracy: 100, intermediate_accuracy: 0, advanced_accuracy: 0, reason: 'Low accuracy (40%) across backend concepts.' },
      { topic: 'React & UI Architecture', correct_count: 3, total_questions: 5, score_pct: 60, proficiency_level: 'INTERMEDIATE', beginner_accuracy: 100, intermediate_accuracy: 100, advanced_accuracy: 0, reason: 'Solid applied foundation (60%). Struggled with advanced Fiber architecture.' },
      { topic: 'Database Management', correct_count: 5, total_questions: 5, score_pct: 100, proficiency_level: 'STRONG', beginner_accuracy: 100, intermediate_accuracy: 100, advanced_accuracy: 100, reason: 'Mastered all database topics.' },
      { topic: 'Web Security', correct_count: 1, total_questions: 5, score_pct: 20, proficiency_level: 'WEAK', beginner_accuracy: 50, intermediate_accuracy: 0, advanced_accuracy: 0, reason: 'Low accuracy (20%) in web security.' },
      { topic: 'System Design & Deployment', correct_count: 3, total_questions: 5, score_pct: 60, proficiency_level: 'INTERMEDIATE', beginner_accuracy: 100, intermediate_accuracy: 100, advanced_accuracy: 0, reason: 'Solid practical foundation (60%).' }
    ];

    const evalRes = await postJSON('/api/quiz/evaluate', {
      user_id: userId,
      domain: 'Full-Stack Web Development',
      answers: mockAnswersArray,
      topic_evaluations: topicEvaluations
    });

    console.log('Quiz Evaluation Status:', evalRes.status);
    console.log('Overall Score:', evalRes.json.evaluation.score_pct + '%');
    console.log('Overall Skill Level:', evalRes.json.evaluation.skill_level);
    console.log('Total Questions Evaluated:', evalRes.json.evaluation.total_questions);

    console.log('\n📊 PER-TOPIC PROFICIENCY BREAKDOWN:');
    const topicEvals = evalRes.json.evaluation.topic_evaluations;
    topicEvals.forEach(t => {
      let icon = t.proficiency_level === 'STRONG' ? '🟢' : (t.proficiency_level === 'INTERMEDIATE' ? '🟡' : '🔴');
      console.log(`  ${icon} Topic: "${t.topic}" -> Level: ${t.proficiency_level} (Score: ${t.score_pct}% - ${t.correct_count}/${t.total_questions} correct)`);
    });

    if (evalRes.json.evaluation.total_questions === 30) {
      console.log('\n✅ NPTEL TECHNICAL ASSESSMENT EVALUATION TEST PASSED!');
    } else {
      console.error('\n❌ Questions count evaluation mismatch!');
    }

  } catch (err) {
    console.error('Test error:', err);
  }
}

test();
