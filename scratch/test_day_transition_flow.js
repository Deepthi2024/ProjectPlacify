/**
 * Automated Verification of Day Completion Transition Flow
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

function findNextAvailableDay(roadmap, currentMonth, currentWeek, currentDay) {
  if (!roadmap || !Array.isArray(roadmap.monthly_roadmap)) return null;
  const allDays = [];
  roadmap.monthly_roadmap.forEach(m => {
    const mNum = parseInt(m.month_number, 10);
    (m.weeks || []).forEach(w => {
      const wNum = parseInt(w.week_number, 10);
      (w.days || []).forEach(d => {
        const dNum = parseInt(d.day_number, 10);
        allDays.push({
          roadmapId: roadmap.roadmap_id || roadmap._id || roadmap.id || '',
          month: mNum,
          week: wNum,
          day: dNum,
          dayId: d.id || d.day_id || `day_${dNum}`
        });
      });
    });
  });

  allDays.sort((a, b) => {
    if (a.month !== b.month) return a.month - b.month;
    if (a.week !== b.week) return a.week - b.week;
    return a.day - b.day;
  });

  const currentIndex = allDays.findIndex(d =>
    d.month === Number(currentMonth) &&
    d.week === Number(currentWeek) &&
    d.day === Number(currentDay)
  );

  if (currentIndex >= 0 && currentIndex < allDays.length - 1) {
    return allDays[currentIndex + 1];
  }
  return null;
}

async function run() {
  console.log('=== VERIFYING DAILY TASK COMPLETION & DAY TRANSITION WORKFLOW ===\n');

  const testUserId = `test_flow_user_${Date.now()}`;
  const testEmail = `${testUserId}@example.com`;

  // 1. Register User
  console.log('[STEP 1] Registering User:', testUserId);
  const regRes = await postJSON('http://localhost:5000/api/auth/register', {
    user_id: testUserId,
    name: 'Day Flow Learner',
    email: testEmail,
    password: 'Password123!',
    target_role: 'Full Stack Engineer',
    target_companies: ['Google', 'Amazon'],
    chosen_domain: 'fullstack',
    timeline_months: 6,
    daily_hours: 2,
    current_skill_level: 'BEGINNER'
  });
  const actualUserId = regRes.data?.profile?.user_id || regRes.data?.user?.user_id || regRes.data?.user_id;
  console.log('Registered User ID:', actualUserId, 'Status:', regRes.status);

  // 2. Generate Roadmap
  console.log('\n[STEP 2] Generating Roadmap...');
  const genRes = await postJSON('http://localhost:5000/api/roadmap/generate', {
    user_id: actualUserId,
    chosen_domain: 'fullstack',
    timeline_months: 6,
    daily_hours: 2,
    force_regenerate: true
  });
  const roadmap = genRes.data?.roadmap;
  const day1 = roadmap.monthly_roadmap[0]?.weeks[0]?.days[0];
  console.log(`Day 1 has ${day1.tasks.length} tasks:`);
  day1.tasks.forEach((t, i) => console.log(`  Task ${i + 1}: [${t.taskId || t.id}] ${t.taskTitle || t.title}`));

  // 3. Complete Task 1
  const task1 = day1.tasks[0];
  const task1Id = task1.taskId || task1.id;
  console.log(`\n[STEP 3] Completing Task 1: ${task1Id}...`);
  const cRes1 = await postJSON('http://localhost:5000/api/task/status', {
    user_id: actualUserId,
    taskId: task1Id,
    completed: true,
    monthNumber: 1,
    weekNumber: 1,
    dayNumber: 1,
    title: task1.taskTitle || task1.title
  });
  console.log('Task 1 API Response Status:', cRes1.data?.success ? 'SUCCESS' : 'FAILED');

  // Verify Day 1 incomplete condition
  const fetch1 = await getJSON(`http://localhost:5000/api/roadmap/user/${actualUserId}`);
  const d1TasksAfterT1 = fetch1.data?.roadmap?.monthly_roadmap[0]?.weeks[0]?.days[0]?.tasks || [];
  const completedCount1 = d1TasksAfterT1.filter(t => t.completed === true || t.status === 'COMPLETED').length;
  const allCompleted1 = completedCount1 === d1TasksAfterT1.length;
  console.log(`Day 1 completion status: ${completedCount1}/${d1TasksAfterT1.length} tasks complete. allCompleted = ${allCompleted1}`);
  if (allCompleted1) {
    console.error('FAILED: Day 1 should NOT be marked all completed when only Task 1 is completed!');
    process.exit(1);
  }
  console.log('✓ Correct: User remains on Day 1 while tasks remain.');

  // 4. Complete Remaining Tasks of Day 1
  for (let i = 1; i < day1.tasks.length; i++) {
    const t = day1.tasks[i];
    const tId = t.taskId || t.id;
    console.log(`\n[STEP 4.${i}] Completing Task ${i + 1}: ${tId}...`);
    await postJSON('http://localhost:5000/api/task/status', {
      user_id: actualUserId,
      taskId: tId,
      completed: true,
      monthNumber: 1,
      weekNumber: 1,
      dayNumber: 1,
      title: t.taskTitle || t.title
    });
  }

  // 5. Verify Day 1 complete condition and Next Day resolution
  const fetchFinal = await getJSON(`http://localhost:5000/api/roadmap/user/${actualUserId}`);
  const finalD1Tasks = fetchFinal.data?.roadmap?.monthly_roadmap[0]?.weeks[0]?.days[0]?.tasks || [];
  const finalCompletedCount = finalD1Tasks.filter(t => t.completed === true || t.status === 'COMPLETED').length;
  const allCompletedFinal = finalCompletedCount === finalD1Tasks.length;
  console.log(`\n[STEP 5] Final Day 1 status: ${finalCompletedCount}/${finalD1Tasks.length} tasks complete. allCompleted = ${allCompletedFinal}`);
  if (!allCompletedFinal) {
    console.error('FAILED: All tasks of Day 1 should be completed!');
    process.exit(1);
  }
  console.log('✓ Day 1 is 100% completed.');

  // 6. Test findNextAvailableDay
  const nextDay = findNextAvailableDay(fetchFinal.data.roadmap, 1, 1, 1);
  console.log('\n[STEP 6] Next available day found:', nextDay);
  if (!nextDay || nextDay.month !== 1 || nextDay.week !== 1 || nextDay.day !== 2) {
    console.error('FAILED: Expected next day to be Month 1, Week 1, Day 2, got:', nextDay);
    process.exit(1);
  }
  console.log('✓ Successfully resolved next chronological day (Month 1, Week 1, Day 2).');

  console.log('\n============================================================');
  console.log('DAY TRANSITION WORKFLOW TEST PASSED 100%! ✓✓✓');
  console.log('============================================================');
}

run().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
