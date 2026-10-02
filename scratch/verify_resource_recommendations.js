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

async function runResourceAcceptanceTests() {
  console.log("==================================================");
  console.log("RUNNING RESOURCE RECOMMENDATION ACCEPTANCE TEST SUITE");
  console.log("==================================================\n");

  // ----------------------------------------------------
  // TEST 1: BEGINNER Task Resource Personalization
  // ----------------------------------------------------
  console.log("--- TEST 1: Beginner Task Resource Personalization ---");
  const res1 = await postJSON('http://localhost:5000/api/resources/recommend', {
    taskId: 'task_py_vars_1',
    taskTitle: 'Learn: Python Variables and Data Types',
    taskType: 'LEARN',
    taskDifficulty: 'BEGINNER',
    taskDuration: 35,
    dailyTopic: 'Python Fundamentals',
    subtopic: 'Variables & Primitive Data Types',
    domain: 'datascience',
    userLevel: 'BEGINNER'
  });

  console.log(`Resources returned: ${res1.resources ? res1.resources.length : 0}`);
  if (res1.success && res1.resources && res1.resources.length > 0) {
    const primary = res1.resources[0];
    console.log(`  └─ Primary Title: "${primary.title}"`);
    console.log(`  └─ Platform: ${primary.platform}`);
    console.log(`  └─ URL: ${primary.url}`);
    console.log(`  └─ Difficulty: ${primary.difficulty}`);

    if (primary.url.includes('docs.python.org') && primary.difficulty === 'BEGINNER') {
      console.log("  └─ ✅ TEST 1 PASSED: Recommended beginner-friendly Python.org tutorial!\n");
    } else {
      console.error(`  └─ ❌ TEST 1 FAILED: Expected Python.org tutorial, got ${primary.url}`);
      process.exit(1);
    }
  } else {
    console.error("  └─ ❌ TEST 1 FAILED: No resources returned");
    process.exit(1);
  }

  // ----------------------------------------------------
  // TEST 2: INTERMEDIATE Task Resource Personalization
  // ----------------------------------------------------
  console.log("--- TEST 2: Intermediate Task Resource Personalization ---");
  const res2 = await postJSON('http://localhost:5000/api/resources/recommend', {
    taskId: 'task_py_func_inter',
    taskTitle: 'Implement: Python Functions & Modular Architecture',
    taskType: 'IMPLEMENT',
    taskDifficulty: 'INTERMEDIATE',
    taskDuration: 40,
    dailyTopic: 'Python Fundamentals',
    subtopic: 'Functions, Scope & Recursion',
    domain: 'datascience',
    userLevel: 'INTERMEDIATE'
  });

  if (res2.success && res2.resources && res2.resources.length > 0) {
    const primary = res2.resources[0];
    console.log(`  └─ Primary Title: "${primary.title}"`);
    console.log(`  └─ Difficulty: ${primary.difficulty}`);
    console.log(`  └─ Recommended Section: ${primary.recommended_section}`);

    if (primary.difficulty === 'INTERMEDIATE') {
      console.log("  └─ ✅ TEST 2 PASSED: Recommended intermediate implementation guide!\n");
    } else {
      console.error(`  └─ ❌ TEST 2 FAILED: Expected INTERMEDIATE difficulty`);
      process.exit(1);
    }
  }

  // ----------------------------------------------------
  // TEST 3: ADVANCED Task Resource Personalization
  // ----------------------------------------------------
  console.log("--- TEST 3: Advanced Task Resource Personalization ---");
  const res3 = await postJSON('http://localhost:5000/api/resources/recommend', {
    taskId: 'task_ml_scikit_1',
    taskTitle: 'Implement: Linear Regression using scikit-learn',
    taskType: 'IMPLEMENT',
    taskDifficulty: 'ADVANCED',
    taskDuration: 45,
    dailyTopic: 'Machine Learning Fundamentals',
    subtopic: 'Supervised vs Unsupervised Concepts',
    domain: 'datascience',
    userLevel: 'ADVANCED'
  });

  if (res3.success && res3.resources && res3.resources.length > 0) {
    const primary = res3.resources[0];
    console.log(`  └─ Primary Title: "${primary.title}"`);
    console.log(`  └─ URL: ${primary.url}`);
    console.log(`  └─ Official: ${primary.is_official}`);

    if (primary.url.includes('scikit-learn.org') && primary.is_official) {
      console.log("  └─ ✅ TEST 3 PASSED: Recommended official scikit-learn documentation!\n");
    } else {
      console.error(`  └─ ❌ TEST 3 FAILED: Expected official scikit-learn docs`);
      process.exit(1);
    }
  }

  // ----------------------------------------------------
  // TEST 4: Task Specificity (Changing Task Changes Resources)
  // ----------------------------------------------------
  console.log("--- TEST 4: Task Specificity & Task Change Handling ---");
  const res4a = await postJSON('http://localhost:5000/api/resources/recommend', {
    taskTitle: 'Learn: Python Variables and Data Types',
    domain: 'datascience',
    userLevel: 'BEGINNER'
  });
  const res4b = await postJSON('http://localhost:5000/api/resources/recommend', {
    taskTitle: 'Learn: Python Functions & Modular Code',
    domain: 'datascience',
    userLevel: 'BEGINNER'
  });

  const titleA = res4a.resources[0].title;
  const titleB = res4b.resources[0].title;
  console.log(`  └─ Task A Resource: "${titleA}"`);
  console.log(`  └─ Task B Resource: "${titleB}"`);

  if (titleA !== titleB && (titleB.includes('Function') || titleB.includes('python'))) {
    console.log("  └─ ✅ TEST 4 PASSED: Resources changed dynamically based on task title!\n");
  } else {
    console.error("  └─ ❌ TEST 4 FAILED: Resources did not change with task title");
    process.exit(1);
  }

  // ----------------------------------------------------
  // TEST 5: Task Type Matching (PRACTICE vs LEARN)
  // ----------------------------------------------------
  console.log("--- TEST 5: Task Type Matching (PRACTICE vs LEARN) ---");
  const res5Practice = await postJSON('http://localhost:5000/api/resources/recommend', {
    taskTitle: 'Practice: Python Variables Exercises',
    taskType: 'PRACTICE',
    domain: 'datascience',
    userLevel: 'BEGINNER'
  });

  const practiceRes = res5Practice.resources[0];
  console.log(`  └─ Practice Task Resource Type: ${practiceRes.resource_type}`);
  console.log(`  └─ Title: "${practiceRes.title}"`);

  if (practiceRes.resource_type === 'PRACTICE' || practiceRes.title.includes('Exercises')) {
    console.log("  └─ ✅ TEST 5 PASSED: PRACTICE task received practice exercises!\n");
  } else {
    console.error("  └─ ❌ TEST 5 FAILED: Expected PRACTICE resource type");
    process.exit(1);
  }

  // ----------------------------------------------------
  // TEST 6: Exact Direct URL Validation
  // ----------------------------------------------------
  console.log("--- TEST 6: Exact Direct URL Validation ---");
  for (const r of res1.resources) {
    console.log(`  └─ Checking URL: ${r.url}`);
    if (!r.url.startsWith('http://') && !r.url.startsWith('https://')) {
      console.error(`  └─ ❌ Invalid URL protocol: ${r.url}`);
      process.exit(1);
    }
    if (r.url.includes('google.com/search') || r.url === 'https://youtube.com/') {
      console.error(`  └─ ❌ Generic search/homepage URL detected: ${r.url}`);
      process.exit(1);
    }
  }
  console.log("  └─ ✅ TEST 6 PASSED: All URLs are direct, non-generic valid HTTP/HTTPS links!\n");

  // ----------------------------------------------------
  // TEST 7: Multi-Domain Specific Resource Matching
  // ----------------------------------------------------
  console.log("--- TEST 7: Multi-Domain Specific Resource Matching ---");
  const domains = [
    { key: 'fullstack', task: 'Learn: HTML5 Semantic Markup', expectedURL: 'developer.mozilla.org' },
    { key: 'dsa', task: 'Practice: Two Sum Problem', expectedURL: 'leetcode.com' },
    { key: 'devops', task: 'Implement: Dockerfile Optimization', expectedURL: 'docs.docker.com' },
    { key: 'cybersecurity', task: 'Learn: OWASP Top 10 Security', expectedURL: 'owasp.org' }
  ];

  for (const dom of domains) {
    const res = await postJSON('http://localhost:5000/api/resources/recommend', {
      taskTitle: dom.task,
      domain: dom.key,
      userLevel: 'INTERMEDIATE'
    });

    const primaryUrl = res.resources[0].url;
    console.log(`  └─ Domain: ${dom.key} | URL: ${primaryUrl}`);
    if (primaryUrl.includes(dom.expectedURL)) {
      console.log(`     └─ ✅ Matched domain authority: ${dom.expectedURL}`);
    } else {
      console.error(`     └─ ❌ Failed to match domain authority for ${dom.key}`);
      process.exit(1);
    }
  }
  console.log("\n  └─ ✅ TEST 7 PASSED: All tech domains matched authority resources!\n");

  // ----------------------------------------------------
  // TEST 8: Failure Isolation & Fallback Handling
  // ----------------------------------------------------
  console.log("--- TEST 8: Failure Isolation & Fallback Handling ---");
  const resErr = await postJSON('http://localhost:5000/api/resources/recommend', {
    taskTitle: '', // Invalid empty title
    domain: ''
  });

  console.log(`  └─ Response on missing params: ${JSON.stringify(resErr)}`);
  if (resErr.error || resErr.success === false) {
    console.log("  └─ ✅ TEST 8 PASSED: System gracefully handles invalid inputs without crashing server!\n");
  } else {
    console.error("  └─ ❌ TEST 8 FAILED: Expected error or fallback status");
    process.exit(1);
  }

  console.log("==================================================");
  console.log("ALL RESOURCE ACCEPTANCE TESTS PASSED SUCCESSFULLY! 🎉");
  console.log("==================================================");
}

runResourceAcceptanceTests().catch(err => {
  console.error("❌ Test suite failed:", err);
  process.exit(1);
});
