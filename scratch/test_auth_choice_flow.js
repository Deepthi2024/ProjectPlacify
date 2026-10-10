const fs = require('fs');

// Simple DOM Mock for unit testing click event handlers
class MockElement {
  constructor(id, tagName = 'div') {
    this.id = id;
    this.tagName = tagName;
    this.style = {};
    this.classList = {
      classes: new Set(),
      add: (c) => this.classList.classes.add(c),
      remove: (c) => this.classList.classes.delete(c),
      contains: (c) => this.classList.classes.has(c)
    };
    this.listeners = {};
  }
  addEventListener(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }
  click() {
    if (this.listeners['click']) {
      this.listeners['click'].forEach(fn => fn({ preventDefault: () => {} }));
    }
  }
}

const elements = {};
['auth-choice-screen', 'auth-register-panel', 'auth-login-panel',
 'choice-signin-btn', 'choice-signup-btn', 'reg-back-btn', 'login-back-btn',
 'switch-to-login-link', 'switch-to-register-link', 'reset-app-btn'].forEach(id => {
  elements[id] = new MockElement(id);
});

// Setup handlers as written in js/app.js
const choiceScreen = elements['auth-choice-screen'];
const panelReg = elements['auth-register-panel'];
const panelLogin = elements['auth-login-panel'];

function showAuthChoiceScreen() {
  if (choiceScreen) choiceScreen.style.display = 'block';
  if (panelReg) { panelReg.style.display = 'none'; panelReg.classList.remove('active'); }
  if (panelLogin) { panelLogin.style.display = 'none'; panelLogin.classList.remove('active'); }
}

function showLoginPanel() {
  if (choiceScreen) choiceScreen.style.display = 'none';
  if (panelReg) { panelReg.style.display = 'none'; panelReg.classList.remove('active'); }
  if (panelLogin) { panelLogin.style.display = 'block'; panelLogin.classList.add('active'); }
}

function showRegisterPanel() {
  if (choiceScreen) choiceScreen.style.display = 'none';
  if (panelLogin) { panelLogin.style.display = 'none'; panelLogin.classList.remove('active'); }
  if (panelReg) { panelReg.style.display = 'block'; panelReg.classList.add('active'); }
}

elements['choice-signin-btn'].addEventListener('click', showLoginPanel);
elements['choice-signup-btn'].addEventListener('click', showRegisterPanel);
elements['reg-back-btn'].addEventListener('click', showAuthChoiceScreen);
elements['login-back-btn'].addEventListener('click', showAuthChoiceScreen);
elements['switch-to-login-link'].addEventListener('click', (e) => { e.preventDefault(); showLoginPanel(); });
elements['switch-to-register-link'].addEventListener('click', (e) => { e.preventDefault(); showRegisterPanel(); });

// Initial State: Hero choice screen visible
showAuthChoiceScreen();
console.log('Initial State:', {
  choiceScreen: choiceScreen.style.display,
  panelLogin: panelLogin.style.display,
  panelReg: panelReg.style.display
});

// Test 1: Click Sign In
elements['choice-signin-btn'].click();
console.log('After clicking Sign In:', {
  choiceScreen: choiceScreen.style.display,
  panelLogin: panelLogin.style.display,
  panelReg: panelReg.style.display
});
if (choiceScreen.style.display !== 'none' || panelLogin.style.display !== 'block') {
  throw new Error('Sign In click failed!');
}

// Test 2: Click Back to Options from Login
elements['login-back-btn'].click();
console.log('After clicking Back from Login:', {
  choiceScreen: choiceScreen.style.display,
  panelLogin: panelLogin.style.display,
  panelReg: panelReg.style.display
});
if (choiceScreen.style.display !== 'block' || panelLogin.style.display !== 'none') {
  throw new Error('Back from Login failed!');
}

// Test 3: Click Sign Up
elements['choice-signup-btn'].click();
console.log('After clicking Sign Up:', {
  choiceScreen: choiceScreen.style.display,
  panelLogin: panelLogin.style.display,
  panelReg: panelReg.style.display
});
if (choiceScreen.style.display !== 'none' || panelReg.style.display !== 'block') {
  throw new Error('Sign Up click failed!');
}

// Test 4: Click Back to Options from Register
elements['reg-back-btn'].click();
console.log('After clicking Back from Register:', {
  choiceScreen: choiceScreen.style.display,
  panelLogin: panelLogin.style.display,
  panelReg: panelReg.style.display
});
if (choiceScreen.style.display !== 'block' || panelReg.style.display !== 'none') {
  throw new Error('Back from Register failed!');
}

console.log('✅ ALL BUTTON FLOW TESTS PASSED SUCCESSFULLY!');
