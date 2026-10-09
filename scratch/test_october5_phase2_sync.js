const assert = require('assert');
const http = require('http');

const BASE_URL = 'http://localhost:5000';

function postJSON(urlStr, data) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const body = JSON.stringify(data);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, res => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(d) });
        } catch (e) {
          resolve({ status: res.statusCode, text: d });
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function getJSON(urlStr) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: 'GET'
    }, res => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(d) });
        } catch (e) {
          resolve({ status: res.statusCode, text: d });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function evaluatePhaseButtons(dayObj, monthNum, weekNum, userState) {
  const rawTasks = Array.isArray(dayObj.tasks) ? dayObj.tasks : [];
  const totalTasks = rawTasks.length;
  const completedTasks = rawTasks.filter(t => t.completed === true || String(t.status || '').toUpperCase() === 'COMPLETED').length;
  const allTasksCompleted = totalTasks > 0 && completedTasks === totalTasks;
  const someTasksCompleted = completedTasks > 0 && completedTasks < totalTasks;

  const phaseKey = `m${monthNum}_w${weekNum}_d${dayObj.day_number}`;
  const assessmentTaken = Boolean(
    dayObj.assessment_taken === true ||
    dayObj.assessmentTaken === true ||
    dayObj.assessment_completed === true ||
    (userState?.phaseAssessments && (userState.phaseAssessments[phaseKey] || (dayObj.id && userState.phaseAssessments[dayObj.id]) || (dayObj.day_id && userState.phaseAssessments[dayObj.day_id])))
  );

  if (allTasksCompleted && !assessmentTaken) {
    return ['Review Phase', 'Take Assessment'];
  } else if (allTasksCompleted && assessmentTaken) {
    return ['Review Phase'];
  } else if (someTasksCompleted) {
    return ['Continue Phase'];
  } else {
    return ['Launch Phase'];
  }
}

async function runTest() {
  console.log('================================================================');
  console.log('🧪 VERIFYING OCTOBER 5 (PHASE 2) TASK COMPLETION & SYNC');
  console.log('================================================================\n');

  const timestamp = Date.now();
  const testEmail = `user_oct5_${timestamp}@test.com`;

  // Step 1: Register User
  console.log('[Step 1] Registering test user:', testEmail);
  const regRes = await postJSON(`${BASE_URL}/api/auth/register`, {
    name: 'Oct5 Learner',
    email: testEmail,
    password: 'Password123!',
    timeline_months: 4,
    daily_hours: 2.0
  });
  assert.strictEqual(regRes.status, 201, 'Registration must succeed');
  const userId = regRes.data.profile.user_id;
  console.log('✅ User registered with ID:', userId);

  // Step 2: Set Domain and Generate Roadmap
  console.log('\n[Step 2] Generating personalized roadmap for fullstack domain...');
  const genRes = await postJSON(`${BASE_URL}/api/roadmap/generate`, {
    user_id: userId,
    domain: 'fullstack',
    skill_level: 'BEGINNER'
  });
  assert.strictEqual(genRes.status, 200, 'Roadmap generation must succeed');
  assert.ok(genRes.data.roadmap, 'Roadmap must be returned');

  // Step 3: Start Journey with fixed start date October 4, 2026
  console.log('\n[Step 3] Starting Journey with start date Oct 4, 2026...');
  const startRes = await postJSON(`${BASE_URL}/api/roadmap/start`, {
    user_id: userId,
    start_date: '2026-10-04T00:00:00.000Z'
  });
  assert.strictEqual(startRes.status, 200, 'Start journey must succeed');

  // Step 4: Retrieve Roadmap and inspect Phase 2 (October 5)
  console.log('\n[Step 4] Fetching authoritative roadmap from backend...');
  const rmRes = await getJSON(`${BASE_URL}/api/roadmap/user/${userId}`);
  assert.strictEqual(rmRes.status, 200, 'Fetch roadmap must succeed');
  const roadmap = rmRes.data.roadmap;

  const month1 = roadmap.monthly_roadmap[0];
  const week1 = month1.weeks[0];
  const day1 = week1.days[0]; // Oct 4 - Phase 1
  const day2 = week1.days[1]; // Oct 5 - Phase 2
  const day3 = week1.days[2]; // Oct 6 - Phase 3

  console.log(`Phase 1 (Day 1): ${day1.tasks.length} tasks`);
  console.log(`Phase 2 (Day 2 - Oct 5): ${day2.tasks.length} tasks`);
  console.log(`Phase 3 (Day 3 - Oct 6): ${day3.tasks.length} tasks`);

  // Initial Check: Phase 2 has 0 completed tasks -> button is Launch Phase
  const initialButtonsP2 = evaluatePhaseButtons(day2, 1, 1, {});
  assert.deepStrictEqual(initialButtonsP2, ['Launch Phase'], 'Phase 2 must start with Launch Phase');
  console.log('✅ Initial Phase 2 button is correctly: Launch Phase');

  // Step 5: Test failed task status update (e.g. invalid user_id) does not advance
  console.log('\n[Step 5] Testing failed save handling...');
  const failRes = await postJSON(`${BASE_URL}/api/task/status`, {
    user_id: 'non_existent_user',
    taskId: day2.tasks[0].taskId || day2.tasks[0].id,
    completed: true,
    monthNumber: 1,
    weekNumber: 1,
    dayNumber: 2
  });
  assert.strictEqual(failRes.status, 404, 'Failed save must return 404');
  console.log('✅ Failed save rejected cleanly by backend without advancing day');

  // Step 6: Complete Task 1 on October 5 (Phase 2)
  console.log('\n[Step 6] Completing Task 1 on October 5 (Phase 2)...');
  const task1 = day2.tasks[0];
  const t1Id = task1.taskId || task1.id;
  const t1Title = task1.taskTitle || task1.title;

  const compRes1 = await postJSON(`${BASE_URL}/api/task/status`, {
    user_id: userId,
    taskId: t1Id,
    completed: true,
    monthNumber: 1,
    weekNumber: 1,
    dayNumber: 2,
    title: t1Title
  });
  assert.strictEqual(compRes1.status, 200, 'Task 1 completion must return 200');
  assert.strictEqual(compRes1.data.success, true, 'Task 1 completion must be true');

  // Fetch updated roadmap and check Phase 2 button
  const rmResAfterT1 = await getJSON(`${BASE_URL}/api/roadmap/user/${userId}`);
  const day2AfterT1 = rmResAfterT1.data.roadmap.monthly_roadmap[0].weeks[0].days[1];
  assert.strictEqual(day2AfterT1.tasks[0].completed, true, 'Day 2 Task 1 must be persisted as completed');
  const buttonsAfterT1 = evaluatePhaseButtons(day2AfterT1, 1, 1, {});
  assert.deepStrictEqual(buttonsAfterT1, ['Continue Phase'], 'Phase 2 must now show Continue Phase');
  console.log('✅ Task 1 on October 5 persisted! Phase 2 button is: Continue Phase');

  // Step 7: Complete remaining tasks on October 5 (Phase 2)
  console.log('\n[Step 7] Completing remaining tasks on October 5 (Phase 2)...');
  for (let i = 1; i < day2.tasks.length; i++) {
    const t = day2.tasks[i];
    const compRes = await postJSON(`${BASE_URL}/api/task/status`, {
      user_id: userId,
      taskId: t.taskId || t.id,
      completed: true,
      monthNumber: 1,
      weekNumber: 1,
      dayNumber: 2,
      title: t.taskTitle || t.title
    });
    assert.strictEqual(compRes.status, 200);
    assert.strictEqual(compRes.data.success, true);
  }

  // Step 8: Verify October 5 tasks in MongoDB after full completion
  console.log('\n[Step 8] Verifying October 5 tasks in database after completing all tasks...');
  const rmResAllOct5 = await getJSON(`${BASE_URL}/api/roadmap/user/${userId}`);
  const day2Final = rmResAllOct5.data.roadmap.monthly_roadmap[0].weeks[0].days[1];
  const day3Final = rmResAllOct5.data.roadmap.monthly_roadmap[0].weeks[0].days[2];

  const allCompletedDay2 = day2Final.tasks.every(t => t.completed === true || t.status === 'COMPLETED');
  assert.strictEqual(allCompletedDay2, true, 'All October 5 tasks must be completed in DB');

  const finalButtonsP2 = evaluatePhaseButtons(day2Final, 1, 1, {});
  assert.deepStrictEqual(finalButtonsP2, ['Review Phase', 'Take Assessment'], 'Phase 2 button must be Review Phase + Take Assessment');
  console.log('✅ All October 5 tasks completed in MongoDB! Phase 2 buttons:', finalButtonsP2);

  // Step 9: Confirm October 6 (Phase 3) tasks remain untouched
  const day3CompletedCount = day3Final.tasks.filter(t => t.completed === true).length;
  assert.strictEqual(day3CompletedCount, 0, 'October 6 tasks must remain untouched');
  const day3Buttons = evaluatePhaseButtons(day3Final, 1, 1, {});
  assert.deepStrictEqual(day3Buttons, ['Launch Phase'], 'October 6 Phase 3 must show Launch Phase');
  console.log('✅ October 6 tasks remain uncompleted and isolated from October 5');

  console.log('\n================================================================');
  console.log('🎉 OCTOBER 5 PHASE 2 TASK COMPLETION & SYNC VERIFICATION PASSED 100%!');
  console.log('================================================================\n');
}

runTest().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
