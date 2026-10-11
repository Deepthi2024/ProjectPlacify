const fs = require('fs');

console.log('--- Applying Contextual Page Guide Enhancements ---');

// 1. Update HTML files: index.html & frontend/index.html
['index.html', 'frontend/index.html'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const isCrlf = content.includes('\r\n');
  const eol = isCrlf ? '\r\n' : '\n';

  // Add button to Domain Selection if not present
  if (!content.includes('data-page-help="domainSelection"')) {
    const oldDomTitle = `<div class="section-title">
          <i class="ph ph-compass"></i> Choose Your Learning Domain
        </div>`;
    const newDomTitle = `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.75rem;">
          <div class="section-title" style="margin-bottom: 0;">
            <i class="ph ph-compass"></i> Choose Your Learning Domain
          </div>
          <button type="button" class="page-context-help-btn" data-page-help="domainSelection" title="What can I do in Domain Selection?">
            <i class="ph ph-question"></i> What can I do here?
          </button>
        </div>`;
    content = content.replace(oldDomTitle.replace(/\r?\n/g, eol), newDomTitle.replace(/\r?\n/g, eol));
    console.log(`Added domainSelection button to ${filePath}`);
  }

  // Add button to Diagnostic setup if not present
  if (!content.includes('data-page-help="diagnostic"')) {
    const oldDiagBadge = `<div
            id="diagnostic-concept-count-badge"
            style="background: rgba(139, 92, 246, 0.15); color: var(--accent-violet); padding: 0.4rem 0.8rem; border-radius: 50px; font-size: 0.85rem; font-weight: 700;">
            Technical Diagnostic Quiz
          </div>`;
    const newDiagBadge = `<div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
            <button type="button" class="page-context-help-btn" data-page-help="diagnostic" title="What can I do in Phase 2 Setup?">
              <i class="ph ph-question"></i> What can I do here?
            </button>
            <div
              id="diagnostic-concept-count-badge"
              style="background: rgba(139, 92, 246, 0.15); color: var(--accent-violet); padding: 0.4rem 0.8rem; border-radius: 50px; font-size: 0.85rem; font-weight: 700;">
              Technical Diagnostic Quiz
            </div>
          </div>`;
    content = content.replace(oldDiagBadge.replace(/\r?\n/g, eol), newDiagBadge.replace(/\r?\n/g, eol));
    console.log(`Added diagnostic button to ${filePath}`);
  }

  // Add button to Assessment Report if not present
  if (!content.includes('data-page-help="assessmentReport"')) {
    const oldReportTitle = `<div class="section-title" style="margin-bottom: 1.5rem;">
          <i class="ph ph-chart-polar"></i>
          Phase 2 Output: Diagnostic Evaluation & Topic-Wise Proficiency Report
        </div>`;
    const newReportTitle = `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.75rem;">
          <div class="section-title" style="margin-bottom: 0;">
            <i class="ph ph-chart-polar"></i>
            Phase 2 Output: Diagnostic Evaluation & Topic-Wise Proficiency Report
          </div>
          <button type="button" class="page-context-help-btn" data-page-help="assessmentReport" title="What can I do in Assessment Report?">
            <i class="ph ph-question"></i> What can I do here?
          </button>
        </div>`;
    content = content.replace(oldReportTitle.replace(/\r?\n/g, eol), newReportTitle.replace(/\r?\n/g, eol));
    console.log(`Added assessmentReport button to ${filePath}`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
});

// 2. Update styles.css & frontend/styles.css
const updatedStylesBlock = `/* Page Contextual Help Button ("What can I do here?") */
.page-context-help-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(6, 182, 212, 0.28);
  color: var(--accent-cyan);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.32rem 0.8rem;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  white-space: nowrap;
}

.page-context-help-btn:hover {
  background: rgba(6, 182, 212, 0.14);
  border-color: var(--accent-cyan);
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 0 12px rgba(6, 182, 212, 0.2);
}

.page-context-help-btn i {
  font-size: 0.95rem;
}

/* Contextual Help Banner Card (Matches Roadmap Navigation Guide Screenshot) */
.page-context-help-card {
  background: linear-gradient(135deg, rgba(11, 17, 32, 0.96) 0%, rgba(15, 23, 42, 0.98) 100%);
  border: 1px solid rgba(6, 182, 212, 0.35);
  border-radius: 14px;
  padding: 1.35rem 1.6rem;
  margin-bottom: 1.6rem;
  animation: contextGuideFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  position: relative;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.5), 0 0 24px rgba(6, 182, 212, 0.1);
  backdrop-filter: blur(14px);
  z-index: 10;
}

@keyframes contextGuideFadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.context-guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 0.85rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0.75rem;
}

.context-guide-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.context-guide-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border: 1px solid rgba(6, 182, 212, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-cyan);
  font-size: 1.25rem;
  flex-shrink: 0;
}

.context-guide-title {
  color: #fff;
  font-size: 1.15rem;
  font-weight: 700;
  font-family: var(--font-heading);
  margin: 0;
  line-height: 1.2;
}

.context-guide-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--accent-cyan);
  background: rgba(6, 182, 212, 0.12);
  border: 1px solid rgba(6, 182, 212, 0.25);
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
  margin-top: 0.25rem;
}

.context-guide-header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.guide-banner-open-full-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.35rem 0.85rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: inherit;
}

.guide-banner-open-full-btn:hover {
  background: rgba(6, 182, 212, 0.15);
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
  transform: translateY(-1px);
}

.guide-banner-close-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  padding: 0.3rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guide-banner-close-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.context-guide-purpose {
  color: #cbd5e1;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 1.1rem 0;
}

.page-context-help-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.15rem;
}

@media (max-width: 960px) {
  .page-context-help-grid {
    grid-template-columns: 1fr;
    gap: 0.9rem;
  }
}

.page-context-help-item {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: 2.5px solid var(--accent-cyan);
  border-radius: 10px;
  padding: 1.1rem 1.25rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.page-context-help-item:hover {
  transform: translateY(-2px);
  border-color: rgba(6, 182, 212, 0.35);
}

.page-context-help-item.highlight-next {
  border-top-color: var(--accent-violet);
}

.context-guide-card-head {
  color: var(--accent-cyan);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 0.65rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.page-context-help-item.highlight-next .context-guide-card-head {
  color: var(--accent-violet);
}

.context-guide-card-body {
  color: #e2e8f0;
  font-size: 0.85rem;
  line-height: 1.55;
  flex: 1;
}

.context-guide-card-body p {
  margin: 0 0 0.5rem 0;
}

.context-guide-card-body p:last-child {
  margin-bottom: 0;
}

.context-guide-list {
  margin: 0;
  padding-left: 1.2rem;
  color: #cbd5e1;
}

.context-guide-list li {
  margin-bottom: 0.45rem;
}

.context-guide-list li:last-child {
  margin-bottom: 0;
}`;

['styles.css', 'frontend/styles.css'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const isCrlf = content.includes('\r\n');
  const eol = isCrlf ? '\r\n' : '\n';

  const startMarker = '/* Page Contextual Help Button ("What can I do here?") */';
  const endMarker = '/* Guide Modal Dialog & Tabs */';

  const sIdx = content.indexOf(startMarker);
  const eIdx = content.indexOf(endMarker);
  if (sIdx !== -1 && eIdx !== -1) {
    const formatted = isCrlf ? updatedStylesBlock.replace(/\r?\n/g, '\r\n') : updatedStylesBlock.replace(/\r?\n/g, '\n');
    content = content.slice(0, sIdx) + formatted + eol + eol + content.slice(eIdx);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated contextual guide styles in ${filePath}`);
  } else {
    console.warn(`Markers not found in ${filePath}`);
  }
});

// 3. Update js/app.js & frontend/js/app.js
['js/app.js', 'frontend/js/app.js'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const isCrlf = content.includes('\r\n');
  const eol = isCrlf ? '\r\n' : '\n';

  // Replace PAGE_HELP_DEFINITIONS and the button handler section
  const startSectionMarker = '// VIEW 15: INTERACTIVE USER NAVIGATION GUIDE & GUIDED TOUR SYSTEM';
  const endSectionMarker = '// STEP-BY-STEP INTERACTIVE GUIDED TOUR ENGINE';

  const sIdx = content.indexOf(startSectionMarker);
  const eIdx = content.indexOf(endSectionMarker);

  if (sIdx === -1 || eIdx === -1) {
    console.error(`Markers not found in ${filePath}`);
    return;
  }

  const newHelpEngineCode = `// VIEW 15: INTERACTIVE USER NAVIGATION GUIDE & GUIDED TOUR SYSTEM
  // =========================================================================

  const PAGE_HELP_DEFINITIONS = {
    roadmap: {
      title: 'Roadmap Navigation Guide',
      icon: 'ph-map-trifold',
      purpose: 'Your personalized master learning curriculum generated specifically for your selected domain and diagnostic skill level.',
      actions: [
        'Explore your multi-phase milestones, monthly themes, and weekly breakdown topics.',
        'Switch between Roadmap Timeline view and Task Calendar view to plan your learning schedule.',
        'Use "Start My Journey" to anchor milestones to calendar dates, or "Launch Phase" / "Continue Phase" to open your active phase.',
        'Click individual task items to inspect prerequisite topics and launch directly into the Daily Hub.'
      ],
      impact: 'Eliminates guesswork by guiding you through comprehensive prerequisite foundations tested by technical interviewers, organizing your preparation from core fundamentals to system design.',
      nextStep: 'Open your current active phase, review its learning objectives, and continue to Daily Hub to begin today\\'s assigned tasks.'
    },

    dailyHub: {
      title: 'Daily Hub Navigation Guide',
      icon: 'ph-calendar-check',
      purpose: 'Your active daily study workbench for studying focus topics, watching curated video chapters, and completing practical exercises.',
      actions: [
        'Locate today\\'s assigned learning tasks, focus topic, and curated video resources.',
        'Study the recommended chapter clips and official documentation provided for each task.',
        'Execute the required implementation or practice exercises in your local editor.',
        'Click the task completion button to verify and mark your task done, earning XP and advancing your streak.'
      ],
      impact: 'Builds daily study consistency, reinforces active recall through hands-on practice, and unlocks phase-level assessments as you complete all tasks in a phase.',
      nextStep: 'Work through today\\'s assigned tasks and resources, then click the completion button to update your roadmap progress.'
    },

    interviewQuestions: {
      title: 'Interview Preparation Guide',
      icon: 'ph-chats-circle',
      purpose: 'Domain-tailored technical, coding, and behavioral interview preparation powered by Groq AI and curated external resources.',
      actions: [
        'Explore curated external interview preparation resources, cheatsheets, and coding platforms for your domain.',
        'Generate AI-curated batches of 5 domain-specific interview questions with comprehensive model answers.',
        'Study question rationales, technical keywords, and common interview evaluation criteria.',
        'Practice answering questions out loud to develop crisp technical articulation.'
      ],
      impact: 'Builds fluent technical recall, familiarizes you with real interview question patterns, and prepares you for technical screening rounds and system design evaluations.',
      nextStep: 'Explore a curated external resource or generate a fresh batch of 5 practice questions and review the model answers.'
    },

    techNews: {
      title: 'Tech News Navigation Guide',
      icon: 'ph-newspaper',
      purpose: 'Real-time technology news aggregated from Hacker News, Dev.to, Google News, and Tavily, curated for your domain.',
      actions: [
        'Browse the latest technology news articles and industry developments filtered for your tech domain.',
        'Identify emerging tools, framework updates, architecture trends, and hiring industry shifts.',
        'Click external article links to read full articles and community discussions on original publisher sites.'
      ],
      impact: 'Develops broad tech literacy, keeps your technical stack current, and provides authentic talking points during hiring manager and behavioral rounds.',
      nextStep: 'Read a relevant article in your domain and note how current industry trends relate to your technical interview preparation.'
    },

    progressAnalytics: {
      title: 'Learning Analytics Guide',
      icon: 'ph-chart-bar-horizontal',
      purpose: 'Real-time progress dashboard tracking your placement preparation velocity, XP gain, mastery tier, and retention.',
      actions: [
        'Track your overall domain mastery percentage, current study streak, and total XP earned across completed tasks.',
        'Review your diagnostic assessment scorecard and track progression from Beginner to Advanced.',
        'Identify knowledge gaps and weak topics highlighted from previous diagnostic assessments.',
        'Analyze your preparation consistency and velocity toward target placement dates.'
      ],
      impact: 'Provides objective, data-driven feedback on your placement readiness, highlighting exact areas to revise before campus hiring assessments.',
      nextStep: 'Review your available metrics and return to weak topics on your Roadmap if revision is needed before moving forward.'
    },

    internships: {
      title: 'Internship Discovery Guide',
      icon: 'ph-briefcase',
      purpose: 'Curated real-time job and internship listings filtered by your tech domain and location preference.',
      actions: [
        'Browse and filter active internship openings by keyword, role title, and technical domain.',
        'Review role descriptions, required qualifications, eligibility criteria, and hiring companies.',
        'Click "Apply on Employer Site" to open external company application portals.',
        'Note: Opening an application link does not automatically record submission—you must confirm it in Placify.'
      ],
      impact: 'Bridges your placement preparation directly to active employment opportunities, helping you secure real-world software engineering internships.',
      nextStep: 'Review a suitable opportunity, follow external employer instructions to apply, and confirm submission to track it in My Applications.'
    },

    myApplications: {
      title: 'My Applications Guide',
      icon: 'ph-kanban',
      purpose: 'Personal Application Tracking System (ATS) to organize and monitor your confirmed job and internship recruitment pipelines.',
      actions: [
        'View all recorded applications across recruitment stages: Applied, Assessment, Interview, Offer, and Rejected.',
        'Update application status stages and record interview dates, recruiter notes, and assessment deadlines.',
        'Monitor total applications submitted and active candidate conversion metrics.'
      ],
      impact: 'Prevents missed deadlines, keeps multiple recruitment processes organized, and ensures structured preparation for each hiring round.',
      nextStep: 'Review pending application updates, follow up on upcoming assessment deadlines, and maintain accurate application statuses.'
    },

    domainSelection: {
      title: 'Learning Setup Guide',
      icon: 'ph-compass',
      purpose: 'First step in your personalized journey: select the engineering specialization that matches your placement goals.',
      actions: [
        'Review available tech domains (Full-Stack, Data Science, AI/ML, Cloud & DevOps, Mobile, Cyber Security).',
        'Compare domain market demand, prerequisite concepts, and placement salary benchmarks.',
        'Select your target domain and click "Continue with Selected Domain".'
      ],
      impact: 'Aligns your personalized roadmap, daily tasks, interview questions, and internship recommendations to industry roles in your chosen field.',
      nextStep: 'Select your target learning domain and proceed to Phase 2 to set up your diagnostic baseline.'
    },

    diagnostic: {
      title: 'Learning Setup Guide',
      icon: 'ph-clipboard-text',
      purpose: 'Declare your starting proficiency baseline and optionally take the AI diagnostic assessment to calibrate your roadmap.',
      actions: [
        'Select your self-assessed starting proficiency level: Beginner, Intermediate, or Advanced.',
        'Inspect the visible roadmap syllabus topics tailored to your chosen domain and proficiency level.',
        'Choose whether to validate your baseline with our 15-question AI Diagnostic Quiz or generate your roadmap directly.'
      ],
      impact: 'Calibrates roadmap difficulty to your true starting competence, ensuring you do not waste time on mastered basics or get overwhelmed by advanced topics.',
      nextStep: 'Select your baseline proficiency level, complete the diagnostic quiz or skip to roadmap, and continue to your curriculum.'
    },

    assessmentReport: {
      title: 'Learning Setup Guide',
      icon: 'ph-chart-polar',
      purpose: 'Diagnostic evaluation scorecard identifying your verified skill tier, knowledge gaps, and baseline score.',
      actions: [
        'Review your established baseline score and verified tier (Beginner, Intermediate, Advanced).',
        'Inspect identified knowledge gaps (Weak topics) and applied skills (Intermediate/Mastered topics).',
        'Click "Generate Personalized Roadmap" or "Continue Journey" to build a curriculum targeting your gaps.'
      ],
      impact: 'Directs extra study time and targeted resources toward your exact conceptual weaknesses before interview season.',
      nextStep: 'Review your gap report and proceed to your Personalized Roadmap to begin Phase 1.'
    },

    default: {
      title: 'Placify AI Navigation Guide',
      icon: 'ph-info',
      purpose: 'Contextual navigation guide for this section of Placify AI.',
      actions: [
        'Use the top navigation bar to access Roadmap, Daily Hub, Interview Prep, Tech News, Analytics, and Internships.',
        'Use the floating AI Assistant on eligible pages for instant domain mentoring and questions.'
      ],
      impact: 'Empowers you with a structured, end-to-end framework for placement preparation and technical career growth.',
      nextStep: 'Explore the active page features or return to your Roadmap to continue your learning journey.'
    }
  };

  // Reusable Contextual Page Guide Component
  const ContextualPageGuide = {
    definitions: PAGE_HELP_DEFINITIONS,

    getDefinition(pageKey) {
      if (pageKey && this.definitions[pageKey]) {
        return this.definitions[pageKey];
      }
      const currentView = (typeof getRequestedViewFromUrl === 'function') ? getRequestedViewFromUrl() : 'roadmap';
      if (this.definitions[currentView]) {
        return this.definitions[currentView];
      }
      return this.definitions.default || this.definitions.roadmap;
    },

    formatCardContent(content) {
      if (Array.isArray(content)) {
        return \`<ul class="context-guide-list">\${content.map(c => \`<li>\${c}</li>\`).join('')}</ul>\`;
      }
      const str = String(content || '').trim();
      if (str.includes('\\n- ') || str.includes('\\n• ')) {
        const items = str.split(/\\n[-•]\\s*/).filter(Boolean);
        return \`<ul class="context-guide-list">\${items.map(item => \`<li>\${item}</li>\`).join('')}</ul>\`;
      }
      return \`<p>\${str.replace(/\\n\\n/g, '</p><p>').replace(/\\n/g, '<br/>')}</p>\`;
    },

    render(pageKey) {
      const def = this.getDefinition(pageKey);
      const banner = document.createElement('div');
      banner.className = 'page-context-help-card';
      banner.id = 'active-contextual-guide';
      banner.setAttribute('role', 'region');
      banner.setAttribute('aria-label', def.title);

      banner.innerHTML = \`
        <div class="context-guide-header">
          <div class="context-guide-header-left">
            <div class="context-guide-icon-box">
              <i class="ph \${def.icon || 'ph-compass'}"></i>
            </div>
            <div>
              <h4 class="context-guide-title">\${def.title}</h4>
              <span class="context-guide-badge">Contextual Page Guide</span>
            </div>
          </div>
          <div class="context-guide-header-actions">
            <button type="button" class="btn btn-secondary guide-banner-open-full-btn" title="Open Complete Placify Guide">
              <i class="ph ph-book-open"></i> Full Guide
            </button>
            <button type="button" class="guide-banner-close-btn" title="Close Guide" aria-label="Close Guide">
              <i class="ph ph-x"></i>
            </button>
          </div>
        </div>

        <p class="context-guide-purpose">\${def.purpose}</p>

        <div class="page-context-help-grid">
          <!-- CARD 1: KEY ACTIONS -->
          <div class="page-context-help-item">
            <div class="context-guide-card-head">
              <i class="ph ph-lightning"></i>
              <span>KEY ACTIONS</span>
            </div>
            <div class="context-guide-card-body">
              \${this.formatCardContent(def.actions)}
            </div>
          </div>

          <!-- CARD 2: CAREER IMPACT -->
          <div class="page-context-help-item">
            <div class="context-guide-card-head">
              <i class="ph ph-trend-up"></i>
              <span>CAREER IMPACT</span>
            </div>
            <div class="context-guide-card-body">
              \${this.formatCardContent(def.impact)}
            </div>
          </div>

          <!-- CARD 3: RECOMMENDED NEXT STEP -->
          <div class="page-context-help-item highlight-next">
            <div class="context-guide-card-head">
              <i class="ph ph-arrow-circle-right"></i>
              <span>RECOMMENDED NEXT STEP</span>
            </div>
            <div class="context-guide-card-body">
              \${this.formatCardContent(def.nextStep)}
            </div>
          </div>
        </div>
      \`;

      // Event Listeners
      const guideModal = document.getElementById('placify-guide-modal');
      banner.querySelector('.guide-banner-close-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        banner.remove();
      });

      banner.querySelector('.guide-banner-open-full-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        banner.remove();
        if (guideModal) guideModal.style.display = 'flex';
      });

      return banner;
    },

    toggle(pageKey, btn) {
      const section = btn.closest('.view-section');
      if (!section) return;

      // Check if this exact guide is already open in this section
      const existingInCurrentSection = section.querySelector('.page-context-help-card');
      if (existingInCurrentSection) {
        existingInCurrentSection.remove();
        return;
      }

      // Remove any existing banners in other sections so there are never duplicates
      document.querySelectorAll('.page-context-help-card').forEach(b => b.remove());

      const banner = this.render(pageKey);

      // Mount right after header row if button is in a header, else top of card/section
      const headerRow = btn.closest('[style*="display: flex"], [style*="display:flex"], .section-title-bar, .section-header');
      if (headerRow && headerRow.parentElement && headerRow.parentElement.closest('.view-section') === section) {
        headerRow.parentElement.insertBefore(banner, headerRow.nextSibling);
      } else {
        const card = section.querySelector('.glass-card');
        if (card) {
          const firstBlock = card.firstElementChild;
          if (firstBlock && firstBlock.nextElementSibling) {
            card.insertBefore(banner, firstBlock.nextElementSibling);
          } else {
            card.insertBefore(banner, card.firstChild);
          }
        } else {
          section.insertBefore(banner, section.firstChild);
        }
      }

      banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  window.ContextualPageGuide = ContextualPageGuide;

  function initPlacifyHelpAndTour() {
    const guideModal = document.getElementById('placify-guide-modal');
    const openGuideBtn = document.getElementById('open-help-guide-btn');
    const closeGuideBtn = document.getElementById('close-guide-modal-btn');
    const closeGuideBottomBtn = document.getElementById('guide-modal-close-bottom-btn');
    const startTourFromModalBtn = document.getElementById('start-tour-from-modal-btn');

    // Tab buttons inside guide modal
    const tabBtns = document.querySelectorAll('.guide-tab-btn');
    const tabContents = document.querySelectorAll('.guide-tab-content');

    // 1. Open/Close Guide Modal
    if (openGuideBtn && guideModal) {
      openGuideBtn.addEventListener('click', () => {
        guideModal.style.display = 'flex';
      });
    }

    function closeGuideModal() {
      if (guideModal) guideModal.style.display = 'none';
    }

    if (closeGuideBtn) closeGuideBtn.addEventListener('click', closeGuideModal);
    if (closeGuideBottomBtn) closeGuideBottomBtn.addEventListener('click', closeGuideModal);
    if (guideModal) {
      guideModal.addEventListener('click', (e) => {
        if (e.target === guideModal) closeGuideModal();
      });
    }

    // 2. Tab Switching inside Guide Modal
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        tabContents.forEach(content => {
          if (content.id === \`guide-tab-content-\${targetTab}\`) {
            content.style.display = 'block';
            content.classList.add('active');
          } else {
            content.style.display = 'none';
            content.classList.remove('active');
          }
        });
      });
    });

    // 3. "Where Should I Go?" Quick Navigation Cards
    document.querySelectorAll('.guide-goal-card').forEach(card => {
      card.addEventListener('click', () => {
        const action = card.dataset.action;
        const target = card.dataset.target;
        closeGuideModal();

        if (action === 'navigate' && target) {
          const activeSession = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
          if (!activeSession) {
            switchView('onboarding');
            showAuthChoiceScreen();
            return;
          }
          switchView(target);
        } else if (action === 'open-chatbot') {
          const trigger = document.getElementById('placify-chatbot-trigger');
          if (trigger) trigger.click();
        }
      });
    });

    // 4. Contextual "What can I do here?" Page Help Buttons
    document.querySelectorAll('.page-context-help-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pageKey = btn.dataset.pageHelp || 'default';
        ContextualPageGuide.toggle(pageKey, btn);
      });
    });

    // =======================================================================
    // STEP-BY-STEP INTERACTIVE GUIDED TOUR ENGINE
    // Explains actual page sections, controls, cards, buttons, and workflows
    // =======================================================================
`;

  const before = content.slice(0, sIdx);
  const after = content.slice(eIdx + endSectionMarker.length);
  const formattedHelpEngine = isCrlf ? newHelpEngineCode.replace(/\r?\n/g, '\r\n') : newHelpEngineCode.replace(/\r?\n/g, '\n');

  content = before + formattedHelpEngine + after;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ContextualPageGuide in ${filePath}`);
});

console.log('--- Contextual Page Guide Enhancements Complete ---');
