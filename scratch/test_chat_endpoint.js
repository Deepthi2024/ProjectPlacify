const http = require('http');

async function testChatApi(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
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
  console.log('--- Testing /api/chat endpoint ---');
  try {
    const res = await testChatApi({
      message: 'What is my roadmap?',
      history: [],
      context: {
        view: 'roadmap',
        domain: 'Full-Stack Web Development',
        pageTitle: 'Personalized Learning Roadmap'
      }
    });
    console.log('Status:', res.status);
    console.log('Reply:', res.data.reply);
  } catch(e) {
    console.error('Error:', e.message);
  }
})();
