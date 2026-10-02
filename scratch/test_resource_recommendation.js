// Verification Script for Placify Task-Specific, Day-Specific, and Domain-Specific Resource Recommendations
const http = require('http');

async function testResourceRecommendation(taskContext) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(taskContext);
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/resources/recommend',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runVerification() {
  console.log("=================================================");
  console.log("RUNNING RESOURCE RECOMMENDATION VERIFICATION TEST");
  console.log("=================================================\n");

  let passedAll = true;

  // TEST 1: Data Science Day 1 (Variables)
  const dsDay1 = await testResourceRecommendation({
    taskId: 'ds_day1_task1',
    dayNumber: 1,
    domain: 'Data Science & Machine Learning',
    topic: 'Python Fundamentals',
    subtopic: 'Variables & Primitive Data Types',
    taskTitle: 'Variables & Primitive Data Types',
    taskType: 'LEARN',
    taskDifficulty: 'BEGINNER',
    userLevel: 'BEGINNER'
  });

  console.log("📍 TEST 1: Data Science - Day 1 (Variables & Data Types)");
  console.log("Returned Resources:", dsDay1.resources ? dsDay1.resources.map(r => ({ title: r.title, url: r.url })) : dsDay1);
  const ds1Title = (dsDay1.resources && dsDay1.resources[0]) ? dsDay1.resources[0].title.toLowerCase() : '';
  if (ds1Title.includes('variable') || ds1Title.includes('introduction to python')) {
    console.log("✅ TEST 1 PASSED: Correctly returned Python Variables resource.\n");
  } else {
    console.error("❌ TEST 1 FAILED: Unexpected resources for Day 1 Variables.\n");
    passedAll = false;
  }

  // TEST 2: Data Science Day 2 (Control Flow)
  const dsDay2 = await testResourceRecommendation({
    taskId: 'ds_day2_task1',
    dayNumber: 2,
    domain: 'Data Science & Machine Learning',
    topic: 'Python Fundamentals',
    subtopic: 'Control Flow (if/else, loops)',
    taskTitle: 'Control Flow',
    taskType: 'LEARN',
    taskDifficulty: 'BEGINNER',
    userLevel: 'BEGINNER'
  });

  console.log("📍 TEST 2: Data Science - Day 2 (Control Flow & Loops)");
  console.log("Returned Resources:", dsDay2.resources ? dsDay2.resources.map(r => ({ title: r.title, url: r.url })) : dsDay2);
  const ds2Title = (dsDay2.resources && dsDay2.resources[0]) ? dsDay2.resources[0].title.toLowerCase() : '';
  if (ds2Title.includes('control flow') || ds2Title.includes('loop') || ds2Title.includes('if')) {
    console.log("✅ TEST 2 PASSED: Correctly returned Python Control Flow resource (Different from Day 1).\n");
  } else {
    console.error("❌ TEST 2 FAILED: Unexpected resources for Day 2 Control Flow.\n");
    passedAll = false;
  }

  // TEST 3: Data Science Day 3 (Functions)
  const dsDay3 = await testResourceRecommendation({
    taskId: 'ds_day3_task1',
    dayNumber: 3,
    domain: 'Data Science & Machine Learning',
    topic: 'Python Fundamentals',
    subtopic: 'Functions, Scope & Recursion',
    taskTitle: 'Functions',
    taskType: 'LEARN',
    taskDifficulty: 'BEGINNER',
    userLevel: 'BEGINNER'
  });

  console.log("📍 TEST 3: Data Science - Day 3 (Functions)");
  console.log("Returned Resources:", dsDay3.resources ? dsDay3.resources.map(r => ({ title: r.title, url: r.url })) : dsDay3);
  const ds3Title = (dsDay3.resources && dsDay3.resources[0]) ? dsDay3.resources[0].title.toLowerCase() : '';
  if (ds3Title.includes('function')) {
    console.log("✅ TEST 3 PASSED: Correctly returned Python Functions resource (Different from Day 1 & Day 2).\n");
  } else {
    console.error("❌ TEST 3 FAILED: Unexpected resources for Day 3 Functions.\n");
    passedAll = false;
  }

  // TEST 4: Data Science - Advanced Deep Learning & NLP (Word Embeddings)
  const nlpTask = await testResourceRecommendation({
    taskId: 'ds_nlp_task1',
    dayNumber: 25,
    domain: 'Data Science & Machine Learning',
    topic: 'Advanced Deep Learning & NLP',
    subtopic: 'Word Embeddings (Word2Vec / FastText)',
    taskTitle: 'Learn: Word Embeddings (Word2Vec / FastText)',
    taskType: 'LEARN',
    taskDifficulty: 'ADVANCED',
    userLevel: 'ADVANCED'
  });

  console.log("📍 TEST 4: Data Science - Advanced NLP (Word Embeddings Word2Vec/FastText)");
  console.log("Returned Resources:", nlpTask.resources ? nlpTask.resources.map(r => ({ title: r.title, url: r.url })) : nlpTask);
  const nlpTitle = (nlpTask.resources && nlpTask.resources[0]) ? nlpTask.resources[0].title.toLowerCase() : '';
  if (nlpTitle.includes('word embeddings') || nlpTitle.includes('word2vec') || nlpTitle.includes('vector representation')) {
    console.log("✅ TEST 4 PASSED: Correctly returned NLP Word Embeddings resource (NOT generic Python).\n");
  } else {
    console.error("❌ TEST 4 FAILED: Word Embeddings task received wrong resource.\n");
    passedAll = false;
  }

  // TEST 5: Cybersecurity - Linux Security Hardening
  const secTask = await testResourceRecommendation({
    taskId: 'sec_day1_task1',
    dayNumber: 1,
    domain: 'Cybersecurity & Ethical Hacking',
    topic: 'System Hardening & Privilege Escalation',
    subtopic: 'Linux/Windows Security Hardening',
    taskTitle: 'Linux Security Hardening',
    taskType: 'LEARN',
    taskDifficulty: 'ADVANCED',
    userLevel: 'ADVANCED'
  });

  console.log("📍 TEST 5: Cybersecurity - Linux Security Hardening");
  console.log("Returned Resources:", secTask.resources ? secTask.resources.map(r => ({ title: r.title, url: r.url })) : secTask);
  const secTitle = (secTask.resources && secTask.resources[0]) ? secTask.resources[0].title.toLowerCase() : '';
  if (secTitle.includes('security') || secTitle.includes('hardening') || secTitle.includes('linux')) {
    console.log("✅ TEST 5 PASSED: Correctly returned Cybersecurity Linux Security Hardening resource (NO generic HTML/Python leakage).\n");
  } else {
    console.error("❌ TEST 5 FAILED: Cybersecurity task received wrong resource.\n");
    passedAll = false;
  }

  if (passedAll) {
    console.log("=================================================");
    console.log("🎉 ALL RESOURCE RECOMMENDATION TESTS PASSED!");
    console.log("=================================================");
  } else {
    console.error("⚠️ SOME TESTS FAILED. CHECK LOGS ABOVE.");
  }
}

runVerification().catch(err => console.error("Test execution error:", err));
