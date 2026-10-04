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

  function switchView(viewKey) {
    Object.keys(views).forEach(k => {
      if (views[k]) {
        views[k].classList.remove('active');
      }
    });
    if (views[viewKey]) {
      views[viewKey].classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Sync active nav item state in top navbar
    document.querySelectorAll('.main-navbar .nav-item').forEach(btn => {
      if (btn.dataset.view === viewKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (viewKey === 'techNews') {
      fetchTechNews();
    } else if (viewKey === 'internships') {
      fetchInternships();
    } else if (viewKey === 'myApplications') {
      fetchMyApplications();
    }

    // Asynchronously persist last_route in MongoDB Atlas for authenticated users
    const activeSession = supervisor.authAgent.getActiveSession();
    if (activeSession && activeSession.user_id && viewKey !== 'onboarding' && viewKey !== 'diagnostic' && viewKey !== 'domainSelection') {
      fetch('http://localhost:5000/api/user/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: activeSession.user_id, last_route: viewKey })
      }).catch(e => console.warn('Could not persist last_route to DB:', e));
    }
  }

  function updateHeaderStats() {
    const state = supervisor.progressTracker.getUserState();
    const lvlEl = document.getElementById('user-level-val');
    if (lvlEl) lvlEl.textContent = state.level || 1;
    const xpEl = document.getElementById('user-xp-val');
    if (xpEl) xpEl.textContent = state.xp || 0;
    const streakEl = document.getElementById('user-streak-val');
    if (streakEl) streakEl.textContent = state.streak || 1;

    // Badges
    const badgeGrid = document.getElementById('user-badge-grid');
    if (badgeGrid) {
      badgeGrid.innerHTML = state.badges.map(b => `<div class="badge-item">${b}</div>`).join('');
      document.getElementById('badge-count-num').textContent = state.badges.length;
    }

    // Mastery bar
    const bar = document.getElementById('mastery-bar-fill');
    if (bar) {
      bar.style.width = `${state.masteryPct || 0}%`;
    }
    const num = document.getElementById('mastery-pct-num');
    if (num) {
      num.textContent = `${state.masteryPct || 0}%`;
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

  // Restore Active Session on Load
  const activeSession = supervisor.authAgent.getActiveSession();
  if (activeSession && activeSession.user_id) {
    updateHeaderUserPill(activeSession);
    window.currentDraftProfile = {
      user_id: activeSession.user_id,
      name: activeSession.name,
      domainId: activeSession.chosen_domain,
      chosen_domain: activeSession.chosen_domain,
      dsaLanguage: activeSession.dsa_language || null,
      timelineMonths: activeSession.timeline_months || 4,
      dailyHours: activeSession.daily_hours || 2.0
    };

    supervisor.checkUserOnboardingState(activeSession.user_id).then(async (state) => {
      if (state.action === 'DOMAIN_SELECT') {
        renderDomainSelectionScreen(activeSession.name);
        switchView('domainSelection');
      } else if (state.action === 'QUIZ') {
        if (isDsaDomain(activeSession.chosen_domain) && !activeSession.dsa_language) {
          openDsaLanguageSelector();
        } else {
          renderDiagnosticQuiz(activeSession.chosen_domain);
          switchView('diagnostic');
        }
      } else {
        if (state.roadmap) {
          await renderRoadmapView(state.roadmap);
        }
        switchView(state.route || 'roadmap');
      }
    }).catch(err => {
      console.warn('Session restore check error:', err);
    });
  }

  // Logout Handler
  document.getElementById('logout-btn').addEventListener('click', () => {
    supervisor.authAgent.clearSession();
    updateHeaderUserPill(null);
    switchView('onboarding');
    supervisor.logAgentAction('auth_specialist', 'User Signed Out', 'Cleared active session credentials.');
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
      // 1. Authenticate / Register via AuthAgent (no domain yet)
      const profile = await supervisor.registerUser({
        name,
        email,
        password,
        timeline_months,
        daily_hours
      });

      updateHeaderUserPill(profile);

      // Save active draft profile for Supervisor
      window.currentDraftProfile = {
        user_id: profile.user_id,
        name: profile.name,
        domainId: null,
        chosen_domain: null,
        timelineMonths: profile.timeline_months,
        dailyHours: profile.daily_hours
      };

      // 2. NEW USER: Go to domain selection screen
      renderDomainSelectionScreen(profile.name);
      switchView('domainSelection');

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
      // 1. Authenticate credentials via AuthAgent
      const profile = await supervisor.authenticateUser(email, password);

      updateHeaderUserPill(profile);

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
        // DO NOT SHOW DIAGNOSTIC QUIZ AGAIN.
        if (onboardingState.roadmap) {
          await renderRoadmapView(onboardingState.roadmap);
        }
        const routeToSwitch = onboardingState.route || 'roadmap';
        if (routeToSwitch === 'dailyHub') {
          let savedSpec = null;
          try {
            const raw = localStorage.getItem('placify_selected_day_spec');
            if (raw) savedSpec = JSON.parse(raw);
          } catch(e) {}
          if (!savedSpec) {
            const userState = supervisor.progressTracker.getUserState();
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

    if (!roadmap && userId) {
      try {
        const res = await fetch(`http://localhost:5000/api/roadmap/user/${userId}`);
        const json = await res.json();
        if (json.success && json.roadmap) {
          roadmap = json.roadmap;
        }
      } catch (err) {
        console.warn('Could not fetch server roadmap:', err);
      }
    }

    if (!roadmap) {
      const state = supervisor.progressTracker.getUserState();
      roadmap = state.personalizedRoadmap;
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
        const monthObj = monthlyList[midx];
        if (monthObj) {
          renderWeeklyView(roadmap, monthObj);
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
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${w.days ? w.days.length : 7} Days</span>
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
                  View Day Tasks <i class="ph ph-caret-right"></i>
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
      renderMonthlyView(roadmap);
    });

    container.querySelectorAll('.week-card').forEach(card => {
      card.addEventListener('click', () => {
        const widx = parseInt(card.dataset.widx, 10);
        const weekObj = weeklyList[widx];
        if (weekObj) {
          renderDayView(roadmap, monthObj, weekObj);
        }
      });
    });
  }

  function renderDayView(roadmap, monthObj, weekObj) {
    currentSelectedWeekObj = weekObj;

    document.getElementById('roadmap-level-indicator').textContent = `Level 3: Week ${weekObj.week_number} Day-Wise Tasks`;
    const navMonths = document.getElementById('nav-level-months');
    const navWeeks = document.getElementById('nav-level-weeks');
    const navDays = document.getElementById('nav-level-days');

    navMonths.classList.remove('active');
    navWeeks.classList.remove('active');
    navDays.classList.add('active');
    navDays.disabled = false;
    navDays.textContent = `Week ${weekObj.week_number} Days`;

    const container = document.getElementById('roadmap-nodes-container');
    const daysList = weekObj.days || [];

    const isStarted = (roadmap.journey_started || (supervisor.authAgent.getActiveSession() && supervisor.authAgent.getActiveSession().journey_started)) && (roadmap.journey_start_date || (supervisor.authAgent.getActiveSession() && supervisor.authAgent.getActiveSession().journey_start_date));
    const startDate = roadmap.journey_start_date || (supervisor.authAgent.getActiveSession() ? supervisor.authAgent.getActiveSession().journey_start_date : null);

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
        const dayFormatted = dayDateObj ? formatDateLong(dayDateObj) : (d.day_name || 'Day ' + d.day_number);
        const isToday = dayDateObj ? isSameCalendarDay(dayDateObj, new Date()) : false;

        return `
          <div class="glass-card" style="margin-bottom: 1.2rem; border-left: 4px solid ${isToday ? 'var(--accent-cyan)' : 'var(--accent-emerald)'}; ${isToday ? 'box-shadow: 0 0 15px rgba(6, 182, 212, 0.2);' : ''}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.6rem; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
                <span style="font-size: 0.85rem; font-weight: 700; background: rgba(16, 185, 129, 0.2); color: var(--accent-emerald); padding: 0.2rem 0.6rem; border-radius: 4px;">
                  Day ${d.day_number}
                </span>
                <strong style="font-size: 1rem; color: #fff;">${dayFormatted}</strong>
                ${isToday ? `
                  <span style="font-size: 0.72rem; font-weight: 800; background: var(--accent-cyan); color: #000; padding: 0.15rem 0.5rem; border-radius: 4px;">
                    TODAY
                  </span>
                ` : ''}
                <span style="font-size: 0.85rem; color: var(--text-muted);">(${d.topic || weekObj.topics[0]})</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.8rem;">
                <span style="font-size: 0.82rem; font-weight: 700; color: var(--accent-cyan);">
                  ⏱️ ${normDayMinutes} Mins Workload
                </span>
                <button class="btn btn-emerald launch-day-hub-btn" 
                  data-roadmap-id="${roadmap.roadmap_id || roadmap._id || roadmap.id || ''}" 
                  data-month="${monthObj.month_number || 1}" 
                  data-week="${weekObj.week_number || 1}" 
                  data-day="${d.day_number}" 
                  data-day-id="${d.id || d.day_id || ''}" 
                  style="padding: 0.35rem 0.75rem; font-size: 0.78rem;">
                  Launch Day ${d.day_number} Tasks <i class="ph ph-arrow-right"></i>
                </button>
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

                return `
                  <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 0.7rem 0.9rem; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                    <div>
                      <div style="display: flex; gap: 0.4rem; align-items: center; margin-bottom: 0.2rem;">
                        <span class="node-tag ${typeClass}" style="font-size: 0.7rem; padding: 0.1rem 0.4rem;">${normTask.taskType}</span>
                        <span class="tier-badge ${normTask.difficulty || 'INTERMEDIATE'}" style="font-size: 0.65rem; padding: 0.1rem 0.4rem;">${normTask.difficulty || 'INT'}</span>
                        <span style="font-size: 0.85rem; font-weight: 700; color: #fff;">${normTask.taskTitle}</span>
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

    container.querySelectorAll('.launch-day-hub-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const daySpec = {
          roadmapId: btn.dataset.roadmapId || '',
          month: parseInt(btn.dataset.month, 10),
          week: parseInt(btn.dataset.week, 10),
          day: parseInt(btn.dataset.day, 10),
          dayId: btn.dataset.dayId || ''
        };

        console.log('[DAY NAVIGATION]', {
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

    resList.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-muted);"><i class="ph ph-spinner spinner"></i> Loading Day ${targetDayNum} tasks and curated learning resources...</div>`;

    try {
      const userId = activeSession ? activeSession.user_id : (window.currentDraftProfile ? window.currentDraftProfile.user_id : null);

      if (dayTasksList.length === 0) {
        console.error('[ROADMAP TASK CONTRACT ERROR] Day has no tasks assigned:', { targetDayNum, dayTopic, domainKey });
        resList.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--accent-amber);"><i class="ph ph-warning-circle" style="font-size: 2rem;"></i><br/><br/>No tasks found for Day ${targetDayNum}. Please return to the roadmap and select a valid day.</div>`;
        return;
      }

      let fullHTML = '';

      for (let tIdx = 0; tIdx < dayTasksList.length; tIdx++) {
        const rawTaskItem = dayTasksList[tIdx];
        const taskItem = window.normalizeDailyTask ? window.normalizeDailyTask(rawTaskItem, {
          domain: domainKey,
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

        const taskContext = {
          taskItem: taskItem,
          id: taskItem.taskId || taskItem.id || `task_day_${targetDayNum}_${tIdx + 1}`,
          taskId: taskItem.taskId || taskItem.id || `task_day_${targetDayNum}_${tIdx + 1}`,
          dayNumber: targetDayNum,

          title: taskItem.taskTitle || taskItem.title,
          taskTitle: taskItem.taskTitle || taskItem.title,

          topic: taskTopic,
          taskTopic: taskTopic,

          subtopic:
            taskItem.taskSubtopic ||
            taskItem.subtopic ||
            taskItem.subskillName ||
            taskTopic,
          taskSubtopic:
            taskItem.taskSubtopic ||
            taskItem.subtopic ||
            taskItem.subskillName ||
            taskTopic,

          skillId: taskItem.skillId,
          subskillId: taskItem.subskillId,
          subskillName: taskItem.subskillName,
          parentSkillId: taskItem.parentSkillId,

          dayTopic: dayTopic,
          dailyTopic: taskTopic,

          type: taskItem.taskType || taskItem.type || 'LEARN',
          taskType: taskItem.taskType || taskItem.type || 'LEARN',

          estimated_minutes: taskItem.durationMinutes || taskItem.estimated_minutes || 45,
          taskDuration: taskItem.durationMinutes || taskItem.estimated_minutes || 45,
          durationMinutes: taskItem.durationMinutes || taskItem.estimated_minutes || 45,

          domain: domainKey,
          chosen_domain: domainKey,

          user_id: userId,

          userLevel: taskItem.difficulty || userLevel,
          difficulty: taskItem.difficulty || userLevel,

          description: taskItem.description || taskItem.practice_details || ''
        };

        console.log('[PHASE 1 RESOURCE CONTEXT]', {
          dayNumber: targetDayNum,
          dayTopic,
          taskId: taskContext.taskId,
          taskTitle: taskContext.taskTitle,
          taskType: taskContext.taskType,
          taskTopic: taskContext.topic,
          taskSubtopic: taskContext.subtopic,
          domain: taskContext.domain,
          difficulty: taskContext.difficulty
        });

        const taskResources = await supervisor.resourceSuggester.suggestResources(
          taskTopic,
          taskItem.difficulty || userLevel,
          taskContext
        );

        fullHTML += `
          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1.2rem; margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.6rem;">
              <div>
                <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.4rem; flex-wrap: wrap;">
                  <span class="node-tag ${typeClass}" style="font-size: 0.75rem; padding: 0.15rem 0.5rem;">${taskItem.taskType || 'LEARN'}</span>
                  <span class="tier-badge ${taskItem.difficulty || userLevel}" style="font-size: 0.7rem; padding: 0.15rem 0.5rem;">${taskItem.difficulty || userLevel}</span>
                  <h3 style="font-size: 1.1rem; font-weight: 700; color: #fff; margin: 0;">${taskItem.taskTitle}</h3>
                </div>
                <button class="btn btn-secondary task-complete-toggle"
                  data-task-id="${taskContext.taskId}"
                  data-skill-id="${taskContext.skillId || ''}"
                  data-completed="${taskItem.completed === true || String(taskItem.status || '').toUpperCase() === 'COMPLETED'}"
                  style="margin-top: 0.65rem; padding: 0.38rem 0.7rem; font-size: 0.75rem;"
                  aria-pressed="${taskItem.completed === true || String(taskItem.status || '').toUpperCase() === 'COMPLETED'}">
                  ${taskItem.completed === true || String(taskItem.status || '').toUpperCase() === 'COMPLETED' ? '✓ Completed' : 'Mark Task Complete'}
                </button>
                <div style="font-size: 0.84rem; color: var(--text-muted); line-height: 1.4;">
                  ${taskItem.description || 'Read conceptual overview, study examples, and execute practice code drills.'}
                </div>
              </div>
              <div style="font-size: 0.88rem; font-weight: 700; color: var(--accent-amber); white-space: nowrap;">
                ⏱️ ${taskItem.durationMinutes || 30} mins
              </div>
            </div>

            <!-- RECOMMENDED RESOURCES FOR THIS SPECIFIC TASK -->
            <div style="margin-top: 1rem; padding-top: 0.8rem; border-top: 1px dashed rgba(255,255,255,0.1);">
              <h4 style="font-size: 0.86rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 0.7rem; display: flex; align-items: center; gap: 0.4rem;">
                <i class="ph ph-books"></i> Recommended Resources for Today's Task:
              </h4>

              <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                ${taskResources && taskResources.length > 0 ? taskResources.map((r, idx) => `
                  <div class="resource-card" style="border-left: 4px solid ${idx === 0 ? 'var(--accent-emerald)' : (idx === 1 ? 'var(--accent-cyan)' : 'var(--accent-amber)')}; padding: 0.9rem; background: rgba(0,0,0,0.25); border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; flex-wrap: wrap; gap: 0.4rem;">
                      <span class="node-tag ${r.category_label || (idx === 0 ? 'STANDARD' : 'REMEDIAL')}" style="font-size: 0.72rem; font-weight: 800;">
                        ⭐ ${r.category_label || (idx === 0 ? 'PRIMARY' : (idx === 1 ? 'ALTERNATIVE' : 'PRACTICE'))}
                      </span>
                      <span style="font-size: 0.75rem; color: var(--accent-cyan); font-weight: 600;">
                        ${r.is_official ? '🏛️ Official Documentation' : `Platform: ${r.platform}`}
                      </span>
                    </div>
                    <h5 style="font-size: 0.98rem; font-weight: 700; color: #fff; margin: 0.3rem 0;">${r.title}</h5>
                    <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.5rem;">${r.description}</p>
                    
                    ${r.recommended_section ? `
                      <div style="font-size: 0.76rem; color: var(--accent-amber); background: rgba(245, 158, 11, 0.1); padding: 0.25rem 0.5rem; border-radius: 4px; margin-bottom: 0.5rem;">
                        🎯 <strong>Recommended Section:</strong> ${r.recommended_section} (${r.estimated_minutes || 30} mins)
                      </div>
                    ` : ''}

                    <p style="font-size: 0.76rem; color: var(--text-dim); font-style: italic; margin-bottom: 0.6rem;">
                      💡 <strong>Why this resource:</strong> ${r.relevance_reason || 'Directly supports today\'s specific task.'}
                    </p>

                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="font-size: 0.75rem; color: var(--text-muted);">${r.platform}</span>
                      <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="btn btn-emerald" style="font-size: 0.78rem; padding: 0.3rem 0.75rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;">
                        Open Resource <i class="ph ph-arrow-square-out"></i>
                      </a>
                    </div>
                  </div>
                `).join('') : `
                  <div style="padding: 0.75rem 1rem; color: var(--text-muted); font-size: 0.82rem; background: rgba(0,0,0,0.15); border-radius: 6px;">
                    Recommended resources are temporarily unavailable. You may continue with your task.
                  </div>
                `}
              </div>
            </div>
          </div>
        `;

      }

      resList.innerHTML = fullHTML;

    } catch (err) {
      console.warn('Error rendering personalized resources:', err);
      resList.innerHTML = `<div style="padding: 1rem; color: var(--text-muted);">Recommended resources are temporarily unavailable. You may continue with your task workbook below.</div>`;
    }

    // Individual task completion is persisted independently of adaptive
    // replanning, so checking one task never unexpectedly replaces the day.
    container.querySelectorAll('.task-complete-toggle').forEach(button => {
      button.addEventListener('click', async () => {
        const taskId = button.dataset.taskId;
        const currentlyCompleted = button.dataset.completed === 'true';
        const nextCompleted = !currentlyCompleted;
        button.disabled = true;
        try {
          const userId = activeSession ? activeSession.user_id : (window.currentDraftProfile ? window.currentDraftProfile.user_id : null);
          const response = await fetch('http://localhost:5000/api/task/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: userId,
              taskId,
              completed: nextCompleted,
              monthNumber: taskItem.monthNumber || taskItem.month_number,
              weekNumber: taskItem.weekNumber || taskItem.week_number,
              dayNumber: taskItem.dayNumber || taskItem.day_number || targetDayNum,
              title: taskItem.taskTitle || taskItem.title
            })
          });
          const result = await response.json();
          if (!response.ok || !result.success) throw new Error(result.error || 'Could not update task status.');

          button.dataset.completed = String(nextCompleted);
          button.setAttribute('aria-pressed', String(nextCompleted));
          button.textContent = nextCompleted ? '✓ Completed' : 'Mark Task Complete';
          button.style.opacity = nextCompleted ? '0.75' : '1';

          // Keep the in-memory roadmap synchronized so returning to the day
          // immediately reflects the learner's checkbox state.
          const activeRoadmap = window.activePersonalizedRoadmap || supervisor.progressTracker.getUserState()?.personalizedRoadmap;
          if (activeRoadmap?.monthly_roadmap) {
            activeRoadmap.monthly_roadmap.forEach(month => (month.weeks || []).forEach(week => (week.days || []).forEach(day => (day.tasks || []).forEach(task => {
              if ((task.taskId || task.id) === taskId) {
                task.completed = nextCompleted;
                task.status = nextCompleted ? 'COMPLETED' : 'pending';
              }
            }))));
            window.activePersonalizedRoadmap = activeRoadmap;
            const state = supervisor.progressTracker.getUserState();
            if (state?.personalizedRoadmap) {
              state.personalizedRoadmap = activeRoadmap;
              supervisor.progressTracker.saveUserState(state);
            }
          }
          updateHeaderStats();
        } catch (err) {
          console.error('[TASK STATUS UPDATE]', err);
          button.disabled = false;
          alert('Unable to save this task status. Please try again.');
          return;
        }
        button.disabled = false;
      });
    });

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

  document.getElementById('view-all-roadmap-btn').addEventListener('click', () => {
    const state = supervisor.progressTracker.getUserState();
    renderRoadmapView(state.personalizedRoadmap);
    switchView('roadmap');
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
    const quizData = await supervisor.fetchTaskAssessment(conceptTitle, topic, taskContext);
    window.currentAssessmentData = quizData;
    const summary = document.getElementById('quiz-grounded-summary');
    if (summary) summary.textContent = quizData.retrievedContentSummary;

    const container = document.getElementById('concept-quiz-questions-container');
    container.innerHTML = quizData.questions.map((q, idx) => {
      const typeLabel = q.type === 'MSQ' ? 'MSQ — Select all that apply' : q.type === 'NAT' ? 'NAT — Numerical Answer' : q.type === 'SHORT_ANSWER' ? 'Written Answer' : 'MCQ — Single Correct Answer';
      let answerHTML = '';
      if (q.type === 'MCQ') {
        answerHTML = `<div class="quiz-options">${q.options.map((opt, oIdx) => `<div class="option-btn assessment-option" data-qid="${q.id}" data-index="${oIdx}" data-multi="false"><i class="ph ph-circle"></i> ${opt}</div>`).join('')}</div>`;
      } else if (q.type === 'MSQ') {
        answerHTML = `<div class="quiz-options">${q.options.map((opt, oIdx) => `<div class="option-btn assessment-option" data-qid="${q.id}" data-index="${oIdx}" data-multi="true"><i class="ph ph-square"></i> ${opt}</div>`).join('')}</div>`;
      } else if (q.type === 'NAT') {
        answerHTML = `<input type="number" step="any" class="assessment-nat-input" data-qid="${q.id}" placeholder="Enter numerical answer" style="width:100%;padding:0.8rem;border:1px solid var(--border-glass);background:rgba(255,255,255,0.04);color:#fff;border-radius:8px;">`;
      } else {
        answerHTML = `<textarea class="assessment-written-input" data-qid="${q.id}" rows="4" placeholder="Write your answer in 2–4 sentences..." style="width:100%;padding:0.8rem;border:1px solid var(--border-glass);background:rgba(255,255,255,0.04);color:#fff;border-radius:8px;resize:vertical;"></textarea>`;
      }
      return `<div class="quiz-question-card" data-cqid="${q.id}">
        <div class="quiz-question-title"><span class="question-badge">Q${idx + 1}</span><span>${q.question}</span></div>
        <div style="font-size:0.72rem;color:var(--accent-cyan);font-weight:800;margin:0.6rem 0;text-transform:uppercase;">${typeLabel} • ${q.points || 1} point${(q.points || 1) === 1 ? '' : 's'}</div>
        ${answerHTML}
      </div>`;
    }).join('');

    container.querySelectorAll('.assessment-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.qid;
        const multi = btn.dataset.multi === 'true';
        if (!multi) {
          container.querySelectorAll(`.assessment-option[data-qid="${qid}"]`).forEach(b => { b.classList.remove('selected'); b.querySelector('i').className = 'ph ph-circle'; });
        }
        btn.classList.toggle('selected');
        const selected = btn.classList.contains('selected');
        btn.querySelector('i').className = selected ? (multi ? 'ph ph-check-square' : 'ph ph-check-circle') : (multi ? 'ph ph-square' : 'ph ph-circle');
      });
    });
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
        renderProgressAnalytics(result.grade, result.updatedState);
        updateHeaderStats();
        switchView('progressAnalytics');
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
  function renderProgressAnalytics(grade, state) {
    const s = state || {};
    const g = grade || {};
    const masteryEl = document.getElementById('analytics-mastery-num');
    if (masteryEl) masteryEl.textContent = `${s.masteryPct ?? 0}%`;
    const streakEl = document.getElementById('analytics-streak-num');
    if (streakEl) streakEl.textContent = s.streak ?? 1;
    const xpEl = document.getElementById('analytics-xp-num');
    if (xpEl) xpEl.textContent = s.xp ?? 0;
    const tierEl = document.getElementById('analytics-tier-name');
    if (tierEl) tierEl.textContent = s.personalizedRoadmap ? (s.personalizedRoadmap.skillTier || 'BEGINNER') : 'BEGINNER';
    const summary = document.getElementById('assessment-result-summary');
    if (summary) summary.innerHTML = `<strong style="color:var(--accent-emerald);">Assessment Score: ${g.scorePct ?? 0}%</strong><br/><span style="color:var(--text-muted);">${g.passed ? 'Assessment passed. You can continue learning or optionally practice interview questions.' : 'Use the feedback to identify weak areas. You can still continue to the next day.'}</span>`;
    const interviewBtn = document.getElementById('take-interview-btn');
    if (interviewBtn) interviewBtn.style.display = 'inline-flex';
  }

  document.getElementById('continue-learning-btn').addEventListener('click', async () => { await continueToNextDay(); });

  // TOP NAVBAR NAVIGATION CLICK HANDLERS
  document.querySelectorAll('.main-navbar .nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.dataset.view;
      if (!targetView) return;

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

  // Reset State Handler
  document.getElementById('reset-app-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset your Placify learning profile and restart onboarding?')) {
      supervisor.progressTracker.resetState();
      location.reload();
    }
  });

  // INITIAL STATE BOOTSTRAP
  if (!activeSession) {
    switchView('onboarding');
  }
});
