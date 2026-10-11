const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// Helper to normalize and replace with preserving original CRLF/LF
function updateFile(filePath, searchStr, replaceStr) {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(rootDir, filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  const isCrlf = content.includes('\r\n');

  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedSearch = searchStr.replace(/\r\n/g, '\n');
  let normalizedReplace = replaceStr.replace(/\r\n/g, '\n');

  if (!normalizedContent.includes(normalizedSearch)) {
    throw new Error(`Target search string not found in ${filePath}`);
  }

  let updated = normalizedContent.replace(normalizedSearch, normalizedReplace);
  if (isCrlf) {
    updated = updated.replace(/\n/g, '\r\n');
  }

  fs.writeFileSync(fullPath, updated, 'utf8');
  console.log(`✓ Successfully updated ${filePath}`);
}

// -------------------------------------------------------------
// 1. UPDATE index.html and frontend/index.html
// -------------------------------------------------------------
const htmlSearch = `          <!-- Step A: Choose Preparation Day or Topic -->
          <div style="background: rgba(255,255,255,0.02); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-glass); margin-bottom: 1.5rem;">
            <h4 style="color: #fff; font-family: var(--font-heading); margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
              <i class="ph ph-calendar" style="color: var(--accent-cyan);"></i> Choose Interview Preparation Phase / Day
            </h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; align-items: center;">
              <div>
                <label for="interview-ext-phase-select" style="font-size: 0.82rem; color: var(--text-muted); display: block; margin-bottom: 0.3rem;"><i class="ph ph-calendar"></i> Roadmap Phase / Day:</label>
                <select id="interview-ext-phase-select" class="form-control" style="background: rgba(15, 23, 42, 0.8);">
                  <option value="">-- Select from your Roadmap Phases --</option>
                </select>
              </div>
              <div id="interview-ext-custom-topic-container">
                <label for="interview-ext-custom-topic" style="font-size: 0.82rem; color: var(--text-muted); display: block; margin-bottom: 0.3rem;"><i class="ph ph-pencil-simple"></i> Or Specific Topic / Concept:</label>
                <input type="text" id="interview-ext-custom-topic" class="form-control" placeholder="e.g. Asynchronous JavaScript, Closures, System Design">
              </div>
              <div>
                <label for="interview-ext-resource-type" style="font-size: 0.82rem; color: var(--text-muted); display: block; margin-bottom: 0.3rem;"><i class="ph ph-tag"></i> Resource Type:</label>
                <select id="interview-ext-resource-type" class="form-control" style="background: rgba(15, 23, 42, 0.8);">
                  <option value="all" selected>All Resource Types</option>
                  <option value="interview_questions">Interview Questions & Answers</option>
                  <option value="coding_practice">Coding Practice & Challenges</option>
                  <option value="tutorials">Tutorials & Concept Guides</option>
                  <option value="documentation">Official Documentation</option>
                  <option value="mock_interviews">Mock Interviews & Problem Kits</option>
                </select>
              </div>
              <div style="padding-top: 1.4rem;">
                <button type="button" id="interview-ext-fetch-resources-btn" class="btn btn-primary" style="width: 100%;">
                  <i class="ph ph-magnifying-glass"></i> Explore Resources
                </button>
              </div>
            </div>
          </div>`;

const htmlReplace = `          <!-- Step A: Explore Interview Resources -->
          <div style="background: rgba(255,255,255,0.02); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-glass); margin-bottom: 1.5rem;">
            <h4 style="color: #fff; font-family: var(--font-heading); margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
              <i class="ph ph-compass" style="color: var(--accent-cyan);"></i> Explore Interview Resources
            </h4>
            <div class="interview-ext-filter-grid">
              <div>
                <label for="interview-ext-resource-type" style="font-size: 0.82rem; color: var(--text-muted); display: block; margin-bottom: 0.4rem;"><i class="ph ph-tag"></i> Resource Type:</label>
                <select id="interview-ext-resource-type" class="form-control" style="background: rgba(15, 23, 42, 0.8);">
                  <option value="all" selected>All Resource Types</option>
                  <option value="interview_questions">Interview Questions & Answers</option>
                  <option value="coding_practice">Coding Practice & Challenges</option>
                  <option value="tutorials">Tutorials & Concept Guides</option>
                  <option value="documentation">Official Documentation</option>
                  <option value="mock_interviews">Mock Interviews & Problem Kits</option>
                </select>
              </div>
              <div>
                <button type="button" id="interview-ext-fetch-resources-btn" class="btn btn-primary" style="width: 100%; white-space: nowrap;">
                  <i class="ph ph-magnifying-glass"></i> Explore Resources
                </button>
              </div>
            </div>
          </div>`;

updateFile('frontend/index.html', htmlSearch, htmlReplace);
updateFile('index.html', htmlSearch, htmlReplace);

// -------------------------------------------------------------
// 2. UPDATE styles.css and frontend/styles.css
// -------------------------------------------------------------
const cssAddition = `
/* ==========================================================================
   Interview External Resources Form Layout
   ========================================================================== */

.interview-ext-filter-grid {
  display: grid;
  grid-template-columns: 1fr minmax(200px, auto);
  gap: 1.25rem;
  align-items: flex-end;
}

.interview-ext-filter-grid .form-control,
.interview-ext-filter-grid .btn {
  height: 44px;
  box-sizing: border-box;
}

@media (max-width: 640px) {
  .interview-ext-filter-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
`;

function appendCssIfMissing(filePath) {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(rootDir, filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  if (!content.includes('.interview-ext-filter-grid')) {
    const isCrlf = content.includes('\r\n');
    const toAppend = isCrlf ? cssAddition.replace(/\n/g, '\r\n') : cssAddition;
    fs.appendFileSync(fullPath, toAppend, 'utf8');
    console.log(`✓ Appended responsive layout styles to ${filePath}`);
  } else {
    console.log(`! Styles already present in ${filePath}`);
  }
}

appendCssIfMissing('frontend/styles.css');
appendCssIfMissing('styles.css');

// -------------------------------------------------------------
// 3. UPDATE js/app.js and frontend/js/app.js
// -------------------------------------------------------------
const jsSearchPhases = `    // Populate phase select for external resources
    const extPhaseSelect = document.getElementById('interview-ext-phase-select');
    if (extPhaseSelect) {
      extPhaseSelect.innerHTML = '';
      if (phases && phases.length > 0) {
        const generalOpt = document.createElement('option');
        generalOpt.value = 'all';
        generalOpt.textContent = '⚡ All Domain Topics (Comprehensive)';
        extPhaseSelect.appendChild(generalOpt);

        phases.forEach((p, idx) => {
          const opt = document.createElement('option');
          const pNum = p.phase || p.phase_number || idx + 1;
          const pTitle = p.title || p.topic || \`Phase \${pNum}\`;
          const topics = Array.isArray(p.focus_areas) ? p.focus_areas.join(', ') : (p.topic || '');
          opt.value = String(pNum);
          opt.dataset.title = pTitle;
          opt.dataset.topics = topics;
          opt.textContent = \`Phase \${pNum}: \${pTitle}\`;
          extPhaseSelect.appendChild(opt);
        });
      } else {
        const opt = document.createElement('option');
        opt.value = 'all';
        opt.textContent = \`General \${domainName} Core Topics\`;
        extPhaseSelect.appendChild(opt);
      }
    }`;

const jsReplacePhases = `    // Note: External resources phase dropdown removed in favor of direct domain resources`;

updateFile('frontend/js/app.js', jsSearchPhases, jsReplacePhases);
updateFile('js/app.js', jsSearchPhases, jsReplacePhases);

const jsSearchLogic = `    // -----------------------------------------------------------------------
    // Option 1 Logic: External Resources (Preserved unchanged)
    // -----------------------------------------------------------------------
    const loadExtBtn = document.getElementById('interview-ext-load-btn') || document.getElementById('interview-ext-fetch-resources-btn');
    if (loadExtBtn) {
      loadExtBtn.onclick = () => loadExternalResources();
    }
    const extFetchBtn = document.getElementById('interview-ext-fetch-resources-btn');
    if (extFetchBtn) {
      extFetchBtn.onclick = () => loadExternalResources();
    }
    if (extPhaseSelect) {
      extPhaseSelect.onchange = () => loadExternalResources();
    }
    const extResTypeSelect = document.getElementById('interview-ext-resource-type');
    if (extResTypeSelect) {
      extResTypeSelect.onchange = () => loadExternalResources();
    }

    async function loadExternalResources() {
      const container = document.getElementById('interview-external-cards-container');
      if (!container) return;

      let topic = '';
      const customTopic = (document.getElementById('interview-ext-custom-topic')?.value || '').trim();
      if (customTopic) {
        topic = customTopic;
      } else if (extPhaseSelect && extPhaseSelect.value !== 'all') {
        const selectedOpt = extPhaseSelect.selectedOptions[0];
        topic = selectedOpt ? \`\${selectedOpt.dataset.title || ''} \${selectedOpt.dataset.topics || ''}\`.trim() : '';
      }

      const resType = document.getElementById('interview-ext-resource-type')?.value || 'all';

      const topicLabel = document.getElementById('ext-current-topic-label');
      if (topicLabel) {
        topicLabel.textContent = topic || \`\${domainName} Core Topics\`;
      }

      container.innerHTML = \`
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <div class="spinner" style="margin: 0 auto 1rem; width: 36px; height: 36px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--accent-cyan); border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          <p style="font-size: 0.95rem;">Finding verified interview questions & preparation platforms for <strong>\${escapeHtml(domainName)}</strong>...</p>
        </div>
      \`;

      try {
        const url = \`http://localhost:5000/api/interview-resources?domain=\${encodeURIComponent(domainName)}&topic=\${encodeURIComponent(topic)}&level=\${encodeURIComponent(userLevel)}&resource_type=\${encodeURIComponent(resType)}\`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(\`Server returned status \${res.status}\`);
        const data = await res.json();
        let resources = data.resources || [];

        if (resType !== 'all') {
          const typeKeywords = {
            'interview_questions': ['interview', 'question', 'q&a'],
            'coding_practice': ['coding', 'problem', 'algorithm', 'challenge', 'practice'],
            'tutorials': ['tutorial', 'guide', 'learn'],
            'documentation': ['doc', 'reference', 'specification', 'manual'],
            'mock_interviews': ['track', 'kit', 'mock', 'assessment']
          }[resType] || [];

          if (typeKeywords.length > 0) {
            const filtered = resources.filter(r => {
              const text = \`\${r.name} \${r.category || ''} \${r.description || ''}\`.toLowerCase();
              return typeKeywords.some(k => text.includes(k));
            });
            if (filtered.length > 0) resources = filtered;
          }
        }

        if (resources.length === 0) {
          container.innerHTML = \`
            <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; background: rgba(255,255,255,0.02); border-radius: var(--radius-md); border: 1px dashed var(--border-glass);">
              <i class="ph ph-magnifying-glass" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 0.8rem;"></i>
              <h4 style="color: #fff; margin-bottom: 0.4rem;">No matching resources in catalog</h4>
              <p style="color: var(--text-muted); font-size: 0.88rem;">Try selecting a different phase or adjusting your topic / resource filter.</p>
            </div>
          \`;
          return;
        }

        container.innerHTML = resources.map(r => \`
          <div class="glass-card" style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s ease, border-color 0.2s ease; border: 1px solid var(--border-glass);">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.8rem; margin-bottom: 0.8rem;">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: rgba(6, 182, 212, 0.12); display: flex; align-items: center; justify-content: center; color: var(--accent-cyan); font-size: 1.25rem;">
                    <i class="ph \${r.icon || 'ph-globe'}"></i>
                  </div>
                  <h4 style="color: #fff; font-family: var(--font-heading); font-size: 1.05rem; margin: 0;">\${escapeHtml(r.name)}</h4>
                </div>
                <span style="font-size: 0.72rem; font-weight: 700; color: var(--accent-cyan); background: rgba(6, 182, 212, 0.12); padding: 0.2rem 0.6rem; border-radius: var(--radius-full); border: 1px solid rgba(6, 182, 212, 0.3); text-transform: uppercase;">
                  \${escapeHtml(r.recommended_category || r.category || 'Interview Prep')}
                </span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.45; margin-bottom: 0.9rem;">\${escapeHtml(r.description)}</p>
              <div style="background: rgba(255,255,255,0.03); padding: 0.8rem; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.05); margin-bottom: 1.2rem;">
                <div style="font-size: 0.72rem; font-weight: 700; color: var(--accent-emerald); text-transform: uppercase; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.3rem;">
                  <i class="ph ph-sparkle"></i> Why this resource:
                </div>
                <div style="font-size: 0.8rem; color: rgba(255,255,255,0.85); line-height: 1.4;">\${escapeHtml(r.why_relevant || r.whyRelevant || \`Curated high-yield preparation platform covering \${topic || 'domain concepts'}.\`)}</div>
              </div>
            </div>
            <a href="\${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="width: 100%; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 600;">
              Visit Website <i class="ph ph-arrow-square-out"></i>
            </a>
          </div>
        \`).join('');`;

const jsReplaceLogic = `    // -----------------------------------------------------------------------
    // Option 1 Logic: External Resources
    // -----------------------------------------------------------------------
    const loadExtBtn = document.getElementById('interview-ext-load-btn') || document.getElementById('interview-ext-fetch-resources-btn');
    if (loadExtBtn) {
      loadExtBtn.onclick = () => loadExternalResources();
    }
    const extFetchBtn = document.getElementById('interview-ext-fetch-resources-btn');
    if (extFetchBtn) {
      extFetchBtn.onclick = () => loadExternalResources();
    }
    const extResTypeSelect = document.getElementById('interview-ext-resource-type');
    if (extResTypeSelect) {
      extResTypeSelect.onchange = () => loadExternalResources();
    }

    async function loadExternalResources() {
      const container = document.getElementById('interview-external-cards-container');
      if (!container) return;

      const resType = document.getElementById('interview-ext-resource-type')?.value || 'all';

      const topicLabel = document.getElementById('ext-current-topic-label');
      if (topicLabel) {
        topicLabel.textContent = domainName;
      }

      container.innerHTML = \`
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <div class="spinner" style="margin: 0 auto 1rem; width: 36px; height: 36px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--accent-cyan); border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          <p style="font-size: 0.95rem;">Finding verified interview questions & preparation platforms for <strong>\${escapeHtml(domainName)}</strong>...</p>
        </div>
      \`;

      try {
        const url = \`http://localhost:5000/api/interview-resources?domain=\${encodeURIComponent(domainName)}&topic=\${encodeURIComponent(domainName)}&level=\${encodeURIComponent(userLevel)}&resource_type=\${encodeURIComponent(resType)}\`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(\`Server returned status \${res.status}\`);
        const data = await res.json();
        let resources = data.resources || [];

        if (resType !== 'all') {
          const typeKeywords = {
            'interview_questions': ['interview', 'question', 'q&a'],
            'coding_practice': ['coding', 'problem', 'algorithm', 'challenge', 'practice'],
            'tutorials': ['tutorial', 'guide', 'learn'],
            'documentation': ['doc', 'reference', 'specification', 'manual'],
            'mock_interviews': ['track', 'kit', 'mock', 'assessment']
          }[resType] || [];

          if (typeKeywords.length > 0) {
            const filtered = resources.filter(r => {
              const text = \`\${r.name} \${r.category || ''} \${r.description || ''}\`.toLowerCase();
              return typeKeywords.some(k => text.includes(k));
            });
            if (filtered.length > 0) resources = filtered;
          }
        }

        if (resources.length === 0) {
          container.innerHTML = \`
            <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; background: rgba(255,255,255,0.02); border-radius: var(--radius-md); border: 1px dashed var(--border-glass);">
              <i class="ph ph-magnifying-glass" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 0.8rem;"></i>
              <h4 style="color: #fff; margin-bottom: 0.4rem;">No matching resources in catalog</h4>
              <p style="color: var(--text-muted); font-size: 0.88rem;">Try adjusting your resource type filter.</p>
            </div>
          \`;
          return;
        }

        container.innerHTML = resources.map(r => \`
          <div class="glass-card" style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s ease, border-color 0.2s ease; border: 1px solid var(--border-glass);">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.8rem; margin-bottom: 0.8rem;">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: rgba(6, 182, 212, 0.12); display: flex; align-items: center; justify-content: center; color: var(--accent-cyan); font-size: 1.25rem;">
                    <i class="ph \${r.icon || 'ph-globe'}"></i>
                  </div>
                  <h4 style="color: #fff; font-family: var(--font-heading); font-size: 1.05rem; margin: 0;">\${escapeHtml(r.name)}</h4>
                </div>
                <span style="font-size: 0.72rem; font-weight: 700; color: var(--accent-cyan); background: rgba(6, 182, 212, 0.12); padding: 0.2rem 0.6rem; border-radius: var(--radius-full); border: 1px solid rgba(6, 182, 212, 0.3); text-transform: uppercase;">
                  \${escapeHtml(r.recommended_category || r.category || 'Interview Prep')}
                </span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.45; margin-bottom: 0.9rem;">\${escapeHtml(r.description)}</p>
              <div style="background: rgba(255,255,255,0.03); padding: 0.8rem; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.05); margin-bottom: 1.2rem;">
                <div style="font-size: 0.72rem; font-weight: 700; color: var(--accent-emerald); text-transform: uppercase; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.3rem;">
                  <i class="ph ph-sparkle"></i> Why this resource:
                </div>
                <div style="font-size: 0.8rem; color: rgba(255,255,255,0.85); line-height: 1.4;">\${escapeHtml(r.why_relevant || r.whyRelevant || \`Curated high-yield preparation platform covering \${domainName} concepts.\`)}</div>
              </div>
            </div>
            <a href="\${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="width: 100%; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 600;">
              Visit Website <i class="ph ph-arrow-square-out"></i>
            </a>
          </div>
        \`).join('');`;

updateFile('frontend/js/app.js', jsSearchLogic, jsReplaceLogic);
updateFile('js/app.js', jsSearchLogic, jsReplaceLogic);

// -------------------------------------------------------------
// 4. UPDATE backend/server.js and server.js
// -------------------------------------------------------------
const serverSearchCleanTopic = `  // Curated Resource Helper for Interview Prep
  function getCuratedInterviewResources(domain, topic) {
    const dLower = String(domain || 'fullstack').toLowerCase();
    const tLower = String(topic || '').toLowerCase();
    const cleanTopic = topic || 'Technical Concepts';`;

const serverReplaceCleanTopic = `  // Curated Resource Helper for Interview Prep
  function getCuratedInterviewResources(domain, topic) {
    const dLower = String(domain || 'fullstack').toLowerCase();
    const tLower = String(topic || '').toLowerCase();
    const cleanTopic = (topic && topic.trim() && topic !== 'Core Concepts') ? topic.trim() : (domain || 'Technical Concepts');`;

updateFile('backend/server.js', serverSearchCleanTopic, serverReplaceCleanTopic);
updateFile('server.js', serverSearchCleanTopic, serverReplaceCleanTopic);

const serverSearchRoute = `  // 1. GET Curated Interview Resources
  if (req.method === 'GET' && parsedUrl.pathname === '/api/interview-resources') {
    try {
      const q = parsedUrl.query || {};
      const domain = q.domain || 'fullstack';
      const topic = q.topic || 'Core Concepts';
      const resources = getCuratedInterviewResources(domain, topic);
      return sendJSON(res, 200, { success: true, domain, topic, resources });
    } catch (err) {
      return sendJSON(res, 500, { error: 'Failed to get interview resources: ' + err.message });
    }
  }`;

const serverReplaceRoute = `  // 1. GET Curated Interview Resources
  if (req.method === 'GET' && parsedUrl.pathname === '/api/interview-resources') {
    try {
      const q = parsedUrl.query || {};
      const domain = q.domain || 'fullstack';
      const topic = q.topic || domain || 'Core Concepts';
      const resources = getCuratedInterviewResources(domain, topic);
      return sendJSON(res, 200, { success: true, domain, topic, resources });
    } catch (err) {
      return sendJSON(res, 500, { error: 'Failed to get interview resources: ' + err.message });
    }
  }`;

updateFile('backend/server.js', serverSearchRoute, serverReplaceRoute);
updateFile('server.js', serverSearchRoute, serverReplaceRoute);

console.log('\nAll files successfully updated and synchronized!');
