const assert = require('assert');
const fs = require('fs');
const path = require('path');

// 1. Verify app.js contains all required elements
const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

console.log('🧪 Verifying frontend source code contract...');

// A. Event delegation presence
assert(appJsContent.includes(".closest('.task-complete-toggle')"), 'Global delegated listener for .task-complete-toggle missing');
console.log('✅ Global delegated event listener for .task-complete-toggle confirmed');

// B. Exact debug logs
const requiredLogs = [
  '[TASK CLICK]',
  '[TASK BUTTON CLICK]',
  '[TASK API REQUEST]',
  '[TASK API RESPONSE]',
  '[DAY PROGRESS]',
  '[NEXT DAY CHECK]',
  '[NEXT DAY]'
];
for (const log of requiredLogs) {
  assert(appJsContent.includes(log), `Required log ${log} missing in app.js`);
  console.log(`✅ Required log confirmed: ${log}`);
}

// C. Next day discovery helper
assert(appJsContent.includes('findNextAvailableDay'), 'findNextAvailableDay helper missing');
assert(appJsContent.includes('window.findNextAvailableDay = findNextAvailableDay'), 'window.findNextAvailableDay export missing');
console.log('✅ findNextAvailableDay implementation & global export confirmed');

// D. Check CSS styles in styles.css
const cssPath = path.join(__dirname, '..', 'styles.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');
assert(cssContent.includes('.btn-success'), '.btn-success missing in styles.css');
assert(cssContent.includes('.task-complete-toggle'), '.task-complete-toggle missing in styles.css');
assert(cssContent.includes('pointer-events: auto !important'), 'pointer-events rule missing for .task-complete-toggle');
assert(cssContent.includes('cursor: pointer !important'), 'cursor pointer rule missing for .task-complete-toggle');
console.log('✅ CSS rules for .btn-success, .task-complete-toggle, and cursor interactions confirmed');

// E. Check HTML elements in index.html
const htmlPath = path.join(__dirname, '..', 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');
assert(htmlContent.includes('id="current-day-progress-badge"'), 'current-day-progress-badge missing in index.html');
assert(htmlContent.includes('id="day-progress-bar-fill"'), 'day-progress-bar-fill missing in index.html');
console.log('✅ index.html progress elements confirmed');

console.log('\n==========================================');
console.log('🎉 ALL CODE CONTRACT CHECKS PASSED 100%!');
console.log('==========================================');
