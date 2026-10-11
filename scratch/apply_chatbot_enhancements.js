const fs = require('fs');

console.log('--- Applying Chatbot Enhancements ---');

// 1. Update index.html and frontend/index.html
['index.html', 'frontend/index.html'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const isCrlf = content.includes('\r\n');
  const eol = isCrlf ? '\r\n' : '\n';

  // Replace header actions in chatbot panel
  const oldHeaderActions = `<div class="chatbot-header-actions">
          <button id="chatbot-clear-btn" type="button" class="chatbot-icon-btn" title="Clear conversation" aria-label="Clear conversation">
            <i class="ph ph-trash"></i>
          </button>
          <button id="chatbot-close-btn" type="button" class="chatbot-icon-btn" title="Close chat" aria-label="Close chat">
            <i class="ph ph-x"></i>
          </button>
        </div>`;

  const newHeaderActions = `<div class="chatbot-header-actions">
          <button id="chatbot-new-chat-btn" type="button" class="chatbot-new-chat-btn" title="Start a fresh conversation" aria-label="New Chat">
            <i class="ph ph-plus-circle"></i>
            <span>New Chat</span>
          </button>
          <button id="chatbot-clear-btn" type="button" class="chatbot-icon-btn" title="Clear conversation" aria-label="Clear conversation" style="display: none;">
            <i class="ph ph-trash"></i>
          </button>
          <button id="chatbot-close-btn" type="button" class="chatbot-icon-btn" title="Close chat" aria-label="Close chat">
            <i class="ph ph-x"></i>
          </button>
        </div>`;

  const normOld = oldHeaderActions.replace(/\r?\n/g, eol);
  const normNew = newHeaderActions.replace(/\r?\n/g, eol);

  if (content.includes(normOld)) {
    content = content.replace(normOld, normNew);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated header actions in ${filePath}`);
  } else {
    console.log(`Header actions already updated or pattern not found in ${filePath}`);
  }
});

// 2. Update styles.css and frontend/styles.css
['styles.css', 'frontend/styles.css'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const isCrlf = content.includes('\r\n');
  const eol = isCrlf ? '\r\n' : '\n';

  const newBtnStyles = `.chatbot-new-chat-btn {
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.35);
  color: #c4b5fd;
  border-radius: 6px;
  padding: 0.28rem 0.65rem;
  font-size: 0.76rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  white-space: nowrap;
}

.chatbot-new-chat-btn:hover {
  background: rgba(139, 92, 246, 0.28);
  border-color: rgba(139, 92, 246, 0.6);
  color: #fff;
  transform: translateY(-1px);
}

.chatbot-new-chat-btn i {
  font-size: 0.95rem;
  color: var(--accent-cyan);
}
`;

  if (!content.includes('.chatbot-new-chat-btn')) {
    const marker = '.chatbot-icon-btn {';
    const idx = content.indexOf(marker);
    if (idx !== -1) {
      const formattedBtnStyles = isCrlf ? newBtnStyles.replace(/\r?\n/g, '\r\n') : newBtnStyles.replace(/\r?\n/g, '\n');
      content = content.slice(0, idx) + formattedBtnStyles + eol + content.slice(idx);
    }
  }

  // Update .chat-bubble-assistant max-height and scrolling
  const oldBubble = `.chat-bubble-assistant {
  background: rgba(30, 41, 59, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  border-radius: 14px 14px 14px 3px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
}`;

  const newBubble = `.chat-bubble-assistant {
  background: rgba(30, 41, 59, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  border-radius: 14px 14px 14px 3px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  max-height: 400px;
  overflow-y: auto;
}`;

  content = content.replace(oldBubble.replace(/\r?\n/g, eol), newBubble.replace(/\r?\n/g, eol));
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated styles in ${filePath}`);
});

