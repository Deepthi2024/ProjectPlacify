const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

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

// --------------------------------------------------------------------------
// 1. UPDATE index.html and frontend/index.html
// --------------------------------------------------------------------------
// A) Add id="roadmap-profile-summary-bar" to the parameters container on the roadmap page
const htmlSearchParamBar = `        <!-- User Profile Parameters Bar -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; background: rgba(255, 255, 255, 0.03); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">`;

const htmlReplaceParamBar = `        <!-- User Profile Parameters Bar -->
        <div id="roadmap-profile-summary-bar" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; background: rgba(255, 255, 255, 0.03); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">`;

updateFile('frontend/index.html', htmlSearchParamBar, htmlReplaceParamBar);
updateFile('index.html', htmlSearchParamBar, htmlReplaceParamBar);

// B) Update tour popover widget in index.html and frontend/index.html
const htmlSearchPopover = `    <!-- Floating Tour Tooltip Popover -->
    <div id="placify-tour-popover" class="placify-tour-popover" style="position: absolute; width: 340px; pointer-events: auto; z-index: 10003; transition: all 0.25s ease;" role="dialog" aria-labelledby="tour-step-title">
      <div class="glass-card" style="padding: 1.25rem; border: 1px solid rgba(6, 182, 212, 0.4); box-shadow: 0 15px 50px rgba(0, 0, 0, 0.75); border-radius: 12px; background: rgba(13, 19, 33, 0.96);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
          <span id="tour-step-badge" style="font-size: 0.72rem; font-weight: 800; color: var(--accent-cyan); background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.3); padding: 0.15rem 0.55rem; border-radius: 20px; text-transform: uppercase;">
            Step 1 of 8
          </span>
          <button type="button" id="tour-skip-x-btn" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 1rem; padding: 0.2rem; line-height: 1;" title="Skip Tour" aria-label="Skip Tour">
            <i class="ph ph-x"></i>
          </button>
        </div>

        <!-- Title & Text -->
        <h4 id="tour-step-title" style="color: #fff; font-size: 1.05rem; font-family: var(--font-heading); margin: 0 0 0.4rem 0; font-weight: 700;">
          Step Title
        </h4>
        <p id="tour-step-desc" style="color: var(--text-muted); font-size: 0.84rem; line-height: 1.45; margin: 0 0 0.75rem 0;">
          Step description text.
        </p>

        <!-- Action Prompt -->
        <div id="tour-step-action-prompt" style="font-size: 0.78rem; color: #38bdf8; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.2); padding: 0.45rem 0.65rem; border-radius: 6px; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
          <i class="ph ph-info"></i> <span id="tour-step-action-text">Action instructions</span>
        </div>

        <!-- Controls -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <button type="button" id="tour-skip-btn" style="background: transparent; border: none; color: var(--text-muted); font-size: 0.78rem; cursor: pointer; text-decoration: underline; padding: 0;">
            Skip Tour
          </button>
          <div style="display: flex; gap: 0.45rem;">
            <button type="button" id="tour-prev-btn" class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">
              <i class="ph ph-arrow-left"></i> Prev
            </button>
            <button type="button" id="tour-next-btn" class="btn btn-primary" style="padding: 0.35rem 0.85rem; font-size: 0.8rem;">
              Next <i class="ph ph-arrow-right"></i>
            </button>
          </div>
        </div>

      </div>
    </div>`;

