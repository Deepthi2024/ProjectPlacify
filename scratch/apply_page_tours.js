const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.resolve(__dirname, '../js/app.js'),
  path.resolve(__dirname, '../frontend/js/app.js')
];

for (const filePath of targetFiles) {
  if (!fs.existsSync(filePath)) {
    console.error('File does not exist:', filePath);
    process.exit(1);
  }

  let code = fs.readFileSync(filePath, 'utf8');

  // 1. Update ContextualPageGuide toggle to launch startPageTour
  const oldToggleRegex = /toggle\(pageKey, btn\) \{[\s\S]*?banner\.scrollIntoView\(\{ behavior: 'smooth', block: 'nearest' \}\);\s*\}/;
  const newToggle = `toggle(pageKey, btn) {
      startPageTour(pageKey);
    },

    startTour(pageKey) {
      startPageTour(pageKey);
    }`;

  if (oldToggleRegex.test(code)) {
    code = code.replace(oldToggleRegex, newToggle);
    console.log(`Updated ContextualPageGuide.toggle in ${filePath}`);
  } else {
    console.warn(`ContextualPageGuide.toggle regex did not match in ${filePath}`);
  }

  // 2. Replace the entire tour section from:
  // "// 4. Contextual "What can I do here?" Page Help Buttons"
  // to:
  // "window.startPlacifyGuidedTour = startGuidedTour;"
  const startMarker = `    // 4. Contextual "What can I do here?" Page Help Buttons`;
  const endMarker = `    window.startPlacifyGuidedTour = startGuidedTour;`;

  const startIndex = code.indexOf(startMarker);
  const endIndex = code.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    console.error(`Markers not found in ${filePath}! startIndex: ${startIndex}, endIndex: ${endIndex}`);
    process.exit(1);
  }

  const newTourBlock = `    // 4. Contextual "What can I do here?" Page Help Buttons
    document.querySelectorAll('.page-context-help-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pageKey = btn.dataset.pageHelp || getCurrentActiveViewKey() || 'roadmap';
        startPageTour(pageKey);
      });
    });

    // =======================================================================
    // STEP-BY-STEP INTERACTIVE GUIDED TOUR ENGINE
    // Dedicated page-specific walkthroughs + full-platform onboarding tour
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
    let activeTourSteps = [];

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

    // =======================================================================
    // PAGE-SPECIFIC INTERACTIVE TOUR DEFINITIONS
    // =======================================================================
    const PAGE_SPECIFIC_TOURS = {
      // 1. ROADMAP PAGE TOUR
      roadmap: [
        {
          view: 'roadmap',
          selector: '#view-roadmap .section-title, #view-roadmap h2',
          fallbackSelector: '#view-roadmap',
          viewTag: 'Roadmap',
          title: 'Roadmap Overview & Architecture',
          whatIsThis: 'Welcome to your personalized learning roadmap! This curriculum organizes your placement journey into sequential phases tailored to your domain, target timeline, and diagnostic baseline.',
          whatToDo: 'Review your overall multi-phase curriculum. Each phase builds progressive mastery from foundational concepts to advanced interview-ready systems.',
          whatNext: 'Next, let\\'s examine your active profile parameters and goals.'
        },
        {
          view: 'roadmap',
          selector: '#roadmap-profile-summary-bar',
          fallbackSelector: '#rm-summary-domain',
          viewTag: 'Roadmap',
          title: 'Domain & Target Commitment Profile',
          whatIsThis: 'Displays your selected tech domain, preparation timeline, daily commitment, and diagnostic baseline score.',
          whatToDo: 'Verify that your target domain and daily hours reflect your placement goals. Your roadmap adapts dynamically to this profile.',
          whatNext: 'Next, let\\'s explore the multi-level roadmap views.'
        },
        {
          view: 'roadmap',
          selector: '#roadmap-breadcrumbs',
          fallbackSelector: '#roadmap-level-indicator',
          viewTag: 'Roadmap',
          title: 'Monthly, Weekly & Phase-Wise Views',
          whatIsThis: 'Your curriculum has 3 drill-down levels: Level 1 (Monthly Milestones), Level 2 (Weekly View), and Level 3 (Phase-Wise Tasks).',
          whatToDo: 'Click these breadcrumb buttons to switch between high-level milestone overviews and detailed weekly plans as you unlock them.',
          whatNext: 'Next, let\\'s examine individual phase cards and their objectives.'
        },
        {
          view: 'roadmap',
          selector: '#roadmap-nodes-container .month-card, #roadmap-nodes-container .roadmap-phase-card, #roadmap-nodes-container',
          fallbackSelector: '#roadmap-nodes-container',
          viewTag: 'Roadmap',
          title: 'Phase Cards & Learning Objectives',
          whatIsThis: 'Each card represents a curriculum phase featuring difficulty tier, estimated study hours, topic tags, and clear learning objectives.',
          whatToDo: 'Click any phase card or its "Explore Weeks" button to drill down into weekly goals, practice focus, and concept prerequisites.',
          whatNext: 'Next, see how to start your journey and map real calendar dates.'
        },
        {
          view: 'roadmap',
          selector: '#start-journey-btn, #start-journey-banner',
          fallbackSelector: '#start-journey-banner',
          viewTag: 'Roadmap',
          title: 'Start My Journey & Phase Launch',
          whatIsThis: 'Your journey launch controls. Clicking "Start My Journey" pins Day 1 to today\\'s calendar date and schedules all milestones on real calendar dates.',
          whatToDo: 'Click "Start My Journey" to pin your milestones to real calendar dates, then click "Enter Daily Learning Hub" to begin your assigned tasks.',
          whatNext: 'Finally, let\\'s see how to enter the Daily Hub.'
        },
        {
          view: 'roadmap',
          selector: '#enter-daily-hub-btn',
          fallbackSelector: '#view-roadmap',
          viewTag: 'Roadmap',
          title: 'Enter Daily Learning Hub',
          whatIsThis: 'Your gateway to daily study. It transitions you from broad roadmap planning to your active day-by-day learning cockpit.',
          whatToDo: 'Click "Enter Daily Learning Hub" whenever you are ready to study curated resources, complete coding tasks, and log your progress.',
          whatNext: 'You are now ready to master your roadmap! Enter Daily Hub to begin Phase 1.'
        }
      ],

      // 2. DAILY LEARNING HUB TOUR
      dailyHub: [
        {
          view: 'dailyHub',
          selector: '#current-task-title, #current-day-badge',
          fallbackSelector: '#view-daily-hub .glass-card',
          viewTag: 'Daily Hub',
          title: 'Phase Tasks & Study Cockpit',
          whatIsThis: 'Your day-to-day study dashboard. It displays the active phase, assigned concepts, workload duration, and difficulty level.',
          whatToDo: 'Review today\\'s study theme and target workload to plan your study session effectively.',
          whatNext: 'Next, let\\'s look at your daily progress tracker.'
        },
        {
          view: 'dailyHub',
          selector: '#day-progress-bar-container, #current-day-progress-badge',
          fallbackSelector: '#current-day-progress-badge',
          viewTag: 'Daily Hub',
          title: 'Task Completion Progress',
          whatIsThis: 'Tracks the percentage of tasks finished for the current phase. As you check off items, this bar advances in real time.',
          whatToDo: 'Complete and check off all assigned tasks to reach 100%, earn XP, maintain your streak, and unlock the Phase Assessment.',
          whatNext: 'Next, let\\'s inspect recommended learning resources.'
        },
        {
          view: 'dailyHub',
          selector: '#suggested-resources-list .resource-card, #suggested-resources-list',
          fallbackSelector: '#suggested-resources-list',
          viewTag: 'Daily Hub',
          title: 'Curated Learning Materials',
          whatIsThis: 'Placify aggregates verified YouTube lectures, official documentation, and coding practice modules tailored to your active topics.',
          whatToDo: 'Click any resource to watch the video or read documentation. When finished studying, tick the checkbox to mark the task completed.',
          whatNext: 'Next, see how task completion unlocks the Phase Assessment.'
        },
        {
          view: 'dailyHub',
          selector: '#start-concept-quiz-btn, #skip-day-assessment-btn',
          fallbackSelector: '#start-concept-quiz-btn',
          viewTag: 'Daily Hub',
          title: 'Take Phase Assessment',
          whatIsThis: 'A concept assessment grounded directly in the resources you just studied. It verifies your retention before moving to the next milestone.',
          whatToDo: 'Complete all phase tasks to enable this button, then click it to take the quiz. Scoring 70%+ awards mastery points and unlocks the next milestone.',
          whatNext: 'Next, see how to navigate back to your roadmap anytime.'
        },
        {
          view: 'dailyHub',
          selector: '#top-back-to-weekly-roadmap-btn, #view-all-roadmap-btn',
          fallbackSelector: '#view-all-roadmap-btn',
          viewTag: 'Daily Hub',
          title: 'Return to Roadmap',
          whatIsThis: 'Allows you to switch back to the multi-level roadmap view to check overall milestones or choose another phase.',
          whatToDo: 'Click "Back to Weekly Roadmap" whenever you want to inspect earlier completed modules or view upcoming phases.',
          whatNext: 'Work through today\\'s tasks and check them off to keep your streak alive!'
        }
      ],

      // 3. INTERVIEW PREPARATION STUDIO TOUR
      interviewQuestions: [
        {
          view: 'interviewQuestions',
          selector: '#interview-domain-badge-container, #view-interview-questions .section-title',
          fallbackSelector: '#view-interview-questions',
          viewTag: 'Interview Prep',
          title: 'Interview Studio & Domain Context',
          whatIsThis: 'Your central hub for technical interview prep, calibrated to your selected engineering domain and current roadmap stage.',
          whatToDo: 'Verify your target domain badge. All question sets, problem platforms, and AI evaluations adapt directly to this domain.',
          whatNext: 'Next, let\\'s explore external learning platforms.'
        },
        {
          view: 'interviewQuestions',
          selector: '#select-option-external-btn',
          fallbackSelector: '#interview-landing-hub',
          viewTag: 'Interview Prep',
          title: 'Learn from Other Websites',
          whatIsThis: 'A curated directory linking directly to LeetCode, GeeksforGeeks, MDN, HackerRank, and NeetCode problem archives.',
          whatToDo: 'Click this card to browse vetted practice platforms, filter by resource type, and solve authentic interview problems on external sites.',
          whatNext: 'Next, see how in-browser AI simulation works.'
        },
        {
          view: 'interviewQuestions',
          selector: '#select-option-placify-btn',
          fallbackSelector: '#interview-landing-hub',
          viewTag: 'Interview Prep',
          title: 'Prepare on Placify AI (In-Browser Simulator)',
          whatIsThis: 'An interactive mock interview engine powered by AI that generates realistic technical interview questions tailored to your skills.',
          whatToDo: 'Click this card to start a 5-question mock interview. You can type answers, receive AI rubrics, and view model solutions.',
          whatNext: 'Next, see how questions are displayed and studied.'
        },
        {
          view: 'interviewQuestions',
          selector: '#interview-ai-practice-view, #interview-ext-resource-cards, #interview-landing-hub',
          fallbackSelector: '#view-interview-questions',
          viewTag: 'Interview Prep',
          title: 'Studying Solutions & Generating More',
          whatIsThis: 'In Placify AI practice sessions, each question reveals key concept breakdowns, optimal time/space complexity, and sample answers.',
          whatToDo: 'Study the model responses, note recurring interview patterns, and click "Generate New Batch" whenever you want additional practice.',
          whatNext: 'Pick a preparation mode and test your recall with today\\'s interview problems!'
        }
      ],

      // 4. TECH NEWS FEED TOUR
      techNews: [
        {
          view: 'techNews',
          selector: '#news-personalized-tag, #view-tech-news .section-title',
          fallbackSelector: '#view-tech-news',
          viewTag: 'Tech News',
          title: 'Real-Time Tech News Feed',
          whatIsThis: 'A live aggregator gathering news from Hacker News, Dev.to, Google News, and Tavily, focused on developments relevant to your domain.',
          whatToDo: 'Browse latest engineering headlines, framework releases, architecture trends, and hiring industry shifts.',
          whatNext: 'Next, see how feed freshness is tracked.'
        },
        {
          view: 'techNews',
          selector: '#news-last-updated',
          fallbackSelector: '#news-personalized-tag',
          viewTag: 'Tech News',
          title: 'Live Feed Freshness',
          whatIsThis: 'Shows the timestamp of the latest news synchronization. Placify regularly pulls new stories to keep your tech awareness fresh.',
          whatToDo: 'Check this badge to ensure you are viewing the most recent stories before campus discussions or interviews.',
          whatNext: 'Next, see how to open and read articles.'
        },
        {
          view: 'techNews',
          selector: '#tech-news-feed-container .news-card, #tech-news-feed-container',
          fallbackSelector: '#tech-news-feed-container',
          viewTag: 'Tech News',
          title: 'Reading Articles & External Links',
          whatIsThis: 'Each card provides a summary, source publication badge, publication date, and direct external link.',
          whatToDo: 'Click any article card or "Read Article" button to open the full story on the publisher\\'s official website in a new browser tab.',
          whatNext: 'Read an article today to stay sharp on real-world engineering discussions!'
        }
      ],

      // 5. PROGRESS & ANALYTICS TOUR
      progressAnalytics: [
        {
          view: 'progressAnalytics',
          selector: '#analytics-mastery-num',
          fallbackSelector: '#view-progress-analytics .glass-card',
          viewTag: 'Analytics',
          title: 'Overall Domain Mastery',
          whatIsThis: 'Your cumulative progress across all roadmap milestones, calculated from completed study tasks and passed assessments.',
          whatToDo: 'Aim to increase this percentage weekly by completing your assigned daily modules and passing phase evaluations.',
          whatNext: 'Next, check your study consistency streak.'
        },
        {
          view: 'progressAnalytics',
          selector: '#analytics-streak-num',
          fallbackSelector: '#analytics-xp-num',
          viewTag: 'Analytics',
          title: 'Daily Study Streak',
          whatIsThis: 'Counts consecutive days you have engaged with Placify AI by completing tasks, taking quizzes, or reading resources.',
          whatToDo: 'Log in and finish at least one task every day to keep your flame streak alive and build consistent study habits.',
          whatNext: 'Next, let\\'s look at your XP and Skill Tier.'
        },
        {
          view: 'progressAnalytics',
          selector: '#analytics-xp-num, #analytics-tier-name',
          fallbackSelector: '#analytics-tier-name',
          viewTag: 'Analytics',
          title: 'XP Points & Skill Tier Upgrades',
          whatIsThis: 'Every finished task and quiz awards XP. As your XP grows, your tier advances from Beginner to Intermediate to Advanced.',
          whatToDo: 'Earn XP to level up your tier, demonstrating placement readiness across company skill benchmarks.',
          whatNext: 'Next, see how to spot topics that need revision.'
        },
        {
          view: 'progressAnalytics',
          selector: '#assessment-result-summary',
          fallbackSelector: '#view-progress-analytics',
          viewTag: 'Analytics',
          title: 'Assessment Feedback & Topic Revision',
          whatIsThis: 'Summarizes recent quiz scores and flags weak concepts that require revision before your campus interviews.',
          whatToDo: 'If a topic is flagged for review, return to that phase on your Roadmap to re-read the resources and retake the assessment.',
          whatNext: 'Next, check your quick action controls.'
        },
        {
          view: 'progressAnalytics',
          selector: '#skip-interview-btn, #take-interview-btn, #continue-learning-btn',
          fallbackSelector: '#view-progress-analytics',
          viewTag: 'Analytics',
          title: 'Next Actions & Learning Progression',
          whatIsThis: 'Action buttons directing you to the next logical step in your preparation pipeline.',
          whatToDo: 'Use these controls to quickly transition into interview practice or continue with the next daily learning module.',
          whatNext: 'Review your analytics weekly to calibrate your prep and target weak spots!'
        }
      ],

      // 6. INTERNSHIP DISCOVERY TOUR
      internships: [
        {
          view: 'internships',
          selector: '#internship-count-badge, #view-internships .section-title',
          fallbackSelector: '#view-internships',
          viewTag: 'Internships',
          title: 'Real-Time Internship Discovery',
          whatIsThis: 'Curated internship postings pulled from live job APIs, automatically filtered to match your chosen tech domain.',
          whatToDo: 'Browse open student internships, entry-level engineering roles, and apprenticeship programs.',
          whatNext: 'Next, let\\'s explore search filters and keywords.'
        },
        {
          view: 'internships',
          selector: '.internships-filter-bar',
          fallbackSelector: '#internship-search-input',
          viewTag: 'Internships',
          title: 'Filter by Role, Domain & Location',
          whatIsThis: 'Allows you to refine job search results by specific programming languages, role titles, and geographic preferences (e.g. Remote, India).',
          whatToDo: 'Enter keywords like "React" or "Python", choose your preferred location, and click "Search Internships" to update the listings.',
          whatNext: 'Next, see how to inspect role details and apply.'
        },
        {
          view: 'internships',
          selector: '#internships-cards-container .internship-card, #internships-cards-container',
          fallbackSelector: '#internships-cards-container',
          viewTag: 'Internships',
          title: 'Reviewing Roles & Applying Externally',
          whatIsThis: 'Each listing displays company name, role location, technical tags, and an "Apply on Employer Site" button.',
          whatToDo: 'Click "Apply on Employer Site" to open the company\\'s official careers portal in a new browser tab and submit your resume.',
          whatNext: 'Crucial step: understand how to record your application in Placify.'
        },
        {
          view: 'internships',
          selector: '#refresh-internships-btn, #view-internships',
          fallbackSelector: '#view-internships',
          viewTag: 'Internships',
          title: 'Confirming Submission vs Opening Links',
          whatIsThis: 'IMPORTANT: Clicking an external link only opens the employer\\'s page—it does not automatically record your application.',
          whatToDo: 'After you finish submitting on the company portal, return to Placify and click "Application Submitted" on the prompt to track it in My Applications.',
          whatNext: 'Find a matching role today, apply externally, and log it to your tracker!'
        }
      ],

      // 7. MY APPLICATIONS TRACKER TOUR
      myApplications: [
        {
          view: 'myApplications',
          selector: '.ats-hero-banner',
          fallbackSelector: '#ats-hero-total-num',
          viewTag: 'Applications',
          title: 'Total Applications Submitted Counter',
          whatIsThis: 'Your personal placement ATS (Application Tracking System) hero banner showing verified applications you\\'ve submitted.',
          whatToDo: 'Monitor your total application volume. Aim for continuous pipeline growth during campus hiring cycles.',
          whatNext: 'Next, let\\'s explore your saved application cards.'
        },
        {
          view: 'myApplications',
          selector: '#my-applications-grid .application-card, #my-applications-grid',
          fallbackSelector: '#my-applications-grid',
          viewTag: 'Applications',
          title: 'Recruitment Pipelines & Status Stages',
          whatIsThis: 'Each card records the company, job role, submission date, and current stage (Applied, Assessment, Interview, Offer, or Rejected).',
          whatToDo: 'Review your active job leads in one place to prepare ahead of upcoming assessments and interviews.',
          whatNext: 'Next, see how to update stages and notes.'
        },
        {
          view: 'myApplications',
          selector: '#refresh-ats-btn, #my-applications-grid',
          fallbackSelector: '#refresh-ats-btn',
          viewTag: 'Applications',
          title: 'Status Updates, Dates & Recruiter Notes',
          whatIsThis: 'When a company replies, you can update the status stage and log recruiter notes, test links, or scheduled interview times.',
          whatToDo: 'Click "Update Status" on any card or refresh your tracker to record changes and prepare for upcoming interview rounds.',
          whatNext: 'Keep your tracker up-to-date so you never miss an interview milestone!'
        }
      ],

      // 8. DOMAIN SELECTION TOUR
      domainSelection: [
        {
          view: 'domainSelection',
          selector: '#view-domain-selection .section-title, #domain-selection-subtitle',
          fallbackSelector: '#view-domain-selection',
          viewTag: 'Domain Setup',
          title: 'Choose Your Tech Domain',
          whatIsThis: 'The first foundation of your Placify curriculum. Select from 8 high-demand engineering specializations including Full-Stack, AI/ML, Cloud & DevOps, and Cyber Security.',
          whatToDo: 'Review each specialization card to find the domain that matches your career ambitions and placement goals.',
          whatNext: 'Next, explore individual domain cards.'
        },
        {
          view: 'domainSelection',
          selector: '#domain-selection-grid .domain-card, #domain-selection-grid',
          fallbackSelector: '#domain-selection-grid',
          viewTag: 'Domain Setup',
          title: 'Domain Details & Industry Demand',
          whatIsThis: 'Each card highlights required core competencies, placement salary benchmarks, and current industry hiring demand.',
          whatToDo: 'Click on the domain you wish to master. A glowing border confirms your selection.',
          whatNext: 'Next, see how to proceed to Phase 2 baseline setup.'
        },
        {
          view: 'domainSelection',
          selector: '#confirm-domain-btn',
          fallbackSelector: '#view-domain-selection',
          viewTag: 'Domain Setup',
          title: 'Confirm & Proceed to Baseline Setup',
          whatIsThis: 'Locks in your chosen domain and advances you to Phase 2 (Proficiency Baseline & Diagnostic Assessment Setup).',
          whatToDo: 'Click "Continue with Selected Domain" to save your choice and calibrate your custom curriculum.',
          whatNext: 'Select your domain and take the next step toward your career goals!'
        }
      ],

      // 9. PHASE 2 SETUP & DIAGNOSTIC BASELINE TOUR
      diagnostic: [
        {
          view: 'diagnostic',
          selector: '#view-diagnostic .section-title',
          fallbackSelector: '#view-diagnostic',
          viewTag: 'Phase 2 Setup',
          title: 'Proficiency Baseline Declaration',
          whatIsThis: 'Declares your starting competency level so the AI doesn\\'t teach you what you already know or overwhelm you with advanced concepts.',
          whatToDo: 'Review the three proficiency levels to choose where you realistically stand in your chosen domain.',
          whatNext: 'Next, inspect the proficiency level cards.'
        },
        {
          view: 'diagnostic',
          selector: '.manual-level-card.active, .manual-level-card',
          fallbackSelector: '#selected-level-pill',
          viewTag: 'Phase 2 Setup',
          title: 'Select Beginner, Intermediate, or Advanced',
          whatIsThis: 'Beginner focuses on fundamentals from scratch. Intermediate fast-tracks to practical applications. Advanced dives into system design and optimization.',
          whatToDo: 'Click the level that matches your experience. Your roadmap syllabus updates dynamically to show what topics you will study.',
          whatNext: 'Next, choose whether to validate with the diagnostic quiz or skip to roadmap.'
        },
        {
          view: 'diagnostic',
          selector: '#start-quiz-btn, #skip-to-roadmap-btn',
          fallbackSelector: '#view-diagnostic',
          viewTag: 'Phase 2 Setup',
          title: 'Validate with Quiz or Generate Directly',
          whatIsThis: 'You can validate your baseline with our 15-question AI Diagnostic Quiz for an objective gap analysis, or generate your roadmap immediately.',
          whatToDo: 'Click "Start Diagnostic Quiz" to test your recall, or "Skip Quiz & Generate Roadmap" to begin studying right away.',
          whatNext: 'Choose your preferred path to generate your personalized roadmap!'
        }
      ],

      // 10. ASSESSMENT REPORT TOUR
      assessmentReport: [
        {
          view: 'assessmentReport',
          selector: '.tier-badge-card',
          fallbackSelector: '#tier-score-display',
          viewTag: 'Assessment Report',
          title: 'Verified Baseline Score & Tier',
          whatIsThis: 'Your objective diagnostic evaluation results, displaying your percentage score and validated skill tier (Beginner, Intermediate, Advanced).',
          whatToDo: 'Check your verified tier. Placify uses this exact baseline score to calibrate the depth and pace of your curriculum.',
          whatNext: 'Next, let\\'s examine your identified knowledge gaps.'
        },
        {
          view: 'assessmentReport',
          selector: '#gaps-list-container',
          fallbackSelector: '#view-assessment-report',
          viewTag: 'Assessment Report',
          title: 'Identified Knowledge Gaps (Weak Topics)',
          whatIsThis: 'Lists specific conceptual topics where diagnostic questions were missed. These represent your highest-priority improvement areas.',
          whatToDo: 'Review these weak areas. Placify automatically schedules focused revision modules for these concepts in your roadmap.',
          whatNext: 'Next, let\\'s check applied skills and mastered topics.'
        },
        {
          view: 'assessmentReport',
          selector: '#intermediate-list-container, #mastered-list-container',
          fallbackSelector: '#view-assessment-report',
          viewTag: 'Assessment Report',
          title: 'Applied Skills & Mastered Concepts',
          whatIsThis: 'Displays intermediate skills and mastered prerequisites where you demonstrated strong technical recall.',
          whatToDo: 'Review your strengths so you know what topics can be skimmed quickly during your study sessions.',
          whatNext: 'Next, see how to generate your customized roadmap.'
        },
        {
          view: 'assessmentReport',
          selector: '#generate-roadmap-btn, #view-assessment-report button.btn-primary',
          fallbackSelector: '#view-assessment-report',
          viewTag: 'Assessment Report',
          title: 'Generate Personalized Roadmap',
          whatIsThis: 'Triggers the AI Roadmap Generator to build your customized multi-phase curriculum based on your diagnostic results.',
          whatToDo: 'Click "Generate Personalized Roadmap" to construct your tailored learning roadmap and enter Phase 1.',
          whatNext: 'Click the button to embark on your placement preparation journey!'
        }
      ],

      // 11. ASSESSMENT EVALUATION REPORT TOUR
      assessmentEvaluation: [
        {
          view: 'assessmentEvaluation',
          selector: '#eval-phase-title, #eval-phase-badge',
          fallbackSelector: '#view-assessment-evaluation',
          viewTag: 'Evaluation',
          title: 'Phase Assessment Evaluation Report',
          whatIsThis: 'Detailed evaluation breakdown for your submitted phase assessment, generated to provide immediate diagnostic feedback.',
          whatToDo: 'Review your overall phase score and see whether you met the 70% passing threshold.',
          whatNext: 'Next, examine question-by-question breakdown.'
        },
        {
          view: 'assessmentEvaluation',
          selector: '#assessment-evaluation-content',
          fallbackSelector: '#view-assessment-evaluation',
          viewTag: 'Evaluation',
          title: 'Question Breakdown & Model Solutions',
          whatIsThis: 'Examines each question with your selected option, the correct answer, and an in-depth conceptual explanation.',
          whatToDo: 'Carefully review missed questions to understand the underlying theory and avoid repeating mistakes in interviews.',
          whatNext: 'Next, see recommended revision topics.'
        },
        {
          view: 'assessmentEvaluation',
          selector: '#eval-bottom-retake-btn, #assessment-evaluation-content',
          fallbackSelector: '#assessment-evaluation-content',
          viewTag: 'Evaluation',
          title: 'Targeted Revision & Retake Option',
          whatIsThis: 'Flags concepts needing revision and allows you to retake the assessment once you\\'ve reviewed the materials.',
          whatToDo: 'If your score is below 70%, retake the quiz after reviewing recommended concepts to unlock the next roadmap phase.',
          whatNext: 'Finally, see how to return to your roadmap.'
        },
        {
          view: 'assessmentEvaluation',
          selector: '#eval-bottom-back-roadmap-btn',
          fallbackSelector: '#view-assessment-evaluation',
          viewTag: 'Evaluation',
          title: 'Back to Weekly Roadmap',
          whatIsThis: 'Returns you to your roadmap view to see your updated milestone progress and continue with subsequent phases.',
          whatToDo: 'Click "Back to Weekly Roadmap" to resume your study journey.',
          whatNext: 'You\\'re ready to continue advancing through your roadmap!'
        }
      ],

      // 12. WELCOME / ONBOARDING SCREEN TOUR
      onboarding: [
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
          viewTag: 'Welcome',
          title: 'Platform Capabilities',
          whatIsThis: 'Placify covers 8 tech domains with adaptive daily roadmaps, company assessment patterns, and Groq-powered AI mock interviews.',
          whatToDo: 'Sign in or register to unlock full personalized access and begin your placement preparation.',
          whatNext: 'Finally, meet your AI mentor.'
        },
        {
          view: null,
          selector: '#placify-chatbot-trigger',
          fallbackSelector: '#auth-choice-screen',
          viewTag: 'AI Assistant',
          title: 'Placify AI Assistant',
          whatIsThis: 'Your 24/7 placement mentor. Ask questions about domain choices, roadmap customizations, or platform features anytime.',
          whatToDo: 'Click the sparkle button in the bottom right corner for immediate guidance.',
          whatNext: 'Click "Finish Tour" to get started!'
        }
      ],

      // 13. FALLBACK DEFAULT TOUR
      default: [
        {
          view: null,
          selector: '#main-navbar',
          fallbackSelector: '#main-navbar',
          viewTag: 'Guide',
          title: 'Placify Navigation & Sections',
          whatIsThis: 'The top navigation bar provides access to your Roadmap, Daily Hub, Interview Prep, Tech News, Analytics, and Internships.',
          whatToDo: 'Click any tab in the navigation bar to switch directly to that section.',
          whatNext: 'Next, see how to get help anytime with your AI Assistant.'
        },
        {
          view: null,
          selector: '#placify-chatbot-trigger',
          fallbackSelector: '#placify-chatbot-trigger',
          viewTag: 'AI Assistant',
          title: 'Placify AI Assistant',
          whatIsThis: 'Your 24/7 placement mentor. The floating sparkle button understands whatever page you are currently viewing and provides instant answers.',
          whatToDo: 'Click this button anytime you have questions about a topic, need a hint on a coding problem, or want study tips.',
          whatNext: 'You\\'re all set! Explore the active page features or continue your roadmap.'
        }
      ]
    };

    // Full End-to-End Walkthrough for Authenticated Users (Across Key Platform Features)
    const AUTH_TOUR_STEPS = [
      // 1. Roadmap Overview
      {
        view: 'roadmap',
        selector: '#view-roadmap .section-title, #view-roadmap h2',
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
        selector: '#roadmap-nodes-container .month-card, #roadmap-nodes-container .roadmap-phase-card, #roadmap-nodes-container',
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
        selector: '#start-journey-btn, #start-journey-banner',
        fallbackSelector: '#start-journey-banner',
        viewTag: 'Roadmap',
        title: 'Start Journey & Enter Daily Hub',
        whatIsThis: 'Your journey launch controls. Clicking "Start My Journey" maps Day 1 to today\\'s calendar date and unlocks your daily study cockpit.',
        whatToDo: 'Click "Start My Journey" to pin your milestones to real calendar dates, then click "Enter Daily Learning Hub" to begin your assigned tasks.',
        whatNext: 'Next, let\\'s explore the Daily Learning Hub.'
      },
      // 6. Daily Hub & Task Completion
      {
        view: 'dailyHub',
        selector: '#view-daily-hub .daily-hub-layout, #current-task-title',
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
        selector: '#select-option-external-btn, #view-interview-questions .glass-card',
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
        selector: '#news-personalized-tag, #view-tech-news .glass-card',
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
        selector: '#analytics-mastery-num, #view-progress-analytics .glass-card',
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
        selector: '#internship-count-badge, #view-internships .glass-card',
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
        selector: '.ats-hero-banner, #view-my-applications .glass-card',
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
      if (activeTourSteps && activeTourSteps.length > 0) {
        return activeTourSteps;
      }
      const activeSession = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
      return activeSession ? AUTH_TOUR_STEPS : LANDING_TOUR_STEPS;
    }

    // Launch page-specific tour without navigating away from the current page
    function startPageTour(pageKey) {
      const curView = document.querySelector('.view-section.active');
      if (curView && (curView.id === 'view-concept-quiz' || curView.id === 'view-diagnostic-quiz')) {
        console.warn('[Tour Guard] Tour suppressed during active assessment.');
        return;
      }

      closeGuideModal();

      const activeViewKey = getCurrentActiveViewKey();
      const targetPageKey = pageKey || activeViewKey || 'roadmap';

      const steps = PAGE_SPECIFIC_TOURS[targetPageKey] || PAGE_SPECIFIC_TOURS.default || PAGE_SPECIFIC_TOURS.roadmap;
      activeTourSteps = steps;
      currentTourStepIndex = 0;
      isTourActive = true;

      // Close any legacy contextual guide banner
      document.querySelectorAll('.page-context-help-card').forEach(b => b.remove());

      if (tourContainer) tourContainer.style.display = 'block';

      setTimeout(() => {
        renderTourStep(0);
      }, 70);
    }

    // Launch full platform onboarding tour from How to Use modal or Welcome popup
    function startFullPlatformTour() {
      const curView = document.querySelector('.view-section.active');
      if (curView && (curView.id === 'view-concept-quiz' || curView.id === 'view-diagnostic-quiz')) {
        console.warn('[Tour Guard] Tour suppressed during active assessment.');
        return;
      }

      closeGuideModal();

      const activeSession = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
      if (!activeSession) {
        activeTourSteps = LANDING_TOUR_STEPS;
        currentTourStepIndex = 0;
        isTourActive = true;
        if (tourContainer) tourContainer.style.display = 'block';
        renderTourStep(0);
        return;
      }

      activeTourSteps = AUTH_TOUR_STEPS;
      const curViewKey = getCurrentActiveViewKey();
      if (curViewKey !== 'roadmap') {
        navigateToTourView('roadmap');
      }

      currentTourStepIndex = 0;
      isTourActive = true;
      if (tourContainer) tourContainer.style.display = 'block';

      setTimeout(() => {
        renderTourStep(0);
      }, 140);
    }

    // Legacy alias
    const startGuidedTour = startFullPlatformTour;

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
      if (!steps || steps.length === 0 || index < 0 || index >= steps.length) {
        endGuidedTour(true);
        return;
      }

      currentTourStepIndex = index;
      const step = steps[index];

      // Multi-page navigation: if step requires a different view, navigate first!
      if (step.view) {
        const curViewKey = getCurrentActiveViewKey();
        if (curViewKey && curViewKey !== step.view) {
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
        let el = null;
        if (step.selector) {
          try { el = document.querySelector(step.selector); } catch(e) {}
        }
        if ((!el || el.offsetParent === null) && step.fallbackSelector) {
          try { el = document.querySelector(step.fallbackSelector); } catch(e) {}
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
      if (tourStepViewTag) tourStepViewTag.textContent = step.viewTag || 'Guide';
      if (tourStepTitle) tourStepTitle.textContent = step.title;

      if (tourStepWhatIsThis) tourStepWhatIsThis.textContent = step.whatIsThis || step.desc || '';
      if (tourStepWhatToDo) tourStepWhatToDo.textContent = step.whatToDo || step.action || '';
      if (tourStepWhatNext) tourStepWhatNext.textContent = step.whatNext || '';

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
        // Fallback: center popover gracefully if no element is present
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
      startTourFromModalBtn.addEventListener('click', startFullPlatformTour);
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

    // Expose launchers globally
    window.startPlacifyGuidedTour = startFullPlatformTour;
    window.startPlacifyPageTour = startPageTour;`;

  code = code.slice(0, startIndex) + newTourBlock + code.slice(endIndex + endMarker.length);
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Successfully updated tour engine in ${filePath}`);
}
