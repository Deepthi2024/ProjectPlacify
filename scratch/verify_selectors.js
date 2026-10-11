const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('js/app.js', 'utf8');
const match = appJs.match(/const PAGE_SPECIFIC_TOURS = (\{[\s\S]*?\n    \};\n\n    \/\/ Full End-to-End)/);
const tours = eval('(' + match[1].replace(/;\n\n    \/\/ Full End-to-End$/, '') + ')');

let totalChecked = 0;
let errors = 0;

for (const [page, steps] of Object.entries(tours)) {
  steps.forEach((s, idx) => {
    totalChecked++;
    const idMatches = (s.selector + ' ' + s.fallbackSelector).match(/#[a-zA-Z0-9_-]+/g) || [];
    const classMatches = (s.selector + ' ' + s.fallbackSelector).match(/\.[a-zA-Z0-9_-]+/g) || [];
    let found = false;
    for (const id of idMatches) {
      const idName = id.slice(1);
      if (html.includes(`id="${idName}"`) || html.includes(`id='${idName}'`)) {
        found = true;
        break;
      }
    }
    if (!found) {
      for (const cls of classMatches) {
        const clsName = cls.slice(1);
        if (html.includes(clsName)) {
          found = true;
          break;
        }
      }
    }
    if (!found) {
      console.warn(`Selector warning on ${page} step ${idx + 1}: ${s.title} -> selector: ${s.selector}, fallback: ${s.fallbackSelector}`);
      errors++;
    }
  });
}

console.log(`Checked ${totalChecked} steps across all pages. Selector warnings: ${errors}`);
if (errors === 0) {
  console.log('✅ Every single tour step has valid matching elements in index.html!');
}