const htmlReplacePopover = `    <!-- Floating Tour Tooltip Popover -->
    <div id="placify-tour-popover" class="placify-tour-popover" style="position: absolute; width: min(390px, calc(100vw - 28px)); pointer-events: auto; z-index: 10003; transition: all 0.25s ease;" role="dialog" aria-labelledby="tour-step-title">
      <div class="glass-card" style="padding: 1.25rem; border: 1px solid rgba(6, 182, 212, 0.4); box-shadow: 0 15px 50px rgba(0, 0, 0, 0.8); border-radius: 14px; background: rgba(13, 19, 33, 0.98);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span id="tour-step-badge" style="font-size: 0.72rem; font-weight: 800; color: var(--accent-cyan); background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.3); padding: 0.15rem 0.55rem; border-radius: 20px; text-transform: uppercase;">
              Step 1 of 12
            </span>
            <span id="tour-step-view-tag" style="font-size: 0.7rem; font-weight: 700; color: var(--accent-violet); background: rgba(139, 92, 246, 0.12); border: 1px solid rgba(139, 92, 246, 0.3); padding: 0.15rem 0.55rem; border-radius: 20px; text-transform: uppercase;">
              Roadmap
            </span>
          </div>
          <button type="button" id="tour-skip-x-btn" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.1rem; padding: 0.2rem; line-height: 1;" title="Close Tour" aria-label="Close Tour">
            <i class="ph ph-x"></i>
          </button>
        </div>

        <!-- Title -->
        <h4 id="tour-step-title" style="color: #fff; font-size: 1.1rem; font-family: var(--font-heading); margin: 0 0 0.65rem 0; font-weight: 700;">
          Step Title
        </h4>

        <!-- Structured 3-Part Explanations -->
        <div id="tour-step-sections" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.9rem;">
          <!-- 1. What is this? -->
          <div class="tour-qa-block">
            <div class="tour-qa-label"><i class="ph ph-info"></i> What is this?</div>
            <div id="tour-step-what-is-this" class="tour-qa-text">Description</div>
          </div>

          <!-- 2. What should I do here? -->
          <div class="tour-qa-block action">
            <div class="tour-qa-label"><i class="ph ph-cursor-click"></i> What should I do here?</div>
            <div id="tour-step-what-to-do" class="tour-qa-text">Action</div>
          </div>

          <!-- 3. What happens next? -->
          <div class="tour-qa-block next">
            <div class="tour-qa-label"><i class="ph ph-arrow-right"></i> What happens next?</div>
            <div id="tour-step-what-next" class="tour-qa-text">Next Step</div>
          </div>
        </div>

        <!-- Hidden legacy elements for backward-compatibility -->
        <p id="tour-step-desc" style="display: none;"></p>
        <span id="tour-step-action-text" style="display: none;"></span>

        <!-- Controls -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 0.75rem;">
          <button type="button" id="tour-skip-btn" style="background: transparent; border: none; color: var(--text-muted); font-size: 0.8rem; cursor: pointer; text-decoration: underline; padding: 0;">
            Skip Tour
          </button>
          <div style="display: flex; gap: 0.45rem;">
            <button type="button" id="tour-prev-btn" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.82rem;">
              <i class="ph ph-arrow-left"></i> Prev
            </button>
            <button type="button" id="tour-next-btn" class="btn btn-primary" style="padding: 0.4rem 0.95rem; font-size: 0.82rem;">
              Next <i class="ph ph-arrow-right"></i>
            </button>
          </div>
        </div>

      </div>
    </div>`;

updateFile('frontend/index.html', htmlSearchPopover, htmlReplacePopover);
updateFile('index.html', htmlSearchPopover, htmlReplacePopover);

// --------------------------------------------------------------------------
// 2. UPDATE styles.css and frontend/styles.css
// --------------------------------------------------------------------------
const cssAddition = `
/* ==========================================================================
   Placify Interactive Guided Tour Enhanced Styling
   ========================================================================== */

.tour-qa-block {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
  padding: 0.5rem 0.7rem;
}

.tour-qa-block.action {
  background: rgba(6, 182, 212, 0.05);
  border-color: rgba(6, 182, 212, 0.22);
}

.tour-qa-block.next {
  background: rgba(139, 92, 246, 0.05);
  border-color: rgba(139, 92, 246, 0.22);
}

.tour-qa-label {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--accent-cyan);
}

.tour-qa-block.action .tour-qa-label {
  color: var(--accent-cyan);
}

.tour-qa-block.next .tour-qa-label {
  color: var(--accent-violet);
}

.tour-qa-text {
  font-size: 0.8rem;
  color: #f1f5f9;
  line-height: 1.45;
}
`;

