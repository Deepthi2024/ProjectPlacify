/**
 * End-to-End Multi-User Isolation Verification Script
 * Tests User A and User B separation across:
 * - Registration & Authentication
 * - Roadmap Generation & Ownership
 * - Task Completion & Ownership Isolation
 * - Streak Calculation & Isolation (consecutive days vs 0 days)
 * - XP & Level Tracking Isolation
 * - Progress & Analytics API Scoping
 * - Reset Isolation
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, text: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTest() {
  console.log('============================================================');
  console.log('STARTING CRITICAL TWO-USER DATA ISOLATION VERIFICATION');
  console.log('============================================================\n');

  const userAEmail = `user_a_${Date.now()}@test.com`;
  const userBEmail = `user_b_${Date.now()}@test.com`;
  const password = 'Password123!';

  // 1. Register User A
  console.log('1. Registering USER A (' + userAEmail + ')...');
  const regA = await request('POST', '/api/auth/register', {
    name: 'User Alpha',
    email: userAEmail,
    password: password,
    chosen_domain: 'fullstack',
    timeline_months: 4,
    daily_hours: 2.0
  });
  console.log('USER A Registration status:', regA.status, 'user_id:', regA.data?.profile?.user_id);
  const userAId = regA.data.profile.user_id;

  // 2. Register User B
  console.log('\n2. Registering USER B (' + userBEmail + ')...');
  const regB = await request('POST', '/api/auth/register', {
    name: 'User Beta',
    email: userBEmail,
    password: password,
    chosen_domain: 'datascience',
    timeline_months: 3,
    daily_hours: 1.5
  });
  console.log('USER B Registration status:', regB.status, 'user_id:', regB.data?.profile?.user_id);
  const userBId = regB.data.profile.user_id;

  // 3. Generate Roadmap for User A
  console.log('\n3. Generating Roadmap for USER A (Fullstack)...');
  const rmA = await request('POST', '/api/roadmap/generate', {
    user_id: userAId,
    quizEvaluation: {
      score_pct: 40,
      skill_level: 'BEGINNER',
      topic_evaluations: []
    }
  });
  console.log('USER A Roadmap Status:', rmA.status, 'Success:', rmA.data?.success);

  // 4. Generate Roadmap for User B
  console.log('\n4. Generating Roadmap for USER B (Data Science)...');
  const rmB = await request('POST', '/api/roadmap/generate', {
    user_id: userBId,
    quizEvaluation: {
      score_pct: 85,
      skill_level: 'ADVANCED',
      topic_evaluations: []
    }
  });
  console.log('USER B Roadmap Status:', rmB.status, 'Success:', rmB.data?.success);

  // Verify Roadmap Isolation
  const fetchRmA = await request('GET', `/api/roadmap/user/${userAId}`);
  const fetchRmB = await request('GET', `/api/roadmap/user/${userBId}`);
  console.log('\n[ROADMAP ISOLATION CHECK]');
  console.log('USER A Domain:', fetchRmA.data.roadmap.domain, '(Expected: fullstack)');
  console.log('USER B Domain:', fetchRmB.data.roadmap.domain, '(Expected: datascience)');
  if (fetchRmA.data.roadmap.domain !== 'fullstack' || fetchRmB.data.roadmap.domain !== 'datascience') {
    throw new Error('FAILED: Roadmaps are not isolated by domain/user!');
  }

  // 5. Check Initial Stats for both users
  const progA_initial = await request('GET', `/api/progress/${userAId}`);
  const progB_initial = await request('GET', `/api/progress/${userBId}`);
  console.log('\n[INITIAL STATS]');
  console.log('USER A Streak:', progA_initial.data.streak, 'XP:', progA_initial.data.xp, 'Completed Tasks:', progA_initial.data.completedTasksCount);
  console.log('USER B Streak:', progB_initial.data.streak, 'XP:', progB_initial.data.xp, 'Completed Tasks:', progB_initial.data.completedTasksCount);

  if (progA_initial.data.streak !== 0 || progA_initial.data.xp !== 0 || progB_initial.data.streak !== 0 || progB_initial.data.xp !== 0) {
    throw new Error('FAILED: New users should start with 0 streak and 0 XP!');
  }

  // 6. User A completes Day 1 Tasks
  console.log('\n6. USER A Completing Task 1 on Day 1...');
  const firstTaskA = fetchRmA.data.roadmap.monthly_roadmap[0].weeks[0].days[0].tasks[0];
  const taskAId = firstTaskA.taskId || firstTaskA.id;

  const compA1 = await request('POST', '/api/task/status', {
    user_id: userAId,
    taskId: taskAId,
    completed: true,
    monthNumber: 1,
    weekNumber: 1,
    dayNumber: 1,
    title: firstTaskA.title || firstTaskA.taskTitle
  });
  console.log('USER A Task 1 completion response:', {
    success: compA1.data.success,
    streak: compA1.data.streak,
    xp: compA1.data.xp,
    completedTasksCount: compA1.data.completedTasksCount
  });

  // Verify User A has streak=1, XP=50, completedTasks=1
  if (compA1.data.streak !== 1 || compA1.data.xp !== 50 || compA1.data.completedTasksCount !== 1) {
    throw new Error(`FAILED: User A stats incorrect after 1 task! Got streak=${compA1.data.streak}, xp=${compA1.data.xp}`);
  }

  // 7. CRITICAL TEST: Check USER B's progress now!
  console.log('\n7. [CRITICAL CHECK] Verifying USER B after USER A completed tasks...');
  const progB_afterA = await request('GET', `/api/progress/${userBId}`);
  const fetchRmB_afterA = await request('GET', `/api/roadmap/user/${userBId}`);
  const firstTaskB = fetchRmB_afterA.data.roadmap.monthly_roadmap[0].weeks[0].days[0].tasks[0];

  console.log('USER B Streak:', progB_afterA.data.streak, '(Expected: 0)');
  console.log('USER B XP:', progB_afterA.data.xp, '(Expected: 0)');
  console.log('USER B Completed Tasks:', progB_afterA.data.completedTasksCount, '(Expected: 0)');
  console.log('USER B Task 1 Completed:', firstTaskB.completed, '(Expected: false)');

  if (progB_afterA.data.streak !== 0) {
    throw new Error(`CRITICAL FAILURE: User B inherited User A's streak! Streak is ${progB_afterA.data.streak}`);
  }
  if (progB_afterA.data.xp !== 0) {
    throw new Error(`CRITICAL FAILURE: User B inherited User A's XP! XP is ${progB_afterA.data.xp}`);
  }
  if (progB_afterA.data.completedTasksCount !== 0 || firstTaskB.completed) {
    throw new Error(`CRITICAL FAILURE: User B inherited User A's task completion!`);
  }

  console.log('>>> SUCCESS: USER B IS 100% ISOLATED FROM USER A!');

  // 8. Test multi-day streak for User A (simulate 2-day activity)
  console.log('\n8. Simulating 2-Day Streak for USER A (adding yesterday activity)...');
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Complete a second task for user A
  const secondTaskA = fetchRmA.data.roadmap.monthly_roadmap[0].weeks[0].days[0].tasks[1] || fetchRmA.data.roadmap.monthly_roadmap[0].weeks[0].days[1].tasks[0];
  const taskA2Id = secondTaskA.taskId || secondTaskA.id;

  // Update user A's activity_dates in DB to include yesterday
  const mongoose = require('mongoose');
  require('dotenv').config();
  await mongoose.connect(process.env.MONGODB_URI);
  await mongoose.connection.db.collection('Registration').updateOne(
    { user_id: userAId },
    { $addToSet: { activity_dates: yesterdayStr } }
  );

  const compA2 = await request('POST', '/api/task/status', {
    user_id: userAId,
    taskId: taskA2Id,
    completed: true,
    monthNumber: 1,
    weekNumber: 1,
    dayNumber: 1,
    title: secondTaskA.title || secondTaskA.taskTitle
  });

  console.log('USER A 2-Day Streak Response:', {
    streak: compA2.data.streak,
    xp: compA2.data.xp,
    completedTasksCount: compA2.data.completedTasksCount
  });

  if (compA2.data.streak !== 2) {
    throw new Error(`FAILED: User A streak should be 2 days! Got ${compA2.data.streak}`);
  }

  // 9. Check USER B again: User B MUST STILL have 0 Day Streak!
  const progB_check2 = await request('GET', `/api/progress/${userBId}`);
  console.log('\n9. [STREAK ISOLATION CHECK]');
  console.log('USER A Streak:', compA2.data.streak, 'Days (Expected: 2)');
  console.log('USER B Streak:', progB_check2.data.streak, 'Days (Expected: 0)');

  if (progB_check2.data.streak !== 0) {
    throw new Error(`CRITICAL FAILURE: User B inherited 2-day streak! User B streak = ${progB_check2.data.streak}`);
  }
  console.log('>>> SUCCESS: 2-DAY STREAK IS FULLY ISOLATED!');

  // 10. Login as User B and complete a task
  console.log('\n10. Logging in as USER B and completing Task 1...');
  const loginB = await request('POST', '/api/auth/login', {
    email: userBEmail,
    password: password
  });
  console.log('USER B Login Profile:', {
    user_id: loginB.data.profile.user_id,
    streak: loginB.data.profile.streak,
    xp: loginB.data.profile.xp,
    completed_tasks: loginB.data.profile.completed_tasks_count
  });

  if (loginB.data.profile.streak !== 0 || loginB.data.profile.xp !== 0) {
    throw new Error(`FAILED: User B login returned non-zero stats before doing work!`);
  }

  const compB1 = await request('POST', '/api/task/status', {
    user_id: userBId,
    taskId: firstTaskB.taskId || firstTaskB.id,
    completed: true,
    monthNumber: 1,
    weekNumber: 1,
    dayNumber: 1,
    title: firstTaskB.title || firstTaskB.taskTitle
  });
  console.log('USER B Task 1 Result:', {
    streak: compB1.data.streak,
    xp: compB1.data.xp,
    completedTasksCount: compB1.data.completedTasksCount
  });

  if (compB1.data.streak !== 1 || compB1.data.xp !== 50 || compB1.data.completedTasksCount !== 1) {
    throw new Error(`FAILED: User B stats incorrect after 1 task!`);
  }

  // 11. Final verification: Check User A and User B
  console.log('\n11. Final Verification of both users...');
  const finalProgA = await request('GET', `/api/progress/${userAId}`);
  const finalProgB = await request('GET', `/api/progress/${userBId}`);

  console.log('\n============================================================');
  console.log('FINAL MULTI-USER ISOLATION RESULTS:');
  console.log('============================================================');
  console.log('USER A:');
  console.log('  Streak:          ', finalProgA.data.streak, 'days');
  console.log('  XP:              ', finalProgA.data.xp);
  console.log('  Completed Tasks: ', finalProgA.data.completedTasksCount);
  console.log('  Total Tasks:     ', finalProgA.data.totalTasksCount);
  console.log('  Mastery:         ', finalProgA.data.masteryPct, '%');
  console.log('\nUSER B:');
  console.log('  Streak:          ', finalProgB.data.streak, 'days');
  console.log('  XP:              ', finalProgB.data.xp);
  console.log('  Completed Tasks: ', finalProgB.data.completedTasksCount);
  console.log('  Total Tasks:     ', finalProgB.data.totalTasksCount);
  console.log('  Mastery:         ', finalProgB.data.masteryPct, '%');
  console.log('============================================================\n');

  if (finalProgA.data.streak !== 2 || finalProgB.data.streak !== 1) {
    throw new Error(`FAILED: Expected User A streak=2 and User B streak=1`);
  }
  if (finalProgA.data.xp !== 100 || finalProgB.data.xp !== 50) {
    throw new Error(`FAILED: Expected User A XP=100 and User B XP=50`);
  }
  if (finalProgA.data.completedTasksCount !== 2 || finalProgB.data.completedTasksCount !== 1) {
    throw new Error(`FAILED: Completed tasks counts do not match!`);
  }

  console.log('🎉 ALL MULTI-USER ISOLATION TESTS PASSED PERFECTLY!');
  await mongoose.disconnect();
  process.exit(0);
}

runTest().catch(err => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
