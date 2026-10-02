const http = require('http');

function testDomainAssistant(testName, messages) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ messages });
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/domain-assistant',
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
          const parsed = JSON.parse(body);
          console.log(`\n========================================`);
          console.log(`TEST: ${testName}`);
          console.log(`========================================`);
          console.log(`Status: ${res.statusCode}`);
          console.log(`Reply: ${parsed.reply}`);
          if (parsed.recommendation) {
            console.log(`Recommended Domain: "${parsed.recommendation.recommendedDomain}" (ID: ${parsed.recommendation.recommendedDomainId})`);
            console.log(`Confidence: ${parsed.recommendation.confidence}`);
            console.log(`Reason: ${parsed.recommendation.reason}`);
          } else {
            console.log(`Recommendation: None (Needs clarification)`);
          }
          resolve(parsed);
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

async function runAllTests() {
  try {
    // Test 1: Websites & Web Apps -> Full-Stack Web Development
    await testDomainAssistant('1. Web Development', [
      { role: 'user', content: 'I want to build websites and web applications.' }
    ]);

    // Test 2: Data & ML -> Data Science & Machine Learning
    await testDomainAssistant('2. Data & ML', [
      { role: 'user', content: 'I want to analyze data and build machine learning models.' }
    ]);

    // Test 3: Ethical Hacking -> Cybersecurity & Ethical Hacking
    await testDomainAssistant('3. Ethical Hacking', [
      { role: 'user', content: 'I want to learn ethical hacking and penetration testing.' }
    ]);

    // Test 4: AWS Cloud -> Cloud Engineering & DevOps
    await testDomainAssistant('4. AWS Cloud', [
      { role: 'user', content: 'I want to work with AWS cloud infrastructure.' }
    ]);

    // Test 5: CI/CD & Deployments -> Cloud Engineering & DevOps
    await testDomainAssistant('5. CI/CD & Deployments', [
      { role: 'user', content: 'I want to automate CI/CD and deployments.' }
    ]);

    // Test 6: Ambiguous Input -> Clarifying question
    await testDomainAssistant('6. Ambiguous Input', [
      { role: 'user', content: "I don't know what I want to learn." }
    ]);

    console.log('\n✅ All Domain Assistant test cases completed successfully!');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

runAllTests();