function appendCssIfMissing(filePath) {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(rootDir, filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  if (!content.includes('.tour-qa-block')) {
    const isCrlf = content.includes('\r\n');
    const toAppend = isCrlf ? cssAddition.replace(/\n/g, '\r\n') : cssAddition;
    fs.appendFileSync(fullPath, toAppend, 'utf8');
    console.log(`✓ Appended tour styles to ${filePath}`);
  } else {
    console.log(`! Styles already present in ${filePath}`);
  }
}

appendCssIfMissing('frontend/styles.css');
appendCssIfMissing('styles.css');

// --------------------------------------------------------------------------
// 3. UPDATE js/app.js and frontend/js/app.js
// --------------------------------------------------------------------------
const jsSearchTourEngine = `    // =======================================================================
    // STEP-BY-STEP INTERACTIVE GUIDED TOUR ENGINE
    // =======================================================================

    const tourContainer = document.getElementById('placify-tour-container');
    const tourSpotlight = document.getElementById('placify-tour-spotlight');
    const tourPopover = document.getElementById('placify-tour-popover');
    const tourStepBadge = document.getElementById('tour-step-badge');
    const tourStepTitle = document.getElementById('tour-step-title');
    const tourStepDesc = document.getElementById('tour-step-desc');
    const tourStepActionText = document.getElementById('tour-step-action-text');
    const tourPrevBtn = document.getElementById('tour-prev-btn');
    const tourNextBtn = document.getElementById('tour-next-btn');
    const tourSkipBtn = document.getElementById('tour-skip-btn');
    const tourSkipXBtn = document.getElementById('tour-skip-x-btn');
    const tourBackdrop = document.getElementById('placify-tour-backdrop');

    let currentTourStepIndex = 0;
    let isTourActive = false;

    const AUTH_TOUR_STEPS = [
      {
        selector: '#nav-btn-roadmap',
        title: 'Roadmap Curriculum',
        desc: 'Your personalized master learning roadmap. View monthly phases, weekly goals, and prerequisite skill hierarchies tailored to your domain.',
        action: 'Click any phase or day card to explore foundational learning objectives.'
      },
      {
        selector: '#nav-btn-daily-hub',
        title: 'Daily Learning Hub',
        desc: 'Your day-by-day study cockpit. Access curated video chapters, official documentation, and coding practice modules.',
        action: 'Check off tasks as you finish them to earn XP, maintain streaks, and unlock phase assessments.'
      },
      {
        selector: '#nav-btn-interview-questions',
        title: 'Interview Preparation Studio',
        desc: 'Practice technical interviews with AI-generated questions and comprehensive model answers tailored to your selected domain.',
        action: 'Generate sets of 5 questions or explore external resources like LeetCode and GfG.'
      },
      {
        selector: '#nav-btn-tech-news',
        title: 'Live Tech News Feed',
        desc: 'Real-time technology news aggregated across AI, Web Development, Cloud & DevOps, Data Science, and Systems Engineering.',
        action: 'Stay up-to-date with industry trends to stand out in hiring discussions.'
      },
      {
        selector: '#nav-btn-analytics',
        title: 'Mastery & Analytics',
        desc: 'Monitor your placement readiness velocity. Track domain mastery %, active daily streaks, total XP, and skill tier upgrades.',
        action: 'Review diagnostic breakdowns to identify concepts needing extra practice.'
      },
      {
        selector: '#nav-btn-internships',
        title: 'Curated Internships',
        desc: 'Discover live internship postings tailored to your domain and location. Filter by role and open direct external application links.',
        action: 'Submit applications externally, then confirm submission in Placify to track them.'
      },
      {
        selector: '#nav-btn-my-applications',
        title: 'My Applications Tracker',
        desc: 'Your personal Kanban board for tracked job opportunities. Update statuses (Applied, Assessment, Interview, Offer) and timeline notes.',
        action: 'Keep your interview rounds and recruiter communication strictly organized.'
      },
      {
        selector: '#placify-chatbot-trigger',
        title: 'Placify AI Assistant',
        desc: 'Your 24/7 placement mentor. The floating sparkle button in the bottom-right corner understands your active page and answers any question.',
        action: 'Click this button anytime for instant, context-aware help on any topic.'
      }
    ];

    const LANDING_TOUR_STEPS = [
      {
        selector: '#choice-signin-btn',
        title: 'Sign In to Your Account',
        desc: 'Access your saved roadmap, daily study streak, and synced placement progress.',
        action: 'Click Sign In if you already have an account.'
      },
      {
        selector: '#choice-signup-btn',
        title: 'Sign Up as a New Learner',
        desc: 'Create your Placify AI account to choose a domain, establish a baseline, and generate a customized roadmap.',
        action: 'Click Sign Up to start your placement preparation journey.'
      },
      {
        selector: '.opening-features-strip',
        title: 'Platform Capabilities',
        desc: 'Placify covers 8 tech domains with adaptive daily roadmaps, company assessment patterns, and Groq-powered AI mock interviews.',
        action: 'Sign in to unlock full personalized access.'
      },
      {
        selector: '#placify-chatbot-trigger',
        title: 'Placify AI Assistant',
        desc: 'Ask questions about domain choices, roadmap customizations, or platform features anytime.',
        action: 'Click the sparkle button in the bottom right corner.'
      }
    ];

    function getActiveTourSteps() {
      const activeSession = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
      return activeSession ? AUTH_TOUR_STEPS : LANDING_TOUR_STEPS;
    }

    function startGuidedTour() {
      // Guard: Never start tour during active quiz screens
      const curView = document.querySelector('.view-section.active');
      if (curView && (curView.id === 'view-concept-quiz' || curView.id === 'view-diagnostic-quiz')) {
        console.warn('[Tour Guard] Tour suppressed during active assessment.');
        return;
      }

      closeGuideModal();
      currentTourStepIndex = 0;
      isTourActive = true;
      if (tourContainer) tourContainer.style.display = 'block';
      renderTourStep(currentTourStepIndex);
    }

    function endGuidedTour(recordCompletion = true) {
      isTourActive = false;
      if (tourContainer) tourContainer.style.display = 'none';
      document.querySelectorAll('.placify-tour-highlighted-element').forEach(el => {
        el.classList.remove('placify-tour-highlighted-element');
      });

      if (recordCompletion) {
        const session = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
        const uid = session ? session.user_id : 'anonymous';
        try {
          localStorage.setItem('placify_tour_completed_' + uid, 'true');
        } catch (e) {}
      }
    }

    function renderTourStep(index) {
      const steps = getActiveTourSteps();
      if (index < 0 || index >= steps.length) {
        endGuidedTour(true);
        return;
      }

      const step = steps[index];
      const targetEl = document.querySelector(step.selector);

      // Clean up previous highlight
      document.querySelectorAll('.placify-tour-highlighted-element').forEach(el => {
        el.classList.remove('placify-tour-highlighted-element');
      });

      if (tourStepBadge) tourStepBadge.textContent = \`Step \${index + 1} of \${steps.length}\`;
      if (tourStepTitle) tourStepTitle.textContent = step.title;
      if (tourStepDesc) tourStepDesc.textContent = step.desc;
      if (tourStepActionText) tourStepActionText.textContent = step.action;

      if (tourPrevBtn) tourPrevBtn.style.display = index === 0 ? 'none' : 'inline-flex';
      if (tourNextBtn) {
        tourNextBtn.innerHTML = index === steps.length - 1 ? 'Finish Tour <i class="ph ph-check"></i>' : 'Next <i class="ph ph-arrow-right"></i>';
      }

      if (targetEl && targetEl.offsetParent !== null) {
        targetEl.classList.add('placify-tour-highlighted-element');
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });

        const rect = targetEl.getBoundingClientRect();
        if (tourSpotlight) {
          tourSpotlight.style.display = 'block';
          tourSpotlight.style.top = \`\${rect.top - 4}px\`;
          tourSpotlight.style.left = \`\${rect.left - 4}px\`;
          tourSpotlight.style.width = \`\${rect.width + 8}px\`;
          tourSpotlight.style.height = \`\${rect.height + 8}px\`;
        }

        // Position popover
        if (tourPopover) {
          const popoverWidth = 340;
          let popoverTop = rect.bottom + 12;
          let popoverLeft = rect.left + (rect.width / 2) - (popoverWidth / 2);

          // Keep within horizontal bounds
          if (popoverLeft < 12) popoverLeft = 12;
          if (popoverLeft + popoverWidth > window.innerWidth - 12) {
            popoverLeft = window.innerWidth - popoverWidth - 12;
          }

          // If overflowing bottom, position above target
          if (popoverTop + 240 > window.innerHeight) {
            popoverTop = Math.max(12, rect.top - 250);
          }

          tourPopover.style.top = \`\${popoverTop}px\`;
          tourPopover.style.left = \`\${popoverLeft}px\`;
        }
      } else {
        // Fallback: target not visible, center popover
        if (tourSpotlight) tourSpotlight.style.display = 'none';
        if (tourPopover) {
          tourPopover.style.top = '25%';
          tourPopover.style.left = \`calc(50% - 170px)\`;
        }
      }
    }

    if (tourNextBtn) {
      tourNextBtn.addEventListener('click', () => {
        const steps = getActiveTourSteps();
        if (currentTourStepIndex >= steps.length - 1) {
          endGuidedTour(true);
        } else {
          currentTourStepIndex++;
          renderTourStep(currentTourStepIndex);
        }
      });
    }

    if (tourPrevBtn) {
      tourPrevBtn.addEventListener('click', () => {
        if (currentTourStepIndex > 0) {
          currentTourStepIndex--;
          renderTourStep(currentTourStepIndex);
        }
      });
    }

    if (tourSkipBtn) tourSkipBtn.addEventListener('click', () => endGuidedTour(false));
    if (tourSkipXBtn) tourSkipXBtn.addEventListener('click', () => endGuidedTour(false));
    if (tourBackdrop) tourBackdrop.addEventListener('click', () => endGuidedTour(false));

    if (startTourFromModalBtn) {
      startTourFromModalBtn.addEventListener('click', startGuidedTour);
    }

    // Window resize & keyboard Escape support
    window.addEventListener('resize', () => {
      if (isTourActive) renderTourStep(currentTourStepIndex);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (isTourActive) endGuidedTour(false);
        closeGuideModal();
      }
    });

    // Expose launcher globally
    window.startPlacifyGuidedTour = startGuidedTour;`;

const jsReplaceTourEngine = `    // =======================================================================
    // STEP-BY-STEP INTERACTIVE GUIDED TOUR ENGINE
    // Explains actual page sections, controls, cards, buttons, and workflows
    // =======================================================================

    const tourContainer = document.getElementById('placify-tour-container');
    const tourSpotlight = document.getElementById('placify-tour-spotlight');
    const tourPopover = document.getElementById('placify-tour-popover');
    const tourStepBadge = document.getElementById('tour-step-badge');
    const tourStepViewTag = document.getElementById('tour-step-view-tag');
    const tourStepTitle = document.getElementById('tour-step-title');
    const tourStepDesc = document.getElementById('tour-step-desc');
    const tourStepActionText = document.getElementById('tour-step-action-text');
    const tourStepWhatIsThis = document.getElementById('tour-step-what-is-this');
    const tourStepWhatToDo = document.getElementById('tour-step-what-to-do');
    const tourStepWhatNext = document.getElementById('tour-step-what-next');
    const tourPrevBtn = document.getElementById('tour-prev-btn');
    const tourNextBtn = document.getElementById('tour-next-btn');
    const tourSkipBtn = document.getElementById('tour-skip-btn');
    const tourSkipXBtn = document.getElementById('tour-skip-x-btn');
    const tourBackdrop = document.getElementById('placify-tour-backdrop');

    let currentTourStepIndex = 0;
    let isTourActive = false;

    // Helper: Determine currently active view key
    function getCurrentActiveViewKey() {
      const activeEl = document.querySelector('.view-section.active');
      if (!activeEl) return null;
      for (const [key, el] of Object.entries(views)) {
        if (el === activeEl) return key;
      }
      return null;
    }

    // Helper: Safely navigate to view and ensure data rendering
    function navigateToTourView(targetView) {
      if (!targetView) return;
      const activeSession = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
      if (!activeSession) {
        switchView('onboarding');
        return;
      }

      const state = supervisor.progressTracker ? supervisor.progressTracker.getUserState() : null;
      if (targetView === 'roadmap') {
        if (state && state.personalizedRoadmap && typeof renderRoadmapView === 'function') {
          renderRoadmapView(state.personalizedRoadmap);
        }
      } else if (targetView === 'dailyHub') {
        if (state && state.dailyTasks && typeof renderDailyHubView === 'function') {
          renderDailyHubView(state.dailyTasks);
        } else {
          let savedSpec = null;
          try {
            const raw = localStorage.getItem(\`placify_selected_day_spec_\${activeSession.user_id}\`) || localStorage.getItem('placify_selected_day_spec');
            if (raw) savedSpec = JSON.parse(raw);
          } catch(e) {}
          if (typeof renderDailyHub === 'function') renderDailyHub(savedSpec);
        }
      } else if (targetView === 'progressAnalytics') {
        if (typeof updateAnalyticsView === 'function') updateAnalyticsView();
      } else if (targetView === 'techNews') {
        if (typeof fetchTechNews === 'function') fetchTechNews();
      } else if (targetView === 'interviewQuestions') {
        if (typeof initInterviewPreparationStudio === 'function') initInterviewPreparationStudio();
      }
      switchView(targetView);
    }

    // Full 12-Step Walkthrough for Authenticated Users (Roadmap-First)
    const AUTH_TOUR_STEPS = [
      // 1. Roadmap Overview
      {
        view: 'roadmap',
        selector: '#view-roadmap .section-title',
        fallbackSelector: '#view-roadmap',
        viewTag: 'Roadmap',
        title: 'Roadmap Overview',
        whatIsThis: 'Welcome to your personalized learning roadmap! This page shows the learning journey designed for your selected domain, proficiency level, and career goals. Follow the roadmap in sequence to build your skills and prepare for placements.',
        whatToDo: 'Review your overall multi-phase curriculum. It organizes foundational to advanced technical topics into structured, manageable stages.',
        whatNext: 'Next, let\\'s look at your target domain and profile parameters bar.'
      },
      // 2. Domain and Proficiency
      {
        view: 'roadmap',
        selector: '#roadmap-profile-summary-bar',
        fallbackSelector: '#rm-summary-domain',
        viewTag: 'Roadmap',
        title: 'Domain & Proficiency Profile',
        whatIsThis: 'Displays your selected tech domain, preparation timeline, daily commitment, and diagnostic score. These settings calibrate your curriculum pacing and task volume.',
        whatToDo: 'Verify that your target domain and daily hours reflect your placement goals. Your roadmap adapts dynamically to this profile.',
        whatNext: 'Next, let\\'s explore the roadmap phase views and hierarchy.'
      },
      // 3. Roadmap Phases & Hierarchy
      {
        view: 'roadmap',
        selector: '#roadmap-breadcrumbs',
        fallbackSelector: '#roadmap-level-indicator',
        viewTag: 'Roadmap',
        title: 'Roadmap Hierarchy & Views',
        whatIsThis: 'Your curriculum has 3 drill-down levels: Level 1 (Monthly Milestones), Level 2 (Weekly View), and Level 3 (Phase-Wise Tasks).',
        whatToDo: 'Use these breadcrumb tabs to navigate between broad milestones and specific day-to-day study sessions.',
        whatNext: 'Next, let\\'s examine an individual phase card and its objectives.'
      },
      // 4. Phase Cards & Objectives
      {
        view: 'roadmap',
        selector: '#roadmap-nodes-container .month-card:first-child',
        fallbackSelector: '#roadmap-nodes-container',
        viewTag: 'Roadmap',
        title: 'Phase Cards & Objectives',
        whatIsThis: 'Each card represents a learning phase featuring difficulty tier, estimated study hours, topic tags, and clear learning objectives.',
        whatToDo: 'Click any phase card or its "Explore Weeks" button to drill down into weekly goals, practice focus, and concept prerequisites.',
        whatNext: 'Next, let\\'s see how to start your journey and launch phases.'
      },
      // 5. Starting the Learning Journey
      {
        view: 'roadmap',
        selector: '#start-journey-btn, #enter-daily-hub-btn',
        fallbackSelector: '#enter-daily-hub-btn',
        viewTag: 'Roadmap',
        title: 'Start Journey & Enter Daily Hub',
        whatIsThis: 'Your journey launch controls. Clicking "Start My Journey" maps Day 1 to today\\'s calendar date and unlocks your daily study cockpit.',
        whatToDo: 'Click "Start My Journey" to pin your milestones to real calendar dates, then click "Enter Daily Learning Hub" to begin your assigned tasks.',
        whatNext: 'Next, let\\'s explore the Daily Learning Hub.'
      },
      // 6. Daily Hub & Task Completion
      {
        view: 'dailyHub',
        selector: '#view-daily-hub .daily-hub-layout',
        fallbackSelector: '#view-daily-hub',
        viewTag: 'Daily Hub',
        title: 'Daily Hub & Task Execution',
        whatIsThis: 'Your day-by-day study cockpit. Here you receive curated video chapters, official documentation, and coding practice modules for your active phase.',
        whatToDo: 'Study each resource and check off tasks as you finish them. Completing all tasks in a phase earns XP, maintains your streak, and unlocks the Phase Assessment.',
        whatNext: 'Next, let\\'s visit the Interview Preparation Studio.'
      },
      // 7. Interview Preparation Studio
      {
        view: 'interviewQuestions',
        selector: '#view-interview-questions .glass-card',
        fallbackSelector: '#view-interview-questions',
        viewTag: 'Interview Prep',
        title: 'Interview Preparation Studio',
        whatIsThis: 'Dedicated interview preparation studio with two paths: "Learn from Other Websites" (curated external resources) and "Prepare on Placify AI" (in-browser simulator).',
        whatToDo: 'Select external platforms (LeetCode, GfG, MDN) for broad problem sets, or use Placify AI to generate and practice domain-specific questions with AI scoring.',
        whatNext: 'Next, let\\'s explore real-time Tech News.'
      },
      // 8. Live Tech News Feed
      {
        view: 'techNews',
        selector: '#view-tech-news .glass-card',
        fallbackSelector: '#view-tech-news',
        viewTag: 'Tech News',
        title: 'Real-Time Tech News Feed',
        whatIsThis: 'Multi-source news feed aggregated across AI, Web Development, Cloud & DevOps, Data Science, Cyber Security, and Systems Engineering.',
        whatToDo: 'Browse recent technology developments and breakthrough articles to stay ahead in company technical discussions and interviews.',
        whatNext: 'Next, let\\'s check your mastery velocity in Analytics.'
      },
      // 9. Mastery & Analytics
      {
        view: 'progressAnalytics',
        selector: '#view-progress-analytics .glass-card',
        fallbackSelector: '#view-progress-analytics',
        viewTag: 'Analytics',
        title: 'Mastery & Progress Analytics',
        whatIsThis: 'Comprehensive placement readiness tracking: monitor your domain mastery %, active daily streak, total XP, and skill tier upgrades.',
        whatToDo: 'Review your analytics regularly to spot concept areas that need revision and verify you are maintaining your daily study streak.',
        whatNext: 'Next, let\\'s explore internship opportunities.'
      },
      // 10. Curated Internships
      {
        view: 'internships',
        selector: '#view-internships .glass-card',
        fallbackSelector: '#view-internships',
        viewTag: 'Internships',
        title: 'Curated Internship Opportunities',
        whatIsThis: 'Live internship search engine filtering verified postings by your domain, keywords, and preferred location.',
        whatToDo: 'Search open listings, click external links to apply directly on company portals, and track positions you submit.',
        whatNext: 'Next, let\\'s see how to manage applied roles in My Applications.'
      },
      // 11. My Applications Tracker
      {
        view: 'myApplications',
        selector: '#view-my-applications .glass-card',
        fallbackSelector: '#view-my-applications',
        viewTag: 'Applications',
        title: 'My Applications Tracker',
        whatIsThis: 'Your personal placement application board. Organize submitted opportunities across Applied, Assessment, Interview, and Offer stages.',
        whatToDo: 'Update application statuses, log interview dates, and keep recruitment notes in one unified dashboard.',
        whatNext: 'Finally, let\\'s see how to get help anytime with the AI Assistant.'
      },
      // 12. AI Assistant & Getting Help
      {
        view: null,
        selector: '#placify-chatbot-trigger',
        fallbackSelector: '#placify-chatbot-trigger',
        viewTag: 'AI Assistant',
        title: 'Placify AI Assistant',
        whatIsThis: 'Your 24/7 placement mentor. The floating sparkle button understands whatever page you are currently viewing and provides instant answers.',
        whatToDo: 'Click this button anytime you have questions about a topic, need a hint on a coding problem, or want study tips.',
        whatNext: 'You\\'re now ready to use Placify AI! Click "Finish Tour" to begin your learning journey.'
      }
    ];

    const LANDING_TOUR_STEPS = [
      {
        view: 'onboarding',
        selector: '#choice-signin-btn',
        fallbackSelector: '#auth-choice-screen',
        viewTag: 'Welcome',
        title: 'Sign In to Your Account',
        whatIsThis: 'The authentication gateway for returning learners.',
        whatToDo: 'Click "Sign In" if you already have an account to access your saved roadmap, study streak, and synced progress.',
        whatNext: 'Next, see how new learners create their account.'
      },
      {
        view: 'onboarding',
        selector: '#choice-signup-btn',
        fallbackSelector: '#auth-choice-screen',
        viewTag: 'Welcome',
        title: 'Sign Up as a New Learner',
        whatIsThis: 'New learner onboarding registration.',
        whatToDo: 'Click "Sign Up" to establish your profile, choose your tech domain, take the baseline assessment, and generate your custom roadmap.',
        whatNext: 'Next, see platform capabilities.'
      },
      {
        view: 'onboarding',
        selector: '.opening-features-strip',
        fallbackSelector: '#auth-choice-screen',
        viewTag: 'Features',
        title: 'Platform Capabilities',
        whatIsThis: 'Placify covers 8 tech domains with adaptive daily roadmaps, company assessment patterns, and Groq-powered AI mock interviews.',
        whatToDo: 'Sign in or register to unlock full personalized access and begin your placement preparation.',
        whatNext: 'Finally, meet your AI mentor.'
      },
      {
        view: null,
        selector: '#placify-chatbot-trigger',
        fallbackSelector: '#placify-chatbot-trigger',
        viewTag: 'AI Assistant',
        title: 'Placify AI Assistant',
        whatIsThis: 'Ask questions about domain choices, roadmap customizations, or platform features anytime.',
        whatToDo: 'Click the sparkle button in the bottom right corner for immediate guidance.',
        whatNext: 'Click "Finish Tour" to begin!'
      }
    ];

    function getActiveTourSteps() {
      const activeSession = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
      return activeSession ? AUTH_TOUR_STEPS : LANDING_TOUR_STEPS;
    }

    function startGuidedTour() {
      // Guard: Never start tour during active quiz screens
      const curView = document.querySelector('.view-section.active');
      if (curView && (curView.id === 'view-concept-quiz' || curView.id === 'view-diagnostic-quiz')) {
        console.warn('[Tour Guard] Tour suppressed during active assessment.');
        return;
      }

      closeGuideModal();

      const activeSession = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
      
      // If user is not logged in or in onboarding
      if (!activeSession) {
        currentTourStepIndex = 0;
        isTourActive = true;
        if (tourContainer) tourContainer.style.display = 'block';
        renderTourStep(0);
        return;
      }

      // If user is authenticated, ensure they navigate to Roadmap first to begin the roadmap-first walkthrough!
      const curViewKey = getCurrentActiveViewKey();
      if (curViewKey !== 'roadmap') {
        navigateToTourView('roadmap');
      }

      currentTourStepIndex = 0;
      isTourActive = true;
      if (tourContainer) tourContainer.style.display = 'block';

      // Allow brief tick for view render
      setTimeout(() => {
        renderTourStep(0);
      }, 140);
    }

    function endGuidedTour(recordCompletion = true) {
      isTourActive = false;
      if (tourContainer) tourContainer.style.display = 'none';
      if (tourSpotlight) tourSpotlight.style.display = 'none';

      document.querySelectorAll('.placify-tour-highlighted-element').forEach(el => {
        el.classList.remove('placify-tour-highlighted-element');
      });

      if (recordCompletion) {
        const session = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
        const uid = session ? session.user_id : 'anonymous';
        try {
          localStorage.setItem('placify_tour_completed_' + uid, 'true');
        } catch (e) {}
      }
    }

    function positionSpotlightAndPopover(targetEl) {
      if (!targetEl || !tourPopover) return;
      const rect = targetEl.getBoundingClientRect();

      if (tourSpotlight) {
        tourSpotlight.style.display = 'block';
        tourSpotlight.style.top = \`\${Math.max(0, rect.top - 6)}px\`;
        tourSpotlight.style.left = \`\${Math.max(0, rect.left - 6)}px\`;
        tourSpotlight.style.width = \`\${rect.width + 12}px\`;
        tourSpotlight.style.height = \`\${rect.height + 12}px\`;
      }

      const popoverWidth = Math.min(390, window.innerWidth - 28);
      const popoverHeight = tourPopover.offsetHeight || 330;

      // By default, place below target element
      let popoverTop = rect.bottom + 14;
      let popoverLeft = rect.left + (rect.width / 2) - (popoverWidth / 2);

      // If overflowing below bottom of viewport, place above target
      if (popoverTop + popoverHeight > window.innerHeight - 12) {
        const spaceAbove = rect.top - 14 - popoverHeight;
        if (spaceAbove >= 12) {
          popoverTop = spaceAbove;
        } else {
          popoverTop = Math.max(12, window.innerHeight - popoverHeight - 12);
        }
      }

      // Keep within horizontal bounds
      if (popoverLeft < 14) popoverLeft = 14;
      if (popoverLeft + popoverWidth > window.innerWidth - 14) {
        popoverLeft = window.innerWidth - popoverWidth - 14;
      }

      tourPopover.style.top = \`\${popoverTop}px\`;
      tourPopover.style.left = \`\${popoverLeft}px\`;
      tourPopover.style.width = \`\${popoverWidth}px\`;
    }

    async function renderTourStep(index) {
      if (!isTourActive) return;
      const steps = getActiveTourSteps();
      if (index < 0 || index >= steps.length) {
        endGuidedTour(true);
        return;
      }

      currentTourStepIndex = index;
      const step = steps[index];

      // Multi-page navigation: if step requires a different view, navigate first!
      if (step.view) {
        const curViewKey = getCurrentActiveViewKey();
        if (curViewKey !== step.view) {
          navigateToTourView(step.view);
          await new Promise(r => setTimeout(r, 180));
        }
      }

      if (!isTourActive) return;

      // Clean up previous highlight
      document.querySelectorAll('.placify-tour-highlighted-element').forEach(el => {
        el.classList.remove('placify-tour-highlighted-element');
      });

      // Helper to locate target element with fallback support
      function findTarget() {
        let el = step.selector ? document.querySelector(step.selector) : null;
        if ((!el || el.offsetParent === null) && step.fallbackSelector) {
          el = document.querySelector(step.fallbackSelector);
        }
        return (el && el.offsetParent !== null) ? el : null;
      }

      let targetEl = findTarget();
      if (!targetEl) {
        // Quick retry for dynamically populated containers
        await new Promise(r => setTimeout(r, 220));
        targetEl = findTarget();
      }

      // Populate popover content
      if (tourStepBadge) tourStepBadge.textContent = \`Step \${index + 1} of \${steps.length}\`;
      const tagEl = document.getElementById('tour-step-view-tag');
      if (tagEl) tagEl.textContent = step.viewTag || 'Guide';
      if (tourStepTitle) tourStepTitle.textContent = step.title;

      const whatIsThisEl = document.getElementById('tour-step-what-is-this');
      if (whatIsThisEl) whatIsThisEl.textContent = step.whatIsThis || step.desc || '';

      const whatToDoEl = document.getElementById('tour-step-what-to-do');
      if (whatToDoEl) whatToDoEl.textContent = step.whatToDo || step.action || '';

      const whatNextEl = document.getElementById('tour-step-what-next');
      if (whatNextEl) whatNextEl.textContent = step.whatNext || '';

      // Backward-compatibility support
      if (tourStepDesc) tourStepDesc.textContent = step.whatIsThis || step.desc || '';
      if (tourStepActionText) tourStepActionText.textContent = step.whatToDo || step.action || '';

      if (tourPrevBtn) tourPrevBtn.style.display = index === 0 ? 'none' : 'inline-flex';
      if (tourNextBtn) {
        tourNextBtn.innerHTML = index === steps.length - 1 ? 'Finish Tour <i class="ph ph-check"></i>' : 'Next <i class="ph ph-arrow-right"></i>';
      }

      // Highlight and position
      if (targetEl) {
        targetEl.classList.add('placify-tour-highlighted-element');
        try {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        } catch (e) {}

        setTimeout(() => {
          if (!isTourActive || currentTourStepIndex !== index) return;
          positionSpotlightAndPopover(targetEl);
        }, 80);
      } else {
        // Fallback: center popover gracefully
        if (tourSpotlight) tourSpotlight.style.display = 'none';
        if (tourPopover) {
          const popoverWidth = Math.min(390, window.innerWidth - 28);
          tourPopover.style.top = '22%';
          tourPopover.style.left = \`\${Math.max(14, (window.innerWidth - popoverWidth) / 2)}px\`;
          tourPopover.style.width = \`\${popoverWidth}px\`;
        }
      }
    }

    if (tourNextBtn) {
      tourNextBtn.addEventListener('click', () => {
        const steps = getActiveTourSteps();
        if (currentTourStepIndex >= steps.length - 1) {
          endGuidedTour(true);
        } else {
          currentTourStepIndex++;
          renderTourStep(currentTourStepIndex);
        }
      });
    }

    if (tourPrevBtn) {
      tourPrevBtn.addEventListener('click', () => {
        if (currentTourStepIndex > 0) {
          currentTourStepIndex--;
          renderTourStep(currentTourStepIndex);
        }
      });
    }

    if (tourSkipBtn) tourSkipBtn.addEventListener('click', () => endGuidedTour(false));
    if (tourSkipXBtn) tourSkipXBtn.addEventListener('click', () => endGuidedTour(false));
    if (tourBackdrop) tourBackdrop.addEventListener('click', () => endGuidedTour(false));

    if (startTourFromModalBtn) {
      startTourFromModalBtn.addEventListener('click', startGuidedTour);
    }

    // Window resize & scroll repositioning
    window.addEventListener('resize', () => {
      if (isTourActive) {
        const steps = getActiveTourSteps();
        const step = steps[currentTourStepIndex];
        if (step) {
          const targetEl = document.querySelector(step.selector) || document.querySelector(step.fallbackSelector);
          if (targetEl) positionSpotlightAndPopover(targetEl);
        }
      }
    });

    window.addEventListener('scroll', () => {
      if (isTourActive) {
        const steps = getActiveTourSteps();
        const step = steps[currentTourStepIndex];
        if (step) {
          const targetEl = document.querySelector(step.selector) || document.querySelector(step.fallbackSelector);
          if (targetEl) positionSpotlightAndPopover(targetEl);
        }
      }
    }, { passive: true });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (isTourActive) endGuidedTour(false);
        closeGuideModal();
      }
    });

    // Expose launcher globally
    window.startPlacifyGuidedTour = startGuidedTour;`;

updateFile('frontend/js/app.js', jsSearchTourEngine, jsReplaceTourEngine);
updateFile('js/app.js', jsSearchTourEngine, jsReplaceTourEngine);

console.log('\nAll Guided Tour enhancements applied successfully!');
