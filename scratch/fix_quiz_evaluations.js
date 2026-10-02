/**
 * Fix Quiz Evaluations Script
 * Inspects and repairs corrupted quiz_evaluations documents in MongoDB Atlas
 * where user's chosen_domain was non-Full-Stack but quiz evaluation recorded Full-Stack questions as unanswered.
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI missing from .env');
  process.exit(1);
}

// Domain definitions with diagnostics for evaluation lookup
const DOMAINS = [
  {
    id: 'fullstack',
    name: 'Full-Stack Web Development',
    diagnostics: [
      { id: 'fs_q1', topic: 'JavaScript Fundamentals', question: 'What is the primary difference between `var`, `let`, and `const` in JavaScript?', options: ['No difference, they are interchangeable syntax variants.', '`var` is function-scoped; `let` and `const` are block-scoped.', '`const` allows variable re-assignment, while `let` locks the reference.', '`let` hoisting creates a global scope polluter in browser environments.'], correct: 1 },
      { id: 'fs_q2', topic: 'REST API & HTTP Protocols', question: 'Which HTTP method is idempotent and used to replace an entire target resource?', options: ['POST', 'PATCH', 'PUT', 'DELETE'], correct: 2 },
      { id: 'fs_q3', topic: 'React & UI Architecture', question: 'What happens during the React Virtual DOM Reconciliation process?', options: ['The entire browser DOM is re-rendered on every state update.', 'React computes a diff between the old VDOM and new VDOM to perform minimal real DOM updates.', 'State updates are serialized directly to localStorage for offline persistence.', 'React converts JSX directly into WebAssembly binary instructions.'], correct: 1 },
      { id: 'fs_q4', topic: 'Database Management', question: 'What is an ACID transaction property in SQL databases?', options: ['Asynchronous, Concurrent, Indexed, Distributed', 'Atomicity, Consistency, Isolation, Durability', 'Analytical, Columnar, In-memory, Data-lake', 'Authentication, Cipher, Inspection, Decryption'], correct: 1 },
      { id: 'fs_q5', topic: 'Web Security', question: 'What mechanism prevents Cross-Site Scripting (XSS) attacks in modern web apps?', options: ['Disabling HTTP cookies completely.', 'Sanitizing/escaping user inputs, implementing Content Security Policy (CSP), and avoiding unsafe innerHTML.', 'Using CORS headers on every public endpoint.', 'Encrypting frontend bundles with Webpack obfuscators.'], correct: 1 }
    ]
  },
  {
    id: 'datascience',
    name: 'Data Science & Machine Learning',
    diagnostics: [
      { id: 'ds_q1', topic: 'Machine Learning Basics', question: 'What is the key difference between Supervised and Unsupervised Learning?', options: ['Supervised learning requires human code review; unsupervised uses AI agents.', 'Supervised learning uses labeled training datasets; unsupervised finds patterns in unlabeled data.', 'Supervised learning only runs on GPUs; unsupervised runs on CPUs.', 'Supervised learning is reserved for regression; unsupervised is reserved for time-series.'], correct: 1 },
      { id: 'ds_q2', topic: 'Model Evaluation & Optimization', question: 'What does the Bias-Variance tradeoff describe in model performance?', options: ['Tradeoff between training speed and memory usage.', 'Overfitting (high variance) vs Underfitting (high bias) when generalizing to unseen data.', 'Accuracy of linear regression vs decision trees.', 'Data clean-up speed vs feature engineering depth.'], correct: 1 },
      { id: 'ds_q3', topic: 'Data Preprocessing & Metrics', question: 'Which metric is best suited for evaluating a model on a highly imbalanced classification dataset?', options: ['Accuracy', 'Precision-Recall / F1-Score', 'Mean Squared Error (MSE)', 'R-Squared Score'], correct: 1 },
      { id: 'ds_q4', topic: 'Deep Learning Architectures', question: 'What is the activation function commonly used in deep neural network hidden layers to mitigate vanishing gradients?', options: ['Sigmoid', 'Tanh', 'ReLU (Rectified Linear Unit)', 'Step Function'], correct: 2 },
      { id: 'ds_q5', topic: 'Unsupervised Learning & PCA', question: 'What principal technique does Principal Component Analysis (PCA) perform?', options: ['Dimensionality reduction by finding orthogonal axes of maximum variance.', 'Clustering data points into k distinct centroids.', 'Hyperparameter tuning using grid search.', 'Natural Language Processing tokenization.'], correct: 0 }
    ]
  },
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms (Interview Prep)',
    diagnostics: [
      { id: 'dsa_q1', topic: 'Trees & Search Algorithms', question: 'What is the time complexity of searching an element in a balanced Binary Search Tree (BST)?', options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'], correct: 1 },
      { id: 'dsa_q2', topic: 'Basic Data Structures', question: 'Which data structure follows the Last-In, First-Out (LIFO) principle?', options: ['Queue', 'Stack', 'Linked List', 'Max Heap'], correct: 1 },
      { id: 'dsa_q3', topic: 'Subarray & String Patterns', question: 'What pattern is ideal for finding the maximum sum of a contiguous subarray of size K?', options: ['Two Pointers', 'Sliding Window', 'Binary Search', 'Topological Sort'], correct: 1 },
      { id: 'dsa_q4', topic: 'Graph Algorithms', question: 'What traversal strategy is used by Dijkstra\'s algorithm to find the shortest path in a weighted graph?', options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS) with Priority Queue / Min-Heap', 'Linear Search', 'Pre-order Traversal'], correct: 1 },
      { id: 'dsa_q5', topic: 'Dynamic Programming', question: 'What defines a problem solvable by Dynamic Programming (DP)?', options: ['Random input distribution and prime factors.', 'Overlapping subproblems and optimal substructure.', 'Strict sorted order and hash collisions.', 'Constant memory footprint requirement.'], correct: 1 }
    ]
  },
  {
    id: 'devops',
    name: 'Cloud Engineering & DevOps',
    diagnostics: [
      { id: 'dev_q1', topic: 'Containerization', question: 'What is the primary benefit of containerization (e.g. Docker) over traditional Virtual Machines (VMs)?', options: ['Containers include full guest operating systems.', 'Containers share the host OS kernel, resulting in lightweight, fast-starting isolated environments.', 'Containers eliminate the need for networking config.', 'Containers run exclusively on cloud hypervisors.'], correct: 1 },
      { id: 'dev_q2', topic: 'Infrastructure as Code', question: 'What is Infrastructure as Code (IaC) with tools like Terraform?', options: ['Writing bash scripts directly on production servers.', 'Defining and provisioning cloud infrastructure declaratively using code files managed in version control.', 'Compiling C++ code into Cloud Assembly modules.', 'Auto-scaling servers using AI prompt generators.'], correct: 1 },
      { id: 'dev_q3', topic: 'Kubernetes Orchestration', question: 'What is the role of a Kubernetes Ingress Controller?', options: ['Configuring container CPU usage limits.', 'Managing external access to services in a cluster, typically HTTP/HTTPS routing.', 'Encrypting hard drives on cluster nodes.', 'Compiling container images from Dockerfiles.'], correct: 1 },
      { id: 'dev_q4', topic: 'CI/CD Pipelines', question: 'In CI/CD pipelines, what is the key difference between Continuous Delivery and Continuous Deployment?', options: ['Delivery automated builds only; Deployment automates unit testing.', 'Delivery ensures code is always ready for release with manual trigger; Deployment automatically deploys every passed change to production.', 'Delivery uses Jenkins; Deployment uses GitHub Actions.', 'Delivery requires Docker; Deployment requires Kubernetes.'], correct: 1 },
      { id: 'dev_q5', topic: 'Observability & Monitoring', question: 'Which key metric triad defines cloud application Observability?', options: ['HTML, CSS, JavaScript', 'Logs, Metrics, Traces', 'CPU, RAM, Disk', 'Build, Test, Deploy'], correct: 1 }
    ]
  }
];

function findDomainObj(input) {
  if (!input) return DOMAINS[0];
  const clean = String(input).trim().toLowerCase();
  const match = DOMAINS.find(d => d.id.toLowerCase() === clean || d.name.toLowerCase() === clean);
  if (match) return match;
  if (clean.includes('devops') || clean.includes('cloud')) return DOMAINS.find(d => d.id === 'devops');
  if (clean.includes('data science') || clean.includes('datascience') || clean.includes('machine learning')) return DOMAINS.find(d => d.id === 'datascience');
  if (clean.includes('dsa') || clean.includes('algorithm') || clean.includes('data structure')) return DOMAINS.find(d => d.id === 'dsa');
  return DOMAINS[0];
}

async function runRepair() {
  try {
    console.log('📡 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected.');

    const userSchema = new mongoose.Schema({ user_id: String, chosen_domain: String }, { collection: 'Registration' });
    const quizEvalSchema = new mongoose.Schema({}, { collection: 'quiz_evaluations', strict: false });

    const User = mongoose.model('UserRepair', userSchema, 'Registration');
    const QuizEval = mongoose.model('QuizEvalRepair', quizEvalSchema, 'quiz_evaluations');

    const evalDocs = await QuizEval.find({});
    console.log(`📋 Found ${evalDocs.length} quiz evaluations in collection quiz_evaluations.`);

    let repairedCount = 0;

    for (const doc of evalDocs) {
      const dbUser = await User.findOne({ user_id: doc.user_id });
      if (!dbUser) continue;

      const expectedDomainObj = findDomainObj(dbUser.chosen_domain);
      const isMismatch = (doc.domain !== expectedDomainObj.name);

      if (isMismatch) {
        console.log(`\n🔍 Mismatch found for user ${doc.user_id}:`);
        console.log(`   User chosen_domain in Registration: "${dbUser.chosen_domain}" -> "${expectedDomainObj.name}"`);
        console.log(`   Evaluation recorded domain         : "${doc.domain}"`);

        // Re-construct answers for expected domain
        const formattedQuestions = expectedDomainObj.diagnostics.map((q, idx) => {
          let difficulty = 'INTERMEDIATE';
          if (idx === 0) difficulty = 'BEGINNER';
          else if (idx === expectedDomainObj.diagnostics.length - 1) difficulty = 'ADVANCED';

          return {
            id: q.id,
            question: q.question,
            options: q.options,
            user_answer: 'Unanswered',
            correct_answer: q.options[q.correct],
            topic: q.topic,
            difficulty,
            is_correct: false
          };
        });

        // Update document
        doc.domain = expectedDomainObj.name;
        doc.answers = formattedQuestions;
        doc.markModified('domain');
        doc.markModified('answers');

        await doc.save();
        console.log(`   ✅ Repaired domain to "${expectedDomainObj.name}" for user ${doc.user_id}`);
        repairedCount++;
      }
    }

    console.log(`\n🎉 Repair process completed! Updated ${repairedCount} records in MongoDB Atlas.`);
    await mongoose.disconnect();
    process.exit(0);

  } catch (err) {
    console.error('❌ Repair failed:', err);
    process.exit(1);
  }
}

runRepair();
