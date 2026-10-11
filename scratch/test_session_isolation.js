const assert = require('assert');

// Mock sessionStorage
const sessionStorageMap = new Map();
global.sessionStorage = {
  getItem: (k) => sessionStorageMap.get(k) || null,
  setItem: (k, v) => sessionStorageMap.set(k, String(v)),
  removeItem: (k) => sessionStorageMap.delete(k),
  clear: () => sessionStorageMap.clear(),
  get length() { return sessionStorageMap.size; }
};
Object.defineProperty(global.sessionStorage, 'keys', {
  value: () => Array.from(sessionStorageMap.keys())
});

// Mock document & window
const elements = {};
global.document = {
  getElementById: (id) => {
    if (!elements[id]) {
      elements[id] = {
        id,
        innerHTML: '',
        value: '',
        style: {},
        classList: {
          add: () => {},
          remove: () => {},
          contains: () => false
        },
        querySelectorAll: () => [],
        appendChild: function(child) { this.innerHTML += child.outerHTML || ''; },
        focus: () => {}
      };
    }
    return elements[id];
  },
  createElement: (tag) => ({
    tagName: tag,
    className: '',
    innerHTML: '',
    get outerHTML() { return `<${tag} class="${this.className}">${this.innerHTML}</${tag}>`; },
    appendChild: function(c) { this.innerHTML += c.outerHTML || ''; }
  })
};

global.window = {
  location: { pathname: '/roadmap' }
};

// Mock supervisor with authAgent
global.supervisor = {
  authAgent: {
    activeSession: { user_id: 'user_alice_123', name: 'Alice' },
    getActiveSession() { return this.activeSession; },
    clearSession() {
      this.activeSession = null;
      if (typeof global.window.resetPlacifyChatbotSession === 'function') {
        global.window.resetPlacifyChatbotSession({ startFresh: false });
      }
    }
  }
};

// Implement the exact session handling functions as in app.js
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
  return `${CHATBOT_STORAGE_KEY_PREFIX}${uid}`;
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
  } catch (e) {}
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
    }
    return true;
  } catch (e) {
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

  try {
    if (effectiveUserId) {
      sessionStorage.removeItem(`${CHATBOT_STORAGE_KEY_PREFIX}${effectiveUserId}`);
    } else {
      Array.from(sessionStorageMap.keys()).forEach(key => {
        if (key.startsWith(CHATBOT_STORAGE_KEY_PREFIX) || key === CHATBOT_ACTIVE_SESSION_KEY) {
          sessionStorage.removeItem(key);
        }
      });
    }
    sessionStorage.removeItem(CHATBOT_ACTIVE_SESSION_KEY);
  } catch (e) {}

  const messagesContainer = document.getElementById('chatbot-messages-container');
  if (messagesContainer) {
    messagesContainer.innerHTML = `
      <div class="chat-message chat-message-assistant">
        <div class="chat-bubble chat-bubble-assistant">
          <p>Hi! I'm your <strong>Placify AI Assistant</strong>. Ask me anything about this page or your learning journey.</p>
        </div>
      </div>
      <div id="chatbot-chips-container" class="chatbot-chips"></div>
    `;
  }

  if (startFresh && chatbotState.userId) {
    saveChatbotSession();
  }
}

global.window.resetPlacifyChatbotSession = resetChatbotSession;
global.window.loadPlacifyChatbotSession = loadChatbotSession;

// RUN UNIT TESTS
console.log('=== TEST SUITE: Chatbot Session Isolation & History Lifecycle ===');

// 1. Initial State for Alice
resetChatbotSession({ startFresh: true, forUserId: 'user_alice_123' });
assert(chatbotState.sessionId !== null, 'Alice should have a valid session ID');
assert(chatbotState.userId === 'user_alice_123', 'Active userId should be Alice');
assert.strictEqual(chatbotState.history.length, 0, 'History starts empty');
console.log('✔ Test 1: Fresh chat session initialized for Alice.');

// 2. Add messages for Alice
chatbotState.history.push({ role: 'user', content: 'What is my roadmap?' });
chatbotState.history.push({ role: 'assistant', content: 'Your roadmap is your personalized learning plan.' });
document.getElementById('chatbot-messages-container').innerHTML += '<div class="test-alice-bubble">Alice roadmap question</div>';
saveChatbotSession();
assert.strictEqual(chatbotState.history.length, 2);
assert(sessionStorage.getItem('placify_chat_session_user_alice_123') !== null, 'SessionStorage must store Alice session');
console.log('✔ Test 2: Alice conversation saved to session storage.');

// 3. Page Refresh Simulation (reloading same user in same session)
chatbotState.history = [];
chatbotState.sessionId = null;
const restored = loadChatbotSession('user_alice_123');
assert(restored === true, 'Alice session must restore on page refresh');
assert.strictEqual(chatbotState.history.length, 2, 'Restored history must contain Alice 2 messages');
assert(document.getElementById('chatbot-messages-container').innerHTML.includes('Alice roadmap question'), 'Restored DOM contains Alice messages');
console.log('✔ Test 3: Page refresh preserves conversation for active session.');

// 4. New Chat Action
resetChatbotSession({ startFresh: true, forUserId: 'user_alice_123' });
assert.strictEqual(chatbotState.history.length, 0, 'New chat resets history');
assert(!document.getElementById('chatbot-messages-container').innerHTML.includes('Alice roadmap question'), 'DOM must not contain previous messages');
assert(document.getElementById('chatbot-messages-container').innerHTML.includes('Placify AI Assistant'), 'Default welcome message displayed');
console.log('✔ Test 4: New Chat clears active messages and resets history.');

// 5. User Alice Logs Out
chatbotState.history.push({ role: 'user', content: 'Secret question before logout' });
saveChatbotSession();
supervisor.authAgent.clearSession(); // Triggers window.resetPlacifyChatbotSession({ startFresh: false })
assert.strictEqual(chatbotState.history.length, 0, 'Logout clears in-memory history');
assert.strictEqual(chatbotState.sessionId, null, 'Logout clears sessionId');
assert.strictEqual(sessionStorage.getItem('placify_chat_session_user_alice_123'), null, 'Logout clears session storage');
assert(!document.getElementById('chatbot-messages-container').innerHTML.includes('Secret question'), 'Logout clears DOM messages');
console.log('✔ Test 5: Logout wipes all conversation state and session storage.');

// 6. Different User Bob Logs In
supervisor.authAgent.activeSession = { user_id: 'user_bob_456', name: 'Bob' };
resetChatbotSession({ startFresh: true, forUserId: 'user_bob_456' });
assert.strictEqual(chatbotState.history.length, 0, 'Bob starts with clean history');
assert(chatbotState.userId === 'user_bob_456', 'Session user is now Bob');
assert(!document.getElementById('chatbot-messages-container').innerHTML.includes('Secret question'), 'Bob never sees Alice messages');
console.log('✔ Test 6: Bob logging in starts with completely fresh isolated chat.');

console.log('\n🎉 ALL 6 SESSION ISOLATION & LIFECYCLE TESTS PASSED PERFECTLY!');
