const fs = require('fs');
const path = require('path');
const assert = require('assert');

// 1. Verify index.html content
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// Check breadcrumbs tab
assert.ok(indexHtml.includes('Phase-Wise Tasks'), 'index.html should have Phase-Wise Tasks in breadcrumb tab');
assert.ok(!indexHtml.includes('> Day-Wise Tasks<'), 'index.html should not have Day-Wise Tasks in breadcrumb tab');

// Check phase detail page top back button
assert.ok(indexHtml.includes('id="top-back-to-weekly-roadmap-btn"'), 'index.html must have top-back-to-weekly-roadmap-btn');
assert.ok(indexHtml.includes('Back to Weekly Roadmap'), 'index.html must have Back to Weekly Roadmap text');

// Check phase detail page bottom back button
assert.ok(indexHtml.includes('id="view-all-roadmap-btn"'), 'index.html must have view-all-roadmap-btn');

console.log('✅ index.html structure tests PASSED');

// 2. Verify app.js content
const appJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');

// Check Level 3 title in app.js
assert.ok(appJs.includes('Level 3: Month ${monthObj.month_number} Week ${weekObj.week_number} Phases'), 'app.js indicator should show Phases');
assert.ok(appJs.includes('navDays.textContent = `Week ${weekObj.week_number} Phases`'), 'app.js navDays should show Phases');
assert.ok(appJs.includes('Phase ${d.day_number}'), 'app.js phase cards should show Phase ${d.day_number}');

// Check conditional button labels
assert.ok(appJs.includes('Launch Phase <i class="ph ph-arrow-right"></i>'), 'app.js button should show Launch Phase');
assert.ok(appJs.includes('Continue Phase <i class="ph ph-arrow-right"></i>'), 'app.js button should show Continue Phase');
assert.ok(appJs.includes('Review Phase <i class="ph ph-arrow-right"></i>'), 'app.js button should show Review Phase');
assert.ok(appJs.includes('Take Assessment <i class="ph ph-note-pencil"></i>'), 'app.js button should show Take Assessment');

// Check returnToWeeklyRoadmap function
assert.ok(appJs.includes('function returnToWeeklyRoadmap()'), 'app.js must define returnToWeeklyRoadmap()');
assert.ok(appJs.includes('renderDayView(roadmap, targetMonth, targetWeek)'), 'returnToWeeklyRoadmap must call renderDayView with targetMonth and targetWeek');

console.log('✅ js/app.js structure tests PASSED');
console.log('🎉 ALL ROADMAP & BUTTON VERIFICATIONS PASSED SUCCESSFULLY!');
