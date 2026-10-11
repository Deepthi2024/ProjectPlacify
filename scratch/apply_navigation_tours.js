const fs = require('fs');
const path = require('path');

// 1. Update HTML files
const htmlFiles = [
  path.resolve(__dirname, '../index.html'),
  path.resolve(__dirname, '../frontend/index.html')
];

for (const filePath of htmlFiles) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Update Tab 2: guide-menu-card elements with data-action and data-target
  html = html.replace(
    '<div class="guide-menu-card">\n              <div class="guide-menu-header">\n                <span class="guide-menu-tag"><i class="ph ph-map-trifold"></i> Roadmap</span>',
    '<div class="guide-menu-card" data-action="navigate" data-target="roadmap" title="Go to Roadmap & Start Tour">\n              <div class="guide-menu-header">\n                <span class="guide-menu-tag"><i class="ph ph-map-trifold"></i> Roadmap</span>'
  );

  html = html.replace(
    '<div class="guide-menu-card">\n              <div class="guide-menu-header">\n                <span class="guide-menu-tag"><i class="ph ph-calendar-check"></i> Daily Hub</span>',
    '<div class="guide-menu-card" data-action="navigate" data-target="dailyHub" title="Go to Daily Hub & Start Tour">\n              <div class="guide-menu-header">\n                <span class="guide-menu-tag"><i class="ph ph-calendar-check"></i> Daily Hub</span>'
  );

  html = html.replace(
    '<div class="guide-menu-card">\n              <div class="guide-menu-header">\n                <span class="guide-menu-tag"><i class="ph ph-chats-circle"></i> Interview Questions</span>',
    '<div class="guide-menu-card" data-action="navigate" data-target="interviewQuestions" title="Go to Interview Questions & Start Tour">\n              <div class="guide-menu-header">\n                <span class="guide-menu-tag"><i class="ph ph-chats-circle"></i> Interview Questions</span>'
  );

  html = html.replace(
    '<div class="guide-menu-card">\n              <div class="guide-menu-header">\n                <span class="guide-menu-tag"><i class="ph ph-newspaper"></i> Tech News</span>',
    '<div class="guide-menu-card" data-action="navigate" data-target="techNews" title="Go to Tech News & Start Tour">\n              <div class="guide-menu-header">\n                <span class="guide-menu-tag"><i class="ph ph-newspaper"></i> Tech News</span>'
  );

  html = html.replace(
    '<div class="guide-menu-card">\n              <div class="guide-menu-header">\n                <span class="guide-menu-tag"><i class="ph ph-chart-line-up"></i> Analytics</span>',
    '<div class="guide-menu-card" data-action="navigate" data-target="progressAnalytics" title="Go to Analytics & Start Tour">\n              <div class="guide-menu-header">\n                <span class="guide-menu-tag"><i class="ph ph-chart-line-up"></i> Analytics</span>'
  );

  html = html.replace(
    '<div class="guide-menu-card">\n              <div class="guide-menu-header">\n                <span class="guide-menu-tag"><i class="ph ph-briefcase"></i> Internships</span>',
    '<div class="guide-menu-card" data-action="navigate" data-target="internships" title="Go to Internships & Start Tour">\n              <div class="guide-menu-header">\n                <span class="guide-menu-tag"><i class="ph ph-briefcase"></i> Internships</span>'
  );

  html = html.replace(
    '<div class="guide-menu-card">\n              <div class="guide-menu-header">\n                <span class="guide-menu-tag"><i class="ph ph-kanban"></i> My Applications</span>',
    '<div class="guide-menu-card" data-action="navigate" data-target="myApplications" title="Go to My Applications & Start Tour">\n              <div class="guide-menu-header">\n                <span class="guide-menu-tag"><i class="ph ph-kanban"></i> My Applications</span>'
  );

  html = html.replace(
    '<div class="guide-menu-card">\n              <div class="guide-menu-header">\n                <span class="guide-menu-tag" style="background: rgba(6, 182, 212, 0.15); color: var(--accent-cyan);"><i class="ph ph-sparkle"></i> Floating AI Assistant</span>',
    '<div class="guide-menu-card" data-action="open-chatbot" title="Open Placify AI Assistant">\n              <div class="guide-menu-header">\n                <span class="guide-menu-tag" style="background: rgba(6, 182, 212, 0.15); color: var(--accent-cyan);"><i class="ph ph-sparkle"></i> Floating AI Assistant</span>'
  );

  // Update Tab 3: guide-step-card elements with data-action and data-target
  html = html.replace(
    '<div class="guide-step-card">\n              <div class="guide-step-number">1</div>',
    '<div class="guide-step-card" data-action="navigate" data-target="onboarding" title="Go to Onboarding & Start Tour">\n              <div class="guide-step-number">1</div>'
  );

  html = html.replace(
    '<div class="guide-step-card">\n              <div class="guide-step-number">2</div>',
    '<div class="guide-step-card" data-action="navigate" data-target="domainSelection" title="Go to Domain Selection & Start Tour">\n              <div class="guide-step-number">2</div>'
  );

  html = html.replace(
    '<div class="guide-step-card">\n              <div class="guide-step-number">3</div>',
    '<div class="guide-step-card" data-action="navigate" data-target="diagnostic" title="Go to Phase 2 Setup & Start Tour">\n              <div class="guide-step-number">3</div>'
  );

  html = html.replace(
    '<div class="guide-step-card">\n              <div class="guide-step-number">4</div>',
    '<div class="guide-step-card" data-action="navigate" data-target="roadmap" title="Go to Roadmap & Start Tour">\n              <div class="guide-step-number">4</div>'
  );

  html = html.replace(
    '<div class="guide-step-card">\n              <div class="guide-step-number">5</div>',
    '<div class="guide-step-card" data-action="navigate" data-target="dailyHub" title="Go to Daily Hub & Start Tour">\n              <div class="guide-step-number">5</div>'
  );

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Updated HTML cards in ${filePath}`);
}

// 2. Update JS files
const jsFiles = [
  path.resolve(__dirname, '../js/app.js'),
  path.resolve(__dirname, '../frontend/js/app.js')
];

for (const filePath of jsFiles) {
  let js = fs.readFileSync(filePath, 'utf8');

  // Add internships and myApplications to navigateToTourView
  const oldNavTour = `} else if (targetView === 'techNews') {
        if (typeof fetchTechNews === 'function') fetchTechNews();
      } else if (targetView === 'interviewQuestions') {
        if (typeof initInterviewPreparationStudio === 'function') initInterviewPreparationStudio();
      }`;

  const newNavTour = `} else if (targetView === 'techNews') {
        if (typeof fetchTechNews === 'function') fetchTechNews();
      } else if (targetView === 'internships') {
        if (typeof fetchInternships === 'function') fetchInternships();
      } else if (targetView === 'myApplications') {
        if (typeof fetchMyApplications === 'function') fetchMyApplications();
      } else if (targetView === 'interviewQuestions') {
        if (typeof initInterviewPreparationStudio === 'function') initInterviewPreparationStudio();
      }`;

  if (js.includes(oldNavTour)) {
    js = js.replace(oldNavTour, newNavTour);
    console.log(`Added internships and myApplications fetch in navigateToTourView in ${filePath}`);
  }

  // Update navigation card click handlers and add centralized DESTINATION_TO_TOUR_MAP & navigateAndLaunchPageTour
  const oldNavHandlerRegex = /\/\/ 3\. "Where Should I Go\?" Quick Navigation Cards[\s\S]*?document\.querySelectorAll\('\.guide-goal-card'\)\.forEach\(card => \{[\s\S]*?\}\);\s*\}\);\s*\n\s*\/\/ 4\. Contextual "What can I do here\?"/;

  const newNavHandler = `// Centralized Destination-to-Tour Mapping
    const DESTINATION_TO_TOUR_MAP = {
      roadmap: 'roadmap',
      dashboard: 'roadmap',
      dailyHub: 'dailyHub',
      tasks: 'dailyHub',
      'daily-hub': 'dailyHub',
      interviewQuestions: 'interviewQuestions',
      'interview-questions': 'interviewQuestions',
      interview: 'interviewQuestions',
      progressAnalytics: 'progressAnalytics',
      analytics: 'progressAnalytics',
      profile: 'progressAnalytics',
      internships: 'internships',
      myApplications: 'myApplications',
      applications: 'myApplications',
      techNews: 'techNews',
      'tech-news': 'techNews',
      domainSelection: 'domainSelection',
      diagnostic: 'diagnostic',
      assessmentReport: 'assessmentReport',
      assessmentEvaluation: 'assessmentEvaluation',
      onboarding: 'onboarding'
    };

    // Navigates to destination page, settles DOM rendering, and automatically launches its dedicated guided tour
    function navigateAndLaunchPageTour(targetView) {
      closeGuideModal();

      const activeSession = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
      if (!activeSession) {
        switchView('onboarding');
        showAuthChoiceScreen();
        setTimeout(() => {
          startPageTour('onboarding');
        }, 120);
        return;
      }

      const tourKey = DESTINATION_TO_TOUR_MAP[targetView] || targetView;

      // 1. Navigate to target view using existing router and ensure data rendering
      navigateToTourView(targetView);

      // 2. Poll until destination view section is active and ready, then launch page tour
      let retries = 0;
      const maxRetries = 10;
      const checkInterval = 60;

      function tryStartTour() {
        const activeSection = document.querySelector('.view-section.active');
        const targetSection = views[targetView];

        if (activeSection === targetSection || retries >= maxRetries) {
          // Immediately launch destination page tour starting at Step 1
          startPageTour(tourKey);
        } else {
          retries++;
          setTimeout(tryStartTour, checkInterval);
        }
      }

      setTimeout(tryStartTour, 60);
    }

    // 3. "Where Should I Go?" Quick Navigation Cards & Action Links
    document.querySelectorAll('.guide-goal-card, .guide-menu-card, .guide-step-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const action = card.dataset.action;
        const target = card.dataset.target;

        if (action === 'navigate' && target) {
          e.preventDefault();
          e.stopPropagation();
          navigateAndLaunchPageTour(target);
        } else if (action === 'open-chatbot') {
          e.preventDefault();
          e.stopPropagation();
          closeGuideModal();
          const trigger = document.getElementById('placify-chatbot-trigger');
          if (trigger) trigger.click();
        }
      });
    });

    // 4. Contextual "What can I do here?"`;

  if (oldNavHandlerRegex.test(js)) {
    js = js.replace(oldNavHandlerRegex, newNavHandler);
    console.log(`Replaced navigation handlers in ${filePath}`);
  } else {
    console.error(`Could not match oldNavHandlerRegex in ${filePath}`);
    process.exit(1);
  }

  // Also expose navigateAndLaunchPageTour and DESTINATION_TO_TOUR_MAP globally
  const globalExports = `window.startPlacifyGuidedTour = startFullPlatformTour;
    window.startPlacifyPageTour = startPageTour;
    window.navigateAndLaunchPageTour = navigateAndLaunchPageTour;
    window.DESTINATION_TO_TOUR_MAP = DESTINATION_TO_TOUR_MAP;`;

  js = js.replace(
    `window.startPlacifyGuidedTour = startFullPlatformTour;\n    window.startPlacifyPageTour = startPageTour;`,
    globalExports
  );

  fs.writeFileSync(filePath, js, 'utf8');
  console.log(`Updated JS logic in ${filePath}`);
}

console.log('All updates applied successfully!');
