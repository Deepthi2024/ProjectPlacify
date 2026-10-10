const fs = require('fs');
const path = require('path');

const taxonomyDir = path.join(__dirname, '..', 'Youtube data API resources', 'taxonomy');

const defaultLevels = ["Beginner", "Intermediate", "Advanced", "Unknown"];
const defaultLanguages = ["English", "Hindi", "Kannada", "Tamil", "Telugu", "Malayalam", "Other", "Unknown"];

const taxonomies = {
  'data_science.json': {
    domain: 'Data Science & Machine Learning',
    levels: defaultLevels,
    languages: defaultLanguages,
    topics: {
      'Python for Data Science': {
        'Python Syntax & Data Types': 'Fundamental Python variables, lists, dicts, and control flow for data workflows',
        'NumPy Arrays & Vectorization': 'N-dimensional arrays, broadcasting, vector math, and indexing',
        'Pandas DataFrames': 'Data ingestion, series, dataframes, filtering, and missing value imputation',
        'Pandas GroupBy & Aggregations': 'Split-apply-combine patterns, aggregations, pivoting, and joins',
        'Data Cleaning & Preprocessing': 'Outlier removal, data normalization, categorical encoding, and feature scaling'
      },
      'Exploratory Data Analysis': {
        'Matplotlib & Seaborn': 'Scatter plots, histograms, heatmaps, box plots, and multi-variable visualizations',
        'Descriptive Statistics': 'Mean, median, variance, standard deviation, skewness, and correlation analysis',
        'Hypothesis Testing & P-values': 'Null hypotheses, t-tests, chi-square tests, and statistical significance'
      },
      'Machine Learning Foundations': {
        'Linear & Logistic Regression': 'Ordinary least squares, gradient descent, sigmoid activation, and decision boundaries',
        'Decision Trees & Ensembles': 'Information gain, Gini impurity, Random Forests, and bagging',
        'Gradient Boosting (XGBoost/LightGBM)': 'Boosting mechanics, shrinkage, tree regularization, and tabular ML modeling',
        'Cross-Validation & Metrics': 'K-fold CV, precision, recall, F1-score, ROC-AUC, and confusion matrix',
        'Unsupervised Learning (K-Means/PCA)': 'Clustering algorithms, dimensionality reduction, and principal component projections'
      },
      'Deep Learning & MLOps': {
        'Neural Networks with PyTorch/TensorFlow': 'Forward passes, backpropagation, activation functions, and optimizer configuration',
        'Convolutional & Recurrent Architectures': 'CNN kernels, pooling layers, image classification, RNNs, and LSTMs',
        'Model Deployment & Flask/FastAPI': 'Exporting ONNX/pickle models, REST APIs, and microservice containerization',
        'MLflow & Model Tracking': 'Experiment tracking, model registry, artifact storage, and pipeline observability'
      }
    }
  },

  'dsa.json': {
    domain: 'Data Structures & Algorithms',
    levels: defaultLevels,
    languages: defaultLanguages,
    topics: {
      'Algorithmic Foundations': {
        'Time & Space Complexity': 'Big-O notation, asymptotic upper bounds, memory footprints, and recurrence relations',
        'Arrays & String Manipulation': 'Two pointers, sliding window technique, prefix sums, and in-place manipulations',
        'Recursion & Backtracking': 'Base cases, recursive trees, permutations, subsets, and N-Queens'
      },
      'Core Linear Data Structures': {
        'Linked Lists (Singly & Doubly)': 'Node reversal, cycle detection (Floyd algorithm), dummy heads, and merge operations',
        'Stacks & Queues': 'Monotonic stacks, next greater element, circular queues, and deque patterns',
        'Hash Tables & Collision Resolution': 'Chaining, open addressing, hash map lookups, and frequency counter patterns'
      },
      'Hierarchical Structures & Trees': {
        'Binary Trees & Traversals': 'Preorder, inorder, postorder, level-order BFS, and tree symmetry',
        'Binary Search Trees (BST)': 'BST insertion, deletion, validation, LCA, and balanced rotations',
        'Heaps & Priority Queues': 'Min-heap, max-heap, heapify algorithm, Top-K problems, and median finders'
      },
      'Advanced Algorithms & Graphs': {
        'Graph Traversals (BFS & DFS)': 'Adjacency lists, topological sorting, connected components, and cycle detection',
        'Shortest Path Algorithms': 'Dijkstra algorithm, Bellman-Ford, Floyd-Warshall, and priority queue relaxation',
        'Disjoint Set Union (DSU)': 'Path compression, union by rank, and Kruskal Minimum Spanning Tree',
        'Dynamic Programming (1D & 2D)': 'Memoization, tabulation, knapsack problems, LCS, and coin change variants'
      }
    }
  },

  'cloud_devops.json': {
    domain: 'Cloud Engineering & DevOps',
    levels: defaultLevels,
    languages: defaultLanguages,
    topics: {
      'Linux & Core Infrastructure': {
        'Linux Administration & Bash': 'File systems, permissions, process management, shell scripting, and grep/awk/sed',
        'Networking & DNS Fundamentals': 'TCP/IP stack, DNS resolution, HTTP/HTTPS, firewalls, and reverse proxies (NGINX)',
        'SSH & Key-Based Authentication': 'Public key cryptography, SSH tunnels, bastion hosts, and secret hygiene'
      },
      'Containerization & Microservices': {
        'Docker Fundamentals': 'Container lifecycles, Dockerfiles, layer caching, multi-stage builds, and volume mounting',
        'Docker Compose & Multi-Container Apps': 'Service orchestration, container networking, environment variables, and volumes'
      },
      'CI/CD Pipelines': {
        'GitHub Actions & GitLab CI': 'Workflow YAML syntax, build triggers, automated testing, and artifact deployment',
        'Automated Testing & Linting Gates': 'Quality gates, static analysis integration, security scanning, and test reports'
      },
      'Cloud Architecture & Kubernetes': {
        'Cloud Essentials (AWS/GCP)': 'IAM roles, EC2 instances, S3 storage, VPC peering, and security groups',
        'Infrastructure as Code (Terraform)': 'HCL syntax, state management, provider configuration, and resource provisioning',
        'Kubernetes Architecture & Pods': 'Control plane, kubelet, pods, deployments, services, and ReplicaSets',
        'Observability (Prometheus & Grafana)': 'Metrics scraping, dashboards, alerting rules, log aggregation, and tracing'
      }
    }
  },

  'cybersecurity.json': {
    domain: 'Cybersecurity & Ethical Hacking',
    levels: defaultLevels,
    languages: defaultLanguages,
    topics: {
      'Security Foundations': {
        'CIA Triad & Threat Modeling': 'Confidentiality, integrity, availability, STRIDE model, and attack surface mapping',
        'Cryptography & Encryption': 'Symmetric vs asymmetric ciphers, AES, RSA, hashing (SHA-256), and HMAC',
        'PKI Certificates & TLS Handshake': 'Certificate authorities, TLS 1.3 handshake, cipher suites, and trust chains'
      },
      'Network & OS Security': {
        'Wireshark & Packet Analysis': 'Packet capture, protocol dissection, TCP handshake analysis, and ARP spoof detection',
        'Linux/Windows OS Security Hardening': 'Disabling insecure services, CIS benchmarks, auditd, and kernel parameters',
        'Active Directory & Privilege Escalation': 'Kerberos, LDAP, group policies, sudo misconfigurations, and SUID exploitation'
      },
      'Web Application Security': {
        'OWASP Top 10 Exploits': 'SQL injection, cross-site scripting (XSS), CSRF, and broken access controls',
        'Authentication Vulnerabilities': 'JWT tampering, session fixation, credential stuffing, and OAuth security',
        'Burp Suite & Dynamic Testing': 'Proxy interception, repeater, intruder fuzzing, and security payload crafting'
      },
      'SOC & Defensive Operations': {
        'SIEM Log Analysis & Splunk': 'Query languages, log correlation, alert triage, and incident response playbooks',
        'Threat Hunting & Malware Analysis': 'IOC identification, sandbox analysis, reverse engineering basics, and YARA rules'
      }
    }
  },

  'mobile_development.json': {
    domain: 'Mobile App Development',
    levels: defaultLevels,
    languages: defaultLanguages,
    topics: {
      'Mobile Framework Foundations': {
        'React Native Core Architecture': 'Bridge, new architecture (Fabric & TurboModules), JSX, and primitive mobile views',
        'Flutter & Dart Fundamentals': 'Widget trees, stateless vs stateful widgets, Dart OOP syntax, and build methods'
      },
      'UI & State Management': {
        'Mobile Layout & Flexbox': 'Screen responsiveness, safe areas, platform-specific adaptations, and styled components',
        'State Management (Redux/Provider/Bloc)': 'Global application state, store configuration, actions, and reactive listeners',
        'Navigation & Deep Linking': 'Stack navigation, tabs, drawer menus, deep linking schemas, and route parameters'
      },
      'Device Integration & Storage': {
        'AsyncStorage & SQLite Persistence': 'Key-value stores, local database migrations, and offline caching patterns',
        'Native Hardware APIs': 'Camera access, geolocation, push notifications, accelerometer, and biometric auth',
        'REST & GraphQL Mobile Clients': 'Network handling, interceptors, offline queues, and image caching'
      },
      'Optimization & Store Release': {
        'Mobile Performance Profiling': 'Frame rate analysis (60fps), bundle splitting, memory leak debugging, and render reduction',
        'Play Store & App Store Deployment': 'Keystores, signing certificates, Fastlane automation, App Store Connect, and privacy declarations'
      }
    }
  },

  'ai_llm.json': {
    domain: 'AI & LLM Systems Engineering',
    levels: defaultLevels,
    languages: defaultLanguages,
    topics: {
      'Prompting & Foundations': {
        'Prompt Engineering & In-Context Learning': 'Zero-shot, few-shot, Chain-of-Thought, system prompt design, and delimiter formatting',
        'Tokenization & Transformer Foundations': 'BPE tokenizers, context windows, self-attention mechanisms, and positional embeddings',
        'LLM APIs & Streaming Responses': 'OpenAI/Groq/Anthropic SDKs, SSE streaming, temperature parameters, and rate limiting'
      },
      'Retrieval-Augmented Generation (RAG)': {
        'Text Chunking & Preprocessing': 'Fixed-size, recursive character, and semantic boundary chunking strategies',
        'Vector Embeddings & Indexing': 'Dense vector representations, cosine similarity, FAISS, ChromaDB, and Pinecone',
        'Hybrid Search & Re-ranking': 'BM25 sparse search combined with dense vector search and cross-encoder re-ranking'
      },
      'Agentic Systems & Frameworks': {
        'Function Calling & Tool Use': 'Structured JSON outputs, tool definitions, arguments parsing, and multi-tool routing',
        'LangChain & LlamaIndex Frameworks': 'Chains, memory modules, document loaders, vector stores, and custom agent loops'
      },
      'Evaluation & Production Serving': {
        'RAG Triad & LLM Evaluation (Ragas)': 'Faithfulness, answer relevance, context precision, and automated red-teaming',
        'Guardrails & Output Validation': 'Pydantic schemas, hallucination detection, safety checks, and NeMo Guardrails',
        'Fine-Tuning & Quantization': 'LoRA/QLoRA adaptation, dataset formatting, vLLM serving, and model quantization (GGUF)'
      }
    }
  },

  'system_design.json': {
    domain: 'System Design & Distributed Architecture',
    levels: defaultLevels,
    languages: defaultLanguages,
    topics: {
      'Core Architecture Foundations': {
        'Client-Server & Protocol Fundamentals': 'HTTP/2, HTTP/3, WebSockets, gRPC, and RESTful service contracts',
        'Database Scaling & Normalization': 'ACID properties, B-Tree indexes, query optimization, connection pooling, and sharding',
        'Caching Architectures (Redis/Memcached)': 'Cache-aside, write-through, cache stampede mitigation, eviction policies (LRU), and TTL'
      },
      'Scalability & Availability': {
        'Load Balancing & Reverse Proxies': 'Round-robin, least connections, consistent hashing, SSL termination, and CDN edge caching',
        'CAP Theorem & Consistency Models': 'Strong vs eventual consistency, PACELC theorem, quorum consensus, and replication lag'
      },
      'Distributed Messaging & Storage': {
        'Message Queues & Event Streaming (Kafka/RabbitMQ)': 'Pub/sub paradigms, consumer groups, partition keys, dead letter queues, and exactly-once processing',
        'Blob Storage & Object Stores (S3)': 'Chunked multipart uploads, pre-signed URLs, lifecycle policies, and replication'
      },
      'Enterprise Distributed Systems': {
        'Distributed Transactions & Sagas': 'Two-phase commit limitations, Saga orchestration vs choreography, and compensating actions',
        'Rate Limiting & Resiliency Patterns': 'Token bucket, leaky bucket, sliding window counters, circuit breakers, and bulkhead isolation',
        'High-Scale Case Studies': 'Designing URL shorteners, distributed job schedulers, collaborative doc editors, and notification engines'
      }
    }
  }
};

for (const [filename, content] of Object.entries(taxonomies)) {
  const filePath = path.join(taxonomyDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
  console.log(`✅ Generated taxonomy: ${filePath}`);
}

console.log('All 7 domain taxonomies created successfully!');
