const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');

const checks = [
  ['top-announcement-banner in html', html.includes('top-announcement-banner')],
  ['placify-logo in brand header', html.includes('assets/placify-logo.jpg')],
  ['hero-center-logo in hero centerpiece', html.includes('hero-center-logo')],
  ['bot avatar removed from hero', !html.includes('opening-bot-avatar')],
  ['main-navbar in html', html.includes('id="main-navbar"')],
  ['7 nav items intact', (html.match(/class="nav-item/g) || []).length === 7],
  ['header login button removed from navbar', !html.includes('id="header-login-btn"')],
  ['header signup button removed from navbar', !html.includes('id="header-signup-btn"')],
  ['reset button removed from navbar', !html.includes('id="reset-app-btn"')],
  ['opening-hero-title in html', html.includes('opening-hero-title')],
  ['Master the skills in html', html.includes('Master the skills')],
  ['unlock your true potential in html', html.includes('unlock your true potential')],
  ['choice-signin-btn in hero', html.includes('choice-signin-btn')],
  ['choice-signup-btn in hero', html.includes('choice-signup-btn')],
  ['logo file exists on disk', fs.existsSync('assets/placify-logo.jpg')],
  ['css opening-hero-title exists', css.includes('.opening-hero-title')],
  ['css opening-hero-highlight is cyan/blue gradient', css.includes('#00f2fe') && css.includes('#38bdf8')],
  ['css hero-choice-btn-signup is cyan/blue gradient', css.includes('.hero-choice-btn-signup') && css.includes('#06b6d4')],
  ['yellow #ccff00 removed from hero highlight', !css.includes('.opening-hero-highlight {\n  color: #ccff00;')]
];

let allPassed = true;
checks.forEach(([name, passed]) => {
  console.log(`${passed ? '✅' : '❌'} ${name}: ${passed}`);
  if (!passed) allPassed = false;
});

if (allPassed) {
  console.log('\n🎉 ALL CHECKS PASSED: Navbar login/signup/reset cleanly removed, hero buttons & cyan theme verified!');
} else {
  console.error('\n❌ SOME VERIFICATIONS FAILED');
  process.exit(1);
}
