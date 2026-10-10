const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');

console.log('--- 1. Checking Password Label in index.html ---');
const passwordLabelMatch = indexHtml.match(/<label for="reg-password">[\s\S]*?<\/label>/);
console.log('Password Label found:', passwordLabelMatch ? passwordLabelMatch[0].trim() : 'NONE');

if (!passwordLabelMatch || !passwordLabelMatch[0].includes('Password (min 6 characters):')) {
  console.error('FAIL: Label should say "Password (min 6 characters):"');
  process.exit(1);
}
if (passwordLabelMatch[0].includes('PBKDF2') || passwordLabelMatch[0].includes('Hashed')) {
  console.error('FAIL: Label should not contain PBKDF2 or Hashed');
  process.exit(1);
}

// Check helper text
if (indexHtml.includes('Stored securely using SHA-256') || indexHtml.includes('PBKDF2 with 100,000 iterations')) {
  console.error('FAIL: index.html still contains PBKDF2 salt helper note');
  process.exit(1);
}
console.log('PASS: Password label correctly cleaned up and helper note removed.');

console.log('\n--- 2. Checking for any undefined tabLoginBtn in app.js ---');
if (appJs.includes('tabLoginBtn')) {
  console.error('FAIL: app.js still contains tabLoginBtn');
  process.exit(1);
}
console.log('PASS: Zero occurrences of tabLoginBtn in app.js.');

console.log('\n--- 3. Checking Registration Handler logic ---');
if (!appJs.includes("renderDomainSelectionScreen(profile.name);") || !appJs.includes("switchView('domainSelection');")) {
  console.error('FAIL: app.js does not call renderDomainSelectionScreen and switchView("domainSelection") on registration');
  process.exit(1);
}
console.log('PASS: Registration handler navigates directly to domain selection screen.');

console.log('\nALL CHECKS PASSED!');
