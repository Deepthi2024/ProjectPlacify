const fs = require('fs');

['js/app.js', 'frontend/js/app.js'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const isCrlf = content.includes('\r\n');
  const eol = isCrlf ? '\r\n' : '\n';

  const oldCode = `    Object.keys(views).forEach(k => {
      if (views[k]) {
        views[k].classList.remove('active');
      }
    });`;

  const newCode = `    Object.keys(views).forEach(k => {
      if (views[k]) {
        views[k].classList.remove('active');
      }
    });
    document.querySelectorAll('.page-context-help-card').forEach(c => c.remove());`;

  content = content.replace(oldCode.replace(/\r?\n/g, eol), newCode.replace(/\r?\n/g, eol));
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated switchView in ${filePath}`);
});
