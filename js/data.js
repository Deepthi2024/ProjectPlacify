/**
 * AgPlacify Data Store
 * Comprehensive NPTEL-Style Technical Question Bank for All 8 Tech Domains.
 * 30 Questions per Domain (240 Questions Total).
 * Formats: MCQ, MSQ, NUMERICAL, CODE_OUTPUT, ASSERTION_REASONING, SCENARIO_BASED, CONCEPTUAL, APPLICATION_BASED, DEBUGGING, COMPLEXITY.
 */

window.PLACIFY_DATA = {
  domains: [
    // =========================================================================
    // 1. FULL-STACK WEB DEVELOPMENT (30 QUESTIONS)
    // =========================================================================
    {
      id: 'fullstack',
      name: 'Full-Stack Web Development',
      icon: 'ph-code-block',
      description: 'Master Modern Web Architecture: JavaScript Internals, REST & GraphQL APIs, React VDOM, SQL/NoSQL Databases, Web Security, and High-Concurrency Backend Engineering.',
      diagnostics: [
        // Topic 1: JavaScript Fundamentals (5 Qs)
        { id: 'fs_js_q1', topic: 'JavaScript Fundamentals', subtopic: 'Scope & Hoisting', type: 'MCQ', difficulty: 'BEGINNER', question: 'What is the exact output of executing the following code in non-strict mode?', codeSnippet: 'console.log(a);\nvar a = 10;\nlet b = 20;', options: ['ReferenceError: a is not defined', 'undefined', '10', 'TypeError: Cannot access a before initialization'], correct: 1, explanation: 'Variables declared with `var` are hoisted to the top of their enclosing scope and initialized with `undefined`.' },
        { id: 'fs_js_q2', topic: 'JavaScript Fundamentals', subtopic: 'Event Loop & Microtasks', type: 'CODE_OUTPUT', difficulty: 'BEGINNER', question: 'What sequence will be printed to the console?', codeSnippet: 'console.log("1");\nsetTimeout(() => console.log("2"), 0);\nPromise.resolve().then(() => console.log("3"));\nconsole.log("4");', options: ['1, 2, 3, 4', '1, 4, 2, 3', '1, 4, 3, 2', '3, 1, 4, 2'], correct: 2, explanation: 'Synchronous execution prints "1", "4". Microtasks (Promise handlers) execute before Macrotasks (setTimeout).' },
        { id: 'fs_js_q3', topic: 'JavaScript Fundamentals', subtopic: 'Closures & Lexical Memory', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which statements correctly describe JavaScript closures? (Select ALL correct answers)', options: ['A closure grants an inner function access to its outer lexical scope even after the outer function has returned.', 'Closures consume heap memory by maintaining references to outer variables.', 'Closures prevent garbage collection of captured variables.', 'Closures can only capture primitive values.'], correct: [0, 1, 2], explanation: 'Closures retain references to outer scope variables in memory, preventing GC until all inner function references are destroyed.' },
        { id: 'fs_js_q4', topic: 'JavaScript Fundamentals', subtopic: 'Prototype Chain', type: 'ASSERTION_REASONING', difficulty: 'INTERMEDIATE', question: 'Assertion (A): `Object.create(null)` creates an object without a prototype.\nReason (R): `Object.create(null)` sets the hidden `[[Prototype]]` internal slot to `null`.', options: ['Both A and R are true, and R is the correct explanation of A.', 'Both A and R are true, but R is NOT the correct explanation of A.', 'A is true, but R is false.', 'A is false, but R is true.'], correct: 0, explanation: '`Object.create(null)` explicitly assigns `null` to the prototype, omitting `Object.prototype` methods like `toString`.' },
        { id: 'fs_js_q5', topic: 'JavaScript Fundamentals', subtopic: 'Event Loop Execution Count', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'How many microtasks are executed before the macrotask timer callback runs in a microtask recursion depth of 10?', correct: 10, explanation: 'The event loop completely drains the microtask queue (10 microtasks) before processing the next macrotask.' },

        // Topic 2: REST API & Backend Architecture (5 Qs)
        { id: 'fs_api_q1', topic: 'REST API & Backend Architecture', subtopic: 'HTTP Methods & Idempotency', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which HTTP method is defined as IDEMPOTENT according to the RFC 7231 specification?', options: ['POST', 'PUT', 'PATCH', 'CONNECT'], correct: 1, explanation: 'PUT requests are idempotent because making N identical requests yields the same final resource state.' },
        { id: 'fs_api_q2', topic: 'REST API & Backend Architecture', subtopic: 'HTTP Status Codes', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which HTTP status code should be returned when an authentication token is expired or missing?', options: ['400 Bad Request', '401 Unauthorized', '403 Forbidden', '404 Not Found'], correct: 1, explanation: '401 Unauthorized indicates missing or invalid authentication credentials.' },
        { id: 'fs_api_q3', topic: 'REST API & Backend Architecture', subtopic: 'Middleware & Pipeline', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which middleware tasks are typical in Express/Node.js API pipelines? (Select ALL correct answers)', options: ['Parsing JSON bodies', 'Validating JWT signatures', 'Compiling React components to HTML', 'Enforcing rate limiting'], correct: [0, 1, 3], explanation: 'Body parsing, JWT validation, and rate limiting are core backend middleware responsibilities.' },
        { id: 'fs_api_q4', topic: 'REST API & Backend Architecture', subtopic: 'API Gateway & Rate Limiting', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', question: 'Your API server is overwhelmed by spike traffic from bad actors. Which rate limiting strategy allows bursty user requests while protecting downstream microservices?', options: ['In-memory JS array filtering', 'Token Bucket algorithm via Redis', 'Blocking IP addresses permanently', 'Disabling CORS'], correct: 1, explanation: 'Token Bucket refilling via Redis allows burst traffic up to bucket capacity while maintaining fixed throughput.' },
        { id: 'fs_api_q5', topic: 'REST API & Backend Architecture', subtopic: 'GraphQL N+1 Problem', type: 'DEBUGGING', difficulty: 'ADVANCED', question: 'In GraphQL APIs, executing a nested query for 100 users with their posts results in 101 SQL queries. How do you fix this N+1 problem?', options: ['Add more CPU cores to Node server', 'Batch and cache request IDs using DataLoader', 'Disable GraphQL schemas', 'Use POST requests instead of GET'], correct: 1, explanation: 'DataLoader batches individual ID lookup promises into a single SQL `WHERE id IN (...)` query.' },

        // Topic 3: React & UI Architecture (5 Qs)
        { id: 'fs_react_q1', topic: 'React & UI Architecture', subtopic: 'Virtual DOM & Keys', type: 'MCQ', difficulty: 'BEGINNER', question: 'What primary role does the `key` prop play when rendering dynamic lists in React?', options: ['Applies CSS inline styles', 'Identifies VDOM nodes uniquely so React can track additions, moves, and deletions efficiently', 'Saves component state to localStorage', 'Encrypts component props'], correct: 1, explanation: 'Keys preserve element identity across renders, allowing React Fiber to diff list items efficiently.' },
        { id: 'fs_react_q2', topic: 'React & UI Architecture', subtopic: 'React Hooks Rules', type: 'CONCEPTUAL', difficulty: 'BEGINNER', question: 'Why must React Hooks only be called at the top level of a component (never inside loops or conditions)?', options: ['Hooks are slow inside loops', 'React relies on the constant call order of hooks across re-renders to preserve internal state linked lists', 'Hooks require strict mode', 'Loops delete state'], correct: 1, explanation: 'React tracks hook state in an internal fiber array indexed strictly by call order.' },
        { id: 'fs_react_q3', topic: 'React & UI Architecture', subtopic: 'Performance & Memoization', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which techniques prevent unnecessary child component re-renders in React? (Select ALL correct answers)', options: ['Wrapping child components in `React.memo`', 'Memoizing callback functions passed as props using `useCallback`', 'Memoizing expensive calculations using `useMemo`', 'Mutating state variables directly without `setState`'], correct: [0, 1, 2], explanation: '`React.memo`, `useCallback`, and `useMemo` preserve reference equality to avoid child re-renders.' },
        { id: 'fs_react_q4', topic: 'React & UI Architecture', subtopic: 'SSR & Hydration', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', question: 'During SSR hydration, you observe a "Text content does not match server-rendered HTML" warning. What causes this?', options: ['Missing CSS files', 'Client JS evaluated non-deterministic values (like `Date.now()` or `Math.random()`) differently than the server', 'Server running out of RAM', 'React version mismatch'], correct: 1, explanation: 'Hydration mismatch occurs when client VDOM generated during hydration differs from server-rendered static HTML markup.' },
        { id: 'fs_react_q5', topic: 'React & UI Architecture', subtopic: 'Concurrent Fiber Architecture', type: 'CONCEPTUAL', difficulty: 'ADVANCED', question: 'What capability does React 18 Fiber architecture unlock via `useTransition`?', options: ['Multi-threaded CPU rendering', 'Interruptible, non-blocking background state updates that yield UI priority to urgent user input', 'Automatic database ORM mapping', 'Web Workers execution'], correct: 1, explanation: 'Transitions mark state updates as non-urgent, allowing React to interrupt rendering for high-priority inputs.' },

        // Topic 4: Database Management (5 Qs)
        { id: 'fs_db_q1', topic: 'Database Management', subtopic: 'ACID Atomicity', type: 'MCQ', difficulty: 'BEGINNER', question: 'What does the Atomicity property guarantee in relational database transactions?', options: ['All operations in a transaction succeed completely or all are rolled back as if nothing executed', 'Data is encrypted on disk', 'Queries execute in parallel', 'Index trees stay balanced'], correct: 0, explanation: 'Atomicity enforces all-or-nothing transaction execution.' },
        { id: 'fs_db_q2', topic: 'Database Management', subtopic: 'SQL INNER JOIN', type: 'CODE_OUTPUT', difficulty: 'BEGINNER', question: 'Given Table A (3 rows: IDs 1, 2, 3) and Table B (2 rows: IDs 2, 3), how many rows does `SELECT * FROM A INNER JOIN B ON A.id = B.id` return?', options: ['1', '2', '3', '5'], correct: 1, explanation: 'INNER JOIN returns matching rows present in both tables (IDs 2 and 3 -> 2 rows).' },
        { id: 'fs_db_q3', topic: 'Database Management', subtopic: 'Database Indexing Trade-offs', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'What are the consequences of adding multiple B-Tree indexes to a database table? (Select ALL correct answers)', options: ['Dramatically speeds up SELECT query lookup times', 'Slows down INSERT, UPDATE, and DELETE operations due to index maintenance', 'Increases storage disk consumption', 'Disables ACID transactions'], correct: [0, 1, 2], explanation: 'Indexes accelerate read lookups but incur write overhead and additional disk storage.' },
        { id: 'fs_db_q4', topic: 'Database Management', subtopic: 'Normalization 3NF', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'A relation is in Third Normal Form (3NF) if it satisfies 2NF AND contains no what?', options: ['Foreign keys', 'Transitive functional dependencies (non-prime attributes depending on non-prime attributes)', 'Primary keys', 'Index constraints'], correct: 1, explanation: '3NF requires that no non-prime attribute transitively depends on the primary key.' },
        { id: 'fs_db_q5', topic: 'Database Management', subtopic: 'Phantom Reads & Isolation', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'In PostgreSQL, how many dirty reads are permitted under the Read Committed isolation level?', correct: 0, explanation: 'Read Committed prevents dirty reads completely (0 dirty reads).' },

        // Topic 5: Web Security (5 Qs)
        { id: 'fs_sec_q1', topic: 'Web Security', subtopic: 'XSS Prevention', type: 'MCQ', difficulty: 'BEGINNER', question: 'What is the most effective technical defense against Reflected Cross-Site Scripting (XSS)?', options: ['Disabling HTTPS', 'Context-aware HTML/JS output encoding and enforcing Content Security Policy (CSP) headers', 'Encrypting SQL database passwords', 'Disabling cookies'], correct: 1, explanation: 'Output encoding neutralizes executable script payload characters before rendering in HTML.' },
        { id: 'fs_sec_q2', topic: 'Web Security', subtopic: 'SQL Injection Fix', type: 'CODE_OUTPUT', difficulty: 'BEGINNER', question: 'Which SQL statement prevents SQL injection vulnerability when taking user input `username`?', options: ['"SELECT * FROM users WHERE user = \'" + username + "\'"', '"SELECT * FROM users WHERE user = $1", [username]', '"SELECT * FROM users WHERE user = " + eval(username)', '"SELECT * FROM users WHERE user = LIKE " + username'], correct: 1, explanation: 'Parameterized queries (`$1`) separate executable SQL commands from user input values.' },
        { id: 'fs_sec_q3', topic: 'Web Security', subtopic: 'CSRF Defenses', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which security mechanisms defend web applications against Cross-Site Request Forgery (CSRF)? (Select ALL correct answers)', options: ['Setting `SameSite=Strict` or `SameSite=Lax` on session cookies', 'Using Anti-CSRF cryptographically random tokens in form requests', 'Verifying `Origin` and `Referer` request headers', 'Disabling CORS entirely'], correct: [0, 1, 2], explanation: 'SameSite cookies, anti-CSRF tokens, and header verification prevent unauthorized cross-origin requests.' },
        { id: 'fs_sec_q4', topic: 'Web Security', subtopic: 'Password Hashing', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'Why is plain MD5 or SHA-256 unsuitable for storing user passwords in modern databases?', options: ['MD5 produces variable length strings', 'MD5 and SHA-256 are fast hash functions, enabling attackers to perform billions of offline dictionary/rainbow table guesses per second', 'SHA-256 cannot hash letters', 'MD5 requires SSL'], correct: 1, explanation: 'Slow, memory-hard algorithms with salts (like bcrypt, Argon2id, PBKDF2) are required to resist brute-force attacks.' },
        { id: 'fs_sec_q5', topic: 'Web Security', subtopic: 'CORS Preflight', type: 'SCENARIO_BASED', difficulty: 'ADVANCED', question: 'A cross-origin fetch request with `Content-Type: application/json` and custom header `X-App-Token` triggers a preflight request. Which HTTP method is sent by the browser first?', options: ['GET', 'POST', 'OPTIONS', 'HEAD'], correct: 2, explanation: 'Browsers automatically send an HTTP `OPTIONS` preflight request to verify server permissions before non-simple requests.' },

        // Topic 6: System Design & Deployment (5 Qs)
        { id: 'fs_sys_q1', topic: 'System Design & Deployment', subtopic: 'Stateless Architecture', type: 'MCQ', difficulty: 'BEGINNER', question: 'What is required to allow a web application server pool to scale horizontally behind a load balancer?', options: ['Keep all user sessions in server RAM', 'Design stateless app servers with user sessions stored in centralized Redis/database clusters', 'Use single-core CPU nodes', 'Disable HTTPS'], correct: 1, explanation: 'Stateless servers permit any node in the pool to process incoming user requests.' },
        { id: 'fs_sys_q2', topic: 'System Design & Deployment', subtopic: 'Reverse Proxies', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which service typically handles SSL/TLS termination, static file caching, and request routing in production?', options: ['React VDOM', 'Nginx / HAProxy', 'SQLite database', 'Node.js event emitter'], correct: 1, explanation: 'Reverse proxies like Nginx offload SSL termination, gzip compression, and static asset serving.' },
        { id: 'fs_sys_q3', topic: 'System Design & Deployment', subtopic: 'Caching Strategies', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'What strategies prevent database overload during cache misses or cache expirations? (Select ALL correct answers)', options: ['Cache-aside pattern with TTL expiration', 'Mutex locking / single-flight request coalescing for identical keys', 'Pre-warming cache with popular keys prior to traffic spikes', 'Disabling database indexes'], correct: [0, 1, 2], explanation: 'Cache-aside, request coalescing, and pre-warming prevent database connection exhaustion.' },
        { id: 'fs_sys_q4', topic: 'System Design & Deployment', subtopic: 'Async Queues', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', question: 'Your web API needs to process heavy PDF reports generated by users without delaying HTTP API responses. What is the optimal architecture?', options: ['Generate PDFs synchronously inside HTTP controller thread', 'Offload PDF generation tasks asynchronously to a RabbitMQ/BullMQ queue processed by background worker nodes', 'Ask user to generate PDFs on client browser', 'Restart server after every request'], correct: 1, explanation: 'Asynchronous task queues decouple time-consuming tasks from the client HTTP request-response cycle.' },
        { id: 'fs_sys_q5', topic: 'System Design & Deployment', subtopic: 'Zero-Downtime Deployment', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'In a Blue-Green deployment strategy, how many active production environments are maintained during a release transition?', correct: 2, explanation: 'Blue-Green deployments run 2 identical environments (Blue active, Green staging/new) simultaneously.' }
      ],
      milestones: [
        { id: 'm1', title: 'Phase 1: Web Foundations & Modern JS (ES6+)', topic: 'JavaScript Fundamentals', week: 1, durationDays: 7 },
        { id: 'm2', title: 'Phase 2: Frontend Engineering with React & Tailwind', topic: 'React & UI Architecture', week: 2, durationDays: 7 },
        { id: 'm3', title: 'Phase 3: Backend API Architecture (Node.js & Express)', topic: 'REST API & Backend Architecture', week: 3, durationDays: 7 },
        { id: 'm4', title: 'Phase 4: Database Design (PostgreSQL & MongoDB)', topic: 'Database Management', week: 4, durationDays: 7 },
        { id: 'm5', title: 'Phase 5: Web Security, Performance & Auth', topic: 'Web Security', week: 5, durationDays: 7 },
        { id: 'm6', title: 'Phase 6: Full-Stack Integration & System Design', topic: 'System Design & Deployment', week: 6, durationDays: 7 }
      ]
    },

    // =========================================================================
    // 2. DATA SCIENCE & MACHINE LEARNING (30 QUESTIONS)
    // =========================================================================
    {
      id: 'datascience',
      name: 'Data Science & Machine Learning',
      icon: 'ph-brain',
      description: 'Master Exploratory Data Analysis, Supervised & Unsupervised Learning, Feature Engineering, Neural Networks, PyTorch, and MLOps.',
      diagnostics: [
        // Topic 1: Machine Learning Fundamentals (5 Qs)
        { id: 'ds_ml_q1', topic: 'Machine Learning Fundamentals', subtopic: 'Supervised vs Unsupervised', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which task is an example of Unsupervised Machine Learning?', options: ['Predicting house prices', 'Classifying spam emails', 'Customer segmentation via K-Means clustering', 'Medical diagnosis prediction'], correct: 2, explanation: 'K-Means partitions unlabeled data into clusters based on feature similarity without ground-truth labels.' },
        { id: 'ds_ml_q2', topic: 'Machine Learning Fundamentals', subtopic: 'Bias-Variance Tradeoff', type: 'CONCEPTUAL', difficulty: 'BEGINNER', question: 'What characterizes a Machine Learning model with High Variance?', options: ['Underfitting training data', 'Overfitting training data and generalizing poorly to unseen test data', 'Low training accuracy and low test accuracy', 'Fast inference execution times'], correct: 1, explanation: 'High variance indicates the model has overfitted by memorizing noise in the training set.' },
        { id: 'ds_ml_q3', topic: 'Machine Learning Fundamentals', subtopic: 'Regularization Techniques', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which properties apply to L1 Regularization (Lasso Regression)? (Select ALL correct answers)', options: ['Adds sum of absolute weight values `lambda * sum(|w|)` to loss function', 'Performs feature selection by driving non-essential feature weights strictly to zero', 'Adds sum of squared weight values `lambda * sum(w^2)`', 'Prevents model overfitting'], correct: [0, 1, 3], explanation: 'L0/L1 regularization penalizes absolute weights, creating sparse feature representations.' },
        { id: 'ds_ml_q4', topic: 'Machine Learning Fundamentals', subtopic: 'Gradient Descent Optimization', type: 'ASSERTION_REASONING', difficulty: 'INTERMEDIATE', question: 'Assertion (A): Stochastic Gradient Descent (SGD) with momentum escapes shallow local minima faster than standard batch SGD.\nReason (R): Momentum accumulates past gradients to accelerate update vectors in directions of consistent descent.', options: ['Both A and R are true, and R is the correct explanation of A.', 'Both A and R are true, but R is NOT the correct explanation of A.', 'A is true, but R is false.', 'A is false, but R is true.'], correct: 0, explanation: 'Momentum acts as velocity, carrying parameters past small noise bumps and local minima.' },
        { id: 'ds_ml_q5', topic: 'Machine Learning Fundamentals', subtopic: 'Gradient Weight Update Calculation', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'Given weight w = 2.0, learning rate lr = 0.1, and gradient dL/dw = 4.0, what is the updated weight value w_new after one gradient descent step?', correct: 1.6, explanation: 'w_new = w - (lr * dL/dw) = 2.0 - (0.1 * 4.0) = 1.6.' },

        // Topic 2: Data Preprocessing & Metrics (5 Qs)
        { id: 'ds_prep_q1', topic: 'Data Preprocessing & Metrics', subtopic: 'Imbalanced Datasets', type: 'MCQ', difficulty: 'BEGINNER', question: 'In credit card fraud detection with 0.1% positive fraud cases, why is Accuracy a misleading performance metric?', options: ['Accuracy cannot be computed on numeric vectors', 'A trivial classifier predicting 100% non-fraud achieves 99.9% accuracy while detecting 0 frauds', 'Accuracy requires normalized inputs', 'Accuracy is only for regression'], correct: 1, explanation: 'Accuracy is dominated by the majority class in highly skewed data distributions.' },
        { id: 'ds_prep_q2', topic: 'Data Preprocessing & Metrics', subtopic: 'Precision vs Recall', type: 'CODE_OUTPUT', difficulty: 'BEGINNER', question: 'Given True Positives (TP) = 80, False Positives (FP) = 20, False Negatives (FN) = 10, what is the Precision score?', options: ['0.80', '0.888', '0.727', '0.90'], correct: 0, explanation: 'Precision = TP / (TP + FP) = 80 / (80 + 20) = 80 / 100 = 0.80.' },
        { id: 'ds_prep_q3', topic: 'Data Preprocessing & Metrics', subtopic: 'Feature Scaling', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which algorithms are sensitive to feature magnitude scales and require normalization/standardization? (Select ALL correct answers)', options: ['K-Nearest Neighbors (KNN)', 'Support Vector Machines (SVM)', 'Principal Component Analysis (PCA)', 'Decision Trees'], correct: [0, 1, 2], explanation: 'Distance-based algorithms (KNN, SVM, PCA) are heavily affected by unscaled feature magnitudes. Tree models are invariant.' },
        { id: 'ds_prep_q4', topic: 'Data Preprocessing & Metrics', subtopic: 'Handling Missing Values', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', question: 'You have a tabular dataset with 15% missing numeric data occurring randomly. What imputation method avoids distorting feature distributions?', options: ['Fill missing values with 0', 'Impute using median or Iterative KNN Imputer', 'Drop all rows with missing values', 'Fill with maximum value'], correct: 1, explanation: 'Median or KNN imputation preserves feature medians and inter-feature correlation structures.' },
        { id: 'ds_prep_q5', topic: 'Data Preprocessing & Metrics', subtopic: 'F1-Score Calculation', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'Calculate the harmonic mean F1-Score when Precision = 0.8 and Recall = 0.8.', correct: 0.8, explanation: 'F1 = 2 * (Precision * Recall) / (Precision + Recall) = 2 * (0.64) / 1.6 = 0.8.' },

        // Topic 3: Deep Learning & Neural Networks (5 Qs)
        { id: 'ds_dl_q1', topic: 'Deep Learning & Neural Networks', subtopic: 'Activation Functions', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which activation function is most widely used in hidden layers of deep networks to mitigate vanishing gradients?', options: ['Sigmoid', 'Tanh', 'ReLU (Rectified Linear Unit)', 'Step Function'], correct: 2, explanation: 'ReLU has a constant derivative of 1 for positive inputs, avoiding gradient degradation during backprop.' },
        { id: 'ds_dl_q2', topic: 'Deep Learning & Neural Networks', subtopic: 'CNN Architectures', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which layer type in Convolutional Neural Networks (CNNs) downsamples spatial dimensions while preserving key features?', options: ['Dense Layer', 'Pooling Layer (e.g. Max Pooling)', 'Dropout Layer', 'Softmax Layer'], correct: 1, explanation: 'Max Pooling reduces spatial resolution (height/width) and provides translation invariance.' },
        { id: 'ds_dl_q3', topic: 'Deep Learning & Neural Networks', subtopic: 'Overfitting Mitigation', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which techniques help prevent overfitting in Deep Neural Networks? (Select ALL correct answers)', options: ['Applying Dropout during training', 'Adding L2 Weight Decay', 'Using Early Stopping based on validation loss', 'Increasing neural network depth indefinitely'], correct: [0, 1, 2], explanation: 'Dropout, weight decay, and early stopping constrain model capacity and over-memorization.' },
        { id: 'ds_dl_q4', topic: 'Deep Learning & Neural Networks', subtopic: 'Vanishing Gradient Problem', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'Why does the Sigmoid activation function cause vanishing gradients in deep networks?', options: ['Sigmoid outputs negative values', 'Sigmoid derivative maxes out at 0.25, causing backpropagated gradients to shrink exponentially with depth', 'Sigmoid cannot be differentiated', 'Sigmoid consumes excessive memory'], correct: 1, explanation: 'Multiplying small derivatives (<= 0.25) across many layers drives gradients rapidly toward zero.' },
        { id: 'ds_dl_q5', topic: 'Deep Learning & Neural Networks', subtopic: 'CNN Parameter Calculation', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'How many trainable parameters (weights + bias) exist in a 2D convolution layer with 10 filters of size 3x3 on a 1-channel grayscale input image?', correct: 100, explanation: 'Each filter has (3*3*1 + 1 bias) = 10 parameters. 10 filters * 10 = 100 parameters.' },

        // Topic 4: Unsupervised Learning & PCA (5 Qs)
        { id: 'ds_unsup_q1', topic: 'Unsupervised Learning', subtopic: 'PCA Mechanics', type: 'MCQ', difficulty: 'BEGINNER', question: 'What mathematical entity does Principal Component Analysis (PCA) compute to identify directions of maximum variance?', options: ['Eigenvectors and Eigenvalues of the Data Covariance Matrix', 'Loss function gradients', 'Confusion matrix determinants', 'K-Means centroids'], correct: 0, explanation: 'PCA performs eigendecomposition on the feature covariance matrix to extract principal components.' },
        { id: 'ds_unsup_q2', topic: 'Unsupervised Learning', subtopic: 'K-Means Distance Metric', type: 'MCQ', difficulty: 'BEGINNER', question: 'What distance metric is standard in basic K-Means clustering algorithm implementations?', options: ['Cosine Similarity', 'Euclidean Distance', 'Hamming Distance', 'Jaccard Distance'], correct: 1, explanation: 'K-Means minimizes the sum of squared Euclidean distances between data points and cluster centroids.' },
        { id: 'ds_unsup_q3', topic: 'Unsupervised Learning', subtopic: 'Clustering Validation', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which metrics evaluate the quality of clustering when ground-truth labels are unavailable? (Select ALL correct answers)', options: ['Silhouette Score', 'Davies-Bouldin Index', 'Calinski-Harabasz Index', 'Mean Squared Error'], correct: [0, 1, 2], explanation: 'Silhouette Score, Davies-Bouldin, and Calinski-Harabasz evaluate internal cluster compactness and separation.' },
        { id: 'ds_unsup_q4', topic: 'Unsupervised Learning', subtopic: 'Hierarchical vs K-Means', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'What is a major advantage of Hierarchical Agglomerative Clustering over standard K-Means?', options: ['O(N) time complexity', 'Does not require specifying the number of clusters (K) in advance and outputs a dendrogram tree', 'Uses gradient descent', 'Handles missing values natively'], correct: 1, explanation: 'Hierarchical clustering constructs a dendrogram allowing cluster count selection at any distance threshold.' },
        { id: 'ds_unsup_q5', topic: 'Unsupervised Learning', subtopic: 'PCA Dimensionality Reduction', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'If the top 2 principal components capture 60% and 25% of total dataset variance respectively, what total variance % is retained by selecting 2 components?', correct: 85, explanation: 'Total retained variance = 60% + 25% = 85%.' },

        // Topic 5: MLOps & Deployment (5 Qs)
        { id: 'ds_ops_q1', topic: 'MLOps & Deployment', subtopic: 'Concept Drift', type: 'MCQ', difficulty: 'BEGINNER', question: 'What is Concept Drift in production Machine Learning systems?', options: ['Server CPU overheating', 'Statistical relationship between input features X and target Y changes over time', 'Git merge conflict', 'Database full'], correct: 1, explanation: 'Concept drift occurs when the underlying pattern P(Y|X) evolves, degrading model predictive accuracy.' },
        { id: 'ds_ops_q2', topic: 'MLOps & Deployment', subtopic: 'Model Serialization', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which open format is standard for serializing trained neural network models for cross-platform inference deployment?', options: ['ONNX (Open Neural Network Exchange)', 'JSON', 'CSV', 'YAML'], correct: 0, explanation: 'ONNX provides a uniform format to export models across PyTorch, TensorFlow, and inference runtimes.' },
        { id: 'ds_ops_q3', topic: 'MLOps & Deployment', subtopic: 'Feature Stores', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'What key capabilities do Feature Stores (e.g. Feast, Tecton) provide for MLOps pipelines? (Select ALL correct answers)', options: ['Consistency between offline training features and online real-time inference features', 'Feature reuse across multiple ML teams', 'Feature versioning and point-in-time point lookup', 'Automated frontend web hosting'], correct: [0, 1, 2], explanation: 'Feature stores ensure consistent feature transformations for training and low-latency online serving.' },
        { id: 'ds_ops_q4', topic: 'MLOps & Deployment', subtopic: 'Canary Deployments', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', question: 'You are deploying a newly retrained recommendation model to production. How do you mitigate risk without exposing 100% of users to model failures?', options: ['Deploy directly to 100% live traffic', 'Perform a Canary deployment, routing 5% of traffic to the new model while monitoring error metrics', 'Shut down the database', 'Ask users to vote'], correct: 1, explanation: 'Canary deployment routes a small fraction of live traffic to the new version to validate stability.' },
        { id: 'ds_ops_q5', topic: 'MLOps & Deployment', subtopic: 'Inference Batch Size Latency', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'A GPU batch inference processes 32 requests in 64 milliseconds. What is the average latency per request in milliseconds within this batch execution?', correct: 2, explanation: 'Average latency per sample in batch = 64 ms / 32 = 2 ms.' },

        // Topic 6: Advanced Deep Learning & NLP (5 Qs)
        { id: 'ds_nlp_q1', topic: 'Advanced Deep Learning & NLP', subtopic: 'Self-Attention Mechanism', type: 'MCQ', difficulty: 'BEGINNER', question: 'What primary computational advantage do Transformer architectures possess over Recurrent Neural Networks (RNNs)?', options: ['Requires zero training data', 'Enables parallel processing of entire text sequences instead of sequential step-by-step unrolling', 'Eliminates matrix multiplications', 'Runs without GPUs'], correct: 1, explanation: 'Self-attention calculates token interactions simultaneously across sequence positions.' },
        { id: 'ds_nlp_q2', topic: 'Advanced Deep Learning & NLP', subtopic: 'BERT vs GPT', type: 'MCQ', difficulty: 'BEGINNER', question: 'What structural difference distinguishes BERT from GPT model architectures?', options: ['BERT is bidirectional (encoder); GPT is autoregressive (decoder)', 'BERT uses zero parameters', 'GPT uses CNNs', 'BERT is for audio only'], correct: 0, explanation: 'BERT uses bidirectional self-attention for contextual encoding; GPT uses causal masked decoding.' },
        { id: 'ds_nlp_q3', topic: 'Advanced Deep Learning & NLP', subtopic: 'Word Embeddings', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which algorithms generate dense vector representations of text tokens based on co-occurrence context? (Select ALL correct answers)', options: ['Word2Vec (Skip-gram / CBOW)', 'GloVe (Global Vectors)', 'FastText', 'One-Hot Encoding'], correct: [0, 1, 2], explanation: 'Word2Vec, GloVe, and FastText compute low-dimensional dense embeddings. One-hot vectors are sparse.' },
        { id: 'ds_nlp_q4', topic: 'Advanced Deep Learning & NLP', subtopic: 'Attention Complexity', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'What is the computational time and memory complexity of standard Multi-Head Self-Attention with respect to sequence length N?', options: ['O(N)', 'O(N^2)', 'O(log N)', 'O(N^3)'], correct: 1, explanation: 'Calculating pairwise token query-key similarity matrices requires O(N^2) time and memory.' },
        { id: 'ds_nlp_q5', topic: 'Advanced Deep Learning & NLP', subtopic: 'Transformer Heads Count', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'If a Transformer model has a hidden dimension d_model = 768 divided across d_head = 64 dimensions per attention head, how many attention heads exist?', correct: 12, explanation: 'Number of heads = d_model / d_head = 768 / 64 = 12 heads.' }
      ],
      milestones: [
        { id: 'm1', title: 'Phase 1: Python Data Stack & EDA', topic: 'Data Preprocessing & Metrics', week: 1, durationDays: 7 },
        { id: 'm2', title: 'Phase 2: Supervised Learning & Ensemble Models', topic: 'Machine Learning Fundamentals', week: 2, durationDays: 7 },
        { id: 'm3', title: 'Phase 3: Unsupervised Learning & PCA', topic: 'Unsupervised Learning', week: 3, durationDays: 7 },
        { id: 'm4', title: 'Phase 4: Deep Learning Foundations (PyTorch)', topic: 'Deep Learning & Neural Networks', week: 4, durationDays: 7 },
        { id: 'm5', title: 'Phase 5: NLP & Transformers', topic: 'Advanced Deep Learning & NLP', week: 5, durationDays: 7 },
        { id: 'm6', title: 'Phase 6: MLOps & Model Deployment', topic: 'MLOps & Deployment', week: 6, durationDays: 7 }
      ]
    },

    // =========================================================================
    // 3. DATA STRUCTURES & ALGORITHMS (INTERVIEW PREP) (30 QUESTIONS)
    // =========================================================================
    {
      id: 'dsa',
      name: 'Data Structures & Algorithms (Interview Prep)',
      icon: 'ph-tree-structure',
      description: 'Master coding patterns: Arrays, Sliding Window, Two Pointers, Stacks, Queues, Trees, BSTs, Graphs, Shortest Path, and Dynamic Programming.',
      diagnostics: [
        // Topic 1: Arrays & Hash Maps (5 Qs)
        { id: 'dsa_arr_q1', topic: 'Arrays & Hash Maps', subtopic: 'Lookup Complexity', type: 'MCQ', difficulty: 'BEGINNER', question: 'What is the average time complexity to check if a key exists in a Hash Map?', options: ['O(N)', 'O(1)', 'O(log N)', 'O(N^2)'], correct: 1, explanation: 'Hash tables deliver average O(1) time complexity for insertion, deletion, and search lookups.' },
        { id: 'dsa_arr_q2', topic: 'Arrays & Hash Maps', subtopic: 'Two Sum Pattern', type: 'CODE_OUTPUT', difficulty: 'BEGINNER', question: 'Given array `nums = [2, 7, 11, 15]` and `target = 9`, what index pair is returned by Two Sum?', options: ['[0, 1]', '[1, 2]', '[0, 2]', '[2, 3]'], correct: 0, explanation: '`nums[0] + nums[1] = 2 + 7 = 9`, returning index pair `[0, 1]`.' },
        { id: 'dsa_arr_q3', topic: 'Arrays & Hash Maps', subtopic: 'Hash Collision Defenses', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which techniques resolve hash collisions in hash map implementations? (Select ALL correct answers)', options: ['Separate Chaining (Linked Lists / Red-Black Trees)', 'Open Addressing (Linear / Quadratic Probing)', 'Double Hashing', 'Array sorting'], correct: [0, 1, 2], explanation: 'Separate chaining and open addressing are canonical hash collision resolution strategies.' },
        { id: 'dsa_arr_q4', topic: 'Arrays & Hash Maps', subtopic: 'Prefix Sum Array', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'Why is a Prefix Sum array useful for subsegment queries?', options: ['Sorts the array', 'Allows computing contiguous subarray sums in O(1) time after O(N) preprocessing', 'Reduces space to O(1)', 'Reverses array'], correct: 1, explanation: 'Sum of elements from index L to R is `Prefix[R] - Prefix[L-1]` in O(1) time.' },
        { id: 'dsa_arr_q5', topic: 'Arrays & Hash Maps', subtopic: 'Hash Table Operations Count', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'How many hash collisions occur when keys 10, 20, 30 are inserted into a hash table of size 10 using `hash(k) = k % 10`?', correct: 2, explanation: '10 % 10 = 0 (no collision). 20 % 10 = 0 (1st collision). 30 % 10 = 0 (2nd collision). Total = 2 collisions.' },

        // Topic 2: Two Pointers & Sliding Window (5 Qs)
        { id: 'dsa_win_q1', topic: 'Two Pointers & Sliding Window', subtopic: 'Fixed Window', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which algorithm design pattern is optimal for finding the maximum sum subarray of fixed size K in an array of length N?', options: ['Two Pointers', 'Sliding Window', 'Binary Search', 'Topological Sort'], correct: 1, explanation: 'Sliding window maintains a running sum by shifting a window of size K in O(N) linear time.' },
        { id: 'dsa_win_q2', topic: 'Two Pointers & Sliding Window', subtopic: 'Sorted Two Sum', type: 'CODE_OUTPUT', difficulty: 'BEGINNER', question: 'Using Two Pointers on sorted array `[1, 3, 4, 6, 8, 10]` with target 12, what element pair is found?', options: ['[1, 10]', '[4, 8]', '[3, 8]', '[6, 8]'], correct: 1, explanation: '`4 + 8 = 12`. Left pointer at 4, right pointer at 8 sum to target 12.' },
        { id: 'dsa_win_q3', topic: 'Two Pointers & Sliding Window', subtopic: 'Fast/Slow Pointer Applications', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which problems can be solved efficiently using Fast & Slow (Floyd\'s Tortoise & Hare) Pointers? (Select ALL correct answers)', options: ['Detecting cycles in a Linked List', 'Finding the middle node of a Linked List', 'Detecting the starting node of a Linked List cycle', 'Sorting an array'], correct: [0, 1, 2], explanation: 'Floyd\'s cycle detection uses dual-speed pointers to detect loops and list midpoints in O(N) time and O(1) space.' },
        { id: 'dsa_win_q4', topic: 'Two Pointers & Sliding Window', subtopic: 'Dynamic Window Shrink Condition', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', question: 'When implementing "Minimum Window Substring", when should the left pointer of the sliding window shrink?', options: ['When target character count constraint is violated', 'When the current window contains ALL required characters from the target string', 'After processing 5 elements', 'When array is sorted'], correct: 1, explanation: 'Shrink the left pointer as long as the current window remains valid to minimize window length.' },
        { id: 'dsa_win_q5', topic: 'Two Pointers & Sliding Window', subtopic: 'Max Subarray Sum Calculation', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What is the maximum sum contiguous subarray in `[-2, 1, -3, 4, -1, 2, 1, -5, 4]` using Kadane\'s algorithm?', correct: 6, explanation: 'Subarray `[4, -1, 2, 1]` has maximum sum = 6.' },

        // Topic 3: Stacks & Queues (5 Qs)
        { id: 'dsa_stack_q1', topic: 'Stacks & Queues', subtopic: 'LIFO Execution', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which data structure enforces Last-In, First-Out (LIFO) order of element removal?', options: ['Queue', 'Stack', 'Linked List', 'Min-Heap'], correct: 1, explanation: 'A Stack processes the most recently pushed element first (LIFO).' },
        { id: 'dsa_stack_q2', topic: 'Stacks & Queues', subtopic: 'Valid Parentheses', type: 'CODE_OUTPUT', difficulty: 'BEGINNER', question: 'What boolean output is returned by validating string `"{[()]}"` using a Stack?', options: ['true', 'false', 'null', 'undefined'], correct: 0, explanation: 'All matching brackets pop cleanly from the stack, returning `true`.' },
        { id: 'dsa_stack_q3', topic: 'Stacks & Queues', subtopic: 'Monotonic Stack Applications', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which algorithmic problems benefit from Monotonic Stack data structures? (Select ALL correct answers)', options: ['Next Greater Element lookup', 'Largest Rectangle in Histogram', 'Trapping Rain Water', 'Binary Search'], correct: [0, 1, 2], explanation: 'Monotonic stacks efficiently track nearest greater/smaller elements in linear O(N) time.' },
        { id: 'dsa_stack_q4', topic: 'Stacks & Queues', subtopic: 'Queue via Stacks', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'How many Stacks are required to implement a First-In, First-Out (FIFO) Queue?', options: ['1 Stack', '2 Stacks (In-stack and Out-stack)', '3 Stacks', '4 Stacks'], correct: 1, explanation: 'Two stacks (one for enqueue, one for dequeue) yield amortized O(1) FIFO operations.' },
        { id: 'dsa_stack_q5', topic: 'Stacks & Queues', subtopic: 'Postfix Evaluation Calculation', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What is the numeric result of evaluating the Postfix expression `"5 3 + 2 *"` using a stack?', correct: 16, explanation: '`5 + 3 = 8`, then `8 * 2 = 16`.' },

        // Topic 4: Trees & Search Algorithms (5 Qs)
        { id: 'dsa_tree_q1', topic: 'Trees & Search Algorithms', subtopic: 'BST Search Complexity', type: 'MCQ', difficulty: 'BEGINNER', question: 'What is the time complexity to search for a key in a balanced Binary Search Tree (BST)?', options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'], correct: 1, explanation: 'A balanced BST eliminates half of the remaining nodes per comparison, taking O(log N) time.' },
        { id: 'dsa_tree_q2', topic: 'Trees & Search Algorithms', subtopic: 'In-Order BST Traversal', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which tree traversal order visits a Binary Search Tree (BST) keys in strictly ascending sorted order?', options: ['Pre-Order (Root, Left, Right)', 'In-Order (Left, Root, Right)', 'Post-Order (Left, Right, Root)', 'Level-Order'], correct: 1, explanation: 'In-Order traversal visits left subtree, root, right subtree, producing sorted output.' },
        { id: 'dsa_tree_q3', topic: 'Trees & Search Algorithms', subtopic: 'Self-Balancing BSTs', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which tree data structures maintain balance to guarantee O(log N) operations? (Select ALL correct answers)', options: ['AVL Tree', 'Red-Black Tree', 'B-Tree', 'Unbalanced BST'], correct: [0, 1, 2], explanation: 'AVL, Red-Black, and B-Trees enforce self-balancing invariants to prevent O(N) degeneration.' },
        { id: 'dsa_tree_q4', topic: 'Trees & Search Algorithms', subtopic: 'Lowest Common Ancestor (LCA)', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'When finding the Lowest Common Ancestor (LCA) of nodes p and q in a BST, how do you decide to search the right subtree?', options: ['If `root.val < p.val` and `root.val < q.val`', 'If `root.val > p.val`', 'If `root.val == null`', 'If tree is empty'], correct: 0, explanation: 'If root value is smaller than both target values, the LCA must reside in the right subtree.' },
        { id: 'dsa_tree_q5', topic: 'Trees & Search Algorithms', subtopic: 'Max Nodes Count', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What is the maximum number of nodes in a complete binary tree of height H = 3? (Height of root = 0)', correct: 15, explanation: 'Max nodes = `2^(H+1) - 1` = `2^4 - 1` = 15 nodes.' },

        // Topic 5: Graph Algorithms & Shortest Path (5 Qs)
        { id: 'dsa_graph_q1', topic: 'Graph Algorithms', subtopic: 'BFS vs DFS', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which graph traversal algorithm guarantees finding the shortest path in an unweighted graph?', options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Pre-order Traversal', 'Kruskal\'s Algorithm'], correct: 1, explanation: 'BFS explores nodes layer by layer (level order), ensuring the first discovery of a target is the shortest path.' },
        { id: 'dsa_graph_q2', topic: 'Graph Algorithms', subtopic: 'Dijkstra Priority Queue', type: 'MCQ', difficulty: 'BEGINNER', question: 'What data structure is used by Dijkstra\'s algorithm to extract the next minimum tentative distance vertex?', options: ['Queue', 'Min-Heap Priority Queue', 'Stack', 'Array'], correct: 1, explanation: 'A Min-Heap extracts the minimum distance vertex in O(log V) time.' },
        { id: 'dsa_graph_q3', topic: 'Graph Algorithms', subtopic: 'Cycle Detection & Topological Sort', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which conditions must a graph satisfy for a valid Topological Sort to exist? (Select ALL correct answers)', options: ['Graph must be Directed', 'Graph must be Acyclic (DAG - Directed Acyclic Graph)', 'Graph must be Undirected', 'Graph must contain cycles'], correct: [0, 1], explanation: 'Topological sorting requires a Directed Acyclic Graph (DAG).' },
        { id: 'dsa_graph_q4', topic: 'Graph Algorithms', subtopic: 'Negative Edge Weights', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'Why does Dijkstra\'s algorithm fail on graphs containing negative edge weights?', options: ['Min-heap crashes', 'Dijkstra greedily assumes a finalized node distance cannot be improved by subsequent paths', 'Dijkstra only works on trees', 'Negative edges create 0 distance'], correct: 1, explanation: 'Greedy selection fails because subsequent negative edge paths could yield shorter overall distances.' },
        { id: 'dsa_graph_q5', topic: 'Graph Algorithms', subtopic: 'Shortest Path Distance Calculation', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'In a graph with nodes A, B, C and edge weights A-B=4, B-C=3, A-C=9, what is the shortest path distance from A to C?', correct: 7, explanation: 'Path A -> B -> C has distance 4 + 3 = 7, which is shorter than direct edge A-C (9).' },

        // Topic 6: Dynamic Programming (5 Qs)
        { id: 'dsa_dp_q1', topic: 'Dynamic Programming', subtopic: 'Core DP Properties', type: 'CONCEPTUAL', difficulty: 'BEGINNER', question: 'What two properties must a problem satisfy to be solvable via Dynamic Programming (DP)?', options: ['Random inputs and linear arrays', 'Overlapping subproblems and optimal substructure', 'Sorted arrays and hash collisions', 'Constant memory footprint'], correct: 1, explanation: 'Optimal substructure allows building solutions from optimal sub-solutions; overlapping subproblems allow memoization.' },
        { id: 'dsa_dp_q2', topic: 'Dynamic Programming', subtopic: 'Climbing Stairs DP', type: 'CODE_OUTPUT', difficulty: 'BEGINNER', question: 'You can climb 1 or 2 steps. How many distinct ways can you reach step N = 4?', options: ['3', '5', '8', '10'], correct: 1, explanation: 'Fibonacci sequence: N=1 -> 1, N=2 -> 2, N=3 -> 3, N=4 -> 5 ways.' },
        { id: 'dsa_dp_q3', topic: 'Dynamic Programming', subtopic: 'Memoization vs Tabulation', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which statements distinguish Top-Down Memoization from Bottom-Up Tabulation? (Select ALL correct answers)', options: ['Top-Down uses recursion with a lookup cache', 'Bottom-Up builds solution iteratively in an array or table', 'Bottom-Up avoids call stack overhead', 'Top-Down requires sorting input arrays'], correct: [0, 1, 2], explanation: 'Top-Down uses cached recursion; Bottom-Up fills tables iteratively without recursion stack limits.' },
        { id: 'dsa_dp_q4', topic: 'Dynamic Programming', subtopic: '0/1 Knapsack Decision', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', question: 'In 0/1 Knapsack, for item i with weight w and value v at capacity W, what choice is evaluated?', options: ['Always pick item i', 'Max of excluding item `dp[i-1][W]` OR including item `v + dp[i-1][W-w]`', 'Sort items by ratio', 'Divide item into fractions'], correct: 1, explanation: '0/1 Knapsack takes max of excluding item vs including item if weight capacity permits.' },
        { id: 'dsa_dp_q5', topic: 'Dynamic Programming', subtopic: 'Longest Common Subsequence Calculation', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What is the length of the Longest Common Subsequence (LCS) between strings `"abcde"` and `"ace"`?', correct: 3, explanation: 'LCS is `"ace"`, with length = 3.' }
      ],
      milestones: [
        { id: 'm1', title: 'Phase 1: Arrays, Hash Maps, & Two Pointers', topic: 'Arrays & Hash Maps', week: 1, durationDays: 7 },
        { id: 'm2', title: 'Phase 2: Sliding Window & Fast/Slow Pointers', topic: 'Two Pointers & Sliding Window', week: 2, durationDays: 7 },
        { id: 'm3', title: 'Phase 3: Stacks, Queues, & Binary Search', topic: 'Stacks & Queues', week: 3, durationDays: 7 },
        { id: 'm4', title: 'Phase 4: Trees, BSTs, & BFS/DFS Traversals', topic: 'Trees & Search Algorithms', week: 4, durationDays: 7 },
        { id: 'm5', title: 'Phase 5: Graph Theory, Topological Sort, & Shortest Path', topic: 'Graph Algorithms & Shortest Path', week: 5, durationDays: 7 },
        { id: 'm6', title: 'Phase 6: Dynamic Programming Patterns (1D & 2D)', topic: 'Dynamic Programming', week: 6, durationDays: 7 }
      ]
    },

    // =========================================================================
    // 4. CLOUD ENGINEERING & DEVOPS (30 QUESTIONS)
    // =========================================================================
    {
      id: 'devops',
      name: 'Cloud Engineering & DevOps',
      icon: 'ph-cloud-tower',
      description: 'Master Cloud Infrastructure: Linux, Shell Scripting, Docker, Kubernetes, Terraform, CI/CD, Prometheus, and Observability.',
      diagnostics: [
        // Topic 1: Linux & Shell Scripting (5 Qs)
        { id: 'dev_lin_q1', topic: 'Linux & Shell Scripting', subtopic: 'Process Termination Signals', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which Linux signal allows a running process to perform graceful cleanup before shutting down?', options: ['SIGKILL (9)', 'SIGTERM (15)', 'SIGSTOP (19)', 'SIGSEGV (11)'], correct: 1, explanation: 'SIGTERM (15) allows processes to catch the signal and release resources before exiting. SIGKILL forces instant death.' },
        { id: 'dev_lin_q2', topic: 'Linux & Shell Scripting', subtopic: 'File Permissions', type: 'CODE_OUTPUT', difficulty: 'BEGINNER', question: 'What permissions are set by executing `chmod 755 script.sh`?', options: ['rwxr-xr-x (User: rwx, Group: r-x, Others: r-x)', 'rw-r--r-- (User: rw, Group: r, Others: r)', 'rwxrwxrwx (All permissions)', 'r------- (User read only)'], correct: 0, explanation: '7 = rwx (4+2+1), 5 = r-x (4+0+1), 5 = r-x (4+0+1).' },
        { id: 'dev_lin_q3', topic: 'Linux & Shell Scripting', subtopic: 'Linux Pipe Redirection', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which Linux commands filter, search, and process text streams in shell pipelines? (Select ALL correct answers)', options: ['`grep`', '`awk`', '`sed`', '`fdisk`'], correct: [0, 1, 2], explanation: '`grep`, `awk`, and `sed` are core Linux stream text processing tools. `fdisk` is disk partitioning.' },
        { id: 'dev_lin_q4', topic: 'Linux & Shell Scripting', subtopic: 'System Load Average', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'What does a Linux system load average of 4.0 mean on a 4-core CPU server?', options: ['Server CPU is 400% overloaded', 'All 4 CPU cores are fully utilized (100% load) with 0 processes waiting in queue', 'Memory is full', 'Disk is corrupted'], correct: 1, explanation: 'Load average matches available CPU core count when cores are fully utilized with no queue waiting.' },
        { id: 'dev_lin_q5', topic: 'Linux & Shell Scripting', subtopic: 'Numeric Permissions Calculation', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What octal numeric value represents `rwxr-x---` file permissions in Linux?', correct: 750, explanation: 'rwx = 7, r-x = 5, --- = 0 -> 750.' },

        // Topic 2: Docker & Containerization (5 Qs)
        { id: 'dev_doc_q1', topic: 'Docker & Containerization', subtopic: 'Containers vs VMs', type: 'MCQ', difficulty: 'BEGINNER', question: 'What is the primary architectural advantage of Docker containers over traditional Virtual Machines (VMs)?', options: ['Containers run full guest OS kernels', 'Containers share the host OS kernel, making them lightweight and fast to start', 'Containers do not require networking', 'Containers run only on cloud hardware'], correct: 1, explanation: 'Containers share host kernel isolation, eliminating guest OS boot times and RAM overhead.' },
        { id: 'dev_doc_q2', topic: 'Docker & Containerization', subtopic: 'Dockerfile Entrypoint', type: 'MCQ', difficulty: 'BEGINNER', question: 'In a Dockerfile, what command specifies the default executable command when container starts?', options: ['RUN', 'COPY', 'ENTRYPOINT', 'EXPOSE'], correct: 2, explanation: 'ENTRYPOINT configures the binary executable that runs when the container starts.' },
        { id: 'dev_doc_q3', topic: 'Docker & Containerization', subtopic: 'Multi-stage Builds', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'What benefits do Docker Multi-Stage builds deliver? (Select ALL correct answers)', options: ['Dramatically reduces final production container image size', 'Leaves build tools (compilers, SDKs) out of the production image', 'Improves container security by shrinking attack surface', 'Runs containers without Docker daemon'], correct: [0, 1, 2], explanation: 'Multi-stage builds copy compiled artifacts into clean slim images, stripping build tool dependencies.' },
        { id: 'dev_doc_q4', topic: 'Docker & Containerization', subtopic: 'Container Storage Persistence', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', question: 'Your database container restarts and loses all written records. How do you ensure persistent storage across container lifecycles?', options: ['Recompile Docker', 'Mount a Docker Named Volume or Host Bind Mount to the container storage path', 'Increase container RAM', 'Use docker commit'], correct: 1, explanation: 'Docker Volumes store data outside container ephemeral writable layers.' },
        { id: 'dev_doc_q5', topic: 'Docker & Containerization', subtopic: 'Exposed Container Port', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'In `docker run -p 8080:80 nginx`, what port on the host machine listens for incoming HTTP traffic?', correct: 8080, explanation: '`-p hostPort:containerPort` maps host port 8080 to container port 80.' },

        // Topic 3: Infrastructure as Code (Terraform) (5 Qs)
        { id: 'dev_tf_q1', topic: 'Infrastructure as Code (Terraform)', subtopic: 'Declarative IaC', type: 'MCQ', difficulty: 'BEGINNER', question: 'What is Infrastructure as Code (IaC) with tools like Terraform?', options: ['Manual bash execution', 'Defining and provisioning cloud infrastructure declaratively using version-controlled configuration files', 'Compiling C++', 'Prompt engineering'], correct: 1, explanation: 'IaC manages infrastructure state declaratively via version-controlled code.' },
        { id: 'dev_tf_q2', topic: 'Terraform Commands', subtopic: 'Terraform Plan', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which Terraform command previews infrastructure additions, modifications, and destructions without applying changes?', options: ['terraform init', 'terraform plan', 'terraform apply', 'terraform destroy'], correct: 1, explanation: '`terraform plan` compares current state against desired config to generate execution plans.' },
        { id: 'dev_tf_q3', topic: 'Terraform State Management', subtopic: 'State Locking', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Why is remote state locking (e.g. AWS S3 with DynamoDB table lock) critical for team Terraform pipelines? (Select ALL correct answers)', options: ['Prevents concurrent terraform apply executions', 'Protects terraform.tfstate from corruption during simultaneous deployments', 'Encrypts secrets in state files', 'Compiles Go code'], correct: [0, 1, 2], explanation: 'Remote state with DynamoDB locking prevents race conditions and corrupting shared state files.' },
        { id: 'dev_tf_q4', topic: 'Terraform Modules', subtopic: 'DRY Architecture', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'What is the primary architectural purpose of reusable Terraform Modules?', options: ['Speed up internet', 'Encapsulate infrastructure resources into reusable, versioned building blocks across environments', 'Replace Docker', 'Disable VPCs'], correct: 1, explanation: 'Modules encapsulate infrastructure code to eliminate duplication across environments.' },
        { id: 'dev_tf_q5', topic: 'Terraform Execution Exit Code', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What exit code is returned by `terraform plan -detailed-exitcode` when changes are present in the plan execution?', correct: 2, explanation: 'Exit code 0 = Succeeded (no changes), 1 = Error, 2 = Succeeded (changes present).' },

        // Topic 4: Kubernetes Orchestration (5 Qs)
        { id: 'dev_k8s_q1', topic: 'Kubernetes Orchestration', subtopic: 'Pods Definition', type: 'MCQ', difficulty: 'BEGINNER', question: 'What is the smallest deployable computing unit in Kubernetes?', options: ['Container', 'Pod', 'Node', 'Cluster'], correct: 1, explanation: 'A Pod wraps one or more co-located containers sharing network and storage namespaces.' },
        { id: 'dev_k8s_q2', topic: 'Kubernetes Orchestration', subtopic: 'Ingress Controller', type: 'MCQ', difficulty: 'BEGINNER', question: 'What component manages external HTTP/HTTPS routing into cluster services in Kubernetes?', options: ['Kubelet', 'Ingress Controller', 'Etcd', 'Container Runtime'], correct: 1, explanation: 'Ingress Controllers manage entry HTTP/HTTPS reverse proxy routing for cluster services.' },
        { id: 'dev_k8s_q3', topic: 'Kubernetes Orchestration', subtopic: 'Kubernetes Architecture', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which components form the Kubernetes Control Plane (Master Node)? (Select ALL correct answers)', options: ['`kube-apiserver`', '`etcd`', '`kube-scheduler`', '`kube-controller-manager`'], correct: [0, 1, 2, 3], explanation: 'API server, etcd, scheduler, and controller manager compose the control plane.' },
        { id: 'dev_k8s_q4', topic: 'Kubernetes Orchestration', subtopic: 'HPA Autoscaling', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', question: 'Your web app Pods experience high CPU load during morning spikes. Which Kubernetes resource automatically adjusts Pod replica count based on CPU metrics?', options: ['DaemonSet', 'HorizontalPodAutoscaler (HPA)', 'StatefulSet', 'PersistentVolume'], correct: 1, explanation: 'HPA automatically scales deployment replica counts based on observed CPU/RAM utilization.' },
        { id: 'dev_k8s_q5', topic: 'Kubernetes Orchestration', subtopic: 'Default Cluster IP Port', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What is the default TCP port number for the Kubernetes API Server (`kube-apiserver`)?', correct: 6443, explanation: '`kube-apiserver` listens on HTTPS port 6443 by default.' },

        // Topic 5: CI/CD Pipelines (5 Qs)
        { id: 'dev_cicd_q1', topic: 'CI/CD Pipelines', subtopic: 'Continuous Deployment vs Delivery', type: 'MCQ', difficulty: 'BEGINNER', question: 'What distinguishes Continuous Deployment from Continuous Delivery?', options: ['Delivery automates builds; Deployment automates unit tests', 'Delivery keeps code release-ready for manual trigger; Deployment automatically releases every passed commit directly to production', 'Delivery uses Jenkins', 'Delivery requires Docker'], correct: 1, explanation: 'Continuous Deployment automatically releases validated commits to production without human intervention.' },
        { id: 'dev_cicd_q2', topic: 'CI/CD Pipelines', subtopic: 'Pipeline Stages', type: 'CODE_OUTPUT', difficulty: 'BEGINNER', question: 'In a GitHub Actions workflow, what block defines environmental prerequisites and steps?', options: ['jobs:', 'triggers:', 'webhooks:', 'servers:'], correct: 0, explanation: 'Workflows consist of one or more `jobs:` executing build/test steps.' },
        { id: 'dev_cicd_q3', topic: 'CI/CD Pipelines', subtopic: 'Artifact Caching', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which practices accelerate CI/CD pipeline execution times? (Select ALL correct answers)', options: ['Caching dependency directories (`node_modules`, `.m2`) across runs', 'Running independent test suites in parallel matrix jobs', 'Using lightweight Docker runner images', 'Running all tests sequentially on 1 core'], correct: [0, 1, 2], explanation: 'Dependency caching, test matrix parallelization, and small runner images speed up pipelines.' },
        { id: 'dev_cicd_q4', topic: 'CI/CD Pipelines', subtopic: 'GitOps Deployment', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'What is the core principle of GitOps (e.g. using ArgoCD or Flux)?', options: ['Editing production servers manually', 'Git repository serves as the single source of truth for desired infrastructure and application state', 'Disabling Git branches', 'Writing code in production'], correct: 1, explanation: 'GitOps continuously synchronizes cluster state with declaratively defined Git repository configs.' },
        { id: 'dev_cicd_q5', topic: 'CI/CD Pipelines', subtopic: 'Pipeline Success Exit Code', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What numeric process exit code indicates successful execution of a pipeline bash script test command?', correct: 0, explanation: 'Exit code 0 signifies successful, error-free command completion.' },

        // Topic 6: Observability & Monitoring (5 Qs)
        { id: 'dev_obs_q1', topic: 'Observability & Monitoring', subtopic: 'Observability Triad', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which three telemetry pillars form modern cloud application Observability?', options: ['HTML, CSS, JS', 'Logs, Metrics, Traces', 'CPU, RAM, Disk', 'Build, Test, Deploy'], correct: 1, explanation: 'Observability relies on Logs (events), Metrics (aggregates), and Traces (end-to-end request flows).' },
        { id: 'dev_obs_q2', topic: 'Observability & Monitoring', subtopic: 'Prometheus Pull Model', type: 'MCQ', difficulty: 'BEGINNER', question: 'How does Prometheus collect metrics from monitored target applications?', options: ['Pushing metrics over SMTP', 'Scraping (pulling) metrics over HTTP from `/metrics` endpoints', 'Reading text files', 'Using SQL queries'], correct: 1, explanation: 'Prometheus uses a pull model, periodically scraping HTTP `/metrics` endpoints.' },
        { id: 'dev_obs_q3', topic: 'Observability & Monitoring', subtopic: 'Distributed Tracing', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'What information is captured by Distributed Tracing tools (OpenTelemetry, Jaeger)? (Select ALL correct answers)', options: ['Trace ID propagated across microservices', 'Span duration for individual database queries and HTTP calls', 'End-to-end latency breakdowns for user requests', 'Full database passwords'], correct: [0, 1, 2], explanation: 'Tracing records cross-microservice request journeys via trace IDs and spans.' },
        { id: 'dev_obs_q4', topic: 'Observability & Monitoring', subtopic: 'SLO vs SLA', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'What is the distinction between an SLO (Service Level Objective) and an SLA (Service Level Agreement)?', options: ['SLO is a legal contract with financial penalties; SLA is an internal engineering goal', 'SLO is an internal target metric (e.g. 99.9% uptime); SLA is a legal contract detailing penalties for breach', 'SLO applies only to RAM', 'They are identical'], correct: 1, explanation: 'SLOs guide internal team objectives; SLAs are binding commercial contracts with customers.' },
        { id: 'dev_obs_q5', topic: 'Observability & Monitoring', subtopic: 'Four Nines Availability Calculation', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'How many minutes of total downtime per year are allowed under 99.99% ("four nines") service availability uptime?', correct: 52, explanation: '0.01% of 1 year (525,600 minutes) = 52.56 minutes downtime allowed per year.' }
      ],
      milestones: [
        { id: 'm1', title: 'Phase 1: Linux Administration & Shell Scripting', topic: 'Linux & Shell Scripting', week: 1, durationDays: 7 },
        { id: 'm2', title: 'Phase 2: Docker Containerization & Multi-stage Builds', topic: 'Docker & Containerization', week: 2, durationDays: 7 },
        { id: 'm3', title: 'Phase 3: CI/CD Pipelines (GitHub Actions & GitLab CI)', topic: 'CI/CD Pipelines', week: 3, durationDays: 7 },
        { id: 'm4', title: 'Phase 4: Kubernetes Orchestration & Helm Charts', topic: 'Kubernetes Orchestration', week: 4, durationDays: 7 },
        { id: 'm5', title: 'Phase 5: Terraform & Cloud Provisioning (AWS/GCP)', topic: 'Infrastructure as Code (Terraform)', week: 5, durationDays: 7 },
        { id: 'm6', title: 'Phase 6: Observability with Prometheus, Grafana & Jaeger', topic: 'Observability & Monitoring', week: 6, durationDays: 7 }
      ]
    },

    // =========================================================================
    // 5. CYBERSECURITY & ETHICAL HACKING (30 QUESTIONS)
    // =========================================================================
    {
      id: 'cybersecurity',
      name: 'Cybersecurity & Ethical Hacking',
      icon: 'ph-shield-check',
      description: 'Master Information Security Principles, Application Security, OWASP Top 10, Cryptography, IAM, Zero Trust Architecture, and Red Team Operations.',
      diagnostics: [
        // Topic 1: Information Security Principles (5 Qs)
        { id: 'sec_cia_q1', topic: 'Information Security Principles', subtopic: 'CIA Triad', type: 'MCQ', difficulty: 'BEGINNER', question: 'What three core security pillars form the CIA Triad?', options: ['Control, Inspection, Auth', 'Confidentiality, Integrity, Availability', 'Cipher, Inspection, Audit', 'Certificates, Identity, Access'], correct: 1, explanation: 'Confidentiality, Integrity, and Availability form the foundational CIA security triad.' },
        { id: 'sec_cia_q2', topic: 'Information Security Principles', subtopic: 'Non-Repudiation', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which cryptographic service guarantees that a sender cannot deny having sent a specific transmitted message?', options: ['Symmetric Encryption', 'Non-Repudiation (via Digital Signatures)', 'Compression', 'Load balancing'], correct: 1, explanation: 'Digital signatures bind a sender\'s private key to a message digest, providing non-repudiation.' },
        { id: 'sec_cia_q3', topic: 'Information Security Principles', subtopic: 'Threat Modeling', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which threats compose the STRIDE threat modeling framework? (Select ALL correct answers)', options: ['Spoofing & Tampering', 'Repudiation & Information Disclosure', 'Denial of Service & Elevation of Privilege', 'Storage Compression'], correct: [0, 1, 2], explanation: 'STRIDE = Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege.' },
        { id: 'sec_cia_q4', topic: 'Information Security Principles', subtopic: 'Defense in Depth', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'What is the primary principle behind Defense in Depth security design?', options: ['Relying on one firewall', 'Layering multiple independent security controls so if one layer fails, subsequent layers prevent breach', 'Using open source code only', 'Disabling internal networks'], correct: 1, explanation: 'Defense in depth uses redundant, layered defensive mechanisms across network, host, app, and data.' },
        { id: 'sec_cia_q5', topic: 'Information Security Principles', subtopic: 'CVSS Critical Score Threshold', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What is the minimum base score threshold (out of 10.0) for a vulnerability to be rated CRITICAL in CVSS v3.1?', correct: 9.0, explanation: 'CVSS v3.1 Critical rating spans base scores from 9.0 to 10.0.' },

        // Topic 2: Application Security & OWASP (5 Qs)
        { id: 'sec_app_q1', topic: 'Application Security & Injection Defenses', subtopic: 'SQL Injection Defense', type: 'MCQ', difficulty: 'BEGINNER', question: 'What technical control eliminates SQL Injection vulnerabilities completely?', options: ['JavaScript regex input validation', 'Parameterized Queries / Prepared Statements', 'Encrypting hard drives', 'Hiding error logs'], correct: 1, explanation: 'Parameterized queries compile SQL statements beforehand, keeping user inputs strictly as data.' },
        { id: 'sec_app_q2', topic: 'Application Security & Injection Defenses', subtopic: 'XSS Types', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which type of Cross-Site Scripting (XSS) stores malicious payloads permanently inside database records?', options: ['Reflected XSS', 'Stored (Persistent) XSS', 'DOM-based XSS', 'Blind SQLi'], correct: 1, explanation: 'Stored XSS persists malicious scripts in backend databases, serving them to subsequent users.' },
        { id: 'sec_app_q3', topic: 'Application Security & Injection Defenses', subtopic: 'OWASP Top 10 Defenses', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which practices prevent Broken Access Control (OWASP #1)? (Select ALL correct answers)', options: ['Enforcing server-side authorization checks on every endpoint', 'Disabling directory listing on web servers', 'Using indirect object references (GUIDs) instead of sequential IDs', 'Relying on hidden client UI buttons'], correct: [0, 1, 2], explanation: 'Server-side authorization checks, disabling directory listing, and GUID references prevent unauthorized access.' },
        { id: 'sec_app_q4', topic: 'Application Security & Injection Defenses', subtopic: 'SSRF Attack Mechanism', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', question: 'An attacker tricks a web app server into fetching internal cloud metadata (`http://169.254.169.254`). What vulnerability is exploited?', options: ['CSRF', 'Server-Side Request Forgery (SSRF)', 'XSS', 'Clickjacking'], correct: 1, explanation: 'SSRF induces vulnerable servers to issue unauthorized HTTP requests to internal resource IPs.' },
        { id: 'sec_app_q5', topic: 'Application Security & Injection Defenses', subtopic: 'OWASP Top Position for Broken Access Control', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What is the numerical ranking position of Broken Access Control in the OWASP Top 10 (2021 edition)?', correct: 1, explanation: 'Broken Access Control holds position A01:2021 in OWASP Top 10.' },

        // Topic 3: Cryptography & PKI Infrastructure (5 Qs)
        { id: 'sec_cry_q1', topic: 'Cryptography & PKI Infrastructure', subtopic: 'Asymmetric vs Symmetric', type: 'MCQ', difficulty: 'BEGINNER', question: 'What separates Asymmetric Cryptography (RSA) from Symmetric Cryptography (AES)?', options: ['Symmetric uses public keys', 'Asymmetric uses public/private key pairs; Symmetric uses a shared single secret key', 'Asymmetric cannot be decrypted', 'Symmetric is for hashing'], correct: 1, explanation: 'Asymmetric cryptography uses key pairs for key exchange; symmetric uses a single key for fast bulk encryption.' },
        { id: 'sec_cry_q2', topic: 'Cryptography & PKI Infrastructure', subtopic: 'TLS Handshake Key Exchange', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which key exchange protocol enables Perfect Forward Secrecy (PFS) in modern TLS 1.3 handshakes?', options: ['Static RSA', 'Elliptic Curve Diffie-Hellman Ephemeral (ECDHE)', 'MD5', 'DES'], correct: 1, explanation: 'ECDHE generates ephemeral session keys per connection, ensuring past sessions stay secure if private keys compromise.' },
        { id: 'sec_cry_q3', topic: 'Cryptography & PKI Infrastructure', subtopic: 'Hashing Properties', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'What properties define cryptographically secure hash functions (e.g. SHA-256)? (Select ALL correct answers)', options: ['Pre-image resistance (One-way property)', 'Second pre-image resistance', 'Collision resistance', 'Reversibility with secret key'], correct: [0, 1, 2], explanation: 'Cryptographic hashes must be one-way, collision resistant, and pre-image resistant. They are NOT reversible.' },
        { id: 'sec_cry_q4', topic: 'Cryptography & PKI Infrastructure', subtopic: 'PKI Certificate Authorities', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'What role does a Certificate Authority (CA) perform in Public Key Infrastructure (PKI)?', options: ['Stores user passwords', 'Digitally signs X.509 SSL certificates to vouch for public key ownership', 'Encrypts hard drives', 'Generates symmetric keys'], correct: 1, explanation: 'CAs act as trusted third parties digitally signing X.509 certificates to verify domain ownership.' },
        { id: 'sec_cry_q5', topic: 'Cryptography & PKI Infrastructure', subtopic: 'AES Key Bit Length', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What is the maximum standard key bit length supported by Advanced Encryption Standard (AES)?', correct: 256, explanation: 'AES supports key lengths of 128, 192, and 256 bits.' },

        // Topic 4: Identity & Access Management (IAM) (5 Qs)
        { id: 'sec_iam_q1', topic: 'Identity & Access Management (IAM)', subtopic: 'Least Privilege', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which principle dictates that users and service accounts must receive only minimum required permissions?', options: ['Open Access', 'Principle of Least Privilege (PoLP)', 'Default Admin', 'Zero Encryption'], correct: 1, explanation: 'PoLP restricts user permissions strictly to necessary operational tasks.' },
        { id: 'sec_iam_q2', topic: 'Identity & Access Management (IAM)', subtopic: 'Multi-Factor Authentication', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which combination qualifies as true Multi-Factor Authentication (MFA)?', options: ['Password + PIN', 'Password (something you know) + Authenticator App TOTP code (something you have)', 'Two different passwords', 'Security question + PIN'], correct: 1, explanation: 'MFA requires 2+ independent factor categories (knowledge, possession, inherence).' },
        { id: 'sec_iam_q3', topic: 'Identity & Access Management (IAM)', subtopic: 'OAuth 2.0 vs OIDC', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which statements correctly distinguish OAuth 2.0 from OpenID Connect (OIDC)? (Select ALL correct answers)', options: ['OAuth 2.0 is an Authorization framework issuing Access Tokens', 'OpenID Connect (OIDC) is an Authentication layer built on top of OAuth 2.0 issuing ID Tokens', 'OAuth 2.0 provides user profile information natively', 'OIDC uses JWT ID tokens'], correct: [0, 1, 3], explanation: 'OAuth 2.0 handles authorization (access tokens); OIDC adds authentication (JWT ID tokens).' },
        { id: 'sec_iam_q4', topic: 'Identity & Access Management (IAM)', subtopic: 'RBAC vs ABAC', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'What advantage does Attribute-Based Access Control (ABAC) offer over Role-Based Access Control (RBAC)?', options: ['ABAC is simpler', 'ABAC evaluates contextual attributes (time, location, device risk, IP) for fine-grained dynamic access decisions', 'ABAC disables passwords', 'RBAC requires active directory'], correct: 1, explanation: 'ABAC makes dynamic authorization decisions using user, resource, and environmental attributes.' },
        { id: 'sec_iam_q5', topic: 'Identity & Access Management (IAM)', subtopic: 'TOTP Validity Window', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What is the standard time step window (in seconds) for generating Time-based One-Time Passwords (TOTP RFC 6238)?', correct: 30, explanation: 'RFC 6238 specifies a standard 30-second time-step window for TOTP token generation.' },

        // Topic 5: Zero Trust Architecture (5 Qs)
        { id: 'sec_zt_q1', topic: 'Zero Trust Architecture', subtopic: 'Zero Trust Core Principle', type: 'MCQ', difficulty: 'BEGINNER', question: 'What primary rule governs Zero Trust Network Architecture?', options: ['Trust internal networks', 'Never Trust, Always Verify — authenticate and authorize every request regardless of location', 'Disable multi-factor authentication', 'Encrypt outbound emails only'], correct: 1, explanation: 'Zero Trust eliminates implicit trust based on network perimeter location.' },
        { id: 'sec_zt_q2', topic: 'Zero Trust Architecture', subtopic: 'Microsegmentation', type: 'MCQ', difficulty: 'BEGINNER', question: 'How does network microsegmentation enhance security in Zero Trust environments?', options: ['Increases Wi-Fi range', 'Divides networks into isolated granular zones to prevent lateral movement by attackers', 'Disables firewalls', 'Deletes logs'], correct: 1, explanation: 'Microsegmentation restricts east-west traffic movement inside data centers.' },
        { id: 'sec_zt_q3', topic: 'Zero Trust Architecture', subtopic: 'Zero Trust Pillars', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which core pillars compose NIST SP 800-207 Zero Trust Architecture? (Select ALL correct answers)', options: ['Continuous Identity & Device Verification', 'Microsegmented Workload Isolation', 'Least Privilege Access Automation', 'Implicit Trust for VPN Connections'], correct: [0, 1, 2], explanation: 'Zero trust requires continuous verification, workload microsegmentation, and automated least privilege.' },
        { id: 'sec_zt_q4', topic: 'Zero Trust Architecture', subtopic: 'ZTNA vs VPN', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', question: 'Why are traditional remote-access VPNs being replaced by Zero Trust Network Access (ZTNA)?', options: ['VPNs are too cheap', 'VPNs grant broad network-level access once authenticated, enabling lateral attacker movement', 'ZTNA disables encryption', 'VPNs do not support IP addresses'], correct: 1, explanation: 'VPNs grant full network segment access, whereas ZTNA grants access strictly to specific authorized applications.' },
        { id: 'sec_zt_q5', topic: 'Zero Trust Architecture', subtopic: 'NIST Zero Trust SP Number', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What is the NIST Special Publication number for Zero Trust Architecture guidelines (NIST SP 800-xxx)?', correct: 207, explanation: 'NIST SP 800-207 defines official Zero Trust Architecture guidelines.' },

        // Topic 6: Red Team Operations & Ethical Hacking (5 Qs)
        { id: 'sec_red_q1', topic: 'Red Team Operations & Ethical Hacking', subtopic: 'Reconnaissance Tools', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which command-line security tool scans network ports, identifies open services, and detects OS versions?', options: ['Nmap', 'Wireshark', 'Metasploit', 'Burp Suite'], correct: 0, explanation: 'Nmap is the standard network discovery and vulnerability port scanner.' },
        { id: 'sec_red_q2', topic: 'Red Team Operations & Ethical Hacking', subtopic: 'Buffer Overflow', type: 'CODE_OUTPUT', difficulty: 'BEGINNER', question: 'Which unsafe C library function lacks bounds checking and causes stack buffer overflow vulnerabilities?', options: ['`strncpy()`', '`gets()`', '`fgets()`', '`snprintf()`'], correct: 1, explanation: '`gets()` reads input into a buffer without length checking, causing stack buffer overflows.' },
        { id: 'sec_red_q3', topic: 'Red Team Operations & Ethical Hacking', subtopic: 'Penetration Testing Phases', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which phases compose structured Ethical Hacking methodologies? (Select ALL correct answers)', options: ['Reconnaissance & Footprinting', 'Scanning & Enumeration', 'Exploitation & Privilege Escalation', 'Erasing evidence without reporting'], correct: [0, 1, 2], explanation: 'Ethical hacking involves recon, scanning, exploitation, post-exploitation, and reporting.' },
        { id: 'sec_red_q4', topic: 'Red Team Operations & Ethical Hacking', subtopic: 'Privilege Escalation', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', question: 'During a Linux pen-test, an attacker discovers a binary with SUID bit set owned by root (`-rwsr-xr-x`). How can this be exploited?', options: ['Binary runs with root permissions regardless of executing user', 'Binary deletes hard drive', 'Binary stops networking', 'Binary requires password'], correct: 0, explanation: 'SUID permission bits execute binaries with the file owner\'s privilege (root).' },
        { id: 'sec_red_q5', topic: 'Red Team Operations & Ethical Hacking', subtopic: 'Metasploit Default Listener Port', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What is the default listening port for Metasploit Reverse TCP Handlers (`exploit/multi/handler`)?', correct: 4444, explanation: 'Metasploit reverse TCP payloads use port 4444 as default listener.' }
      ],
      milestones: [
        { id: 'm1', title: 'Phase 1: Networking Fundamentals & Security Protocols', topic: 'Information Security Principles', week: 1, durationDays: 7 },
        { id: 'm2', title: 'Phase 2: Web Application Security & OWASP Top 10', topic: 'Application Security & Injection Defenses', week: 2, durationDays: 7 },
        { id: 'm3', title: 'Phase 3: Cryptography, PKI & Secure Communications', topic: 'Cryptography & PKI Infrastructure', week: 3, durationDays: 7 },
        { id: 'm4', title: 'Phase 4: Identity, Access Control & IAM Systems', topic: 'Identity & Access Management (IAM)', week: 4, durationDays: 7 },
        { id: 'm5', title: 'Phase 5: Network Defense, Firewalls & SIEM Monitoring', topic: 'Zero Trust Architecture', week: 5, durationDays: 7 },
        { id: 'm6', title: 'Phase 6: Ethical Hacking, Penetration Testing & Red Teaming', topic: 'Red Team Operations & Ethical Hacking', week: 6, durationDays: 7 }
      ]
    },

    // =========================================================================
    // 6. MOBILE APP DEVELOPMENT (REACT NATIVE & FLUTTER) (30 QUESTIONS)
    // =========================================================================
    {
      id: 'mobile',
      name: 'Mobile App Development (React Native & Flutter)',
      icon: 'ph-device-mobile',
      description: 'Master Cross-Platform Mobile Engineering: React Native Architecture, Flutter Widgets, Local Storage, Offline Synchronization, and Store Release.',
      diagnostics: [
        // Topic 1: Mobile Layout & Responsive UX (5 Qs)
        { id: 'mob_lay_q1', topic: 'Mobile Layout & Responsive UX', subtopic: 'Safe Area View', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which component ensures mobile UI content renders within screen boundaries, avoiding notches and camera cutouts?', options: ['DevicePixelRatio', 'SafeAreaView / SafeAreaProvider', 'ViewportMeta', 'FlexContainer'], correct: 1, explanation: 'SafeAreaView applies padding to offset content automatically from device notches and home indicator bars.' },
        { id: 'mob_lay_q2', topic: 'Mobile Layout & Responsive UX', subtopic: 'Flexbox Direction', type: 'MCQ', difficulty: 'BEGINNER', question: 'What is the default `flexDirection` in React Native style containers (unlike web CSS)?', options: ['row', 'column', 'row-reverse', 'grid'], correct: 1, explanation: 'React Native defaults `flexDirection` to `column`.' },
        { id: 'mob_lay_q3', topic: 'Mobile Layout & Responsive UX', subtopic: 'Touch Interactivity', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which touch components handle user tap interactions in React Native? (Select ALL correct answers)', options: ['`TouchableOpacity`', '`Pressable`', '`TouchableHighlight`', '`div`'], correct: [0, 1, 2], explanation: '`Pressable`, `TouchableOpacity`, and `TouchableHighlight` provide native touch feedback.' },
        { id: 'mob_lay_q4', topic: 'Mobile Layout & Responsive UX', subtopic: 'Scroll Performance', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', question: 'Rendering a list of 5,000 items using `ScrollView` causes your mobile app to lag and crash. What component should be used instead?', options: ['`View`', '`FlatList` or `FlashList`', '`Text`', '`Image`'], correct: 1, explanation: '`FlatList` virtualizes long lists, rendering only items currently visible on screen.' },
        { id: 'mob_lay_q5', topic: 'Mobile Layout & Responsive UX', subtopic: 'Standard Mobile DPI Calculation', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'If a screen dimension is 360 dp wide on a `@3x` retina mobile screen density, how many physical pixels wide is the display?', correct: 1080, explanation: 'Physical Pixels = dp * density scale = 360 * 3 = 1080 pixels.' },

        // Topic 2: React Native Architecture (5 Qs)
        { id: 'mob_rn_q1', topic: 'React Native Architecture', subtopic: 'JSI Architecture', type: 'MCQ', difficulty: 'BEGINNER', question: 'What architectural component replaces the JSON bridge in React Native\'s New Architecture?', options: ['HTML Canvas', 'JavaScript Interface (JSI) enabling direct C++ memory references to native APIs', 'Swift Compiler', 'iFrame'], correct: 1, explanation: 'JSI allows JavaScript to invoke native C++ methods directly without asynchronous JSON serialization.' },
        { id: 'mob_rn_q2', topic: 'React Native Architecture', subtopic: 'Hermes Engine', type: 'MCQ', difficulty: 'BEGINNER', question: 'What is the main benefit of the Hermes JavaScript engine in React Native mobile apps?', options: ['Compiles Python', 'Faster app TTI (Time to Interactive), reduced memory footprint, and pre-compiled bytecode', 'Disables CSS', 'Runs in cloud'], correct: 1, explanation: 'Hermes optimizes mobile JS startup by pre-compiling JavaScript into bytecode during build time.' },
        { id: 'mob_rn_q3', topic: 'React Native Architecture', subtopic: 'Native Modules', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which scenarios require custom React Native Native Modules (C++/Swift/Kotlin)? (Select ALL correct answers)', options: ['Integrating SDKs lacking React Native wrappers', 'Accessing low-level hardware sensors with zero-latency requirements', 'Re-using existing legacy Android/iOS native code', 'Centering a text label'], correct: [0, 1, 2], explanation: 'Native modules bridge native platform SDKs and high-performance C++ hardware features.' },
        { id: 'mob_rn_q4', topic: 'React Native Architecture', subtopic: 'Fabric Renderer', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'How does Fabric improve UI rendering speed in React Native?', options: ['Uses server rendering', 'Executes synchronous layout calculations in C++ and creates native views directly on the UI thread', 'Removes JS', 'Uses WebSockets'], correct: 1, explanation: 'Fabric eliminates async UI queue lag by performing layout and host view creation synchronously.' },
        { id: 'mob_rn_q5', topic: 'React Native Architecture', subtopic: 'React Native Major Release Version', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What major version of React Native introduced the New Architecture enabled by default (0.76 or higher)?', correct: 0, explanation: 'React Native versions are formatted 0.7x (major version index is 0).' },

        // Topic 3: Flutter Framework & Engine (5 Qs)
        { id: 'mob_flut_q1', topic: 'Flutter Framework & Engine', subtopic: 'Rendering Engine', type: 'MCQ', difficulty: 'BEGINNER', question: 'How does Flutter render UI widgets onto mobile screens?', options: ['Converts Dart into HTML inside WebView', 'Uses its own Impeller/Skia graphics engine to draw widgets directly onto screen canvas', 'Invokes Android XML', 'Delegates to browser'], correct: 1, explanation: 'Flutter compiles to ARM code and draws widget pixels directly via Impeller/Skia graphics engines.' },
        { id: 'mob_flut_q2', topic: 'Flutter Framework & Engine', subtopic: 'Stateless vs Stateful', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which Flutter widget class should be used when UI state changes dynamically in response to user interaction?', options: ['StatelessWidget', 'StatefulWidget', 'InheritedWidget', 'Container'], correct: 1, explanation: 'StatefulWidget maintains mutable `State` that rebuilds UI when `setState()` is invoked.' },
        { id: 'mob_flut_q3', topic: 'Flutter Framework & Engine', subtopic: 'State Management Libraries', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which reactive state management libraries are popular in the Flutter ecosystem? (Select ALL correct answers)', options: ['Riverpod / Provider', 'BLoC (Business Logic Component)', 'GetX', 'Redux for React'], correct: [0, 1, 2], explanation: 'Riverpod, BLoC, and GetX are idiomatic Flutter state management solutions.' },
        { id: 'mob_flut_q4', topic: 'Flutter Framework & Engine', subtopic: 'Dart AOT Compilation', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'Why does Flutter use Dart JIT for development and AOT for production builds?', options: ['JIT enables sub-second Hot Reload during development; AOT compiles to fast machine code for release', 'AOT is slow', 'JIT runs only on iOS', 'They are identical'], correct: 0, explanation: 'Dart JIT enables instant Hot Reloading; AOT compiles machine code binaries for maximum release performance.' },
        { id: 'mob_flut_q5', topic: 'Flutter Framework & Engine', subtopic: 'Flutter Widget Tree Depth Calculation', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'If a widget layout tree has 1 Root, 2 Column children, and each column contains 3 Buttons, how many total nodes exist in the tree?', correct: 9, explanation: '1 Root + 2 Columns + (2 * 3 Buttons) = 1 + 2 + 6 = 9 nodes.' },

        // Topic 4: Mobile Storage & Persistence (5 Qs)
        { id: 'mob_db_q1', topic: 'Mobile Storage & Persistence', subtopic: 'Fast Key-Value Storage', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which storage engine provides ultra-fast synchronous key-value persistence for React Native and Flutter?', options: ['LocalStorage', 'MMKV', 'Cookies', 'Text Streams'], correct: 1, explanation: 'MMKV utilizes memory-mapped files for synchronous, high-speed key-value storage.' },
        { id: 'mob_db_q2', topic: 'Mobile Storage & Persistence', subtopic: 'Mobile Relational Storage', type: 'MCQ', difficulty: 'BEGINNER', question: 'What lightweight embedded relational database is embedded in iOS and Android devices natively?', options: ['PostgreSQL', 'SQLite', 'MongoDB', 'Redis'], correct: 1, explanation: 'SQLite is the standard lightweight relational database engine embedded in mobile OS platforms.' },
        { id: 'mob_db_q3', topic: 'Mobile Storage & Persistence', subtopic: 'Secure Storage', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which mobile APIs store sensitive credentials (JWTs, tokens, encryption keys) securely on device hardware? (Select ALL correct answers)', options: ['iOS Keychain', 'Android Keystore / EncryptedSharedPreferences', 'Expo SecureStore', 'AsyncStorage'], correct: [0, 1, 2], explanation: 'iOS Keychain and Android Keystore store secrets encrypted in hardware Security Enclaves.' },
        { id: 'mob_db_q4', topic: 'Mobile Storage & Persistence', subtopic: 'AsyncStorage Limits', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'Why is standard AsyncStorage unsuited for large relational mobile application data?', options: ['AsyncStorage is asynchronous key-value string storage without indexing or SQL query capabilities', 'It deletes data on reboot', 'It requires root', 'It cannot hold numbers'], correct: 0, explanation: 'AsyncStorage is an unindexed key-value string store unsuitable for complex relational queries.' },
        { id: 'mob_db_q5', topic: 'Mobile Storage & Persistence', subtopic: 'Android Default SharedPreferences Max Size in MB', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What is the recommended maximum threshold in MB for key-value preference storage before switching to SQLite?', correct: 10, explanation: 'Key-value preferences loading into memory should be kept under ~10 MB.' },

        // Topic 5: Offline Synchronization (5 Qs)
        { id: 'mob_off_q1', topic: 'Offline Synchronization', subtopic: 'Offline-First Pattern', type: 'MCQ', difficulty: 'BEGINNER', question: 'How does an offline-first mobile application architecture process user actions without internet connection?', options: ['Crashes immediately', 'Persists user mutations in local SQLite/WatermelonDB first, syncing with backend upon reconnection', 'Displays blank screen', 'Deletes cache'], correct: 1, explanation: 'Offline-first apps write data locally first and synchronize with remote servers when network restores.' },
        { id: 'mob_off_q2', topic: 'Offline Synchronization', subtopic: 'Network Status Listener', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which library monitors network reachability changes in React Native mobile applications?', options: ['NetInfo (`@react-native-community/netinfo`)', 'Redux', 'Axios', 'React Navigation'], correct: 0, explanation: 'NetInfo subscribes to network connection state and connection type changes.' },
        { id: 'mob_off_q3', topic: 'Offline Synchronization', subtopic: 'Conflict Resolution', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which techniques resolve data synchronization conflicts between mobile client local state and server state? (Select ALL correct answers)', options: ['Last-Write-Wins (LWW) timestamp strategy', 'Conflict-free Replicated Data Types (CRDTs)', 'Manual user conflict resolution prompt', 'Deleting backend database'], correct: [0, 1, 2], explanation: 'LWW timestamps, CRDTs, and manual user prompts handle multi-device data resolution.' },
        { id: 'mob_off_q4', topic: 'Offline Synchronization', subtopic: 'Background Sync Workers', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'How do mobile applications schedule background sync tasks when the app is suspended by the OS?', options: ['Keep app active in foreground', 'Use WorkManager (Android) and BackgroundTasks (iOS) native scheduler APIs', 'Run continuous while loop', 'Use setTimeout'], correct: 1, explanation: 'Android WorkManager and iOS BackgroundTasks execute deferred background network jobs efficiently.' },
        { id: 'mob_off_q5', topic: 'Offline Synchronization', subtopic: 'HTTP Retry Exponential Backoff Base in Seconds', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'If initial retry delay is 2 seconds and doubles each attempt, what is the delay in seconds for the 3rd retry attempt?', correct: 8, explanation: 'Attempt 1 = 2s, Attempt 2 = 4s, Attempt 3 = 8s.' },

        // Topic 6: iOS Build & Store Deployment (5 Qs)
        { id: 'mob_store_q1', topic: 'iOS Build & Store Deployment', subtopic: 'Provisioning Profiles', type: 'MCQ', difficulty: 'BEGINNER', question: 'What role does an Apple Provisioning Profile perform during iOS app deployment?', options: ['Styles Swift components', 'Binds App ID, Signing Certificates, and Device IDs to authorize app execution on physical hardware', 'Compiles code', 'Manages push tokens'], correct: 1, explanation: 'Provisioning profiles authorize signed iOS app execution on physical Apple hardware.' },
        { id: 'mob_store_q2', topic: 'iOS Build & Store Deployment', subtopic: 'Android Release Binary', type: 'MCQ', difficulty: 'BEGINNER', question: 'What modern package format is required by Google Play Store for publishing Android applications?', options: ['APK', 'Android App Bundle (.aab)', 'JAR', 'ZIP'], correct: 1, explanation: 'Google Play requires `.aab` bundles to generate optimized target device APKs.' },
        { id: 'mob_store_q3', topic: 'iOS Build & Store Deployment', subtopic: 'Beta Testing Services', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which services distribute beta mobile builds to external QA testers? (Select ALL correct answers)', options: ['Apple TestFlight', 'Firebase App Distribution', 'Google Play Internal Testing', 'Nginx web server'], correct: [0, 1, 2], explanation: 'TestFlight, Firebase, and Google Play Internal Testing manage beta release distribution.' },
        { id: 'mob_store_q4', topic: 'iOS Build & Store Deployment', subtopic: 'Over-The-Air (OTA) Updates', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'What updates can be pushed to users instantly via Over-The-Air (OTA) services (EAS Update / CodePush) without App Store review?', options: ['Native C++/Swift code changes', 'JavaScript bundle and asset updates only', 'iOS permissions additions', 'New camera drivers'], correct: 1, explanation: 'OTA updates push JavaScript bundle and asset patches without modifying native binaries.' },
        { id: 'mob_store_q5', topic: 'iOS Build & Store Deployment', subtopic: 'App Store Screenshot Count Minimum', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What is the minimum required number of app screenshots for an Apple App Store submission listing?', correct: 1, explanation: 'Apple App Store requires at least 1 screenshot per device screen size.' }
      ],
      milestones: [
        { id: 'm1', title: 'Phase 1: Mobile UI Foundations & Flexbox Layouts', topic: 'Mobile Layout & Responsive UX', week: 1, durationDays: 7 },
        { id: 'm2', title: 'Phase 2: State Management & Navigation Architecture', topic: 'React Native Architecture', week: 2, durationDays: 7 },
        { id: 'm3', title: 'Phase 3: Local Storage, SQLite & Offline Synchronization', topic: 'Mobile Storage & Persistence', week: 3, durationDays: 7 },
        { id: 'm4', title: 'Phase 4: Native Modules, Device Sensors & Camera Access', topic: 'Flutter Framework & Engine', week: 4, durationDays: 7 },
        { id: 'm5', title: 'Phase 5: Background Processing & Push Notifications', topic: 'Offline Synchronization', week: 5, durationDays: 7 },
        { id: 'm6', title: 'Phase 6: Performance Optimization & App Store Deployment', topic: 'iOS Build & Store Deployment', week: 6, durationDays: 7 }
      ]
    },

    // =========================================================================
    // 7. AI & LLM SYSTEMS ENGINEERING (30 QUESTIONS)
    // =========================================================================
    {
      id: 'ai_llm',
      name: 'AI & LLM Systems Engineering',
      icon: 'ph-sparkle',
      description: 'Master Generative AI, Retrieval-Augmented Generation (RAG), Vector Databases, Prompt Optimization, Agentic Workflows, and PEFT/LoRA Fine-Tuning.',
      diagnostics: [
        // Topic 1: Prompt Engineering & Reasoning (5 Qs)
        { id: 'ai_prm_q1', topic: 'Prompt Engineering & Reasoning', subtopic: 'Chain-of-Thought', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which prompting technique improves multi-step logical reasoning by instructing the LLM to emit step-by-step reasoning tokens before answering?', options: ['Upper-case prompting', 'Chain-of-Thought (CoT) Prompting', 'Context truncation', 'AES encryption'], correct: 1, explanation: 'Chain-of-Thought prompting encourages intermediate reasoning steps before final answer generation.' },
        { id: 'ai_prm_q2', topic: 'Prompt Engineering & Reasoning', subtopic: 'Few-Shot Learning', type: 'MCQ', difficulty: 'BEGINNER', question: 'What distinguishes Few-Shot prompting from Zero-Shot prompting?', options: ['Few-Shot includes exemplary input-output target pairs inside the prompt context', 'Few-Shot retrains model weights', 'Few-Shot disables context', 'Zero-Shot uses GPUs'], correct: 0, explanation: 'Few-shot prompting provides concrete demonstration examples within the prompt context window.' },
        { id: 'ai_prm_q3', topic: 'Prompt Engineering & Reasoning', subtopic: 'Prompt Injection Defenses', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which methods defend LLM applications against Direct & Indirect Prompt Injection attacks? (Select ALL correct answers)', options: ['Strict input sanitization and delimiters separating system instructions from untrusted data', 'Dual-LLM architecture (evaluator model inspecting input safety)', 'Privilege isolation for LLM tool calling', 'Increasing LLM temperature'], correct: [0, 1, 2], explanation: 'Delimiters, dual-LLM safety guardrails, and tool privilege isolation mitigate prompt injection.' },
        { id: 'ai_prm_q4', topic: 'Prompt Engineering & Reasoning', subtopic: 'Tree-of-Thoughts', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'How does Tree-of-Thoughts (ToT) extend Chain-of-Thought prompting for complex problem solving?', options: ['Deletes prompts', 'Maintains a tree of intermediate reasoning steps, allowing lookahead and backtracking via search algorithms (BFS/DFS)', 'Uses SQL queries', 'Reduces context window'], correct: 1, explanation: 'Tree-of-Thoughts evaluates multiple reasoning branches, applying heuristic search and backtracking.' },
        { id: 'ai_prm_q5', topic: 'Prompt Engineering & Reasoning', subtopic: 'Temperature Value for Deterministic Output', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What sampling temperature setting value (0.0 to 1.0) produces deterministic, greedy token selection from an LLM?', correct: 0.0, explanation: 'Temperature 0.0 forces greedy decoding, selecting the highest probability token at every step.' },

        // Topic 2: Vector Embeddings & Similarity Search (5 Qs)
        { id: 'ai_vec_q1', topic: 'Vector Embeddings & Similarity Search', subtopic: 'Cosine Similarity', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which metric measures directional angle alignment between two high-dimensional vector embeddings?', options: ['Hamming Distance', 'Cosine Similarity', 'Pearson Correlation', 'Manhattan Distance'], correct: 1, explanation: 'Cosine similarity measures the cosine of the angle between vectors, independent of vector magnitude.' },
        { id: 'ai_vec_q2', topic: 'Vector Embeddings & Similarity Search', subtopic: 'Embedding Model Purpose', type: 'MCQ', difficulty: 'BEGINNER', question: 'What transformation is performed by text embedding models (e.g. `text-embedding-3-small`)?', options: ['Translates text to HTML', 'Maps unstructured text strings into continuous, high-dimensional dense floating-point vector spaces capturing semantic meaning', 'Compresses ZIP files', 'Runs SQL queries'], correct: 1, explanation: 'Embedding models project semantic text concepts into high-dimensional vector spaces.' },
        { id: 'ai_vec_q3', topic: 'Vector Embeddings & Similarity Search', subtopic: 'Distance Metrics', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which mathematical distance functions are commonly used in vector similarity search engines? (Select ALL correct answers)', options: ['Cosine Distance', 'Euclidean (L2) Distance', 'Dot Product (Inner Product)', 'Levenshtein Edit Distance'], correct: [0, 1, 2], explanation: 'Cosine distance, L2 distance, and Inner Product are core high-dimensional vector similarity metrics.' },
        { id: 'ai_vec_q4', topic: 'Vector Embeddings & Similarity Search', subtopic: 'Normalized Vectors Dot Product', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'When vector embeddings are normalized to unit length (L2 norm = 1.0), what mathematical equivalence occurs?', options: ['Dot Product equals Cosine Similarity', 'L2 distance becomes zero', 'Vectors become 1D', 'Vectors turn into strings'], correct: 0, explanation: 'For unit-normalized vectors, Dot Product is mathematically identical to Cosine Similarity.' },
        { id: 'ai_vec_q5', topic: 'Vector Embeddings & Similarity Search', subtopic: 'OpenAI Embedding Dimension Count', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What is the vector dimension length generated by OpenAI `text-embedding-ada-002` embedding model?', correct: 1536, explanation: '`text-embedding-ada-002` outputs dense float vectors of length 1536.' },

        // Topic 3: RAG Architecture & Grounding (5 Qs)
        { id: 'ai_rag_q1', topic: 'RAG Architecture & Grounding', subtopic: 'RAG Pipeline Purpose', type: 'MCQ', difficulty: 'BEGINNER', question: 'What is the primary architectural goal of Retrieval-Augmented Generation (RAG)?', options: ['Retrain model weights', 'Ground LLM responses with relevant facts retrieved from external document databases to eliminate hallucinations', 'Compress model weights', 'Translate prompts to SQL'], correct: 1, explanation: 'RAG injects retrieved domain knowledge into context to ensure factual, hallucination-free generation.' },
        { id: 'ai_rag_q2', topic: 'RAG Architecture & Grounding', subtopic: 'Chunking Strategies', type: 'MCQ', difficulty: 'BEGINNER', question: 'Why is text chunking with overlap necessary when indexing long documents for RAG?', options: ['Reduces disk space', 'Fits text within embedding context windows while preserving semantic continuity across chunk boundaries', 'Speeds up GPUs', 'Deletes formatting'], correct: 1, explanation: 'Chunking breaks large texts into embedding-friendly sizes while overlaps prevent splitting relevant sentences.' },
        { id: 'ai_rag_q3', topic: 'RAG Architecture & Grounding', subtopic: 'Advanced RAG Techniques', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which advanced components improve RAG retrieval accuracy? (Select ALL correct answers)', options: ['Re-ranking retrieved chunks using Cross-Encoders (e.g. Cohere Rerank)', 'Hybrid Search combining Keyword (BM25) and Semantic Vector search', 'Query rewriting / expansion', 'Deleting context'], correct: [0, 1, 2], explanation: 'Cross-encoder re-ranking, hybrid BM25+vector search, and query expansion dramatically improve retrieval precision.' },
        { id: 'ai_rag_q4', topic: 'RAG Architecture & Grounding', subtopic: 'RAG Hallucination Metric', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', question: 'In a RAG evaluation framework (Ragas), what does the "Faithfulness" metric measure?', options: ['GPU temperature', 'Whether all claims in the generated response can be inferred directly from the retrieved context chunks', 'Model latency', 'Prompt token cost'], correct: 1, explanation: 'Faithfulness verifies that the generated answer relies strictly on retrieved context without inventing facts.' },
        { id: 'ai_rag_q5', topic: 'RAG Architecture & Grounding', subtopic: 'Optimal Chunk Overlap Percentage', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What recommended percentage overlap (10% to 20%) is standard for document chunking in RAG pipelines?', correct: 15, explanation: 'A 10–20% chunk overlap (avg 15%) preserves semantic context across boundaries.' },

        // Topic 4: Vector Database Indexing (5 Qs)
        { id: 'ai_vdb_q1', topic: 'Vector Database Indexing', subtopic: 'HNSW Indexing', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which index graph structure enables sub-linear Approximate Nearest Neighbor (ANN) search in vector databases?', options: ['B-Tree', 'HNSW (Hierarchical Navigable Small World)', 'Bubble Sort', 'Linear Array Scan'], correct: 1, explanation: 'HNSW builds multi-layer proximity graphs to achieve O(log N) vector retrieval speed.' },
        { id: 'ai_vdb_q2', topic: 'Vector Database Indexing', subtopic: 'Vector DB Engines', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which dedicated vector databases store and query high-dimensional embeddings efficiently?', options: ['Pinecone, Milvus, Qdrant', 'SQLite', 'Redis key-value only', 'Apache Server'], correct: 0, explanation: 'Pinecone, Milvus, and Qdrant are purpose-built high-scale vector database systems.' },
        { id: 'ai_vdb_q3', topic: 'Vector Database Indexing', subtopic: 'Filtering Strategies', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which metadata filtering approaches are supported by modern vector databases? (Select ALL correct answers)', options: ['Pre-filtering (filtering metadata before vector search)', 'Post-filtering (filtering metadata after top-K vector search)', 'Single-stage HNSW payload filtering', 'Deleting un-indexed vectors'], correct: [0, 1, 2], explanation: 'Pre-filtering, post-filtering, and single-stage inline payload filtering manage metadata constraints.' },
        { id: 'ai_vdb_q4', topic: 'Vector Database Indexing', subtopic: 'IVF Indexing', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'How does Inverted File Indexing (IVF) accelerate vector similarity search?', options: ['Partitions vector space into Voronoi cells, searching only centroids closest to the query vector', 'Sorts vectors alphabetically', 'Converts floats to ints', 'Uses web sockets'], correct: 0, explanation: 'IVF clusters vector space into Voronoi cells, pruning unpromising clusters during search.' },
        { id: 'ai_vdb_q5', topic: 'Vector Database Indexing', subtopic: 'Top K Retrieval Default Count', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'How many top candidate chunks are typically retrieved in a standard Top-K initial RAG search query?', correct: 5, explanation: 'Top K = 3–5 chunks is standard initial RAG context retrieval.' },

        // Topic 5: Agentic Tool Calling & Guardrails (5 Qs)
        { id: 'ai_agt_q1', topic: 'Agentic Tool Calling & Guardrails', subtopic: 'Function Calling', type: 'MCQ', difficulty: 'BEGINNER', question: 'How do LLM Agents execute external API tools and database searches?', options: ['Using CSS', 'By emitting structured JSON Tool Call payloads matching provided function schemas', 'By launching popups', 'Using thread sleep'], correct: 1, explanation: 'LLMs generate JSON parameters conforming to tool schemas, which the runtime host executes.' },
        { id: 'ai_agt_q2', topic: 'Agentic Tool Calling & Guardrails', subtopic: 'ReAct Pattern', type: 'MCQ', difficulty: 'BEGINNER', question: 'What does the ReAct framework combine in agentic problem solving?', options: ['React.js and HTML', 'Interleaved Thought (Reasoning) and Action (Tool Execution) cycles', 'Python and C++', 'SQL and NoSQL'], correct: 1, explanation: 'ReAct loops alternate between Thought (reasoning step) and Action (executing a tool tool_call).' },
        { id: 'ai_agt_q3', topic: 'Agentic Tool Calling & Guardrails', subtopic: 'LLM Guardrails', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'What functions are performed by LLM Guardrails (e.g. NeMo Guardrails, Llama Guard)? (Select ALL correct answers)', options: ['Detecting and blocking toxic or harmful language generation', 'Preventing PII (Personally Identifiable Information) leakage', 'Blocking prompt injection attempts', 'Compiling C code'], correct: [0, 1, 2], explanation: 'Guardrails enforce safety boundaries, PII redaction, and prompt injection filtering.' },
        { id: 'ai_agt_q4', topic: 'Agentic Tool Calling & Guardrails', subtopic: 'Human-in-the-Loop', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', question: 'An AI Agent needs to execute high-risk operations (e.g. issuing financial refunds). What safety design pattern should be implemented?', options: ['Grant root access', 'Human-in-the-Loop (HITL) approval step before executing critical tool actions', 'Disable tool logging', 'Increase temperature'], correct: 1, explanation: 'HITL requires human authorization prior to committing high-risk or destructive actions.' },
        { id: 'ai_agt_q5', topic: 'Agentic Tool Calling & Guardrails', subtopic: 'Max Agent Iteration Safety Loop Count', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What recommended maximum recursion limit (10 to 15) prevents AI agent execution loops from looping infinitely?', correct: 10, explanation: 'Setting max iterations = 10 prevents infinite agent loops and runaway token costs.' },

        // Topic 6: Fine-Tuning (LoRA/PEFT) & MLOps (5 Qs)
        { id: 'ai_ft_q1', topic: 'Fine-Tuning (LoRA/PEFT) & MLOps', subtopic: 'LoRA Adaption', type: 'MCQ', difficulty: 'BEGINNER', question: 'What primary advantage does Low-Rank Adaptation (LoRA) offer over full LLM fine-tuning?', options: ['Deletes base weights', 'Freezes base model weights and trains low-rank adapter matrices, reducing parameter training costs by 99%', 'Requires zero GPUs', 'Works only on images'], correct: 1, explanation: 'LoRA freezes main weights and injects trainable low-rank rank decomposition matrices into attention layers.' },
        { id: 'ai_ft_q2', topic: 'Fine-Tuning (LoRA/PEFT) & MLOps', subtopic: 'Quantization', type: 'MCQ', difficulty: 'BEGINNER', question: 'What does model Quantization (e.g. 4-bit / 8-bit QLoRA) achieve?', options: ['Increases parameter counts', 'Reduces precision of model weights from 16-bit floats to lower bit integers, cutting VRAM requirements dramatically', 'Deletes layers', 'Translates languages'], correct: 1, explanation: 'Quantization reduces weight memory footprint (e.g. FP16 to INT4), enabling LLMs to run on consumer GPUs.' },
        { id: 'ai_ft_q3', topic: 'Fine-Tuning (LoRA/PEFT) & MLOps', subtopic: 'RLHF & DPO', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which post-training alignment techniques align base LLM outputs with human preferences? (Select ALL correct answers)', options: ['Reinforcement Learning from Human Feedback (RLHF)', 'Direct Preference Optimization (DPO)', 'Supervised Fine-Tuning (SFT)', 'Random weight initialization'], correct: [0, 1, 2], explanation: 'SFT, RLHF, and DPO align base model completion behavior with human safety and instruction-following preferences.' },
        { id: 'ai_ft_q4', topic: 'Fine-Tuning (LoRA/PEFT) & MLOps', subtopic: 'vLLM & PagedAttention', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'How does vLLM achieve high throughput during LLM serving?', options: ['Using CPU rendering', 'Implementing PagedAttention to manage KV-cache memory dynamically without fragmentation', 'Disabling batching', 'Limiting users'], correct: 1, explanation: 'PagedAttention manages KV-cache memory in virtual pages, eliminating memory waste and boosting throughput.' },
        { id: 'ai_ft_q5', topic: 'Fine-Tuning (LoRA/PEFT) & MLOps', subtopic: 'Standard LoRA Rank Value (r)', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What is a standard rank value r (e.g. 8 or 16) commonly configured for LoRA attention adapters?', correct: 8, explanation: 'Rank r = 8 or 16 is standard for efficient LoRA adapter training.' }
      ],
      milestones: [
        { id: 'm1', title: 'Phase 1: LLM Foundations, Tokenization & Prompt Engineering', topic: 'Prompt Engineering & Reasoning', week: 1, durationDays: 7 },
        { id: 'm2', title: 'Phase 2: Vector Embeddings & Similarity Search Mathematics', topic: 'Vector Embeddings & Similarity Search', week: 2, durationDays: 7 },
        { id: 'm3', title: 'Phase 3: Retrieval-Augmented Generation (RAG) Architecture', topic: 'RAG Architecture & Grounding', week: 3, durationDays: 7 },
        { id: 'm4', title: 'Phase 4: Vector Databases (Pinecone, Milvus, Qdrant) & HNSW', topic: 'Vector Database Indexing', week: 4, durationDays: 7 },
        { id: 'm5', title: 'Phase 5: Agentic Workflows & Multi-Tool Function Calling', topic: 'Agentic Tool Calling & Guardrails', week: 5, durationDays: 7 },
        { id: 'm6', title: 'Phase 6: PEFT/LoRA Fine-Tuning, Guardrails & MLOps Deployment', topic: 'Fine-Tuning (LoRA/PEFT) & MLOps', week: 6, durationDays: 7 }
      ]
    },

    // =========================================================================
    // 8. SYSTEM DESIGN & DISTRIBUTED ARCHITECTURE (30 QUESTIONS)
    // =========================================================================
    {
      id: 'system_design',
      name: 'System Design & Distributed Architecture',
      icon: 'ph-cpu',
      description: 'Master Scalable Distributed Systems: Load Balancing, Database Sharding, Caching, Event-Driven Architecture, Kafka, Rate Limiting, and Resiliency Patterns.',
      diagnostics: [
        // Topic 1: CAP Theorem & Scalability Basics (5 Qs)
        { id: 'sys_cap_q1', topic: 'CAP Theorem & Scalability Basics', subtopic: 'CAP Theorem Choice', type: 'MCQ', difficulty: 'BEGINNER', question: 'According to CAP Theorem, what choice must a distributed data store make during a network partition (P)?', options: ['Both Consistency and Availability', 'Either Consistency (CP) OR Availability (AP), but not both', 'Neither Consistency nor Availability', 'Zero Latency'], correct: 1, explanation: 'Network partitions force distributed systems to trade off between returning consistent data or remaining available.' },
        { id: 'sys_cap_q2', topic: 'CAP Theorem & Scalability Basics', subtopic: 'PACELC Theorem', type: 'MCQ', difficulty: 'BEGINNER', question: 'What extension does PACELC Theorem add to CAP Theorem when NO network partition exists?', options: ['Performance vs Security', 'Latency (L) vs Consistency (C)', 'Storage vs CPU', 'HTTP vs TCP'], correct: 1, explanation: 'PACELC states: Else (E) when normal, trade off Latency (L) versus Consistency (C).' },
        { id: 'sys_cap_q3', topic: 'CAP Theorem & Scalability Basics', subtopic: 'Horizontal vs Vertical Scaling', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'What characteristics define Horizontal Scaling (Scaling Out)? (Select ALL correct answers)', options: ['Adding more machine nodes to a pool', 'High availability and fault tolerance', 'Requires stateless application design or external session stores', 'Upgrading CPU on a single server'], correct: [0, 1, 2], explanation: 'Horizontal scaling adds nodes, delivering fault tolerance but requiring stateless server design.' },
        { id: 'sys_cap_q4', topic: 'CAP Theorem & Scalability Basics', subtopic: 'Eventual Consistency', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'What is Eventual Consistency in distributed databases (e.g. Cassandra, DynamoDB)?', options: ['Data is never consistent', 'All database replicas will converge to identical values eventually given time without new updates', 'Immediate strong reads', 'Single node database'], correct: 1, explanation: 'Eventual consistency guarantees that all replicas converge given sufficient time.' },
        { id: 'sys_cap_q5', topic: 'CAP Theorem & Scalability Basics', subtopic: 'Nines Uptime Calculation', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'How many total 9s of availability (e.g. 3, 4, 5) represent 99.999% system uptime?', correct: 5, explanation: '99.999% uptime has 5 nines.' },

        // Topic 2: Database Sharding & Partitioning (5 Qs)
        { id: 'sys_shd_q1', topic: 'Database Sharding & Partitioning', subtopic: 'Horizontal Sharding', type: 'MCQ', difficulty: 'BEGINNER', question: 'What is Database Sharding?', options: ['Deleting database backups', 'Distributing table rows across multiple database server nodes using a Shard Key', 'Creating indexes', 'Normalizing tables'], correct: 1, explanation: 'Sharding partitions rows across multiple server instances to scale write throughput and capacity.' },
        { id: 'sys_shd_q2', topic: 'Database Sharding & Partitioning', subtopic: 'Shard Key Hotspots', type: 'MCQ', difficulty: 'BEGINNER', question: 'What problem occurs when a poor Shard Key routes 90% of traffic to a single shard server?', options: ['Cache stampede', 'Hotspot / Hot Shard bottleneck', 'Deadlock', 'Data loss'], correct: 1, explanation: 'Monotonically increasing or low-cardinality shard keys cause traffic hotspotting on a single node.' },
        { id: 'sys_shd_q3', topic: 'Database Sharding & Partitioning', subtopic: 'Sharding Challenges', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'What complications arise when sharding relational databases? (Select ALL correct answers)', options: ['Cross-shard JOIN operations become extremely slow or unsupported', 'Cross-shard distributed transactions require 2PC (Two-Phase Commit)', 'Re-sharding data when adding nodes requires complex data migration', 'Disables primary keys'], correct: [0, 1, 2], explanation: 'Cross-shard joins, distributed transactions, and re-sharding migrations are major sharding challenges.' },
        { id: 'sys_shd_q4', topic: 'Database Sharding & Partitioning', subtopic: 'Consistent Hashing vs Modulo', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'Why is Consistent Hashing preferred over modulo hashing (`hash(key) % N`) for database sharding?', options: ['Consistent Hashing is faster', 'Adding or removing nodes re-maps only K/N keys rather than re-mapping almost all keys', 'Modulo hashing deletes data', 'Consistent hashing uses 1 server'], correct: 1, explanation: 'Consistent hashing re-maps only K/N keys when cluster size changes, preventing massive data movements.' },
        { id: 'sys_shd_q5', topic: 'Database Sharding & Partitioning', subtopic: 'Re-mapped Keys Fraction', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'In a consistent hashing ring with 10 nodes, what fraction denominator 1/N of total keys must be moved when 1 new node is added?', correct: 10, explanation: 'Consistent hashing re-maps approximately 1/N of total keys (where N = 10 nodes).' },

        // Topic 3: Caching Strategies & Consistent Hashing (5 Qs)
        { id: 'sys_cch_q1', topic: 'Caching Strategies & Consistent Hashing', subtopic: 'Cache-Aside Pattern', type: 'MCQ', difficulty: 'BEGINNER', question: 'How does the Cache-Aside (Lazy Loading) pattern process a read request?', options: ['Write to DB first', 'App checks cache first; if hit return data; if miss read from DB, write to cache, and return', 'Write only to cache', 'Delete cache on read'], correct: 1, explanation: 'Cache-aside checks cache first, fetching from DB and populating cache only on cache misses.' },
        { id: 'sys_cch_q2', topic: 'Caching Strategies & Consistent Hashing', subtopic: 'Cache Eviction Policies', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which cache eviction policy drops the item that has not been accessed for the longest period of time?', options: ['FIFO (First In First Out)', 'LRU (Least Recently Used)', 'LFU (Least Frequently Used)', 'Random'], correct: 1, explanation: 'LRU evicts the key with the oldest last-access timestamp.' },
        { id: 'sys_cch_q3', topic: 'Caching Strategies & Consistent Hashing', subtopic: 'Cache Stampede Defenses', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which techniques protect databases from Cache Stampedes (Thundering Herd)? (Select ALL correct answers)', options: ['Mutex locking / Single-flight request coalescing', 'Probabilistic early expiration (XFetch algorithm)', 'Pre-warming popular cache keys prior to expiration', 'Disabling cache TTL'], correct: [0, 1, 2], explanation: 'Mutex locks, probabilistic early refresh, and cache pre-warming defend against thundering herd spikes.' },
        { id: 'sys_cch_q4', topic: 'Caching Strategies & Consistent Hashing', subtopic: 'Write-Through vs Write-Back', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'What trade-off distinguishes Write-Through from Write-Back (Write-Behind) caching?', options: ['Write-Through writes to cache and DB synchronously (higher latency, zero data loss); Write-Back writes to cache synchronously and DB asynchronously (low latency, risk of data loss on crash)', 'Write-Through is async', 'Write-Back disables DB', 'They are identical'], correct: 0, explanation: 'Write-through guarantees DB consistency synchronously; write-back delays DB writes for low latency.' },
        { id: 'sys_cch_q5', topic: 'Caching Strategies & Consistent Hashing', subtopic: 'Cache Hit Ratio Percentage', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'If a cache processes 900 cache hits and 100 cache misses out of 1000 total requests, what is the Cache Hit Ratio percentage?', correct: 90, explanation: 'Hit ratio = 900 / 1000 = 90%.' },

        // Topic 4: Event-Driven Architecture & Kafka (5 Qs)
        { id: 'sys_evt_q1', topic: 'Event-Driven Architecture & Kafka', subtopic: 'Message Queues', type: 'MCQ', difficulty: 'BEGINNER', question: 'What primary architectural decoupling benefit do message queues (Kafka, RabbitMQ) provide?', options: ['Speeds up HTML rendering', 'Decouples producer and consumer microservices asynchronously so producers write without waiting for consumer processing', 'Eliminates databases', 'Disables network security'], correct: 1, explanation: 'Message queues decouple service availability, letting producers emit events without blocking.' },
        { id: 'sys_evt_q2', topic: 'Event-Driven Architecture & Kafka', subtopic: 'Kafka Partitions', type: 'MCQ', difficulty: 'BEGINNER', question: 'How does Apache Kafka achieve high parallel throughput within a single Topic?', options: ['Single file thread', 'Splitting topics into multiple Partitions distributed across broker nodes', 'Deleting old messages instantly', 'Using HTTP GET'], correct: 1, explanation: 'Kafka topics are partitioned across brokers, enabling parallel consumer group consumption.' },
        { id: 'sys_evt_q3', topic: 'Event-Driven Architecture & Kafka', subtopic: 'Message Delivery Guarantees', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which message delivery semantics can event streaming platforms provide? (Select ALL correct answers)', options: ['At-least-once delivery', 'At-most-once delivery', 'Exactly-once delivery (via idempotent producers and transactional commits)', 'Zero-delivery guarantee'], correct: [0, 1, 2], explanation: 'Event systems support at-least-once, at-most-once, and transactional exactly-once semantics.' },
        { id: 'sys_evt_q4', topic: 'Event-Driven Architecture & Kafka', subtopic: 'Consumer Group Scaling', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'In Kafka, what happens if a Consumer Group has 5 active consumers assigned to a Topic with only 3 Partitions?', options: ['2 consumers remain idle receiving zero messages', 'All 5 receive duplicate messages', 'Broker crashes', 'Partitions auto-create'], correct: 0, explanation: 'A partition can be assigned to only 1 consumer per group; extra consumers remain idle.' },
        { id: 'sys_evt_q5', topic: 'Event-Driven Architecture & Kafka', subtopic: 'Kafka Retention Default Days', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What is the default message log retention period in days (`log.retention.hours = 168`) in Apache Kafka?', correct: 7, explanation: '168 hours / 24 hours per day = 7 days.' },

        // Topic 5: Rate Limiting & Traffic Shaping (5 Qs)
        { id: 'sys_rat_q1', topic: 'Rate Limiting & Traffic Shaping', subtopic: 'Token Bucket', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which rate limiting algorithm refills tokens at a constant rate, allowing bursty traffic up to bucket capacity?', options: ['Bubble Sort', 'Token Bucket Algorithm', 'Binary Search', 'LRU Cache'], correct: 1, explanation: 'Token bucket permits bursty request bursts up to token capacity while enforcing sustained limits.' },
        { id: 'sys_rat_q2', topic: 'Rate Limiting & Traffic Shaping', subtopic: 'Leaky Bucket', type: 'MCQ', difficulty: 'BEGINNER', question: 'What distinguishes the Leaky Bucket algorithm from Token Bucket?', options: ['Leaky bucket outputs requests at a smooth, constant output rate regardless of burst input size', 'Leaky bucket allows infinite bursts', 'Leaky bucket uses SQL', 'They are identical'], correct: 0, explanation: 'Leaky bucket processes output requests at a smooth, fixed rate like a leaking funnel.' },
        { id: 'sys_rat_q3', topic: 'Rate Limiting & Traffic Shaping', subtopic: 'HTTP 429 Headers', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which HTTP headers accompany an HTTP 429 Too Many Requests response? (Select ALL correct answers)', options: ['`Retry-After`', '`X-RateLimit-Limit`', '`X-RateLimit-Remaining`', '`Content-Disposition`'], correct: [0, 1, 2], explanation: '`Retry-After`, limit, and remaining headers inform clients of rate limits and backoff times.' },
        { id: 'sys_rat_q4', topic: 'Rate Limiting & Traffic Shaping', subtopic: 'Distributed Rate Limiter Redis', type: 'SCENARIO_BASED', difficulty: 'INTERMEDIATE', question: 'How do you enforce accurate rate limiting across 50 API gateway servers behind a load balancer?', options: ['Store request counters in each server\'s local memory', 'Store central atomic request counters in a shared Redis cluster using Lua scripts', 'Block all requests', 'Disable load balancing'], correct: 1, explanation: 'Centralized Redis with atomic Lua scripts prevents race conditions across distributed gateway nodes.' },
        { id: 'sys_rat_q5', topic: 'Rate Limiting & Traffic Shaping', subtopic: 'HTTP Rate Limit Status Code', type: 'NUMERICAL', difficulty: 'ADVANCED', question: 'What HTTP status code is returned to clients when rate limits are exceeded?', correct: 429, explanation: 'HTTP 429 Too Many Requests is the standard status code for rate limiting.' },

        // Topic 6: Distributed Resiliency & Saga Pattern (5 Qs)
        { id: 'sys_res_q1', topic: 'Distributed Resiliency & Saga Pattern', subtopic: 'Circuit Breaker States', type: 'MCQ', difficulty: 'BEGINNER', question: 'Which three states define the Circuit Breaker pattern (e.g. Resilience4j)?', options: ['Start, Stop, Pause', 'Closed (normal), Open (failing fast), Half-Open (trial testing)', 'Red, Yellow, Green', 'Active, Idle, Dead'], correct: 1, explanation: 'Closed allows traffic; Open fails fast immediately; Half-Open probes for downstream recovery.' },
        { id: 'sys_res_q2', topic: 'Distributed Resiliency & Saga Pattern', subtopic: 'Saga Pattern Rollback', type: 'MCQ', difficulty: 'BEGINNER', question: 'How does the Saga Pattern handle transactions spanning multiple microservices without Two-Phase Commit (2PC)?', options: ['Single database', 'Executes local transactions sequentially, issuing Compensating Transactions for rollback on failure', 'Ignores failures', 'Disables network security'], correct: 1, explanation: 'Sagas execute local transactions sequentially and issue compensating transactions to undo steps if a failure occurs.' },
        { id: 'sys_res_q3', topic: 'Distributed Resiliency & Saga Pattern', subtopic: 'Resiliency Patterns', type: 'MSQ', difficulty: 'INTERMEDIATE', question: 'Which design patterns enhance distributed system fault tolerance? (Select ALL correct answers)', options: ['Circuit Breaker', 'Bulkhead Isolation', 'Exponential Backoff with Jitter', 'Infinite retries without backoff'], correct: [0, 1, 2], explanation: 'Circuit breakers, bulkheads, and exponential backoff with jitter prevent cascading failures.' },
        { id: 'sys_res_q4', topic: 'Distributed Resiliency & Saga Pattern', subtopic: 'Bulkhead Pattern', type: 'CONCEPTUAL', difficulty: 'INTERMEDIATE', question: 'What is the goal of the Bulkhead isolation pattern in microservices?', options: ['Encrypts network streams', 'Isolates thread pools/resource pools so a failure in one service component does not exhaust resources for others', 'Combines databases', 'Disables API endpoints'], correct: 1, explanation: 'Bulkheads isolate thread/connection pools so failing dependencies cannot starve the entire service.' },
        { id: 'sys_res_q5', topic: 'Distributed Resiliency & Saga Pattern', subtopic: 'Jitter Purpose', type: 'CONCEPTUAL', difficulty: 'ADVANCED', question: 'Why is random Jitter added to Exponential Backoff retry algorithms?', options: ['To confuse attackers', 'To break synchronization spikes (thundering herd) when thousands of clients retry simultaneously', 'To compress payloads', 'To reduce memory usage'], correct: 1, explanation: 'Jitter spreads out retry attempts, preventing synchronized thundering herd spikes on recovering servers.' }
      ],
      milestones: [
        { id: 'm1', title: 'Phase 1: Vertical vs Horizontal Scaling & Load Balancing', topic: 'CAP Theorem & Scalability Basics', week: 1, durationDays: 7 },
        { id: 'm2', title: 'Phase 2: Database Replication, Read-Replicas & Sharding', topic: 'Database Sharding & Partitioning', week: 2, durationDays: 7 },
        { id: 'm3', title: 'Phase 3: Caching Patterns, Redis & Consistent Hashing', topic: 'Caching Strategies & Consistent Hashing', week: 3, durationDays: 7 },
        { id: 'm4', title: 'Phase 4: Event-Driven Architecture, Kafka & Message Queues', topic: 'Event-Driven Architecture & Kafka', week: 4, durationDays: 7 },
        { id: 'm5', title: 'Phase 5: Rate Limiting, API Gateways & Idempotency', topic: 'Rate Limiting & Traffic Shaping', week: 5, durationDays: 7 },
        { id: 'm6', title: 'Phase 6: Distributed Consensus, Saga Pattern & Fault Tolerance', topic: 'Distributed Resiliency & Saga Pattern', week: 6, durationDays: 7 }
      ]
    }
  ],

  resources: {
    'BEGINNER': [
      {
        title: 'Interactive Conceptual Foundation Guide',
        type: 'Interactive Guide',
        estTime: '25 mins',
        url: 'https://developer.mozilla.org',
        author: 'Placify Academy',
        summary: 'Step-by-step beginner breakdown with visual diagrams, code playpens, and plain-English analogies.'
      },
      {
        title: 'Visual Core Concepts Video Lecture & Walkthrough',
        type: 'Video Tutorial',
        estTime: '30 mins',
        url: 'https://youtube.com',
        author: 'Tech Academy Labs',
        summary: 'High-yield 1080p crash course explaining fundamentals with live coding demonstrations.'
      }
    ],
    'INTERMEDIATE': [
      {
        title: 'Deep Dive Architectural Specification & Patterns',
        type: 'Technical Article',
        estTime: '30 mins',
        url: 'https://martinfowler.com',
        author: 'Industry Lead Engineers',
        summary: 'Comprehensive analysis of production design patterns, performance optimizations, and trade-offs.'
      }
    ],
    'ADVANCED': [
      {
        title: 'Advanced System Architecture & Scalability Blueprint',
        type: 'Whitepaper / Specs',
        estTime: '40 mins',
        url: 'https://arxiv.org',
        author: 'Principal Systems Architect',
        summary: 'Distributed consensus, zero-downtime migrations, memory management, and microservice mesh setups.'
      }
    ]
  },

  conceptAssessments: {
    'JavaScript Fundamentals': [
      {
        question: 'Which output is produced by `console.log(typeof NaN)`?',
        options: ['"number"', '"nan"', '"undefined"', '"object"'],
        correct: 0,
        explanation: 'In JavaScript, `NaN` (Not-a-Number) is technically a numeric data type property defined under IEEE 754 floating-point math.'
      }
    ],
    'Default': [
      {
        question: 'What is the main goal of applying modular design principles in software engineering?',
        options: [
          'To reduce code file size by 90%.',
          'To isolate responsibilities, promote reusability, lower coupling, and simplify testing.',
          'To enforce single-threaded execution.',
          'To remove all third-party dependencies.'
        ],
        correct: 1,
        explanation: 'Modular design separates code into distinct, self-contained units with well-defined APIs.'
      }
    ]
  },

  findDomain: function(input) {
    if (!input) return this.domains[0];

    let raw = input;
    if (typeof input === 'object' && input !== null) {
      raw = input.chosen_domain || input.domainId || input.domain || input.id || input.name;
    }
    if (typeof raw !== 'string' || !raw.trim()) {
      return this.domains[0];
    }

    const clean = raw.trim().toLowerCase();

    // 1. Direct exact match on id or name
    const match = this.domains.find(d =>
      d.id.toLowerCase() === clean ||
      d.name.toLowerCase() === clean
    );
    if (match) return match;

    // 2. Exact keyword matching fallback for all 8 domains
    if (clean === 'dsa' || clean.includes('algorithm') || clean.includes('data structure') || clean.includes('interview prep')) {
      const target = this.domains.find(d => d.id === 'dsa');
      if (target) return target;
    }
    if (clean === 'datascience' || clean.includes('data science') || clean.includes('machine learning')) {
      const target = this.domains.find(d => d.id === 'datascience');
      if (target) return target;
    }
    if (clean === 'devops' || clean.includes('cloud')) {
      const target = this.domains.find(d => d.id === 'devops');
      if (target) return target;
    }
    if (clean === 'cybersecurity' || clean.includes('cyber') || clean.includes('security') || clean.includes('hacking')) {
      const target = this.domains.find(d => d.id === 'cybersecurity');
      if (target) return target;
    }
    if (clean === 'mobile' || clean.includes('react native') || clean.includes('flutter') || clean.includes('ios') || clean.includes('android')) {
      const target = this.domains.find(d => d.id === 'mobile');
      if (target) return target;
    }
    if (clean === 'ai_llm' || clean === 'ai' || clean.includes('llm') || clean.includes('genai') || clean.includes('rag')) {
      const target = this.domains.find(d => d.id === 'ai_llm');
      if (target) return target;
    }
    if (clean === 'system_design' || clean.includes('system design') || clean.includes('architecture') || clean.includes('microservice')) {
      const target = this.domains.find(d => d.id === 'system_design');
      if (target) return target;
    }
    if (clean === 'fullstack' || clean.includes('full-stack') || clean.includes('web')) {
      const target = this.domains.find(d => d.id === 'fullstack');
      if (target) return target;
    }

    return this.domains[0];
  }
};

window.normalizeDailyTask = function(rawTask, context = {}) {
  if (!rawTask || typeof rawTask !== 'object') return null;

  const taskId = rawTask.taskId || rawTask.id || context.taskId || `task_${context.monthNumber || 1}_${context.weekNumber || 1}_${context.dayNumber || 1}_1`;
  
  const dayNumber = parseInt(rawTask.dayNumber !== undefined ? rawTask.dayNumber : (rawTask.day_number !== undefined ? rawTask.day_number : context.dayNumber), 10) || 1;
  const monthNumber = parseInt(rawTask.monthNumber !== undefined ? rawTask.monthNumber : (rawTask.month_number !== undefined ? rawTask.month_number : context.monthNumber), 10) || 1;
  const weekNumber = parseInt(rawTask.weekNumber !== undefined ? rawTask.weekNumber : (rawTask.week_number !== undefined ? rawTask.week_number : context.weekNumber), 10) || 1;
  
  const domain = rawTask.domain || rawTask.domainId || rawTask.chosen_domain || context.domain || 'fullstack';

  const taskType = (rawTask.taskType || rawTask.type || rawTask.task_type || context.taskType || 'LEARN').toUpperCase();

  let taskTitle = rawTask.taskTitle || rawTask.title || context.taskTitle || '';
  let taskTopic = rawTask.taskTopic || rawTask.topic || rawTask.task_topic || context.taskTopic || context.topic || 'Core Learning';
  let taskSubtopic = rawTask.taskSubtopic || rawTask.subtopic || rawTask.subskillName || rawTask.task_subtopic || context.taskSubtopic || context.subtopic || taskTopic;

  if (!taskTitle || taskTitle.includes('undefined')) {
    if (taskTitle.includes('Learn: undefined')) {
      taskTitle = `Learn: ${taskSubtopic}`;
    } else if (taskTitle.includes('Guided Practice: undefined')) {
      taskTitle = `Guided Practice: ${taskSubtopic} Drills`;
    } else if (taskTitle.includes('Implement: undefined')) {
      taskTitle = `Implement: ${taskSubtopic}`;
    } else if (taskTitle.includes('Assessment: undefined')) {
      taskTitle = `Assessment: ${taskSubtopic}`;
    } else {
      taskTitle = `${taskType === 'LEARN' ? 'Learn' : (taskType === 'PRACTICE' ? 'Practice' : 'Study')}: ${taskSubtopic}`;
    }
  }

  const durationMinutes = parseInt(
    rawTask.durationMinutes !== undefined ? rawTask.durationMinutes :
    (rawTask.estimated_minutes !== undefined ? rawTask.estimated_minutes :
    (rawTask.taskDuration !== undefined ? rawTask.taskDuration :
    (rawTask.duration !== undefined ? rawTask.duration :
    (rawTask.estHours !== undefined ? Math.round(rawTask.estHours * 60) : context.durationMinutes)))),
    10
  ) || 45;

  const difficulty = (rawTask.difficulty || rawTask.taskDifficulty || rawTask.userLevel || context.difficulty || 'BEGINNER').toUpperCase();
  const description = rawTask.description || rawTask.practice_details || rawTask.revision_details || rawTask.summary || context.description || `Core learning and practice module for ${taskSubtopic}.`;

  const normalized = {
    taskId,
    id: taskId,
    dayNumber,
    day_number: dayNumber,
    monthNumber,
    month_number: monthNumber,
    weekNumber,
    week_number: weekNumber,
    domain,
    domainId: domain,
    taskType,
    type: taskType,
    taskTitle,
    title: taskTitle,
    taskTopic,
    topic: taskTopic,
    taskSubtopic,
    subtopic: taskSubtopic,
    subskillName: taskSubtopic,
    description,
    practice_details: description,
    difficulty,
    durationMinutes,
    estimated_minutes: durationMinutes
  };

  if (!normalized.taskTitle || !normalized.taskType || !normalized.durationMinutes || normalized.taskTitle.includes('undefined')) {
    console.error('[ROADMAP TASK CONTRACT ERROR]', {
      taskId,
      domain,
      monthNumber,
      weekNumber,
      dayNumber,
      rawTask,
      normalizedTask: normalized
    });
  }

  return normalized;
};

window.normalizeRoadmap = function(roadmap) {
  if (!roadmap || typeof roadmap !== 'object') return roadmap;

  if (Array.isArray(roadmap.monthly_roadmap)) {
    roadmap.monthly_roadmap.forEach(m => {
      if (Array.isArray(m.weeks)) {
        m.weeks.forEach(w => {
          if (Array.isArray(w.days)) {
            w.days.forEach(d => {
              const dayMins = d.total_minutes || d.estimated_minutes || 120;
              d.total_minutes = dayMins;
              d.estimated_minutes = dayMins;
              d.id = d.id || d.dayId || d.day_id || `day_${d.day_number}`;
              d.day_id = d.id;
              d.dayId = d.id;

              if (Array.isArray(d.tasks)) {
                d.tasks = d.tasks.map((t, idx) => window.normalizeDailyTask(t, {
                  domain: roadmap.domain || 'fullstack',
                  monthNumber: m.month_number,
                  weekNumber: w.week_number,
                  dayNumber: d.day_number,
                  topic: d.topic,
                  taskSeq: idx + 1
                })).filter(Boolean);
              }
            });
          }
        });
      }
    });
  }

  return roadmap;
};
