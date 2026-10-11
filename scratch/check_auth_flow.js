const fs = require('fs');
const content = fs.readFileSync('js/app.js', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('register') || line.includes('onboarding-')) {
    console.log(idx + 1, line.trim().slice(0, 100));
  }
});
