const http = require('http');

function sendChat(testName, messages) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ messages });
    console.log(`\n----------------------------------------`);
    console.log(`[TEST] ${testName}`);
    console.log(`Sending ${messages.length} messages...`);
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
          console.log(`Status: ${res.statusCode}`);
          console.log(`Assistant Reply: ${parsed.reply}`);
          if (parsed.recommendation) {
            console.log(`✨ Recommended Domain: "${parsed.recommendation.recommendedDomain}" (ID: ${parsed.recommendation.recommendedDomainId})`);
            console.log(`Confidence: ${parsed.recommendation.confidence}`);
            console.log(`Reason: ${parsed.recommendation.reason}`);
          } else {
            console.log(`Recommendation: None (Asking follow-up question)`);
          }
          resolve(parsed);
        } catch (e) {
          console.error('Raw response body:', body);
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runSuite() {
  try {
    const delay = () => new Promise(r => setTimeout(r, 1200));

    // TEST 1: Broad statement "I like AI"
    const res1 = await sendChat('1. Broad Prompt ("I like AI")', [
      { role: 'user', content: 'I like AI' }
    ]);
    await delay();

    // TEST 2: Multi-turn conversation ("I like AI" -> Assistant response -> "I like working with data")
    const res2 = await sendChat('2. Multi-Turn Context ("I like working with data")', [
      { role: 'user', content: 'I like AI' },
      { role: 'assistant', content: res1.reply },
      { role: 'user', content: 'I am interested in working with data and building predictive models' }
    ]);
    await delay();

    // TEST 3: Web Apps ("I want to build websites using React and Node.")
    const res3 = await sendChat('3. Specific Web Apps ("React and Node")', [
      { role: 'user', content: 'I want to build websites using React and Node.' }
    ]);
    await delay();

    // TEST 4: Ethical Hacking ("I want to learn ethical hacking.")
    const res4 = await sendChat('4. Ethical Hacking', [
      { role: 'user', content: 'I want to learn ethical hacking.' }
    ]);
    await delay();

    // TEST 5: Ambiguous ("I don't know what I want to learn.")
    const res5 = await sendChat('5. Ambiguous Input ("I don\'t know...")', [
      { role: 'user', content: "I don't know what I want to learn." }
    ]);

    console.log('\n========================================');
    console.log('✅ All 5 Groq Multi-Turn Tests Completed!');
    console.log('========================================');
  } catch (err) {
    console.error('❌ Test suite failed:', err);
  }
}

runSuite();
