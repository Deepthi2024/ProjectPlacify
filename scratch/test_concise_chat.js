const http = require('http');

async function askChat(message, history = [], context = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      message,
      history,
      context,
      userId: 'test_user_concise',
      sessionId: 'test_session_123'
    });
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch(e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  console.log('=====================================================');
  console.log('TEST 1: "What is my roadmap?" (Normal Concise Query)');
  console.log('=====================================================');
  const t1 = await askChat('What is my roadmap?', [], {
    view: 'roadmap',
    domain: 'Full-Stack Web Development',
    pageTitle: 'Personalized Learning Roadmap'
  });
  console.log('Status:', t1.status);
  console.log('Reply:\n', t1.data.reply);
  console.log('\nSentence count approx:', t1.data.reply.split(/[.?!]\s+/).length);

  console.log('\n=====================================================');
  console.log('TEST 2: "How do I complete today\'s task?"');
  console.log('=====================================================');
  const t2 = await askChat("How do I complete today's task?", [], {
    view: 'dailyHub',
    domain: 'Full-Stack Web Development',
    pageTitle: 'Daily Learning Hub',
    details: {
      focusTopic: 'DOM Manipulation & Event Listeners',
      tasks: ['Build interactive counter', 'Handle form submit event']
    }
  });
  console.log('Status:', t2.status);
  console.log('Reply:\n', t2.data.reply);

  console.log('\n=====================================================');
  console.log('TEST 3: "What is React?" (Core Concept Query)');
  console.log('=====================================================');
  const t3 = await askChat("What is React?", [], {
    view: 'roadmap',
    domain: 'Full-Stack Web Development'
  });
  console.log('Status:', t3.status);
  console.log('Reply:\n', t3.data.reply);

  console.log('\n=====================================================');
  console.log('TEST 4: "Can you give me more detail on React?" (Detail Expansion)');
  console.log('=====================================================');
  const t4 = await askChat("Can you give me more detail on React and how components work?", [
    { role: 'user', content: 'What is React?' },
    { role: 'assistant', content: t3.data.reply }
  ], {
    view: 'roadmap',
    domain: 'Full-Stack Web Development'
  });
  console.log('Status:', t4.status);
  console.log('Reply:\n', t4.data.reply);
})();
