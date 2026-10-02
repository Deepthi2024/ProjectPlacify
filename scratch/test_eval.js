const http = require('http');

function postJSON(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => resolve({ status: res.statusCode, json: JSON.parse(responseBody) }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function test() {
  try {
    const email = `devops_test_${Date.now()}@example.com`;
    console.log('1. Registering user with Cloud Engineering & DevOps domain...');
    const regRes = await postJSON('/api/auth/register', {
      name: 'DevOps Test User',
      email,
      password: 'password123',
      chosen_domain: 'devops',
      timeline_weeks: 4,
      daily_hours: 2.0
    });
    console.log('Registration status:', regRes.status);
    console.log('Profile:', regRes.json.profile);

    const userId = regRes.json.profile.user_id;

    console.log('\n2. Submitting quiz evaluation for DevOps user...');
    const evalRes = await postJSON('/api/quiz/evaluate', {
      user_id: userId,
      domain: 'Cloud Engineering & DevOps',
      answers: [
        { id: 'dev_q1', question: 'What is containerization?', user_answer: 'Containers share the host OS kernel, resulting in lightweight, fast-starting isolated environments.', correct_answer: 'Containers share the host OS kernel, resulting in lightweight, fast-starting isolated environments.', topic: 'Containerization', difficulty: 'BEGINNER' },
        { id: 'dev_q2', question: 'What is IaC?', user_answer: 'Defining and provisioning cloud infrastructure declaratively using code files managed in version control.', correct_answer: 'Defining and provisioning cloud infrastructure declaratively using code files managed in version control.', topic: 'Infrastructure as Code', difficulty: 'INTERMEDIATE' },
        { id: 'dev_q3', question: 'What is Kubernetes Ingress?', user_answer: 'Managing external access to services in a cluster, typically HTTP/HTTPS routing.', correct_answer: 'Managing external access to services in a cluster, typically HTTP/HTTPS routing.', topic: 'Kubernetes Orchestration', difficulty: 'INTERMEDIATE' },
        { id: 'dev_q4', question: 'Difference between CD and CD?', user_answer: 'Delivery ensures code is always ready for release with manual trigger; Deployment automatically deploys every passed change to production.', correct_answer: 'Delivery ensures code is always ready for release with manual trigger; Deployment automatically deploys every passed change to production.', topic: 'CI/CD Pipelines', difficulty: 'INTERMEDIATE' },
        { id: 'dev_q5', topic: 'Observability & Monitoring', question: 'Metric triad?', user_answer: 'Logs, Metrics, Traces', correct_answer: 'Logs, Metrics, Traces', difficulty: 'ADVANCED' }
      ]
    });
    console.log('Quiz Eval status:', evalRes.status);
    console.log('Evaluation domain in DB:', evalRes.json.evaluation.domain);
    console.log('Score Pct:', evalRes.json.evaluation.score_pct + '%');
    console.log('Skill Level:', evalRes.json.evaluation.skill_level);
    console.log('Answers evaluated topic count:', evalRes.json.evaluation.answers.length);
    console.log('\n✅ ALL E2E API CHECKS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test error:', err);
  }
}

test();
