/**
 * Placify Main Application UI Controller & Orchestration Wiring
 */

document.addEventListener('DOMContentLoaded', () => {
  const supervisor = window.placifySupervisor;

  // Global UI references
  const views = {
    onboarding: document.getElementById('view-onboarding'),
    domainSelection: document.getElementById('view-domain-selection'),
    diagnostic: document.getElementById('view-diagnostic'),
    assessmentReport: document.getElementById('view-assessment-report'),
    roadmap: document.getElementById('view-roadmap'),
    dailyHub: document.getElementById('view-daily-hub'),
    conceptQuiz: document.getElementById('view-concept-quiz'),
    assessmentEvaluation: document.getElementById('view-assessment-evaluation'),
    progressAnalytics: document.getElementById('view-progress-analytics'),
    interviewQuestions: document.getElementById('view-interview-questions'),
    techNews: document.getElementById('view-tech-news'),
    internships: document.getElementById('view-internships'),
    myApplications: document.getElementById('view-my-applications')
  };

  const consoleContainer = document.getElementById('agent-console');

  // Register live agent logging callback
  window.onAgentLog = function(logEntry) {
    if (!consoleContainer) return;
    const div = document.createElement('div');
    div.className = 'console-entry';
    div.innerHTML = `
      <span class="console-time">[${logEntry.timestamp}]</span>
      <span class="console-agent ${logEntry.agentName}">${logEntry.agentName}</span>
      <span class="console-text"><strong>${logEntry.action}:</strong> ${logEntry.details}</span>
    `;
    consoleContainer.prepend(div);
  };

  // Protected views requiring authentication
  const PROTECTED_VIEWS = ['roadmap', 'dailyHub', 'progressAnalytics', 'assessmentEvaluation', 'techNews', 'internships', 'myApplications', 'diagnostic', 'domainSelection', 'conceptQuiz', 'interviewQuestions', 'assessmentReport'];

  const ROUTE_PATH_MAP = {
    '/': 'onboarding',
    '/login': 'onboarding',
    '/register': 'onboarding',
    '/dashboard': 'roadmap',
    '/roadmap': 'roadmap',
    '/tasks': 'dailyHub',
    '/daily-hub': 'dailyHub',
    '/assessment-evaluation': 'assessmentEvaluation',
    '/evaluation': 'assessmentEvaluation',
    '/analytics': 'progressAnalytics',
    '/progress': 'progressAnalytics',
    '/profile': 'progressAnalytics',
    '/tech-news': 'techNews',
    '/internships': 'internships',
    '/applications': 'myApplications',
    '/my-applications': 'myApplications',
    '/domain-selection': 'domainSelection',
    '/diagnostic': 'diagnostic'
  };

  const HASH_MAP = {
    '#login': 'onboarding',
    '#register': 'onboarding',
    '#dashboard': 'roadmap',
    '#roadmap': 'roadmap',
    '#tasks': 'dailyHub',
    '#dailyHub': 'dailyHub',
    '#assessmentevaluation': 'assessmentEvaluation',
    '#evaluation': 'assessmentEvaluation',
    '#analytics': 'progressAnalytics',
    '#progress': 'progressAnalytics',
    '#profile': 'progressAnalytics',
    '#techNews': 'techNews',
    '#internships': 'internships',
    '#myApplications': 'myApplications'
  };

  function getRequestedViewFromUrl() {
    const hash = (window.location.hash || '').toLowerCase();
    if (hash && HASH_MAP[hash]) return HASH_MAP[hash];

    const pathname = (window.location.pathname || '/').toLowerCase();
    if (ROUTE_PATH_MAP[pathname]) return ROUTE_PATH_MAP[pathname];

    const matchedKey = Object.keys(ROUTE_PATH_MAP).find(p => p !== '/' && pathname.startsWith(p));
    if (matchedKey) return ROUTE_PATH_MAP[matchedKey];

    return 'onboarding';
  }

  function enforceAuthRouteGuard(targetViewKey) {
    const activeSession = supervisor.authAgent.getActiveSession();
    const isProtected = PROTECTED_VIEWS.includes(targetViewKey);

    if (!activeSession && isProtected) {
      console.warn(`🔒 [ROUTE GUARD] Unauthenticated attempt to access protected view '${targetViewKey}'. Redirecting to Login.`);
      
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', '/login');
        }
      }

      updateHeaderUserPill(null);
      return false;
    }

    return true;
  }

  function switchView(viewKey) {
    const activeSession = supervisor.authAgent.getActiveSession();
    const isAllowed = enforceAuthRouteGuard(viewKey);

    const actualView = isAllowed ? viewKey : 'onboarding';

    Object.keys(views).forEach(k => {
      if (views[k]) {
        views[k].classList.remove('active');
      }
    });

    if (views[actualView]) {
      views[actualView].classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Sync active nav item state in top navbar
    document.querySelectorAll('.main-navbar .nav-item').forEach(btn => {
      if (btn.dataset.view === actualView && activeSession) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Sync browser URL location
    const canonicalPath = actualView === 'onboarding' ? '/login' : (`/${actualView === 'dailyHub' ? 'tasks' : (actualView === 'progressAnalytics' ? 'analytics' : (actualView === 'assessmentEvaluation' ? 'assessment-evaluation' : actualView))}`);
    if (window.location.pathname !== canonicalPath && window.history && window.history.pushState) {
      window.history.pushState(null, '', canonicalPath);
    }

    if (actualView === 'techNews' && activeSession) {
      fetchTechNews();
    } else if (actualView === 'internships' && activeSession) {
      fetchInternships();
    } else if (actualView === 'myApplications' && activeSession) {
      fetchMyApplications();
    } else if (actualView === 'progressAnalytics' && activeSession) {
      updateAnalyticsView();
    } else if (actualView === 'assessmentEvaluation' && activeSession) {
      loadAssessmentEvaluationFromState(activeSession.user_id);
    }

    // Asynchronously persist last_route in MongoDB Atlas for authenticated users
    if (activeSession && activeSession.user_id && actualView !== 'onboarding' && actualView !== 'diagnostic' && actualView !== 'domainSelection') {
      fetch('http://localhost:5000/api/user/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: activeSession.user_id, last_route: actualView })
      }).catch(e => console.warn('Could not persist last_route to DB:', e));
    }
  }

  function updateHeaderStats(customStats = null) {
    const activeSession = supervisor.authAgent.getActiveSession();
    const uid = activeSession ? activeSession.user_id : null;
    const state = supervisor.progressTracker.getUserState(uid);

    const level = customStats?.level ?? state?.level ?? 1;
    const xp = customStats?.xp ?? state?.xp ?? 0;
    const streak = customStats?.streak ?? (activeSession ? (state?.streak ?? 0) : 0);
    const badges = customStats?.badges || state?.badges || ['🐣 Fresh Start'];
    const masteryPct = customStats?.masteryPct ?? state?.masteryPct ?? 0;

    const lvlEl = document.getElementById('user-level-val');
    if (lvlEl) lvlEl.textContent = level;
    const xpEl = document.getElementById('user-xp-val');
    if (xpEl) xpEl.textContent = xp;
    const streakEl = document.getElementById('user-streak-val');
    if (streakEl) streakEl.textContent = streak;

    // Badges
    const badgeGrid = document.getElementById('user-badge-grid');
    if (badgeGrid) {
      badgeGrid.innerHTML = badges.map(b => `<div class="badge-item">${escapeHtml(b)}</div>`).join('');
      const badgeCountEl = document.getElementById('badge-count-num');
      if (badgeCountEl) badgeCountEl.textContent = badges.length;
    }

    // Mastery bar
    const bar = document.getElementById('mastery-bar-fill');
    if (bar) {
      bar.style.width = `${masteryPct}%`;
    }
    const num = document.getElementById('mastery-pct-num');
    if (num) {
      num.textContent = `${masteryPct}%`;
    }
  }

  // Update Header User Profile Pill
  function updateHeaderUserPill(profile) {
    const badge = document.getElementById('header-user-badge');
    const nameEl = document.getElementById('user-display-name');
    const domainEl = document.getElementById('user-display-domain');

    if (profile) {
      const domainObj = window.PLACIFY_DATA.findDomain(profile.chosen_domain || profile.domainId || profile);
      badge.style.display = 'flex';
      nameEl.textContent = profile.name || 'User';
      domainEl.textContent = domainObj ? domainObj.name : 'Full-Stack Web Development';
    } else {
      badge.style.display = 'none';
    }
  }

  // Domain Selection Screen Renderer (used post-registration and for login when domain is missing)
  let selectedDomainId = null;
  let selectedDsaLanguage = null;
  const DSA_LANGUAGES = ['C++', 'Java', 'Python', 'JavaScript', 'C'];

  function isDsaDomain(domainId) {
    return String(domainId || '').toLowerCase() === 'dsa';
  }

  function openDsaLanguageSelector(existingLanguage = null) {
    const modal = document.getElementById('dsa-language-modal');
    const options = document.querySelectorAll('.dsa-language-option');
    const confirmBtn = document.getElementById('confirm-dsa-language-btn');
    const errorEl = document.getElementById('dsa-language-error');
    selectedDsaLanguage = DSA_LANGUAGES.includes(existingLanguage) ? existingLanguage : null;
    options.forEach(btn => btn.classList.toggle('selected', btn.dataset.language === selectedDsaLanguage));
    if (confirmBtn) confirmBtn.disabled = !selectedDsaLanguage;
    if (errorEl) errorEl.style.display = 'none';
    if (modal) modal.style.display = 'flex';
  }

  function closeDsaLanguageSelector() {
    const modal = document.getElementById('dsa-language-modal');
    if (modal) modal.style.display = 'none';
  }

  async function continueToDiagnosticAfterDomain(domainId, userId, existingLanguage = null) {
    if (isDsaDomain(domainId) && !existingLanguage) {
      openDsaLanguageSelector();
      return;
    }
    renderDiagnosticQuiz(domainId);
    switchView('diagnostic');
  }

  function renderDomainSelectionScreen(userName) {
    const grid = document.getElementById('domain-selection-grid');
    const subtitle = document.getElementById('domain-selection-subtitle');
    if (!grid) return;

    selectedDomainId = null;

    if (subtitle && userName) {
      subtitle.textContent = `Welcome, ${userName}! Select the tech domain you want to master. Your personalized roadmap will be built around this choice.`;
    }

    const domainsList = (window.PLACIFY_DATA && window.PLACIFY_DATA.domains) ? window.PLACIFY_DATA.domains : [];
    grid.innerHTML = domainsList.map(d => `
      <div class="domain-card" data-id="${d.id}" id="dsc-${d.id}">
        <div class="domain-icon"><i class="ph ${d.icon}"></i></div>
        <h3>${d.name}</h3>
        <p>${d.description}</p>
      </div>
    `).join('');

    grid.querySelectorAll('.domain-card').forEach(card => {
      card.addEventListener('click', () => {
        grid.querySelectorAll('.domain-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedDomainId = card.dataset.id;
        const errEl = document.getElementById('domain-select-error');
        if (errEl) errEl.style.display = 'none';
      });
    });

    // Initialize AI Domain Selection Chatbot
    initDomainAssistantChatbot();
  }

  // =========================================================================
  // AI DOMAIN ASSISTANT CHATBOT CONTROLLER
  // =========================================================================
  let chatHistoryMessages = [];
  let isChatbotInitialized = false;

  function initDomainAssistantChatbot() {
    const historyEl = document.getElementById('domain-chat-history');
    const formEl = document.getElementById('domain-chat-form');
    const inputEl = document.getElementById('domain-chat-input');
    const typingEl = document.getElementById('domain-chat-typing');
    const resetBtn = document.getElementById('domain-chat-reset-btn');
    const fabBtn = document.getElementById('domain-chat-fab');
    const closeBtn = document.getElementById('domain-chat-close-btn');
    const wrapper = document.querySelector('.domain-assistant-wrapper');

    if (!historyEl || !formEl || !inputEl) return;

    // Helper: Select card programmatically using existing selection mechanism
    function selectDomainCardProgrammatically(domainId) {
      const targetCard = document.getElementById(`dsc-${domainId}`);
      const grid = document.getElementById('domain-selection-grid');
      if (grid && targetCard) {
        grid.querySelectorAll('.domain-card').forEach(c => c.classList.remove('selected'));
        targetCard.classList.add('selected');
        selectedDomainId = domainId;
        const errEl = document.getElementById('domain-select-error');
        if (errEl) errEl.style.display = 'none';
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    // Helper: Append Chat Message to UI & State
    function appendMessage(role, text, recommendation = null) {
      chatHistoryMessages.push({ role, content: text });

      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-message ${role}-message`;

      const avatarDiv = document.createElement('div');
      avatarDiv.className = 'message-avatar';
      avatarDiv.innerHTML = role === 'user' ? '<i class="ph ph-user"></i>' : '<i class="ph ph-sparkle"></i>';

      const contentDiv = document.createElement('div');
      contentDiv.className = 'message-content';

      // Parse bold/markdown bullet formatting cleanly
      let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formattedText = formattedText.replace(/• (.*?)(\n|$)/g, '<li>$1</li>');
      if (formattedText.includes('<li>')) {
        formattedText = formattedText.replace(/(<li>.*?<\/li>)/gs, '<ul style="margin-top:0.3rem; padding-left:1.2rem;">$1</ul>');
      }
      formattedText = formattedText.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`).join('');
      contentDiv.innerHTML = formattedText;

      // If structured recommendation is attached, render interactive widget
      if (recommendation && recommendation.recommendedDomain) {
        const widgetDiv = document.createElement('div');
        widgetDiv.className = 'recommendation-card-widget';
        widgetDiv.innerHTML = `
          <div class="recommendation-badge">
            <i class="ph ph-check-circle"></i> Recommended Match (${Math.round((recommendation.confidence || 0.9) * 100)}%)
          </div>
          <div class="recommendation-title">
            <i class="ph ${recommendation.icon || 'ph-compass'}"></i> ${recommendation.recommendedDomain}
          </div>
          <div class="recommendation-reason">${recommendation.reason || ''}</div>
          <button type="button" class="btn-select-recommended" data-id="${recommendation.recommendedDomainId}">
            <i class="ph ph-check"></i> Select ${recommendation.recommendedDomain}
          </button>
          ${recommendation.alternatives && recommendation.alternatives.length > 0 ? `
            <div class="recommendation-alternatives">
              <div class="alternatives-label">Also consider:</div>
              <div class="alternatives-chips">
                ${recommendation.alternatives.map(alt => `<button type="button" class="alternative-chip" data-id="${alt.id}">${alt.name}</button>`).join('')}
              </div>
            </div>
          ` : ''}
        `;

        // Wire Select This Domain button
        const selectBtn = widgetDiv.querySelector('.btn-select-recommended');
        if (selectBtn) {
          selectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            selectDomainCardProgrammatically(recommendation.recommendedDomainId);
            widgetDiv.querySelectorAll('.btn-select-recommended').forEach(b => {
              b.classList.add('selected-active');
              b.innerHTML = `<i class="ph ph-check-circle"></i> Selected ${recommendation.recommendedDomain}`;
            });
          });
        }

        // Wire Alternative Domain buttons
        widgetDiv.querySelectorAll('.alternative-chip').forEach(altBtn => {
          altBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const altId = altBtn.dataset.id;
            selectDomainCardProgrammatically(altId);
            const domObj = window.PLACIFY_DATA ? window.PLACIFY_DATA.findDomain(altId) : null;
            const domName = domObj ? domObj.name : altId;
            if (selectBtn) {
              selectBtn.classList.add('selected-active');
              selectBtn.innerHTML = `<i class="ph ph-check-circle"></i> Selected ${domName}`;
            }
          });
        });

        contentDiv.appendChild(widgetDiv);
      }

      msgDiv.appendChild(avatarDiv);
      msgDiv.appendChild(contentDiv);
      historyEl.appendChild(msgDiv);
      historyEl.scrollTop = historyEl.scrollHeight;
    }

    // Reset Chatbot State
    function resetChat() {
      chatHistoryMessages = [];
      historyEl.innerHTML = `
        <div class="chat-message assistant-message">
          <div class="message-avatar"><i class="ph ph-sparkle"></i></div>
          <div class="message-content">
            <p>Hi! I can help you choose the right learning domain. What are you hoping to build or become good at?</p>
          </div>
        </div>
        <div id="domain-chat-chips" class="chat-chips-container">
          <button type="button" class="chat-chip" data-prompt="I want to build websites and web applications.">🌐 Build Websites & Web Apps</button>
          <button type="button" class="chat-chip" data-prompt="I want to analyze data and build machine learning models.">📊 Data & AI Models</button>
          <button type="button" class="chat-chip" data-prompt="I want to learn ethical hacking and penetration testing.">🛡️ Ethical Hacking & Cyber</button>
          <button type="button" class="chat-chip" data-prompt="I want to manage AWS cloud systems and DevOps pipelines.">☁️ AWS Cloud & DevOps</button>
          <button type="button" class="chat-chip" data-prompt="I want to build mobile apps for iOS and Android.">📱 Mobile Apps (React Native/Flutter)</button>
        </div>
      `;
      bindChipListeners();
      if (inputEl) inputEl.value = '';
    }

    // Send User Input to Backend AI Endpoint
    async function handleSendUserMessage(userText) {
      const text = (userText || inputEl.value || '').trim();
      if (!text) return;

      // Remove chips container if visible
      const chipsEl = document.getElementById('domain-chat-chips');
      if (chipsEl) chipsEl.style.display = 'none';

      inputEl.value = '';
      appendMessage('user', text);

      if (typingEl) typingEl.style.display = 'flex';
      historyEl.scrollTop = historyEl.scrollHeight;

      try {
        const response = await fetch('http://localhost:5000/api/domain-assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: chatHistoryMessages,
            availableDomains: (window.PLACIFY_DATA && window.PLACIFY_DATA.domains) ? window.PLACIFY_DATA.domains : []
          })
        });

        const data = await response.json();
        if (typingEl) typingEl.style.display = 'none';

        if (!response.ok || !data) {
          throw new Error(data.error || 'Failed to communicate with AI Assistant.');
        }

        appendMessage('assistant', data.reply || 'Here is my recommendation:', data.recommendation || null);

      } catch (err) {
        if (typingEl) typingEl.style.display = 'none';
        appendMessage('assistant', "I'm having trouble connecting right now. You can still choose a domain manually from the options on the screen.");
      }
    }

    // Bind Chip Click Events
    function bindChipListeners() {
      const chips = historyEl.querySelectorAll('.chat-chip');
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          const prompt = chip.dataset.prompt;
          handleSendUserMessage(prompt);
        });
      });
    }

    if (!isChatbotInitialized) {
      isChatbotInitialized = true;

      bindChipListeners();

      if (formEl) {
        formEl.addEventListener('submit', (e) => {
          e.preventDefault();
          handleSendUserMessage();
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', () => resetChat());
      }

      if (fabBtn && wrapper) {
        fabBtn.addEventListener('click', () => {
          wrapper.classList.toggle('active');
        });
      }

      if (closeBtn && wrapper) {
        closeBtn.addEventListener('click', () => {
          wrapper.classList.remove('active');
        });
      }
    }
  }

  // (legacy: keep renderDomainGrid as no-op since domain grid removed from reg form)
  function renderDomainGrid() {}

  // Render Domain Grid immediately (no-op now)
  renderDomainGrid();

  // Always clear active session on application open / page load
  supervisor.authAgent.clearSession();
  supervisor.progressTracker.clearActiveUser();
  window.activePersonalizedRoadmap = null;
  window.currentDraftProfile = null;
  window.currentAssessmentTaskContext = null;
  window.currentAssessmentData = null;
  updateHeaderUserPill(null);
  updateHeaderStats();

  // Check initial requested URL path against Auth Guard
  const initialView = getRequestedViewFromUrl();
  enforceAuthRouteGuard(initialView);
  switchView('onboarding');

  // Logout Handler
  document.getElementById('logout-btn').addEventListener('click', () => {
    supervisor.authAgent.clearSession();
    supervisor.progressTracker.clearActiveUser();
    window.activePersonalizedRoadmap = null;
    window.currentDraftProfile = null;
    window.currentAssessmentTaskContext = null;
    window.currentAssessmentData = null;
    updateHeaderUserPill(null);
    updateHeaderStats();
    supervisor.logAgentAction('auth_specialist', 'User Signed Out', 'Cleared active session credentials.');
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '/login');
    }
    switchView('onboarding');
    const tabLoginBtn = document.getElementById('tab-login-btn');
    if (tabLoginBtn) tabLoginBtn.click();
  });

  // Listen for browser navigation (back/forward popstate)
  window.addEventListener('popstate', () => {
    const requested = getRequestedViewFromUrl();
    if (!enforceAuthRouteGuard(requested)) {
      switchView('onboarding');
    } else {
      switchView(requested);
    }
  });

  // =========================================================================
  // VIEW 1: AUTH & ONBOARDING SPECIALIST
  // =========================================================================
  
  // Auth Tab Switchers
  const tabRegBtn = document.getElementById('tab-register-btn');
  const tabLoginBtn = document.getElementById('tab-login-btn');
  const panelReg = document.getElementById('auth-register-panel');
  const panelLogin = document.getElementById('auth-login-panel');

  tabRegBtn.addEventListener('click', (e) => {
    e.preventDefault();
    tabRegBtn.classList.add('active');
    tabLoginBtn.classList.remove('active');
    panelReg.style.display = 'block';
    panelReg.classList.add('active');
    panelLogin.style.display = 'none';
    panelLogin.classList.remove('active');
  });

  tabLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    tabLoginBtn.classList.add('active');
    tabRegBtn.classList.remove('active');
    panelLogin.style.display = 'block';
    panelLogin.classList.add('active');
    panelReg.style.display = 'none';
    panelReg.classList.remove('active');
  });

  // Registration Form Handler
  const registrationForm = document.getElementById('registration-form');
  const regAlert = document.getElementById('reg-error-alert');

  registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    regAlert.style.display = 'none';

    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const timeline_months = parseInt(document.getElementById('timeline-months').value, 10);
    const daily_hours = parseFloat(document.getElementById('daily-hours').value);

    if (isNaN(timeline_months) || timeline_months < 1) {
      regAlert.textContent = 'Please enter a valid preparation timeline in months (minimum 1 month).';
      regAlert.style.display = 'flex';
      return;
    }

    if (isNaN(daily_hours) || daily_hours <= 0) {
      regAlert.textContent = 'Please enter a valid daily commitment in hours per day (minimum 0.5 hours).';
      regAlert.style.display = 'flex';
      return;
    }

    try {
      // 1. Register user via AuthAgent (saves profile in MongoDB Atlas)
      const profile = await supervisor.registerUser({
        name,
        email,
        password,
        timeline_months,
        daily_hours
      });

      // Clear session so user must log in explicitly with password
      supervisor.authAgent.clearSession();
      updateHeaderUserPill(null);

      // Pre-fill registered email on login tab
      const loginEmailInput = document.getElementById('login-email');
      if (loginEmailInput) loginEmailInput.value = email;

      const loginAlert = document.getElementById('login-error-alert');
      if (loginAlert) {
        loginAlert.innerHTML = `
          <i class="ph ph-check-circle" style="font-size: 1.4rem; color: #10b981;"></i>
          <div>
            <strong style="color: #10b981;">Registration Successful!</strong><br>
            <span style="font-size: 0.85rem; color: var(--text-main);">Your account has been created in MongoDB Atlas. Please enter your password below to sign in.</span>
          </div>
        `;
        loginAlert.style.display = 'flex';
        loginAlert.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        loginAlert.style.background = 'rgba(16, 185, 129, 0.1)';
      }

      // Switch to Sign In tab
      tabLoginBtn.click();

      const loginPassInput = document.getElementById('login-password');
      if (loginPassInput) loginPassInput.focus();

    } catch (err) {
      if (err.status === 409 || (err.message && err.message.toLowerCase().includes('already exists'))) {
        regAlert.innerHTML = `
          <i class="ph ph-warning" style="font-size: 1.2rem; color: #f87171;"></i>
          <div>
            <strong>${err.message || 'An account with this email address already exists.'}</strong><br>
            <a href="#" id="switch-to-login-link" style="color: var(--accent-cyan); font-weight: 700; text-decoration: underline; font-size: 0.85rem; margin-top: 0.3rem; display: inline-block;">Click here to switch to Existing User Sign In</a>
          </div>
        `;
        regAlert.style.display = 'flex';
        const link = document.getElementById('switch-to-login-link');
        if (link) {
          link.addEventListener('click', (ev) => {
            ev.preventDefault();
            tabLoginBtn.click();
          });
        }
      } else {
        regAlert.textContent = err.message || 'Registration failed.';
        regAlert.style.display = 'flex';
      }
    }
  });

  // Login Form Handler
  const loginForm = document.getElementById('login-form');
  const loginAlert = document.getElementById('login-error-alert');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginAlert.style.display = 'none';

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      // 1. Authenticate credentials via AuthAgent against MongoDB Atlas
      const profile = await supervisor.authenticateUser(email, password);

      // Set user on progressTracker and sync authoritative backend data
      supervisor.progressTracker.setActiveUser(profile.user_id);
      await supervisor.progressTracker.syncWithBackend(profile.user_id);

      updateHeaderUserPill(profile);
      updateHeaderStats({
        streak: profile.streak,
        xp: profile.xp,
        level: profile.level,
        badges: profile.badges,
        masteryPct: profile.mastery_pct
      });

      // Save active draft profile for Supervisor
      window.currentDraftProfile = {
        user_id: profile.user_id,
        name: profile.name,
        domainId: profile.chosen_domain,
        chosen_domain: profile.chosen_domain,
        dsaLanguage: profile.dsa_language || null,
        timelineMonths: profile.timeline_months,
        dailyHours: profile.daily_hours
      };

      // 2. CHECK AUTHORITATIVE MONGODB ONBOARDING STATE
      const onboardingState = await supervisor.checkUserOnboardingState(profile.user_id);

      if (onboardingState.action === 'DOMAIN_SELECT') {
        // User has no domain yet — show domain selection
        renderDomainSelectionScreen(profile.name);
        switchView('domainSelection');
      } else if (onboardingState.action === 'QUIZ') {
        // New user / incomplete quiz -> Diagnostic Quiz
        if (isDsaDomain(profile.chosen_domain) && !profile.dsa_language) {
          openDsaLanguageSelector();
        } else {
          renderDiagnosticQuiz(profile.chosen_domain);
          switchView('diagnostic');
        }
      } else {
        // Returning user with quiz_completed = true!
        if (onboardingState.roadmap) {
          await renderRoadmapView(onboardingState.roadmap);
        }
        const routeToSwitch = onboardingState.route || 'roadmap';
        if (routeToSwitch === 'dailyHub') {
          let savedSpec = null;
          try {
            const raw = localStorage.getItem(`placify_selected_day_spec_${profile.user_id}`) || localStorage.getItem('placify_selected_day_spec');
            if (raw) savedSpec = JSON.parse(raw);
          } catch(e) {}
          if (!savedSpec) {
            const userState = supervisor.progressTracker.getUserState(profile.user_id);
            const activeDay = (userState && userState.currentDayIndex !== undefined) ? userState.currentDayIndex + 1 : 1;
            savedSpec = { day: activeDay };
          }
          renderDailyHub(savedSpec);
        }
        switchView(routeToSwitch);
      }

    } catch (err) {
      const isFetchError = err.message && err.message.includes('Failed to fetch');
      loginAlert.innerHTML = `
        <i class="ph ph-warning-octagon" style="font-size: 1.5rem; color: #f87171;"></i>
        <div>
          <strong style="color: #ef4444;">${isFetchError ? 'Server Connection Error' : (err.status === 401 ? 'HTTP 401 Unauthorized' : 'Authentication Error')}</strong><br>
          <span style="font-size: 0.85rem;">${isFetchError ? 'Placify backend server is offline. Please run "node server.js" in PowerShell terminal to start port 5000.' : (err.message || 'Invalid email or password credentials.')}</span>
        </div>
      `;
      loginAlert.style.display = 'flex';
      loginAlert.style.borderColor = 'rgba(239, 68, 68, 0.4)';
      loginAlert.style.background = 'rgba(239, 68, 68, 0.1)';
    }
  });

  // =========================================================================
  // VIEW 1b: DOMAIN SELECTION SCREEN HANDLER
  // =========================================================================
  const confirmDomainBtn = document.getElementById('confirm-domain-btn');
  const domainSelectError = document.getElementById('domain-select-error');

  if (confirmDomainBtn) {
    confirmDomainBtn.addEventListener('click', async () => {
      if (domainSelectError) domainSelectError.style.display = 'none';

      if (!selectedDomainId) {
        if (domainSelectError) {
          domainSelectError.textContent = 'Please click to select a domain before continuing.';
          domainSelectError.style.display = 'flex';
        }
        return;
      }

      if (isDsaDomain(selectedDomainId) && !selectedDsaLanguage) {
        openDsaLanguageSelector();
        return;
      }

      const activeSession = supervisor.authAgent.getActiveSession() || window.currentDraftProfile;
      const userId = activeSession ? activeSession.user_id : null;

      if (!userId) {
        if (domainSelectError) {
          domainSelectError.textContent = 'User session not found. Please register or sign in again.';
          domainSelectError.style.display = 'flex';
        }
        return;
      }

      try {
        confirmDomainBtn.disabled = true;
        confirmDomainBtn.innerHTML = '<i class="ph ph-spinner spinner"></i> Saving Domain...';

        const res = await fetch(`http://localhost:5000/api/user/${userId}/domain`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chosen_domain: selectedDomainId,
            ...(isDsaDomain(selectedDomainId) ? { dsa_language: selectedDsaLanguage } : {})
          })
        });

        const data = await res.json();

        if (!res.ok || !data.profile) {
          throw new Error(data.error || 'Failed to save selected domain.');
        }

        const updatedProfile = data.profile;
        supervisor.authAgent.setActiveSession(updatedProfile);
        updateHeaderUserPill(updatedProfile);

        window.currentDraftProfile = {
          user_id: updatedProfile.user_id,
          name: updatedProfile.name,
          domainId: updatedProfile.chosen_domain,
          chosen_domain: updatedProfile.chosen_domain,
          dsaLanguage: updatedProfile.dsa_language || null,
          timelineMonths: updatedProfile.timeline_months,
          dailyHours: updatedProfile.daily_hours
        };

        // DSA requires a language before the diagnostic/roadmap pipeline starts.
        if (isDsaDomain(selectedDomainId) && !updatedProfile.dsa_language) {
          openDsaLanguageSelector();
        } else {
          renderDiagnosticQuiz(selectedDomainId);
          switchView('diagnostic');
        }

      } catch (err) {
        if (domainSelectError) {
          domainSelectError.textContent = err.message || 'Failed to save domain. Please try again.';
          domainSelectError.style.display = 'flex';
        }
      } finally {
        confirmDomainBtn.disabled = false;
        confirmDomainBtn.innerHTML = '<i class="ph ph-arrow-right"></i> Continue with Selected Domain';
      }
    });
  }

  // DSA language selector handlers
  document.querySelectorAll('.dsa-language-option').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedDsaLanguage = btn.dataset.language;
      document.querySelectorAll('.dsa-language-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const confirmBtn = document.getElementById('confirm-dsa-language-btn');
      if (confirmBtn) confirmBtn.disabled = !selectedDsaLanguage;
      const errorEl = document.getElementById('dsa-language-error');
      if (errorEl) errorEl.style.display = 'none';
    });
  });

  const confirmDsaLanguageBtn = document.getElementById('confirm-dsa-language-btn');
  if (confirmDsaLanguageBtn) {
    confirmDsaLanguageBtn.addEventListener('click', async () => {
      const errorEl = document.getElementById('dsa-language-error');
      const activeSession = supervisor.authAgent.getActiveSession() || window.currentDraftProfile;
      const userId = activeSession && activeSession.user_id;
      if (!selectedDsaLanguage) {
        if (errorEl) { errorEl.textContent = 'Please select a programming language.'; errorEl.style.display = 'flex'; }
        return;
      }
      if (!userId) {
        if (errorEl) { errorEl.textContent = 'User session not found. Please sign in again.'; errorEl.style.display = 'flex'; }
        return;
      }
      try {
        confirmDsaLanguageBtn.disabled = true;
        confirmDsaLanguageBtn.innerHTML = '<i class="ph ph-spinner spinner"></i> Saving Language...';
        const res = await fetch(`http://localhost:5000/api/user/${userId}/domain`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chosen_domain: 'dsa', dsa_language: selectedDsaLanguage })
        });
        const data = await res.json();
        if (!res.ok || !data.profile) throw new Error(data.error || 'Failed to save DSA language.');
        const profile = data.profile;
        supervisor.authAgent.setActiveSession(profile);
        updateHeaderUserPill(profile);
        window.currentDraftProfile = {
          user_id: profile.user_id, name: profile.name, domainId: profile.chosen_domain,
          chosen_domain: profile.chosen_domain, dsaLanguage: profile.dsa_language,
          timelineMonths: profile.timeline_months, dailyHours: profile.daily_hours
        };
        closeDsaLanguageSelector();
        renderDiagnosticQuiz('dsa');
        switchView('diagnostic');
      } catch (err) {
        if (errorEl) { errorEl.textContent = err.message || 'Failed to save DSA language.'; errorEl.style.display = 'flex'; }
      } finally {
        confirmDsaLanguageBtn.disabled = !selectedDsaLanguage;
        confirmDsaLanguageBtn.innerHTML = 'Continue with Selected Language';
      }
    });
  }

  // =========================================================================
  // =========================================================================
  // VIEW 2: NPTEL-STYLE DIAGNOSTIC QUIZ RUNNER
  // =========================================================================
  let currentDiagnosticIndex = 0;
  let currentDiagnosticDomainObj = null;
  let diagnosticUserAnswers = {};

  function shuffleArray(array) {
    const arr = [...(array || [])];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function renderDiagnosticQuiz(domainId, customQuestions = null) {
    const domain = window.PLACIFY_DATA.findDomain(domainId);
    currentDiagnosticDomainObj = domain || { id: domainId, name: domainId, diagnostics: [] };
    currentDiagnosticIndex = 0;
    diagnosticUserAnswers = {};

    const allDiagnostics = (domain && domain.diagnostics) ? domain.diagnostics : [];
    let activeDiagnostics = [];
    if (Array.isArray(customQuestions) && customQuestions.length > 0) {
      activeDiagnostics = customQuestions;
    } else {
      activeDiagnostics = shuffleArray(allDiagnostics).slice(0, selectedQuestionCount);
    }
    currentDiagnosticDomainObj.activeDiagnostics = activeDiagnostics;
    window.currentDiagnosticDomainObj = currentDiagnosticDomainObj;

    const container = document.getElementById('diagnostic-questions-container');
    const paletteContainer = document.getElementById('diagnostic-palette-container');
    const countBadge = document.getElementById('diagnostic-concept-count-badge');

    if (countBadge) {
      countBadge.textContent = 'Technical Diagnostic Quiz';
    }

    const domainNameText = domain ? domain.name : domainId;

    // Populate Manual Self-Assessment Header & Topic Grid
    const headerDomainName = document.getElementById('diagnostic-domain-name-header');
    if (headerDomainName) headerDomainName.textContent = domainNameText;

    const manualDomainTitle = document.getElementById('manual-domain-title');
    if (manualDomainTitle) manualDomainTitle.textContent = domainNameText;

    const quizDomainTitle = document.getElementById('quiz-domain-title');
    if (quizDomainTitle) quizDomainTitle.textContent = domainNameText;

    // Reset Quiz Wrapper to hidden initially
    const quizWrapper = document.getElementById('diagnostic-quiz-wrapper');
    if (quizWrapper) quizWrapper.style.display = 'none';

    const topicGrid = document.getElementById('manual-topic-grid');
    if (topicGrid) {
      const topicSource = activeDiagnostics.length > 0 ? activeDiagnostics : allDiagnostics;
      const domainTopics = (domain && domain.topics && domain.topics.length > 0)
        ? domain.topics
        : Array.from(new Set(topicSource.map(d => d.topic))).filter(Boolean);
      topicGrid.innerHTML = domainTopics.map((topic, idx) => `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 0.7rem 0.9rem; border-radius: 8px; display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 0.82rem; font-weight: 600; color: #fff;">${topic}</span>
          <label style="font-size: 0.75rem; color: var(--accent-rose); display: flex; align-items: center; gap: 0.3rem; cursor: pointer;">
            <input type="checkbox" class="manual-weak-topic-cb" data-topic="${topic}" style="accent-color: var(--accent-rose);">
            Need Practice
          </label>
        </div>
      `).join('');
    }

    // Render Palette Buttons for the 10 active randomized questions
    if (paletteContainer) {
      paletteContainer.innerHTML = activeDiagnostics.map((q, idx) => `
        <button type="button" class="palette-btn ${idx === 0 ? 'active' : ''}" data-qidx="${idx}" id="palette-btn-${idx}" style="min-width: 32px; height: 32px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.05); color: #fff; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s;">
          ${idx + 1}
        </button>
      `).join('');

      paletteContainer.onclick = function(e) {
        const btn = e.target.closest('.palette-btn');
        if (btn) {
          const targetIdx = parseInt(btn.dataset.qidx, 10);
          if (!isNaN(targetIdx)) {
            showDiagnosticQuestion(targetIdx);
          }
        }
      };
    }

    function escapeHTML(str) {
      if (str === null || str === undefined) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    // Render Question Cards for active randomized questions
    container.innerHTML = activeDiagnostics.map((q, idx) => {
      const qType = (q.type || 'MCQ').toUpperCase().replace(/[^A-Z0-9_]/g, '_');
      const isMSQ = qType === 'MSQ' || qType === 'MULTIPLE_SELECT' || qType === 'MULTIPLE_CHOICE_MULTI';
      const isTextOrNumerical = (qType === 'NUMERICAL' || qType === 'FILL_BLANK' || qType === 'FILL_IN_THE_BLANK' || qType === 'SHORT_ANSWER') && (!Array.isArray(q.options) || q.options.length === 0);

      let typeBadgeColor = 'var(--accent-violet)';
      if (isMSQ) typeBadgeColor = '#f59e0b';
      else if (isTextOrNumerical) typeBadgeColor = '#3b82f6';
      else if (qType === 'CODE_OUTPUT') typeBadgeColor = '#ec4899';
      else if (qType === 'SCENARIO_BASED') typeBadgeColor = '#10b981';

      const safeQuestion = escapeHTML(q.question);
      const safeTopic = escapeHTML(q.topic);
      const safeSubtopic = escapeHTML(q.subtopic || 'Core Concept');
      const safeCodeSnippet = q.codeSnippet ? escapeHTML(q.codeSnippet) : null;

      return `
        <div class="quiz-question-card" data-qid="${q.id}" data-qidx="${idx}" style="display: ${idx === 0 ? 'block' : 'none'};">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center;">
              <span class="question-badge" style="background: rgba(139, 92, 246, 0.2); color: var(--accent-violet); padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: 700; font-size: 0.8rem;">Q${idx + 1} / ${activeDiagnostics.length}</span>
              <span style="font-size: 0.75rem; background: rgba(255, 255, 255, 0.1); color: var(--text-muted); padding: 0.2rem 0.5rem; border-radius: 4px;">${safeTopic}</span>
              <span style="font-size: 0.75rem; background: rgba(255, 255, 255, 0.05); color: var(--text-muted); padding: 0.2rem 0.5rem; border-radius: 4px;">${safeSubtopic}</span>
            </div>
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              <span style="font-size: 0.75rem; background: rgba(255,255,255,0.08); color: ${typeBadgeColor}; padding: 0.2rem 0.6rem; border-radius: 50px; font-weight: 700;">${qType}</span>
              <span class="tier-badge ${q.difficulty}" style="font-size: 0.7rem; padding: 0.15rem 0.5rem;">${q.difficulty}</span>
            </div>
          </div>

          <div class="quiz-question-title" style="font-size: 1rem; font-weight: 600; margin-bottom: 1rem; line-height: 1.5;">
            ${safeQuestion}
          </div>

          ${safeCodeSnippet ? `
            <pre style="background: rgba(0,0,0,0.5); padding: 0.8rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); overflow-x: auto; font-family: monospace; font-size: 0.85rem; color: #a7f3d0; margin-bottom: 1rem;"><code>${safeCodeSnippet}</code></pre>
          ` : ''}

          <!-- OPTIONS OR NUMERICAL / TEXT INPUT -->
          <div class="quiz-options">
            ${isTextOrNumerical ? `
              <div style="margin-top: 0.5rem;">
                <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.4rem;">
                  ${qType === 'NUMERICAL' ? 'Enter Numerical Answer:' : 'Enter Your Answer:'}
                </label>
                <input type="${qType === 'NUMERICAL' ? 'number' : 'text'}" step="any" class="form-input text-answer-input numerical-input" data-qid="${q.id}" placeholder="${qType === 'NUMERICAL' ? 'e.g. 10 or 0.5' : 'Type your answer here...'}" style="max-width: 400px; width: 100%;">
              </div>
            ` : (isMSQ ? `
              <div style="font-size: 0.8rem; color: #f59e0b; font-weight: 600; margin-bottom: 0.6rem;">Select ALL correct answers:</div>
              ${(q.options || []).map((opt, oIdx) => `
                <label class="option-btn msq-option-btn" data-qid="${q.id}" data-oidx="${oIdx}" style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer; padding: 0.7rem 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); margin-bottom: 0.5rem;">
                  <input type="checkbox" class="msq-checkbox" data-qid="${q.id}" data-oidx="${oIdx}" style="width: 18px; height: 18px; accent-color: var(--accent-violet);">
                  <span class="opt-text">${escapeHTML(opt)}</span>
                </label>
              `).join('')}
            ` : `
              ${(q.options || []).map((opt, oIdx) => `
                <div class="option-btn" data-qid="${q.id}" data-oidx="${oIdx}">
                  <i class="ph ph-circle"></i> <span class="opt-text">${escapeHTML(opt)}</span>
                </div>
              `).join('')}
            `)}
          </div>
        </div>
      `;
    }).join('');

    updateDiagnosticControls();

    // Attach Event Handlers for Options / Numerical / Text / MSQ
    const handleInputChange = function(e) {
      if (e.target.classList.contains('text-answer-input') || e.target.classList.contains('numerical-input')) {
        const qid = e.target.dataset.qid;
        const val = e.target.value.trim();
        if (val !== '') {
          diagnosticUserAnswers[qid] = val;
        } else {
          delete diagnosticUserAnswers[qid];
        }
        updatePaletteStatus();
      }
      if (e.target.classList.contains('msq-checkbox')) {
        const qid = e.target.dataset.qid;
        const card = container.querySelector(`.quiz-question-card[data-qid="${qid}"]`);
        const checkboxes = card.querySelectorAll('.msq-checkbox:checked');
        const selectedIndices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.oidx, 10));
        if (selectedIndices.length > 0) {
          diagnosticUserAnswers[qid] = selectedIndices;
        } else {
          delete diagnosticUserAnswers[qid];
        }
        updatePaletteStatus();
      }
    };

    container.onchange = handleInputChange;
    container.oninput = handleInputChange;

    container.onclick = function(e) {
      const btn = e.target.closest('.option-btn:not(.msq-option-btn)');
      if (!btn) return;

      const qid = btn.dataset.qid;
      const oidx = parseInt(btn.dataset.oidx, 10);
      diagnosticUserAnswers[qid] = oidx;

      container.querySelectorAll(`.option-btn[data-qid="${qid}"]`).forEach(b => {
        b.classList.remove('selected');
        const icon = b.querySelector('i');
        if (icon) icon.className = 'ph ph-circle';
      });

      btn.classList.add('selected');
      const icon = btn.querySelector('i');
      if (icon) icon.className = 'ph ph-check-circle';

      updatePaletteStatus();
    };
  }

  function getActiveDiagnosticList() {
    if (currentDiagnosticDomainObj && currentDiagnosticDomainObj.activeDiagnostics) {
      return currentDiagnosticDomainObj.activeDiagnostics;
    }
    return (currentDiagnosticDomainObj && currentDiagnosticDomainObj.diagnostics) ? currentDiagnosticDomainObj.diagnostics : [];
  }

  function showDiagnosticQuestion(index) {
    const list = getActiveDiagnosticList();
    if (!currentDiagnosticDomainObj || index < 0 || index >= list.length) return;
    currentDiagnosticIndex = index;

    const cards = document.querySelectorAll('#diagnostic-questions-container .quiz-question-card');
    cards.forEach((card, idx) => {
      card.style.display = (idx === index) ? 'block' : 'none';
    });

    updateDiagnosticControls();
  }

  function updateDiagnosticControls() {
    if (!currentDiagnosticDomainObj) return;
    const list = getActiveDiagnosticList();
    const total = list.length;
    const prevBtn = document.getElementById('quiz-prev-btn');
    const nextBtn = document.getElementById('quiz-next-btn');

    if (prevBtn) prevBtn.style.display = currentDiagnosticIndex > 0 ? 'inline-flex' : 'none';
    if (nextBtn) nextBtn.style.display = currentDiagnosticIndex < total - 1 ? 'inline-flex' : 'none';

    // Update Palette Buttons
    const paletteBtns = document.querySelectorAll('#diagnostic-palette-container .palette-btn');
    paletteBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === currentDiagnosticIndex);
      const q = list[idx];
      const isAnswered = q && diagnosticUserAnswers[q.id] !== undefined && diagnosticUserAnswers[q.id] !== '' && diagnosticUserAnswers[q.id] !== -1;

      if (idx === currentDiagnosticIndex) {
        btn.style.background = 'var(--accent-violet)';
        btn.style.borderColor = 'var(--accent-violet)';
        btn.style.color = '#fff';
      } else if (isAnswered) {
        btn.style.background = 'rgba(16, 185, 129, 0.2)';
        btn.style.borderColor = 'var(--accent-emerald)';
        btn.style.color = '#a7f3d0';
      } else {
        btn.style.background = 'rgba(255, 255, 255, 0.05)';
        btn.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        btn.style.color = 'var(--text-muted)';
      }
    });
  }

  function updatePaletteStatus() {
    updateDiagnosticControls();
  }

  window.renderDiagnosticQuiz = renderDiagnosticQuiz;

  // Prev / Next button listeners
  const prevBtn = document.getElementById('quiz-prev-btn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => showDiagnosticQuestion(currentDiagnosticIndex - 1));
  }
  const nextBtn = document.getElementById('quiz-next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => showDiagnosticQuestion(currentDiagnosticIndex + 1));
  }

  const diagnosticForm = document.getElementById('diagnostic-quiz-form');
  diagnosticForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentDiagnosticDomainObj) return;

    const list = getActiveDiagnosticList();
    const totalQuestions = list.length;
    let unansweredCount = 0;

    list.forEach(q => {
      if (diagnosticUserAnswers[q.id] === undefined || diagnosticUserAnswers[q.id] === '' || diagnosticUserAnswers[q.id] === -1) {
        unansweredCount++;
      }
    });

    if (unansweredCount > 0) {
      const confirmSubmit = confirm(`⚠️ You have ${unansweredCount} unanswered questions out of ${totalQuestions}.\n\nDo you want to submit your assessment anyway? (Unanswered questions will be evaluated as incorrect).`);
      if (!confirmSubmit) return;
    }

    if (!window.currentDraftProfile) {
      const activeSession = supervisor.authAgent.getActiveSession();
      if (activeSession) {
        window.currentDraftProfile = {
          user_id: activeSession.user_id,
          name: activeSession.name,
          domainId: activeSession.chosen_domain,
          chosen_domain: activeSession.chosen_domain,
          dsaLanguage: activeSession.dsa_language || null,
          timelineMonths: activeSession.timeline_months || 4,
          dailyHours: activeSession.daily_hours || 2.0
        };
      }
    }

    // Show automatic roadmap generation loading overlay
    const overlay = document.getElementById('roadmap-loading-overlay');
    if (overlay) overlay.style.display = 'flex';

    try {
      // Attach user's declared self-assessed level along with answers
      const quizPayload = {
        answers: diagnosticUserAnswers,
        declaredSelfLevel: selectedSelfLevel
      };
      const result = await supervisor.startLearningJourney(window.currentDraftProfile, quizPayload);
      
      // Hide loading overlay
      if (overlay) overlay.style.display = 'none';

      // Render Assessment Report & Render Roadmap
      renderAssessmentReport(result.evaluation, result.personalizedRoadmap);
      await renderRoadmapView(result.personalizedRoadmap);
      updateHeaderStats();

      // Display Diagnostic Evaluation & Topic-Wise Proficiency Report page first!
      switchView('assessmentReport');

    } catch (err) {
      if (overlay) overlay.style.display = 'none';
      console.error('Error during quiz evaluation and roadmap generation:', err);
      alert('Error generating roadmap: ' + err.message);
    }
  });

  let selectedSelfLevel = 'BEGINNER';
  let selectedQuestionCount = 10;

  // Handle Question Count Selection
  function updateQuizCountUI(count) {
    selectedQuestionCount = Math.min(50, Math.max(1, parseInt(count, 10) || 10));
    document.querySelectorAll('.quiz-count-pill').forEach(p => {
      p.classList.toggle('active', parseInt(p.dataset.count, 10) === selectedQuestionCount);
    });
    const customInput = document.getElementById('custom-quiz-question-count');
    if (customInput && parseInt(customInput.value, 10) !== selectedQuestionCount) {
      customInput.value = '';
    }
    const btnLabel = document.getElementById('quiz-count-btn-label');
    if (btnLabel) btnLabel.textContent = `${selectedQuestionCount}-Question`;
  }

  document.querySelectorAll('.quiz-count-pill').forEach(pill => {
    pill.addEventListener('click', () => updateQuizCountUI(pill.dataset.count));
  });

  const customQuizCountInput = document.getElementById('custom-quiz-question-count');
  if (customQuizCountInput) {
    customQuizCountInput.addEventListener('input', () => {
      const value = parseInt(customQuizCountInput.value, 10);
      if (Number.isFinite(value) && value >= 1 && value <= 50) {
        selectedQuestionCount = value;
        document.querySelectorAll('.quiz-count-pill').forEach(p => p.classList.remove('active'));
        const btnLabel = document.getElementById('quiz-count-btn-label');
        if (btnLabel) btnLabel.textContent = `${selectedQuestionCount}-Question`;
      }
    });
  }

  function updateDeclaredLevelUI(level) {
    selectedSelfLevel = level;
    const pill = document.getElementById('selected-level-pill');
    if (pill) {
      pill.textContent = `${level} SELECTED`;
      pill.className = `tier-label ${level}`;
      if (level === 'INTERMEDIATE') {
        pill.style.background = 'rgba(245, 158, 11, 0.2)';
        pill.style.color = '#f59e0b';
      } else {
        pill.style.background = '';
        pill.style.color = '';
      }
    }
    const summary = document.getElementById('declared-level-summary');
    if (summary) {
      summary.textContent = level;
      summary.style.color = level === 'INTERMEDIATE' ? '#f59e0b' : (level === 'ADVANCED' ? 'var(--accent-violet)' : 'var(--accent-emerald)');
    }
    const tag = document.getElementById('quiz-declared-level-tag');
    if (tag) {
      tag.textContent = level;
      tag.className = `tier-label ${level}`;
      if (level === 'INTERMEDIATE') {
        tag.style.background = 'rgba(245, 158, 11, 0.2)';
        tag.style.color = '#f59e0b';
      } else {
        tag.style.background = '';
        tag.style.color = '';
      }
    }
  }

  // Handle Level Card Clicks (Step 1)
  document.querySelectorAll('.manual-level-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.manual-level-card').forEach(c => {
        c.classList.remove('active');
        c.style.border = '1px solid rgba(255, 255, 255, 0.12)';
        const icon = c.querySelector('.manual-card-icon');
        if (icon) {
          icon.className = 'ph ph-circle';
          icon.style.color = 'var(--text-muted)';
        }
      });
      card.classList.add('active');
      const level = card.dataset.level || 'BEGINNER';

      let borderColor = 'var(--accent-emerald)';
      let iconColor = 'var(--accent-emerald)';
      if (level === 'INTERMEDIATE') {
        borderColor = '#f59e0b';
        iconColor = '#f59e0b';
      } else if (level === 'ADVANCED') {
        borderColor = 'var(--accent-violet)';
        iconColor = 'var(--accent-violet)';
      }
      card.style.border = `2px solid ${borderColor}`;
      const icon = card.querySelector('.manual-card-icon');
      if (icon) {
        icon.className = 'ph ph-check-circle';
        icon.style.color = iconColor;
      }
      updateDeclaredLevelUI(level);
    });
  });

  // Step 2 Option A: Start Quiz Button (Generates Dynamic AI Quiz via Backend)
  const startQuizBtn = document.getElementById('start-diagnostic-quiz-btn');
  if (startQuizBtn) {
    startQuizBtn.addEventListener('click', async () => {
      const quizWrapper = document.getElementById('diagnostic-quiz-wrapper');

      const activeSession = supervisor.authAgent.getActiveSession();
      const currentUserId = (window.currentDraftProfile && window.currentDraftProfile.user_id) || (activeSession && activeSession.user_id) || 'guest';
      const chosenDomain = (window.currentDraftProfile && window.currentDraftProfile.chosen_domain) || (activeSession && activeSession.chosen_domain) || selectedDomainId || 'fullstack';

      startQuizBtn.disabled = true;
      startQuizBtn.innerHTML = `<i class="ph ph-circle-notch ph-spin"></i> Generating ${selectedQuestionCount} AI Questions...`;

      try {
        console.log(`[Frontend Quiz Gen] Requesting ${selectedQuestionCount} questions for domain ${chosenDomain} at level ${selectedSelfLevel}...`);
        const res = await fetch('http://localhost:5000/api/quiz/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUserId,
            questionCount: selectedQuestionCount,
            domain: chosenDomain,
            level: selectedSelfLevel,
            dsaLanguage: isDsaDomain(chosenDomain) ? (window.currentDraftProfile?.dsaLanguage || selectedDsaLanguage) : null,
            forceNew: true
          })
        });

        const quizData = await res.json();
        if (!res.ok || !quizData || !Array.isArray(quizData.questions)) {
          throw new Error(quizData.error || 'Failed to generate dynamic quiz.');
        }

        console.log(`✅ [Frontend Quiz Gen] Received ${quizData.questions.length} questions from backend!`, quizData);

        // Render Quiz with backend-generated dynamic questions
        renderDiagnosticQuiz(chosenDomain, quizData.questions);

        if (quizWrapper) {
          quizWrapper.style.display = 'block';
          quizWrapper.scrollIntoView({ behavior: 'smooth' });
        }

      } catch (err) {
        console.error('Quiz Generation error:', err);
        alert('Could not generate dynamic quiz: ' + err.message + '\n\nFalling back to domain diagnostic pool.');
        renderDiagnosticQuiz(chosenDomain);
        if (quizWrapper) {
          quizWrapper.style.display = 'block';
          quizWrapper.scrollIntoView({ behavior: 'smooth' });
        }
      } finally {
        startQuizBtn.disabled = false;
        startQuizBtn.innerHTML = `<i class="ph ph-play"></i> Generate <span id="quiz-count-btn-label">${selectedQuestionCount}-Question</span> Quiz`;
      }
    });
  }

  // In-Quiz Skip Button
  const quizSkipBtn = document.getElementById('quiz-skip-btn');
  if (quizSkipBtn) {
    quizSkipBtn.addEventListener('click', () => {
      const submitBtn = document.getElementById('submit-self-assessment-btn');
      if (submitBtn) submitBtn.click();
    });
  }

  const submitSelfAssessmentBtn = document.getElementById('submit-self-assessment-btn');
  if (submitSelfAssessmentBtn) {
    submitSelfAssessmentBtn.addEventListener('click', async () => {
      if (!currentDiagnosticDomainObj) return;

      if (!window.currentDraftProfile) {
        const activeSession = supervisor.authAgent.getActiveSession();
        if (activeSession) {
          window.currentDraftProfile = {
            user_id: activeSession.user_id,
            name: activeSession.name,
            domainId: activeSession.chosen_domain,
            chosen_domain: activeSession.chosen_domain,
            dsaLanguage: activeSession.dsa_language || null,
            timelineMonths: activeSession.timeline_months || 4,
            dailyHours: activeSession.daily_hours || 2.0
          };
        }
      }

      const checkedWeakTopics = [];
      document.querySelectorAll('.manual-weak-topic-cb:checked').forEach(cb => {
        if (cb.dataset.topic) checkedWeakTopics.push(cb.dataset.topic);
      });

      const selfAssessmentPayload = {
        isSelfAssessed: true,
        skillTier: selectedSelfLevel,
        skill_level: selectedSelfLevel,
        weakTopicNames: checkedWeakTopics,
        domainId: currentDiagnosticDomainObj.id,
        domain: currentDiagnosticDomainObj.name
      };

      const overlay = document.getElementById('roadmap-loading-overlay');
      if (overlay) overlay.style.display = 'flex';

      try {
        const result = await supervisor.startLearningJourney(window.currentDraftProfile, selfAssessmentPayload);
        if (overlay) overlay.style.display = 'none';

        renderAssessmentReport(result.evaluation, result.personalizedRoadmap);
        await renderRoadmapView(result.personalizedRoadmap);
        updateHeaderStats();

        switchView('assessmentReport');
      } catch (err) {
        if (overlay) overlay.style.display = 'none';
        console.error('Error submitting self assessment:', err);
        alert('Error generating roadmap: ' + err.message);
      }
    });
  }

  // =========================================================================
  // VIEW 3: ASSESSMENT REPORT & TOPIC PROFICIENCY
  // =========================================================================
  function renderAssessmentReport(evaluation, roadmap) {
    const scoreDisplay = document.getElementById('tier-score-display');
    const summaryDisplay = document.getElementById('tier-summary-text');
    const tierLabel = document.getElementById('tier-label-display');
    
    const skillTierVal = evaluation.skillTier || evaluation.skill_level || evaluation.skillLevel || 'BEGINNER';
    const scoreVal = evaluation.scorePct !== undefined ? evaluation.scorePct : (evaluation.score_pct !== undefined ? evaluation.score_pct : 0);
    const correctVal = evaluation.correctCount !== undefined ? evaluation.correctCount : (evaluation.correct_count !== undefined ? evaluation.correct_count : 0);
    const totalVal = evaluation.totalQuestions !== undefined ? evaluation.totalQuestions : (evaluation.total_questions !== undefined ? evaluation.total_questions : 0);
    const levelDesc = evaluation.levelDescription || evaluation.level_description || '';

    tierLabel.textContent = skillTierVal;
    tierLabel.className = `tier-label ${skillTierVal}`;

    if (evaluation.isSelfAssessed || evaluation.is_self_assessed) {
      if (scoreDisplay) {
        scoreDisplay.textContent = 'SELF';
        scoreDisplay.style.fontSize = '1.3rem';
      }
      if (summaryDisplay) {
        summaryDisplay.textContent = `Baseline established via User Self-Assessment (${skillTierVal}). Dynamic roadmap configured to match declared proficiency.`;
      }
    } else {
      if (scoreDisplay) {
        scoreDisplay.textContent = `${scoreVal}%`;
        scoreDisplay.style.fontSize = '2rem';
      }
      if (summaryDisplay) {
        summaryDisplay.textContent = `Evaluated by Placify Quiz Performance Evaluator Agent. Score: ${scoreVal}%. Correct: ${correctVal}/${totalVal}. ${levelDesc}`;
      }
    }

    // WEAK Topics / Gaps
    const gapContainer = document.getElementById('gaps-list-container');
    const weakList = evaluation.weakTopics || evaluation.knowledgeGaps || [];
    document.getElementById('gap-count-num').textContent = weakList.length;

    if (weakList.length === 0) {
      gapContainer.innerHTML = `<div style="font-size: 0.85rem; color: var(--accent-emerald);">No critical knowledge gaps detected! Prerequisites satisfied.</div>`;
    } else {
      gapContainer.innerHTML = weakList.map(item => `
        <div class="gap-item" style="border-left: 3px solid var(--accent-rose);">
          <h4><i class="ph ph-warning"></i> ${item.topic} <span style="font-size: 0.75rem; background: rgba(239,68,68,0.15); color: #ef4444; padding: 0.2rem 0.5rem; border-radius: 4px; float: right;">WEAK (${item.score_pct !== undefined ? item.score_pct : (item.accuracy || 0)}%)</span></h4>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">
            ${item.reason || 'Needs targeted remedial practice.'}
          </div>
          ${item.weakConcepts && item.weakConcepts.length > 0 ? `
            <div style="font-size: 0.75rem; color: var(--accent-rose); margin-top: 0.2rem;">Weak concepts: ${item.weakConcepts.join(', ')}</div>
          ` : ''}
        </div>
      `).join('');
    }

    // INTERMEDIATE Topics
    const intermediateContainer = document.getElementById('intermediate-list-container');
    const intermediateList = evaluation.intermediateTopics || [];
    const interCountEl = document.getElementById('intermediate-count-num');
    if (interCountEl) interCountEl.textContent = intermediateList.length;

    if (intermediateContainer) {
      if (intermediateList.length === 0) {
        intermediateContainer.innerHTML = `<div style="font-size: 0.85rem; color: var(--text-muted);">No intermediate topics recorded.</div>`;
      } else {
        intermediateContainer.innerHTML = intermediateList.map(item => `
          <div style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: var(--radius-sm); padding: 0.6rem 0.9rem; margin-bottom: 0.5rem; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <strong style="color: #f59e0b;"><i class="ph ph-chart-bar"></i> ${item.topic}</strong>
              <span style="font-size: 0.75rem; background: rgba(245, 158, 11, 0.2); color: #f59e0b; padding: 0.15rem 0.5rem; border-radius: 4px; font-weight: 700;">INTERMEDIATE (${item.score_pct !== undefined ? item.score_pct : item.accuracy}%)</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">${item.reason || 'Solid applied foundation. Ready for guided project implementation.'}</div>
          </div>
        `).join('');
      }
    }

    // STRONG Topics / Mastered
    const masteredContainer = document.getElementById('mastered-list-container');
    const strongList = evaluation.strongTopics || evaluation.masteredTopics || [];
    document.getElementById('mastered-count-num').textContent = strongList.length;

    if (strongList.length === 0) {
      masteredContainer.innerHTML = `<div style="font-size: 0.85rem; color: var(--text-muted);">No topics marked as strong/mastered yet.</div>`;
    } else {
      masteredContainer.innerHTML = strongList.map(item => `
        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-sm); padding: 0.6rem 0.9rem; margin-bottom: 0.5rem; font-size: 0.85rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: var(--accent-emerald);"><i class="ph ph-check-circle"></i> ${item.topic}</strong>
            <span style="font-size: 0.75rem; background: rgba(16, 185, 129, 0.2); color: var(--accent-emerald); padding: 0.15rem 0.5rem; border-radius: 4px; font-weight: 700;">STRONG (${item.score_pct !== undefined ? item.score_pct : (item.accuracy_pct || 100)}%)</span>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">Verified Prerequisite. Ready for advanced topics.</div>
        </div>
      `).join('');
    }

    // TOPIC PROFICIENCY TABLE
    const tableContainer = document.getElementById('topic-proficiency-table-container');
    if (tableContainer && evaluation.topicEvaluations) {
      tableContainer.innerHTML = `
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-top: 0.5rem;">
          <thead>
            <tr style="background: rgba(255,255,255,0.06); text-align: left; border-bottom: 1px solid rgba(255,255,255,0.12);">
              <th style="padding: 0.7rem 0.8rem; color: var(--text-muted);">Topic</th>
              <th style="padding: 0.7rem 0.8rem; color: var(--text-muted);">Questions</th>
              <th style="padding: 0.7rem 0.8rem; color: var(--text-muted);">Accuracy</th>
              <th style="padding: 0.7rem 0.8rem; color: var(--text-muted);">Difficulty Breakdown (Beg / Int / Adv)</th>
              <th style="padding: 0.7rem 0.8rem; color: var(--text-muted);">Proficiency</th>
              <th style="padding: 0.7rem 0.8rem; color: var(--text-muted);">Evaluation Insight</th>
            </tr>
          </thead>
          <tbody>
            ${evaluation.topicEvaluations.map(t => {
              let badgeColor = 'var(--accent-rose)';
              let badgeBg = 'rgba(239, 68, 68, 0.15)';
              if (t.proficiencyLevel === 'STRONG') {
                badgeColor = 'var(--accent-emerald)';
                badgeBg = 'rgba(16, 185, 129, 0.15)';
              } else if (t.proficiencyLevel === 'INTERMEDIATE') {
                badgeColor = '#f59e0b';
                badgeBg = 'rgba(245, 158, 11, 0.15)';
              }
              return `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <td style="padding: 0.7rem 0.8rem; font-weight: 600;">${t.topic}</td>
                  <td style="padding: 0.7rem 0.8rem;">${t.correctAnswers}/${t.totalQuestions}</td>
                  <td style="padding: 0.7rem 0.8rem; font-weight: 700;">${t.accuracy}%</td>
                  <td style="padding: 0.7rem 0.8rem; font-size: 0.8rem; color: var(--text-muted);">
                    Beg: <span style="color: #fff;">${t.beginnerAccuracy !== undefined ? t.beginnerAccuracy : 100}%</span> | 
                    Int: <span style="color: #fff;">${t.intermediateAccuracy !== undefined ? t.intermediateAccuracy : 100}%</span> | 
                    Adv: <span style="color: #fff;">${t.advancedAccuracy !== undefined ? t.advancedAccuracy : 0}%</span>
                  </td>
                  <td style="padding: 0.7rem 0.8rem;">
                    <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: 700; font-size: 0.75rem;">${t.proficiencyLevel}</span>
                  </td>
                  <td style="padding: 0.7rem 0.8rem; font-size: 0.8rem; color: var(--text-muted);">${t.reason || 'Evaluated'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }
  }

  document.getElementById('build-roadmap-btn').addEventListener('click', async () => {
    const state = supervisor.progressTracker.getUserState();
    await renderRoadmapView(state.personalizedRoadmap);
    switchView('roadmap');
  });

  // =========================================================================
  // VIEW 4: PERSONALIZED DYNAMIC ROADMAP VISUALIZATION (3-LEVEL HIERARCHY)
  // =========================================================================
  let currentSelectedMonthObj = null;
  let currentSelectedWeekObj = null;
  let isStartingJourney = false;

  // =========================================================================
  // CALENDAR DATE & JOURNEY PROGRESSION HELPERS
  // =========================================================================
  function addDaysToDate(dateInput, daysToAdd) {
    const d = new Date(dateInput);
    d.setDate(d.getDate() + daysToAdd);
    return d;
  }

  function formatDateLong(dateInput) {
    const d = new Date(dateInput);
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return d.toLocaleDateString('en-US', options);
  }

  function formatDateShort(dateInput) {
    const d = new Date(dateInput);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return d.toLocaleDateString('en-US', options);
  }

  function formatDateRange(startDateInput, endDateInput) {
    const s = new Date(startDateInput);
    const e = new Date(endDateInput);
    const sMonth = s.toLocaleDateString('en-US', { month: 'short' });
    const eMonth = e.toLocaleDateString('en-US', { month: 'short' });
    const sYear = s.getFullYear();
    const eYear = e.getFullYear();

    if (sYear === eYear && sMonth === eMonth) {
      return `${sMonth} ${s.getDate()} – ${e.getDate()}, ${sYear}`;
    } else if (sYear === eYear) {
      return `${sMonth} ${s.getDate()} – ${eMonth} ${e.getDate()}, ${sYear}`;
    } else {
      return `${sMonth} ${s.getDate()}, ${sYear} – ${eMonth} ${e.getDate()}, ${eYear}`;
    }
  }

  function isSameCalendarDay(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  // =========================================================================
  // VIEW 4: PERSONALIZED DYNAMIC ROADMAP VISUALIZATION (3-LEVEL HIERARCHY)
  // =========================================================================
  async function renderRoadmapView(roadmapData) {
    let roadmap = roadmapData;
    const activeSession = supervisor.authAgent.getActiveSession();
    const userId = activeSession ? activeSession.user_id : (window.currentDraftProfile ? window.currentDraftProfile.user_id : null);

    if (userId) {
      try {
        const baseUrl = (window.location.protocol && window.location.protocol.startsWith('http')) ? window.location.origin : 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/roadmap/user/${userId}`);
        const json = await res.json();
        if (json.success && json.roadmap) {
          roadmap = json.roadmap;
        }
      } catch (err) {
        console.warn('Could not fetch server roadmap:', err);
      }
    }

    if (!roadmap) {
      const state = supervisor.progressTracker.getUserState(userId);
      roadmap = state ? state.personalizedRoadmap : null;
    }

    if (!roadmap) {
      document.getElementById('roadmap-nodes-container').innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <i class="ph ph-warning-circle" style="font-size: 2.5rem; color: var(--accent-amber); margin-bottom: 0.8rem;"></i>
          <h3>No Active Roadmap Found</h3>
          <p style="font-size: 0.9rem; margin-top: 0.4rem;">Complete the diagnostic quiz or click <strong>Regenerate Roadmap</strong> to generate your personalized learning plan.</p>
        </div>
      `;
      return;
    }

    window.activePersonalizedRoadmap = roadmap;
    const userState = supervisor.progressTracker.getUserState(userId);
    if (userState) {
      userState.personalizedRoadmap = roadmap;
      supervisor.progressTracker.saveUserState(userState, userId);
    }

    // Check journey started status
    const journeyStarted = roadmap.journey_started || (activeSession && activeSession.journey_started);
    const journeyStartDate = roadmap.journey_start_date || (activeSession && activeSession.journey_start_date);

    const bannerEl = document.getElementById('start-journey-banner');
    if (bannerEl) {
      if (!journeyStarted) {
        bannerEl.style.display = 'flex';
        const startBtn = document.getElementById('start-journey-btn');
        if (startBtn) {
          // Explicitly sync UI with initial isStartingJourney state (false on initial render)
          if (isStartingJourney) {
            startBtn.disabled = true;
            startBtn.innerHTML = `<i class="ph ph-spinner spinner"></i> Starting...`;
          } else {
            startBtn.disabled = false;
            startBtn.innerHTML = `<i class="ph ph-rocket-launch"></i> Start My Journey`;
          }

          startBtn.onclick = async () => {
            if (isStartingJourney) return;
            isStartingJourney = true;
            startBtn.disabled = true;
            startBtn.innerHTML = `<i class="ph ph-spinner spinner"></i> Starting...`;

            try {
              const clientSystemDate = new Date().toISOString();
              const res = await fetch('http://localhost:5000/api/roadmap/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, start_date: clientSystemDate })
              });
              const data = await res.json();
              if (data.success) {
                roadmap.journey_started = true;
                roadmap.journey_start_date = data.journey_start_date;
                if (activeSession) {
                  activeSession.journey_started = true;
                  activeSession.journey_start_date = data.journey_start_date;
                  supervisor.authAgent.setActiveSession(activeSession);
                }
                const state = supervisor.progressTracker.getUserState();
                state.personalizedRoadmap = roadmap;
                supervisor.progressTracker.saveUserState(state);
                isStartingJourney = false;
                renderRoadmapView(roadmap);
              } else {
                alert(data.error || 'Failed to start journey.');
              }
            } catch (err) {
              console.error('Error starting journey:', err);
              alert('Error starting journey: ' + err.message);
            } finally {
              isStartingJourney = false;
              if (!roadmap.journey_started && startBtn) {
                startBtn.disabled = false;
                startBtn.innerHTML = `<i class="ph ph-rocket-launch"></i> Start My Journey`;
              }
            }
          };
        }
      } else {
        bannerEl.style.display = 'none';
      }
    }

    const domainTag = document.getElementById('roadmap-domain-tag');
    if (domainTag) domainTag.textContent = roadmap.domain_id || 'DOM';
    
    document.getElementById('rm-summary-domain').textContent = roadmap.domain || 'Full-Stack Web Development';
    document.getElementById('rm-summary-timeline').textContent = `${roadmap.timeline_months || 4} Months`;
    document.getElementById('rm-summary-hours').textContent = `${roadmap.daily_hours || 2.0} Hours / Day`;
    
    let scoreDisplay = roadmap.quiz_score !== null && roadmap.quiz_score !== undefined ? `${roadmap.quiz_score}%` : 'Unassessed';
    if (journeyStarted && journeyStartDate) {
      scoreDisplay += ` • 🚀 Started: ${formatDateShort(journeyStartDate)}`;
    }
    document.getElementById('rm-summary-score').textContent = scoreDisplay;

    renderMonthlyView(roadmap);
  }

  function renderMonthlyView(roadmap) {
    currentSelectedMonthObj = null;
    currentSelectedWeekObj = null;

    document.getElementById('roadmap-level-indicator').textContent = 'Level 1: Monthly Roadmap';
    const navMonths = document.getElementById('nav-level-months');
    const navWeeks = document.getElementById('nav-level-weeks');
    const navDays = document.getElementById('nav-level-days');

    navMonths.classList.add('active');
    navWeeks.classList.remove('active');
    navWeeks.disabled = true;
    navDays.classList.remove('active');
    navDays.disabled = true;

    const container = document.getElementById('roadmap-nodes-container');
    const monthlyList = roadmap.monthly_roadmap || [];

    if (monthlyList.length === 0 && roadmap.milestones) {
      // Legacy milestones fallback render
      container.innerHTML = roadmap.milestones.map((m, idx) => `
        <div class="roadmap-node ${m.type} ${m.status}">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.3rem;">
              <span class="node-tag ${m.type}">${m.type}</span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">Week ${m.targetWeek}</span>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main);">${m.title}</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">
              ${m.skipReason || m.reason || `Target Topic: ${m.topic}`}
            </p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.8rem; font-weight: 600; color: var(--accent-cyan);">${m.estHours} hrs</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">${m.status}</div>
          </div>
        </div>
      `).join('');
      return;
    }

    if (monthlyList.length === 0) {
      container.innerHTML = `<div style="padding: 2rem; color: var(--text-muted);">No monthly data available in roadmap.</div>`;
      return;
    }

    const isStarted = (roadmap.journey_started || (supervisor.authAgent.getActiveSession() && supervisor.authAgent.getActiveSession().journey_started)) && (roadmap.journey_start_date || (supervisor.authAgent.getActiveSession() && supervisor.authAgent.getActiveSession().journey_start_date));
    const startDate = roadmap.journey_start_date || (supervisor.authAgent.getActiveSession() ? supervisor.authAgent.getActiveSession().journey_start_date : null);

    container.innerHTML = monthlyList.map((m, idx) => {
      let priorityColor = 'var(--accent-cyan)';
      if (m.priority === 'HIGH') priorityColor = 'var(--accent-rose)';
      else if (m.priority === 'MEDIUM') priorityColor = '#f59e0b';

      const monthStartDate = isStarted && startDate ? addDaysToDate(startDate, (m.month_number - 1) * 28) : null;
      const monthEndDate = isStarted && startDate ? addDaysToDate(startDate, m.month_number * 28 - 1) : null;

      return `
        <div class="glass-card month-card" data-midx="${idx}" style="margin-bottom: 1.2rem; border-left: 4px solid ${priorityColor}; cursor: pointer; transition: transform 0.2s, border-color 0.2s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.6rem;">
            <div>
              <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.3rem; flex-wrap: wrap;">
                <span class="node-tag ${m.priority === 'HIGH' ? 'REMEDIAL' : 'STANDARD'}">Month ${m.month_number}</span>
                <span class="tier-badge ${m.difficulty || 'INTERMEDIATE'}">${m.difficulty || 'INTERMEDIATE'}</span>
                <span style="font-size: 0.75rem; color: var(--text-muted);">${m.weeks ? m.weeks.length : 4} Weeks</span>
                ${isStarted && monthStartDate && monthEndDate ? `
                  <span style="font-size: 0.78rem; font-weight: 700; color: var(--accent-cyan); background: rgba(6, 182, 212, 0.12); padding: 0.15rem 0.6rem; border-radius: 4px;">
                    📅 ${formatDateRange(monthStartDate, monthEndDate)}
                  </span>
                ` : ''}
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff; margin: 0.3rem 0;">${m.title}</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.6rem; line-height: 1.4;">${m.objective}</p>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.9rem; font-weight: 700; color: var(--accent-cyan);">${m.estimated_hours} Hours</div>
              <button class="btn btn-secondary btn-view-weeks" data-midx="${idx}" style="font-size: 0.78rem; padding: 0.3rem 0.7rem; margin-top: 0.5rem;">
                Explore Weeks <i class="ph ph-arrow-right"></i>
              </button>
            </div>
          </div>

          <div style="margin-top: 0.8rem; padding-top: 0.8rem; border-top: 1px solid rgba(255,255,255,0.05); display: flex; gap: 0.6rem; flex-wrap: wrap;">
            ${(m.topics || []).map(t => `<span style="font-size: 0.75rem; background: rgba(255,255,255,0.06); color: var(--accent-emerald); padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: 600;">📌 ${t}</span>`).join('')}
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.month-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const midx = parseInt(card.dataset.midx, 10);
        const currentRoadmap = window.activePersonalizedRoadmap || roadmap;
        const freshMonthlyList = currentRoadmap.monthly_roadmap || [];
        const monthObj = freshMonthlyList[midx];
        if (monthObj) {
          renderWeeklyView(currentRoadmap, monthObj);
        }
      });
    });
  }

  function renderWeeklyView(roadmap, monthObj) {
    currentSelectedMonthObj = monthObj;
    currentSelectedWeekObj = null;

    document.getElementById('roadmap-level-indicator').textContent = `Level 2: Month ${monthObj.month_number} Weekly Roadmap`;
    const navMonths = document.getElementById('nav-level-months');
    const navWeeks = document.getElementById('nav-level-weeks');
    const navDays = document.getElementById('nav-level-days');

    navMonths.classList.remove('active');
    navWeeks.classList.add('active');
    navWeeks.disabled = false;
    navWeeks.textContent = `Month ${monthObj.month_number} Weeks`;
    navDays.classList.remove('active');
    navDays.disabled = true;

    const container = document.getElementById('roadmap-nodes-container');
    const weeklyList = monthObj.weeks || [];

    if (weeklyList.length === 0) {
      container.innerHTML = `<div style="padding: 2rem; color: var(--text-muted);">No weeks found for Month ${monthObj.month_number}.</div>`;
      return;
    }

    const isStarted = (roadmap.journey_started || (supervisor.authAgent.getActiveSession() && supervisor.authAgent.getActiveSession().journey_started)) && (roadmap.journey_start_date || (supervisor.authAgent.getActiveSession() && supervisor.authAgent.getActiveSession().journey_start_date));
    const startDate = roadmap.journey_start_date || (supervisor.authAgent.getActiveSession() ? supervisor.authAgent.getActiveSession().journey_start_date : null);

    container.innerHTML = `
      <div style="margin-bottom: 1rem; background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); padding: 0.8rem 1rem; border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.6rem;">
        <div>
          <strong style="color: var(--accent-violet);">Parent Month ${monthObj.month_number}:</strong> ${monthObj.title}
        </div>
        <button id="back-to-months-btn" class="btn btn-secondary" style="font-size: 0.78rem; padding: 0.3rem 0.6rem;">
          <i class="ph ph-arrow-left"></i> Back to Monthly View
        </button>
      </div>

      ${weeklyList.map((w, idx) => {
        const weekStartDate = isStarted && startDate ? addDaysToDate(startDate, (w.week_number - 1) * 7) : null;
        const weekEndDate = isStarted && startDate ? addDaysToDate(startDate, w.week_number * 7 - 1) : null;

        return `
          <div class="glass-card week-card" data-widx="${idx}" style="margin-bottom: 1rem; cursor: pointer; border-left: 4px solid var(--accent-violet);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.6rem;">
              <div>
                <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.3rem; flex-wrap: wrap;">
                  <span class="node-tag STANDARD">Week ${w.week_number}</span>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${w.days ? w.days.length : 7} Phases</span>
                  ${isStarted && weekStartDate && weekEndDate ? `
                    <span style="font-size: 0.78rem; font-weight: 700; color: var(--accent-violet); background: rgba(139, 92, 246, 0.15); padding: 0.15rem 0.6rem; border-radius: 4px;">
                      📅 ${formatDateRange(weekStartDate, weekEndDate)}
                    </span>
                  ` : ''}
                </div>
                <h4 style="font-size: 1.05rem; font-weight: 700; color: #fff; margin: 0.2rem 0;">${w.title}</h4>
                <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.5rem;">${w.objective}</p>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--accent-cyan);">${w.estimated_hours} Hours</div>
                <button class="btn btn-secondary btn-view-days" data-widx="${idx}" style="font-size: 0.75rem; padding: 0.25rem 0.6rem; margin-top: 0.4rem;">
                  View Phases <i class="ph ph-caret-right"></i>
                </button>
              </div>
            </div>

            <div style="margin-top: 0.6rem; font-size: 0.8rem; color: var(--text-muted); display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; background: rgba(0,0,0,0.2); padding: 0.6rem; border-radius: 6px;">
              <div><strong>Practice Focus:</strong> ${w.practice || 'Coding drills'}</div>
              <div><strong>Revision Focus:</strong> ${w.revision || 'Concept recap'}</div>
              <div><strong>Assessment:</strong> ${w.assessment || 'Weekly quiz'}</div>
            </div>
          </div>
        `;
      }).join('')}
    `;

    document.getElementById('back-to-months-btn').addEventListener('click', () => {
      renderMonthlyView(window.activePersonalizedRoadmap || roadmap);
    });

    container.querySelectorAll('.week-card').forEach(card => {
      card.addEventListener('click', () => {
        const widx = parseInt(card.dataset.widx, 10);
        const currentRoadmap = window.activePersonalizedRoadmap || roadmap;
        const currentMonth = currentRoadmap.monthly_roadmap?.find(m => Number(m.month_number) === Number(monthObj.month_number)) || monthObj;
        const freshWeeklyList = currentMonth.weeks || [];
        const weekObj = freshWeeklyList[widx];
        if (weekObj) {
          renderDayView(currentRoadmap, currentMonth, weekObj);
        }
      });
    });
  }

  function renderDayView(roadmap, monthObj, weekObj) {
    currentSelectedMonthObj = monthObj;
    currentSelectedWeekObj = weekObj;

    document.getElementById('roadmap-level-indicator').textContent = `Level 3: Month ${monthObj.month_number} Week ${weekObj.week_number} Phases`;
    const navMonths = document.getElementById('nav-level-months');
    const navWeeks = document.getElementById('nav-level-weeks');
    const navDays = document.getElementById('nav-level-days');

    navMonths.classList.remove('active');
    navWeeks.classList.remove('active');
    navDays.classList.add('active');
    navDays.disabled = false;
    navDays.textContent = `Week ${weekObj.week_number} Phases`;

    const container = document.getElementById('roadmap-nodes-container');
    const daysList = weekObj.days || [];

    const activeSession = supervisor.authAgent.getActiveSession();
    const userId = activeSession ? activeSession.user_id : (window.currentDraftProfile ? window.currentDraftProfile.user_id : null);
    const userState = supervisor.progressTracker.getUserState(userId);

    const isStarted = (roadmap.journey_started || (activeSession && activeSession.journey_started)) && (roadmap.journey_start_date || (activeSession && activeSession.journey_start_date));
    const startDate = roadmap.journey_start_date || (activeSession ? activeSession.journey_start_date : null);

    container.innerHTML = `
      <div style="margin-bottom: 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 0.8rem 1rem; border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.6rem;">
        <div>
          <strong style="color: var(--accent-emerald);">Parent Week ${weekObj.week_number}:</strong> ${weekObj.title}
        </div>
        <button id="back-to-weeks-btn" class="btn btn-secondary" style="font-size: 0.78rem; padding: 0.3rem 0.6rem;">
          <i class="ph ph-arrow-left"></i> Back to Weeks
        </button>
      </div>

      ${daysList.map(d => {
        const normDayMinutes = d.total_minutes || d.estimated_minutes || 120;
        const overallDayOffset = (weekObj.week_number - 1) * 7 + (d.day_number - 1);
        const dayDateObj = isStarted && startDate ? addDaysToDate(startDate, overallDayOffset) : null;
        const dayFormatted = dayDateObj ? formatDateLong(dayDateObj) : (d.day_name || 'Phase ' + d.day_number);
        const isToday = dayDateObj ? isSameCalendarDay(dayDateObj, new Date()) : false;

        const rawTasks = Array.isArray(d.tasks) ? d.tasks : [];
        const normTasks = rawTasks.map((rawT, idx) => {
          return window.normalizeDailyTask ? window.normalizeDailyTask(rawT, {
            domain: roadmap.domain || 'fullstack',
            monthNumber: monthObj.month_number,
            weekNumber: weekObj.week_number,
            dayNumber: d.day_number,
            topic: d.topic,
            taskSeq: idx + 1
          }) : rawT;
        });

        const totalTasks = normTasks.length;
        const completedTasks = normTasks.filter(t => t.completed === true || String(t.status || '').toUpperCase() === 'COMPLETED' || String(t.taskStatus || '').toUpperCase() === 'COMPLETED').length;
        const allTasksCompleted = totalTasks > 0 && completedTasks === totalTasks;
        const someTasksCompleted = completedTasks > 0 && completedTasks < totalTasks;

        const phaseKey = `m${monthObj.month_number}_w${weekObj.week_number}_d${d.day_number}`;
        const assessmentTaken = Boolean(
          d.assessment_taken === true ||
          d.assessmentTaken === true ||
          d.assessment_completed === true ||
          (userState?.phaseAssessments && (userState.phaseAssessments[phaseKey] || (d.id && userState.phaseAssessments[d.id]) || (d.day_id && userState.phaseAssessments[d.day_id]))) ||
          (Array.isArray(userState?.history) && userState.history.some(h => 
            h.phaseKey === phaseKey ||
            (d.id && h.dayId === d.id) ||
            (d.day_id && h.dayId === d.day_id) ||
            (Number(h.monthNumber) === Number(monthObj.month_number) && Number(h.weekNumber) === Number(weekObj.week_number) && Number(h.dayNumber) === Number(d.day_number))
          ))
        );

        const roadmapId = roadmap.roadmap_id || roadmap._id || roadmap.id || '';
        const mNum = monthObj.month_number || 1;
        const wNum = weekObj.week_number || 1;
        const dNum = d.day_number;
        const dId = d.id || d.day_id || '';

        let actionButtonsHTML = '';
        if (allTasksCompleted && !assessmentTaken) {
          // Case C: All tasks completed, assessment not taken -> Review Phase + Take Assessment
          actionButtonsHTML = `
            <button class="btn btn-secondary open-phase-hub-btn launch-day-hub-btn" 
              data-roadmap-id="${roadmapId}" 
              data-month="${mNum}" 
              data-week="${wNum}" 
              data-day="${dNum}" 
              data-day-id="${dId}" 
              style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">
              Review Phase <i class="ph ph-arrow-right"></i>
            </button>
            <button class="btn btn-emerald take-phase-assessment-btn" 
              data-roadmap-id="${roadmapId}" 
              data-month="${mNum}" 
              data-week="${wNum}" 
              data-day="${dNum}" 
              data-day-id="${dId}" 
              style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">
              Take Assessment <i class="ph ph-note-pencil"></i>
            </button>
          `;
        } else if (allTasksCompleted && assessmentTaken) {
          // Case D: All tasks completed and assessment taken -> Review Phase
          actionButtonsHTML = `
            <button class="btn btn-secondary open-phase-hub-btn launch-day-hub-btn" 
              data-roadmap-id="${roadmapId}" 
              data-month="${mNum}" 
              data-week="${wNum}" 
              data-day="${dNum}" 
              data-day-id="${dId}" 
              style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">
              Review Phase <i class="ph ph-arrow-right"></i>
            </button>
          `;
        } else if (someTasksCompleted) {
          // Case B: Some tasks completed, some tasks remaining -> Continue Phase
          actionButtonsHTML = `
            <button class="btn btn-emerald open-phase-hub-btn launch-day-hub-btn" 
              data-roadmap-id="${roadmapId}" 
              data-month="${mNum}" 
              data-week="${wNum}" 
              data-day="${dNum}" 
              data-day-id="${dId}" 
              style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">
              Continue Phase <i class="ph ph-arrow-right"></i>
            </button>
          `;
        } else {
          // Case A: No tasks completed yet -> Launch Phase
          actionButtonsHTML = `
            <button class="btn btn-emerald open-phase-hub-btn launch-day-hub-btn" 
              data-roadmap-id="${roadmapId}" 
              data-month="${mNum}" 
              data-week="${wNum}" 
              data-day="${dNum}" 
              data-day-id="${dId}" 
              style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">
              Launch Phase <i class="ph ph-arrow-right"></i>
            </button>
          `;
        }

        return `
          <div class="glass-card" style="margin-bottom: 1.2rem; border-left: 4px solid ${isToday ? 'var(--accent-cyan)' : 'var(--accent-emerald)'}; ${isToday ? 'box-shadow: 0 0 15px rgba(6, 182, 212, 0.2);' : ''}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.6rem; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
                <span style="font-size: 0.85rem; font-weight: 700; background: rgba(16, 185, 129, 0.2); color: var(--accent-emerald); padding: 0.2rem 0.6rem; border-radius: 4px;">
                  Phase ${d.day_number}
                </span>
                <strong style="font-size: 1rem; color: #fff;">${dayFormatted}</strong>
                ${isToday ? `
                  <span style="font-size: 0.72rem; font-weight: 800; background: var(--accent-cyan); color: #000; padding: 0.15rem 0.5rem; border-radius: 4px;">
                    TODAY
                  </span>
                ` : ''}
                <span style="font-size: 0.85rem; color: var(--text-muted);">(${d.topic || weekObj.topics[0]})</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
                <span style="font-size: 0.82rem; font-weight: 700; color: var(--accent-cyan); margin-right: 0.2rem;">
                  ⏱️ ${normDayMinutes} Mins Workload
                </span>
                ${actionButtonsHTML}
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.6rem;">
              ${(d.tasks || []).map((rawT, idx) => {
                const normTask = window.normalizeDailyTask ? window.normalizeDailyTask(rawT, {
                  domain: roadmap.domain || 'fullstack',
                  monthNumber: monthObj.month_number,
                  weekNumber: weekObj.week_number,
                  dayNumber: d.day_number,
                  topic: d.topic,
                  taskSeq: idx + 1
                }) : rawT;

                let typeClass = 'STANDARD';
                if (normTask.taskType === 'PRACTICE' || normTask.taskType === 'IMPLEMENT') typeClass = 'REMEDIAL';
                else if (normTask.taskType === 'PROBLEM_SOLVING' || normTask.taskType === 'PROJECT') typeClass = 'SKIPPED';

                const isDone = normTask.completed === true || String(normTask.status || '').toUpperCase() === 'COMPLETED';

                return `
                  <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 0.7rem 0.9rem; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                    <div>
                      <div style="display: flex; gap: 0.4rem; align-items: center; margin-bottom: 0.2rem;">
                        <span class="node-tag ${typeClass}" style="font-size: 0.7rem; padding: 0.1rem 0.4rem;">${normTask.taskType}</span>
                        <span class="tier-badge ${normTask.difficulty || 'INTERMEDIATE'}" style="font-size: 0.65rem; padding: 0.1rem 0.4rem;">${normTask.difficulty || 'INT'}</span>
                        <span style="font-size: 0.85rem; font-weight: 700; color: #fff;">${normTask.taskTitle}</span>
                        ${isDone ? '<span style="color: var(--accent-emerald); font-size: 0.8rem; font-weight: 700; margin-left: 0.4rem;">✓ Done</span>' : ''}
                      </div>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">
                        ${normTask.description || 'Core daily learning task.'}
                      </div>
                    </div>
                    <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-amber);">
                      ⏱️ ${normTask.durationMinutes} mins
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('')}
    `;

    container.querySelectorAll('.open-phase-hub-btn, .launch-day-hub-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const daySpec = {
          roadmapId: btn.dataset.roadmapId || '',
          month: parseInt(btn.dataset.month, 10),
          week: parseInt(btn.dataset.week, 10),
          day: parseInt(btn.dataset.day, 10),
          dayId: btn.dataset.dayId || ''
        };

        console.log('[PHASE NAVIGATION]', {
          Clicked: true,
          roadmapId: daySpec.roadmapId,
          month: daySpec.month,
          week: daySpec.week,
          day: daySpec.day,
          dayId: daySpec.dayId
        });

        renderDailyHub(daySpec);
        switchView('dailyHub');
      });
    });

    container.querySelectorAll('.take-phase-assessment-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const mNum = parseInt(btn.dataset.month, 10) || 1;
        const wNum = parseInt(btn.dataset.week, 10) || 1;
        const dNum = parseInt(btn.dataset.day, 10) || 1;
        const dId = btn.dataset.dayId || '';
        const rId = btn.dataset.roadmapId || '';

        window.currentSelectedDaySpec = {
          roadmapId: rId,
          month: mNum,
          week: wNum,
          day: dNum,
          dayId: dId
        };
        window.currentActiveDay = dNum;

        let targetDayTasks = [];
        let targetDayTopic = 'Core Learning';
        let targetDayDifficulty = 'BEGINNER';

        if (roadmap?.monthly_roadmap) {
          for (const m of roadmap.monthly_roadmap) {
            if (Number(m.month_number) !== mNum) continue;
            for (const w of (m.weeks || [])) {
              if (Number(w.week_number) !== wNum) continue;
              for (const d of (w.days || [])) {
                if (Number(d.day_number) === dNum || (dId && (d.id === dId || d.day_id === dId))) {
                  targetDayTasks = Array.isArray(d.tasks) ? d.tasks : [];
                  targetDayTopic = d.topic || (w.topics && w.topics[0]) || 'Core Learning';
                  targetDayDifficulty = d.difficulty || 'BEGINNER';
                  break;
                }
              }
            }
          }
        }

        const normTasks = targetDayTasks.map((rawT, idx) => {
          return window.normalizeDailyTask ? window.normalizeDailyTask(rawT, {
            domain: roadmap.domain || 'fullstack',
            monthNumber: mNum,
            weekNumber: wNum,
            dayNumber: dNum,
            topic: targetDayTopic,
            taskSeq: idx + 1
          }) : rawT;
        });

        const activeSess = supervisor.authAgent.getActiveSession();
        const domainKey = roadmap ? (roadmap.domain_id || roadmap.domain || roadmap.chosen_domain) : (activeSess ? activeSess.chosen_domain : 'fullstack');
        const userLevel = targetDayDifficulty || (roadmap ? (roadmap.overall_level || roadmap.skillTier || 'BEGINNER') : 'BEGINNER');

        window.currentAssessmentTaskContext = {
          dayNumber: dNum,
          monthNumber: mNum,
          weekNumber: wNum,
          dayId: dId,
          domain: domainKey,
          skillLevel: userLevel,
          dsaLanguage: roadmap?.dsa_language || roadmap?.programming_language || activeSess?.dsa_language || null,
          tasks: normTasks
        };

        const firstTask = normTasks[0] || {};
        renderConceptQuizLoading();
        switchView('conceptQuiz');
        await renderConceptQuiz(firstTask.title || firstTask.taskTitle || `Phase ${dNum} Assessment`, firstTask.topic || targetDayTopic || domainKey, window.currentAssessmentTaskContext);
      });
    });

    document.getElementById('back-to-weeks-btn').addEventListener('click', () => {
      renderWeeklyView(roadmap, monthObj);
    });
  }

  document.getElementById('nav-level-months').addEventListener('click', () => {
    if (window.activePersonalizedRoadmap) {
      renderMonthlyView(window.activePersonalizedRoadmap);
    }
  });

  document.getElementById('nav-level-weeks').addEventListener('click', () => {
    if (window.activePersonalizedRoadmap && currentSelectedMonthObj) {
      renderWeeklyView(window.activePersonalizedRoadmap, currentSelectedMonthObj);
    }
  });

  const navLevelDaysBtn = document.getElementById('nav-level-days');
  if (navLevelDaysBtn) {
    navLevelDaysBtn.addEventListener('click', () => {
      if (window.activePersonalizedRoadmap && currentSelectedMonthObj && currentSelectedWeekObj) {
        renderDayView(window.activePersonalizedRoadmap, currentSelectedMonthObj, currentSelectedWeekObj);
      }
    });
  }

  document.getElementById('regenerate-roadmap-btn').addEventListener('click', async () => {
    const activeSession = supervisor.authAgent.getActiveSession();
    const userId = activeSession ? activeSession.user_id : (window.currentDraftProfile ? window.currentDraftProfile.user_id : null);

    if (!userId) {
      alert('Please log in or register first to generate a personalized roadmap.');
      return;
    }

    try {
      const btn = document.getElementById('regenerate-roadmap-btn');
      btn.disabled = true;
      btn.innerHTML = `<i class="ph ph-spinner spinner"></i> Regenerating...`;

      const res = await fetch('http://localhost:5000/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });

      const data = await res.json();
      btn.disabled = false;
      btn.innerHTML = `<i class="ph ph-arrows-counter-clockwise"></i> Regenerate Roadmap`;

      if (data.success && data.roadmap) {
        await renderRoadmapView(data.roadmap);
        alert('✅ Roadmap successfully regenerated and updated from your latest MongoDB Atlas profile and quiz performance!');
      } else {
        alert(data.error || 'Failed to regenerate roadmap.');
      }
    } catch (err) {
      console.error('Roadmap regeneration error:', err);
      alert('Error regenerating roadmap: ' + err.message);
      const btn = document.getElementById('regenerate-roadmap-btn');
      btn.disabled = false;
      btn.innerHTML = `<i class="ph ph-arrows-counter-clockwise"></i> Regenerate Roadmap`;
    }
  });

  document.getElementById('enter-daily-hub-btn').addEventListener('click', () => {
    let savedSpec = null;
    try {
      const raw = localStorage.getItem('placify_selected_day_spec');
      if (raw) savedSpec = JSON.parse(raw);
    } catch(e) {}
    renderDailyHub(savedSpec || { month: 1, week: 1, day: 1 });
    switchView('dailyHub');
  });

  // Helper to find the next chronological day in the roadmap hierarchy
  function findNextAvailableDay(roadmap, currentMonth, currentWeek, currentDay) {
    if (!roadmap || !Array.isArray(roadmap.monthly_roadmap)) return null;

    const allDays = [];
    roadmap.monthly_roadmap.forEach(m => {
      const mNum = parseInt(m.month_number, 10);
      (m.weeks || []).forEach(w => {
        const wNum = parseInt(w.week_number, 10);
        (w.days || []).forEach(d => {
          const dNum = parseInt(d.day_number, 10);
          allDays.push({
            roadmapId: roadmap.roadmap_id || roadmap._id || roadmap.id || '',
            month: mNum,
            week: wNum,
            day: dNum,
            dayId: d.id || d.day_id || `day_${dNum}`,
            topic: d.topic || '',
            tasks: d.tasks || []
          });
        });
      });
    });

    allDays.sort((a, b) => {
      if (a.month !== b.month) return a.month - b.month;
      if (a.week !== b.week) return a.week - b.week;
      return a.day - b.day;
    });

    const currentIndex = allDays.findIndex(d =>
      d.month === Number(currentMonth) &&
      d.week === Number(currentWeek) &&
      d.day === Number(currentDay)
    );

    if (currentIndex >= 0 && currentIndex < allDays.length - 1) {
      return allDays[currentIndex + 1];
    }
    return null;
  }
  window.findNextAvailableDay = findNextAvailableDay;

  // Global Task Completion Handler
  async function handleTaskCompleteButtonClick(button) {
    if (!button) return;

    const taskId = button.dataset.taskId;
    const currentlyCompleted = button.dataset.completed === 'true';

    // Prevent duplicate completion or clicking while processing
    if (currentlyCompleted || button.disabled) {
      return;
    }

    const monthNumber = parseInt(button.dataset.month, 10) || 1;
    const weekNumber = parseInt(button.dataset.week, 10) || 1;
    const dayNumber = parseInt(button.dataset.day, 10) || window.currentActiveDay || 1;
    const taskTitle = button.dataset.title || '';

    console.log('[TASK CLICK]', {
      taskId: taskId,
      title: taskTitle,
      month: monthNumber,
      week: weekNumber,
      day: dayNumber
    });

    console.log('[TASK BUTTON CLICK]', {
      taskId: taskId,
      title: taskTitle,
      month: monthNumber,
      week: weekNumber,
      day: dayNumber
    });

    const originalText = button.textContent;
    button.disabled = true;
    button.classList.add('loading');
    button.textContent = 'Completing...';

    try {
      const activeSession = supervisor.authAgent.getActiveSession();
      const userId = activeSession ? activeSession.user_id : (window.currentDraftProfile ? window.currentDraftProfile.user_id : null);
      const baseUrl = window.location.origin.includes('http') ? window.location.origin : 'http://localhost:5000';
      const payload = {
        user_id: userId,
        taskId: taskId,
        completed: true,
        monthNumber: monthNumber,
        weekNumber: weekNumber,
        dayNumber: dayNumber,
        title: taskTitle
      };

      console.log('[TASK API REQUEST]', {
        url: `${baseUrl}/api/task/status`,
        payload: payload
      });

      const response = await fetch(`${baseUrl}/api/task/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      console.log('[TASK API RESPONSE]', {
        status: response.status,
        success: result.success,
        completed: result.completed
      });

      if (!response.ok || !result.success) throw new Error(result.error || 'Could not update task status.');

      button.dataset.completed = 'true';
      button.setAttribute('aria-pressed', 'true');
      button.textContent = '✓ Completed';
      button.style.opacity = '0.85';
      button.style.cursor = 'default';
      button.classList.remove('btn-secondary', 'loading');
      button.classList.add('btn-success');
      button.disabled = true;

      // Keep the in-memory roadmap synchronized so returning to the day
      // immediately reflects the learner's completed state.
      const activeRoadmap = window.activePersonalizedRoadmap || supervisor.progressTracker.getUserState(userId)?.personalizedRoadmap;
      if (activeRoadmap?.monthly_roadmap) {
        activeRoadmap.monthly_roadmap.forEach(month => {
          if (monthNumber !== undefined && Number(month.month_number) !== Number(monthNumber)) return;
          (month.weeks || []).forEach(week => {
            if (weekNumber !== undefined && Number(week.week_number) !== Number(weekNumber)) return;
            (week.days || []).forEach(day => {
              if (dayNumber !== undefined && Number(day.day_number) !== Number(dayNumber)) return;
              (day.tasks || []).forEach((task, tIdx) => {
                const exactId = (task.taskId && task.taskId === taskId) || (task.id && task.id === taskId);
                const titleMatch = taskTitle && ((task.title || task.taskTitle) === taskTitle);
                const seqMatch = taskId && (taskId === `task_${monthNumber}_${weekNumber}_${dayNumber}_${tIdx + 1}` || taskId === `task_day_${dayNumber}_${tIdx + 1}`);

                if (exactId || titleMatch || seqMatch || (day.tasks.length === 1)) {
                  task.completed = true;
                  task.status = 'COMPLETED';
                  task.completed_at = result.completedAt || new Date().toISOString();
                  task.completedAt = task.completed_at;
                }
              });
            });
          });
        });
        window.activePersonalizedRoadmap = activeRoadmap;
        const state = supervisor.progressTracker.getUserState(userId);
        if (state) {
          state.personalizedRoadmap = activeRoadmap;
          if (result.streak !== undefined) state.streak = result.streak;
          if (result.xp !== undefined) state.xp = result.xp;
          if (result.level !== undefined) state.level = result.level;
          if (Array.isArray(result.badges)) state.badges = result.badges;
          if (result.masteryPct !== undefined) state.masteryPct = result.masteryPct;
          supervisor.progressTracker.saveUserState(state, userId);
        }
      }

      // Update Progress Tracker with authoritative server stats
      if (supervisor?.progressTracker) {
        const userState = supervisor.progressTracker.getUserState(userId);
        if (userState) {
          if (result.streak !== undefined) userState.streak = result.streak;
          if (result.xp !== undefined) userState.xp = result.xp;
          if (result.level !== undefined) userState.level = result.level;
          if (Array.isArray(result.badges)) userState.badges = result.badges;
          if (result.masteryPct !== undefined) userState.masteryPct = result.masteryPct;
          supervisor.progressTracker.saveUserState(userState, userId);
        }
      }

      updateHeaderStats({
        streak: result.streak,
        xp: result.xp,
        level: result.level,
        badges: result.badges,
        masteryPct: result.masteryPct
      });

      // Background sync with authoritative backend roadmap
      try {
        const freshRes = await fetch(`${baseUrl}/api/roadmap/user/${userId}`);
        if (freshRes.ok) {
          const freshData = await freshRes.json();
          if (freshData && freshData.success && freshData.roadmap) {
            window.activePersonalizedRoadmap = freshData.roadmap;
            const state = supervisor.progressTracker.getUserState(userId);
            if (state) {
              state.personalizedRoadmap = freshData.roadmap;
              supervisor.progressTracker.saveUserState(state, userId);
            }
          }
        }
      } catch (fErr) {
        console.warn('[TASK SYNC] Background roadmap fetch skipped:', fErr);
      }

      // Check whether all tasks for the CURRENT DAY are complete
      let currentDayObj = null;
      const syncRoadmap = window.activePersonalizedRoadmap || activeRoadmap;
      if (syncRoadmap?.monthly_roadmap) {
        for (const m of syncRoadmap.monthly_roadmap) {
          if (Number(m.month_number) === Number(monthNumber)) {
            for (const w of (m.weeks || [])) {
              if (Number(w.week_number) === Number(weekNumber)) {
                for (const d of (w.days || [])) {
                  if (Number(d.day_number) === Number(dayNumber)) {
                    currentDayObj = d;
                    break;
                  }
                }
              }
              if (currentDayObj) break;
            }
          }
          if (currentDayObj) break;
        }
      }

      const currentDayTasks = currentDayObj?.tasks || [];
      const totalDayTasks = currentDayTasks.length;
      const completedDayTasksCount = currentDayTasks.filter(t => t.completed === true || String(t.status || '').toUpperCase() === 'COMPLETED').length;
      const remainingDayTasksCount = totalDayTasks - completedDayTasksCount;
      const dayProgressPct = totalDayTasks > 0 ? Math.round((completedDayTasksCount / totalDayTasks) * 100) : 0;
      const allDayTasksCompleted = totalDayTasks > 0 && remainingDayTasksCount === 0;

      console.log('[DAY PROGRESS]', {
        day: dayNumber,
        totalTasks: totalDayTasks,
        completedTasks: completedDayTasksCount,
        remainingTasks: remainingDayTasksCount,
        percentage: dayProgressPct
      });

      const progressBadgeEl = document.getElementById('current-day-progress-badge');
      if (progressBadgeEl) {
        progressBadgeEl.textContent = `${completedDayTasksCount} / ${totalDayTasks} Completed (${dayProgressPct}%)`;
      }
      const progressBarFillEl = document.getElementById('day-progress-bar-fill');
      if (progressBarFillEl) {
        progressBarFillEl.style.width = `${dayProgressPct}%`;
      }

      console.log('[NEXT DAY CHECK]', {
        currentDay: dayNumber,
        allCompleted: allDayTasksCompleted
      });

      // If all tasks for current day are complete, automatically transition to next available day
      if (allDayTasksCompleted) {
        const nextDaySpec = findNextAvailableDay(syncRoadmap, monthNumber, weekNumber, dayNumber);
        if (nextDaySpec) {
          console.log('[NEXT DAY]', {
            month: nextDaySpec.month,
            week: nextDaySpec.week,
            day: nextDaySpec.day
          });

          window.currentSelectedDaySpec = {
            roadmapId: nextDaySpec.roadmapId,
            month: nextDaySpec.month,
            week: nextDaySpec.week,
            day: nextDaySpec.day,
            dayId: nextDaySpec.dayId
          };
          try {
            localStorage.setItem('placify_selected_day_spec', JSON.stringify(window.currentSelectedDaySpec));
            if (userId) localStorage.setItem(`placify_selected_day_spec_${userId}`, JSON.stringify(window.currentSelectedDaySpec));
          } catch (e) {}

          // Automatically load next day's tasks & resources
          await renderDailyHub(nextDaySpec);
        } else {
          console.log('[ROADMAP COMPLETE] All days completed in roadmap!');
        }
      }

    } catch (err) {
      console.error('[TASK STATUS UPDATE]', err);
      button.disabled = false;
      button.classList.remove('loading');
      button.textContent = originalText || 'Mark Task Complete';
      alert('Unable to save task completion. Please try again.');
      return;
    }
  }
  window.handleTaskCompleteButtonClick = handleTaskCompleteButtonClick;

  // Global Delegated Click Listener for Task Completion
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('.task-complete-toggle');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    await handleTaskCompleteButtonClick(button);
  });

  // =========================================================================
  // VIEW 5: DAILY LEARNING HUB
  // =========================================================================
  async function renderDailyHub(targetSpecOrNumber) {
    let daySpec = {};
    if (typeof targetSpecOrNumber === 'object' && targetSpecOrNumber !== null) {
      daySpec = targetSpecOrNumber;
    } else {
      const parsedNum = parseInt(targetSpecOrNumber, 10) || 1;
      daySpec = { day: parsedNum };
    }

    const requestedMonth = daySpec.month !== undefined && daySpec.month !== null ? parseInt(daySpec.month, 10) : null;
    const requestedWeek = daySpec.week !== undefined && daySpec.week !== null ? parseInt(daySpec.week, 10) : null;
    const requestedDay = daySpec.day !== undefined && daySpec.day !== null ? parseInt(daySpec.day, 10) : 1;
    const requestedDayId = daySpec.dayId || null;
    const requestedRoadmapId = daySpec.roadmapId || null;

    window.currentSelectedDaySpec = {
      roadmapId: requestedRoadmapId,
      month: requestedMonth,
      week: requestedWeek,
      day: requestedDay,
      dayId: requestedDayId
    };

    try {
      localStorage.setItem('placify_selected_day_spec', JSON.stringify(window.currentSelectedDaySpec));
    } catch (e) {}

    // Bulletproof roadmap resolution from memory, state, or localStorage
    let roadmap = window.activePersonalizedRoadmap;
    if (!roadmap) {
      const state = supervisor.progressTracker.getUserState();
      roadmap = state ? state.personalizedRoadmap : null;
    }
    if (!roadmap) {
      try {
        const storedState = localStorage.getItem('placify_user_state');
        if (storedState) {
          const parsed = JSON.parse(storedState);
          roadmap = parsed.personalizedRoadmap || parsed.roadmap;
        }
      } catch (e) {}
    }

    // Refresh roadmap from database if active session exists to ensure authoritative state
    const currentSession = supervisor.authAgent.getActiveSession();
    const currentUserId = currentSession ? currentSession.user_id : (window.currentDraftProfile ? window.currentDraftProfile.user_id : null);
    if (currentUserId) {
      try {
        const baseUrl = window.location.origin.includes('http') ? window.location.origin : 'http://localhost:5000';
        const freshRes = await fetch(`${baseUrl}/api/roadmap/user/${currentUserId}`);
        if (freshRes.ok) {
          const freshData = await freshRes.json();
          if (freshData && freshData.success && freshData.roadmap) {
            roadmap = freshData.roadmap;
            window.activePersonalizedRoadmap = roadmap;
            const state = supervisor.progressTracker.getUserState();
            if (state) {
              state.personalizedRoadmap = roadmap;
              supervisor.progressTracker.saveUserState(state);
            }
          }
        }
      } catch (fErr) {
        console.warn('[DAILY HUB] Background roadmap fetch skipped:', fErr.message);
      }
    }

    let dayObj = null;
    let parentMonthObj = null;
    let parentWeekObj = null;
    let dayTasksList = [];

    if (roadmap && Array.isArray(roadmap.monthly_roadmap)) {
      // Step 1: Attempt strict match on month, week, day
      for (const month of roadmap.monthly_roadmap) {
        const mNum = parseInt(month.month_number, 10);
        if (requestedMonth !== null && mNum !== requestedMonth) continue;

        if (Array.isArray(month.weeks)) {
          for (const week of month.weeks) {
            const wNum = parseInt(week.week_number, 10);
            if (requestedWeek !== null && wNum !== requestedWeek) continue;

            if (Array.isArray(week.days)) {
              for (const day of week.days) {
                const dNum = parseInt(day.day_number, 10);
                const dId = day.id || day.day_id || '';
                if (
                  (requestedDayId && dId === requestedDayId) ||
                  dNum === requestedDay
                ) {
                  dayObj = day;
                  parentMonthObj = month;
                  parentWeekObj = week;
                  dayTasksList = Array.isArray(day.tasks) ? day.tasks : [];
                  break;
                }
              }
            }
            if (dayObj) break;
          }
        }
        if (dayObj) break;
      }

      // Step 2: Fallback search across all months/weeks if strict filter didn't match
      if (!dayObj) {
        for (const month of roadmap.monthly_roadmap) {
          if (Array.isArray(month.weeks)) {
            for (const week of month.weeks) {
              if (Array.isArray(week.days)) {
                for (const day of week.days) {
                  const dNum = parseInt(day.day_number, 10);
                  const dId = day.id || day.day_id || '';
                  if (
                    (requestedDayId && dId === requestedDayId) ||
                    dNum === requestedDay
                  ) {
                    dayObj = day;
                    parentMonthObj = month;
                    parentWeekObj = week;
                    dayTasksList = Array.isArray(day.tasks) ? day.tasks : [];
                    break;
                  }
                }
              }
              if (dayObj) break;
            }
          }
          if (dayObj) break;
        }
      }
    }

    if (parentMonthObj) currentSelectedMonthObj = parentMonthObj;
    if (parentWeekObj) currentSelectedWeekObj = parentWeekObj;

    const targetDayNum = dayObj ? parseInt(dayObj.day_number, 10) : requestedDay;
    window.currentActiveDay = targetDayNum;

    const dailyData = supervisor.getDailyTaskAndResources(daySpec);
    const activeSession = supervisor.authAgent.getActiveSession();
    const domainKey = roadmap ? (roadmap.domain_id || roadmap.domain || roadmap.chosen_domain) : 
      (activeSession ? activeSession.chosen_domain : (window.currentDraftProfile ? window.currentDraftProfile.chosen_domain : 'cybersecurity'));

    const userLevel = (dayObj && dayObj.difficulty) ? dayObj.difficulty : (roadmap ? (roadmap.overall_level || roadmap.skillTier || 'BEGINNER') : 'BEGINNER');

    if (dayTasksList.length === 0 && dailyData && dailyData.task && Array.isArray(dailyData.task.tasks) && dailyData.task.tasks.length > 0) {
      dayTasksList = dailyData.task.tasks;
    }
    window.currentAssessmentTaskContext = {
      dayNumber: targetDayNum,
      monthNumber: parentMonthObj?.month_number || requestedMonth || 1,
      weekNumber: parentWeekObj?.week_number || requestedWeek || 1,
      domain: domainKey,
      skillLevel: userLevel,
      dsaLanguage: roadmap?.dsa_language || roadmap?.programming_language || activeSession?.dsa_language || null,
      tasks: dayTasksList
    };

    const isStarted = (roadmap && (roadmap.journey_started || (activeSession && activeSession.journey_started))) &&
      (roadmap.journey_start_date || (activeSession ? activeSession.journey_start_date : null));
    const startDate = roadmap ? (roadmap.journey_start_date || (activeSession ? activeSession.journey_start_date : null)) : null;

    let dayFormatted = dayObj ? (dayObj.day_name || `Day ${targetDayNum}`) : `Day ${targetDayNum}`;
    if (parentWeekObj && isStarted && startDate) {
      const overallDayOffset = (parentWeekObj.week_number - 1) * 7 + (targetDayNum - 1);
      const dayDateObj = addDaysToDate(startDate, overallDayOffset);
      if (dayDateObj) {
        dayFormatted = formatDateLong(dayDateObj);
      }
    }

    const dayTopic = dayObj ? (dayObj.topic || 'Core Learning') : (dailyData && dailyData.task ? dailyData.task.topic : 'Core Learning');
    const dayWorkload = dayObj ? (dayObj.total_minutes || (dayTasksList.reduce((acc, t) => acc + (t.estimated_minutes || 0), 0) || 150)) : (dailyData && dailyData.task && dailyData.task.estHours ? Math.round(dailyData.task.estHours * 60) : 150);

    console.log('[DAY RESOLUTION]', {
      Requested: {
        roadmapId: requestedRoadmapId || (roadmap ? roadmap.roadmap_id || roadmap.id : null),
        month: requestedMonth,
        week: requestedWeek,
        day: requestedDay,
        dayId: requestedDayId
      },
      Resolved: {
        date: dayFormatted,
        topic: dayTopic,
        taskCount: dayTasksList.length,
        taskIds: dayTasksList.map(t => t.id || t.taskId || t.title)
      }
    });

    console.log('[EXECUTION PAGE]', {
      Rendering: true,
      dayNumber: targetDayNum,
      date: dayFormatted,
      topic: dayTopic,
      taskIds: dayTasksList.map(t => t.id || t.taskId || t.title)
    });

    const dayBadgeEl = document.getElementById('current-day-badge');
    if (dayBadgeEl) dayBadgeEl.textContent = `Day ${targetDayNum} Task Execution`;

    const titleEl = document.getElementById('current-task-title');
    if (titleEl) titleEl.textContent = `${dayFormatted} — ${dayTopic}`;

    const workloadEl = document.getElementById('current-day-workload-badge');
    if (workloadEl) workloadEl.textContent = `⏱️ ${dayWorkload} Mins Workload`;

    const typeBadgeEl = document.getElementById('task-type-badge');
    if (typeBadgeEl) {
      typeBadgeEl.textContent = `${domainKey.toUpperCase()} • ${userLevel}`;
      typeBadgeEl.className = `node-tag STANDARD`;
    }

    const resList = document.getElementById('suggested-resources-list');
    if (!resList) return;

    try {
      const userId = activeSession ? activeSession.user_id : (window.currentDraftProfile ? window.currentDraftProfile.user_id : null);

      if (dayTasksList.length === 0) {
        console.error('[ROADMAP TASK CONTRACT ERROR] Day has no tasks assigned:', { targetDayNum, dayTopic, domainKey });
        resList.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--accent-amber);"><i class="ph ph-warning-circle" style="font-size: 2rem;"></i><br/><br/>No tasks found for Day ${targetDayNum}. Please return to the roadmap and select a valid day.</div>`;
        return;
      }

      // Calculate and render current day progress
      const totalDayTasks = dayTasksList.length;
      const completedDayTasksCount = dayTasksList.filter((rawTask, idx) => {
        const norm = window.normalizeDailyTask ? window.normalizeDailyTask(rawTask, {
          domain: domainKey,
          monthNumber: parentMonthObj?.month_number || requestedMonth || 1,
          weekNumber: parentWeekObj?.week_number || requestedWeek || 1,
          dayNumber: targetDayNum,
          topic: dayTopic,
          taskSeq: idx + 1
        }) : rawTask;
        return norm.completed === true || String(norm.status || '').toUpperCase() === 'COMPLETED';
      }).length;
      const remainingDayTasksCount = totalDayTasks - completedDayTasksCount;
      const dayProgressPct = totalDayTasks > 0 ? Math.round((completedDayTasksCount / totalDayTasks) * 100) : 0;

      const progressBadgeEl = document.getElementById('current-day-progress-badge');
      if (progressBadgeEl) {
        progressBadgeEl.textContent = `${completedDayTasksCount} / ${totalDayTasks} Completed (${dayProgressPct}%)`;
      }
      const progressBarFillEl = document.getElementById('day-progress-bar-fill');
      if (progressBarFillEl) {
        progressBarFillEl.style.width = `${dayProgressPct}%`;
      }

      console.log('[DAY PROGRESS]', {
        day: targetDayNum,
        totalTasks: totalDayTasks,
        completedTasks: completedDayTasksCount,
        remainingTasks: remainingDayTasksCount,
        percentage: dayProgressPct
      });

      let fullHTML = '';

      for (let tIdx = 0; tIdx < dayTasksList.length; tIdx++) {
        const rawTaskItem = dayTasksList[tIdx];
        const taskItem = window.normalizeDailyTask ? window.normalizeDailyTask(rawTaskItem, {
          domain: domainKey,
          monthNumber: parentMonthObj?.month_number || requestedMonth || 1,
          weekNumber: parentWeekObj?.week_number || requestedWeek || 1,
          dayNumber: targetDayNum,
          topic: dayTopic,
          taskSeq: tIdx + 1
        }) : rawTaskItem;

        let typeClass = 'STANDARD';
        if (taskItem.taskType === 'PRACTICE' || taskItem.taskType === 'IMPLEMENT') typeClass = 'REMEDIAL';
        else if (taskItem.taskType === 'PROBLEM_SOLVING' || taskItem.taskType === 'PROJECT') typeClass = 'SKIPPED';

        const taskTopic =
          taskItem.taskTopic ||
          taskItem.topic ||
          taskItem.taskSubtopic ||
          taskItem.subtopic ||
          dayTopic;

        const taskId = taskItem.taskId || taskItem.id || `task_day_${targetDayNum}_${tIdx + 1}`;
        const isTaskDone = taskItem.completed === true || String(taskItem.status || '').toUpperCase() === 'COMPLETED';

        fullHTML += `
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1.2rem; margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.6rem;">
              <div>
                <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.4rem; flex-wrap: wrap;">
                  <span class="node-tag ${typeClass}" style="font-size: 0.75rem; padding: 0.15rem 0.5rem;">${taskItem.taskType || 'LEARN'}</span>
                  <span class="tier-badge ${taskItem.difficulty || userLevel}" style="font-size: 0.7rem; padding: 0.15rem 0.5rem;">${taskItem.difficulty || userLevel}</span>
                  <h3 style="font-size: 1.1rem; font-weight: 700; color: #fff; margin: 0;">${taskItem.taskTitle || taskItem.title || 'Daily Task'}</h3>
                </div>
                <button class="btn ${isTaskDone ? 'btn-success' : 'btn-secondary'} task-complete-toggle"
                  data-task-id="${taskId}"
                  data-month="${parentMonthObj?.month_number || requestedMonth || 1}"
                  data-week="${parentWeekObj?.week_number || requestedWeek || 1}"
                  data-day="${targetDayNum}"
                  data-title="${(taskItem.taskTitle || taskItem.title || 'Daily Task').replace(/"/g, '&quot;')}"
                  data-skill-id="${taskItem.skillId || ''}"
                  data-completed="${isTaskDone}"
                  ${isTaskDone ? 'disabled' : ''}
                  style="margin-top: 0.65rem; padding: 0.38rem 0.7rem; font-size: 0.75rem; ${isTaskDone ? 'opacity: 0.85; cursor: default;' : 'cursor: pointer;'}"
                  aria-pressed="${isTaskDone}">
                  ${isTaskDone ? '✓ Completed' : 'Mark Task Complete'}
                </button>
                <div style="font-size: 0.84rem; color: var(--text-muted); line-height: 1.4; margin-top: 0.5rem;">
                  ${taskItem.description || 'Read conceptual overview, study examples, and execute practice code drills.'}
                </div>
              </div>
              <div style="font-size: 0.88rem; font-weight: 700; color: var(--accent-amber); white-space: nowrap;">
                ⏱️ ${taskItem.durationMinutes || taskItem.estimated_minutes || 45} mins
              </div>
            </div>

            <!-- RECOMMENDED RESOURCES PLACEHOLDER (POPULATED ASYNCHRONOUSLY) -->
            <div style="margin-top: 1rem; padding-top: 0.8rem; border-top: 1px dashed rgba(255,255,255,0.1);">
              <h4 style="font-size: 0.86rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 0.7rem; display: flex; align-items: center; gap: 0.4rem;">
                <i class="ph ph-books"></i> Recommended Resources for Today's Task:
              </h4>

              <div id="task-resources-container-${taskId}" class="task-resources-container">
                <div style="padding: 0.75rem 1rem; color: var(--text-muted); font-size: 0.82rem; background: rgba(0,0,0,0.15); border-radius: 6px; display: flex; align-items: center; gap: 0.5rem;">
                  <i class="ph ph-spinner spinner" style="color: var(--accent-cyan);"></i> Loading resources...
                </div>
              </div>
            </div>
          </div>
        `;
      }

      // Render main Daily Hub tasks IMMEDIATELY
      resList.innerHTML = fullHTML;

      // Asynchronously fetch & render resources for each task in parallel without blocking UI
      dayTasksList.forEach(async (rawTaskItem, tIdx) => {
        const taskItem = window.normalizeDailyTask ? window.normalizeDailyTask(rawTaskItem, {
          domain: domainKey,
          dayNumber: targetDayNum,
          topic: dayTopic,
          taskSeq: tIdx + 1
        }) : rawTaskItem;

        const taskTopic = taskItem.taskTopic || taskItem.topic || taskItem.taskSubtopic || taskItem.subtopic || dayTopic;
        const taskId = taskItem.taskId || taskItem.id || `task_day_${targetDayNum}_${tIdx + 1}`;
        const containerEl = document.getElementById(`task-resources-container-${taskId}`);
        if (!containerEl) return;

        const taskContext = {
          taskItem,
          id: taskId,
          taskId,
          dayNumber: targetDayNum,
          roadmapId: roadmap ? (roadmap.roadmap_id || roadmap.id) : 'active_roadmap',
          title: taskItem.taskTitle || taskItem.title,
          taskTitle: taskItem.taskTitle || taskItem.title,
          topic: taskTopic,
          taskTopic,
          subtopic: taskItem.taskSubtopic || taskItem.subtopic || taskTopic,
          taskSubtopic: taskItem.taskSubtopic || taskItem.subtopic || taskTopic,
          domain: domainKey,
          chosen_domain: domainKey,
          user_id: userId,
          difficulty: taskItem.difficulty || userLevel
        };

        try {
          const taskResources = await supervisor.resourceSuggester.suggestResources(
            taskTopic,
            taskItem.difficulty || userLevel,
            taskContext
          );

          if (taskResources && taskResources.length > 0) {
            const taskBudgetMins = taskItem.durationMinutes || taskItem.estimated_minutes || 45;
            const totalRecMins = taskResources.reduce((sum, r) => sum + (Number(r.duration_minutes || r.estimated_minutes || 0)), 0);

            containerEl.innerHTML = `
              <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                ${taskResources.map((r, idx) => `
                  <div class="resource-card" style="border-left: 4px solid ${idx === 0 ? 'var(--accent-emerald)' : (idx === 1 ? 'var(--accent-cyan)' : 'var(--accent-amber)')}; padding: 0.9rem; background: rgba(0,0,0,0.25); border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; flex-wrap: wrap; gap: 0.4rem;">
                      <span class="node-tag ${r.category_label || (idx === 0 ? 'STANDARD' : 'REMEDIAL')}" style="font-size: 0.72rem; font-weight: 800;">
                        ⭐ ${r.category_label || (idx === 0 ? 'PRIMARY' : (idx === 1 ? 'ALTERNATIVE' : 'PRACTICE'))}
                      </span>
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 0.75rem; color: var(--accent-amber); font-weight: 700; background: rgba(245, 158, 11, 0.12); padding: 0.15rem 0.45rem; border-radius: 4px;">
                          ⏱️ ${r.duration_minutes || r.estimated_minutes || 20} min
                        </span>
                        <span style="font-size: 0.75rem; color: var(--accent-cyan); font-weight: 600;">
                          ${r.is_official ? '🏛️ Official Docs' : `Platform: ${r.platform}`}
                        </span>
                      </div>
                    </div>
                    <h5 style="font-size: 0.98rem; font-weight: 700; color: #fff; margin: 0.3rem 0;">${r.title}</h5>
                    <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.5rem;">${r.description}</p>
                    
                    <div style="font-size: 0.76rem; color: var(--accent-cyan); background: rgba(6, 182, 212, 0.08); padding: 0.3rem 0.6rem; border-radius: 4px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.3rem;">
                      <span>🎯 <strong>Topic:</strong> ${r.topic || taskTopic} &bull; <strong>Difficulty:</strong> ${r.difficulty || userLevel}</span>
                      <span>⏳ <strong>Time fit:</strong> ${r.duration_minutes || r.estimated_minutes || 20} / ${taskBudgetMins} min</span>
                    </div>

                    <p style="font-size: 0.76rem; color: var(--text-dim); font-style: italic; margin-bottom: 0.6rem;">
                      💡 <strong>Why this resource:</strong> ${r.relevance_reason || 'Directly aligned with today\'s task and time budget.'}
                    </p>

                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="font-size: 0.75rem; color: var(--text-muted);">${r.platform}</span>
                      <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald" style="font-size: 0.78rem; padding: 0.3rem 0.75rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;">
                        Open Resource <i class="ph ph-arrow-square-out"></i>
                      </a>
                    </div>
                  </div>
                `).join('')}

                <div style="margin-top: 0.3rem; padding: 0.5rem 0.8rem; background: rgba(255,255,255,0.03); border-radius: 6px; font-size: 0.78rem; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center;">
                  <span>📚 <strong>Total Recommended Learning Time:</strong></span>
                  <span style="color: ${totalRecMins <= taskBudgetMins ? 'var(--accent-emerald)' : 'var(--accent-amber)'}; font-weight: 700;">
                    ${totalRecMins} / ${taskBudgetMins} mins
                  </span>
                </div>
              </div>
            `;
          } else {
            containerEl.innerHTML = `
              <div style="padding: 0.75rem 1rem; color: var(--text-muted); font-size: 0.82rem; background: rgba(0,0,0,0.15); border-radius: 6px;">
                No sufficiently relevant resource was found for this specific task. You can still complete today's task workbook.
              </div>
            `;
          }
        } catch (resErr) {
          console.warn(`[RESOURCE LOAD WARN] Task ${taskId} resource fetch failed:`, resErr.message);
          containerEl.innerHTML = `
            <div style="padding: 0.75rem 1rem; color: var(--text-muted); font-size: 0.82rem; background: rgba(0,0,0,0.15); border-radius: 6px;">
              Recommended resources are temporarily unavailable.
            </div>
          `;
        }
      });

    } catch (err) {
      console.warn('Error rendering personalized resources:', err);
      resList.innerHTML = `<div style="padding: 1rem; color: var(--text-muted);">Some learning resources are temporarily unavailable. You may continue with your task workbook below.</div>`;
    }

    updateHeaderStats();
    fetchTechNews();
  }

  // =========================================================================
  // VIEW 5.1: REAL-TIME PERSONALIZED TECH NEWS FEED
  // =========================================================================

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatRelativeTime(dateInput) {
    if (!dateInput) return 'Just now';
    const date = new Date(dateInput);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    
    if (isNaN(diffSec) || diffSec < 60 || diffSec < 0) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
    return `${diffDay} days ago`;
  }

  function renderNewsSkeletons() {
    const containers = document.querySelectorAll('.news-feed-container, #tech-news-feed-container');
    if (!containers.length) return;
    const skeletonHtml = `
      <div class="news-card-skeleton">
        <div class="skeleton-line" style="width: 30%; height: 16px;"></div>
        <div class="skeleton-line" style="width: 85%; height: 24px; margin-top: 6px;"></div>
        <div class="skeleton-line" style="width: 50%; height: 16px;"></div>
        <div class="skeleton-line" style="width: 100%; height: 48px; margin-top: 10px;"></div>
      </div>
      <div class="news-card-skeleton">
        <div class="skeleton-line" style="width: 30%; height: 16px;"></div>
        <div class="skeleton-line" style="width: 80%; height: 24px; margin-top: 6px;"></div>
        <div class="skeleton-line" style="width: 45%; height: 16px;"></div>
        <div class="skeleton-line" style="width: 100%; height: 48px; margin-top: 10px;"></div>
      </div>
      <div class="news-card-skeleton">
        <div class="skeleton-line" style="width: 30%; height: 16px;"></div>
        <div class="skeleton-line" style="width: 90%; height: 24px; margin-top: 6px;"></div>
        <div class="skeleton-line" style="width: 55%; height: 16px;"></div>
        <div class="skeleton-line" style="width: 100%; height: 48px; margin-top: 10px;"></div>
      </div>
    `;
    containers.forEach(c => c.innerHTML = skeletonHtml);
  }

  async function fetchTechNews(isRefresh = false) {
    const containers = document.querySelectorAll('.news-feed-container, #tech-news-feed-container');
    const tagEls = document.querySelectorAll('.news-personalized-tag, #news-personalized-tag');
    const updatedEls = document.querySelectorAll('.news-last-updated, #news-last-updated');
    if (!containers.length) return;

    renderNewsSkeletons();

    const session = (supervisor && supervisor.authAgent) ? supervisor.authAgent.getActiveSession() : null;
    const userId = session ? session.user_id : (window.currentDraftProfile ? window.currentDraftProfile.user_id : '');

    try {
      const apiBase = (window.location.protocol && window.location.protocol.startsWith('http')) ? window.location.origin : 'http://localhost:5000';
      const refreshParam = isRefresh ? '&refresh=true' : '';
      const response = await fetch(`${apiBase}/api/news?userId=${encodeURIComponent(userId)}&limit=12${refreshParam}`);

      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();

      if (!data.success || !Array.isArray(data.articles)) {
        throw new Error(data.error || 'Failed to fetch news data');
      }

      // Update feed tag
      tagEls.forEach(tagEl => {
        tagEl.textContent = 'ALL TECH NEWS • LATEST FEED';
      });

      // Update last updated timestamp
      if (data.lastUpdated) {
        const timeHtml = `<i class="ph ph-clock"></i> Updated ${formatRelativeTime(data.lastUpdated)}`;
        updatedEls.forEach(updatedEl => {
          updatedEl.innerHTML = timeHtml;
        });
      }

      if (data.articles.length === 0) {
        const emptyHtml = `
          <div style="grid-column: 1 / -1; padding: 2.5rem; text-align: center; color: var(--text-muted); background: rgba(255,255,255,0.02); border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
            <i class="ph ph-newspaper-clipping" style="font-size: 2.5rem; color: var(--accent-cyan); margin-bottom: 0.8rem;"></i>
            <div style="font-size: 1.05rem; font-weight: 700; color: #fff; margin-bottom: 0.4rem;">No relevant tech news available right now.</div>
            <div>Check back soon as our background aggregator fetches fresh stories every 25 minutes.</div>
          </div>
        `;
        containers.forEach(c => c.innerHTML = emptyHtml);
        return;
      }

      // Render News Cards
      const articlesHtml = data.articles.map(article => {
        const safeTitle = escapeHtml(article.title);
        const safeSummary = escapeHtml(article.summary || article.description || '');
        const safeSource = escapeHtml(article.source || 'Tech News');
        const relativeTime = formatRelativeTime(article.publishedAt);
        const url = article.url || '#';

        const topics = Array.isArray(article.topics) ? article.topics.slice(0, 3) : [];
        const skills = Array.isArray(article.skills) ? article.skills.slice(0, 3) : [];
        const combinedTags = Array.from(new Set([...topics, ...skills])).slice(0, 4);

        const tagsHtml = combinedTags.map(tag => `<span class="news-tag">${escapeHtml(tag)}</span>`).join('');

        return `
          <article class="news-card">
            <div>
              <div class="news-card-meta">
                <span class="news-source-badge">${safeSource}</span>
                <span><i class="ph ph-clock"></i> ${relativeTime}</span>
              </div>
              <h3 class="news-card-title">${safeTitle}</h3>
              ${tagsHtml ? `<div class="news-tags-container">${tagsHtml}</div>` : ''}
              <p class="news-summary">${safeSummary}</p>
            </div>
            <div class="news-card-footer">
              <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="news-read-btn">
                Read Article <i class="ph ph-arrow-up-right"></i>
              </a>
            </div>
          </article>
        `;
      }).join('');

      containers.forEach(c => c.innerHTML = articlesHtml);

    } catch (err) {
      console.error('[TechNews] Error rendering news feed:', err);
      const errorHtml = `
        <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: var(--accent-rose); background: rgba(244, 63, 94, 0.08); border-radius: var(--radius-md); border: 1px solid rgba(244, 63, 94, 0.2);">
          <i class="ph ph-warning-circle" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
          <div style="font-weight: 700;">Unable to load the latest tech news.</div>
          <div style="font-size: 0.82rem; margin-top: 0.4rem; color: var(--text-muted);">Please verify server connectivity and try again.</div>
        </div>
      `;
      containers.forEach(c => c.innerHTML = errorHtml);
    }
  }

  const refreshNewsBtns = document.querySelectorAll('.refresh-news-btn, #refresh-news-btn');
  refreshNewsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fetchTechNews(true);
    });
  });

  // =========================================================================
  // VIEW 9: DYNAMIC INTERNSHIP RECOMMENDATION & APPLICATION LINKS
  // =========================================================================
  const internshipState = {
    page: 1,
    domain: null,
    keywords: '',
    location: 'India',
    remote: false,
    total: 0,
    internships: [],
    loading: false
  };

  function getStudentCurrentDomain() {
    const session = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
    const state = supervisor.progressTracker ? supervisor.progressTracker.getUserState() : null;
    let dKey = (session && session.chosen_domain) || (state && state.chosen_domain) || 'fullstack';

    const domainObj = (window.PLACIFY_DATA && window.PLACIFY_DATA.findDomain)
      ? window.PLACIFY_DATA.findDomain(dKey)
      : null;

    const label = domainObj ? domainObj.name : (String(dKey).replace(/_/g, ' ').toUpperCase());
    const labelEl = document.getElementById('internship-user-domain-label');
    if (labelEl) labelEl.textContent = label;

    return dKey;
  }

  function renderInternshipSkeleton() {
    const container = document.getElementById('internships-cards-container');
    if (!container) return;
    const skeletonCards = Array(6).fill(0).map(() => `
      <div class="internship-card-skeleton">
        <div class="skeleton-line" style="height: 22px; width: 70%;"></div>
        <div class="skeleton-line" style="height: 16px; width: 45%;"></div>
        <div style="display: flex; gap: 0.4rem; margin: 0.5rem 0;">
          <div class="skeleton-line" style="height: 20px; width: 60px; border-radius: 50px;"></div>
          <div class="skeleton-line" style="height: 20px; width: 80px; border-radius: 50px;"></div>
        </div>
        <div class="skeleton-line" style="height: 40px; width: 100%;"></div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
          <div class="skeleton-line" style="height: 14px; width: 30%;"></div>
          <div class="skeleton-line" style="height: 32px; width: 90px; border-radius: 50px;"></div>
        </div>
      </div>
    `).join('');
    container.innerHTML = skeletonCards;
  }

  async function fetchInternships(pageOverride = null) {
    if (pageOverride !== null) {
      internshipState.page = Math.max(1, pageOverride);
    }

    const container = document.getElementById('internships-cards-container');
    if (!container) return;

    renderInternshipSkeleton();

    const session = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
    const userId = session?.user_id || '';

    const domainSelect = document.getElementById('internship-domain-select');
    const searchInput = document.getElementById('internship-search-input');
    const locationInput = document.getElementById('internship-location-input');

    if (!internshipState.domain) {
      internshipState.domain = getStudentCurrentDomain();
      if (domainSelect) {
        domainSelect.value = internshipState.domain;
      }
    } else if (domainSelect && domainSelect.value) {
      internshipState.domain = domainSelect.value;
    }

    const currentDomain = internshipState.domain || 'fullstack';
    const keywords = searchInput ? searchInput.value.trim() : '';
    const location = locationInput ? (locationInput.value.trim() || 'India') : 'India';
    const page = internshipState.page || 1;

    try {
      const queryParams = new URLSearchParams({
        domain: currentDomain,
        location: location,
        keywords: keywords,
        page: String(page),
        limit: '12',
        userId: userId
      });

      const response = await fetch(`http://localhost:5000/api/internships?${queryParams.toString()}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch internship opportunities.');
      }

      internshipState.total = data.total || 0;
      internshipState.internships = data.internships || [];

      // Update Pagination UI
      const curPageEl = document.getElementById('internship-current-page');
      if (curPageEl) curPageEl.textContent = page;

      const prevBtn = document.getElementById('internship-prev-page-btn');
      const nextBtn = document.getElementById('internship-next-page-btn');
      if (prevBtn) prevBtn.disabled = (page <= 1);
      if (nextBtn) nextBtn.disabled = (data.internships.length < 12 || (page * 12) >= data.total);

      // Render Empty State
      if (!data.internships || data.internships.length === 0) {
        container.innerHTML = `
          <div class="glass-card" style="grid-column: 1 / -1; padding: 3rem 2rem; text-align: center; border: 1px dashed var(--border-glass);">
            <i class="ph ph-briefcase" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
            <h3 style="color: #fff; margin-bottom: 0.5rem; font-size: 1.2rem;">No Relevant Internships Found</h3>
            <p style="color: var(--text-muted); max-width: 520px; margin: 0 auto 1.5rem auto; font-size: 0.88rem; line-height: 1.5;">
              ${escapeHtml(data.message || 'No relevant internships found for your current domain. Try updating your skills or search preferences.')}
            </p>
            <button id="reset-internship-search-btn" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.5rem 1.2rem;">
              <i class="ph ph-arrows-counter-clockwise"></i> Reset Search Filters
            </button>
          </div>
        `;
        const resetBtn = document.getElementById('reset-internship-search-btn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            fetchInternships(1);
          });
        }
        return;
      }

      // Render Cards
      container.innerHTML = data.internships.map(item => {
        const titleSafe = escapeHtml(item.title);
        const companySafe = escapeHtml(item.company);
        const locSafe = escapeHtml(item.location);
        const modeSafe = escapeHtml(item.workMode || 'Hybrid');
        const descSafe = escapeHtml(item.description);
        const stipendSafe = item.stipend ? escapeHtml(item.stipend) : null;
        const appUrl = escapeHtml(item.applicationUrl);
        const sourceSafe = escapeHtml(item.source || 'Jobs Partner');
        const timeAgo = formatRelativeTime(item.postedDate);

        const modeClass = modeSafe.toLowerCase().includes('remote') ? 'work-mode-remote' :
                          modeSafe.toLowerCase().includes('hybrid') ? 'work-mode-hybrid' : 'work-mode-onsite';
        const modeIcon = modeSafe.toLowerCase().includes('remote') ? 'ph-laptop' :
                         modeSafe.toLowerCase().includes('hybrid') ? 'ph-buildings' : 'ph-map-pin';

        const skills = Array.isArray(item.skills) ? item.skills : [];
        const skillsHtml = skills.map(s => `<span class="internship-skill-tag">${escapeHtml(s)}</span>`).join('');
        const itemJson = encodeURIComponent(JSON.stringify(item));

        return `
          <div class="internship-card">
            <div>
              <div class="internship-card-header">
                <div>
                  <h3 class="internship-title">${titleSafe}</h3>
                  <div class="internship-company"><i class="ph ph-buildings"></i> ${companySafe}</div>
                </div>
              </div>

              <div class="internship-meta-row">
                <span class="meta-pill ${modeClass}">
                  <i class="ph ${modeIcon}"></i> ${modeSafe}
                </span>
                <span class="meta-pill location-pill">
                  <i class="ph ph-map-pin"></i> ${locSafe}
                </span>
                ${stipendSafe ? `<span class="meta-pill stipend-pill"><i class="ph ph-currency-dollar"></i> ${stipendSafe}</span>` : ''}
              </div>

              ${skillsHtml ? `<div class="internship-skills-container">${skillsHtml}</div>` : ''}

              <p class="internship-description">${descSafe}</p>
            </div>

            <div class="internship-card-footer">
              <div class="internship-source-info">
                <span><i class="ph ph-globe"></i> ${sourceSafe}</span>
                <span><i class="ph ph-clock"></i> ${timeAgo}</span>
              </div>
              <a href="${appUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald internship-apply-btn" data-item="${itemJson}" title="Apply directly on external listing page">
                Apply Now <i class="ph ph-arrow-square-out"></i>
              </a>
            </div>
          </div>
        `;
      }).join('');

      // Attach click handlers to Apply Now buttons to trigger post-apply modal
      container.querySelectorAll('.internship-apply-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const rawItem = btn.dataset.item;
          if (rawItem) {
            try {
              const item = JSON.parse(decodeURIComponent(rawItem));
              setTimeout(() => {
                promptPostApplyTracking(item);
              }, 350);
            } catch (e) {
              console.warn('[ApplyNow] Error parsing item:', e);
            }
          }
        });
      });

    } catch (err) {
      console.error('❌ [Internships UI] Fetch error:', err);
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 2.5rem; text-align: center; color: #fca5a5; background: rgba(239, 68, 68, 0.08); border-radius: var(--radius-md); border: 1px solid rgba(239, 68, 68, 0.25);">
          <i class="ph ph-warning-circle" style="font-size: 2.5rem; margin-bottom: 0.6rem;"></i>
          <h4 style="font-size: 1.1rem; color: #fff; margin-bottom: 0.4rem;">Internship Opportunities Temporarily Unavailable</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 500px; margin: 0 auto 1.2rem auto;">Internship opportunities are temporarily unavailable. Please try again later.</p>
          <button id="retry-internships-fetch-btn" class="btn btn-emerald" style="font-size: 0.85rem; padding: 0.45rem 1.2rem;">
            <i class="ph ph-arrows-counter-clockwise"></i> Retry Fetching
          </button>
        </div>
      `;
      const retryBtn = document.getElementById('retry-internships-fetch-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => fetchInternships(1));
      }
    }
  }

  // Bind Event Listeners for Internships UI Controls
  const filterBtn = document.getElementById('apply-internship-filter-btn');
  if (filterBtn) {
    filterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      fetchInternships(1);
    });
  }

  const domainSelectEl = document.getElementById('internship-domain-select');
  if (domainSelectEl) {
    domainSelectEl.addEventListener('change', () => {
      internshipState.domain = domainSelectEl.value;
      const labelEl = document.getElementById('internship-user-domain-label');
      if (labelEl) {
        const selectedOpt = domainSelectEl.options[domainSelectEl.selectedIndex];
        labelEl.textContent = selectedOpt ? selectedOpt.text : domainSelectEl.value;
      }
      fetchInternships(1);
    });
  }

  const refreshInternshipBtn = document.getElementById('refresh-internships-btn');
  if (refreshInternshipBtn) {
    refreshInternshipBtn.addEventListener('click', () => fetchInternships(internshipState.page || 1));
  }

  const prevPageBtn = document.getElementById('internship-prev-page-btn');
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (internshipState.page > 1) {
        fetchInternships(internshipState.page - 1);
      }
    });
  }

  const nextPageBtn = document.getElementById('internship-next-page-btn');
  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      fetchInternships(internshipState.page + 1);
    });
  }

  const searchInputEl = document.getElementById('internship-search-input');
  if (searchInputEl) {
    searchInputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        fetchInternships(1);
      }
    });
  }

  // =========================================================================
  // VIEW 10: APPLICATION TRACKING SYSTEM (MY APPLICATIONS)
  // =========================================================================
  let activePendingApplicationItem = null;

  function promptPostApplyTracking(item) {
    activePendingApplicationItem = item;
    const modal = document.getElementById('post-apply-modal');
    const jobTitleEl = document.getElementById('post-apply-job-title');
    const companyEl = document.getElementById('post-apply-company');
    const alertBox = document.getElementById('post-apply-alert-box');

    if (jobTitleEl) jobTitleEl.textContent = item.title;
    if (companyEl) companyEl.textContent = item.company;
    if (alertBox) alertBox.style.display = 'none';

    if (modal) modal.style.display = 'flex';
  }

  const btnConfirmTrack = document.getElementById('btn-confirm-track-app');
  if (btnConfirmTrack) {
    btnConfirmTrack.addEventListener('click', async () => {
      if (!activePendingApplicationItem) return;

      const session = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
      if (!session || !session.user_id) {
        alert('Please sign in or register to track your applications.');
        return;
      }

      const item = activePendingApplicationItem;
      const alertBox = document.getElementById('post-apply-alert-box');
      btnConfirmTrack.disabled = true;

      try {
        const response = await fetch('http://localhost:5000/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: session.user_id,
            internshipId: item.id,
            jobTitle: item.title,
            company: item.company,
            domain: item.domain || internshipState.domain || 'fullstack',
            source: item.source || 'Placify Jobs Partner',
            applicationUrl: item.applicationUrl,
            externalListingUrl: item.applicationUrl,
            location: item.location,
            workMode: item.workMode,
            stipend: item.stipend,
            skills: item.skills,
            status: 'Applied',
            notes: `Applied on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} via ${item.source || 'external platform'}.`
          })
        });

        const data = await response.json();

        if (response.status === 409 || data.duplicate) {
          if (alertBox) {
            alertBox.textContent = 'This opportunity is already in your applications.';
            alertBox.style.display = 'block';
          }
          btnConfirmTrack.disabled = false;
          return;
        }

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Unable to track application.');
        }

        // Hide Modal
        document.getElementById('post-apply-modal').style.display = 'none';
        activePendingApplicationItem = null;

        // Notify user & jump to My Applications
        if (confirm(`🎉 Application Tracked Successfully!\n\n"${item.title}" at ${item.company} has been saved to "My Applications".\n\nWould you like to view My Applications now?`)) {
          switchView('myApplications');
        } else {
          fetchMyApplications();
        }

      } catch (err) {
        if (alertBox) {
          alertBox.textContent = err.message || 'Error tracking application. Please try again.';
          alertBox.style.display = 'block';
        }
      } finally {
        btnConfirmTrack.disabled = false;
      }
    });
  }

  const btnCancelTrack = document.getElementById('btn-cancel-track-app');
  if (btnCancelTrack) {
    btnCancelTrack.addEventListener('click', () => {
      document.getElementById('post-apply-modal').style.display = 'none';
      activePendingApplicationItem = null;
    });
  }

  const atsState = {
    filter: 'All',
    applications: [],
    summary: {}
  };

  async function fetchMyApplications(filterOverride = null) {
    if (filterOverride !== null) {
      atsState.filter = filterOverride;
    }

    const container = document.getElementById('my-applications-grid');
    if (!container) return;

    const session = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
    const userId = session?.user_id;

    if (!userId) {
      container.innerHTML = `
        <div class="glass-card" style="grid-column: 1 / -1; padding: 3rem 2rem; text-align: center;">
          <i class="ph ph-user-circle" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
          <h3 style="color: #fff; margin-bottom: 0.5rem;">Sign In Required</h3>
          <p style="color: var(--text-muted);">Please sign in to view and track your internship applications.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `<div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: var(--text-muted);"><i class="ph ph-spinner spinner" style="font-size: 2rem;"></i><br/><br/>Loading your tracked applications...</div>`;

    try {
      const statusQuery = atsState.filter && atsState.filter !== 'All' ? `&status=${encodeURIComponent(atsState.filter)}` : '';
      const response = await fetch(`http://localhost:5000/api/applications?userId=${encodeURIComponent(userId)}${statusQuery}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch application records.');
      }

      atsState.summary = data.summary || {};
      atsState.applications = data.applications || [];

      // Update Summary Numbers
      const totalSubmitted = data.totalSubmitted !== undefined ? data.totalSubmitted : (atsState.summary.totalSubmitted || atsState.summary.total || 0);
      const statusCounts = data.statusCounts || {
        Applied: atsState.summary.applied || 0,
        Assessment: atsState.summary.assessments || 0,
        Interview: atsState.summary.interviews || 0,
        Offer: atsState.summary.offers || 0,
        Rejected: atsState.summary.rejected || 0,
        Withdrawn: atsState.summary.withdrawn || 0
      };

      const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || 0; };
      setEl('ats-hero-total-num', totalSubmitted);
      setEl('ats-stat-total', totalSubmitted);
      setEl('ats-stat-applied', statusCounts.Applied || 0);
      setEl('ats-stat-assessments', statusCounts.Assessment || 0);
      setEl('ats-stat-interviews', statusCounts.Interview || 0);
      setEl('ats-stat-offers', statusCounts.Offer || 0);
      setEl('ats-stat-rejected', statusCounts.Rejected || 0);
      setEl('ats-stat-withdrawn', statusCounts.Withdrawn || 0);

      setEl('tab-cnt-all', totalSubmitted);
      setEl('tab-cnt-applied', statusCounts.Applied || 0);
      setEl('tab-cnt-assessment', statusCounts.Assessment || 0);
      setEl('tab-cnt-interview', statusCounts.Interview || 0);
      setEl('tab-cnt-offer', statusCounts.Offer || 0);
      setEl('tab-cnt-rejected', statusCounts.Rejected || 0);
      setEl('tab-cnt-withdrawn', statusCounts.Withdrawn || 0);

      const activeStageEl = document.getElementById('ats-hero-active-stage');
      if (activeStageEl) {
        if (statusCounts.Interview > 0) activeStageEl.textContent = `${statusCounts.Interview} Interview${statusCounts.Interview > 1 ? 's' : ''}`;
        else if (statusCounts.Assessment > 0) activeStageEl.textContent = `${statusCounts.Assessment} Assessment${statusCounts.Assessment > 1 ? 's' : ''}`;
        else if (statusCounts.Offer > 0) activeStageEl.textContent = `${statusCounts.Offer} Offer${statusCounts.Offer > 1 ? 's' : ''}`;
        else if (statusCounts.Applied > 0) activeStageEl.textContent = `${statusCounts.Applied} Applied`;
        else activeStageEl.textContent = totalSubmitted > 0 ? 'Active' : 'No Submissions';
      }

      // Render Empty State
      if (!data.applications || data.applications.length === 0) {
        container.innerHTML = `
          <div class="glass-card" style="grid-column: 1 / -1; padding: 3rem 2rem; text-align: center; border: 1px dashed var(--border-glass);">
            <i class="ph ph-kanban" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
            <h3 style="color: #fff; margin-bottom: 0.5rem;">No Applications Found</h3>
            <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 1.5rem auto; font-size: 0.88rem;">
              ${atsState.filter !== 'All' ? `No applications currently marked as "${atsState.filter}".` : 'You have not saved or tracked any internship applications yet.'}
            </p>
            <button onclick="document.querySelector('.main-navbar .nav-item[data-view=internships]').click();" class="btn btn-primary" style="font-size: 0.85rem; padding: 0.5rem 1.2rem;">
              <i class="ph ph-briefcase"></i> Browse Recommended Internships
            </button>
          </div>
        `;
        return;
      }

      // Render Cards
      container.innerHTML = data.applications.map(app => renderApplicationCard(app)).join('');

      // Wire event listeners on cards
      container.querySelectorAll('.btn-update-app-status').forEach(btn => {
        btn.addEventListener('click', () => {
          const appId = btn.dataset.id;
          openUpdateStatusModal(appId);
        });
      });

      container.querySelectorAll('.btn-view-app-timeline').forEach(btn => {
        btn.addEventListener('click', () => {
          const appId = btn.dataset.id;
          openTimelineModal(appId);
        });
      });

      container.querySelectorAll('.btn-delete-app').forEach(btn => {
        btn.addEventListener('click', async () => {
          const appId = btn.dataset.id;
          if (confirm('Are you sure you want to remove this tracked application?')) {
            await deleteApplication(appId);
          }
        });
      });

    } catch (err) {
      console.error('❌ [ATS UI] Error:', err);
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: #fca5a5; background: rgba(239,68,68,0.08); border-radius: var(--radius-md); border: 1px solid rgba(239,68,68,0.25);">
          <i class="ph ph-warning-circle" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
          <h4 style="color:#fff; margin-bottom:0.3rem;">Unable to load applications</h4>
          <p style="font-size:0.85rem; color:var(--text-muted);">${escapeHtml(err.message)}</p>
          <button onclick="fetchMyApplications()" class="btn btn-emerald" style="margin-top:0.8rem; font-size:0.82rem;">Retry</button>
        </div>
      `;
    }
  }

  function renderApplicationCard(app) {
    const titleSafe = escapeHtml(app.jobTitle);
    const companySafe = escapeHtml(app.company);
    const locSafe = escapeHtml(app.location || 'India');
    const modeSafe = escapeHtml(app.workMode || 'Hybrid');
    const status = app.status || 'Applied';
    const appliedDateStr = formatRelativeTime(app.appliedDate || app.createdAt);
    const updatedDateStr = formatRelativeTime(app.lastUpdated || app.updatedAt);
    const appUrl = escapeHtml(app.applicationUrl || app.externalListingUrl || '#');

    let statusBadgeClass = 'status-badge-applied';
    let statusIcon = 'ph-clock';
    if (status === 'Assessment') { statusBadgeClass = 'status-badge-assessment'; statusIcon = 'ph-clipboard-text'; }
    else if (status === 'Interview') { statusBadgeClass = 'status-badge-interview'; statusIcon = 'ph-chats-circle'; }
    else if (status === 'Offer') { statusBadgeClass = 'status-badge-offer'; statusIcon = 'ph-check-circle'; }
    else if (status === 'Rejected') { statusBadgeClass = 'status-badge-rejected'; statusIcon = 'ph-x-circle'; }
    else if (status === 'Saved') { statusBadgeClass = 'status-badge-saved'; statusIcon = 'ph-bookmark'; }
    else if (status === 'Withdrawn') { statusBadgeClass = 'status-badge-withdrawn'; statusIcon = 'ph-minus-circle'; }

    const skills = Array.isArray(app.skills) ? app.skills.slice(0, 4) : [];
    const skillsHtml = skills.map(s => `<span class="internship-skill-tag">${escapeHtml(s)}</span>`).join('');

    // Reminder alert banner
    let reminderBannerHtml = '';
    if (app.needsFollowUp) {
      reminderBannerHtml = `
        <div class="reminder-alert-banner">
          <span><i class="ph ph-bell-ringing"></i> ${escapeHtml(app.reminderMessage || "You haven't updated the application status yet.")}</span>
          <button class="btn btn-secondary btn-update-app-status" data-id="${app._id}" style="padding:0.2rem 0.6rem; font-size:0.75rem;">Update Status</button>
        </div>
      `;
    }

    // Prep Connection Banner for Assessment or Interview
    let prepBannerHtml = '';
    if (status === 'Assessment') {
      prepBannerHtml = `
        <div class="prep-connection-banner">
          <div style="font-size:0.8rem; font-weight:700; color:#e9d5ff; margin-bottom:0.3rem;"><i class="ph ph-sparkle"></i> Assessment Preparation</div>
          <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:0.5rem;">Practice time-bound technical questions for ${skills[0] || 'your domain'}.</div>
          <button onclick="document.querySelector('.main-navbar .nav-item[data-view=dailyHub]').click();" class="btn btn-emerald" style="font-size:0.75rem; padding:0.25rem 0.75rem;">
            Practice Assessment <i class="ph ph-arrow-right"></i>
          </button>
        </div>
      `;
    } else if (status === 'Interview') {
      prepBannerHtml = `
        <div class="prep-connection-banner" style="background:rgba(56,189,248,0.08); border-color:rgba(56,189,248,0.3);">
          <div style="font-size:0.8rem; font-weight:700; color:#7dd3fc; margin-bottom:0.3rem;"><i class="ph ph-chats-circle"></i> Interview Preparation</div>
          <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:0.5rem;">Practice 5 common placement interview questions for ${skills[0] || 'your domain'}.</div>
          <button onclick="document.getElementById('take-interview-btn').click();" class="btn btn-primary" style="font-size:0.75rem; padding:0.25rem 0.75rem;">
            Practice Interview <i class="ph ph-arrow-right"></i>
          </button>
        </div>
      `;
    }

    return `
      <div class="application-card">
        <div>
          <div class="application-card-header">
            <div>
              <h3 class="internship-title">${titleSafe}</h3>
              <div class="internship-company"><i class="ph ph-buildings"></i> ${companySafe}</div>
            </div>
            <span class="application-status-badge ${statusBadgeClass}">
              <i class="ph ${statusIcon}"></i> ${status}
            </span>
          </div>

          <div class="internship-meta-row">
            <span class="meta-pill location-pill"><i class="ph ph-map-pin"></i> ${locSafe}</span>
            <span class="meta-pill location-pill"><i class="ph ph-laptop"></i> ${modeSafe}</span>
          </div>

          ${skillsHtml ? `<div class="internship-skills-container">${skillsHtml}</div>` : ''}

          ${reminderBannerHtml}
          ${prepBannerHtml}

          <div style="font-size:0.75rem; color:var(--text-muted); margin:0.6rem 0;">
            <div>Applied: <strong>${appliedDateStr}</strong></div>
            <div>Last updated by you: <strong>${updatedDateStr}</strong></div>
          </div>

          ${app.notes ? `<div style="font-size:0.78rem; color:var(--text-muted); background:rgba(255,255,255,0.02); padding:0.5rem; border-radius:6px; margin-top:0.4rem; border:1px solid var(--border-color);"><strong>Note:</strong> ${escapeHtml(app.notes)}</div>` : ''}
        </div>

        <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:1rem; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.8rem;">
          <div style="display:flex; gap:0.4rem;">
            <button class="btn btn-secondary btn-update-app-status" data-id="${app._id}" style="flex:1; font-size:0.78rem; padding:0.4rem 0.6rem;" title="Update status">
              <i class="ph ph-pencil-simple"></i> Update Status
            </button>
            <button class="btn btn-secondary btn-view-app-timeline" data-id="${app._id}" style="flex:1; font-size:0.78rem; padding:0.4rem 0.6rem;" title="View timeline & prep">
              <i class="ph ph-clock-counter-clockwise"></i> Timeline
            </button>
            <button class="btn btn-secondary btn-delete-app" data-id="${app._id}" style="padding:0.4rem 0.6rem; font-size:0.78rem; color:#fca5a5;" title="Remove tracking">
              <i class="ph ph-trash"></i>
            </button>
          </div>
          <a href="${appUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald" style="width:100%; text-align:center; font-size:0.8rem; padding:0.4rem;" title="Track directly on original external site">
            Track on Original Website <i class="ph ph-arrow-square-out"></i>
          </a>
        </div>
      </div>
    `;
  }

  // Open & Handle Update Status Modal
  async function openUpdateStatusModal(appId) {
    const session = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
    const userId = session?.user_id;
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/applications/${appId}?userId=${userId}`);
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Failed to load details.');

      const app = data.application;
      const modal = document.getElementById('update-app-status-modal');
      const titleEl = document.getElementById('update-status-app-title');
      const companyEl = document.getElementById('update-status-app-company');
      const appIdInput = document.getElementById('update-status-app-id');
      const notesInput = document.getElementById('update-status-notes-input');
      const interviewFields = document.getElementById('interview-details-fields');

      if (titleEl) titleEl.textContent = app.jobTitle;
      if (companyEl) companyEl.textContent = app.company;
      if (appIdInput) appIdInput.value = app._id;
      if (notesInput) notesInput.value = app.notes || '';

      const radios = document.querySelectorAll('input[name="appStatusRadio"]');
      radios.forEach(r => {
        r.checked = (r.value === app.status);
      });

      if (interviewFields) {
        interviewFields.style.display = app.status === 'Interview' ? 'block' : 'none';
      }

      if (app.interviewDetails) {
        const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
        setVal('interview-round-input', app.interviewDetails.round);
        setVal('interview-date-input', app.interviewDetails.date);
        setVal('interview-time-input', app.interviewDetails.time);
        setVal('interview-type-input', app.interviewDetails.type || 'Online');
      }

      if (modal) modal.style.display = 'flex';
    } catch (err) {
      alert('Unable to load application details: ' + err.message);
    }
  }

  document.querySelectorAll('input[name="appStatusRadio"]').forEach(r => {
    r.addEventListener('change', () => {
      const interviewFields = document.getElementById('interview-details-fields');
      if (interviewFields) {
        interviewFields.style.display = r.value === 'Interview' ? 'block' : 'none';
      }
    });
  });

  const closeUpdateModalBtn = document.getElementById('close-update-status-modal-btn');
  if (closeUpdateModalBtn) closeUpdateModalBtn.addEventListener('click', () => { document.getElementById('update-app-status-modal').style.display = 'none'; });
  const cancelUpdateModalBtn = document.getElementById('cancel-update-status-btn');
  if (cancelUpdateModalBtn) cancelUpdateModalBtn.addEventListener('click', () => { document.getElementById('update-app-status-modal').style.display = 'none'; });

  const updateStatusForm = document.getElementById('update-status-form');
  if (updateStatusForm) {
    updateStatusForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const session = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
      const userId = session?.user_id;
      const appId = document.getElementById('update-status-app-id').value;
      const selectedRadio = document.querySelector('input[name="appStatusRadio"]:checked');
      const newStatus = selectedRadio ? selectedRadio.value : 'Applied';
      const notes = document.getElementById('update-status-notes-input').value.trim();

      if (!userId || !appId) return;

      const interviewDetails = {
        round: document.getElementById('interview-round-input').value.trim(),
        date: document.getElementById('interview-date-input').value,
        time: document.getElementById('interview-time-input').value,
        type: document.getElementById('interview-type-input').value
      };

      try {
        const response = await fetch(`http://localhost:5000/api/applications/${appId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            status: newStatus,
            notes,
            interviewDetails
          })
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to update status.');
        }

        document.getElementById('update-app-status-modal').style.display = 'none';
        fetchMyApplications();

      } catch (err) {
        alert('Error updating status: ' + err.message);
      }
    });
  }

  async function openTimelineModal(appId) {
    const session = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
    const userId = session?.user_id;
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/applications/${appId}?userId=${userId}`);
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Failed to load timeline.');

      const app = data.application;
      const prep = data.preparationRecommendations;
      const modal = document.getElementById('app-timeline-modal');

      const headerBox = document.getElementById('timeline-modal-header-info');
      if (headerBox) {
        headerBox.innerHTML = `
          <div style="font-size:1.1rem; font-weight:800; color:#fff;">${escapeHtml(app.jobTitle)}</div>
          <div style="font-size:0.9rem; color:var(--accent-cyan); font-weight:600;"><i class="ph ph-buildings"></i> ${escapeHtml(app.company)}</div>
          <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.4rem; display:flex; gap:0.8rem;">
            <span>Location: ${escapeHtml(app.location || 'India')}</span>
            <span>Work Mode: ${escapeHtml(app.workMode || 'Hybrid')}</span>
          </div>
        `;
      }

      const prepBox = document.getElementById('timeline-prep-connection-box');
      if (prepBox && prep) {
        prepBox.innerHTML = `
          <div class="prep-connection-banner" style="margin:0;">
            <div style="font-size:0.9rem; font-weight:800; color:#fff; margin-bottom:0.3rem;"><i class="ph ph-sparkle" style="color:var(--accent-cyan);"></i> ${escapeHtml(prep.title)}</div>
            <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.6rem;">${escapeHtml(prep.subtitle)}</div>
            <ul style="margin:0 0 0.8rem 1.2rem; padding:0; font-size:0.82rem; color:var(--text-muted);">
              ${(prep.actionPlan || []).map(step => `<li style="margin-bottom:0.25rem;">${escapeHtml(step)}</li>`).join('')}
            </ul>
            <button onclick="document.getElementById('app-timeline-modal').style.display='none'; switchView('${prep.targetView || 'roadmap'}');" class="btn btn-emerald" style="font-size:0.8rem; padding:0.4rem 1rem;">
              ${escapeHtml(prep.ctaLabel || 'Start Preparation')} <i class="ph ph-arrow-right"></i>
            </button>
          </div>
        `;
      }

      const historyContainer = document.getElementById('timeline-history-container');
      if (historyContainer) {
        const history = Array.isArray(app.statusHistory) ? app.statusHistory : [];
        if (history.length === 0) {
          historyContainer.innerHTML = '<div style="font-size:0.82rem; color:var(--text-muted);">No status history recorded yet.</div>';
        } else {
          historyContainer.innerHTML = history.map(item => `
            <div class="timeline-step">
              <div style="font-weight:700; color:#fff;">✓ ${escapeHtml(item.status)}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${formatRelativeTime(item.date)} (${new Date(item.date).toLocaleDateString()})</div>
              ${item.notes ? `<div style="font-size:0.78rem; color:var(--accent-cyan); margin-top:0.2rem;">${escapeHtml(item.notes)}</div>` : ''}
            </div>
          `).join('');
        }
      }

      const notesBox = document.getElementById('timeline-notes-box');
      if (notesBox) {
        notesBox.innerHTML = app.notes ? escapeHtml(app.notes) : 'No notes added.';
      }

      const extLinkBtn = document.getElementById('timeline-external-link-btn');
      if (extLinkBtn) {
        extLinkBtn.href = app.applicationUrl || app.externalListingUrl || '#';
      }

      if (modal) modal.style.display = 'flex';

    } catch (err) {
      alert('Error loading application timeline: ' + err.message);
    }
  }

  const closeTimelineBtn = document.getElementById('close-timeline-modal-btn');
  if (closeTimelineBtn) closeTimelineBtn.addEventListener('click', () => { document.getElementById('app-timeline-modal').style.display = 'none'; });

  async function deleteApplication(appId) {
    const session = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
    const userId = session?.user_id;
    if (!userId || !appId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/applications/${appId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Failed to delete application.');

      fetchMyApplications();
    } catch (err) {
      alert('Error deleting application: ' + err.message);
    }
  }

  document.querySelectorAll('.ats-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ats-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter || 'All';
      fetchMyApplications(filter);
    });
  });

  const refreshAtsBtn = document.getElementById('refresh-ats-btn');
  if (refreshAtsBtn) {
    refreshAtsBtn.addEventListener('click', () => fetchMyApplications());
  }

  async function returnToWeeklyRoadmap() {
    const activeSession = supervisor.authAgent.getActiveSession();
    const userId = activeSession ? activeSession.user_id : (window.currentDraftProfile ? window.currentDraftProfile.user_id : null);

    let roadmap = window.activePersonalizedRoadmap;
    if (userId) {
      try {
        const baseUrl = (window.location.protocol && window.location.protocol.startsWith('http')) ? window.location.origin : 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/roadmap/user/${userId}`);
        const json = await res.json();
        if (json.success && json.roadmap) {
          roadmap = json.roadmap;
          window.activePersonalizedRoadmap = roadmap;
          const userState = supervisor.progressTracker.getUserState(userId);
          if (userState) {
            userState.personalizedRoadmap = roadmap;
            supervisor.progressTracker.saveUserState(userState, userId);
          }
        }
      } catch (err) {
        console.warn('Could not fetch server roadmap in returnToWeeklyRoadmap:', err);
      }
    }

    if (!roadmap) {
      const state = supervisor.progressTracker.getUserState(userId);
      roadmap = state ? state.personalizedRoadmap : null;
    }
    if (!roadmap) {
      try {
        const rawState = localStorage.getItem('placify_user_state');
        if (rawState) {
          const parsed = JSON.parse(rawState);
          roadmap = parsed.personalizedRoadmap || parsed.roadmap;
        }
      } catch (e) {}
    }

    const cur = window.currentSelectedDaySpec || {};
    const reqMonth = cur.month !== undefined && cur.month !== null ? parseInt(cur.month, 10) : (currentSelectedMonthObj ? parseInt(currentSelectedMonthObj.month_number, 10) : 1);
    const reqWeek = cur.week !== undefined && cur.week !== null ? parseInt(cur.week, 10) : (currentSelectedWeekObj ? parseInt(currentSelectedWeekObj.week_number, 10) : 1);

    let targetMonth = currentSelectedMonthObj;
    let targetWeek = currentSelectedWeekObj;

    if (roadmap && Array.isArray(roadmap.monthly_roadmap)) {
      const foundMonth = roadmap.monthly_roadmap.find(m => parseInt(m.month_number, 10) === reqMonth);
      if (foundMonth) {
        targetMonth = foundMonth;
        if (Array.isArray(foundMonth.weeks)) {
          const foundWeek = foundMonth.weeks.find(w => parseInt(w.week_number, 10) === reqWeek);
          if (foundWeek) {
            targetWeek = foundWeek;
          } else if (foundMonth.weeks.length > 0) {
            targetWeek = foundMonth.weeks[0];
          }
        }
      } else if (roadmap.monthly_roadmap.length > 0) {
        targetMonth = roadmap.monthly_roadmap[0];
        targetWeek = (targetMonth.weeks && targetMonth.weeks.length > 0) ? targetMonth.weeks[0] : null;
      }
    }

    if (roadmap && targetMonth && targetWeek) {
      currentSelectedMonthObj = targetMonth;
      currentSelectedWeekObj = targetWeek;
      renderDayView(roadmap, targetMonth, targetWeek);
    } else if (roadmap && targetMonth) {
      currentSelectedMonthObj = targetMonth;
      renderWeeklyView(roadmap, targetMonth);
    } else if (roadmap) {
      renderMonthlyView(roadmap);
    }
    switchView('roadmap');
  }

  const backToRoadmapBtns = document.querySelectorAll('.back-to-weekly-roadmap-btn, #view-all-roadmap-btn, #top-back-to-weekly-roadmap-btn');
  backToRoadmapBtns.forEach(btn => {
    btn.addEventListener('click', returnToWeeklyRoadmap);
  });

  document.getElementById('start-concept-quiz-btn').addEventListener('click', async () => {
    try {
      const context = window.currentAssessmentTaskContext || {};
      const firstTask = (context.tasks || [])[0] || {};
      renderConceptQuizLoading();
      switchView('conceptQuiz');
      await renderConceptQuiz(firstTask.title || firstTask.taskTitle || 'Daily Assessment', firstTask.topic || context.domain, context);
    } catch (err) {
      console.error('[DAILY ASSESSMENT OPEN]', err);
      alert("Unable to generate today's assessment. Please try again.");
      switchView('dailyHub');
    }
  });

  document.getElementById('skip-day-assessment-btn').addEventListener('click', async () => {
    await continueToNextDay(true);
  });

  // =========================================================================

  // VIEW 6: CONCEPT ASSESSMENT (RESOURCE FETCHER)
  // =========================================================================
  function renderConceptQuizLoading() {
    const summary = document.getElementById('quiz-grounded-summary');
    const container = document.getElementById('concept-quiz-questions-container');
    if (summary) summary.textContent = "Generating an 8-question NPTEL-style assessment from today's tasks...";
    if (container) container.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--text-muted);"><i class="ph ph-spinner spinner" style="font-size:2rem;"></i><br/><br/>Preparing MCQ, MSQ, numerical and written questions...</div>';
  }

  async function renderConceptQuiz(conceptTitle, topic, taskContext = {}) {
    try {
      const quizData = await supervisor.fetchTaskAssessment(conceptTitle, topic, taskContext);
      window.currentAssessmentData = quizData;
      const summary = document.getElementById('quiz-grounded-summary');
      if (summary) summary.textContent = quizData.retrievedContentSummary || 'Daily Technical Assessment';

      const container = document.getElementById('concept-quiz-questions-container');
      if (!container) return;

      if (!quizData || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
        container.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--accent-rose);"><i class="ph ph-warning" style="font-size:2rem;"></i><br/><br/>No valid assessment questions available. Please try again.</div>';
        return;
      }

      // Filter and validate question structure
      const validQuestions = quizData.questions.filter((q, qIndex) => {
        if (!q || typeof q.question !== 'string' || !q.question.trim()) {
          console.warn(`⚠️ [ASSESSMENT VALIDATION] Question ${qIndex + 1} has missing/empty question text:`, q);
          return false;
        }
        if (q.type === 'MCQ' || q.type === 'MSQ') {
          if (!Array.isArray(q.options) || q.options.length < 2) {
            console.warn(`⚠️ [ASSESSMENT VALIDATION] Question ${qIndex + 1} (${q.type}) has fewer than 2 options:`, q);
            return false;
          }
          const hasEmptyOption = q.options.some(opt => opt === null || opt === undefined || String(opt).trim() === '');
          if (hasEmptyOption) {
            console.warn(`⚠️ [ASSESSMENT VALIDATION] Question ${qIndex + 1} has blank option strings:`, q.options);
            return false;
          }
        }
        return true;
      });

      if (validQuestions.length === 0) {
        container.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--accent-rose);"><i class="ph ph-warning" style="font-size:2rem;"></i><br/><br/>Assessment contains malformed question data. Please re-generate the assessment.</div>';
        return;
      }

      container.innerHTML = validQuestions.map((q, idx) => {
        const typeLabel = q.type === 'MSQ' ? 'MSQ — Select all that apply' : q.type === 'NAT' ? 'NAT — Numerical Answer' : q.type === 'SHORT_ANSWER' ? 'Written Answer' : 'MCQ — Single Correct Answer';
        let answerHTML = '';
        if (q.type === 'MCQ') {
          answerHTML = `<div class="quiz-options">${q.options.map((opt, oIdx) => `<div class="option-btn assessment-option" data-qid="${escapeHtml(q.id)}" data-index="${oIdx}" data-multi="false"><i class="ph ph-circle"></i> <span>${escapeHtml(opt)}</span></div>`).join('')}</div>`;
        } else if (q.type === 'MSQ') {
          answerHTML = `<div class="quiz-options">${q.options.map((opt, oIdx) => `<div class="option-btn assessment-option" data-qid="${escapeHtml(q.id)}" data-index="${oIdx}" data-multi="true"><i class="ph ph-square"></i> <span>${escapeHtml(opt)}</span></div>`).join('')}</div>`;
        } else if (q.type === 'NAT') {
          answerHTML = `<input type="number" step="any" class="assessment-nat-input" data-qid="${escapeHtml(q.id)}" placeholder="Enter numerical answer" style="width:100%;padding:0.8rem;border:1px solid var(--border-glass);background:rgba(255,255,255,0.04);color:#fff;border-radius:8px;">`;
        } else {
          answerHTML = `<textarea class="assessment-written-input" data-qid="${escapeHtml(q.id)}" rows="4" placeholder="Write your answer in 2–4 sentences..." style="width:100%;padding:0.8rem;border:1px solid var(--border-glass);background:rgba(255,255,255,0.04);color:#fff;border-radius:8px;resize:vertical;"></textarea>`;
        }
        return `<div class="quiz-question-card" data-cqid="${escapeHtml(q.id)}">
          <div class="quiz-question-title"><span class="question-badge">Q${idx + 1}</span><span>${escapeHtml(q.question)}</span></div>
          <div style="font-size:0.72rem;color:var(--accent-cyan);font-weight:800;margin:0.6rem 0;text-transform:uppercase;">${typeLabel} • ${q.points || 1} point${(q.points || 1) === 1 ? '' : 's'}</div>
          ${answerHTML}
        </div>`;
      }).join('');

      container.querySelectorAll('.assessment-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const qid = btn.dataset.qid;
          const multi = btn.dataset.multi === 'true';
          if (!multi) {
            container.querySelectorAll(`.assessment-option[data-qid="${qid}"]`).forEach(b => {
              b.classList.remove('selected');
              const icon = b.querySelector('i');
              if (icon) icon.className = 'ph ph-circle';
            });
          }
          btn.classList.toggle('selected');
          const selected = btn.classList.contains('selected');
          const icon = btn.querySelector('i');
          if (icon) {
            icon.className = selected ? (multi ? 'ph ph-check-square' : 'ph ph-check-circle') : (multi ? 'ph ph-square' : 'ph ph-circle');
          }
        });
      });
    } catch (err) {
      console.error('❌ Error rendering concept quiz:', err);
      const container = document.getElementById('concept-quiz-questions-container');
      if (container) {
        container.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--accent-rose);"><i class="ph ph-warning-circle" style="font-size:2rem;"></i><br/><br/>Failed to load assessment: ${escapeHtml(err.message)}</div>`;
      }
    }
  }

  function collectAssessmentAnswers() {
    const questions = window.currentAssessmentData?.questions || [];
    const userAnswers = {};
    questions.forEach(q => {
      if (q.type === 'MCQ') {
        const selected = document.querySelector(`.assessment-option.selected[data-qid="${q.id}"]`);
        userAnswers[q.id] = selected ? Number(selected.dataset.index) : -1;
      } else if (q.type === 'MSQ') {
        userAnswers[q.id] = Array.from(document.querySelectorAll(`.assessment-option.selected[data-qid="${q.id}"]`)).map(el => Number(el.dataset.index));
      } else if (q.type === 'NAT') {
        const input = document.querySelector(`.assessment-nat-input[data-qid="${q.id}"]`);
        userAnswers[q.id] = input ? input.value : '';
      } else {
        const input = document.querySelector(`.assessment-written-input[data-qid="${q.id}"]`);
        userAnswers[q.id] = input ? input.value.trim() : '';
      }
    });
    return userAnswers;
  }

  async function continueToNextDay(skipAssessment = false) {
    try {
      const cur = window.currentSelectedDaySpec || { month: 1, week: 1, day: window.currentActiveDay || 1 };
      const session = supervisor.authAgent.getActiveSession();
      const userId = session?.user_id;
      let roadmap = window.activePersonalizedRoadmap || supervisor.progressTracker.getUserState()?.personalizedRoadmap;

      if (!roadmap) {
        try {
          const rawState = localStorage.getItem('placify_user_state');
          if (rawState) {
            const parsed = JSON.parse(rawState);
            roadmap = parsed.personalizedRoadmap || parsed.roadmap;
          }
        } catch (e) {}
      }

      if (userId) {
        try {
          await fetch('http://localhost:5000/api/task/rollover', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, month: cur.month || 1, week: cur.week || 1, day: cur.day || window.currentActiveDay || 1 })
          });
          const fresh = await fetch(`http://localhost:5000/api/roadmap/user/${userId}`);
          const freshData = await fresh.json();
          if (fresh.ok && freshData.success && freshData.roadmap) {
            roadmap = freshData.roadmap;
            window.activePersonalizedRoadmap = roadmap;
            const state = supervisor.progressTracker.getUserState();
            if (state) { state.personalizedRoadmap = roadmap; supervisor.progressTracker.saveUserState(state); }
          }
        } catch (e) { console.warn('[TASK ROLLOVER]', e); }
      }

      const orderedDays = [];
      (roadmap?.monthly_roadmap || []).forEach(month => (month.weeks || []).forEach(week => (week.days || []).forEach(day => {
        orderedDays.push({
          month: Number(month.month_number),
          week: Number(week.week_number),
          day: Number(day.day_number),
          dayId: day.id || day.day_id || ''
        });
      })));

      orderedDays.sort((a,b) => a.month-b.month || a.week-b.week || a.day-b.day);

      if (!orderedDays.length) {
        const state = supervisor.progressTracker.getUserState();
        if (state?.personalizedRoadmap) {
          renderRoadmapView(state.personalizedRoadmap);
        }
        switchView('roadmap');
        return;
      }

      let currentIndex = -1;
      if (cur.dayId) {
        currentIndex = orderedDays.findIndex(x => x.dayId === cur.dayId);
      }
      if (currentIndex < 0 && cur.month && cur.week && cur.day) {
        currentIndex = orderedDays.findIndex(x => x.month === Number(cur.month) && x.week === Number(cur.week) && x.day === Number(cur.day));
      }
      if (currentIndex < 0) {
        const activeNum = Number(window.currentActiveDay || cur.day || 1);
        currentIndex = orderedDays.findIndex((x, idx) => (idx + 1) === activeNum || x.day === activeNum);
      }
      if (currentIndex < 0) {
        currentIndex = 0;
      }

      const next = orderedDays[currentIndex + 1];
      if (!next) {
        alert('🎉 You have completed all days in your personalized roadmap!');
        const state = supervisor.progressTracker.getUserState();
        if (state?.personalizedRoadmap) {
          renderRoadmapView(state.personalizedRoadmap);
        }
        switchView('roadmap');
        return;
      }

      const nextSpec = { roadmapId: roadmap?.roadmap_id || roadmap?._id || roadmap?.id || '', month: next.month, week: next.week, day: next.day, dayId: next.dayId };
      await renderDailyHub(nextSpec);
      switchView('dailyHub');
    } catch (err) {
      console.error('[CONTINUE TO NEXT DAY ERROR]', err);
      const state = supervisor.progressTracker.getUserState();
      if (state?.personalizedRoadmap) {
        renderRoadmapView(state.personalizedRoadmap);
      }
      switchView('roadmap');
    }
  }

  // =========================================================================
  // VIEW 6b: DEDICATED PHASE ASSESSMENT EVALUATION PAGE
  // =========================================================================

  function renderAssessmentEvaluationPage(evalData) {
    if (!evalData) return;
    window.currentEvaluationData = evalData;

    const phaseNum = evalData.dayNumber || evalData.phaseNumber || 1;
    const phaseTitle = evalData.phaseTitle || `Phase ${phaseNum} Core Technical Assessment`;
    const mNum = evalData.monthNumber || 1;
    const wNum = evalData.weekNumber || 1;
    const dNum = evalData.dayNumber || phaseNum;
    const dId = evalData.dayId || '';
    const rId = evalData.roadmapId || '';

    // Update Header Badges and Title
    const phaseBadgeEl = document.getElementById('eval-phase-badge');
    if (phaseBadgeEl) {
      phaseBadgeEl.textContent = `Phase ${phaseNum} Assessment Evaluation`;
    }

    const dateBadgeEl = document.getElementById('eval-date-badge');
    if (dateBadgeEl) {
      const d = evalData.submittedAt ? new Date(evalData.submittedAt) : new Date();
      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      dateBadgeEl.innerHTML = `<i class="ph ph-clock"></i> ${formatDateLong(d)} at ${timeStr}`;
    }

    const titleEl = document.getElementById('eval-phase-title');
    if (titleEl) {
      titleEl.textContent = `Phase ${phaseNum} — ${phaseTitle}`;
    }

    const container = document.getElementById('assessment-evaluation-content');
    if (!container) return;

    const totalQuestions = evalData.totalQuestions || (Array.isArray(evalData.detailedQuestions) ? evalData.detailedQuestions.length : 0);
    const correctCount = evalData.correctCount || 0;
    const partialCount = evalData.partiallyCorrectCount || 0;
    const incorrectCount = evalData.incorrectCount || 0;
    const scorePct = evalData.scorePct !== undefined ? evalData.scorePct : 0;
    const earnedPoints = evalData.earnedPoints !== undefined ? evalData.earnedPoints : 0;
    const maxPoints = evalData.maxPoints !== undefined ? evalData.maxPoints : 0;
    const passed = scorePct >= 70;

    // 1. Assessment Summary Cards Grid
    const summaryHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <!-- Final Percentage Score Card -->
        <div class="glass-card" style="padding: 1.25rem; text-align: center; border: 1px solid ${passed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}; background: ${passed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)'}; border-radius: var(--radius-md);">
          <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.8px; color: ${passed ? 'var(--accent-emerald)' : 'var(--accent-amber)'}; font-weight: 800;">
            Final Score Percentage
          </div>
          <div style="font-size: 2.5rem; font-family: var(--font-heading); font-weight: 800; color: #fff; margin: 0.2rem 0;">
            ${scorePct}%
          </div>
          <div style="display: flex; justify-content: center; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.6rem; flex-wrap: wrap;">
            <span>Marks: <strong style="color:#fff;">${earnedPoints} / ${maxPoints} pts</strong></span>
            <span>&bull;</span>
            <span style="color: ${passed ? 'var(--accent-emerald)' : 'var(--accent-amber)'}; font-weight: 700;">${passed ? '✓ Passed (>= 70%)' : 'Needs Review (< 70%)'}</span>
          </div>
          <div class="progress-bar-container" style="height: 6px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;">
            <div style="width: ${Math.min(100, Math.max(0, scorePct))}%; height: 100%; background: ${passed ? 'linear-gradient(90deg, var(--accent-emerald), var(--accent-cyan))' : 'linear-gradient(90deg, var(--accent-amber), var(--accent-rose))'}; transition: width 0.6s ease;"></div>
          </div>
        </div>

        <!-- Total Questions Card -->
        <div class="glass-card" style="padding: 1.25rem; text-align: center; border-radius: var(--radius-md);">
          <i class="ph ph-clipboard-text" style="font-size: 1.8rem; color: var(--accent-cyan); margin-bottom: 0.3rem;"></i>
          <div style="font-size: 1.8rem; font-family: var(--font-heading); font-weight: 800; color: #fff;">
            ${totalQuestions}
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Total Questions</div>
        </div>

        <!-- Correct Answers Card -->
        <div class="glass-card" style="padding: 1.25rem; text-align: center; border: 1px solid rgba(16, 185, 129, 0.2); border-radius: var(--radius-md);">
          <i class="ph ph-check-circle" style="font-size: 1.8rem; color: var(--accent-emerald); margin-bottom: 0.3rem;"></i>
          <div style="font-size: 1.8rem; font-family: var(--font-heading); font-weight: 800; color: var(--accent-emerald);">
            ${correctCount}
          </div>
          <div style="font-size: 0.8rem; color: var(--accent-emerald); text-transform: uppercase; font-weight: 700;">Correct</div>
        </div>

        <!-- Partially Correct Answers Card -->
        <div class="glass-card" style="padding: 1.25rem; text-align: center; border: 1px solid rgba(245, 158, 11, 0.2); border-radius: var(--radius-md);">
          <i class="ph ph-warning" style="font-size: 1.8rem; color: var(--accent-amber); margin-bottom: 0.3rem;"></i>
          <div style="font-size: 1.8rem; font-family: var(--font-heading); font-weight: 800; color: var(--accent-amber);">
            ${partialCount}
          </div>
          <div style="font-size: 0.8rem; color: var(--accent-amber); text-transform: uppercase; font-weight: 700;">Partially Correct</div>
        </div>

        <!-- Incorrect Answers Card -->
        <div class="glass-card" style="padding: 1.25rem; text-align: center; border: 1px solid rgba(244, 63, 94, 0.2); border-radius: var(--radius-md);">
          <i class="ph ph-x-circle" style="font-size: 1.8rem; color: var(--accent-rose); margin-bottom: 0.3rem;"></i>
          <div style="font-size: 1.8rem; font-family: var(--font-heading); font-weight: 800; color: var(--accent-rose);">
            ${incorrectCount}
          </div>
          <div style="font-size: 0.8rem; color: var(--accent-rose); text-transform: uppercase; font-weight: 700;">Incorrect</div>
        </div>
      </div>
    `;

    // 2. Question-by-Question Detailed Evaluation
    const detailedQuestions = Array.isArray(evalData.detailedQuestions) ? evalData.detailedQuestions : [];
    const questionsHTML = `
      <div style="margin-bottom: 2.5rem;">
        <div class="section-title" style="font-size: 1.25rem; display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.2rem;">
          <i class="ph ph-list-checks" style="color: var(--accent-cyan);"></i> Question-by-Question Evaluation
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.2rem;">
          ${detailedQuestions.map((q, qIdx) => {
            let statusBorder = 'var(--accent-emerald)';
            let statusBg = 'rgba(16, 185, 129, 0.12)';
            let statusColor = 'var(--accent-emerald)';
            let statusIcon = 'ph-check-circle';
            let statusLabel = 'Correct';

            if (q.status === 'PARTIAL' || q.status === 'PARTIALLY_CORRECT') {
              statusBorder = 'var(--accent-amber)';
              statusBg = 'rgba(245, 158, 11, 0.12)';
              statusColor = 'var(--accent-amber)';
              statusIcon = 'ph-warning';
              statusLabel = 'Partially Correct';
            } else if (q.status === 'INCORRECT' || q.status === 'WRONG') {
              statusBorder = 'var(--accent-rose)';
              statusBg = 'rgba(244, 63, 94, 0.12)';
              statusColor = 'var(--accent-rose)';
              statusIcon = 'ph-x-circle';
              statusLabel = 'Incorrect';
            }

            const typeLabel = q.type === 'MSQ' ? 'MSQ' : q.type === 'NAT' ? 'NAT' : q.type === 'SHORT_ANSWER' ? 'Written' : 'MCQ';

            return `
              <div class="glass-card" style="border-left: 4px solid ${statusBorder}; padding: 1.25rem; border-radius: var(--radius-sm); background: rgba(255,255,255,0.02);">
                <!-- Header: Q badge, type, marks, status -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 0.8rem; flex-wrap: wrap;">
                  <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap;">
                    <span class="question-badge" style="font-weight: 800; font-size: 0.85rem; padding: 0.2rem 0.6rem;">Q${qIdx + 1}</span>
                    <span class="node-tag STANDARD" style="font-size: 0.72rem; padding: 0.15rem 0.5rem;">${typeLabel}</span>
                    <span style="font-size: 0.78rem; font-weight: 700; color: var(--accent-amber); background: rgba(245, 158, 11, 0.12); padding: 0.15rem 0.55rem; border-radius: 4px;">
                      Marks: ${q.earnedPoints} / ${q.maxPoints} pt${q.maxPoints === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div style="display: inline-flex; align-items: center; gap: 0.35rem; background: ${statusBg}; color: ${statusColor}; border: 1px solid ${statusBorder}; font-size: 0.78rem; font-weight: 700; padding: 0.25rem 0.7rem; border-radius: 50px;">
                    <i class="ph ${statusIcon}"></i> ${statusLabel}
                  </div>
                </div>

                <!-- Question Text -->
                <div style="font-size: 1rem; font-weight: 600; color: #fff; line-height: 1.5; margin-bottom: 1rem;">
                  ${escapeHtml(q.question)}
                </div>

                <!-- Answers Side-by-Side Comparison -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.8rem; margin-bottom: 1rem;">
                  <!-- Submitted Answer -->
                  <div style="background: rgba(0,0,0,0.25); border: 1px solid ${q.status === 'CORRECT' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}; border-radius: 8px; padding: 0.85rem;">
                    <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); margin-bottom: 0.3rem;">
                      Your Submitted Answer:
                    </div>
                    <div style="font-size: 0.9rem; color: ${q.status === 'CORRECT' ? 'var(--accent-emerald)' : '#fff'}; line-height: 1.4; word-break: break-word;">
                      ${escapeHtml(q.userAnswerText || 'No answer submitted')}
                    </div>
                  </div>

                  <!-- Correct / Expected Answer -->
                  <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 0.85rem;">
                    <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--accent-emerald); margin-bottom: 0.3rem;">
                      Expected / Correct Answer:
                    </div>
                    <div style="font-size: 0.9rem; color: #fff; line-height: 1.4; word-break: break-word;">
                      ${escapeHtml(q.correctAnswerText || 'See explanation')}
                    </div>
                  </div>
                </div>

                <!-- Explanation / Feedback Box -->
                ${(q.explanation || q.feedback) ? `
                  <div style="background: rgba(6, 182, 212, 0.06); border: 1px solid rgba(6, 182, 212, 0.2); border-radius: 6px; padding: 0.75rem 0.9rem; font-size: 0.84rem; line-height: 1.45; color: var(--text-muted);">
                    <strong style="color: var(--accent-cyan);"><i class="ph ph-info"></i> Explanation:</strong>
                    <span style="color: #e2e8f0; margin-left: 0.3rem;">${escapeHtml(q.explanation || q.feedback)}</span>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // 3. Concepts to Review Section
    const conceptsList = Array.isArray(evalData.conceptsToReview) ? evalData.conceptsToReview : [];
    let conceptsHTML = '';

    if (conceptsList.length > 0) {
      conceptsHTML = `
        <div style="margin-bottom: 1.5rem;">
          <div class="section-title" style="font-size: 1.25rem; display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.4rem;">
            <i class="ph ph-book-bookmark" style="color: var(--accent-amber);"></i> Concepts to Review
          </div>
          <p class="section-subtitle" style="margin-bottom: 1.2rem;">
            Identified topics and revision recommendations based on your submitted answers in this phase assessment.
          </p>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${conceptsList.map((c, cIdx) => `
              <div class="glass-card" style="border: 1px solid rgba(245, 158, 11, 0.3); border-radius: var(--radius-sm); padding: 1.2rem; background: rgba(245, 158, 11, 0.03);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 0.5rem;">
                  <div style="font-size: 1.05rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 0.4rem;">
                    <span style="color: var(--accent-amber); font-weight: 800;">#${cIdx + 1}</span>
                    <span>${escapeHtml(c.topic || 'Core Concept')}</span>
                    ${c.subtopic && c.subtopic !== c.topic ? `<span style="font-size: 0.8rem; color: var(--text-muted);">(${escapeHtml(c.subtopic)})</span>` : ''}
                  </div>
                  <span style="font-size: 0.72rem; font-weight: 700; color: var(--accent-amber); background: rgba(245, 158, 11, 0.15); padding: 0.2rem 0.6rem; border-radius: 4px; text-transform: uppercase;">
                    Revision Recommended
                  </span>
                </div>

                <!-- Why to Review -->
                <div style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.45; margin-bottom: 0.8rem;">
                  <strong style="color: var(--accent-cyan);">Why to review:</strong> ${escapeHtml(c.reason || 'The submitted answer did not satisfy the required technical concept.')}
                </div>

                <!-- Recommended Revision Points -->
                <div style="background: rgba(0,0,0,0.2); border-radius: 6px; padding: 0.8rem 1rem; margin-bottom: 0.8rem;">
                  <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-emerald); margin-bottom: 0.4rem;">
                    Recommended revision:
                  </div>
                  <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.84rem; color: var(--text-muted); line-height: 1.5;">
                    ${(c.recommendations || [
                      `Review core definitions, syntax, and principles of ${c.topic || 'this concept'}.`,
                      `Revisit the corresponding phase learning resources.`,
                      `Retry related questions after reviewing the concept.`
                    ]).map(rec => `<li>${escapeHtml(rec)}</li>`).join('')}
                  </ul>
                </div>

                <!-- Phase Resources if available -->
                ${Array.isArray(c.resources) && c.resources.length > 0 ? `
                  <div style="border-top: 1px dashed rgba(255,255,255,0.08); padding-top: 0.6rem; margin-top: 0.6rem;">
                    <div style="font-size: 0.78rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 0.4rem;">
                      <i class="ph ph-books"></i> Relevant Phase Learning Resources:
                    </div>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                      ${c.resources.map(r => `
                        <a href="${escapeHtml(r.url || '#')}" target="_blank" rel="noopener noreferrer" style="font-size: 0.78rem; color: #fff; background: rgba(255,255,255,0.06); padding: 0.25rem 0.6rem; border-radius: 4px; text-decoration: none; display: inline-flex; align-items: center; gap: 0.3rem; border: 1px solid var(--border-glass);">
                          <i class="ph ph-arrow-square-out" style="color: var(--accent-cyan);"></i> ${escapeHtml(r.title || 'Learning Resource')}
                        </a>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      conceptsHTML = `
        <div style="margin-bottom: 1.5rem;">
          <div class="section-title" style="font-size: 1.25rem; display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.4rem;">
            <i class="ph ph-book-bookmark" style="color: var(--accent-emerald);"></i> Concepts to Review
          </div>
          <div class="glass-card" style="border: 1px solid rgba(16, 185, 129, 0.35); background: rgba(16, 185, 129, 0.05); padding: 1.5rem; border-radius: var(--radius-md); text-align: center;">
            <i class="ph ph-sparkle" style="font-size: 2.2rem; color: var(--accent-emerald); margin-bottom: 0.5rem;"></i>
            <h3 style="font-size: 1.2rem; font-weight: 800; color: #fff; margin-bottom: 0.3rem;">Excellent work!</h3>
            <p style="font-size: 0.9rem; color: var(--accent-emerald); margin: 0;">
              No major concepts need revision. You have demonstrated full mastery across all topics in this phase assessment!
            </p>
          </div>
        </div>
      `;
    }

    container.innerHTML = summaryHTML + questionsHTML + conceptsHTML;
  }

  function loadAssessmentEvaluationFromState(userId) {
    if (!userId) return;
    if (window.currentEvaluationData && window.currentEvaluationData.userId === userId) {
      renderAssessmentEvaluationPage(window.currentEvaluationData);
      return;
    }
    const state = supervisor.progressTracker.getUserState(userId);
    if (state?.lastPhaseEvaluation && state.lastPhaseEvaluation.userId === userId) {
      renderAssessmentEvaluationPage(state.lastPhaseEvaluation);
      return;
    }
    try {
      const raw = localStorage.getItem('placify_last_assessment_eval_' + userId);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.userId === userId) {
          renderAssessmentEvaluationPage(parsed);
          return;
        }
      }
    } catch (e) {}
  }

  // Bind Assessment Evaluation Navigation Actions
  document.querySelectorAll('.eval-nav-roadmap-btn, #eval-back-to-roadmap-btn, #eval-bottom-back-roadmap-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      returnToWeeklyRoadmap();
    });
  });

  document.querySelectorAll('.eval-nav-review-btn, #eval-review-phase-btn, #eval-bottom-review-phase-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const evalData = window.currentEvaluationData;
      const curSpec = window.currentSelectedDaySpec || {};
      const mNum = evalData?.monthNumber || curSpec.month || 1;
      const wNum = evalData?.weekNumber || curSpec.week || 1;
      const dNum = evalData?.dayNumber || curSpec.day || window.currentActiveDay || 1;
      const dId = evalData?.dayId || curSpec.dayId || '';
      const rId = evalData?.roadmapId || curSpec.roadmapId || '';

      await renderDailyHub({
        roadmapId: rId,
        month: mNum,
        week: wNum,
        day: dNum,
        dayId: dId
      });
      switchView('dailyHub');
    });
  });

  document.querySelectorAll('.eval-nav-retake-btn, #eval-retake-assessment-btn, #eval-bottom-retake-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        const evalData = window.currentEvaluationData;
        const taskCtx = evalData?.taskContext || window.currentAssessmentTaskContext || {};
        const curSpec = window.currentSelectedDaySpec || {};
        const mNum = evalData?.monthNumber || taskCtx.monthNumber || curSpec.month || 1;
        const wNum = evalData?.weekNumber || taskCtx.weekNumber || curSpec.week || 1;
        const dNum = evalData?.dayNumber || taskCtx.dayNumber || curSpec.day || window.currentActiveDay || 1;
        const dId = evalData?.dayId || taskCtx.dayId || curSpec.dayId || '';
        const targetTitle = evalData?.phaseTitle || taskCtx.topic || `Phase ${dNum} Assessment`;

        window.currentSelectedDaySpec = {
          roadmapId: evalData?.roadmapId || curSpec.roadmapId || '',
          month: mNum,
          week: wNum,
          day: dNum,
          dayId: dId
        };
        window.currentActiveDay = dNum;

        window.currentAssessmentTaskContext = {
          ...taskCtx,
          monthNumber: mNum,
          weekNumber: wNum,
          dayNumber: dNum,
          dayId: dId
        };

        renderConceptQuizLoading();
        switchView('conceptQuiz');
        await renderConceptQuiz(targetTitle, taskCtx.domain || 'technical', window.currentAssessmentTaskContext);
      } catch (err) {
        console.error('[RETAKE ASSESSMENT ERROR]', err);
        alert('Unable to reload assessment for retake. Please try again.');
      }
    });
  });

  // SUBMIT ASSESSMENT HANDLER -> EVALUATES AND OPENS EVALUATION PAGE (NOT ANALYTICS)
  const conceptQuizForm = document.getElementById('concept-assessment-form');
  if (conceptQuizForm) {
    conceptQuizForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const questions = window.currentAssessmentData?.questions || [];
      if (!questions.length) return;
      const submitButton = conceptQuizForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      try {
        const userAnswers = collectAssessmentAnswers();
        const result = await supervisor.submitTaskAssessment(window.currentActiveDay || 1, questions, userAnswers);

        // Record phase-level assessment completion for the authenticated user
        const taskCtx = window.currentAssessmentTaskContext || {};
        const curSpec = window.currentSelectedDaySpec || {};
        const mNum = taskCtx.monthNumber || curSpec.month || 1;
        const wNum = taskCtx.weekNumber || curSpec.week || 1;
        const dNum = taskCtx.dayNumber || curSpec.day || window.currentActiveDay || 1;
        const dId = taskCtx.dayId || curSpec.dayId || '';
        const phaseKey = `m${mNum}_w${wNum}_d${dNum}`;

        const activeSession = supervisor.authAgent.getActiveSession();
        const userId = activeSession ? activeSession.user_id : null;

        const activeRoadmap = window.activePersonalizedRoadmap || supervisor.progressTracker.getUserState(userId)?.personalizedRoadmap;
        let targetDayTopic = 'Core Learning';
        if (activeRoadmap?.monthly_roadmap) {
          activeRoadmap.monthly_roadmap.forEach(m => {
            if (Number(m.month_number) === Number(mNum)) {
              (m.weeks || []).forEach(w => {
                if (Number(w.week_number) === Number(wNum)) {
                  (w.days || []).forEach(d => {
                    if (Number(d.day_number) === Number(dNum) || (dId && (d.id === dId || d.day_id === dId))) {
                      d.assessment_taken = true;
                      d.assessmentTaken = true;
                      d.assessment_score = result.grade?.scorePct;
                      targetDayTopic = d.topic || (w.topics && w.topics[0]) || targetDayTopic;
                    }
                  });
                }
              });
            }
          });
          window.activePersonalizedRoadmap = activeRoadmap;
        }

        // Process detailed questions evaluation breakdown
        const fbList = Array.isArray(result.grade?.detailedFeedback) ? result.grade.detailedFeedback : [];
        const fbMap = {};
        fbList.forEach(fb => {
          if (fb.question_id) fbMap[fb.question_id] = fb;
        });

        let correctCount = 0;
        let partiallyCorrectCount = 0;
        let incorrectCount = 0;

        const detailedQuestions = questions.map((q, idx) => {
          const fb = fbMap[q.id] || {};
          const uAns = userAnswers[q.id];
          const qType = String(q.type || 'MCQ').toUpperCase();
          const earned = Number(fb.earned_points !== undefined ? fb.earned_points : (fb.correct ? (q.points || 1) : 0));
          const max = Number(fb.max_points || q.points || (qType === 'SHORT_ANSWER' ? 2 : 1));

          let status = 'INCORRECT';
          if (earned === max && max > 0) {
            status = 'CORRECT';
            correctCount++;
          } else if (earned > 0 && earned < max) {
            status = 'PARTIALLY_CORRECT';
            partiallyCorrectCount++;
          } else {
            status = 'INCORRECT';
            incorrectCount++;
          }

          // Format userAnswerText
          let userAnswerText = 'No answer submitted';
          if (qType === 'MCQ') {
            const optIdx = Number(uAns);
            if (Array.isArray(q.options) && optIdx >= 0 && optIdx < q.options.length) {
              userAnswerText = `${q.options[optIdx]} (Option ${String.fromCharCode(65 + optIdx)})`;
            } else if (optIdx >= 0) {
              userAnswerText = `Option ${String.fromCharCode(65 + optIdx)}`;
            }
          } else if (qType === 'MSQ') {
            if (Array.isArray(uAns) && uAns.length > 0) {
              userAnswerText = uAns.map(i => {
                const optIdx = Number(i);
                if (Array.isArray(q.options) && optIdx >= 0 && optIdx < q.options.length) {
                  return `${q.options[optIdx]} (Option ${String.fromCharCode(65 + optIdx)})`;
                }
                return `Option ${String.fromCharCode(65 + optIdx)}`;
              }).join('; ');
            }
          } else if (qType === 'NAT') {
            if (uAns !== '' && uAns !== undefined && uAns !== null) {
              userAnswerText = String(uAns);
            }
          } else if (qType === 'SHORT_ANSWER') {
            if (uAns && String(uAns).trim()) {
              userAnswerText = String(uAns).trim();
            }
          }

          // Format correctAnswerText
          let correctAnswerText = '';
          if (qType === 'MCQ') {
            const corIdx = Number(q.correct);
            if (Array.isArray(q.options) && corIdx >= 0 && corIdx < q.options.length) {
              correctAnswerText = `${q.options[corIdx]} (Option ${String.fromCharCode(65 + corIdx)})`;
            } else {
              correctAnswerText = `Option ${String.fromCharCode(65 + corIdx)}`;
            }
          } else if (qType === 'MSQ') {
            const corArr = Array.isArray(q.correct) ? q.correct : [];
            if (corArr.length > 0) {
              correctAnswerText = corArr.map(i => {
                const corIdx = Number(i);
                if (Array.isArray(q.options) && corIdx >= 0 && corIdx < q.options.length) {
                  return `${q.options[corIdx]} (Option ${String.fromCharCode(65 + corIdx)})`;
                }
                return `Option ${String.fromCharCode(65 + corIdx)}`;
              }).join('; ');
            }
          } else if (qType === 'NAT') {
            correctAnswerText = String(q.correct);
          } else if (qType === 'SHORT_ANSWER') {
            correctAnswerText = fb.model_answer || q.model_answer || 'Expected concise technical explanation covering key principles.';
          }

          return {
            id: q.id || `q_${idx + 1}`,
            question: q.question,
            type: qType,
            topic: q.topic || taskCtx.topic || targetDayTopic || 'Core Technical Concept',
            subtopic: q.subtopic || taskCtx.subtopic || 'General',
            userAnswer: uAns,
            userAnswerText,
            correctAnswerText,
            status,
            earnedPoints: earned,
            maxPoints: max,
            explanation: fb.explanation || q.explanation || '',
            feedback: fb.feedback || ''
          };
        });

        // Generate Concepts to Review from incorrect or partially correct questions
        const missedQuestions = detailedQuestions.filter(q => q.status !== 'CORRECT');
        const conceptsMap = {};
        missedQuestions.forEach(q => {
          const conceptKey = q.topic || targetDayTopic || 'Core Concept';
          if (!conceptsMap[conceptKey]) {
            let reason = '';
            if (q.type === 'SHORT_ANSWER') {
              reason = q.feedback || `The submitted answer for ${conceptKey} did not fully satisfy the required technical explanation and keywords.`;
            } else if (q.status === 'PARTIALLY_CORRECT') {
              reason = `The submitted answer selected some correct options but missed required points for ${conceptKey}.`;
            } else {
              reason = `The submitted answer was incorrect for ${conceptKey}. Expected: ${q.correctAnswerText}.`;
            }

            // Extract matching resources from phase tasks if present
            const matchingResources = [];
            (taskCtx.tasks || []).forEach(t => {
              if (Array.isArray(t.recommended_resources)) {
                t.recommended_resources.forEach(r => {
                  if (r.title && r.url && !matchingResources.some(mr => mr.url === r.url)) {
                    matchingResources.push({ title: r.title, url: r.url });
                  }
                });
              }
            });

            conceptsMap[conceptKey] = {
              topic: conceptKey,
              subtopic: q.subtopic || conceptKey,
              reason,
              recommendations: [
                `Review the foundational syntax and concepts of ${conceptKey}.`,
                `Revisit the corresponding phase learning resources and code drills.`,
                `Retry related practice questions after reviewing the concept.`
              ],
              resources: matchingResources.slice(0, 3)
            };
          }
        });

        const conceptsToReview = Object.values(conceptsMap);

        const attemptId = 'eval_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
        const evalData = {
          submissionId: attemptId,
          userId: userId,
          roadmapId: taskCtx.roadmapId || curSpec.roadmapId || (activeRoadmap?.roadmap_id || activeRoadmap?._id || activeRoadmap?.id || ''),
          phaseKey: phaseKey,
          monthNumber: mNum,
          weekNumber: wNum,
          dayNumber: dNum,
          dayId: dId,
          phaseTitle: targetDayTopic || taskCtx.topic || `Phase ${dNum} Mastery`,
          submittedAt: new Date().toISOString(),
          scorePct: result.grade?.scorePct !== undefined ? result.grade.scorePct : 0,
          earnedPoints: result.grade?.score !== undefined ? result.grade.score : (result.grade?.earnedPoints || 0),
          maxPoints: result.grade?.total !== undefined ? result.grade.total : (result.grade?.maxPoints || 0),
          passed: Boolean(result.grade?.passed),
          totalQuestions: questions.length,
          correctCount,
          partiallyCorrectCount,
          incorrectCount,
          detailedQuestions,
          conceptsToReview,
          taskContext: taskCtx
        };

        // Persist evaluation in user state and storage
        const state = supervisor.progressTracker.getUserState(userId);
        if (state) {
          if (activeRoadmap) state.personalizedRoadmap = activeRoadmap;
          if (!state.phaseAssessments) state.phaseAssessments = {};
          state.phaseAssessments[phaseKey] = {
            taken: true,
            score: evalData.scorePct,
            passed: evalData.passed,
            submittedAt: evalData.submittedAt,
            submissionId: attemptId
          };
          if (dId) state.phaseAssessments[dId] = state.phaseAssessments[phaseKey];

          state.lastPhaseEvaluation = evalData;
          if (!state.phaseEvaluationHistory) state.phaseEvaluationHistory = {};
          state.phaseEvaluationHistory[phaseKey] = evalData;

          if (Array.isArray(state.history)) {
            const lastHist = state.history[state.history.length - 1];
            if (lastHist) {
              lastHist.phaseKey = phaseKey;
              lastHist.monthNumber = mNum;
              lastHist.weekNumber = wNum;
              lastHist.dayNumber = dNum;
              lastHist.dayId = dId;
              lastHist.submissionId = attemptId;
            }
          }

          supervisor.progressTracker.saveUserState(state, userId);
        }

        if (userId) {
          try {
            localStorage.setItem('placify_last_assessment_eval_' + userId, JSON.stringify(evalData));
            localStorage.setItem('placify_phase_eval_' + userId + '_' + phaseKey, JSON.stringify(evalData));
          } catch (e) {}
        }

        // Render dedicated evaluation page and navigate
        updateHeaderStats();
        renderAssessmentEvaluationPage(evalData);
        switchView('assessmentEvaluation');
      } catch (err) {
        console.error('[ASSESSMENT SUBMIT]', err);
        alert('Unable to submit the assessment. Please try again.');
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  const bindClick = (id, fn) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', async (e) => {
        e.preventDefault();
        await fn(e);
      });
    }
  };

  bindClick('skip-assessment-from-quiz-btn', async () => { await continueToNextDay(true); });

  async function renderInterviewQuestions() {
    const container = document.getElementById('interview-questions-container');
    if (!container) return;
    container.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--text-muted);"><i class="ph ph-spinner spinner"></i> Preparing interview questions...</div>';
    const questions = await supervisor.generateInterviewQuestions(window.currentAssessmentTaskContext || {});
    container.innerHTML = questions.map((q, idx) => `<div class="glass-card" style="margin-bottom:0.9rem;padding:1rem;"><div style="font-weight:800;color:#fff;margin-bottom:0.6rem;">Q${idx + 1}. ${q.question}</div><button class="btn btn-secondary reveal-interview-answer" data-id="${q.id}" style="font-size:0.75rem;">Show Suggested Answer</button><div class="interview-answer" data-id="${q.id}" style="display:none;margin-top:0.7rem;padding:0.8rem;background:rgba(16,185,129,0.08);border-radius:6px;color:var(--text-muted);">${q.model_answer}</div></div>`).join('');
    container.querySelectorAll('.reveal-interview-answer').forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      const qid = btn.dataset.id;
      const answer = container.querySelector(`.interview-answer[data-id="${qid}"]`);
      if (answer) {
        const isHidden = answer.style.display === 'none' || getComputedStyle(answer).display === 'none';
        answer.style.display = isHidden ? 'block' : 'none';
        btn.textContent = isHidden ? 'Hide Suggested Answer' : 'Show Suggested Answer';
      }
    }));
  }

  bindClick('take-interview-btn', async () => {
    try { await renderInterviewQuestions(); switchView('interviewQuestions'); }
    catch (err) { console.error('[INTERVIEW]', err); alert('Unable to load interview questions. You can continue to the next day.'); }
  });
  bindClick('skip-interview-btn', async () => { await continueToNextDay(); });
  bindClick('skip-interview-questions-btn', async () => { await continueToNextDay(); });
  bindClick('continue-after-interview-btn', async () => { await continueToNextDay(); });


  // =========================================================================
  // VIEW 7: PROGRESS & ANALYTICS
  // =========================================================================

  async function updateAnalyticsView() {
    const analyticsContainer = document.getElementById('view-progress-analytics');
    if (!analyticsContainer) return;

    const session = supervisor.authAgent.getActiveSession();
    if (!session || !session.user_id) {
      enforceAuthRouteGuard('progressAnalytics');
      switchView('onboarding');
      return;
    }

    // 1. LOADING STATE
    analyticsContainer.innerHTML = `
      <div class="glass-card" style="text-align: center; padding: 3.5rem 1.5rem;">
        <i class="ph ph-spinner spinner" style="font-size: 2.8rem; color: var(--accent-cyan); margin-bottom: 1rem;"></i>
        <h3 style="color: #fff; font-family: var(--font-heading); margin-bottom: 0.5rem;">Loading your analytics...</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Fetching real-time progress, task completions, and assessment metrics.</p>
      </div>
    `;

    try {
      // 2. FETCH REAL USER DATA DIRECTLY FROM BACKEND (Source of Truth)
      let userRoadmap = null;
      let progressMetrics = null;

      try {
        const [rmRes, progRes] = await Promise.all([
          fetch(`http://localhost:5000/api/roadmap/user/${encodeURIComponent(session.user_id)}`),
          fetch(`http://localhost:5000/api/progress/${encodeURIComponent(session.user_id)}`)
        ]);

        if (rmRes.ok) {
          const rmData = await rmRes.json();
          if (rmData.success && rmData.roadmap) {
            userRoadmap = rmData.roadmap;
            window.activePersonalizedRoadmap = userRoadmap;
          }
        }
        if (progRes.ok) {
          const pData = await progRes.json();
          if (pData.success) {
            progressMetrics = pData;
          }
        }
      } catch (err) {
        console.warn('[ANALYTICS] Error fetching authoritative DB data:', err);
      }

      if (!userRoadmap) {
        userRoadmap = window.activePersonalizedRoadmap || supervisor.progressTracker.getUserState(session.user_id)?.personalizedRoadmap;
      }

      const state = supervisor.progressTracker.getUserState(session.user_id) || {};
      const streak = progressMetrics?.streak ?? state.streak ?? 0;
      const xp = progressMetrics?.xp ?? state.xp ?? 0;
      const completedTasks = progressMetrics?.completedTasksCount ?? 0;
      const totalTasks = progressMetrics?.totalTasksCount ?? 0;
      const taskCompletionPct = progressMetrics?.masteryPct ?? (totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0);
      const masteryPct = taskCompletionPct;
      const tier = progressMetrics?.tier || userRoadmap?.skillTier || state.personalizedRoadmap?.skillTier || 'BEGINNER';
      const domainName = userRoadmap?.domain || session.chosen_domain || 'Technology';
      const userName = session.name || session.full_name || session.username || session.email || 'Learner';
      const topicStats = progressMetrics?.topicStats || {};

      // 4. NO DATA STATE
      if (totalTasks === 0) {
        analyticsContainer.innerHTML = `
          <div class="glass-card" style="text-align: center; padding: 3.5rem 1.5rem;">
            <i class="ph ph-chart-bar" style="font-size: 3rem; color: var(--accent-violet); margin-bottom: 1rem;"></i>
            <h3 style="color: #fff; font-family: var(--font-heading); margin-bottom: 0.5rem;">No Analytics Data Available</h3>
            <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 1.8rem auto; line-height: 1.5;">
              Complete some tasks and assessments to see your analytics.
            </p>
            <button class="btn btn-primary" id="analytics-go-roadmap-btn">
              Go to Roadmap & Tasks <i class="ph ph-arrow-right"></i>
            </button>
          </div>
        `;
        const btn = document.getElementById('analytics-go-roadmap-btn');
        if (btn) btn.addEventListener('click', () => switchView('roadmap'));
        return;
      }

      // 5. SUCCESS DASHBOARD UI
      const topicBarsHTML = Object.keys(topicStats).map(topic => {
        const stat = topicStats[topic];
        const pct = stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0;
        return `
          <div style="margin-bottom: 1.2rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 0.4rem;">
              <span style="font-weight: 600; color: #fff;">${escapeHtml(topic)}</span>
              <span style="color: var(--accent-cyan); font-weight: 700;">${pct}% (${stat.completed}/${stat.total} tasks)</span>
            </div>
            <div style="height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;">
              <div style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, var(--accent-cyan), var(--accent-emerald)); border-radius: 4px; transition: width 0.5s ease;"></div>
            </div>
          </div>
        `;
      }).join('');

      analyticsContainer.innerHTML = `
        <div class="glass-card">
          <div class="section-title">
            <i class="ph ph-chart-bar-horizontal"></i>
            Learning & Skill Analytics Studio
          </div>
          <p class="section-subtitle">
            Real-time performance dashboard for <strong style="color: var(--accent-cyan);">${escapeHtml(userName)}</strong> | Domain: <strong style="color: var(--accent-emerald);">${escapeHtml(domainName)}</strong>
          </p>

          <!-- OVERALL PROGRESS CARD -->
          <div style="background: rgba(255,255,255,0.02); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-glass); margin-bottom: 1.8rem;">
            <div style="display:flex; justify-style:space-between; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
              <span style="font-size:1.05rem; font-weight:700; color:#fff;">Overall Roadmap Completion</span>
              <span style="font-size:1.2rem; font-weight:800; color:var(--accent-emerald);">${taskCompletionPct}%</span>
            </div>
            <div style="height:12px; background:rgba(255,255,255,0.08); border-radius:6px; overflow:hidden;">
              <div style="width:${taskCompletionPct}%; height:100%; background:linear-gradient(90deg, var(--accent-violet), var(--accent-cyan), var(--accent-emerald)); border-radius:6px; transition:width 0.5s ease;"></div>
            </div>
          </div>

          <!-- KPI METRICS GRID -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.2rem; margin-bottom: 2rem;">
            <div class="glass-card" style="text-align: center; padding: 1.2rem;">
              <i class="ph ph-check-circle" style="font-size: 2rem; color: var(--accent-emerald);"></i>
              <div style="font-size: 1.8rem; font-family: var(--font-heading); font-weight: 800; margin: 0.4rem 0;">${completedTasks} / ${totalTasks}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Tasks Completed</div>
            </div>

            <div class="glass-card" style="text-align: center; padding: 1.2rem;">
              <i class="ph ph-percent" style="font-size: 2rem; color: var(--accent-violet);"></i>
              <div style="font-size: 1.8rem; font-family: var(--font-heading); font-weight: 800; margin: 0.4rem 0;" id="analytics-mastery-num">${masteryPct}%</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Domain Mastery</div>
            </div>

            <div class="glass-card" style="text-align: center; padding: 1.2rem;">
              <i class="ph ph-flame" style="font-size: 2rem; color: var(--accent-amber);"></i>
              <div style="font-size: 1.8rem; font-family: var(--font-heading); font-weight: 800; margin: 0.4rem 0;" id="analytics-streak-num">${streak} Days</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Current Streak</div>
            </div>

            <div class="glass-card" style="text-align: center; padding: 1.2rem;">
              <i class="ph ph-lightning" style="font-size: 2rem; color: var(--accent-cyan);"></i>
              <div style="font-size: 1.8rem; font-family: var(--font-heading); font-weight: 800; margin: 0.4rem 0;" id="analytics-xp-num">${xp}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Total XP Earned</div>
            </div>

            <div class="glass-card" style="text-align: center; padding: 1.2rem;">
              <i class="ph ph-shield-check" style="font-size: 2rem; color: var(--accent-emerald);"></i>
              <div style="font-size: 1.8rem; font-family: var(--font-heading); font-weight: 800; margin: 0.4rem 0;" id="analytics-tier-name">${escapeHtml(tier)}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Current Skill Tier</div>
            </div>
          </div>

          <!-- DOMAIN & TOPIC BREAKDOWN -->
          <div style="background: rgba(255,255,255,0.02); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-glass); margin-bottom: 1.8rem;">
            <h4 style="color: #fff; margin-bottom: 1.2rem; font-family: var(--font-heading); display: flex; align-items: center; gap: 0.5rem;">
              <i class="ph ph-tree-structure" style="color: var(--accent-cyan);"></i> Domain Progress Breakdown
            </h4>
            ${topicBarsHTML || '<div style="color:var(--text-muted);font-size:0.88rem;">No topic breakdown available yet.</div>'}
          </div>

          <!-- ASSESSMENT SUMMARY PANEL -->
          <div id="assessment-result-summary" style="padding: 1.2rem; border: 1px solid var(--border-glass); border-radius: var(--radius-sm); background: rgba(255,255,255,0.02); color: var(--text-muted);">
            <i class="ph ph-info" style="color: var(--accent-cyan);"></i> Daily concept assessments evaluate technical mastery. A minimum of 70% is required to pass each assessment.
          </div>

          <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end; gap: 0.7rem; flex-wrap: wrap;">
            <button id="take-interview-btn" class="btn btn-secondary" style="display:none;">Practice Interview Questions <i class="ph ph-microphone"></i></button>
            <button id="analytics-to-dailyhub-btn" class="btn btn-primary">
              Continue Learning in Daily Hub <i class="ph ph-arrow-right"></i>
            </button>
          </div>
        </div>
      `;

      const dailyBtn = document.getElementById('analytics-to-dailyhub-btn');
      if (dailyBtn) dailyBtn.addEventListener('click', () => switchView('dailyHub'));

    } catch (err) {
      console.error('❌ [ANALYTICS ERROR]', err);
      analyticsContainer.innerHTML = `
        <div class="glass-card" style="text-align: center; padding: 3.5rem 1.5rem;">
          <i class="ph ph-warning-circle" style="font-size: 3rem; color: var(--accent-rose); margin-bottom: 1rem;"></i>
          <h3 style="color: #fff; font-family: var(--font-heading); margin-bottom: 0.5rem;">Unable to load analytics right now</h3>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem;">${escapeHtml(err.message || 'An unexpected error occurred while processing analytics.')}</p>
          <button class="btn btn-secondary" id="analytics-retry-btn">
            Retry <i class="ph ph-arrow-clockwise"></i>
          </button>
        </div>
      `;
      const retryBtn = document.getElementById('analytics-retry-btn');
      if (retryBtn) retryBtn.addEventListener('click', () => updateAnalyticsView());
    }
  }

  function renderProgressAnalytics(grade, state) {
    const s = state || {};
    const g = grade || {};
    const summary = document.getElementById('assessment-result-summary');
    if (summary) summary.innerHTML = `<strong style="color:var(--accent-emerald);">Assessment Score: ${g.scorePct ?? 0}%</strong><br/><span style="color:var(--text-muted);">${g.passed ? 'Assessment passed (70%+). Great job! You can continue learning or optionally practice interview questions.' : 'Score below 70%. Use the feedback to review weak areas and try again.'}</span>`;
    const interviewBtn = document.getElementById('take-interview-btn');
    if (interviewBtn) interviewBtn.style.display = 'inline-flex';
    updateAnalyticsView();
  }

  document.getElementById('continue-learning-btn').addEventListener('click', async () => { await continueToNextDay(); });

  // TOP NAVBAR NAVIGATION CLICK HANDLERS
  document.querySelectorAll('.main-navbar .nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetView = btn.dataset.view;
      if (!targetView) return;

      const activeSession = supervisor.authAgent.getActiveSession();
      if (!activeSession) {
        e.preventDefault();
        enforceAuthRouteGuard(targetView);
        switchView('onboarding');
        return;
      }

      const state = supervisor.progressTracker.getUserState();
      if (targetView === 'roadmap') {
        if (state && state.personalizedRoadmap) {
          renderRoadmapView(state.personalizedRoadmap);
        }
      } else if (targetView === 'dailyHub') {
        if (state && state.dailyTasks) {
          renderDailyHubView(state.dailyTasks);
        }
      } else if (targetView === 'progressAnalytics') {
        updateAnalyticsView();
      } else if (targetView === 'techNews') {
        fetchTechNews();
      }
      switchView(targetView);
    });
  });

  // Reset State Handler (Strictly scoped to current authenticated user)
  document.getElementById('reset-app-btn').addEventListener('click', async () => {
    const activeSession = supervisor.authAgent.getActiveSession();
    if (confirm('Are you sure you want to reset your Placify learning profile and restart onboarding?')) {
      if (activeSession && activeSession.user_id) {
        try {
          await fetch(`http://localhost:5000/api/user/reset/${encodeURIComponent(activeSession.user_id)}`, { method: 'POST' });
        } catch (e) {
          console.warn('Could not reset user on server:', e);
        }
        supervisor.progressTracker.resetState(activeSession.user_id);
      }
      supervisor.authAgent.clearSession();
      supervisor.progressTracker.clearActiveUser();
      window.activePersonalizedRoadmap = null;
      window.currentDraftProfile = null;
      location.reload();
    }
  });
});
