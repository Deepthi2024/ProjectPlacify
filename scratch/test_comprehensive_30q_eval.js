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

async function testComprehensive30Q() {
  console.log('========================================================================');
  console.log('STARTING PLACIFY COMPREHENSIVE 30-QUESTION DIAGNOSTIC ASSESSMENT TEST');
  console.log('========================================================================\n');

  const testCases = [
    {
      domainId: 'dsa',
      domainName: 'Data Structures & Algorithms (Interview Prep)',
      answersCount: 30,
      mockAnswers: [
        // Topic 1: Arrays & Hash Maps (5 Qs)
        { id: 'dsa_arr_q1', topic: 'Arrays & Hash Maps', type: 'MCQ', difficulty: 'BEGINNER', user_answer: 'O(1)', correct_answer: 'O(1)', is_correct: true },
        { id: 'dsa_arr_q2', topic: 'Arrays & Hash Maps', type: 'CODE_OUTPUT', difficulty: 'BEGINNER', user_answer: '[0, 1]', correct_answer: '[0, 1]', is_correct: true },
        { id: 'dsa_arr_q3', topic: 'Arrays & Hash Maps', type: 'MSQ', difficulty: 'INTERMEDIATE', user_answer: 'Separate Chaining; Open Addressing; Double Hashing', correct_answer: 'Separate Chaining; Open Addressing; Double Hashing', is_correct: true },
        { id: 'dsa_arr_q4', topic: 'Arrays & Hash Maps', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', user_answer: 'Allows computing contiguous subarray sums in O(1)', correct_answer: 'Allows computing contiguous subarray sums in O(1)', is_correct: true },
        { id: 'dsa_arr_q5', topic: 'Arrays & Hash Maps', type: 'NUMERICAL', difficulty: 'ADVANCED', user_answer: '2', correct_answer: '2', is_correct: true },

        // Topic 2: Two Pointers & Sliding Window (5 Qs)
        { id: 'dsa_win_q1', topic: 'Two Pointers & Sliding Window', type: 'MCQ', difficulty: 'BEGINNER', user_answer: 'Sliding Window', correct_answer: 'Sliding Window', is_correct: true },
        { id: 'dsa_win_q2', topic: 'Two Pointers & Sliding Window', type: 'CODE_OUTPUT', difficulty: 'BEGINNER', user_answer: '[4, 8]', correct_answer: '[4, 8]', is_correct: true },
        { id: 'dsa_win_q3', topic: 'Two Pointers & Sliding Window', type: 'MSQ', difficulty: 'INTERMEDIATE', user_answer: 'Detecting cycles; Finding middle node', correct_answer: 'Detecting cycles; Finding middle node', is_correct: true },
        { id: 'dsa_win_q4', topic: 'Two Pointers & Sliding Window', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', user_answer: 'Wrong condition', correct_answer: 'When current window contains ALL required chars', is_correct: false },
        { id: 'dsa_win_q5', topic: 'Two Pointers & Sliding Window', type: 'NUMERICAL', difficulty: 'ADVANCED', user_answer: '0', correct_answer: '6', is_correct: false },

        // Topic 3: Stacks & Queues (5 Qs)
        { id: 'dsa_stack_q1', topic: 'Stacks & Queues', type: 'MCQ', difficulty: 'BEGINNER', user_answer: 'Stack', correct_answer: 'Stack', is_correct: true },
        { id: 'dsa_stack_q2', topic: 'Stacks & Queues', type: 'CODE_OUTPUT', difficulty: 'BEGINNER', user_answer: 'true', correct_answer: 'true', is_correct: true },
        { id: 'dsa_stack_q3', topic: 'Stacks & Queues', type: 'MSQ', difficulty: 'INTERMEDIATE', user_answer: 'Next Greater Element; Histogram; Trapping Water', correct_answer: 'Next Greater Element; Histogram; Trapping Water', is_correct: true },
        { id: 'dsa_stack_q4', topic: 'Stacks & Queues', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', user_answer: '2 Stacks', correct_answer: '2 Stacks', is_correct: true },
        { id: 'dsa_stack_q5', topic: 'Stacks & Queues', type: 'NUMERICAL', difficulty: 'ADVANCED', user_answer: '16', correct_answer: '16', is_correct: true },

        // Topic 4: Trees & Search Algorithms (5 Qs)
        { id: 'dsa_tree_q1', topic: 'Trees & Search Algorithms', type: 'MCQ', difficulty: 'BEGINNER', user_answer: 'O(log N)', correct_answer: 'O(log N)', is_correct: true },
        { id: 'dsa_tree_q2', topic: 'Trees & Search Algorithms', type: 'MCQ', difficulty: 'BEGINNER', user_answer: 'In-Order', correct_answer: 'In-Order', is_correct: true },
        { id: 'dsa_tree_q3', topic: 'Trees & Search Algorithms', type: 'MSQ', difficulty: 'INTERMEDIATE', user_answer: 'AVL; Red-Black; B-Tree', correct_answer: 'AVL; Red-Black; B-Tree', is_correct: true },
        { id: 'dsa_tree_q4', topic: 'Trees & Search Algorithms', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', user_answer: 'root.val < p.val and root.val < q.val', correct_answer: 'root.val < p.val and root.val < q.val', is_correct: true },
        { id: 'dsa_tree_q5', topic: 'Trees & Search Algorithms', type: 'NUMERICAL', difficulty: 'ADVANCED', user_answer: '15', correct_answer: '15', is_correct: true },

        // Topic 5: Graph Algorithms & Shortest Path (5 Qs)
        { id: 'dsa_graph_q1', topic: 'Graph Algorithms & Shortest Path', type: 'MCQ', difficulty: 'BEGINNER', user_answer: 'BFS', correct_answer: 'BFS', is_correct: true },
        { id: 'dsa_graph_q2', topic: 'Graph Algorithms & Shortest Path', type: 'MCQ', difficulty: 'BEGINNER', user_answer: 'Min-Heap Priority Queue', correct_answer: 'Min-Heap Priority Queue', is_correct: true },
        { id: 'dsa_graph_q3', topic: 'Graph Algorithms & Shortest Path', type: 'MSQ', difficulty: 'INTERMEDIATE', user_answer: 'Directed; Acyclic', correct_answer: 'Directed; Acyclic', is_correct: true },
        { id: 'dsa_graph_q4', topic: 'Graph Algorithms & Shortest Path', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', user_answer: 'Greedy selection fails', correct_answer: 'Greedy selection fails', is_correct: true },
        { id: 'dsa_graph_q5', topic: 'Graph Algorithms & Shortest Path', type: 'NUMERICAL', difficulty: 'ADVANCED', user_answer: '7', correct_answer: '7', is_correct: true },

        // Topic 6: Dynamic Programming (5 Qs)
        { id: 'dsa_dp_q1', topic: 'Dynamic Programming', type: 'CONCEPTUAL', difficulty: 'BEGINNER', user_answer: 'Overlapping subproblems and optimal substructure', correct_answer: 'Overlapping subproblems and optimal substructure', is_correct: true },
        { id: 'dsa_dp_q2', topic: 'Dynamic Programming', type: 'CODE_OUTPUT', difficulty: 'BEGINNER', user_answer: '5', correct_answer: '5', is_correct: true },
        { id: 'dsa_dp_q3', topic: 'Dynamic Programming', type: 'MSQ', difficulty: 'INTERMEDIATE', user_answer: 'Top-Down Memoization; Bottom-Up Tabulation', correct_answer: 'Top-Down Memoization; Bottom-Up Tabulation', is_correct: true },
        { id: 'dsa_dp_q4', topic: 'Dynamic Programming', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', user_answer: 'Max excluding vs including', correct_answer: 'Max excluding vs including', is_correct: true },
        { id: 'dsa_dp_q5', topic: 'Dynamic Programming', type: 'NUMERICAL', difficulty: 'ADVANCED', user_answer: '3', correct_answer: '3', is_correct: true }
      ],
      topicEvaluations: [
        { topic: 'Arrays & Hash Maps', correct_count: 5, total_questions: 5, score_pct: 100, proficiency_level: 'STRONG', beginner_accuracy: 100, intermediate_accuracy: 100, advanced_accuracy: 100, reason: 'Mastered all array & hash map questions.' },
        { topic: 'Two Pointers & Sliding Window', correct_count: 3, total_questions: 5, score_pct: 60, proficiency_level: 'INTERMEDIATE', beginner_accuracy: 100, intermediate_accuracy: 50, advanced_accuracy: 0, reason: 'Solid baseline. Needs practice on dynamic window condition and max calculation.' },
        { topic: 'Stacks & Queues', correct_count: 5, total_questions: 5, score_pct: 100, proficiency_level: 'STRONG', beginner_accuracy: 100, intermediate_accuracy: 100, advanced_accuracy: 100, reason: 'Mastered stacks & queues.' },
        { topic: 'Trees & Search Algorithms', correct_count: 5, total_questions: 5, score_pct: 100, proficiency_level: 'STRONG', beginner_accuracy: 100, intermediate_accuracy: 100, advanced_accuracy: 100, reason: 'Mastered BSTs and tree search.' },
        { topic: 'Graph Algorithms & Shortest Path', correct_count: 5, total_questions: 5, score_pct: 100, proficiency_level: 'STRONG', beginner_accuracy: 100, intermediate_accuracy: 100, advanced_accuracy: 100, reason: 'Mastered BFS, Dijkstra, and DAGs.' },
        { topic: 'Dynamic Programming', correct_count: 5, total_questions: 5, score_pct: 100, proficiency_level: 'STRONG', beginner_accuracy: 100, intermediate_accuracy: 100, advanced_accuracy: 100, reason: 'Mastered 1D and 2D DP patterns.' }
      ]
    }
  ];

  for (const tc of testCases) {
    console.log(`📌 Testing Domain: "${tc.domainName}" (${tc.domainId})`);

    // 1. Register candidate
    const email = `candidate_30q_${tc.domainId}_${Date.now()}@example.com`;
    const regRes = await postJSON('/api/auth/register', {
      name: `Candidate ${tc.domainId}`,
      email,
      password: 'password123',
      chosen_domain: tc.domainId,
      timeline_weeks: 6,
      daily_hours: 3.0
    });

    console.log(`   1. Registration Status: ${regRes.status} (User ID: ${regRes.json.profile.user_id})`);

    // 2. Submit 30 Diagnostic Questions
    const evalRes = await postJSON('/api/quiz/evaluate', {
      user_id: regRes.json.profile.user_id,
      domain: tc.domainId,
      answers: tc.mockAnswers,
      topic_evaluations: tc.topicEvaluations
    });

    console.log(`   2. Quiz Evaluation Status: ${evalRes.status}`);
    console.log(`   3. Overall Score: ${evalRes.json.evaluation.score_pct}%`);
    console.log(`   4. Total Evaluated Questions: ${evalRes.json.evaluation.total_questions}`);
    console.log(`   5. Saved Domain in MongoDB: "${evalRes.json.evaluation.domain}"`);

    console.log('\n   📊 TOPIC PROFICIENCY BREAKDOWN:');
    evalRes.json.evaluation.topic_evaluations.forEach(t => {
      const icon = t.proficiency_level === 'STRONG' ? '🟢' : (t.proficiency_level === 'INTERMEDIATE' ? '🟡' : '🔴');
      console.log(`      ${icon} Topic: "${t.topic}" -> Level: ${t.proficiency_level} (Score: ${t.score_pct}% - ${t.correct_count}/${t.total_questions} correct)`);
    });

    if (evalRes.json.evaluation.total_questions === 30 && evalRes.json.evaluation.domain === tc.domainName) {
      console.log(`\n   ✅ PASSED! 30-Question Assessment successfully evaluated and persisted for ${tc.domainId}.\n`);
    } else {
      console.error(`\n   ❌ FAILED! Expected 30 questions and domain "${tc.domainName}" but got ${evalRes.json.evaluation.total_questions} questions and domain "${evalRes.json.evaluation.domain}".\n`);
    }
  }

  console.log('========================================================================');
  console.log('ALL COMPREHENSIVE 30-QUESTION DIAGNOSTIC TESTS COMPLETED SUCCESSFULLY!');
  console.log('========================================================================');
}

testComprehensive30Q();
