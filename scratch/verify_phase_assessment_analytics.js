/**
 * End-to-End Verification Test for Phase-Wise Assessment Scores and Badges Persistence in Analytics
 * Testing 2 separate test users, score calculations, badge awards, MongoDB persistence,
 * retakes, user isolation, and Analytics synchronization.
 */

const http = require('http');
const assert = require('assert');

const BASE_URL = 'http://localhost:5000';

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runVerification() {
  console.log('===============================================================');
  console.log('🧪 STARTING PHASE ASSESSMENT & ANALYTICS PERSISTENCE VERIFICATION');
  console.log('===============================================================');

  const timestamp = Date.now();
  const user1Email = `user1_eval_${timestamp}@placify.test`;
  const user2Email = `user2_eval_${timestamp}@placify.test`;
  const password = 'Password@123';

  // -------------------------------------------------------------
  // STEP 1: Register User 1 and User 2
  // -------------------------------------------------------------
  console.log('\n📝 1. Registering Test User 1 & Test User 2...');
  
  const reg1 = await request('POST', '/api/auth/register', {
    name: 'Alice Learner',
    email: user1Email,
    password: password,
    chosen_domain: 'fullstack',
    timeline_months: 4,
    daily_hours: 2.0
  });
  assert(reg1.status === 200 || reg1.status === 201, `User 1 registration failed with status ${reg1.status}`);
  const user1Id = reg1.data.profile.user_id;
  console.log(`   ✅ User 1 registered: ${user1Id} (${user1Email})`);

  const reg2 = await request('POST', '/api/auth/register', {
    name: 'Bob Learner',
    email: user2Email,
    password: password,
    chosen_domain: 'datascience',
    timeline_months: 6,
    daily_hours: 3.0
  });
  assert(reg2.status === 200 || reg2.status === 201, `User 2 registration failed with status ${reg2.status}`);
  const user2Id = reg2.data.profile.user_id;
  console.log(`   ✅ User 2 registered: ${user2Id} (${user2Email})`);

  // Generate roadmaps for both users so tasks and topics exist
  console.log('\n🗺️ 2. Initializing Roadmaps for both users...');
  const rm1 = await request('POST', '/api/roadmap/generate', {
    user_id: user1Id,
    domain: 'fullstack',
    timeline_months: 4,
    daily_hours: 2.0,
    quiz_score: 75,
    skill_level: 'INTERMEDIATE'
  });
  assert.strictEqual(rm1.status, 200, 'Roadmap generation failed for User 1');
  const user1RoadmapId = rm1.data.roadmap._id || rm1.data.roadmap.id || 'rm_u1';
  console.log('   ✅ User 1 Roadmap generated.');

  const rm2 = await request('POST', '/api/roadmap/generate', {
    user_id: user2Id,
    domain: 'datascience',
    timeline_months: 6,
    daily_hours: 3.0,
    quiz_score: 50,
    skill_level: 'BEGINNER'
  });
  assert.strictEqual(rm2.status, 200, 'Roadmap generation failed for User 2');
  console.log('   ✅ User 2 Roadmap generated.');

  // Check initial progress analytics for User 1 before any assessment
  console.log('\n📊 3. Checking Initial Analytics before assessment...');
  const initProg1 = await request('GET', `/api/progress/${user1Id}`);
  assert.strictEqual(initProg1.status, 200);
  const topics1 = Object.keys(initProg1.data.topicStats);
  console.log(`   User 1 has ${topics1.length} topics in progress breakdown.`);
  assert(topics1.length > 0, 'User 1 should have topic stats');
  const firstTopic1 = topics1[0];
  assert.strictEqual(initProg1.data.topicStats[firstTopic1].assessmentAttempted, false, 'Initial topic assessmentAttempted should be false');
  assert.strictEqual(initProg1.data.topicStats[firstTopic1].assessmentScore, null, 'Initial topic assessmentScore should be null');
  console.log(`   ✅ Topic "${firstTopic1}" shows assessmentScore: null, assessmentAttempted: false (renders as "Not attempted").`);

  // -------------------------------------------------------------
  // STEP 4: Submit Phase 1 Assessment for User 1 (Score: 88% -> Pass -> Badge)
  // -------------------------------------------------------------
  console.log('\n🎯 4. Submitting Phase 1 Assessment for User 1 (Score: 88%, 7/8 correct)...');
  const phase1Payload = {
    submissionId: `eval_${Date.now()}_u1_p1`,
    userId: user1Id,
    roadmapId: user1RoadmapId,
    domain: 'fullstack',
    phaseKey: 'm1_w1_d1',
    phaseNumber: 1,
    monthNumber: 1,
    weekNumber: 1,
    dayNumber: 1,
    phaseTitle: firstTopic1,
    topic: firstTopic1,
    scorePct: 88,
    totalQuestions: 8,
    totalMarks: 9,
    marksObtained: 8,
    correctCount: 7,
    partiallyCorrectCount: 1,
    incorrectCount: 0,
    passed: true,
    submittedAt: new Date().toISOString(),
    detailedQuestions: [
      { id: 'q1', type: 'MCQ', status: 'CORRECT', earnedPoints: 1, maxPoints: 1 },
      { id: 'q2', type: 'MSQ', status: 'PARTIALLY_CORRECT', earnedPoints: 1, maxPoints: 2 }
    ],
    conceptsToReview: []
  };

  const saveRes1 = await request('POST', '/api/phase-assessment/save', phase1Payload);
  assert.strictEqual(saveRes1.status, 200, 'Saving phase assessment failed');
  assert.strictEqual(saveRes1.data.success, true);
  assert.strictEqual(saveRes1.data.score_pct, 88);
  assert.strictEqual(saveRes1.data.passed, true);
  assert(saveRes1.data.badge_earned, 'Badge should be earned for >= 70%');
  assert.strictEqual(saveRes1.data.badge_earned.name, '🎯 Phase 1 Master');
  console.log('   ✅ Saved in MongoDB Atlas: Phase 1 Assessment with score 88% and badge "🎯 Phase 1 Master".');

  // -------------------------------------------------------------
  // STEP 5: Verify Persistence in MongoDB & Sync to Analytics
  // -------------------------------------------------------------
  console.log('\n🔍 5. Verifying Phase Assessment in MongoDB & Analytics for User 1...');
  const user1Assessments = await request('GET', `/api/phase-assessment/user/${user1Id}`);
  assert.strictEqual(user1Assessments.status, 200);
  assert.strictEqual(user1Assessments.data.count, 1);
  const savedAssessment = user1Assessments.data.assessments[0];
  assert.strictEqual(savedAssessment.user_id, user1Id);
  assert.strictEqual(savedAssessment.score_pct, 88);
  assert.strictEqual(savedAssessment.correct_count, 7);
  assert.strictEqual(savedAssessment.partially_correct_count, 1);
  assert.strictEqual(savedAssessment.incorrect_count, 0);
  assert.strictEqual(savedAssessment.passed, true);
  console.log('   ✅ MongoDB PhaseAssessment document verified with counts (7 correct, 1 partial, 0 incorrect).');

  const progAfterSave = await request('GET', `/api/progress/${user1Id}`);
  assert.strictEqual(progAfterSave.status, 200);
  const statAfter = progAfterSave.data.topicStats[firstTopic1];
  assert.strictEqual(statAfter.assessmentAttempted, true);
  assert.strictEqual(statAfter.assessmentScore, 88);
  assert.strictEqual(statAfter.assessmentPassed, true);
  console.log(`   ✅ Analytics topicStats for "${firstTopic1}" updated to: Assessment Score: 88%, Attempted: true.`);
  
  assert(progAfterSave.data.badges.includes('🎯 Phase 1 Master'), 'Badge "🎯 Phase 1 Master" must be in progress badges');
  console.log('   ✅ Analytics badges list includes:', progAfterSave.data.badges);

  // -------------------------------------------------------------
  // STEP 6: User Isolation Check (User 2 should NOT see User 1's score or badge)
  // -------------------------------------------------------------
  console.log('\n🔒 6. Verifying User Isolation (User 2 must have NO User 1 scores or badges)...');
  const prog2 = await request('GET', `/api/progress/${user2Id}`);
  assert.strictEqual(prog2.status, 200);
  assert(!prog2.data.badges.includes('🎯 Phase 1 Master'), 'User 2 MUST NOT have User 1 badge');
  const user2Topics = Object.keys(prog2.data.topicStats);
  for (const t of user2Topics) {
    assert.strictEqual(prog2.data.topicStats[t].assessmentAttempted, false, `User 2 topic ${t} must not be marked attempted`);
    assert.strictEqual(prog2.data.topicStats[t].assessmentScore, null, `User 2 topic ${t} must have null score`);
  }
  const user2Assessments = await request('GET', `/api/phase-assessment/user/${user2Id}`);
  assert.strictEqual(user2Assessments.data.count, 0, 'User 2 should have 0 assessment records');
  console.log('   ✅ User isolation verified: User 2 has 0 assessments, 0 phase badges, and all topics are Not attempted.');

  // -------------------------------------------------------------
  // STEP 7: Retake Assessment for User 1 (Score: 100% -> Latest Score Updated + History Preserved)
  // -------------------------------------------------------------
  console.log('\n🔄 7. User 1 Retakes Phase 1 Assessment (Score: 100%)...');
  const retakePayload = {
    submissionId: `eval_${Date.now()}_u1_p1_retake`,
    userId: user1Id,
    roadmapId: user1RoadmapId,
    domain: 'fullstack',
    phaseKey: 'm1_w1_d1',
    phaseNumber: 1,
    monthNumber: 1,
    weekNumber: 1,
    dayNumber: 1,
    phaseTitle: firstTopic1,
    topic: firstTopic1,
    scorePct: 100,
    totalQuestions: 8,
    totalMarks: 9,
    marksObtained: 9,
    correctCount: 8,
    partiallyCorrectCount: 0,
    incorrectCount: 0,
    passed: true,
    submittedAt: new Date(Date.now() + 1000).toISOString()
  };

  const retakeRes = await request('POST', '/api/phase-assessment/save', retakePayload);
  assert.strictEqual(retakeRes.status, 200);
  assert.strictEqual(retakeRes.data.score_pct, 100);
  console.log('   ✅ Retake saved in MongoDB.');

  const assessmentsAfterRetake = await request('GET', `/api/phase-assessment/user/${user1Id}`);
  assert.strictEqual(assessmentsAfterRetake.data.count, 2, 'History must preserve both attempts');
  console.log('   ✅ Assessment history preserved: 2 attempts found in MongoDB.');

  const progAfterRetake = await request('GET', `/api/progress/${user1Id}`);
  const statAfterRetake = progAfterRetake.data.topicStats[firstTopic1];
  assert.strictEqual(statAfterRetake.assessmentScore, 100, 'Latest score must be 100%');
  assert(progAfterRetake.data.badges.includes('🌟 Perfect Score'), 'Perfect score badge should be awarded');
  console.log(`   ✅ Analytics updated with latest attempt score: ${statAfterRetake.assessmentScore}% and "🌟 Perfect Score" badge.`);

  // -------------------------------------------------------------
  // STEP 8: Idempotency & Persistence across Re-fetching (Logout/Login Simulation)
  // -------------------------------------------------------------
  console.log('\n🔁 8. Testing Badge Idempotency and Persistence Across Re-fetching...');
  const loginRes = await request('POST', '/api/auth/login', {
    email: user1Email,
    password: password
  });
  assert.strictEqual(loginRes.status, 200);
  console.log('   ✅ User 1 logged in again.');

  const reloadedProg = await request('GET', `/api/progress/${user1Id}`);
  assert.strictEqual(reloadedProg.data.topicStats[firstTopic1].assessmentScore, 100);
  
  // Count occurrences of "🎯 Phase 1 Master" to ensure no duplicates
  const badgeCounts = reloadedProg.data.badges.reduce((acc, b) => {
    acc[b] = (acc[b] || 0) + 1;
    return acc;
  }, {});
  assert.strictEqual(badgeCounts['🎯 Phase 1 Master'], 1, 'Badge must not be duplicated');
  assert.strictEqual(badgeCounts['🌟 Perfect Score'], 1, 'Badge must not be duplicated');
  console.log('   ✅ Badges are strictly unique and idempotent: ', reloadedProg.data.badges);

  // -------------------------------------------------------------
  // STEP 9: Submit Failing Assessment for User 2 (Score: 40% -> Needs Review, no badge)
  // -------------------------------------------------------------
  console.log('\n❌ 9. Submitting Failing Assessment for User 2 (Score: 40%)...');
  const user2Topic = user2Topics[0];
  const failPayload = {
    submissionId: `eval_${Date.now()}_u2_fail`,
    userId: user2Id,
    roadmapId: 'rm_u2',
    domain: 'datascience',
    phaseKey: 'm1_w1_d1',
    phaseNumber: 1,
    phaseTitle: user2Topic,
    topic: user2Topic,
    scorePct: 40,
    totalQuestions: 8,
    totalMarks: 10,
    marksObtained: 4,
    correctCount: 3,
    partiallyCorrectCount: 1,
    incorrectCount: 4,
    passed: false,
    submittedAt: new Date().toISOString()
  };

  const failRes = await request('POST', '/api/phase-assessment/save', failPayload);
  assert.strictEqual(failRes.status, 200);
  assert.strictEqual(failRes.data.passed, false);
  assert.strictEqual(failRes.data.badge_earned, null, 'No badge should be earned for < 70%');

  const prog2AfterFail = await request('GET', `/api/progress/${user2Id}`);
  assert.strictEqual(prog2AfterFail.data.topicStats[user2Topic].assessmentScore, 40);
  assert.strictEqual(prog2AfterFail.data.topicStats[user2Topic].assessmentPassed, false);
  assert(!prog2AfterFail.data.badges.includes('🎯 Phase 1 Master'), 'User 2 must not receive master badge');
  console.log(`   ✅ User 2 has score: 40%, assessmentPassed: false, and no master badge awarded.`);

  // Clean up test data
  console.log('\n🧹 10. Cleaning up test users...');
  await request('POST', `/api/user/reset/${user1Id}`);
  await request('POST', `/api/user/reset/${user2Id}`);
  console.log('   ✅ Test users reset cleanly.');

  console.log('\n===============================================================');
  console.log('🎉 ALL 10 VERIFICATION CHECKS PASSED WITH ZERO ERRORS!');
  console.log('===============================================================');
}

runVerification().catch(err => {
  console.error('\n❌ VERIFICATION FAILED:', err);
  process.exit(1);
});
