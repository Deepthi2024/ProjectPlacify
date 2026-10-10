/**
 * Placify Authoritative Intelligent Resource Recommendation & Multi-Level Fallback Pipeline
 * 
 * Hierarchy:
 * - Level 1: Existing indexed video resources + verified chapter timestamps (Python RAG)
 * - Level 2: Targeted live resource discovery (Tavily search targeting MDN, GfG, W3Schools, official docs)
 * - Level 3: Trusted educational website fallback (Known valid, topic-specific article URLs)
 * - Level 4: Guaranteed useful final fallback catalog (Authoritative coverage for all 8 Placify domains)
 */

const https = require('https');
const http = require('http');
const url = require('url');

// In-Memory Search & Fallback Cache with 24-hour TTL
const resourceCache = new Map();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function getCacheKey(domain, topic, subtopic, level) {
  const clean = (s) => String(s || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `${clean(domain)}:${clean(topic)}:${clean(subtopic)}:${clean(level)}`;
}

// ============================================================================
// LEVEL 3: TRUSTED EDUCATIONAL WEBSITE CATALOG (Verified topic-specific links)
// ============================================================================
const TRUSTED_TOPIC_RESOURCES = {
  // DOM Selection & Event Handling
  'dom': [
    {
      title: 'Introduction to the DOM - Web APIs | MDN',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction',
      platform: 'MDN Web Docs',
      resource_type: 'DOCUMENTATION',
      description: 'Comprehensive guide to the Document Object Model (DOM) structure, nodes, and tree hierarchy.',
      estimated_minutes: 25,
      category_label: 'PRIMARY',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'Document: querySelector() & querySelectorAll() | MDN',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector',
      platform: 'MDN Web Docs',
      resource_type: 'DOCUMENTATION',
      description: 'Master element selection using modern CSS selectors, single element queries, and NodeLists.',
      estimated_minutes: 20,
      category_label: 'ALTERNATIVE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'EventTarget: addEventListener() method | MDN',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener',
      platform: 'MDN Web Docs',
      resource_type: 'DOCUMENTATION',
      description: 'Learn event registration, event listener options, event objects, and proper cleanup.',
      estimated_minutes: 25,
      category_label: 'ALTERNATIVE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'Event Bubbling and Event Delegation | MDN',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling',
      platform: 'MDN Web Docs',
      resource_type: 'TUTORIAL',
      description: 'In-depth explanation of event propagation phases: capturing, bubbling, and memory-efficient delegation patterns.',
      estimated_minutes: 30,
      category_label: 'PRACTICE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'DOM Manipulation & Event Handling | GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/dom-document-object-model/',
      platform: 'GeeksforGeeks',
      resource_type: 'ARTICLE',
      description: 'Placement practice problems, code examples, and interview questions on JavaScript DOM manipulation.',
      estimated_minutes: 30,
      category_label: 'PRACTICE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    }
  ],

  // JavaScript Async, Promises & Fetch
  'async': [
    {
      title: 'Using Promises in JavaScript | MDN',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises',
      platform: 'MDN Web Docs',
      resource_type: 'DOCUMENTATION',
      description: 'Chaining promises, error handling with catch, and avoiding common callback hell pitfalls.',
      estimated_minutes: 25,
      category_label: 'PRIMARY',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'async function & await expression | MDN',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
      platform: 'MDN Web Docs',
      resource_type: 'DOCUMENTATION',
      description: 'Writing synchronous-looking asynchronous code with modern ES2017 async/await and try/catch.',
      estimated_minutes: 20,
      category_label: 'ALTERNATIVE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'Fetch API Guide & HTTP Requests | MDN',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch',
      platform: 'MDN Web Docs',
      resource_type: 'DOCUMENTATION',
      description: 'Sending GET, POST, PUT, DELETE requests, handling JSON payloads, and network error resilience.',
      estimated_minutes: 25,
      category_label: 'PRACTICE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    }
  ],

  // React Components & Hooks
  'react': [
    {
      title: 'Describing the UI: Components & Props | React Docs',
      url: 'https://react.dev/learn/describing-the-ui',
      platform: 'React Official Documentation',
      resource_type: 'DOCUMENTATION',
      description: 'Official guide to functional components, JSX syntax rules, and passing data via props.',
      estimated_minutes: 25,
      category_label: 'PRIMARY',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'useState: State: A Component\'s Memory | React Docs',
      url: 'https://react.dev/reference/react/useState',
      platform: 'React Official Documentation',
      resource_type: 'DOCUMENTATION',
      description: 'Managing local component state, state setters, and immutability rules in React.',
      estimated_minutes: 25,
      category_label: 'ALTERNATIVE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'useEffect: Synchronizing with Effects | React Docs',
      url: 'https://react.dev/reference/react/useEffect',
      platform: 'React Official Documentation',
      resource_type: 'DOCUMENTATION',
      description: 'Handling side effects, dependency arrays, subscriptions, and cleanup functions in modern React.',
      estimated_minutes: 30,
      category_label: 'PRACTICE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    }
  ],

  // Node.js & Express
  'node': [
    {
      title: 'Introduction to Node.js & Architecture | Node.js Docs',
      url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs',
      platform: 'Node.js Official Documentation',
      resource_type: 'DOCUMENTATION',
      description: 'Understanding the V8 engine, single-threaded event loop, and asynchronous I/O fundamentals.',
      estimated_minutes: 25,
      category_label: 'PRIMARY',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'Express Routing & Middleware Architecture | Express Docs',
      url: 'https://expressjs.com/en/guide/routing.html',
      platform: 'Express.js Official Documentation',
      resource_type: 'DOCUMENTATION',
      description: 'Defining RESTful endpoints, route parameters, handler chaining, and application middleware.',
      estimated_minutes: 30,
      category_label: 'ALTERNATIVE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'Building RESTful APIs with Node.js & Express | GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/rest-api-introduction/',
      platform: 'GeeksforGeeks',
      resource_type: 'ARTICLE',
      description: 'Step-by-step implementation guide with HTTP status codes and JSON response structure.',
      estimated_minutes: 30,
      category_label: 'PRACTICE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    }
  ],

  // SQL & Relational Databases
  'sql': [
    {
      title: 'SQL Tutorial & Relational Database Queries | W3Schools',
      url: 'https://www.w3schools.com/sql/default.asp',
      platform: 'W3Schools',
      resource_type: 'TUTORIAL',
      description: 'Structured SQL guide covering SELECT, WHERE, GROUP BY, HAVING, and aggregate calculations.',
      estimated_minutes: 25,
      category_label: 'PRIMARY',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'SQL JOINs: INNER, LEFT, RIGHT, and FULL OUTER | GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/sql-join-set-1-inner-left-right-and-full-joins/',
      platform: 'GeeksforGeeks',
      resource_type: 'ARTICLE',
      description: 'Visual breakdowns and placement query drills for table joins and relational schema relationships.',
      estimated_minutes: 30,
      category_label: 'ALTERNATIVE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'PostgreSQL Tutorial & Query Optimization | PostgreSQL Docs',
      url: 'https://www.postgresql.org/docs/current/tutorial.html',
      platform: 'PostgreSQL Official Documentation',
      resource_type: 'DOCUMENTATION',
      description: 'Official PostgreSQL tutorial covering table creation, foreign keys, and transaction guarantees.',
      estimated_minutes: 35,
      category_label: 'PRACTICE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    }
  ]
};

// ============================================================================
// LEVEL 4: GUARANTEED USEFUL FINAL FALLBACK CATALOG (All 8 Placify Domains)
// ============================================================================
const DOMAIN_CATALOG = {
  fullstack: [
    {
      title: 'Full Stack Web Development Roadmap & Core Guides | MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development',
      platform: 'MDN Web Docs',
      resource_type: 'DOCUMENTATION',
      description: 'Authoritative placement guide covering HTML, CSS, JavaScript, Web APIs, and client-server architecture.',
      estimated_minutes: 30,
      category_label: 'PRIMARY',
      verificationStatus: 'CURATED_FALLBACK',
      isFallback: true
    },
    {
      title: 'JavaScript In-Depth Technical Reference | MDN',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference',
      platform: 'MDN Web Docs',
      resource_type: 'DOCUMENTATION',
      description: 'Complete technical reference for language syntax, built-in standard objects, prototypes, and closures.',
      estimated_minutes: 25,
      category_label: 'ALTERNATIVE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'Full Stack Placement Interview Questions & Exercises | GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/web-development/',
      platform: 'GeeksforGeeks',
      resource_type: 'ARTICLE',
      description: 'Hands-on placement challenges, coding interview questions, and architectural design patterns.',
      estimated_minutes: 30,
      category_label: 'PRACTICE',
      verificationStatus: 'CURATED_FALLBACK',
      isFallback: true
    }
  ],

  frontend: [
    {
      title: 'Frontend Web Development Learning Pathways | MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core',
      platform: 'MDN Web Docs',
      resource_type: 'DOCUMENTATION',
      description: 'Core frontend foundations: semantic markup, accessible interfaces, CSS layouts, and modern ECMAScript.',
      estimated_minutes: 30,
      category_label: 'PRIMARY',
      verificationStatus: 'CURATED_FALLBACK',
      isFallback: true
    },
    {
      title: 'CSS Layouts: Flexbox & Grid Masterclass | MDN',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout',
      platform: 'MDN Web Docs',
      resource_type: 'DOCUMENTATION',
      description: 'Building responsive, accessible web layouts with CSS Grid, Flexbox, and media queries.',
      estimated_minutes: 25,
      category_label: 'ALTERNATIVE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'React Documentation & Interactive Architecture | React.dev',
      url: 'https://react.dev/learn',
      platform: 'React Official Documentation',
      resource_type: 'DOCUMENTATION',
      description: 'Official interactive tutorial to learn modern component composition and state management.',
      estimated_minutes: 35,
      category_label: 'PRACTICE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    }
  ],

  backend: [
    {
      title: 'Node.js Server Architecture & Core API | Node.js Docs',
      url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs',
      platform: 'Node.js Official Documentation',
      resource_type: 'DOCUMENTATION',
      description: 'Server runtime internals, buffers, streams, asynchronous file handling, and HTTP module implementation.',
      estimated_minutes: 30,
      category_label: 'PRIMARY',
      verificationStatus: 'CURATED_FALLBACK',
      isFallback: true
    },
    {
      title: 'Express.js Framework Guide & Middleware Pipeline | Expressjs.com',
      url: 'https://expressjs.com/en/guide/writing-middleware.html',
      platform: 'Express.js Official Documentation',
      resource_type: 'DOCUMENTATION',
      description: 'Architecting modular middleware chains, request authentication, and error-handling pipelines.',
      estimated_minutes: 25,
      category_label: 'ALTERNATIVE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'Backend Engineering & API Design Patterns | GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/backend-development/',
      platform: 'GeeksforGeeks',
      resource_type: 'ARTICLE',
      description: 'Database normalization, caching strategies, and secure session management for placement interviews.',
      estimated_minutes: 35,
      category_label: 'PRACTICE',
      verificationStatus: 'CURATED_FALLBACK',
      isFallback: true
    }
  ],

  datascience: [
    {
      title: 'Python Official Tutorial & Data Model | Python.org',
      url: 'https://docs.python.org/3/tutorial/',
      platform: 'Python Official Documentation',
      resource_type: 'DOCUMENTATION',
      description: 'Python syntax foundations, data structures (lists, tuples, dicts), comprehension, and OOP concepts.',
      estimated_minutes: 30,
      category_label: 'PRIMARY',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'NumPy Quickstart & Tensor Operations | NumPy Docs',
      url: 'https://numpy.org/doc/stable/user/quickstart.html',
      platform: 'NumPy Official Documentation',
      resource_type: 'DOCUMENTATION',
      description: 'N-dimensional arrays, matrix vectorization, broadcasting, and numerical calculations.',
      estimated_minutes: 25,
      category_label: 'ALTERNATIVE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'Pandas Data Analysis & DataFrame Wrangling | Pandas Docs',
      url: 'https://pandas.pydata.org/docs/user_guide/10min.html',
      platform: 'Pandas Official Documentation',
      resource_type: 'DOCUMENTATION',
      description: '10-minute guide to indexing, slicing, filtering, grouping, and aggregating data series and tables.',
      estimated_minutes: 35,
      category_label: 'PRACTICE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    }
  ],

  dsa: [
    {
      title: 'Data Structures & Algorithms Complete Guide | GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/data-structures/',
      platform: 'GeeksforGeeks',
      resource_type: 'ARTICLE',
      description: 'Core linear and non-linear data structures: Arrays, Linked Lists, Stacks, Queues, Trees, and Graphs.',
      estimated_minutes: 30,
      category_label: 'PRIMARY',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'Algorithm Design & Complexity Analysis | GeeksforGeeks',
      url: 'https://www.geeksforgeeks.org/fundamentals-of-algorithms/',
      platform: 'GeeksforGeeks',
      resource_type: 'ARTICLE',
      description: 'Big-O notation, asymptotic upper bounds, divide-and-conquer, greedy techniques, and dynamic programming.',
      estimated_minutes: 30,
      category_label: 'ALTERNATIVE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'C++ Standard Template Library (STL) Reference | CppReference',
      url: 'https://en.cppreference.com/w/cpp/container',
      platform: 'CppReference',
      resource_type: 'DOCUMENTATION',
      description: 'Standard containers: vector, list, deque, set, map, priority_queue, and time complexity specs.',
      estimated_minutes: 25,
      category_label: 'PRACTICE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    }
  ],

  devops: [
    {
      title: 'Docker Architecture & Container Fundamentals | Docker Docs',
      url: 'https://docs.docker.com/get-started/',
      platform: 'Docker Official Documentation',
      resource_type: 'DOCUMENTATION',
      description: 'Container lifecycle, Dockerfile authoring, multi-stage builds, and volume storage management.',
      estimated_minutes: 30,
      category_label: 'PRIMARY',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'GitHub Actions Continuous Integration Quickstart | GitHub Docs',
      url: 'https://docs.github.com/en/actions/writing-workflows/quickstart',
      platform: 'GitHub Docs',
      resource_type: 'DOCUMENTATION',
      description: 'Configuring CI/CD YAML workflows, job runners, secrets management, and automated test triggers.',
      estimated_minutes: 25,
      category_label: 'ALTERNATIVE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'Kubernetes Core Concepts & Orchestration | Kubernetes Docs',
      url: 'https://kubernetes.io/docs/concepts/',
      platform: 'Kubernetes Official Documentation',
      resource_type: 'DOCUMENTATION',
      description: 'Pods, ReplicaSets, Deployments, Services, and Ingress controllers for scalable production deployments.',
      estimated_minutes: 35,
      category_label: 'PRACTICE',
      verificationStatus: 'CURATED_FALLBACK',
      isFallback: true
    }
  ],

  cybersecurity: [
    {
      title: 'OWASP Top 10 Web Application Vulnerabilities | OWASP Foundation',
      url: 'https://owasp.org/www-project-top-ten/',
      platform: 'OWASP Foundation',
      resource_type: 'DOCUMENTATION',
      description: 'The standard security awareness guide for web developers covering Injection, Broken Auth, and XSS.',
      estimated_minutes: 35,
      category_label: 'PRIMARY',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'Web Security Academy Learning Pathways | PortSwigger',
      url: 'https://portswigger.net/web-security',
      platform: 'PortSwigger Web Security',
      resource_type: 'TUTORIAL',
      description: 'Hands-on interactive labs explaining CSRF, SQL Injection, SSRF, and authentication vulnerabilities.',
      estimated_minutes: 30,
      category_label: 'ALTERNATIVE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'Cryptography & HTTPS Security Standards | MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/docs/Web/Security',
      platform: 'MDN Web Docs',
      resource_type: 'DOCUMENTATION',
      description: 'Transport layer security, Content Security Policy (CSP), CORS headers, and secure cookie storage.',
      estimated_minutes: 25,
      category_label: 'PRACTICE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    }
  ],

  ai_llm: [
    {
      title: 'Scikit-Learn Machine Learning Foundations | Scikit-Learn Docs',
      url: 'https://scikit-learn.org/stable/getting_started.html',
      platform: 'Scikit-Learn Official Documentation',
      resource_type: 'DOCUMENTATION',
      description: 'Model fitting, prediction, cross-validation pipelines, and feature preprocessing in Python.',
      estimated_minutes: 30,
      category_label: 'PRIMARY',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'PyTorch Deep Learning & Tensor Operations | PyTorch Tutorials',
      url: 'https://pytorch.org/tutorials/beginner/basics/intro.html',
      platform: 'PyTorch Official Documentation',
      resource_type: 'TUTORIAL',
      description: 'Tensors, Autograd backpropagation, neural network architectures, and training loops.',
      estimated_minutes: 35,
      category_label: 'ALTERNATIVE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    },
    {
      title: 'Google Machine Learning Crash Course | Google Developers',
      url: 'https://developers.google.com/machine-learning/crash-course',
      platform: 'Google Developers',
      resource_type: 'COURSE',
      description: 'Interactive introduction to ML theory, gradient descent, classification metrics, and embeddings.',
      estimated_minutes: 40,
      category_label: 'PRACTICE',
      verificationStatus: 'CURATED_VERIFIED',
      isFallback: true
    }
  ]
};

// ============================================================================
// URL SANITIZER & VALIDATOR
// ============================================================================

function validateAndSanitizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) return null;
  try {
    const u = new URL(trimmed);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    const pathParts = u.pathname.split('/').filter(Boolean);
    if (pathParts.length === 0 || (pathParts.length === 1 && pathParts[0] === 'en-US')) {
      return null; // Reject generic homepage without article path
    }
    return u.toString();
  } catch (e) {
    return null;
  }
}

// ============================================================================
// LEVEL 2: TARGETED LIVE TAVILY DISCOVERY
// ============================================================================

/**
 * Searches the web via Tavily API with targeted educational domain priorities.
 * Never fabricates URLs. Validates article structure.
 */
async function searchTavilyLive(taskTitle, topic, subtopic, domain, userLevel) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    return [];
  }

  // Construct topic-appropriate target query
  let sitePriority = 'MDN GeeksforGeeks W3Schools';
  const dClean = String(domain || '').toLowerCase();
  const tClean = String(topic || '').toLowerCase();

  if (dClean.includes('dsa') || tClean.includes('c++') || tClean.includes('algorithm')) {
    sitePriority = 'GeeksforGeeks CppReference';
  } else if (dClean.includes('data') || tClean.includes('python')) {
    sitePriority = 'python.org realpython geeksforgeeks';
  } else if (tClean.includes('react')) {
    sitePriority = 'react.dev geeksforgeeks';
  } else if (tClean.includes('node') || tClean.includes('express')) {
    sitePriority = 'nodejs.org expressjs geeksforgeeks';
  } else if (dClean.includes('devops') || tClean.includes('docker')) {
    sitePriority = 'docs.docker.com kubernetes.io github';
  } else if (dClean.includes('ai') || tClean.includes('ml')) {
    sitePriority = 'scikit-learn.org pytorch.org developers.google.com';
  }

  const query = `${taskTitle} ${subtopic} tutorial documentation ${sitePriority}`.trim();

  try {
    const postData = JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: 'advanced',
      topic: 'general',
      max_results: 6,
      include_answer: false,
      include_raw_content: false,
      include_images: false
    });

    const targetUrl = new URL('https://api.tavily.com/search');
    const options = {
      hostname: targetUrl.hostname,
      port: 443,
      path: targetUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000 // 10s strict timeout
    };

    const responseBody = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => { body += chunk; });
        res.on('end', () => resolve(body));
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Tavily request timed out')); });
      req.write(postData);
      req.end();
    });

    const parsed = JSON.parse(responseBody);
    const results = Array.isArray(parsed?.results) ? parsed.results : [];

    const validated = [];
    const seenUrls = new Set();

    for (const r of results) {
      const rUrl = String(r.url || '').trim();
      const rTitle = String(r.title || '').trim();
      const rContent = String(r.content || '').trim();

      if (!rUrl.startsWith('http://') && !rUrl.startsWith('https://')) continue;
      if (!rTitle || rTitle.length < 5) continue;
      if (seenUrls.has(rUrl)) continue;

      // Reject generic root homepages (must be a specific article page)
      try {
        const u = new URL(rUrl);
        const pathParts = u.pathname.split('/').filter(Boolean);
        if (pathParts.length === 0 || (pathParts.length === 1 && pathParts[0] === 'en-US')) {
          continue; // Generic homepage rejected
        }
      } catch (e) {
        continue;
      }

      seenUrls.add(rUrl);

      // Determine platform / source
      let sourceName = 'Web Documentation';
      let resourceType = 'ARTICLE';

      if (rUrl.includes('developer.mozilla.org')) {
        sourceName = 'MDN Web Docs';
        resourceType = 'DOCUMENTATION';
      } else if (rUrl.includes('geeksforgeeks.org')) {
        sourceName = 'GeeksforGeeks';
        resourceType = 'ARTICLE';
      } else if (rUrl.includes('w3schools.com')) {
        sourceName = 'W3Schools';
        resourceType = 'TUTORIAL';
      } else if (rUrl.includes('react.dev')) {
        sourceName = 'React Official Docs';
        resourceType = 'DOCUMENTATION';
      } else if (rUrl.includes('nodejs.org')) {
        sourceName = 'Node.js Official Docs';
        resourceType = 'DOCUMENTATION';
      } else if (rUrl.includes('python.org')) {
        sourceName = 'Python Official Docs';
        resourceType = 'DOCUMENTATION';
      } else if (rUrl.includes('docker.com')) {
        sourceName = 'Docker Documentation';
        resourceType = 'DOCUMENTATION';
      }

      validated.push({
        resource_id: `live_${Buffer.from(rUrl).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}`,
        title: rTitle,
        url: rUrl,
        platform: sourceName,
        resource_type: resourceType,
        description: rContent.slice(0, 240) || `Comprehensive guide covering ${subtopic || taskTitle}.`,
        estimated_minutes: 25,
        duration_minutes: 25,
        difficulty: userLevel || 'BEGINNER',
        category_label: validated.length === 0 ? 'PRIMARY' : (validated.length === 1 ? 'ALTERNATIVE' : 'PRACTICE'),
        verificationStatus: 'VERIFIED_LIVE',
        isFallback: false,
        relevance_score: 0.90,
        final_score: 0.90,
        relevance_reason: `Live web discovery: Targeted authoritative educational guide from ${sourceName} matching '${taskTitle}'.`
      });

      if (validated.length >= 4) break;
    }

    return validated;
  } catch (err) {
    console.warn('[RESOURCE PIPELINE] Live Tavily search skipped/failed:', err.message);
    return [];
  }
}

// ============================================================================
// LEVEL 3 HELPER: MATCH TOPIC IN TRUSTED CATALOG
// ============================================================================
function getTopicCuratedFallback(topic, subtopic, taskTitle) {
  const combined = `${taskTitle} ${subtopic} ${topic}`.toLowerCase();

  if (combined.includes('dom') || combined.includes('queryselector') || combined.includes('addeventlistener') || combined.includes('element selection')) {
    return TRUSTED_TOPIC_RESOURCES['dom'];
  }
  if (combined.includes('async') || combined.includes('promise') || combined.includes('fetch') || combined.includes('await')) {
    return TRUSTED_TOPIC_RESOURCES['async'];
  }
  if (combined.includes('react') || combined.includes('hook') || combined.includes('usestate') || combined.includes('useeffect')) {
    return TRUSTED_TOPIC_RESOURCES['react'];
  }
  if (combined.includes('node') || combined.includes('express') || combined.includes('rest api')) {
    return TRUSTED_TOPIC_RESOURCES['node'];
  }
  if (combined.includes('sql') || combined.includes('join') || combined.includes('database query')) {
    return TRUSTED_TOPIC_RESOURCES['sql'];
  }

  return null;
}

// ============================================================================
// MAIN MULTI-LEVEL RESOURCE ORCHESTRATION PIPELINE
// ============================================================================

/**
 * Orchestrates Level 1 (Python RAG) -> Level 2 (Targeted Live Search) -> Level 3 (Curated URLs) -> Level 4 (Domain Catalog)
 */
async function orchestrateTaskResources(params = {}) {
  const taskTitle = params.taskTitle || params.title || 'Technical Task';
  const topic = params.topic || params.dailyTopic || 'Core Subject';
  const subtopic = params.subtopic || params.taskSubtopic || topic;
  const rawDomain = params.domain || params.chosen_domain || 'fullstack';
  const domainKey = rawDomain.toLowerCase().replace(/[^a-z0-9_]/g, '');
  const userLevel = (params.userLevel || params.difficulty || 'BEGINNER').toUpperCase();
  const taskDuration = parseInt(params.taskDuration || params.durationMinutes || params.estimated_minutes, 10) || 45;

  const cacheKey = getCacheKey(domainKey, topic, subtopic, userLevel);

  // Check in-memory TTL cache
  if (resourceCache.has(cacheKey)) {
    const cached = resourceCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL_MS && Array.isArray(cached.data) && cached.data.length >= 2) {
      return {
        resources: cached.data,
        coverage: cached.coverage || 'full',
        levelUsed: cached.levelUsed || 'cached',
        message: cached.message || 'Personalized resources retrieved.'
      };
    }
  }

  // --------------------------------------------------------------------------
  // LEVEL 1: Python RAG Indexed Video Retrieval
  // --------------------------------------------------------------------------
  let level1Resources = [];
  try {
    const ragBaseUrl = (process.env.RAG_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');
    const ragTargetUrl = `${ragBaseUrl}/api/rag/query`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const ragPayload = {
      user_id: params.user_id || 'anonymous',
      query: `${domainKey} ${topic} ${subtopic}. ${taskTitle}.`,
      taskId: params.taskId || params.id,
      taskTitle,
      taskType: params.taskType || 'LEARN',
      taskDifficulty: userLevel,
      taskDuration,
      dailyTopic: topic,
      subtopic,
      topic,
      domain: domainKey,
      userLevel,
      topK: 3,
      taskDescription: params.taskDescription || ''
    };

    const ragRes = await fetch(ragTargetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ragPayload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (ragRes.ok) {
      const ragData = await ragRes.json();
      if (ragData && ragData.success && Array.isArray(ragData.resources) && ragData.resources.length > 0) {
        level1Resources = ragData.resources;
      }
    }
  } catch (ragErr) {
    // Graceful fallback to Level 2
  }

  // If Level 1 returned 2 or more relevant resources, return them
  if (level1Resources.length >= 2) {
function formatOffsetToTimestamp(startTs, durationMins) {
  if (!startTs) return null;
  const parts = String(startTs).split(':').map(Number);
  let totalSec = 0;
  if (parts.length === 3) totalSec = parts[0] * 3600 + parts[1] * 60 + parts[2];
  else if (parts.length === 2) totalSec = parts[0] * 60 + parts[1];
  else totalSec = parts[0] || 0;
  totalSec += Math.max(1, (Number(durationMins) || 10)) * 60;
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return h > 0
    ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

    const formatted = level1Resources.map((r, idx) => ({
      resource_id: r.resource_id,
      title: r.title,
      url: r.url,
      platform: r.platform || r.channel || 'YouTube',
      resource_type: r.resource_type || 'VIDEO',
      description: r.subtopic
        ? `${r.topic || topic} — ${r.subtopic}`
        : (r.description || `Verified video lesson for ${taskTitle}.`),
      estimated_minutes: r.duration_minutes || r.estimated_minutes || 20,
      duration_minutes: r.duration_minutes || r.estimated_minutes || 20,
      startTimestamp: r.startTimestamp || null,
      endTimestamp: r.endTimestamp || (r.startTimestamp ? formatOffsetToTimestamp(r.startTimestamp, r.duration_minutes || r.estimated_minutes) : null),
      start_seconds: r.start_seconds || null,
      is_chapter: Boolean(r.is_chapter),
      category_label: r.category_label || (idx === 0 ? 'PRIMARY' : (idx === 1 ? 'ALTERNATIVE' : 'PRACTICE')),
      verificationStatus: r.verificationStatus || (r.is_chapter ? 'VERIFIED_CHAPTER' : 'VERIFIED_INDEXED'),
      isFallback: false,
      relevance_score: r.relevance_score || 0.90,
      final_score: r.final_score || 0.90,
      relevance_reason: r.relevance_reason || `Matches topic '${topic}' within study budget.`
    }));

    resourceCache.set(cacheKey, { timestamp: Date.now(), data: formatted, coverage: 'full', levelUsed: 'Level 1: Indexed Video' });
    return {
      resources: formatted,
      coverage: 'full',
      levelUsed: 'Level 1: Indexed Video',
      message: 'Verified learning resources retrieved from video index.'
    };
  }

  // --------------------------------------------------------------------------
  // LEVEL 2: Targeted Live Web Discovery (Tavily with Authoritative Priorities)
  // --------------------------------------------------------------------------
  let level2Resources = await searchTavilyLive(taskTitle, topic, subtopic, domainKey, userLevel);

  // Combine with any single Level 1 resource if available
  let combinedPool = [...level1Resources, ...level2Resources];
  if (combinedPool.length >= 2) {
    // Re-index category labels
    const formatted = combinedPool.slice(0, 4).map((r, idx) => ({
      ...r,
      category_label: idx === 0 ? 'PRIMARY' : (idx === 1 ? 'ALTERNATIVE' : 'PRACTICE')
    }));

    resourceCache.set(cacheKey, { timestamp: Date.now(), data: formatted, coverage: 'full', levelUsed: 'Level 2: Live Discovery' });
    return {
      resources: formatted,
      coverage: 'full',
      levelUsed: 'Level 2: Live Discovery',
      message: 'Fresh educational documentation retrieved for your exact learning objectives.'
    };
  }

  // --------------------------------------------------------------------------
  // LEVEL 3: Trusted Educational Website Fallback (Genuine Topic URLs)
  // --------------------------------------------------------------------------
  const level3Curated = getTopicCuratedFallback(topic, subtopic, taskTitle);
  if (level3Curated && level3Curated.length > 0) {
    const formatted = level3Curated.map((r, idx) => ({
      resource_id: `topic_${idx + 1}`,
      title: r.title,
      url: r.url,
      platform: r.platform,
      resource_type: r.resource_type,
      description: r.description,
      estimated_minutes: r.estimated_minutes,
      duration_minutes: r.estimated_minutes,
      category_label: r.category_label || (idx === 0 ? 'PRIMARY' : (idx === 1 ? 'ALTERNATIVE' : 'PRACTICE')),
      verificationStatus: r.verificationStatus,
      isFallback: true,
      relevance_score: 0.92,
      relevance_reason: `Curated authoritative reference: Verified tutorial from ${r.platform} covering ${taskTitle}.`
    }));

    resourceCache.set(cacheKey, { timestamp: Date.now(), data: formatted, coverage: 'curated_topic', levelUsed: 'Level 3: Curated Topic' });
    return {
      resources: formatted,
      coverage: 'curated_topic',
      levelUsed: 'Level 3: Curated Topic',
      message: 'Curated official documentation and tutorials for this topic.'
    };
  }

  // --------------------------------------------------------------------------
  // LEVEL 4: Guaranteed Useful Final Fallback Catalog (All 8 Domains)
  // --------------------------------------------------------------------------
  const fallbackList = DOMAIN_CATALOG[domainKey] || DOMAIN_CATALOG['fullstack'];
  const formatted = fallbackList.map((r, idx) => ({
    resource_id: `catalog_${domainKey}_${idx + 1}`,
    title: r.title,
    url: r.url,
    platform: r.platform,
    resource_type: r.resource_type,
    description: r.description,
    estimated_minutes: r.estimated_minutes,
    duration_minutes: r.estimated_minutes,
    category_label: r.category_label || (idx === 0 ? 'PRIMARY' : (idx === 1 ? 'ALTERNATIVE' : 'PRACTICE')),
    verificationStatus: r.verificationStatus,
    isFallback: true,
    relevance_score: 0.85,
    relevance_reason: `Curated placement track: Verified learning material for ${domainKey.toUpperCase()} placement preparation.`
  }));

  resourceCache.set(cacheKey, { timestamp: Date.now(), data: formatted, coverage: 'domain_catalog', levelUsed: 'Level 4: Domain Catalog' });
  return {
    resources: formatted,
    coverage: 'domain_catalog',
    levelUsed: 'Level 4: Domain Catalog',
    message: 'Curated domain placement track synced for this skill.'
  };
}

function getGuaranteedDomainCatalog(domainKey, taskTitle = 'Core Learning Task') {
  const normDomain = (domainKey || 'fullstack').toLowerCase().replace(/[^a-z0-9_]/g, '');
  const catalog = DOMAIN_CATALOG[normDomain] || DOMAIN_CATALOG['fullstack'];
  return catalog.map((r, idx) => ({
    resource_id: `catalog_${normDomain}_${idx + 1}`,
    title: r.title,
    url: r.url,
    platform: r.platform,
    resource_type: r.resource_type,
    description: r.description,
    estimated_minutes: r.estimated_minutes,
    duration_minutes: r.estimated_minutes,
    category_label: r.category_label || (idx === 0 ? 'PRIMARY' : (idx === 1 ? 'ALTERNATIVE' : 'PRACTICE')),
    verificationStatus: r.verificationStatus,
    isFallback: true,
    fallback_level: 4,
    relevance_score: 0.85,
    relevance_reason: `Curated placement track: Verified learning material for ${normDomain.toUpperCase()} placement preparation.`
  }));
}

function getCuratedTopicResources(topic, subtopic, domain) {
  const res = getTopicCuratedFallback(topic, subtopic, topic);
  if (res && res.length > 0) {
    return res.map((r, idx) => ({
      resource_id: `topic_${idx + 1}`,
      title: r.title,
      url: r.url,
      platform: r.platform,
      resource_type: r.resource_type,
      description: r.description,
      estimated_minutes: r.estimated_minutes,
      duration_minutes: r.estimated_minutes,
      category_label: r.category_label || (idx === 0 ? 'PRIMARY' : (idx === 1 ? 'ALTERNATIVE' : 'PRACTICE')),
      verificationStatus: r.verificationStatus,
      isFallback: true,
      fallback_level: 3,
      relevance_score: 0.92,
      relevance_reason: `Curated authoritative reference covering ${topic}.`
    }));
  }
  return getGuaranteedDomainCatalog(domain, topic);
}

module.exports = {
  orchestrateTaskResources,
  searchTavilyLive,
  TRUSTED_TOPIC_RESOURCES,
  DOMAIN_CATALOG,
  DOMAIN_FALLBACK_CATALOG: DOMAIN_CATALOG,
  validateAndSanitizeUrl,
  getTopicCuratedFallback,
  getCuratedTopicResources,
  getGuaranteedDomainCatalog
};