// 3. Update js/agents.js and frontend/js/agents.js clearSession()
['js/agents.js', 'frontend/js/agents.js'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const isCrlf = content.includes('\r\n');
  const eol = isCrlf ? '\r\n' : '\n';

  const oldClearSession = `  clearSession() {
    this.activeSession = null;
    if (window.placifySupervisor?.progressTracker) {
      window.placifySupervisor.progressTracker.clearActiveUser();
    }
    try {
      localStorage.removeItem(this.sessionKey);
      sessionStorage.removeItem(this.sessionKey);
    } catch (err) {}
  }`;

  const newClearSession = `  clearSession() {
    this.activeSession = null;
    if (window.placifySupervisor?.progressTracker) {
      window.placifySupervisor.progressTracker.clearActiveUser();
    }
    try {
      localStorage.removeItem(this.sessionKey);
      sessionStorage.removeItem(this.sessionKey);
    } catch (err) {}
    if (typeof window.resetPlacifyChatbotSession === 'function') {
      try {
        window.resetPlacifyChatbotSession({ startFresh: false });
      } catch (e) {}
    }
  }`;

  const normOld = oldClearSession.replace(/\r?\n/g, eol);
  const normNew = newClearSession.replace(/\r?\n/g, eol);

  if (content.includes(normOld)) {
    content = content.replace(normOld, normNew);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated clearSession in ${filePath}`);
  } else {
    console.log(`clearSession pattern not found or already updated in ${filePath}`);
  }
});

// 4. Update js/app.js and frontend/js/app.js
['js/app.js', 'frontend/js/app.js'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const isCrlf = content.includes('\r\n');
  const eol = isCrlf ? '\r\n' : '\n';

  // Hook into logout button
  const oldLogout = `  // Logout Handler
  document.getElementById('logout-btn').addEventListener('click', () => {
    supervisor.authAgent.clearSession();`;

  const newLogout = `  // Logout Handler
  document.getElementById('logout-btn').addEventListener('click', () => {
    if (typeof window.resetPlacifyChatbotSession === 'function') {
      window.resetPlacifyChatbotSession({ startFresh: false });
    }
    supervisor.authAgent.clearSession();`;

  content = content.replace(oldLogout.replace(/\r?\n/g, eol), newLogout.replace(/\r?\n/g, eol));

  // Hook into loginForm submit
  const oldLoginSubmit = `      // 1. Authenticate credentials via AuthAgent against MongoDB Atlas
      const profile = await supervisor.authenticateUser(email, password);`;

  const newLoginSubmit = `      // 1. Authenticate credentials via AuthAgent against MongoDB Atlas
      const profile = await supervisor.authenticateUser(email, password);
      if (typeof window.resetPlacifyChatbotSession === 'function') {
        window.resetPlacifyChatbotSession({ startFresh: true, forUserId: profile.user_id });
      }`;

  content = content.replace(oldLoginSubmit.replace(/\r?\n/g, eol), newLoginSubmit.replace(/\r?\n/g, eol));

  // Hook into registerUser
  const oldRegSubmit = `      // 2. Establish active session and sync user state
      supervisor.authAgent.setActiveSession(profile);`;

  const newRegSubmit = `      // 2. Establish active session and sync user state
      supervisor.authAgent.setActiveSession(profile);
      if (typeof window.resetPlacifyChatbotSession === 'function') {
        window.resetPlacifyChatbotSession({ startFresh: true, forUserId: profile.user_id });
      }`;

  content = content.replace(oldRegSubmit.replace(/\r?\n/g, eol), newRegSubmit.replace(/\r?\n/g, eol));

  // Hook into unauthenticated branch in initializeApplicationSession
  const oldUnauth = `    // Unauthenticated -> Onboarding
    updateHeaderUserPill(null);`;

  const newUnauth = `    // Unauthenticated -> Onboarding
    if (typeof window.resetPlacifyChatbotSession === 'function') {
      window.resetPlacifyChatbotSession({ startFresh: false });
    }
    updateHeaderUserPill(null);`;

  content = content.replace(oldUnauth.replace(/\r?\n/g, eol), newUnauth.replace(/\r?\n/g, eol));

  // Hook into authenticated branch in initializeApplicationSession (restore or start fresh)
  const oldAuthHydrate = `    if (activeSession && activeSession.user_id) {
      updateHeaderUserPill(activeSession);`;

  const newAuthHydrate = `    if (activeSession && activeSession.user_id) {
      updateHeaderUserPill(activeSession);
      if (typeof window.loadPlacifyChatbotSession === 'function') {
        const restored = window.loadPlacifyChatbotSession(activeSession.user_id);
        if (!restored && typeof window.resetPlacifyChatbotSession === 'function') {
          window.resetPlacifyChatbotSession({ startFresh: true, forUserId: activeSession.user_id });
        }
      }`;

  content = content.replace(oldAuthHydrate.replace(/\r?\n/g, eol), newAuthHydrate.replace(/\r?\n/g, eol));

  // Now replace the Chatbot controller section in app.js
  const startSectionMarker = '// VIEW 14: GLOBAL FLOATING CONTEXT-AWARE CHATBOT ASSISTANT';
  const startIndex = content.indexOf(startSectionMarker);
  if (startIndex === -1) {
    console.error('Could not find Chatbot start marker in', filePath);
    return;
  }

  // End of file is after initGlobalChatbot(); \n });
  const endSectionMarker = 'initGlobalChatbot();\n});';
  const endSectionMarkerCrlf = 'initGlobalChatbot();\r\n});';
  let endIndex = content.indexOf(endSectionMarkerCrlf, startIndex);
  if (endIndex === -1) {
    endIndex = content.indexOf(endSectionMarker, startIndex);
  }

  if (endIndex === -1) {
    console.error('Could not find Chatbot end marker in', filePath);
    return;
  }

  const endReplace = endIndex + (content.includes('\r\n') ? endSectionMarkerCrlf.length : endSectionMarker.length);

  const updatedChatbotCode = `// VIEW 14: GLOBAL FLOATING CONTEXT-AWARE CHATBOT ASSISTANT
  // =========================================================================

  const CHATBOT_EXCLUDED_VIEWS = [
    'diagnosticQuiz',
    'conceptQuiz',
    'assessmentEvaluation',
    'assessmentReport'
  ];

  // Specific routes that represent actual quiz questions or active assessment evaluations/results
  const CHATBOT_EXCLUDED_PATHS = [
    '/diagnostic-quiz',
    '/quiz',
    '/concept-quiz',
    '/assessment-evaluation',
    '/evaluation',
    '/assessment-report',
    '/report'
  ];

  const CHATBOT_STORAGE_KEY_PREFIX = 'placify_chat_session_';
  const CHATBOT_ACTIVE_SESSION_KEY = 'placify_active_chat_session_id';

  const chatbotState = {
    isOpen: false,
    history: [],
    currentView: 'roadmap',
    isThinking: false,
    lastFailedMessage: null,
    sessionId: null,
    userId: null
  };

  function generateChatSessionId() {
    return 'cs_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }

  function getChatbotSessionStorageKey(userId) {
    const session = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
    const uid = userId || session?.user_id || 'guest';
    return \`\${CHATBOT_STORAGE_KEY_PREFIX}\${uid}\`;
  }

  function saveChatbotSession() {
    const session = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
    if (!session || !session.user_id) return;
    if (!chatbotState.sessionId) {
      chatbotState.sessionId = generateChatSessionId();
    }
    chatbotState.userId = session.user_id;

    const messagesContainer = document.getElementById('chatbot-messages-container');
    const messagesHtml = messagesContainer ? messagesContainer.innerHTML : '';

    const data = {
      sessionId: chatbotState.sessionId,
      userId: session.user_id,
      history: chatbotState.history,
      messagesHtml: messagesHtml,
      timestamp: Date.now()
    };

    try {
      sessionStorage.setItem(getChatbotSessionStorageKey(session.user_id), JSON.stringify(data));
      sessionStorage.setItem(CHATBOT_ACTIVE_SESSION_KEY, chatbotState.sessionId);
    } catch (e) {
      console.warn('[Chatbot Storage] Failed to persist session:', e);
    }
  }

  function loadChatbotSession(userId) {
    const session = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
    const currentUserId = userId || session?.user_id;
    if (!currentUserId) return false;

    try {
      const raw = sessionStorage.getItem(getChatbotSessionStorageKey(currentUserId));
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data || data.userId !== currentUserId || !data.sessionId) return false;

      chatbotState.sessionId = data.sessionId;
      chatbotState.userId = data.userId;
      chatbotState.history = Array.isArray(data.history) ? data.history : [];

      const messagesContainer = document.getElementById('chatbot-messages-container');
      if (messagesContainer && data.messagesHtml) {
        messagesContainer.innerHTML = data.messagesHtml;
        // Re-attach click listeners to chips if restored
        messagesContainer.querySelectorAll('.chatbot-chip').forEach(btn => {
          btn.addEventListener('click', () => {
            const query = btn.dataset.query;
            if (query) sendChatbotMessage(query);
          });
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
      return true;
    } catch (e) {
      console.warn('[Chatbot Storage] Failed to restore session:', e);
      return false;
    }
  }

  function resetChatbotSession({ startFresh = false, forUserId = null } = {}) {
    chatbotState.history = [];
    chatbotState.lastFailedMessage = null;
    chatbotState.isThinking = false;

    const session = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
    const effectiveUserId = forUserId || session?.user_id || null;

    if (startFresh) {
      chatbotState.sessionId = generateChatSessionId();
      chatbotState.userId = effectiveUserId;
    } else {
      chatbotState.sessionId = null;
      chatbotState.userId = null;
    }

    // Clear session-specific storage
    try {
      if (effectiveUserId) {
        sessionStorage.removeItem(\`\${CHATBOT_STORAGE_KEY_PREFIX}\${effectiveUserId}\`);
      } else {
        // Clear all session chatbot keys on logout
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith(CHATBOT_STORAGE_KEY_PREFIX) || key === CHATBOT_ACTIVE_SESSION_KEY) {
            sessionStorage.removeItem(key);
          }
        });
      }
      sessionStorage.removeItem(CHATBOT_ACTIVE_SESSION_KEY);
    } catch (e) {}

    // Reset messages container to default friendly welcome message
    const messagesContainer = document.getElementById('chatbot-messages-container');
    if (messagesContainer) {
      messagesContainer.innerHTML = \`
        <div class="chat-message chat-message-assistant">
          <div class="chat-bubble chat-bubble-assistant">
            <p>Hi! I'm your <strong>Placify AI Assistant</strong>. Ask me anything about this page or your learning journey.</p>
          </div>
        </div>
        <div id="chatbot-chips-container" class="chatbot-chips"></div>
      \`;
      updateChatbotContextBadgeAndChips(chatbotState.currentView);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    const inputEl = document.getElementById('chatbot-input');
    if (inputEl) inputEl.value = '';

    const errorNotice = document.getElementById('chatbot-error-notice');
    if (errorNotice) errorNotice.style.display = 'none';

    const typingIndicator = document.getElementById('chatbot-typing-indicator');
    if (typingIndicator) typingIndicator.style.display = 'none';

    if (startFresh && chatbotState.userId) {
      saveChatbotSession();
    }
  }

  window.resetPlacifyChatbotSession = resetChatbotSession;
  window.loadPlacifyChatbotSession = loadChatbotSession;

  function formatChatbotMarkdown(text) {
    if (!text) return '';
    let html = String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks: \`\`\`lang ... \`\`\`
    html = html.replace(/\`\`\`(?:[a-zA-Z0-9_-]+)?\\n?([\\s\\S]*?)\`\`\`/g, (match, code) => {
      return \`<pre><code>\${code.trim()}</code></pre>\`;
    });

    // Inline code: \`code\`
    html = html.replace(/\`([^\`]+)\`/g, '<code>$1</code>');

    // Bold: **text**
    html = html.replace(/\\*\\*([^*]+)\\*\\*/g, '<strong>$1</strong>');

    // Italic: *text*
    html = html.replace(/(^|[^*])\\*([^*]+)\\*/g, '$1<em>$2</em>');

    // Bullet points: lines starting with - or *
    const lines = html.split('\\n');
    let inList = false;
    let processed = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (/^[-*]\\s+(.*)$/.test(trimmed)) {
        const itemContent = trimmed.replace(/^[-*]\\s+/, '');
        if (!inList) {
          processed.push('<ul>');
          inList = true;
        }
        processed.push(\`<li>\${itemContent}</li>\`);
      } else if (/^\\d+\\.\\s+(.*)$/.test(trimmed)) {
        const itemContent = trimmed.replace(/^\\d+\\.\\s+/, '');
        if (!inList) {
          processed.push('<ol>');
          inList = true;
        }
        processed.push(\`<li>\${itemContent}</li>\`);
      } else {
        if (inList) {
          processed.push('</ul>');
          inList = false;
        }
        if (trimmed.length > 0 && !trimmed.startsWith('<pre') && !trimmed.startsWith('</pre')) {
          processed.push(\`<p>\${line}</p>\`);
        } else {
          processed.push(line);
        }
      }
    });
    if (inList) processed.push('</ul>');

    return processed.join('\\n');
  }

  function getChatbotCurrentContext() {
    const session = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
    const view = chatbotState.currentView || 'roadmap';

    let pageTitle = 'Placify Application';
    let domain = (session && session.chosen_domain) || 'Full-Stack Web Development';
    let details = {};

    if (view === 'domainSelection') {
      pageTitle = 'Choose Your Learning Domain';
      const domainsList = (window.PLACIFY_DATA && window.PLACIFY_DATA.domains) ? window.PLACIFY_DATA.domains : [];
      let selectedDomName = null;
      if (typeof selectedDomainId !== 'undefined' && selectedDomainId) {
        const found = domainsList.find(d => d.id === selectedDomainId);
        if (found) selectedDomName = found.name;
      }
      details = {
        phase: 'Domain Selection (Post-Registration)',
        availableDomains: domainsList.map(d => d.name),
        currentlySelectedDomain: selectedDomName || 'None selected yet'
      };
    } else if (view === 'diagnostic') {
      pageTitle = 'Phase 2: Domain Proficiency Baseline & Assessment Setup';
      const domainHeader = document.getElementById('diagnostic-domain-name-header')?.textContent?.trim() ||
                           document.getElementById('manual-domain-title')?.textContent?.trim();
      if (domainHeader && !domainHeader.includes('Chosen Domain')) {
        domain = domainHeader;
      } else if (typeof currentDiagnosticDomainObj !== 'undefined' && currentDiagnosticDomainObj && (currentDiagnosticDomainObj.name || currentDiagnosticDomainObj.title)) {
        domain = currentDiagnosticDomainObj.name || currentDiagnosticDomainObj.title;
      }

      const currentLevel = (typeof selectedSelfLevel !== 'undefined' && selectedSelfLevel) ? selectedSelfLevel : 'BEGINNER';

      // Read visible syllabus topics rendered in Phase 2
      let syllabusTopics = [];
      const syllabusEls = document.querySelectorAll('#roadmap-syllabus-list span');
      if (syllabusEls && syllabusEls.length > 0) {
        syllabusTopics = Array.from(syllabusEls).map(el => el.textContent.trim()).filter(Boolean);
      } else if (typeof window.getDomainSyllabus === 'function') {
        const domainIdToUse = (typeof currentDiagnosticDomainObj !== 'undefined' && currentDiagnosticDomainObj ? currentDiagnosticDomainObj.id : (typeof selectedDomainId !== 'undefined' ? selectedDomainId : 'fullstack'));
        const cleanDom = String(domainIdToUse).replace(/^(domain-|webdev-)/, '');
        syllabusTopics = window.getDomainSyllabus(cleanDom, currentLevel) || [];
      }

      details = {
        phase: 'Phase 2: Domain Proficiency Baseline & Assessment Setup',
        selectedProficiencyLevel: currentLevel,
        availableProficiencyLevels: [
          'BEGINNER: Novice / Foundational — Building core principles from scratch with foundational guidance',
          'INTERMEDIATE: Practical Practitioner — Familiar with syntax & concepts, ready for applied projects and framework integration',
          'ADVANCED: Experienced Developer — High technical proficiency, focusing on architecture, system design & optimization'
        ],
        syllabusTopics: syllabusTopics.slice(0, 15),
        syllabusTopicCount: syllabusTopics.length
      };
    } else if (view === 'roadmap') {
      pageTitle = 'Personalized Learning Roadmap';
      const roadmap = window.roadmapState?.roadmap;
      if (roadmap && roadmap.monthly_roadmap && roadmap.monthly_roadmap[0]) {
        details.phaseTitle = roadmap.monthly_roadmap[0].month_title || roadmap.monthly_roadmap[0].theme || 'Phase 1 Foundations';
      }
      details.domain = roadmap?.domainName || domain;
    } else if (view === 'dailyHub') {
      pageTitle = 'Daily Learning Hub';
      const dayTasks = window.currentDayTasks || [];
      details.focusTopic = document.getElementById('daily-focus-topic-text')?.textContent?.trim() || 'Core Principles & Implementation';
      if (Array.isArray(dayTasks) && dayTasks.length > 0) {
        details.tasks = dayTasks.map(t => t.taskTitle || t.title).filter(Boolean);
      }
    } else if (view === 'interviewQuestions') {
      pageTitle = 'Interview Questions and Answers';
      domain = document.getElementById('interview-qa-detected-domain')?.textContent?.trim() || domain;
      const firstQ = document.querySelector('.interview-qa-card .interview-qa-question-text')?.textContent?.trim();
      if (firstQ) details.question = firstQ;
    } else if (view === 'internships') {
      pageTitle = 'Internship Opportunities';
      details.internshipCount = document.querySelectorAll('.internship-card')?.length || 0;
      details.role = document.getElementById('internship-search-input')?.value || 'Software Engineer Intern';
    } else if (view === 'myApplications') {
      pageTitle = 'My Applications Tracking';
      const totalNum = document.getElementById('ats-hero-total-num')?.textContent?.trim() || '0';
      details.applicationsTotal = parseInt(totalNum, 10) || 0;
    } else if (view === 'progressAnalytics') {
      pageTitle = 'Progress & Skill Analytics';
      const userState = supervisor.progressTracker?.getUserState(session?.user_id);
      details.analytics = {
        level: userState?.level || 1,
        xp: userState?.xp || 0,
        streak: userState?.streak || 0
      };
    } else if (view === 'techNews') {
      pageTitle = 'Personalized Tech News';
    }

    return {
      view,
      route: window.location.pathname || \`/\${view}\`,
      pageTitle,
      domain,
      details
    };
  }

  function getChatbotContextChips(viewKey) {
    switch (viewKey) {
      case 'domainSelection':
        return [
          'Which domain has the highest placement demand?',
          'Help me choose between Full-Stack and Data Science.',
          'Which tech domain is best for beginners?',
          'What skills does Cloud & DevOps require?'
        ];
      case 'diagnostic':
        return [
          'Explain the syllabus for my level.',
          'Differences between Beginner, Intermediate & Advanced?',
          'Which proficiency level should I pick?',
          'How does this shape my roadmap?'
        ];
      case 'roadmap':
        return [
          'Explain my roadmap.',
          'What should I learn next?',
          'Why is this topic important?'
        ];
      case 'dailyHub':
        return [
          "Explain today's task.",
          'How should I complete this task?',
          'Suggest resources for this topic.'
        ];
      case 'interviewQuestions':
        return [
          'Explain this interview question.',
          'Give me another example.',
          'What concepts should I revise?'
        ];
      case 'internships':
        return [
          "Explain this internship's requirements.",
          'How should I prepare for this role?',
          'Tips to make my application stand out.'
        ];
      case 'myApplications':
        return [
          'What is the status of my application?',
          'Help me prepare for this opportunity.',
          'Next steps after applying.'
        ];
      case 'progressAnalytics':
        return [
          'Explain my progress.',
          'Which topics should I revise?',
          'How can I improve my streak and level?'
        ];
      case 'techNews':
        return [
          'Summarize top tech news.',
          'How do these industry trends impact my domain?'
        ];
      default:
        return [
          'Explain my learning path.',
          'How does Placify AI help me prepare?'
        ];
    }
  }

  function updateChatbotContextBadgeAndChips(viewKey) {
    const badge = document.getElementById('chatbot-context-badge');
    const chipsContainer = document.getElementById('chatbot-chips-container');
    if (!badge || !chipsContainer) return;

    const titles = {
      domainSelection: 'Domain Advisor',
      diagnostic: 'Proficiency & Syllabus Guide',
      roadmap: 'Roadmap Mentor',
      dailyHub: 'Daily Hub Guide',
      interviewQuestions: 'Interview Coach',
      internships: 'Career Advisor',
      myApplications: 'Applications Tracker',
      progressAnalytics: 'Skill Analytics',
      techNews: 'Tech News'
    };

    badge.textContent = titles[viewKey] || 'Placement Assistant';

    const chips = getChatbotContextChips(viewKey);
    chipsContainer.innerHTML = chips.map(chip => \`
      <button type="button" class="chatbot-chip" data-query="\${chip.replace(/"/g, '&quot;')}">
        \${chip}
      </button>
    \`).join('');

    chipsContainer.querySelectorAll('.chatbot-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.dataset.query;
        if (query) sendChatbotMessage(query);
      });
    });
  }

  function updateChatbotVisibilityAndContext(viewKey) {
    const widget = document.getElementById('placify-chatbot-widget');
    if (!widget) return;

    const path = (window.location.pathname || '').toLowerCase();

    // Specifically allow the Phase 2 setup page (view 'diagnostic' and route '/diagnostic')
    const isPhase2Setup = viewKey === 'diagnostic' || path === '/diagnostic';

    const isExcludedView = CHATBOT_EXCLUDED_VIEWS.includes(viewKey);
    const isExcludedPath = CHATBOT_EXCLUDED_PATHS.some(p => path === p || path.startsWith(p + '/'));

    const shouldHide = !isPhase2Setup && (isExcludedView || isExcludedPath);

    if (shouldHide) {
      widget.style.display = 'none';
      const panel = document.getElementById('placify-chatbot-panel');
      const trigger = document.getElementById('placify-chatbot-trigger');
      if (panel) panel.style.display = 'none';
      if (trigger) trigger.classList.remove('open');
      chatbotState.isOpen = false;
      return;
    }

    widget.style.display = 'block';
    chatbotState.currentView = viewKey;
    updateChatbotContextBadgeAndChips(viewKey);
  }

  window.updateChatbotVisibilityAndContext = updateChatbotVisibilityAndContext;

  async function sendChatbotMessage(messageText) {
    const text = (messageText || '').trim();
    if (!text || chatbotState.isThinking) return;

    const messagesContainer = document.getElementById('chatbot-messages-container');
    const inputEl = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send-btn');
    const typingIndicator = document.getElementById('chatbot-typing-indicator');
    const errorNotice = document.getElementById('chatbot-error-notice');

    chatbotState.lastFailedMessage = text;
    chatbotState.isThinking = true;

    if (inputEl) inputEl.value = '';
    if (sendBtn) sendBtn.disabled = true;
    if (errorNotice) errorNotice.style.display = 'none';

    // Ensure session ID is initialized
    if (!chatbotState.sessionId) {
      chatbotState.sessionId = generateChatSessionId();
    }

    // Append user message bubble
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'chat-message chat-message-user';
    userMsgDiv.innerHTML = \`<div class="chat-bubble chat-bubble-user"><p>\${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p></div>\`;
    messagesContainer.appendChild(userMsgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    chatbotState.history.push({ role: 'user', content: text });
    saveChatbotSession();

    // Show typing indicator
    if (typingIndicator) typingIndicator.style.display = 'flex';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const session = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
    const context = getChatbotCurrentContext();

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatbotState.history.slice(-6),
          context,
          userId: session?.user_id,
          sessionId: chatbotState.sessionId
        })
      });

      const data = await response.json();
      if (typingIndicator) typingIndicator.style.display = 'none';

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'AI Assistant service unavailable.');
      }

      const replyHtml = formatChatbotMarkdown(data.reply);
      const assistantMsgDiv = document.createElement('div');
      assistantMsgDiv.className = 'chat-message chat-message-assistant';
      assistantMsgDiv.innerHTML = \`<div class="chat-bubble chat-bubble-assistant">\${replyHtml}</div>\`;
      messagesContainer.appendChild(assistantMsgDiv);

      chatbotState.history.push({ role: 'assistant', content: data.reply });
      chatbotState.lastFailedMessage = null;
      saveChatbotSession();

    } catch (err) {
      console.error('[Chatbot Error]', err);
      if (typingIndicator) typingIndicator.style.display = 'none';
      if (errorNotice) {
        errorNotice.style.display = 'flex';
        const errTextEl = document.getElementById('chatbot-error-text');
        if (errTextEl) errTextEl.textContent = err.message || 'Failed to connect. Please retry.';
      }
    } finally {
      chatbotState.isThinking = false;
      if (sendBtn) sendBtn.disabled = false;
      if (inputEl) inputEl.focus();
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  function initGlobalChatbot() {
    const trigger = document.getElementById('placify-chatbot-trigger');
    const panel = document.getElementById('placify-chatbot-panel');
    const closeBtn = document.getElementById('chatbot-close-btn');
    const clearBtn = document.getElementById('chatbot-clear-btn');
    const newChatBtn = document.getElementById('chatbot-new-chat-btn');
    const sendBtn = document.getElementById('chatbot-send-btn');
    const inputEl = document.getElementById('chatbot-input');
    const retryBtn = document.getElementById('chatbot-retry-btn');
    const messagesContainer = document.getElementById('chatbot-messages-container');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      chatbotState.isOpen = !chatbotState.isOpen;
      if (chatbotState.isOpen) {
        panel.style.display = 'flex';
        trigger.classList.add('open');
        if (inputEl) setTimeout(() => inputEl.focus(), 150);
        if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
      } else {
        panel.style.display = 'none';
        trigger.classList.remove('open');
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        panel.style.display = 'none';
        trigger.classList.remove('open');
        chatbotState.isOpen = false;
      });
    }

    const handleNewChat = () => {
      const session = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
      resetChatbotSession({ startFresh: true, forUserId: session?.user_id });
      if (inputEl) inputEl.focus();
    };

    if (newChatBtn) {
      newChatBtn.addEventListener('click', handleNewChat);
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', handleNewChat);
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        if (inputEl) sendChatbotMessage(inputEl.value);
      });
    }

    if (inputEl) {
      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendChatbotMessage(inputEl.value);
        }
      });
    }

    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        if (chatbotState.lastFailedMessage) {
          sendChatbotMessage(chatbotState.lastFailedMessage);
        }
      });
    }

    // Try to load any existing session for the active user if logged in
    const activeSession = supervisor.authAgent ? supervisor.authAgent.getActiveSession() : null;
    if (activeSession && activeSession.user_id) {
      const restored = loadChatbotSession(activeSession.user_id);
      if (!restored) {
        resetChatbotSession({ startFresh: true, forUserId: activeSession.user_id });
      }
    }

    // Set initial context and chips
    const initialView = getRequestedViewFromUrl();
    updateChatbotVisibilityAndContext(initialView);
  }

  initGlobalChatbot();
});`;

  const formattedSection = isCrlf ? updatedChatbotCode.replace(/\r?\n/g, '\r\n') : updatedChatbotCode.replace(/\r?\n/g, '\n');
  content = content.slice(0, startIndex) + formattedSection;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated chatbot section in ${filePath}`);
});

console.log('--- Chatbot Enhancements Finished ---');
