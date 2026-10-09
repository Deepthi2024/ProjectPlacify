const assert = require('assert');

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('🧪 Starting End-to-End Task Completion & Day Progression Test...\n');

  // 1. Create unique test user with roadmap
  const testEmail = `test_flow_${Date.now()}@placify.test`;
  const regResp = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'Password123!',
      full_name: 'Test Day Progression User',
      chosen_domain: 'cybersecurity',
      timeline_value: 3,
      daily_study_hours: 2,
      skill_level: 'BEGINNER'
    })
  });
  const registerData = await regResp.json();

  assert(registerData.success, 'Registration failed: ' + JSON.stringify(registerData));
  const userId = registerData.user.user_id;
  console.log(`✅ Registered test user: ${testEmail} (ID: ${userId})`);

  // 2. Fetch user roadmap
  const rmResp = await fetch(`${BASE_URL}/api/roadmap/user/${userId}`);
  const rmData = await rmResp.json();
  assert(rmData.success && rmData.roadmap, 'Failed to fetch roadmap: ' + JSON.stringify(rmData));
  const roadmap = rmData.roadmap;
  console.log(`✅ Fetched roadmap with ${roadmap.monthly_roadmap.length} months`);

  // Day 1 tasks
  const day1 = roadmap.monthly_roadmap[0].weeks[0].days[0];
  console.log(`\n📅 Day 1 (${day1.topic}) has ${day1.tasks.length} tasks:`);
  day1.tasks.forEach((t, i) => console.log(`   Task ${i + 1}: ${t.taskId || t.id} - ${t.taskTitle || t.title}`));

  // 3. Simulate completing Task 1 on Day 1
  const task1 = day1.tasks[0];
  const task1Id = task1.taskId || task1.id;
  console.log(`\n👉 Completing Task 1: ${task1Id}`);
  const comp1Resp = await fetch(`${BASE_URL}/api/task/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      taskId: task1Id,
      completed: true,
      monthNumber: 1,
      weekNumber: 1,
      dayNumber: 1,
      title: task1.taskTitle || task1.title
    })
  });
  const comp1Data = await comp1Resp.json();

  assert(comp1Data.success, 'Task 1 completion failed: ' + JSON.stringify(comp1Data));
  console.log(`✅ Task 1 marked complete in DB. Response completed=${comp1Data.completed}`);

  // 4. Fetch roadmap again and verify Task 1 is completed and calculate progress
  const rm1Resp = await fetch(`${BASE_URL}/api/roadmap/user/${userId}`);
  const rm1Data = await rm1Resp.json();
  const day1Updated = rm1Data.roadmap.monthly_roadmap[0].weeks[0].days[0];
  const t1Check = day1Updated.tasks.find(t => (t.taskId || t.id) === task1Id);
  assert(t1Check.completed === true || t1Check.status === 'COMPLETED', 'Task 1 not completed in refreshed roadmap');

  const totalDay1Tasks = day1Updated.tasks.length;
  const completedDay1Tasks = day1Updated.tasks.filter(t => t.completed === true || t.status === 'COMPLETED').length;
  const day1Pct = Math.round((completedDay1Tasks / totalDay1Tasks) * 100);
  console.log(`📊 Day 1 Progress after Task 1: ${completedDay1Tasks}/${totalDay1Tasks} (${day1Pct}%)`);

  if (totalDay1Tasks > 1) {
    assert(completedDay1Tasks < totalDay1Tasks, 'Should still have remaining tasks on Day 1');
    console.log(`✅ Correct: ${totalDay1Tasks - completedDay1Tasks} task(s) remaining on Day 1 -> Stay on Day 1.`);

    // Complete remaining tasks on Day 1
    for (let i = 1; i < day1Updated.tasks.length; i++) {
      const task = day1Updated.tasks[i];
      const tId = task.taskId || task.id;
      console.log(`👉 Completing Task ${i + 1}: ${tId}`);
      const cResp = await fetch(`${BASE_URL}/api/task/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          taskId: tId,
          completed: true,
          monthNumber: 1,
          weekNumber: 1,
          dayNumber: 1,
          title: task.taskTitle || task.title
        })
      });
      const cData = await cResp.json();
      assert(cData.success, 'Task completion failed: ' + JSON.stringify(cData));
    }
  }

  // 5. Verify Day 1 is now 100% completed
  const rmDay1DoneResp = await fetch(`${BASE_URL}/api/roadmap/user/${userId}`);
  const rmDay1Done = await rmDay1DoneResp.json();
  const day1AllDone = rmDay1Done.roadmap.monthly_roadmap[0].weeks[0].days[0];
  const allDay1Completed = day1AllDone.tasks.every(t => t.completed === true || t.status === 'COMPLETED');
  assert(allDay1Completed, 'All Day 1 tasks should be completed');
  console.log(`\n🎉 Day 1 Progress: ${day1AllDone.tasks.length}/${day1AllDone.tasks.length} (100%) -> ALL COMPLETED!`);

  // 6. Test Next Day Discovery
  const nextDay = rmDay1Done.roadmap.monthly_roadmap[0].weeks[0].days[1];
  console.log(`👉 Next available day: Month 1, Week 1, Day ${nextDay.day_number} (${nextDay.topic})`);
  assert(Number(nextDay.day_number) === 2, 'Next day should be Day 2');

  console.log('\n==========================================');
  console.log('✅ ALL BACKEND & WORKFLOW VERIFICATIONS PASSED 100%!');
  console.log('==========================================');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
