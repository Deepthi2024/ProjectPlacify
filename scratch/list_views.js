const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('class="view-section') || line.includes("class='view-section'") || /id="view-/.test(line)) {
    console.log(idx + 1, line.trim());
  }
});
