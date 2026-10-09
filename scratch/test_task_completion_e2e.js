/**
 * Comprehensive End-to-End Task Completion & Persistence Verification Test
 */

const http = require('http');

function postJSON(urlStr, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const postData = JSON.stringify(data);
    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, text: body });
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function getJSON(urlStr) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'GET'
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, text: body });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING TASK COMPLETION END-TO-END TESTS ===');

  const testUserId = `test_completion_user_${Date.now()}`;
  const testEmail = `${testUserId}@example.com`;

  // Step 1: Register User
  console.log(`\n[STEP 1] Registering test user: ${testUserId}`);
  const regRes = await postJSON('http://localhost:5000/api/auth/register', {
    user_id: testUserId,
    name: 'Test Task Completer',
    email: testEmail,
    password: 'Password123!',
    target_role: 'Full Stack Engineer',
    target_companies: ['Google', 'Microsoft'],
    chosen_domain: 'fullstack',
    timeline_months: 6,
    daily_hours: 2,
    current_skill_level: 'BEGINNER'
  });
  console.log('Registration Response Status:', regRes.status, regRes.data?.success ? 'SUCCESS' : 'FAILED');
  const user = regRes.data?.user || regRes.data?.profile;
  const actualUserId = user?.user_id || testUserId;

  // Step 2: Generate Roadmap
  console.log(`\n[STEP 2] Generating personalized roadmap for user...`);
  const genRes = await postJSON('http://localhost:5000/api/roadmap/generate', {
    user_id: actualUserId,
    chosen_domain: 'fullstack',
    timeline_months: 6,
    daily_hours: 2,
    force_regenerate: true
  });

  const roadmap = genRes.data?.roadmap;
  if (!roadmap || !roadmap.monthly_roadmap) {
    console.error('FAILED: Roadmap not generated', genRes.data);
    process.exit(1);
  }
  console.log('Roadmap generated with months:', roadmap.monthly_roadmap.length);

  // Find Day 1 tasks
  const day1 = roadmap.monthly_roadmap[0]?.weeks[0]?.days[0];
  if (!day1 || !day1.tasks || day1.tasks.length === 0) {
    console.error('FAILED: Day 1 has no tasks!');
    process.exit(1);
  }

  console.log(`Day 1 has ${day1.tasks.length} tasks:`);
  day1.tasks.forEach((t, i) => {
    console.log(`  Task ${i + 1}: [${t.taskId || t.id}] ${t.taskTitle || t.title} (completed: ${t.completed})`);
  });

  const task1 = day1.tasks[0];
  const task2 = day1.tasks[1] || day1.tasks[0];
  const task1Id = task1.taskId || task1.id;
  const task2Id = task2.taskId || task2.id;

  // Verify initial state: not completed
  if (task1.completed) {
    console.error('FAILED: Task 1 should initially NOT be completed!');
    process.exit(1);
  }
  console.log('✓ Initial state confirmed: Task 1 is uncompleted.');

  // Step 3: Complete Task 1 via POST /api/task/status
  console.log(`\n[STEP 3] Completing Task 1: ${task1Id}...`);
  const completeRes1 = await postJSON('http://localhost:5000/api/task/status', {
    user_id: actualUserId,
    taskId: task1Id,
    completed: true,
    monthNumber: 1,
    weekNumber: 1,
    dayNumber: 1,
    title: task1.taskTitle || task1.title
  });

  console.log('Complete Task 1 Response:', completeRes1.status, completeRes1.data);
  if (!completeRes1.data?.success || !completeRes1.data?.completed) {
    console.error('FAILED: Complete Task 1 failed!', completeRes1.data);
    process.exit(1);
  }
  console.log('✓ Task 1 completed successfully with timestamp:', completeRes1.data.completedAt);

  // Step 4: Verify Persistence via GET /api/roadmap/user/:user_id
  console.log(`\n[STEP 4] Verifying database persistence across fetch...`);
  const fetchRes1 = await getJSON(`http://localhost:5000/api/roadmap/user/${actualUserId}`);
  const fetchedDay1 = fetchRes1.data?.roadmap?.monthly_roadmap[0]?.weeks[0]?.days[0];
  const fetchedTask1 = fetchedDay1?.tasks?.find(t => (t.taskId || t.id) === task1Id);
  const fetchedTask2 = fetchedDay1?.tasks?.find(t => (t.taskId || t.id) === task2Id && (t.taskId || t.id) !== task1Id);

  console.log(`Fetched Task 1 completion in DB: ${fetchedTask1?.completed} (status: ${fetchedTask1?.status}, completedAt: ${fetchedTask1?.completed_at || fetchedTask1?.completedAt})`);
  if (!fetchedTask1 || fetchedTask1.completed !== true) {
    console.error('FAILED: Task 1 completion was NOT persisted in MongoDB Atlas!');
    process.exit(1);
  }
  console.log('✓ Task 1 is confirmed completed in database.');

  if (fetchedTask2) {
    console.log(`Fetched Task 2 completion in DB: ${fetchedTask2?.completed} (should be false)`);
    if (fetchedTask2.completed === true) {
      console.error('FAILED: Task 2 was mistakenly marked completed when only Task 1 was completed!');
      process.exit(1);
    }
    console.log('✓ Task 2 remains uncompleted as expected.');
  }

  // Step 5: Idempotency Test - Complete Task 1 again
  console.log(`\n[STEP 5] Testing idempotency (completing Task 1 again)...`);
  const duplicateRes = await postJSON('http://localhost:5000/api/task/status', {
    user_id: actualUserId,
    taskId: task1Id,
    completed: true,
    monthNumber: 1,
    weekNumber: 1,
    dayNumber: 1,
    title: task1.taskTitle || task1.title
  });

  console.log('Duplicate Task 1 Response:', duplicateRes.status, duplicateRes.data);
  if (!duplicateRes.data?.success || !duplicateRes.data?.alreadyCompleted) {
    console.error('FAILED: Idempotent completion check failed!', duplicateRes.data);
    process.exit(1);
  }
  console.log('✓ Idempotency confirmed: alreadyCompleted is true, no errors or duplicate states.');

  // Step 6: Complete Task 2 independently
  if (task2Id !== task1Id) {
    console.log(`\n[STEP 6] Completing Task 2 independently: ${task2Id}...`);
    const completeRes2 = await postJSON('http://localhost:5000/api/task/status', {
      user_id: actualUserId,
      taskId: task2Id,
      completed: true,
      monthNumber: 1,
      weekNumber: 1,
      dayNumber: 1,
      title: task2.taskTitle || task2.title
    });
    console.log('Complete Task 2 Response:', completeRes2.status, completeRes2.data);
    if (!completeRes2.data?.success || !completeRes2.data?.completed) {
      console.error('FAILED: Complete Task 2 failed!', completeRes2.data);
      process.exit(1);
    }
    console.log('✓ Task 2 completed successfully.');

    // Verify both are now completed
    const fetchRes2 = await getJSON(`http://localhost:5000/api/roadmap/user/${actualUserId}`);
    const finalDay1 = fetchRes2.data?.roadmap?.monthly_roadmap[0]?.weeks[0]?.days[0];
    const finalTask1 = finalDay1?.tasks?.find(t => (t.taskId || t.id) === task1Id);
    const finalTask2 = finalDay1?.tasks?.find(t => (t.taskId || t.id) === task2Id);

    console.log(`Final check - Task 1 completed: ${finalTask1?.completed}, Task 2 completed: ${finalTask2?.completed}`);
    if (!finalTask1?.completed || !finalTask2?.completed) {
      console.error('FAILED: Both tasks should be completed!');
      process.exit(1);
    }
    console.log('✓ Multiple tasks completed independently and persisted in database.');
  }

  // Step 7: Verify RAG Resources for the tasks still work
  console.log(`\n[STEP 7] Verifying RAG resources for tasks still work and respect time budget...`);
  const ragRes = await postJSON('http://localhost:5000/api/resources/recommend', {
    user_id: actualUserId,
    taskId: task1Id,
    taskTitle: task1.taskTitle || task1.title,
    domain: 'fullstack',
    taskTopic: task1.taskTopic || task1.topic || 'HTML',
    durationMinutes: task1.durationMinutes || task1.estimated_minutes || 45,
    difficulty: 'BEGINNER'
  });

  console.log('Daily tasks RAG status:', ragRes.status, ragRes.data?.success ? 'SUCCESS' : 'FAILED');
  if (!ragRes.data?.success) {
    console.error('FAILED: Daily tasks RAG resources failed!', ragRes.data);
    process.exit(1);
  }
  console.log(`✓ RAG returned recommendations for task: ${ragRes.data.resources?.length || 0} resources.`);

  console.log('\n============================================================');
  console.log('ALL TASK COMPLETION TESTS PASSED SUCCESSFULLY! ✓✓✓');
  console.log('============================================================');
}

runTests().catch(err => {
  console.error('Unexpected error running tests:', err);
  process.exit(1);
});
