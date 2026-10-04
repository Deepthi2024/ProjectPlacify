const http = require('http');

function postJSON(urlStr, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const postData = JSON.stringify(data);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('PLACIFY - YOUTUBE RAG INTEGRATION TESTS');
  console.log('====================================================\n');

  // Test 1: Validation - missing query
  console.log('Test 1: Validation - Missing query...');
  const res1 = await postJSON('http://localhost:5000/api/rag/day-resources', { user_id: 'test_user_123' });
  console.log('Result 1:', res1);
  if (res1.statusCode === 400) {
    console.log('✅ Test 1 Passed: 400 returned for missing query.\n');
  } else {
    console.error('❌ Test 1 Failed!\n');
  }

  // Test 2: Validation - missing user_id
  console.log('Test 2: Validation - Missing user_id...');
  const res2 = await postJSON('http://localhost:5000/api/rag/day-resources', { query: 'Python Variables and Data Types' });
  console.log('Result 2:', res2);
  if (res2.statusCode === 400) {
    console.log('✅ Test 2 Passed: 400 returned for missing user_id.\n');
  } else {
    console.error('❌ Test 2 Failed!\n');
  }

  // Test 3: RAG Query 1 - Python Variables and Data Types
  console.log('Test 3: Day Task RAG Query 1 - "Python Variables and Data Types"...');
  const res3 = await postJSON('http://localhost:5000/api/rag/day-resources', {
    user_id: 'test_user_123',
    query: 'Python Variables and Data Types'
  });
  console.log('Result 3:', res3);
  if (res3.statusCode === 200 && 'success' in res3.body) {
    console.log('✅ Test 3 Passed: Endpoint handled query gracefully.\n');
  } else {
    console.error('❌ Test 3 Failed!\n');
  }

  // Test 4: RAG Query 2 - Python Functions
  console.log('Test 4: Day Task RAG Query 2 - "Python Functions"...');
  const res4 = await postJSON('http://localhost:5000/api/rag/day-resources', {
    user_id: 'test_user_123',
    query: 'Python Functions'
  });
  console.log('Result 4:', res4);
  if (res4.statusCode === 200 && 'success' in res4.body) {
    console.log('✅ Test 4 Passed: Endpoint handled distinct query gracefully.\n');
  } else {
    console.error('❌ Test 4 Failed!\n');
  }

  console.log('====================================================');
  console.log('ALL INTEGRATION SUITE CHECKS COMPLETE');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('Test execution error:', err);
});
