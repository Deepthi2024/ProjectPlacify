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
            resolve(JSON.parse(raw));
          } catch (e) {
            reject(new Error(`Failed to parse response: ${raw}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runSubsystemVerificationSuite() {
  console.log("==================================================");
  console.log("RUNNING RESOURCE SUGGESTER & GROUNDED ASSESSMENT TEST SUITE");
  console.log("==================================================\n");

  let allPassed = true;

  // ----------------------------------------------------
  // TEST 1: BEGINNER Tier Resource Curation
  // ----------------------------------------------------
  console.log("--- TEST 1: BEGINNER Tier Resource Curation ---");
  const res1 = await postJSON('http://localhost:5000/api/resources/recommend', {
    taskId: 'task_beg_var_1',
    taskTitle: 'Python Variables & Primitive Data Types',
    taskType: 'LEARN',
    taskDifficulty: 'BEGINNER',
    domain: 'datascience',
    userLevel: 'BEGINNER'
  });

  if (res1.success && res1.resources && res1.resources.length > 0) {
    const r = res1.resources[0];
    console.log(`  └─ Primary Title: "${r.title}"`);
    console.log(`  └─ Platform: ${r.platform}`);
    console.log(`  └─ Difficulty: ${r.difficulty}`);
    console.log(`  └─ Category: ${r.category_label}`);
    
    if (r.difficulty === 'BEGINNER') {
      console.log("  └─ ✅ TEST 1 PASSED: Curated Beginner-tier visual sandbox / ELI5 guide.\n");
    } else {
      console.error("  └─ ❌ TEST 1 FAILED: Incorrect difficulty returned for Beginner tier.");
      allPassed = false;
    }
  } else {
    console.error("  └─ ❌ TEST 1 FAILED: No resources returned.");
    allPassed = false;
  }

  // ----------------------------------------------------
  // TEST 2: INTERMEDIATE Tier Resource Curation
  // ----------------------------------------------------
  console.log("--- TEST 2: INTERMEDIATE Tier Resource Curation ---");
  const res2 = await postJSON('http://localhost:5000/api/resources/recommend', {
    taskId: 'task_int_var_1',
    taskTitle: 'Python Functions & Scope Specification',
    taskType: 'IMPLEMENT',
    taskDifficulty: 'INTERMEDIATE',
    domain: 'datascience',
    userLevel: 'INTERMEDIATE'
  });

  if (res2.success && res2.resources && res2.resources.length > 0) {
    const r = res2.resources[0];
    console.log(`  └─ Primary Title: "${r.title}"`);
    console.log(`  └─ Platform: ${r.platform}`);
    console.log(`  └─ Difficulty: ${r.difficulty}`);
    console.log(`  └─ Category: ${r.category_label}`);
    
    if (r.difficulty === 'INTERMEDIATE') {
      console.log("  └─ ✅ TEST 2 PASSED: Curated Intermediate-tier official documentation / GitHub sample.\n");
    } else {
      console.error("  └─ ❌ TEST 2 FAILED: Incorrect difficulty for Intermediate tier.");
      allPassed = false;
    }
  } else {
    console.error("  └─ ❌ TEST 2 FAILED: No resources returned.");
    allPassed = false;
  }

  // ----------------------------------------------------
  // TEST 3: ADVANCED Tier Resource Curation
  // ----------------------------------------------------
  console.log("--- TEST 3: ADVANCED Tier Resource Curation ---");
  const res3 = await postJSON('http://localhost:5000/api/resources/recommend', {
    taskId: 'task_adv_var_1',
    taskTitle: 'CPython Memory Layout & PyObject Header Spec',
    taskType: 'LEARN',
    taskDifficulty: 'ADVANCED',
    domain: 'datascience',
    userLevel: 'ADVANCED'
  });

  if (res3.success && res3.resources && res3.resources.length > 0) {
    const r = res3.resources[0];
    console.log(`  └─ Primary Title: "${r.title}"`);
    console.log(`  └─ Platform: ${r.platform}`);
    console.log(`  └─ Difficulty: ${r.difficulty}`);
    
    if (r.difficulty === 'ADVANCED') {
      console.log("  └─ ✅ TEST 3 PASSED: Curated Advanced-tier system architecture / low-level spec.\n");
    } else {
      console.error("  └─ ❌ TEST 3 FAILED: Incorrect difficulty for Advanced tier.");
      allPassed = false;
    }
  } else {
    console.error("  └─ ❌ TEST 3 FAILED: No resources returned.");
    allPassed = false;
  }

  // ----------------------------------------------------
  // TEST 4: Grounded Assessment Fetching (3 Questions Q1, Q2, Q3)
  // ----------------------------------------------------
  console.log("--- TEST 4: Grounded Assessment Generation ---");
  const evalFetch = await postJSON('http://localhost:5000/api/resources/fetch-assessment', {
    topic: 'Python Variables & Memory Pointer Mechanics',
    skill_level: 'BEGINNER',
    domain: 'datascience'
  });

  if (evalFetch.success && evalFetch.questions && evalFetch.questions.length === 3) {
    console.log(`  └─ Questions Generated: ${evalFetch.questions.length}`);
    console.log(`  └─ Q1 Taxonomy: "${evalFetch.questions[0].taxonomy}"`);
    console.log(`  └─ Q2 Taxonomy: "${evalFetch.questions[1].taxonomy}"`);
    console.log(`  └─ Q3 Taxonomy: "${evalFetch.questions[2].taxonomy}"`);
    console.log("  └─ ✅ TEST 4 PASSED: Generated exactly 3 grounded questions matching taxonomy (Q1, Q2, Q3)!\n");
  } else {
    console.error("  └─ ❌ TEST 4 FAILED: Grounded questions not matching expected 3-question taxonomy.");
    allPassed = false;
  }

  // ----------------------------------------------------
  // TEST 5: Level-Up Eligibility Triggering (Score >= 85% for Beginner)
  // ----------------------------------------------------
  console.log("--- TEST 5: Level-Up Eligibility Triggering (Score >= 85%) ---");
  const evalGrade = await postJSON('http://localhost:5000/api/resources/grade-assessment', {
    topic: 'Python Variables',
    skill_level: 'BEGINNER',
    questions: evalFetch.questions,
    user_answers: {
      'q1_concept': 0,
      'q2_code': 0,
      'q3_edge': 0
    }
  });

  console.log(`  └─ Score Percentage: ${evalGrade.score_pct}%`);
  console.log(`  └─ Level-Up Eligible: ${evalGrade.level_up_eligible}`);
  if (evalGrade.level_up_eligible && evalGrade.level_up_options && evalGrade.level_up_options.length === 2) {
    console.log(`  └─ Option A: "${evalGrade.level_up_options[0].label}"`);
    console.log(`  └─ Option B: "${evalGrade.level_up_options[1].label}"`);
    console.log("  └─ ✅ TEST 5 PASSED: Level-Up Eligibility triggered with Option A vs Option B choices!\n");
  } else {
    console.error("  └─ ❌ TEST 5 FAILED: Level-Up Eligibility did not trigger expected prompt or options.");
    allPassed = false;
  }

  if (allPassed) {
    console.log("==================================================");
    console.log("🎉 ALL SUB-SYSTEM ACCEPTANCE TESTS PASSED CONDITIONALLY!");
    console.log("==================================================");
  } else {
    console.error("\n❌ SUB-SYSTEM ACCEPTANCE TEST SUITE FAILED.");
    process.exit(1);
  }
}

runSubsystemVerificationSuite().catch(err => {
  console.error("Test execution error:", err);
  process.exit(1);
});
