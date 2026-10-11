/**
 * Placify AI — Frontend Configuration
 * Centralized API Base URL and Environment Settings
 */

(function () {
  'use strict';

  // Allow override from environment or script tag before load
  const existingConfig = window.PLACIFY_CONFIG || {};

  function resolveBackendBaseUrl() {
    // 1. Explicit override if set
    if (existingConfig.API_BASE_URL) {
      return existingConfig.API_BASE_URL.replace(/\/+$/, '');
    }

    // 2. Browser origin detection
    const hostname = window.location.hostname || 'localhost';
    const port = window.location.port || '';

    // If running standalone frontend (e.g., port 3000 or anything non-5000), default to backend at port 5000
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && port !== '5000') {
      return 'http://localhost:5000';
    }

    // 3. Unified server or production domain
    if (window.location.origin && window.location.origin !== 'null' && window.location.origin.startsWith('http')) {
      return window.location.origin.replace(/\/+$/, '');
    }

    // Default fallback
    return 'http://localhost:5000';
  }

  const API_BASE_URL = resolveBackendBaseUrl();

  window.PLACIFY_CONFIG = Object.assign({}, existingConfig, {
    API_BASE_URL: API_BASE_URL,
    APP_NAME: 'Placify AI',
    VERSION: '1.0.0'
  });

  window.PLACIFY_API_BASE_URL = API_BASE_URL;

  // Helper utility to build API URLs cleanly
  window.getPlacifyApiUrl = function (path) {
    if (!path) return API_BASE_URL;
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return `${API_BASE_URL}${cleanPath}`;
  };

  console.log(`[Placify Config] Initialized with API Base URL: ${API_BASE_URL}`);
})();
