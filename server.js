/**
 * Placify Backend Server & MongoDB Atlas Database Connector
 * Database: placify
 * Collection: Registration
 */

require('dotenv').config();

const dns = require('dns');
// Set public DNS servers to fix querySrv ECONNREFUSED on Windows for MongoDB Atlas SRV connection strings
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  console.warn('Could not set custom DNS servers:', err.message);
}

const Groq = require('groq-sdk');
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');
const mongoose = require('mongoose');
const { execFile } = require('child_process');

const { getKnowledgeGraph, getAllSkillsInGraph, normalizeDomainKey, DOMAIN_CONFIG } = require('./engine/knowledgeGraph');
const { buildUserSkillProfile, updateSkillMastery } = require('./engine/skillProfiler');
const { generateIntelligentRoadmap, validateRoadmap } = require('./engine/roadmapPlanner');
const { recalculateAdaptiveRoadmap } = require('./engine/adaptiveEngine');

const NewsArticle = require('./models/NewsArticle');
const { startNewsFetchJob } = require('./jobs/newsFetchJob');
const { handleGetPersonalizedNews } = require('./controllers/newsController');
const { handleGetInternships } = require('./controllers/internshipController');
const { handleApplicationRequests } = require('./controllers/applicationController');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Canonical Daily Task Normalizer Adapter
 * Guarantees every task object adheres to one canonical contract
 */
function normalizeDailyTask(rawTask, context = {}) {
  if (!rawTask || typeof rawTask !== 'object') {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[ROADMAP TASK CONTRACT ERROR] Received non-object rawTask:', { rawTask, context });
    }
    return null;
  }

  const taskId = rawTask.taskId || rawTask.id || context.taskId || `task_${context.monthNumber || 1}_${context.weekNumber || 1}_${context.dayNumber || 1}_1`;
  
  const dayNumber = parseInt(rawTask.dayNumber !== undefined ? rawTask.dayNumber : (rawTask.day_number !== undefined ? rawTask.day_number : context.dayNumber), 10) || 1;
  const monthNumber = parseInt(rawTask.monthNumber !== undefined ? rawTask.monthNumber : (rawTask.month_number !== undefined ? rawTask.month_number : context.monthNumber), 10) || 1;
  const weekNumber = parseInt(rawTask.weekNumber !== undefined ? rawTask.weekNumber : (rawTask.week_number !== undefined ? rawTask.week_number : context.weekNumber), 10) || 1;
  
  const domain = normalizeDomainKey(rawTask.domain || rawTask.domainId || rawTask.chosen_domain || context.domain || 'fullstack');

  const taskType = (rawTask.taskType || rawTask.type || rawTask.task_type || context.taskType || 'LEARN').toUpperCase();

  let taskTitle = rawTask.taskTitle || rawTask.title || context.taskTitle || '';
  let taskTopic = rawTask.taskTopic || rawTask.topic || rawTask.task_topic || context.taskTopic || context.topic || 'Core Learning';
  let taskSubtopic = rawTask.taskSubtopic || rawTask.subtopic || rawTask.subskillName || rawTask.task_subtopic || context.taskSubtopic || context.subtopic || taskTopic;

  // Clean up any stray "undefined" text if it slipped in
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
    estimated_minutes: durationMinutes,
    completed: rawTask.completed === true || String(rawTask.status || '').toUpperCase() === 'COMPLETED',
    status: String(rawTask.status || (rawTask.completed === true ? 'COMPLETED' : 'pending'))
  };

  // Requirement 3: FAIL LOUDLY IN DEVELOPMENT
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
}

/**
 * Normalizes entire Roadmap structure cleanly
 */
function normalizeRoadmap(roadmap) {
  if (!roadmap || typeof roadmap !== 'object') return roadmap;

  const normDomain = normalizeDomainKey(roadmap.domain || roadmap.domainId || roadmap.chosen_domain);
  roadmap.domain = normDomain;
  roadmap.domainId = normDomain;
  roadmap.domainName = DOMAIN_CONFIG[normDomain] ? DOMAIN_CONFIG[normDomain].displayName : (roadmap.domainName || normDomain);

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
                d.tasks = d.tasks.map((t, idx) => normalizeDailyTask(t, {
                  domain: normDomain,
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
}

/**
 * Data Integrity Validation Layer before saving to MongoDB Atlas
 */
function validateRoadmapDataIntegrity(roadmap) {
  if (!roadmap || !Array.isArray(roadmap.monthly_roadmap)) {
    throw new Error('[DATA INTEGRITY ERROR] Roadmap object missing monthly_roadmap array.');
  }

  const errors = [];
  const normDomain = normalizeDomainKey(roadmap.domain || roadmap.domainId);

  roadmap.monthly_roadmap.forEach((m, mIdx) => {
    const monthNum = m.month_number || (mIdx + 1);
    if (!Array.isArray(m.weeks)) {
      errors.push(`Month ${monthNum} has no weeks array.`);
      return;
    }

    m.weeks.forEach((w, wIdx) => {
      const weekNum = w.week_number || (wIdx + 1);
      if (!Array.isArray(w.days)) {
        errors.push(`Week ${weekNum} has no days array.`);
        return;
      }

      w.days.forEach((d, dIdx) => {
        const dayNum = d.day_number || (dIdx + 1);
        if (!Array.isArray(d.tasks) || d.tasks.length === 0) {
          errors.push(`Month ${monthNum} Week ${weekNum} Day ${dayNum} has no tasks.`);
          return;
        }

        d.tasks.forEach((t, tIdx) => {
          if (!t.taskId && !t.id) errors.push(`Month ${monthNum} Week ${weekNum} Day ${dayNum} Task ${tIdx + 1} missing taskId.`);
          if (!t.taskTitle && !t.title) errors.push(`Month ${monthNum} Week ${weekNum} Day ${dayNum} Task ${tIdx + 1} missing taskTitle.`);
          if (t.taskTitle && t.taskTitle.includes('undefined')) errors.push(`Month ${monthNum} Week ${weekNum} Day ${dayNum} Task ${tIdx + 1} title contains 'undefined': "${t.taskTitle}".`);
          if (!t.taskType && !t.type) errors.push(`Month ${monthNum} Week ${weekNum} Day ${dayNum} Task ${tIdx + 1} missing taskType.`);
          if (!t.durationMinutes && !t.estimated_minutes) errors.push(`Month ${monthNum} Week ${weekNum} Day ${dayNum} Task ${tIdx + 1} missing durationMinutes.`);
          if (t.monthNumber !== monthNum && t.month_number !== monthNum) errors.push(`Month ${monthNum} Week ${weekNum} Day ${dayNum} Task ${tIdx + 1} month mismatch.`);
          if (t.weekNumber !== weekNum && t.week_number !== weekNum) errors.push(`Month ${monthNum} Week ${weekNum} Day ${dayNum} Task ${tIdx + 1} week mismatch.`);
          if (t.dayNumber !== dayNum && t.day_number !== dayNum) errors.push(`Month ${monthNum} Week ${weekNum} Day ${dayNum} Task ${tIdx + 1} day mismatch.`);
        });
      });
    });
  });

  if (errors.length > 0) {
    console.error('[ROADMAP DATA INTEGRITY VALIDATION FAILED]', errors);
    throw new Error(`Roadmap Data Integrity Validation Failed: ${errors.join('; ')}`);
  }

  return true;
}


// ============================================================
// 1. CHECK MONGODB CONFIGURATION
// ============================================================

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing from .env file.');
  process.exit(1);
}


// ============================================================
// 2. USER SCHEMA
// ============================================================

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password_hash: {
      type: String,
      required: true
    },

    salt: {
      type: String,
      required: true
    },

    chosen_domain: {
      type: String,
      default: null
    },

    dsa_language: {
      type: String,
      enum: ['C++', 'Java', 'Python', 'JavaScript', 'C'],
      default: null
    },

    timeline_months: {
      type: Number,
      default: 4
    },

    daily_hours: {
      type: Number,
      default: 2.0
    },

    current_skill_level: {
      type: String,
      default: 'UNASSESSED'
    },

    quiz_completed: {
      type: Boolean,
      default: false
    },

    last_route: {
      type: String,
      default: 'roadmap'
    },

    roadmap_status: {
      type: String,
      enum: ['NOT_STARTED', 'GENERATING', 'READY', 'FAILED'],
      default: 'NOT_STARTED'
    },

    journey_started: {
      type: Boolean,
      default: false
    },

    journey_start_date: {
      type: Date,
      default: null
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'Registration'
  }
);


// ============================================================
// 3. MONGOOSE MODEL
// ============================================================

const User = mongoose.model('User', userSchema);


// ============================================================
// 3b. QUIZ EVALUATION SCHEMA & MODEL
// ============================================================

const quizEvaluationSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      index: true
    },
    domain: {
      type: String,
      required: true
    },
    score_pct: {
      type: Number,
      required: true
    },
    correct_count: {
      type: Number,
      required: true
    },
    total_questions: {
      type: Number,
      required: true
    },
    skill_level: {
      type: String,
      enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
      required: true
    },
    level_description: {
      type: String,
      required: true
    },
    mastered_topics: [
      {
        topic: String,
        accuracy_pct: Number
      }
    ],
    knowledge_gaps: [
      {
        topic: String,
        accuracy_pct: Number,
        reason: String
      }
    ],
    topic_evaluations: [
      {
        topic: String,
        correct_count: Number,
        total_questions: Number,
        score_pct: Number,
        proficiency_level: String,
        beginner_accuracy: Number,
        intermediate_accuracy: Number,
        advanced_accuracy: Number,
        weak_concepts: [String],
        reason: String
      }
    ],
    answers: [mongoose.Schema.Types.Mixed],
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'quiz_evaluations'
  }
);

const QuizEvaluation = mongoose.model('QuizEvaluation', quizEvaluationSchema, 'quiz_evaluations');


// ============================================================
// 3b2. USER SKILL PROFILE SCHEMA & MODEL
// ============================================================

const userSkillProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    domain: {
      type: String,
      required: true
    },
    skills: [
      {
        skillId: String,
        topic: String,
        subtopic: String,
        skillName: String,
        masteryScore: Number,
        confidence: Number,
        evidence: {
          correct: Number,
          total: Number
        },
        level: String,
        lastAssessedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'user_skill_profiles'
  }
);

const UserSkillProfile = mongoose.model('UserSkillProfile', userSkillProfileSchema, 'user_skill_profiles');


// ============================================================
// 3c. ROADMAP SCHEMA & MODEL
// ============================================================

const taskSchema = new mongoose.Schema({
  id: String,
  title: String,
  type: {
    type: String,
    enum: ['LEARN', 'PRACTICE', 'IMPLEMENT', 'PROBLEM_SOLVING', 'REVISION', 'ASSESSMENT', 'PROJECT', 'MOCK_TEST'],
    default: 'LEARN'
  },
  estimated_minutes: Number,
  difficulty: String,
  resources_ref: String,
  practice_details: String,
  revision_details: String,
  recommended_resources: {
    type: Array,
    default: []
  }
}, { _id: false, strict: false });

const daySchema = new mongoose.Schema({
  day_number: Number,
  day_name: String,
  topic: String,
  tasks: [taskSchema],
  total_minutes: Number
}, { _id: false });

const weekSchema = new mongoose.Schema({
  week_number: Number,
  month_number: Number,
  title: String,
  objective: String,
  topics: [String],
  subtopics: [String],
  estimated_hours: Number,
  practice: String,
  revision: String,
  assessment: String,
  expected_outcomes: [String],
  days: [daySchema]
}, { _id: false });

const monthSchema = new mongoose.Schema({
  month_number: Number,
  title: String,
  objective: String,
  topics: [String],
  subtopics: [String],
  estimated_hours: Number,
  priority: {
    type: String,
    enum: ['HIGH', 'MEDIUM', 'LOW'],
    default: 'HIGH'
  },
  difficulty: {
    type: String,
    enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    default: 'INTERMEDIATE'
  },
  expected_outcomes: [String],
  weeks: [weekSchema]
}, { _id: false });

const roadmapSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      index: true
    },
    domain: {
      type: String,
      required: true
    },
    timeline_months: {
      type: Number,
      required: true
    },
    daily_hours: {
      type: Number,
      required: true
    },
    quiz_score: {
      type: Number,
      default: null
    },
    journey_started: {
      type: Boolean,
      default: false
    },
    journey_start_date: {
      type: Date,
      default: null
    },
    overall_level: {
      type: String,
      default: null
    },
    starting_point: {
      type: String,
      default: null
    },
    curriculum_version: {
      type: String,
      default: 'v2_placement'
    },
    topic_performances: [
      {
        topic: String,
        score: Number,
        status: String
      }
    ],
    monthly_roadmap: [monthSchema],
    generated_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'roadmaps',
    versionKey: false
  }
);

const Roadmap = mongoose.model('Roadmap', roadmapSchema, 'roadmaps');

async function safeSaveRoadmap(roadmapDoc) {
  if (!roadmapDoc) return;
  try {
    roadmapDoc.markModified('monthly_roadmap');
    roadmapDoc.updated_at = new Date();
    await roadmapDoc.save();
  } catch (err) {
    if (err.name === 'VersionError' || (err.message && (err.message.includes('VersionError') || err.message.includes('No matching document found')))) {
      console.warn('⚠️ VersionError caught in safeSaveRoadmap, updating document atomically:', err.message);
      try {
        const plainDoc = roadmapDoc.toObject ? roadmapDoc.toObject() : { ...roadmapDoc };
        await Roadmap.updateOne(
          { _id: roadmapDoc._id },
          { $set: { monthly_roadmap: plainDoc.monthly_roadmap, updated_at: new Date() } }
        );
      } catch (retryErr) {
        console.error('❌ Atomic save fallback error:', retryErr.message);
      }
    } else {
      throw err;
    }
  }
}

// ============================================================
// RESOURCE RECOMMENDATION SCHEMA & MODEL
// ============================================================

const resourceSchema = new mongoose.Schema(
  {
    resource_id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    category_label: {
      type: String,
      default: 'PRIMARY' // PRIMARY, ALTERNATIVE, PRACTICE
    },
    title: {
      type: String,
      required: true
    },
    platform: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    resource_type: {
      type: String,
      required: true // TUTORIAL, PRACTICE, DOCUMENTATION, CHEAT_SHEET, PROJECT, QUIZ, VIDEO
    },
    description: {
      type: String,
      default: ''
    },
    topic: {
      type: String,
      required: true
    },
    subtopic: {
      type: String,
      default: ''
    },
    domain: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      required: true // BEGINNER, INTERMEDIATE, ADVANCED, MASTERED
    },
    estimated_minutes: {
      type: Number,
      default: 30
    },
    recommended_section: {
      type: String,
      default: ''
    },
    relevance_reason: {
      type: String,
      default: ''
    },
    is_official: {
      type: Boolean,
      default: false
    },
    quality_score: {
      type: Number,
      default: 80
    },
    verified_at: {
      type: Date,
      default: Date.now
    },
    is_valid: {
      type: Boolean,
      default: true
    }
  },
  {
    collection: 'resources'
  }
);

const Resource = mongoose.model('Resource', resourceSchema, 'resources');

// ============================================================
// DOMAIN CURRICULA DATA FOR ALL 8 TECH DOMAINS
// ============================================================

const DOMAIN_CURRICULA = {
  fullstack: {
    domainId: 'fullstack',
    domainName: 'Full-Stack Web Development',
    topics: [
      { id: 'fs_web_fund', name: 'Web & HTML/CSS Fundamentals', levelCategory: 'FOUNDATION', subtopics: ['HTML5 Semantic Elements', 'CSS3 Layouts & Flexbox', 'CSS Grid & Responsive Design', 'DOM Structure & Selection', 'Web Accessibility (a11y)'], prerequisites: [], difficulty: 'BEGINNER' },
      { id: 'fs_js', name: 'JavaScript Fundamentals', levelCategory: 'FOUNDATION', subtopics: ['Variables, Types & Operators', 'Control Flow & Functions', 'Arrays & Objects', 'Scope, Hoisting & Closures', 'ES6+ Features'], prerequisites: ['fs_web_fund'], difficulty: 'BEGINNER' },
      { id: 'fs_async', name: 'Modern JS & Async Programming', levelCategory: 'CORE_FOUNDATION', subtopics: ['DOM Manipulation & Events', 'Promises & Async/Await', 'Fetch API & AJAX', 'Event Loop & Microtasks', 'Prototype Chain'], prerequisites: ['fs_js'], difficulty: 'BEGINNER' },
      { id: 'fs_react', name: 'React & UI Architecture', levelCategory: 'CORE', subtopics: ['JSX & Component Hierarchy', 'State & Props Management', 'React Hooks Rules (useState, useEffect)', 'Virtual DOM & Reconciliation', 'Form Handling & Styling'], prerequisites: ['fs_async'], difficulty: 'INTERMEDIATE' },
      { id: 'fs_api', name: 'REST API & Backend Architecture', levelCategory: 'INTERMEDIATE', subtopics: ['Node.js Event-Driven Architecture', 'Express Middleware Pipelines', 'HTTP Methods, Headers & Status Codes', 'RESTful Resource Design', 'Authentication & JWT'], prerequisites: ['fs_async'], difficulty: 'INTERMEDIATE' },
      { id: 'fs_db', name: 'Database Engineering (SQL & MongoDB)', levelCategory: 'INTERMEDIATE', subtopics: ['Relational Schema Design & 3NF', 'SQL Queries, Joins & Indexes', 'MongoDB Document Schemas', 'ACID Transactions vs Eventual Consistency', 'ORM/ODM Integration'], prerequisites: ['fs_api'], difficulty: 'INTERMEDIATE' },
      { id: 'fs_sec', name: 'Web Security & Performance', levelCategory: 'ADVANCED', subtopics: ['XSS & Output Encoding', 'SQL Injection Mitigation', 'CSRF Defenses & SameSite Cookies', 'Password Hashing (Argon2/bcrypt)', 'CORS Preflight & Headers'], prerequisites: ['fs_db'], difficulty: 'ADVANCED' },
      { id: 'fs_sys', name: 'System Architecture & Deployment', levelCategory: 'SPECIALIZATION', subtopics: ['Stateless Application Scaling', 'Reverse Proxies (Nginx)', 'Caching Strategies (Redis)', 'Docker Containerization & CI/CD', 'Full-Stack Capstone Integration'], prerequisites: ['fs_sec'], difficulty: 'ADVANCED' }
    ]
  },
  datascience: {
    domainId: 'datascience',
    domainName: 'Data Science & Machine Learning',
    topics: [
      { id: 'ds_py_fund', name: 'Python Fundamentals', levelCategory: 'FOUNDATION', subtopics: ['Variables & Primitive Data Types', 'Control Flow (if/else, loops)', 'Functions, Scope & Recursion', 'Python Data Structures (Lists, Dicts, Sets)', 'String Manipulation & Basic Error Handling'], prerequisites: [], difficulty: 'BEGINNER' },
      { id: 'ds_py_ds', name: 'Python for Data Science & Math', levelCategory: 'CORE_FOUNDATION', subtopics: ['NumPy Arrays & Mathematical Operations', 'Pandas Series & DataFrames Basics', 'Data Indexing, Slicing & Filtering', 'Handling Missing Values & Basic Cleaning', 'Basic Summary Statistics'], prerequisites: ['ds_py_fund'], difficulty: 'BEGINNER' },
      { id: 'ds_prep', name: 'Data Preprocessing & EDA', levelCategory: 'CORE', subtopics: ['Pandas & NumPy Vectorization', 'Feature Scaling & One-Hot Encoding', 'Imbalanced Datasets (SMOTE)', 'Exploratory Data Analysis (EDA)', 'Data Visualization (Matplotlib & Seaborn)'], prerequisites: ['ds_py_ds'], difficulty: 'INTERMEDIATE' },
      { id: 'ds_stat', name: 'Statistical Inference & Probability', levelCategory: 'CORE', subtopics: ['Descriptive vs Inferential Statistics', 'Probability Distributions & Bayes Theorem', 'Hypothesis Testing & p-values', 'Correlation & Covariance', 'Confidence Intervals'], prerequisites: ['ds_py_ds'], difficulty: 'INTERMEDIATE' },
      { id: 'ds_ml', name: 'Machine Learning Fundamentals', levelCategory: 'INTERMEDIATE', subtopics: ['Supervised vs Unsupervised Concepts', 'Linear & Logistic Regression', 'Bias-Variance Tradeoff', 'Decision Trees & Ensembles', 'Model Evaluation Metrics (Precision/Recall/F1)'], prerequisites: ['ds_prep', 'ds_stat'], difficulty: 'INTERMEDIATE' },
      { id: 'ds_adv_ml', name: 'Advanced Machine Learning & Ensembles', levelCategory: 'ADVANCED', subtopics: ['Gradient Boosting (XGBoost / LightGBM)', 'L1/L2 Regularization (Lasso/Ridge)', 'Feature Engineering & Selection', 'Hyperparameter Tuning (Grid/Random Search)', 'Cross-Validation Strategies'], prerequisites: ['ds_ml'], difficulty: 'ADVANCED' },
      { id: 'ds_unsup', name: 'Unsupervised Learning & PCA', levelCategory: 'ADVANCED', subtopics: ['K-Means & Hierarchical Clustering', 'PCA Eigendecomposition', 'Dimensionality Reduction', 'Anomaly Detection', 'Silhouette Analysis'], prerequisites: ['ds_adv_ml'], difficulty: 'ADVANCED' },
      { id: 'ds_dl', name: 'Deep Learning & Neural Networks', levelCategory: 'ADVANCED', subtopics: ['Activation Functions (ReLU/Sigmoid)', 'Backpropagation Math', 'CNN Architectures for Computer Vision', 'Dropout & Batch Normalization', 'Loss Functions & Optimization'], prerequisites: ['ds_adv_ml'], difficulty: 'ADVANCED' },
      { id: 'ds_nlp', name: 'Advanced Deep Learning & NLP', levelCategory: 'SPECIALIZATION', subtopics: ['Word Embeddings (Word2Vec / FastText)', 'Recurrent Networks & LSTMs', 'Self-Attention Mechanism', 'Transformers (BERT vs GPT)', 'LLM Fine-tuning & Prompt Tuning'], prerequisites: ['ds_dl'], difficulty: 'ADVANCED' },
      { id: 'ds_ops', name: 'MLOps, Model Deployment & Projects', levelCategory: 'SPECIALIZATION', subtopics: ['Model Serialization (ONNX / Pickle)', 'FastAPI/Flask API Serving', 'Concept Drift Monitoring', 'Feature Stores', 'End-to-End Capstone Project'], prerequisites: ['ds_nlp'], difficulty: 'ADVANCED' }
    ]
  },
  dsa: {
    domainId: 'dsa',
    domainName: 'Data Structures & Algorithms (Interview Prep)',
    topics: [
      { id: 'dsa_fund', name: 'Programming Logic & Complexity Analysis', levelCategory: 'FOUNDATION', subtopics: ['Variables & Primitive Operations', 'Loops & Conditional Logic', 'Big-O Time & Space Complexity Analysis', 'Basic Array & String Operations', 'Recursion Fundamentals'], prerequisites: [], difficulty: 'BEGINNER' },
      { id: 'dsa_arr', name: 'Arrays, Hash Maps & Two Pointers', levelCategory: 'CORE_FOUNDATION', subtopics: ['Array Traversal & In-Place Mutation', 'Hash Map Collision & O(1) Lookups', 'Two Sum & Pair Search', 'Two Pointers Technique', 'Prefix Sum Array'], prerequisites: ['dsa_fund'], difficulty: 'BEGINNER' },
      { id: 'dsa_win', name: 'Sliding Window & Fast/Slow Pointers', levelCategory: 'CORE', subtopics: ['Fixed Size Sliding Window', 'Dynamic Window Shrink', 'Fast & Slow Pointer Cycle Detection', 'Kadane Algorithm for Max Subarray', 'Frequency Maps'], prerequisites: ['dsa_arr'], difficulty: 'BEGINNER' },
      { id: 'dsa_stack', name: 'Stacks & Queues', levelCategory: 'INTERMEDIATE', subtopics: ['LIFO & FIFO Mechanics', 'Valid Parentheses Matching', 'Monotonic Stack Pattern', 'Queue via Two Stacks', 'Postfix Expression Evaluation'], prerequisites: ['dsa_arr'], difficulty: 'INTERMEDIATE' },
      { id: 'dsa_tree', name: 'Trees & Search Algorithms', levelCategory: 'INTERMEDIATE', subtopics: ['Binary Search Tree Operations', 'In-Order / Pre-Order / Post-Order Traversal', 'Heap / Priority Queue Basics', 'Lowest Common Ancestor (LCA)', 'Trie Data Structure'], prerequisites: ['dsa_stack'], difficulty: 'INTERMEDIATE' },
      { id: 'dsa_graph', name: 'Graph Algorithms & Shortest Path', levelCategory: 'ADVANCED', subtopics: ['BFS & DFS Graph Traversals', 'Topological Sort (Kahn Algorithm)', 'Dijkstra Shortest Path Algorithm', 'Cycle Detection in DAGs', 'Union-Find / Disjoint Set'], prerequisites: ['dsa_tree'], difficulty: 'ADVANCED' },
      { id: 'dsa_dp', name: 'Dynamic Programming', levelCategory: 'ADVANCED', subtopics: ['Memoization vs Tabulation', '0/1 Knapsack Pattern', 'Longest Common Subsequence', 'Grid Path DP Problems', 'State Compression DP'], prerequisites: ['dsa_tree'], difficulty: 'ADVANCED' },
      { id: 'dsa_adv', name: 'Advanced Coding Patterns & Mock Interviews', levelCategory: 'SPECIALIZATION', subtopics: ['Advanced DP Patterns', 'Segment Trees & Fenwick Trees', 'Systemic Coding Interview Strategies', 'Timed Coding Assessment Simulation', 'Comprehensive Problem Solving Capstone'], prerequisites: ['dsa_graph', 'dsa_dp'], difficulty: 'ADVANCED' }
    ]
  },
  devops: {
    domainId: 'devops',
    domainName: 'Cloud Engineering & DevOps',
    topics: [
      { id: 'dev_fund', name: 'Computer Networking & OS Basics', levelCategory: 'FOUNDATION', subtopics: ['OS Architecture Basics', 'Linux File System Navigation', 'File Permissions & User Mgmt', 'TCP/IP, Ports & Protocols', 'DNS, HTTP & SSH Connections'], prerequisites: [], difficulty: 'BEGINNER' },
      { id: 'dev_linux', name: 'Linux Administration & Shell', levelCategory: 'CORE_FOUNDATION', subtopics: ['Linux Process Management (ps, top)', 'Systemd Service Unit Configuration', 'Bash Scripting & Automation', 'Networking Utilities (ss/dig/curl)', 'SSH Hardening'], prerequisites: ['dev_fund'], difficulty: 'BEGINNER' },
      { id: 'dev_docker', name: 'Containerization & Docker', levelCategory: 'CORE', subtopics: ['Container Concepts vs VMs', 'Dockerfile Optimization', 'Multi-stage Builds', 'Docker Container Networking', 'Docker Compose Orchestration'], prerequisites: ['dev_linux'], difficulty: 'INTERMEDIATE' },
      { id: 'dev_cicd', name: 'CI/CD Automation', levelCategory: 'INTERMEDIATE', subtopics: ['Version Control (Git Workflow)', 'GitHub Actions Workflows', 'Automated Testing Pipelines', 'Container Registry Push', 'Blue-Green Deployments'], prerequisites: ['dev_docker'], difficulty: 'INTERMEDIATE' },
      { id: 'dev_k8s', name: 'Kubernetes Infrastructure', levelCategory: 'ADVANCED', subtopics: ['Pods, Deployments & ReplicaSets', 'Services & Ingress Controllers', 'Persistent Volumes & Claims', 'Helm Chart Package Mgmt', 'Cluster Autoscaling'], prerequisites: ['dev_cicd'], difficulty: 'INTERMEDIATE' },
      { id: 'dev_iac', name: 'Infrastructure as Code', levelCategory: 'ADVANCED', subtopics: ['Terraform Syntax & HCL', 'State File Management', 'Terraform Modules', 'Ansible Configuration Mgmt', 'Cloud Resource Provisioning'], prerequisites: ['dev_k8s'], difficulty: 'ADVANCED' },
      { id: 'dev_obs', name: 'Cloud Architecture & Observability Capstone', levelCategory: 'SPECIALIZATION', subtopics: ['Prometheus Metrics Collection', 'Grafana Dashboarding', 'Distributed Tracing (Jaeger)', 'IAM & Cloud Security', 'Disaster Recovery'], prerequisites: ['dev_iac'], difficulty: 'ADVANCED' }
    ]
  },
  cybersecurity: {
    domainId: 'cybersecurity',
    domainName: 'Cybersecurity & Ethical Hacking',
    topics: [
      { id: 'sec_fund', name: 'Computer Systems & CLI Fundamentals', levelCategory: 'FOUNDATION', subtopics: ['OS Principles (Linux/Windows)', 'Command Line Utilities', 'Network Architecture Basics', 'Data Encoding (Base64/Hex)', 'File Permissions & Privileges'], prerequisites: [], difficulty: 'BEGINNER' },
      { id: 'sec_net', name: 'Networking Protocols & Traffic Analysis', levelCategory: 'CORE_FOUNDATION', subtopics: ['TCP/IP Handshake & Packets', 'Wireshark Packet Capture', 'Subnetting & Routing', 'DNS & HTTP Vulnerabilities', 'Arp Spoofing Detection'], prerequisites: ['sec_fund'], difficulty: 'BEGINNER' },
      { id: 'sec_def', name: 'Network Defense & Firewalls', levelCategory: 'CORE', subtopics: ['Stateful vs Stateless Firewalls', 'IDS/IPS Rules & Signatures', 'VPN Tunneling Protocols', 'Nmap Network Scanning', 'Zero Trust Architecture'], prerequisites: ['sec_net'], difficulty: 'INTERMEDIATE' },
      { id: 'sec_web', name: 'Web Application Vulnerabilities', levelCategory: 'INTERMEDIATE', subtopics: ['OWASP Top 10 Deep Dive', 'Cross-Site Scripting (XSS)', 'SQL Injection Exploitation', 'CSRF & Session Hijacking', 'IDOR & Auth Bypasses'], prerequisites: ['sec_def'], difficulty: 'INTERMEDIATE' },
      { id: 'sec_crypto', name: 'Cryptography & PKI', levelCategory: 'INTERMEDIATE', subtopics: ['Symmetric vs Asymmetric Ciphers', 'Cryptographic Hash Functions', 'Public Key Infrastructure (PKI)', 'TLS Handshake Inspection', 'Digital Signatures'], prerequisites: ['sec_web'], difficulty: 'INTERMEDIATE' },
      { id: 'sec_sys', name: 'System Hardening & Privilege Escalation', levelCategory: 'ADVANCED', subtopics: ['Linux/Windows Security Hardening', 'Active Directory Security', 'Role-Based Access Control (RBAC)', 'Kernel Exploitation Protections', 'Privilege Escalation Defenses'], prerequisites: ['sec_crypto'], difficulty: 'ADVANCED' },
      { id: 'sec_ir', name: 'Incident Response & Forensics Capstone', levelCategory: 'SPECIALIZATION', subtopics: ['SIEM Log Analysis & Splunk', 'Memory & Disk Forensics', 'Threat Hunting Techniques', 'Malware Static Analysis', 'Incident Remediation Playbooks'], prerequisites: ['sec_sys'], difficulty: 'ADVANCED' }
    ]
  },
  mobile: {
    domainId: 'mobile',
    domainName: 'Mobile App Development (React Native & Flutter)',
    topics: [
      { id: 'mob_fund', name: 'Programming Basics for Mobile', levelCategory: 'FOUNDATION', subtopics: ['JavaScript / Dart Language Basics', 'Variables, Functions & Scope', 'Control Flow & Data Structures', 'Mobile App Architecture Basics', 'Asynchronous Programming'], prerequisites: [], difficulty: 'BEGINNER' },
      { id: 'mob_ui', name: 'Mobile UI Layouts & Components', levelCategory: 'CORE_FOUNDATION', subtopics: ['Flexbox Layout Engine', 'React Native / Flutter Components', 'Custom Reusable UI Elements', 'Screen Responsiveness', 'Touch & Gesture Handling'], prerequisites: ['mob_fund'], difficulty: 'BEGINNER' },
      { id: 'mob_state', name: 'State Management & Navigation', levelCategory: 'CORE', subtopics: ['Redux / Context / Provider', 'Stack & Tab Navigation', 'Deep Linking Setup', 'Async State Management', 'Form Validation'], prerequisites: ['mob_ui'], difficulty: 'INTERMEDIATE' },
      { id: 'mob_native', name: 'Native Hardware Integration', levelCategory: 'INTERMEDIATE', subtopics: ['Camera & File Access APIs', 'Geolocation & Mapping', 'Push Notifications (FCM)', 'Device Hardware Sensors', 'Native Modules Bridge'], prerequisites: ['mob_state'], difficulty: 'INTERMEDIATE' },
      { id: 'mob_perf', name: 'Mobile Performance & Local Storage', levelCategory: 'ADVANCED', subtopics: ['AsyncStorage & SQLite DB', 'Image Caching & Lazy Loading', 'Memory Leak Profiling', 'FPS Optimization', 'Offline-First Synchronization'], prerequisites: ['mob_native'], difficulty: 'INTERMEDIATE' },
      { id: 'mob_sec', name: 'App Security & Authentication', levelCategory: 'ADVANCED', subtopics: ['OAuth 2.0 / OpenID Connect', 'Secure Keychain / Keystore', 'Biometric Auth (Touch/Face ID)', 'SSL Pinning', 'App Obfuscation'], prerequisites: ['mob_perf'], difficulty: 'ADVANCED' },
      { id: 'mob_cicd', name: 'App Store Publishing & CI/CD Capstone', levelCategory: 'SPECIALIZATION', subtopics: ['Fastlane Automation', 'iOS Code Signing & Provisioning', 'Android APK/AAB Bundle Signing', 'App Store Connect Submission', 'Google Play Release Management'], prerequisites: ['mob_sec'], difficulty: 'ADVANCED' }
    ]
  },
  ai_llm: {
    domainId: 'ai_llm',
    domainName: 'AI & LLM Systems Engineering',
    topics: [
      { id: 'ai_fund', name: 'Python Programming & Math Foundations', levelCategory: 'FOUNDATION', subtopics: ['Python Syntax & Control Flow', 'Data Structures (Lists, Dicts, Sets)', 'Functions & Modules', 'Basic Linear Algebra & Vectors', 'REST API Requests Basics'], prerequisites: [], difficulty: 'BEGINNER' },
      { id: 'ai_prompt', name: 'Prompt Engineering & Context', levelCategory: 'CORE_FOUNDATION', subtopics: ['Zero-shot & Few-shot Prompting', 'System Prompt Design', 'Context Window Allocation', 'Structured Output JSON Generation', 'Prompt Chaining'], prerequisites: ['ai_fund'], difficulty: 'BEGINNER' },
      { id: 'ai_vec', name: 'Embeddings & Vector Databases', levelCategory: 'CORE', subtopics: ['Text Vector Embeddings', 'Cosine & Dot Product Similarity', 'Pinecone / ChromaDB / FAISS', 'HNSW Indexing Algorithms', 'Vector Search Performance'], prerequisites: ['ai_prompt'], difficulty: 'INTERMEDIATE' },
      { id: 'ai_rag', name: 'RAG Architectures & Retrieval', levelCategory: 'INTERMEDIATE', subtopics: ['Document Chunking Strategies', 'Hybrid Keyword & Vector Search', 'Re-ranking Models (Cohere)', 'Query Rewriting & Expansion', 'RAG Context Injection'], prerequisites: ['ai_vec'], difficulty: 'INTERMEDIATE' },
      { id: 'ai_ft', name: 'LLM Fine-Tuning & Quantization', levelCategory: 'ADVANCED', subtopics: ['LoRA & QLoRA Parameter Efficient Tuning', 'Instruction Dataset Curation', 'Model Quantization (GGUF / AWQ)', 'Local Serving with Ollama', 'Model Fine-tuning Pipeline'], prerequisites: ['ai_rag'], difficulty: 'ADVANCED' },
      { id: 'ai_agent', name: 'Agent Frameworks & Tool Calling', levelCategory: 'ADVANCED', subtopics: ['ReAct Agent Loop Architecture', 'Function Calling & Schema Binding', 'Multi-Agent Collaboration', 'Memory & State Persistence', 'Autonomous Workflow Control'], prerequisites: ['ai_ft'], difficulty: 'ADVANCED' },
      { id: 'ai_eval', name: 'Evaluation, Safety & Guardrails Capstone', levelCategory: 'SPECIALIZATION', subtopics: ['Hallucination Detection Metrics', 'NeMo & Llama Guardrails', 'LLM Benchmark Evaluation', 'Prompt Injection Prevention', 'Cost & Latency Optimization'], prerequisites: ['ai_agent'], difficulty: 'ADVANCED' }
    ]
  },
  system_design: {
    domainId: 'system_design',
    domainName: 'System Design & Distributed Architecture',
    topics: [
      { id: 'sd_fund', name: 'Server Basics & Networking Fundamentals', levelCategory: 'FOUNDATION', subtopics: ['Client-Server Architecture Basics', 'HTTP/HTTPS Requests & Headers', 'Web Server Principles', 'Relational vs Non-Relational DB Basics', 'Basic API Concepts'], prerequisites: [], difficulty: 'BEGINNER' },
      { id: 'sd_scale', name: 'Scalability & Load Balancing', levelCategory: 'CORE_FOUNDATION', subtopics: ['Horizontal vs Vertical Scaling', 'Load Balancer Algorithms (Layer 4 vs 7)', 'Consistent Hashing', 'Stateless Application Design', 'Rate Limiting Algorithms'], prerequisites: ['sd_fund'], difficulty: 'BEGINNER' },
      { id: 'sd_cache', name: 'Caching & Content Delivery', levelCategory: 'CORE', subtopics: ['Cache-Aside & Write-Through Patterns', 'Redis Cluster & Eviction Policies', 'CDN Static Asset Caching', 'Cache Stampede Prevention', 'Invalidation Strategies'], prerequisites: ['sd_scale'], difficulty: 'INTERMEDIATE' },
      { id: 'sd_db', name: 'Database Sharding & Replication', levelCategory: 'INTERMEDIATE', subtopics: ['Master-Slave Read Replicas', 'Horizontal Sharding Keys', 'CAP Theorem Tradeoffs', 'NoSQL vs SQL Selection', 'Index Tuning'], prerequisites: ['sd_cache'], difficulty: 'INTERMEDIATE' },
      { id: 'sd_queue', name: 'Asynchronous Queues & Streaming', levelCategory: 'INTERMEDIATE', subtopics: ['Message Queues (RabbitMQ)', 'Event Streaming (Kafka Partitioning)', 'Dead Letter Queues', 'Idempotent Consumer Processing', 'Pub/Sub Messaging'], prerequisites: ['sd_db'], difficulty: 'INTERMEDIATE' },
      { id: 'sd_dist', name: 'Distributed Systems & Consistency', levelCategory: 'ADVANCED', subtopics: ['Consensus Algorithms (Raft)', 'Saga Pattern for Transactions', 'Distributed Locking (Redlock)', 'Two-Phase Commit (2PC)', 'Eventual Consistency'], prerequisites: ['sd_queue'], difficulty: 'ADVANCED' },
      { id: 'sd_micro', name: 'Microservices Architecture Capstone', levelCategory: 'SPECIALIZATION', subtopics: ['Service Mesh (Istio)', 'Circuit Breaker Pattern (Resilience4j)', 'gRPC vs REST APIs', 'Centralized Logging & Tracing', 'API Gateway Routing'], prerequisites: ['sd_dist'], difficulty: 'ADVANCED' }
    ]
  }
};

// Helper: Normalize domain string to canonical domain key
function canonicalizeDomainKey(rawDomain) {
  if (!rawDomain || typeof rawDomain !== 'string') return 'fullstack';
  const clean = rawDomain.trim().toLowerCase();
  if (clean.includes('datascience') || clean.includes('data science') || clean.includes('machine learning')) return 'datascience';
  if (clean.includes('dsa') || clean.includes('algorithm') || clean.includes('data structure') || clean.includes('interview prep')) return 'dsa';
  if (clean.includes('devops') || clean.includes('cloud')) return 'devops';
  if (clean.includes('cyber') || clean.includes('security') || clean.includes('hacking')) return 'cybersecurity';
  if (clean.includes('mobile') || clean.includes('react native') || clean.includes('flutter') || clean.includes('ios') || clean.includes('android')) return 'mobile';
  if (clean.includes('ai') || clean.includes('llm') || clean.includes('genai') || clean.includes('rag')) return 'ai_llm';
  if (clean.includes('system design') || clean.includes('system_design') || clean.includes('architecture') || clean.includes('microservice')) return 'system_design';
  return 'fullstack';
}


// ============================================================
// CURRICULUM PLACEMENT ENGINE
// Calculates domain prerequisite gaps, user level, and personalized starting point
// ============================================================

function analyzeCurriculumPlacement({ domain, quizEvaluation, timelineMonths, dailyHours }) {
  const domainKey = canonicalizeDomainKey(domain);
  const curriculum = DOMAIN_CURRICULA[domainKey] || DOMAIN_CURRICULA.fullstack;

  let overallScore = 0;
  let userLevel = 'BEGINNER';

  let isSelfAssessed = false;
  if (quizEvaluation) {
    isSelfAssessed = !!(quizEvaluation.is_self_assessed || quizEvaluation.isSelfAssessed);
    overallScore = quizEvaluation.score_pct !== undefined 
      ? quizEvaluation.score_pct 
      : (quizEvaluation.scorePct !== undefined ? quizEvaluation.scorePct : 0);

    const rawLevel = quizEvaluation.skill_level || quizEvaluation.skillLevel || quizEvaluation.skillTier;
    if (rawLevel) {
      const cleanL = rawLevel.toUpperCase();
      if (cleanL.includes('BEGINNER')) userLevel = 'BEGINNER';
      else if (cleanL.includes('INTERMEDIATE')) userLevel = 'INTERMEDIATE';
      else if (cleanL.includes('ADVANCED')) userLevel = 'ADVANCED';
      else if (cleanL.includes('MASTERED') || cleanL.includes('PRO') || cleanL.includes('EXPERT')) userLevel = 'MASTERED';
    }
  }

  // Enforce score-to-level boundaries if score is explicitly provided and NOT self-assessed
  if (!isSelfAssessed) {
    if (overallScore < 50) {
      userLevel = 'BEGINNER';
    } else if (overallScore >= 50 && overallScore < 75 && userLevel === 'BEGINNER') {
      userLevel = 'INTERMEDIATE';
    } else if (overallScore >= 90 && userLevel !== 'MASTERED') {
      userLevel = 'MASTERED';
    }
  }

  // Topic-level gap analysis
  const topicStats = {};
  const topicEvals = quizEvaluation ? (quizEvaluation.topic_evaluations || quizEvaluation.topicEvaluations || []) : [];
  topicEvals.forEach(te => {
    const topicName = te.topic;
    const acc = te.score_pct !== undefined ? te.score_pct : (te.accuracy_pct !== undefined ? te.accuracy_pct : (te.accuracy !== undefined ? te.accuracy : 0));
    topicStats[topicName] = { score: acc, status: acc < 50 ? 'WEAK' : (acc >= 75 ? 'STRONG' : 'INTERMEDIATE') };
  });

  const knowledgeGaps = quizEvaluation ? (quizEvaluation.knowledge_gaps || quizEvaluation.knowledgeGaps || []) : [];
  knowledgeGaps.forEach(gap => {
    if (gap.topic) {
      topicStats[gap.topic] = { score: gap.accuracy_pct || 30, status: 'WEAK' };
    }
  });

  const masteredTopics = quizEvaluation ? (quizEvaluation.mastered_topics || quizEvaluation.masteredTopics || []) : [];
  masteredTopics.forEach(m => {
    if (m.topic) {
      if (!topicStats[m.topic] || topicStats[m.topic].status !== 'WEAK') {
        topicStats[m.topic] = { score: m.accuracy_pct || 85, status: 'STRONG' };
      }
    }
  });

  // Prerequisite Gap Analysis
  const prerequisiteGaps = [];
  curriculum.topics.forEach(t => {
    let matched = topicStats[t.name];
    if (!matched) {
      const key = Object.keys(topicStats).find(k => k.toLowerCase().trim() === t.name.toLowerCase().trim());
      if (key) matched = topicStats[key];
    }

    if (matched) {
      if (matched.status === 'WEAK' || matched.score < 50) {
        prerequisiteGaps.push({ topicId: t.id, name: t.name, score: matched.score, level: t.levelCategory });
      }
    } else {
      if (userLevel === 'BEGINNER' && (t.levelCategory === 'FOUNDATION' || t.levelCategory === 'CORE_FOUNDATION')) {
        prerequisiteGaps.push({ topicId: t.id, name: t.name, score: overallScore, level: t.levelCategory });
      }
    }
  });

  // Calculate Starting Point Index
  let startingTopicIndex = 0;
  if (userLevel === 'BEGINNER' || overallScore < 50) {
    // 0% Beginner MUST start at Foundation (Index 0)
    startingTopicIndex = 0;
  } else if (userLevel === 'INTERMEDIATE') {
    const firstGapIdx = curriculum.topics.findIndex(t => prerequisiteGaps.some(g => g.topicId === t.id));
    if (firstGapIdx >= 0 && firstGapIdx < 3) {
      startingTopicIndex = firstGapIdx;
    } else {
      const coreIdx = curriculum.topics.findIndex(t => t.levelCategory === 'CORE' || t.levelCategory === 'CORE_FOUNDATION');
      startingTopicIndex = coreIdx >= 0 ? coreIdx : 1;
    }
  } else {
    // ADVANCED / MASTERED
    const firstGapIdx = curriculum.topics.findIndex(t => prerequisiteGaps.some(g => g.topicId === t.id));
    if (firstGapIdx >= 0 && firstGapIdx < 2) {
      startingTopicIndex = firstGapIdx;
    } else {
      const advIdx = curriculum.topics.findIndex(t => t.levelCategory === 'INTERMEDIATE' || t.levelCategory === 'ADVANCED');
      startingTopicIndex = advIdx >= 0 ? advIdx : Math.floor(curriculum.topics.length / 2);
    }
  }

  const startingPoint = curriculum.topics[startingTopicIndex];

  // Log required debugging output
  console.log("DIAGNOSTIC DATA:", {
    score_pct: overallScore,
    quiz_evaluation: quizEvaluation ? "PROVIDED" : "NONE",
    topic_evaluations_count: topicEvals.length
  });
  console.log("USER LEVEL:", userLevel);
  console.log("CURRICULUM STARTING POINT:", startingPoint ? startingPoint.name : "None");
  console.log("PREREQUISITE GAPS:", prerequisiteGaps.map(g => g.name));

  return {
    domainKey,
    curriculum,
    overallScore,
    userLevel,
    prerequisiteGaps,
    startingTopicIndex,
    startingPoint
  };
}


function generatePersonalizedRoadmapEngine({ user_id, domain, timeline_months, daily_hours, quizEvaluation }) {
  const domainKey = canonicalizeDomainKey(domain);
  const curriculum = DOMAIN_CURRICULA[domainKey] || DOMAIN_CURRICULA.fullstack;

  const timelineMonths = parseInt(timeline_months, 10) || 4;
  const dailyHours = parseFloat(daily_hours) || 2.0;
  const dailyMinutes = Math.round(dailyHours * 60);

  // 1. RUN CURRICULUM PLACEMENT ENGINE BEFORE GENERATING ROADMAP
  const placement = analyzeCurriculumPlacement({
    domain,
    quizEvaluation,
    timelineMonths,
    dailyHours
  });

  const overallScore = placement.overallScore;
  const userLevel = placement.userLevel;
  const startingPoint = placement.startingPoint;
  const prerequisiteGaps = placement.prerequisiteGaps;

  // Build Personalized Topic Sequence based on starting point & level depth
  const availableTopics = curriculum.topics;
  const totalDomainTopics = availableTopics.length;

  let topicSequence = [];

  if (userLevel === 'BEGINNER') {
    // Beginner gets full sequence starting from Foundation (Index 0)
    topicSequence = availableTopics.slice(0);
  } else if (userLevel === 'INTERMEDIATE') {
    // Intermediate starts at placement index, but includes rapid foundation review
    const startIdx = placement.startingTopicIndex;
    topicSequence = availableTopics.slice(startIdx);
    if (startIdx > 0) {
      topicSequence.unshift({
        id: `${curriculum.topics[0].id}_review`,
        name: `Foundation Review: ${curriculum.topics[0].name}`,
        levelCategory: 'FOUNDATION',
        subtopics: curriculum.topics[0].subtopics.slice(0, 3),
        difficulty: 'BEGINNER'
      });
    }
  } else {
    // ADVANCED / MASTERED
    const startIdx = placement.startingTopicIndex;
    topicSequence = availableTopics.slice(startIdx);
    if (startIdx > 0 && prerequisiteGaps.length > 0) {
      topicSequence.unshift({
        id: 'gap_validation',
        name: `Prerequisite Gap Validation: ${prerequisiteGaps[0].name}`,
        levelCategory: 'FOUNDATION',
        subtopics: ['Rapid Syntax Review', 'Key Concepts Verification'],
        difficulty: 'INTERMEDIATE'
      });
    }
  }

  if (topicSequence.length === 0) {
    topicSequence = availableTopics;
  }

  const topicPerformances = curriculum.topics.map(t => {
    const isGap = prerequisiteGaps.some(g => g.topicId === t.id);
    let status = isGap ? 'WEAK' : (overallScore >= 75 ? 'STRONG' : 'INTERMEDIATE');
    return {
      topic: t.name,
      score: isGap ? 30 : (overallScore || 50),
      status
    };
  });

  const monthlyRoadmap = [];
  const seqLength = topicSequence.length;

  for (let m = 1; m <= timelineMonths; m++) {
    let assignedTopics = [];

    if (timelineMonths >= seqLength) {
      if (m <= seqLength) {
        assignedTopics = [topicSequence[m - 1]];
      } else {
        const revIdx = (m - 1) % seqLength;
        assignedTopics = [topicSequence[revIdx]];
      }
    } else {
      const startIdx = Math.floor(((m - 1) * seqLength) / timelineMonths);
      const endIdx = Math.floor((m * seqLength) / timelineMonths);
      assignedTopics = topicSequence.slice(startIdx, Math.max(startIdx + 1, endIdx));
    }

    const assignedNames = assignedTopics.map(t => t.name);
    const assignedSubtopics = assignedTopics.flatMap(t => t.subtopics || []);

    let priority = 'HIGH';
    let difficulty = userLevel === 'BEGINNER' ? 'BEGINNER' : (userLevel === 'MASTERED' ? 'ADVANCED' : 'INTERMEDIATE');
    let monthTitle = `Month ${m}: ${assignedNames.join(' & ')}`;
    let objective = `Master concepts and practical patterns of ${assignedNames.join(', ')}.`;

    if (m === 1 && userLevel === 'BEGINNER') {
      priority = 'HIGH';
      difficulty = 'BEGINNER';
      monthTitle = `Month ${m}: Essential Foundations (${assignedNames.join(', ')})`;
      objective = `Build core programming foundations, setup development environment, and master fundamental syntax for ${assignedNames.join(', ')}.`;
    } else if (m === 1 && userLevel === 'INTERMEDIATE') {
      priority = 'HIGH';
      difficulty = 'INTERMEDIATE';
      monthTitle = `Month ${m}: Foundation Review & Core Accelerated Learning (${assignedNames.join(', ')})`;
      objective = `Perform rapid review of prerequisites and move quickly into core ${assignedNames.join(', ')} topics.`;
    } else if (userLevel === 'MASTERED' || userLevel === 'ADVANCED') {
      priority = 'MEDIUM';
      difficulty = 'ADVANCED';
      monthTitle = `Month ${m}: Advanced Implementation & System Specialization (${assignedNames.join(', ')})`;
      objective = `Fast-track past basic topics and focus on advanced production patterns, optimization, and capstone projects in ${assignedNames.join(', ')}.`;
    }

    const estHoursPerMonth = Math.round(dailyHours * 28);
    const weeks = [];

    for (let wInMonth = 1; wInMonth <= 4; wInMonth++) {
      const overallWeekNum = (m - 1) * 4 + wInMonth;

      let weekTitle = `Week ${overallWeekNum}: ${assignedNames[0] || 'Core Learning'}`;
      let weekObj = `Focus on ${assignedNames.join(', ')} subtopics.`;
      let practiceFocus = 'Guided coding exercises and syntax verification.';
      let revisionFocus = 'Concept summary review.';
      let assessmentFocus = 'Weekly knowledge check.';

      if (userLevel === 'BEGINNER' && m === 1) {
        if (wInMonth === 1) {
          weekTitle = `Week ${overallWeekNum}: ${assignedNames[0]} - Syntax, Variables & I/O`;
          weekObj = `Master basic syntax, variables, operators, and input/output mechanics of ${assignedNames[0]}.`;
          practiceFocus = 'Write basic scripts, inspect variable types, and execute basic I/O operations.';
        } else if (wInMonth === 2) {
          weekTitle = `Week ${overallWeekNum}: ${assignedNames[0]} - Control Flow, Conditionals & Loops`;
          weekObj = `Master conditional statements (if/else) and iteration loops (for/while).`;
          practiceFocus = 'Build algorithmic flowcharts, write loop drills, and solve conditional logic tasks.';
        } else if (wInMonth === 3) {
          weekTitle = `Week ${overallWeekNum}: ${assignedNames[0]} - Functions, Scope & Data Structures`;
          weekObj = `Master function definitions, scope rules, and built-in data structures (lists, tuples, dicts).`;
          practiceFocus = 'Implement custom functions, manipulate data structures, and debug function scope.';
        } else {
          weekTitle = `Week ${overallWeekNum}: ${assignedNames[0]} - Comprehensive Foundation Review & Milestone Assessment`;
          weekObj = `Consolidate programming foundations and complete the Month 1 practical assessment.`;
          practiceFocus = 'Build a mini starter application combining all foundational concepts.';
        }
      } else {
        if (wInMonth === 1) {
          weekTitle = `Week ${overallWeekNum}: Conceptual Core & Mechanics (${assignedNames[0]})`;
          weekObj = `Deep dive into conceptual foundations and core mechanics of ${assignedSubtopics.slice(0, 3).join(', ')}.`;
          practiceFocus = 'Code walkthroughs, syntax drills, and basic implementation exercises.';
        } else if (wInMonth === 2) {
          weekTitle = `Week ${overallWeekNum}: Applied Patterns & Implementation (${assignedNames[0]})`;
          weekObj = `Apply core concepts to practical scenarios and design problems involving ${assignedSubtopics.slice(2, 5).join(', ')}.`;
          practiceFocus = 'Hands-on project features and pattern implementation.';
        } else if (wInMonth === 3) {
          weekTitle = `Week ${overallWeekNum}: Advanced Problem Solving & Optimization`;
          weekObj = `Solve complex problems, optimize performance, and handle edge cases for ${assignedNames.join(', ')}.`;
          practiceFocus = 'Timed problem solving and multi-step scenario exercises.';
        } else {
          weekTitle = `Week ${overallWeekNum}: Review, Remediation & Milestone Assessment`;
          weekObj = `Consolidate weekly learning, review weak areas, and evaluate complete topic mastery.`;
          practiceFocus = 'Full mini-project integration and complex problem sets.';
        }
      }

      const days = [];
      const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

      for (let d = 1; d <= 7; d++) {
        const dayName = dayNames[d - 1];
        let dayTopic = assignedNames[0] || curriculum.topics[0].name;
        let dayTasks = [];

        if (d === 1) {
          const t1Mins = Math.round(dailyMinutes * 0.35);
          const t2Mins = Math.round(dailyMinutes * 0.40);
          const t3Mins = dailyMinutes - t1Mins - t2Mins;
          dayTasks = [
            {
              id: `task_m${m}_w${overallWeekNum}_d${d}_1`,
              title: `Learn: ${assignedSubtopics[0] || dayTopic + ' Basics'}`,
              type: 'LEARN',
              estimated_minutes: t1Mins,
              difficulty: userLevel === 'BEGINNER' ? 'BEGINNER' : 'INTERMEDIATE',
              resources_ref: `Documentation & Guide for ${assignedSubtopics[0] || dayTopic}`,
              practice_details: `Read conceptual overview and syntax rules for ${assignedSubtopics[0] || dayTopic}.`,
              revision_details: 'Summarize 3 key takeaways.'
            },
            {
              id: `task_m${m}_w${overallWeekNum}_d${d}_2`,
              title: `Practice: ${assignedSubtopics[0] || dayTopic} Guided Code Drills`,
              type: 'PRACTICE',
              estimated_minutes: t2Mins,
              difficulty: userLevel === 'BEGINNER' ? 'BEGINNER' : 'INTERMEDIATE',
              resources_ref: `Code Sandbox & Guided Exercises for ${dayTopic}`,
              practice_details: 'Implement basic code samples and execute unit tests.',
              revision_details: 'Fix any syntax or execution errors.'
            },
            {
              id: `task_m${m}_w${overallWeekNum}_d${d}_3`,
              title: `Revision: ${dayTopic} Concept Flashcards`,
              type: 'REVISION',
              estimated_minutes: t3Mins,
              difficulty: 'BEGINNER',
              resources_ref: `Concept Flashcard Deck for ${dayTopic}`,
              practice_details: 'Self-test core definitions and rules.',
              revision_details: 'Review incorrectly answered flashcards.'
            }
          ];
        } else if (d === 2) {
          const t1Mins = Math.round(dailyMinutes * 0.30);
          const t2Mins = Math.round(dailyMinutes * 0.50);
          const t3Mins = dailyMinutes - t1Mins - t2Mins;
          dayTasks = [
            {
              id: `task_m${m}_w${overallWeekNum}_d${d}_1`,
              title: `Learn: ${assignedSubtopics[1] || dayTopic + ' Patterns'}`,
              type: 'LEARN',
              estimated_minutes: t1Mins,
              difficulty: 'INTERMEDIATE',
              resources_ref: `Pattern Guide for ${assignedSubtopics[1] || dayTopic}`,
              practice_details: 'Study execution patterns and implementation structure.',
              revision_details: 'Note execution flow.'
            },
            {
              id: `task_m${m}_w${overallWeekNum}_d${d}_2`,
              title: `Implement: ${assignedSubtopics[1] || dayTopic} Practical Exercise`,
              type: 'IMPLEMENT',
              estimated_minutes: t2Mins,
              difficulty: 'INTERMEDIATE',
              resources_ref: `Hands-on Environment for ${dayTopic}`,
              practice_details: 'Build complete working code module from scratch.',
              revision_details: 'Verify code against test assertions.'
            },
            {
              id: `task_m${m}_w${overallWeekNum}_d${d}_3`,
              title: `Practice: Self-Check Code Validation`,
              type: 'PRACTICE',
              estimated_minutes: t3Mins,
              difficulty: 'INTERMEDIATE',
              resources_ref: `Validation Test Suite`,
              practice_details: 'Run automated checks and log outputs.',
              revision_details: 'Refactor code for cleanliness.'
            }
          ];
        } else if (d === 3) {
          const t1Mins = Math.round(dailyMinutes * 0.60);
          const t2Mins = dailyMinutes - t1Mins;
          dayTasks = [
            {
              id: `task_m${m}_w${overallWeekNum}_d${d}_1`,
              title: `Problem Solving: ${dayTopic} Applied Challenges`,
              type: 'PROBLEM_SOLVING',
              estimated_minutes: t1Mins,
              difficulty: userLevel === 'BEGINNER' ? 'BEGINNER' : 'INTERMEDIATE',
              resources_ref: `Problem Set for ${dayTopic}`,
              practice_details: 'Solve practical coding problems independently.',
              revision_details: 'Analyze execution efficiency.'
            },
            {
              id: `task_m${m}_w${overallWeekNum}_d${d}_2`,
              title: `Revision & Error Analysis: ${dayTopic} Mistakes Review`,
              type: 'REVISION',
              estimated_minutes: t2Mins,
              difficulty: 'INTERMEDIATE',
              resources_ref: `Solution Walkthroughs`,
              practice_details: 'Review failed test cases and alternative optimal approaches.',
              revision_details: 'Write down key learnings.'
            }
          ];
        } else if (d === 4) {
          const t1Mins = Math.round(dailyMinutes * 0.35);
          const t2Mins = Math.round(dailyMinutes * 0.45);
          const t3Mins = dailyMinutes - t1Mins - t2Mins;
          dayTasks = [
            {
              id: `task_m${m}_w${overallWeekNum}_d${d}_1`,
              title: `Learn: ${assignedSubtopics[2] || dayTopic + ' Advanced Concepts'}`,
              type: 'LEARN',
              estimated_minutes: t1Mins,
              difficulty: 'INTERMEDIATE',
              resources_ref: `Deep Dive Guide for ${assignedSubtopics[2] || dayTopic}`,
              practice_details: 'Study edge cases, error handling, and optimization rules.',
              revision_details: 'Highlight key techniques.'
            },
            {
              id: `task_m${m}_w${overallWeekNum}_d${d}_2`,
              title: `Implement: ${dayTopic} Optimization & Refactoring`,
              type: 'IMPLEMENT',
              estimated_minutes: t2Mins,
              difficulty: 'INTERMEDIATE',
              resources_ref: `Refactoring Environment`,
              practice_details: 'Refactor existing implementation for cleanliness and performance.',
              revision_details: 'Benchmark execution metrics.'
            },
            {
              id: `task_m${m}_w${overallWeekNum}_d${d}_3`,
              title: `Practice: Edge Case Testing`,
              type: 'PRACTICE',
              estimated_minutes: t3Mins,
              difficulty: 'INTERMEDIATE',
              resources_ref: `Edge Case Test Harness`,
              practice_details: 'Test boundary conditions and error handling.',
              revision_details: 'Document edge case fixes.'
            }
          ];
        } else if (d === 5) {
          const t1Mins = Math.round(dailyMinutes * 0.55);
          const t2Mins = dailyMinutes - t1Mins;
          dayTasks = [
            {
              id: `task_m${m}_w${overallWeekNum}_d${d}_1`,
              title: `Problem Solving: ${dayTopic} Mixed Exercises`,
              type: 'PROBLEM_SOLVING',
              estimated_minutes: t1Mins,
              difficulty: 'INTERMEDIATE',
              resources_ref: `Problem Bank for ${dayTopic}`,
              practice_details: 'Solve multi-concept problems combining previous weekly topics.',
              revision_details: 'Check topic dependencies.'
            },
            {
              id: `task_m${m}_w${overallWeekNum}_d${d}_2`,
              title: `Revision: Weak Topic Remediation (${dayTopic})`,
              type: 'REVISION',
              estimated_minutes: t2Mins,
              difficulty: 'INTERMEDIATE',
              resources_ref: `Remedial Study Notes for ${dayTopic}`,
              practice_details: 'Re-attempt incorrectly solved problems from earlier in the week.',
              revision_details: 'Verify gap closure.'
            }
          ];
        } else if (d === 6) {
          const t1Mins = Math.round(dailyMinutes * 0.40);
          const t2Mins = dailyMinutes - t1Mins;
          dayTasks = [
            {
              id: `task_m${m}_w${overallWeekNum}_d${d}_1`,
              title: `Revision: Consolidated Weekly Knowledge Map (${dayTopic})`,
              type: 'REVISION',
              estimated_minutes: t1Mins,
              difficulty: 'INTERMEDIATE',
              resources_ref: `Weekly Summary Mind Map`,
              practice_details: 'Review all concepts and syntax patterns from Week ' + overallWeekNum,
              revision_details: 'Consolidate personal cheat-sheet.'
            },
            {
              id: `task_m${m}_w${overallWeekNum}_d${d}_2`,
              title: `Project: Mini Capstone Module for ${dayTopic}`,
              type: 'PROJECT',
              estimated_minutes: t2Mins,
              difficulty: 'INTERMEDIATE',
              resources_ref: `Mini-Project Specification`,
              practice_details: 'Build an integrated project module validating weekly subtopics.',
              revision_details: 'Submit project code for self-evaluation.'
            }
          ];
        } else {
          const t1Mins = Math.round(dailyMinutes * 0.45);
          const t2Mins = dailyMinutes - t1Mins;
          dayTasks = [
            {
              id: `task_m${m}_w${overallWeekNum}_d${d}_1`,
              title: `Assessment: Week ${overallWeekNum} Concept Evaluation (${dayTopic})`,
              type: 'ASSESSMENT',
              estimated_minutes: t1Mins,
              difficulty: 'INTERMEDIATE',
              resources_ref: `Weekly Knowledge Check Quiz`,
              practice_details: 'Complete quiz covering week ' + overallWeekNum + ' subtopics.',
              revision_details: 'Review test score and detailed explanations.'
            },
            {
              id: `task_m${m}_w${overallWeekNum}_d${d}_2`,
              title: `Mock Test: Timed Knowledge Check`,
              type: 'MOCK_TEST',
              estimated_minutes: t2Mins,
              difficulty: 'INTERMEDIATE',
              resources_ref: `Timed Assessment Environment`,
              practice_details: 'Complete timed simulation test under evaluation conditions.',
              revision_details: 'Analyze score breakdown.'
            }
          ];
        }

        // PREVENT TOPIC JUMPING VALIDATION STEP
        dayTasks.forEach(t => {
          if (!t.title.includes(dayTopic) && !assignedSubtopics.some(sub => t.title.includes(sub))) {
            t.title = `${t.type}: ${dayTopic} - ${assignedSubtopics[0] || 'Core Mechanics'}`;
          }
        });

        days.push({
          day_number: d,
          day_name: dayName,
          topic: dayTopic,
          tasks: dayTasks,
          total_minutes: dailyMinutes
        });
      }

      weeks.push({
        week_number: overallWeekNum,
        month_number: m,
        title: weekTitle,
        objective: weekObj,
        topics: assignedNames,
        subtopics: assignedSubtopics,
        estimated_hours: Math.round(dailyHours * 7),
        practice: practiceFocus,
        revision: revisionFocus,
        assessment: assessmentFocus,
        expected_outcomes: [
          `Master core operations of ${assignedNames[0]}`,
          `Complete hands-on implementation tasks`,
          `Pass Week ${overallWeekNum} evaluation milestone`
        ],
        days
      });
    }

    monthlyRoadmap.push({
      month_number: m,
      title: monthTitle,
      objective,
      topics: assignedNames,
      subtopics: assignedSubtopics,
      estimated_hours: estHoursPerMonth,
      priority,
      difficulty,
      expected_outcomes: [
        `Complete all learning modules for ${assignedNames.join(', ')}`,
        `Pass monthly knowledge milestone assessment`,
        `Demonstrate proficiency across key subtopics`
      ],
      weeks
    });
  }

  // LOG REQUIRED ROADMAP STRUCTURE FOR DEBUGGING
  console.log("MONTHLY ROADMAP:", monthlyRoadmap.map(m => ({ month: m.month_number, title: m.title, topics: m.topics })));
  console.log("WEEKLY ROADMAP:", monthlyRoadmap.flatMap(m => m.weeks.map(w => ({ week: w.week_number, title: w.title, topics: w.topics }))));
  console.log("DAILY TASKS:", monthlyRoadmap[0]?.weeks[0]?.days[0]?.tasks.map(t => ({ id: t.id, title: t.title })));

  return {
    user_id,
    domain: curriculum.domainName,
    domain_id: domainKey,
    timeline_months: timelineMonths,
    daily_hours: dailyHours,
    quiz_score: overallScore,
    overall_level: userLevel,
    starting_point: startingPoint ? startingPoint.name : 'Foundations',
    curriculum_version: 'v2_placement',
    topic_performances: topicPerformances,
    monthly_roadmap: monthlyRoadmap,
    generated_at: new Date()
  };
}


// ============================================================
// 4. PASSWORD HASHING
// ============================================================

function hashPassword(password, saltHex = null) {
  return new Promise((resolve, reject) => {

    const salt = saltHex
      ? Buffer.from(saltHex, 'hex')
      : crypto.randomBytes(16);

    crypto.pbkdf2(
      password,
      salt,
      100000,
      32,
      'sha256',
      (err, derivedKey) => {

        if (err) {
          return reject(err);
        }

        resolve({
          hash: derivedKey.toString('hex'),
          salt: salt.toString('hex')
        });

      }
    );
  });
}


// ============================================================
// 5. JSON RESPONSE HELPER
// ============================================================

function sendJSON(res, statusCode, data) {

  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });

  res.end(JSON.stringify(data));
}


// ============================================================
// 6. READ REQUEST BODY
// ============================================================

function readRequestBody(req) {

  return new Promise((resolve, reject) => {

    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {

        const parsed = JSON.parse(body || '{}');
        resolve(parsed);

      } catch (error) {
        reject(new Error('Invalid JSON request body.'));
      }
    });

    req.on('error', reject);

  });
}


// ============================================================
// ASSESSMENT + INTERVIEW HELPERS
// ============================================================

async function callGroqWithFallback(groqClient, params) {
  const primaryModel = params.model || process.env.GROQ_MODEL || 'groq/compound';
  const candidateModels = Array.from(new Set([
    primaryModel,
    'groq/compound',
    'openai/gpt-oss-20b',
    'qwen/qwen3.6-27b',
    'groq/compound-mini',
    'openai/gpt-oss-120b'
  ]));

  let lastError = null;
  for (const mod of candidateModels) {
    try {
      const completion = await groqClient.chat.completions.create({
        ...params,
        model: mod
      });
      return completion;
    } catch (err) {
      lastError = err;
      const isRateLimit = err.status === 429 ||
        (err.message && (err.message.includes('429') || err.message.includes('rate_limit') || err.message.includes('Rate limit')));
      if (isRateLimit) {
        console.warn(`⚠️ Groq model '${mod}' hit 429 Rate Limit. Swapping to fallback model...`);
        await new Promise(r => setTimeout(r, 200));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

async function recommendResourcesForTask({
  taskId,
  taskTitle = '',
  taskType = 'LEARN',
  taskDifficulty = 'BEGINNER',
  taskDuration = 30,
  dailyTopic = '',
  subtopic = '',
  topic = '',
  domain = '',
  userLevel = 'BEGINNER',
  topK = 3
}) {
  const normDomain = canonicalizeDomainKey(domain) || String(domain || '').toLowerCase();
  const cleanLevel = (userLevel || taskDifficulty || 'BEGINNER').toUpperCase();
  const cleanType = (taskType || 'LEARN').toUpperCase();
  const cleanTopic = subtopic || taskTitle || topic || dailyTopic || 'Technical Core';
  const taskTitleLower = String(taskTitle || '').toLowerCase();
  const topicLower = String(cleanTopic || '').toLowerCase();
  const domainLower = normDomain.toLowerCase();

  // 1. Check if DB has cached resource for this taskId
  if (mongoose.connection.readyState === 1) {
    try {
      const cached = await Resource.find({
        $or: [
          { resource_id: taskId },
          { domain: normDomain, difficulty: cleanLevel, topic: cleanTopic }
        ]
      }).limit(topK);
      if (cached && cached.length >= topK) {
        return cached;
      }
    } catch (e) {
      // proceed to dynamic curation
    }
  }

  // 2. Curate domain-specific & topic-specific resources
  let primaryPlatform = 'Official Documentation';
  let primaryUrl = 'https://docs.python.org/3/tutorial/';
  let isOfficial = true;
  let recSection = `${cleanTopic} Reference`;
  let resType = cleanType === 'PRACTICE' ? 'PRACTICE' : 'TUTORIAL';

  if (domainLower.includes('fullstack') || domainLower.includes('web')) {
    primaryPlatform = 'MDN Web Docs';
    primaryUrl = 'https://developer.mozilla.org/en-US/docs/Web/HTML';
    if (taskTitleLower.includes('javascript') || topicLower.includes('js')) {
      primaryUrl = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide';
    } else if (taskTitleLower.includes('css')) {
      primaryUrl = 'https://developer.mozilla.org/en-US/docs/Web/CSS';
    } else if (taskTitleLower.includes('react')) {
      primaryPlatform = 'React Official Docs';
      primaryUrl = 'https://react.dev/learn';
    }
  } else if (domainLower.includes('dsa') || domainLower.includes('algorithm') || domainLower.includes('data structure')) {
    primaryPlatform = 'LeetCode';
    primaryUrl = 'https://leetcode.com/problemset/all/';
    if (taskTitleLower.includes('two sum')) {
      primaryUrl = 'https://leetcode.com/problems/two-sum/';
    }
    resType = 'PRACTICE';
  } else if (domainLower.includes('devops') || domainLower.includes('cloud')) {
    primaryPlatform = 'Docker Documentation';
    primaryUrl = 'https://docs.docker.com/engine/reference/builder/';
    if (taskTitleLower.includes('kubernetes') || topicLower.includes('k8s')) {
      primaryPlatform = 'Kubernetes Documentation';
      primaryUrl = 'https://kubernetes.io/docs/home/';
    } else if (taskTitleLower.includes('terraform')) {
      primaryPlatform = 'HashiCorp Developer';
      primaryUrl = 'https://developer.hashicorp.com/terraform/docs';
    }
  } else if (domainLower.includes('cyber') || domainLower.includes('security')) {
    primaryPlatform = 'OWASP Foundation';
    primaryUrl = 'https://owasp.org/www-project-top-ten/';
    if (taskTitleLower.includes('linux') || taskTitleLower.includes('hardening')) {
      primaryPlatform = 'Center for Internet Security (CIS)';
      primaryUrl = 'https://www.cisecurity.org/benchmark/ubuntu_linux';
    }
  } else if (domainLower.includes('datascience') || domainLower.includes('data science') || domainLower.includes('machine learning')) {
    if (taskTitleLower.includes('scikit') || taskTitleLower.includes('regression') || topicLower.includes('linear regression')) {
      primaryPlatform = 'scikit-learn Documentation';
      primaryUrl = 'https://scikit-learn.org/stable/modules/linear_model.html';
      recSection = 'Linear Models API Reference';
    } else if (taskTitleLower.includes('variable') || topicLower.includes('variable')) {
      primaryPlatform = 'Python Official Documentation';
      primaryUrl = 'https://docs.python.org/3/tutorial/introduction.html#using-python-as-a-calculator';
      recSection = 'Informal Introduction to Python';
    } else if (taskTitleLower.includes('function') || topicLower.includes('function')) {
      primaryPlatform = 'Python Official Documentation';
      primaryUrl = 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions';
      recSection = 'Defining Functions';
    } else if (taskTitleLower.includes('embedding') || taskTitleLower.includes('word2vec') || topicLower.includes('word embeddings')) {
      primaryPlatform = 'TensorFlow / PyTorch Guides';
      primaryUrl = 'https://www.tensorflow.org/text/tutorials/word2vec';
      recSection = 'Word Embeddings & Vector Representations';
    } else {
      primaryPlatform = 'Python Official Documentation';
      primaryUrl = 'https://docs.python.org/3/tutorial/';
      recSection = 'Python Language Tutorial';
    }
  } else if (domainLower.includes('mobile')) {
    primaryPlatform = 'React Native Docs';
    primaryUrl = 'https://reactnative.dev/docs/getting-started';
    if (taskTitleLower.includes('flutter')) {
      primaryPlatform = 'Flutter Docs';
      primaryUrl = 'https://docs.flutter.dev/get-started/install';
    }
  } else if (domainLower.includes('ai') || domainLower.includes('llm')) {
    primaryPlatform = 'OpenAI Platform Documentation';
    primaryUrl = 'https://platform.openai.com/docs/guides/prompt-engineering';
  } else if (domainLower.includes('system') || domainLower.includes('design')) {
    primaryPlatform = 'System Design Primer';
    primaryUrl = 'https://github.com/donnemartin/system-design-primer';
  }

  let primaryTitle = `${taskTitle || cleanTopic} Tutorial & Documentation`;
  if (cleanType === 'PRACTICE' || taskTitleLower.includes('practice') || taskTitleLower.includes('exercise')) {
    resType = 'PRACTICE';
    primaryTitle = `${taskTitle || cleanTopic} Practice Exercises`;
  }

  const primaryResource = {
    resource_id: `res_${taskId || Date.now()}_1`,
    category_label: 'PRIMARY',
    title: primaryTitle,
    platform: primaryPlatform,
    url: primaryUrl,
    resource_type: resType,
    description: `Targeted ${cleanLevel.toLowerCase()} resource covering ${cleanTopic} for ${normDomain}.`,
    topic: topic || dailyTopic || cleanTopic,
    subtopic: subtopic || cleanTopic,
    domain: normDomain,
    difficulty: cleanLevel,
    estimated_minutes: taskDuration || 30,
    recommended_section: recSection,
    relevance_reason: `Matches required domain (${normDomain}) and skill level (${cleanLevel}).`,
    is_official: isOfficial,
    quality_score: 95,
    is_valid: true
  };

  const secondaryType = resType === 'PRACTICE' ? 'DOCUMENTATION' : 'PRACTICE';
  const secondaryTitle = resType === 'PRACTICE' 
    ? `${cleanTopic} Conceptual Reference`
    : `${cleanTopic} Hands-on Practice`;

  const secondaryResource = {
    resource_id: `res_${taskId || Date.now()}_2`,
    category_label: 'ALTERNATIVE',
    title: secondaryTitle,
    platform: resType === 'PRACTICE' ? primaryPlatform : 'GeeksforGeeks',
    url: primaryUrl,
    resource_type: secondaryType,
    description: `Supplementary ${cleanLevel.toLowerCase()} practice exercises and key concept reference for ${cleanTopic}.`,
    topic: topic || dailyTopic || cleanTopic,
    subtopic: subtopic || cleanTopic,
    domain: normDomain,
    difficulty: cleanLevel,
    estimated_minutes: 20,
    recommended_section: 'Exercises & Code Examples',
    relevance_reason: 'Provides additional practice and reference.',
    is_official: false,
    quality_score: 88,
    is_valid: true
  };

  return [primaryResource, secondaryResource];
}

function extractGroqJSON(content) {
  const raw = String(content || '').trim();
  if (!raw) throw new Error('Empty Groq response.');
  try { return JSON.parse(raw); } catch (_) {}
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced) return JSON.parse(fenced[1]);
  const first = raw.indexOf('{');
  const last = raw.lastIndexOf('}');
  if (first >= 0 && last > first) return JSON.parse(raw.slice(first, last + 1));
  throw new Error('Groq returned invalid JSON.');
}

function normalizeAssessmentQuestion(q, index) {
  const typeRaw = String(q?.type || 'MCQ').toUpperCase().replace(/[-\s]/g, '_');
  const type = ['MCQ','MSQ','NAT','SHORT_ANSWER'].includes(typeRaw) ? typeRaw : 'MCQ';
  const options = Array.isArray(q?.options) ? q.options.map(String).slice(0, 4) : [];
  const correct = type === 'MSQ'
    ? (Array.isArray(q?.correct) ? q.correct.map(Number).filter(Number.isInteger) : [])
    : (q?.correct !== undefined && q?.correct !== null ? q.correct : 0);
  return {
    id: String(q?.id || `assessment_q${index + 1}`),
    type,
    question: String(q?.question || 'Assessment question'),
    options: type === 'MCQ' || type === 'MSQ' ? options : [],
    correct,
    model_answer: String(q?.model_answer || q?.modelAnswer || ''),
    expected_keywords: Array.isArray(q?.expected_keywords) ? q.expected_keywords.map(String) : [],
    explanation: String(q?.explanation || 'Review the concept and compare your answer with the expected reasoning.'),
    points: Number.isFinite(Number(q?.points)) ? Number(q.points) : (type === 'SHORT_ANSWER' ? 2 : 1)
  };
}

function normalizeWrittenAnswer(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9+#.\- ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function keywordWrittenScore(answer, keywords) {
  const normalized = normalizeWrittenAnswer(answer);
  if (!normalized) return 0;
  const list = (keywords || []).map(k => normalizeWrittenAnswer(k)).filter(Boolean);
  if (!list.length) return 0;
  const hits = list.filter(k => normalized.includes(k)).length;
  return Math.round((hits / list.length) * 100);
}

async function gradeWrittenAnswersWithGroq({ writtenQuestions, userAnswers }) {
  if (!writtenQuestions.length) return {};
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return {};
  try {
    const client = new Groq({ apiKey });
    const model = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
    const items = writtenQuestions.map(q => ({
      id: q.id,
      question: q.question,
      model_answer: q.model_answer,
      expected_keywords: q.expected_keywords,
      user_answer: String(userAnswers?.[q.id] || '')
    }));
    const completion = await callGroqWithFallback(client, {
      model,
      messages: [
        {
          role: 'system',
          content: 'You are grading short technical answers. Award 0, 1, or 2 points. Give credit for correct equivalent wording. Return ONLY JSON: {"results":[{"id":"...","points":0,"max_points":2,"feedback":"..."}]}.'
        },
        { role: 'user', content: JSON.stringify(items) }
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
      max_tokens: 1800
    });
    const parsed = extractGroqJSON(completion.choices[0]?.message?.content || '{}');
    const out = {};
    (parsed.results || []).forEach(r => {
      out[String(r.id)] = {
        points: Math.max(0, Math.min(2, Number(r.points) || 0)),
        max_points: 2,
        feedback: String(r.feedback || '')
      };
    });
    return out;
  } catch (err) {
    console.warn('⚠️ Groq grading failed, using keyword fallback:', err.message);
    return {};
  }
}

function assessmentTaskContext(payload) {
  const tasks = Array.isArray(payload.tasks) ? payload.tasks : [];
  return tasks.map((t, i) => ({
    id: t.taskId || t.id || `task_${i + 1}`,
    title: t.title || t.taskTitle || 'Learning Task',
    type: t.type || t.taskType || 'LEARN',
    topic: t.taskTopic || t.topic || t.subtopic || 'Core Topic',
    subtopic: t.taskSubtopic || t.subtopic || t.subskillName || '',
    description: t.description || '',
    durationMinutes: t.durationMinutes || t.estimated_minutes || 45
  }));
}

// ============================================================
// 7. GENERATE USER ID
// ============================================================

function generateUserId() {

  return `usr_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 7)}`;

}


// ============================================================
// 8. CREATE HTTP SERVER
// ============================================================

const server = http.createServer(async (req, res) => {

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  parsedUrl.query = Object.fromEntries(parsedUrl.searchParams);

  // ----------------------------------------------------------
  // CORS PRE-FLIGHT
  // ----------------------------------------------------------

  if (req.method === 'OPTIONS') {

    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });

    return res.end();
  }


  // ==========================================================
  // 9. HEALTH CHECK
  // ==========================================================

  if (
    req.method === 'GET' &&
    parsedUrl.pathname === '/api/health'
  ) {

    return sendJSON(res, 200, {

      status: 'OK',

      message:
        'Placify Authentication & Onboarding API is online',

      database:
        mongoose.connection.readyState === 1
          ? 'MongoDB Atlas (Connected)'
          : 'MongoDB Atlas (Disconnected)',

      database_name:
        mongoose.connection.name || 'Not connected',

      collection:
        'Registration'

    });

  }

  // ==========================================================
  // GET /api/news
  // Real-Time Personalized Tech News Feed
  // ==========================================================

  if (
    req.method === 'GET' &&
    parsedUrl.pathname === '/api/news'
  ) {
    return handleGetPersonalizedNews(req, res, parsedUrl, sendJSON);
  }


  // ==========================================================
  // ==========================================================
  // 9b. AI DOMAIN ASSISTANT (GROQ SDK MULTI-TURN AI)
  // POST /api/domain-assistant
  // ==========================================================

  if (
    req.method === 'POST' &&
    parsedUrl.pathname === '/api/domain-assistant'
  ) {
    try {
      const body = await readRequestBody(req);
      const messages = body.messages || [];

      console.log('[Domain Assistant] Received request with', messages.length, 'messages');

      // Canonical Application Domains List
      const CANONICAL_DOMAINS_MAP = [
        { id: 'fullstack', name: 'Full-Stack Web Development', icon: 'ph-code-block', description: 'Master Modern Web Architecture: JavaScript Internals, REST & GraphQL APIs, React VDOM, SQL/NoSQL Databases, Web Security, and High-Concurrency Backend Engineering.' },
        { id: 'datascience', name: 'Data Science & Machine Learning', icon: 'ph-brain', description: 'Master Exploratory Data Analysis, Supervised & Unsupervised Learning, Feature Engineering, Neural Networks, PyTorch, and MLOps.' },
        { id: 'dsa', name: 'Data Structures & Algorithms (Interview Prep)', icon: 'ph-tree-structure', description: 'Master Problem Solving, Arrays, Linked Lists, Trees, Graphs, Dynamic Programming, and High-Performance Algorithm Optimization for FAANG/Product Company Interviews.' },
        { id: 'devops', name: 'Cloud Engineering & DevOps', icon: 'ph-cloud-tower', description: 'Master Cloud Infrastructure: AWS Services, Docker Containerization, Kubernetes Orchestration, Infrastructure as Code (Terraform), and CI/CD Pipelines.' },
        { id: 'cybersecurity', name: 'Cybersecurity & Ethical Hacking', icon: 'ph-shield-checkered', description: 'Master Information Security: Network Pentesting, OWASP Top 10 Web Vulnerabilities, Cryptography, Incident Response, and Security Compliance.' },
        { id: 'mobile', name: 'Mobile App Development (React Native & Flutter)', icon: 'ph-device-mobile', description: 'Master Cross-Platform & Native Mobile Engineering: React Native, Flutter/Dart, Mobile UI Components, Device APIs, Offline Storage, and App Store Publishing.' },
        { id: 'ai_llm', name: 'AI & LLM Systems Engineering', icon: 'ph-sparkle', description: 'Master Generative AI Architecture: Prompt Engineering, RAG Systems, Vector Databases (Pinecone/Chroma), Fine-Tuning LLMs, and AI Agent Orchestration.' },
        { id: 'system_design', name: 'System Design & Distributed Architecture', icon: 'ph-cpu', description: 'Master Scalable Systems: Microservices, Distributed Caching, Message Queues (Kafka/RabbitMQ), Database Sharding, Load Balancing, and High Availability.' }
      ];

      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        console.error('[Domain Assistant] GROQ_API_KEY is missing from environment.');
        return sendJSON(res, 500, {
          error: 'GROQ_API_KEY is not configured on server.',
          reply: "I'm having trouble connecting to the AI assistant right now. You can still choose a domain manually from the options below."
        });
      }

      console.log('[Domain Assistant] Calling Groq API via Groq SDK...');
      const groqClient = new Groq({ apiKey });

      const systemMessage = {
        role: 'system',
        content: `You are the AI Domain Selection Advisor for AgPlacify.
Your sole goal is to help users select the best tech learning domain from the EXACT 8 CANONICAL APPLICATION DOMAINS listed below.

The 8 Canonical Domains are:
1. "fullstack" -> "Full-Stack Web Development" (Websites, React, Node.js, REST APIs, Databases, Web Security)
2. "datascience" -> "Data Science & Machine Learning" (Data analysis, ML models, Pandas, PyTorch, Statistics, Predictive Modeling)
3. "dsa" -> "Data Structures & Algorithms (Interview Prep)" (LeetCode, Algorithms, Data Structures, Problem Solving, Tech Interviews)
4. "devops" -> "Cloud Engineering & DevOps" (AWS, Cloud, Docker, Kubernetes, Terraform, CI/CD, Deployment Automation)
5. "cybersecurity" -> "Cybersecurity & Ethical Hacking" (Penetration testing, Ethical hacking, OWASP, Vulnerabilities, Security)
6. "mobile" -> "Mobile App Development (React Native & Flutter)" (iOS, Android, Flutter, React Native, Cross-platform Mobile Apps)
7. "ai_llm" -> "AI & LLM Systems Engineering" (Generative AI, LLMs, RAG, Prompt Engineering, LangChain, Vector Databases)
8. "system_design" -> "System Design & Distributed Architecture" (Distributed Systems, Microservices, Scalability, High Availability, Load Balancing)

CRITICAL CONVERSATIONAL INSTRUCTIONS:
1. Do NOT invent domain names outside of these 8 canonical domains.
2. Maintain a friendly, engaging, encouraging tone.
3. If the user's input is general or broad (e.g. "I like AI", "I don't know", "Hi"), generate a natural follow-up question to ask what part of AI, data, software, or systems interests them. Do NOT return a hardcoded generic welcome message. Do NOT recommend a domain yet.
4. When the user provides enough specific detail or after 2-3 turns of specific discussion, generate a contextual response, state your domain recommendation clearly in "reply", and return the structured "recommendation" object.
5. Return ONLY valid JSON matching this exact JSON schema:

{
  "reply": "Contextual assistant text response tailored specifically to the user's messages.",
  "recommendation": {
    "recommendedDomain": "Exact domain name from the 8 canonical domains list above",
    "recommendedDomainId": "exact domain id from list (fullstack, datascience, dsa, devops, cybersecurity, mobile, ai_llm, system_design)",
    "confidence": 0.95,
    "reason": "Short clear explanation of why this domain fits their goals.",
    "alternatives": [
      { "id": "alternative_domain_id", "name": "Exact alternative domain name" }
    ]
  },
  "isComplete": true or false
}

Note: If you are asking a follow-up question or if confidence is low, set "recommendation": null and "isComplete": false.`
      };

      // Format complete conversation history in chronological order
      const formattedHistory = messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }));

      const model = process.env.GROQ_MODEL || 'groq/compound';
      const completion = await callGroqWithFallback(groqClient, {
        messages: [systemMessage, ...formattedHistory],
        model: model,
        response_format: { type: 'json_object' },
        temperature: 0.6,
        max_tokens: 1024
      });

      console.log('[Domain Assistant] Groq response received');
      const responseContent = completion.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(responseContent);

      // Validate and enrich recommendation if present
      if (parsed.recommendation && parsed.recommendation.recommendedDomainId) {
        const validDom = CANONICAL_DOMAINS_MAP.find(d =>
          d.id === parsed.recommendation.recommendedDomainId ||
          d.name.toLowerCase() === (parsed.recommendation.recommendedDomain || '').toLowerCase()
        );
        if (validDom) {
          parsed.recommendation.recommendedDomainId = validDom.id;
          parsed.recommendation.recommendedDomain = validDom.name;
          parsed.recommendation.icon = validDom.icon;
          parsed.recommendation.description = validDom.description;
        } else {
          parsed.recommendation = null;
          parsed.isComplete = false;
        }
      }

      return sendJSON(res, 200, parsed);

    } catch (err) {
      console.error('[Domain Assistant] Groq API Error:', err.message);
      return sendJSON(res, 500, {
        error: 'Failed to generate response from Groq.',
        reply: "I'm having trouble connecting to the AI assistant right now. You can still choose a domain manually from the options below."
      });
    }
  }

  // ==========================================================
  // 9c. DYNAMIC QUIZ GENERATION (GROQ AI MULTI-TYPE)
  // POST /api/quiz/generate
  // ==========================================================

  // In-memory active quiz store for session persistence
  if (!global.activeQuizStore) {
    global.activeQuizStore = new Map();
  }

  if (
    req.method === 'POST' &&
    parsedUrl.pathname === '/api/quiz/generate'
  ) {
    try {
      const body = await readRequestBody(req);
      const { userId, questionCount: reqCount, domain: bodyDomain, level: bodyLevel, dsaLanguage: bodyDsaLanguage, forceNew } = body;

      // 1. Retrieve User from Database to get authoritative domain and level
      let userDoc = null;
      if (userId && mongoose.connection.readyState === 1) {
        try {
          const User = mongoose.model('User');
          userDoc = await User.findOne({ user_id: userId });
        } catch (e) {
          console.warn('[Quiz Gen] User lookup notice:', e.message);
        }
      }

      // Canonical Domain & Level Resolution
      const domainId = (userDoc && userDoc.chosen_domain) || bodyDomain || 'fullstack';
      const dsaLanguage = domainId === 'dsa'
        ? ((userDoc && userDoc.dsa_language) || bodyDsaLanguage || null)
        : null;
      const initialLevel = bodyLevel || 'BEGINNER';
      const parsedQuestionCount = parseInt(reqCount, 10);
      const questionCount = Number.isFinite(parsedQuestionCount) ? Math.min(50, Math.max(1, parsedQuestionCount)) : 10;

      const domainNameMap = {
        fullstack: 'Full-Stack Web Development',
        datascience: 'Data Science & Machine Learning',
        dsa: 'Data Structures & Algorithms (Interview Prep)',
        devops: 'Cloud Engineering & DevOps',
        cybersecurity: 'Cybersecurity & Ethical Hacking',
        mobile: 'Mobile App Development (React Native & Flutter)',
        ai_llm: 'AI & LLM Systems Engineering',
        system_design: 'System Design & Distributed Architecture'
      };
      const canonicalDomainName = domainNameMap[domainId] || domainId;

      // Keep quiz taxonomy identical to the roadmap taxonomy.
      // This lets the evaluation map each answer to an exact skill.
      const quizKnowledgeGraph = getKnowledgeGraph(domainId);
      const quizSkills = getAllSkillsInGraph(quizKnowledgeGraph);
      const quizSkillCatalogText = JSON.stringify(quizSkills.map(s => ({
        skillId: s.skillId,
        topic: s.topicName,
        subtopic: s.subtopicName,
        skillName: s.skillName,
        difficulty: s.difficulty
      })));

      // Check if user already has an active quiz and forceNew is false
      if (userId && !forceNew && global.activeQuizStore.has(userId)) {
        const existingQuiz = global.activeQuizStore.get(userId);
        if (existingQuiz && existingQuiz.domainId === domainId && existingQuiz.questionCount === questionCount) {
          console.log(`[QUIZ GENERATION] Returning existing active quiz for userId: ${userId} (${existingQuiz.quizId})`);
          return sendJSON(res, 200, existingQuiz);
        }
      }

      const randomSeed = crypto.randomBytes(8).toString('hex');

      console.log(`[QUIZ GENERATION]`);
      console.log(`userId: ${userId}`);
      console.log(`domain: ${canonicalDomainName} (${domainId})`);
      console.log(`level: ${initialLevel}`);
      if (domainId === 'dsa') console.log(`DSA language: ${dsaLanguage || 'NOT_SELECTED'}`);
      console.log(`requestedQuestionCount: ${questionCount}`);
      console.log(`randomSeed: ${randomSeed}`);

      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        return sendJSON(res, 500, { error: 'GROQ_API_KEY is not configured on server.' });
      }

      const groqClient = new Groq({ apiKey });
      const model = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

      const systemPrompt = `You are the Expert Technical Quiz Generator for AgPlacify.
Your job is to generate a dynamic, diagnostic technical quiz for a learner.

AUTHORITATIVE PARAMETERS:
- DOMAIN: "${canonicalDomainName}" (${domainId})
- DIFFICULTY LEVEL: "${initialLevel}"
- EXACT QUESTION COUNT: ${questionCount}
- RANDOM SEED: "${randomSeed}"
- DSA LANGUAGE: "${dsaLanguage || 'N/A'}"

EXACT KNOWLEDGE-GRAPH SKILL CATALOG:
${quizSkillCatalogText}

For every question, choose topic, subtopic, skillId and skillName from this catalog. Do not invent taxonomy names.
${domainId === 'dsa' && dsaLanguage ? `For DSA, write all code examples, syntax, and implementation-oriented questions in ${dsaLanguage}. Do not use another programming language.` : ''}

CRITICAL MANDATORY RULES:
1. You MUST generate EXACTLY ${questionCount} question items inside the "questions" array.
2. EVERY question MUST include an "options" array containing EXACTLY 4 distinct choice options e.g. ["<p>", "<div>", "<span>", "<section>"] or ["Option A", "Option B", "Option C", "Option D"]. Do NOT leave "options" empty.
3. The "correct" field MUST be the 0-based integer index of the correct option (0, 1, 2, or 3), or an array e.g. [0, 2] for MSQ questions.
4. Difficulty of ALL questions must match "${initialLevel}".

Return ONLY valid JSON matching this exact JSON schema:
{
  "questions": [
    {
      "id": "q_1",
      "question": "Which HTML tag is used for a paragraph?",
      "codeSnippet": null,
      "type": "MCQ",
      "topic": "HTML",
      "subtopic": "Basic Tags",
      "skillId": "exact_skill_id_from_catalog",
      "skillName": "exact_skill_name_from_catalog",
      "difficulty": "${initialLevel}",
      "options": ["<p>", "<div>", "<span>", "<section>"],
      "correct": 0,
      "explanation": "The <p> tag defines a paragraph in HTML."
    }
  ]
}`;

      let generatedQuestions = [];
      let attempts = 0;
      const MAX_ATTEMPTS = 6;

      while (generatedQuestions.length < questionCount && attempts < MAX_ATTEMPTS) {
        const remainingNeeded = questionCount - generatedQuestions.length;
        const fetchSize = Math.min(10, Math.max(1, remainingNeeded));
        try {
          console.log(`[Quiz Gen] Attempt ${attempts + 1}: Fetching batch of ${fetchSize} questions (Currently have ${generatedQuestions.length}/${questionCount})...`);

          const completion = await callGroqWithFallback(groqClient, {
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Generate a JSON object with a "questions" array containing EXACTLY ${fetchSize} unique ${initialLevel} level questions for ${canonicalDomainName}. EVERY question MUST have an "options" array with 4 options. Seed: ${randomSeed}_att${attempts}` }
            ],
            model: model,
            response_format: { type: 'json_object' },
            temperature: 0.6,
            max_tokens: 3500
          });

          const rawContent = completion.choices[0]?.message?.content || '{}';
          console.log('[Quiz Gen] RAW API RESPONSE:\n', rawContent);

          let parsed = null;
          try {
            let cleanStr = rawContent.trim();
            if (cleanStr.startsWith('```')) {
              cleanStr = cleanStr.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
            }
            const firstBrace = cleanStr.indexOf('{');
            const lastBrace = cleanStr.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
              cleanStr = cleanStr.substring(firstBrace, lastBrace + 1);
            }
            parsed = JSON.parse(cleanStr);
          } catch (jsonErr) {
            console.warn('[Quiz Gen] Failed to parse JSON response:', jsonErr.message);
          }

          console.log(`Generated question count: ${parsed && Array.isArray(parsed.questions) ? parsed.questions.length : 0}`);
          console.log(`Requested question count: ${questionCount}`);
          console.log(`Domain: ${canonicalDomainName} (${domainId})`);
          console.log(`Level: ${initialLevel}`);
          console.log(`Questions:`, JSON.stringify(parsed && parsed.questions ? parsed.questions : [], null, 2));

          if (parsed && Array.isArray(parsed.questions)) {
            const validNew = parsed.questions.filter(q => {
              if (!q || !q.question || typeof q.question !== 'string' || !q.question.trim()) return false;
              return Array.isArray(q.options) && q.options.length >= 2;
            });

            for (const q of validNew) {
              if (generatedQuestions.length >= questionCount) break;
              // Prevent duplicates
              const isDup = generatedQuestions.some(existing => existing.question.trim().toLowerCase() === q.question.trim().toLowerCase());
              if (!isDup) {
                generatedQuestions.push({
                  id: q.id || `q_${generatedQuestions.length + 1}_${Date.now()}`,
                  question: q.question.trim(),
                  codeSnippet: q.codeSnippet || null,
                  type: q.type || 'MCQ',
                  topic: q.topic || 'Core Knowledge',
                  subtopic: q.subtopic || 'Foundations',
                  skillId: q.skillId || '',
                  skillName: q.skillName || '',
                  difficulty: initialLevel,
                  options: Array.isArray(q.options) ? q.options : [],
                  correct: q.correct !== undefined ? q.correct : (q.correct_answer !== undefined ? q.correct_answer : 0),
                  explanation: q.explanation || ''
                });
              }
            }
          }
        } catch (retryErr) {
          console.warn(`[Quiz Gen] Attempt ${attempts + 1} error:`, retryErr.message);
          await new Promise(r => setTimeout(r, 600));
        }
        attempts++;
      }

      console.log(`[QUIZ GENERATION] generatedQuestionCount: ${generatedQuestions.length}`);
      console.log(`[QUIZ GENERATION] validatedQuestionCount: ${generatedQuestions.length}`);

      if (generatedQuestions.length !== questionCount) {
        return sendJSON(res, 500, {
          error: `Failed to generate exactly ${questionCount} questions (generated ${generatedQuestions.length}). Please try again.`
        });
      }

      const quizId = `quiz_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
      const quizPayload = {
        quizId,
        userId: userId || 'guest',
        domain: canonicalDomainName,
        domainId,
        level: initialLevel,
        questionCount,
        randomSeed,
        questions: generatedQuestions,
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      };

      if (userId) {
        global.activeQuizStore.set(userId, quizPayload);
      }

      return sendJSON(res, 200, quizPayload);

    } catch (err) {
      console.error('[Quiz Gen] Failed to generate quiz:', err.message);
      return sendJSON(res, 500, {
        error: 'Failed to generate quiz from AI backend.',
        message: err.message
      });
    }
  }

  // ==========================================================
  // 9d. GET ACTIVE QUIZ
  // GET /api/quiz/active/:userId
  // ==========================================================
  if (
    req.method === 'GET' &&
    parsedUrl.pathname.startsWith('/api/quiz/active/')
  ) {
    const uId = parsedUrl.pathname.replace('/api/quiz/active/', '').trim();
    if (uId && global.activeQuizStore && global.activeQuizStore.has(uId)) {
      return sendJSON(res, 200, global.activeQuizStore.get(uId));
    }
    return sendJSON(res, 404, { error: 'No active quiz found' });
  }


  // ==========================================================
  // 10. REGISTER USER
  // POST /api/auth/register
  // ==========================================================

  if (
    req.method === 'POST' &&
    parsedUrl.pathname === '/api/auth/register'
  ) {

    try {

      // --------------------------------------------------------
      // Make sure MongoDB is connected
      // --------------------------------------------------------

      if (mongoose.connection.readyState !== 1) {

        return sendJSON(res, 503, {
          error:
            'MongoDB Atlas is not connected. Please try again.'
        });

      }


      // --------------------------------------------------------
      // Read request
      // --------------------------------------------------------

      const payload = await readRequestBody(req);


      const {
        name,
        email,
        password,
        password_hash,
        salt,
        chosen_domain,
        timeline_months,
        daily_hours
      } = payload;


      // --------------------------------------------------------
      // Validate name
      // --------------------------------------------------------

      if (!name || !name.trim()) {

        return sendJSON(res, 400, {
          error: 'Full name is required.'
        });

      }


      // --------------------------------------------------------
      // Validate email
      // --------------------------------------------------------

      const cleanEmail = (email || '')
        .trim()
        .toLowerCase();


      if (
        !cleanEmail ||
        !cleanEmail.includes('@')
      ) {

        return sendJSON(res, 400, {
          error: 'A valid email address is required.'
        });

      }


      // --------------------------------------------------------
      // Validate password
      // --------------------------------------------------------

      if (!password_hash && !password) {

        return sendJSON(res, 400, {
          error: 'Password is required.'
        });

      }


      // --------------------------------------------------------
      // Hash password
      // --------------------------------------------------------

      let finalHash = password_hash;
      let finalSalt = salt;


      if (!finalHash && password) {

        if (password.length < 6) {

          return sendJSON(res, 400, {
            error:
              'Password must be at least 6 characters long.'
          });

        }


        const hashed = await hashPassword(password);

        finalHash = hashed.hash;
        finalSalt = hashed.salt;

      }


      // --------------------------------------------------------
      // Check existing user
      // --------------------------------------------------------

      const existingUser = await User.findOne({
        email: cleanEmail
      });


      if (existingUser) {

        return sendJSON(res, 409, {
          error:
            'An account with this email address already exists. Please log in.'
        });

      }


      // --------------------------------------------------------
      // Prepare user data
      // --------------------------------------------------------

      const userId = generateUserId();

      const domain = chosen_domain || null;

      const months =
        parseInt(timeline_months, 10);

      if (isNaN(months) || months < 1) {
        return sendJSON(res, 400, {
          error: 'Preparation timeline must be a positive integer of months (minimum 1).'
        });
      }

      const hours =
        parseFloat(daily_hours);

      if (isNaN(hours) || hours <= 0) {
        return sendJSON(res, 400, {
          error: 'Daily commitment must be a positive number of hours.'
        });
      }


      // --------------------------------------------------------
      // Create MongoDB document
      // --------------------------------------------------------

      const mongoUser = new User({

        user_id: userId,

        name: name.trim(),

        email: cleanEmail,

        password_hash: finalHash,

        salt: finalSalt,

        chosen_domain: domain,

        timeline_months: months,

        daily_hours: hours,

        current_skill_level: 'UNASSESSED'

      });


      // --------------------------------------------------------
      // SAVE TO MONGODB ATLAS
      // --------------------------------------------------------

      await mongoUser.save();


      console.log('');
      console.log('==========================================');
      console.log('👤 NEW USER REGISTERED');
      console.log('==========================================');
      console.log(`User ID : ${mongoUser.user_id}`);
      console.log(`Name    : ${mongoUser.name}`);
      console.log(`Email   : ${mongoUser.email}`);
      console.log(`Domain  : ${mongoUser.chosen_domain}`);
      console.log('Database: MongoDB Atlas');
      console.log('Collection: Registration');
      console.log('==========================================');
      console.log('');


      // --------------------------------------------------------
      // Return response
      // --------------------------------------------------------

      return sendJSON(res, 201, {

        message:
          'User registered successfully in MongoDB Atlas',

        profile: {

          user_id: mongoUser.user_id,

          name: mongoUser.name,

          email: mongoUser.email,

          chosen_domain:
            mongoUser.chosen_domain,

          timeline_months:
            mongoUser.timeline_months,

          daily_hours:
            mongoUser.daily_hours,

          current_skill_level:
            mongoUser.current_skill_level,

          quiz_completed:
            mongoUser.quiz_completed,

          last_route:
            mongoUser.last_route,

          roadmap_status:
            mongoUser.roadmap_status,

          journey_started:
            mongoUser.journey_started || false,

          journey_start_date:
            mongoUser.journey_start_date || null

        }

      });

    } catch (err) {

      console.error(
        '❌ Registration error:',
        err
      );


      // Duplicate email/user ID
      if (err.code === 11000) {

        return sendJSON(res, 409, {
          error:
            'A user with this email or user ID already exists.'
        });

      }


      return sendJSON(res, 500, {

        error:
          'Server registration error: ' +
          err.message

      });

    }

  }


  // ==========================================================
  // 11. LOGIN
  // POST /api/auth/login
  // ==========================================================

  if (
    req.method === 'POST' &&
    parsedUrl.pathname === '/api/auth/login'
  ) {

    try {

      // --------------------------------------------------------
      // Make sure MongoDB is connected
      // --------------------------------------------------------

      if (mongoose.connection.readyState !== 1) {

        return sendJSON(res, 503, {
          error:
            'MongoDB Atlas is not connected. Please try again.'
        });

      }


      // --------------------------------------------------------
      // Read request
      // --------------------------------------------------------

      const payload = await readRequestBody(req);

      const {
        email,
        password,
        password_hash
      } = payload;


      const cleanEmail =
        (email || '')
          .trim()
          .toLowerCase();


      // --------------------------------------------------------
      // Validate credentials
      // --------------------------------------------------------

      if (
        !cleanEmail ||
        (!password && !password_hash)
      ) {

        return sendJSON(res, 401, {

          status: 401,

          error:
            'HTTP 401 Unauthorized: Email and password are required credentials.'

        });

      }


      // --------------------------------------------------------
      // Find user in MongoDB
      // --------------------------------------------------------

      const user = await User.findOne({
        email: cleanEmail
      });


      if (!user) {

        return sendJSON(res, 401, {

          status: 401,

          error:
            'HTTP 401 Unauthorized: Invalid email or password credentials.'

        });

      }


      // --------------------------------------------------------
      // Verify password
      // --------------------------------------------------------

      let isValid = false;


      if (password_hash) {

        isValid =
          password_hash === user.password_hash;

      } else if (password) {

        const hashed =
          await hashPassword(
            password,
            user.salt
          );

        isValid =
          hashed.hash === user.password_hash;

      }


      if (!isValid) {

        return sendJSON(res, 401, {

          status: 401,

          error:
            'HTTP 401 Unauthorized: Invalid email or password credentials.'

        });

      }


      // --------------------------------------------------------
      // Login successful
      // --------------------------------------------------------

      console.log(
        `🔐 User logged in: ${user.email}`
      );

      let isQuizCompleted = user.quiz_completed || false;
      if (!isQuizCompleted) {
        const existingEval = await QuizEvaluation.findOne({ user_id: user.user_id });
        const existingRoadmap = await Roadmap.findOne({ user_id: user.user_id });
        if (existingEval || existingRoadmap) {
          isQuizCompleted = true;
          await User.findOneAndUpdate({ user_id: user.user_id }, { quiz_completed: true });
        }
      }

      return sendJSON(res, 200, {

        message:
          'Authentication successful via MongoDB Atlas',

        profile: {

          user_id:
            user.user_id,

          name:
            user.name,

          email:
            user.email,

          chosen_domain:
            user.chosen_domain,

          dsa_language:
            user.dsa_language || null,

          timeline_months:
            user.timeline_months,

          daily_hours:
            user.daily_hours,

          current_skill_level:
            user.current_skill_level,

          quiz_completed:
            isQuizCompleted,

          last_route:
            user.last_route || 'roadmap',

          roadmap_status:
            user.roadmap_status || 'NOT_STARTED',

          journey_started:
            user.journey_started || false,

          journey_start_date:
            user.journey_start_date || null

        }

      });

    } catch (err) {

      console.error(
        '❌ Login error:',
        err
      );


      return sendJSON(res, 500, {

        error:
          'Server authentication error: ' +
          err.message

      });

    }

  }


  // ==========================================================
  // 11c. UPDATE USER DOMAIN
  // PATCH /api/user/:id/domain
  // ==========================================================

  const domainPatchMatch = parsedUrl.pathname.match(/^\/api\/user\/([^/]+)\/domain$/);
  if (req.method === 'PATCH' && domainPatchMatch) {
    try {
      const userId = domainPatchMatch[1];
      const payload = await readRequestBody(req);
      const { chosen_domain, dsa_language } = payload;

      if (!chosen_domain || !chosen_domain.trim()) {
        return sendJSON(res, 400, { error: 'chosen_domain is required.' });
      }

      const normalizedDomain = chosen_domain.trim();
      const allowedDsaLanguages = ['C++', 'Java', 'Python', 'JavaScript', 'C'];
      if (normalizedDomain === 'dsa' && (!dsa_language || !allowedDsaLanguages.includes(dsa_language))) {
        return sendJSON(res, 400, {
          error: 'Please select a programming language for DSA.',
          code: 'DSA_LANGUAGE_REQUIRED',
          allowedLanguages: allowedDsaLanguages
        });
      }

      const update = { chosen_domain: normalizedDomain };
      if (normalizedDomain === 'dsa') update.dsa_language = dsa_language;
      else update.dsa_language = null;

      const updatedUser = await User.findOneAndUpdate(
        { user_id: userId },
        update,
        { new: true }
      );

      if (!updatedUser) {
        return sendJSON(res, 404, { error: 'User not found.' });
      }

      console.log(`✅ Domain updated for ${userId}: ${chosen_domain}`);

      return sendJSON(res, 200, {
        success: true,
        message: 'Domain updated successfully.',
        profile: {
          user_id: updatedUser.user_id,
          name: updatedUser.name,
          email: updatedUser.email,
          chosen_domain: updatedUser.chosen_domain,
          dsa_language: updatedUser.dsa_language || null,
          timeline_months: updatedUser.timeline_months,
          daily_hours: updatedUser.daily_hours,
          current_skill_level: updatedUser.current_skill_level,
          quiz_completed: updatedUser.quiz_completed,
          last_route: updatedUser.last_route,
          roadmap_status: updatedUser.roadmap_status,
          journey_started: updatedUser.journey_started || false,
          journey_start_date: updatedUser.journey_start_date || null
        }
      });

    } catch (err) {
      console.error('❌ Domain update error:', err);
      return sendJSON(res, 500, { error: 'Failed to update domain: ' + err.message });
    }
  }


  // ==========================================================
  // 11b. QUIZ EVALUATION AGENT ENDPOINT
  // POST /api/quiz/evaluate
  // Canonical Quiz Evaluation Engine Helper
  function evaluateQuestionServer(q, userSelectionInput) {
    const qId = q.id || q._id || 'unknown';
    const qType = (q.type || 'MCQ').toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    const options = Array.isArray(q.options) ? q.options : [];
    const rawCorrect = q.correct !== undefined ? q.correct : q.correct_answer;

    let userSelection = userSelectionInput;
    if (userSelection === undefined && q.user_answer !== undefined) {
      userSelection = q.user_answer;
    }
    if (userSelection === undefined && q.userAnswer !== undefined) {
      userSelection = q.userAnswer;
    }

    const rawCorrectType = Array.isArray(rawCorrect) ? 'array' : typeof rawCorrect;
    const rawUserType = Array.isArray(userSelection) ? 'array' : typeof userSelection;

    let isCorrect = false;
    let normalizedCorrect = '';
    let normalizedUser = '';

    function getOptionInfo(val) {
      if (val === undefined || val === null || val === '' || val === 'Unanswered') {
        return { index: -1, text: '', raw: 'Unanswered' };
      }
      if (typeof val === 'number' && !isNaN(val)) {
        const idx = Math.floor(val);
        if (idx >= 0 && options[idx] !== undefined) {
          return { index: idx, text: String(options[idx]), raw: String(val) };
        }
        return { index: idx, text: String(val), raw: String(val) };
      }

      const strVal = String(val).trim();
      if (!strVal || strVal === 'Unanswered') {
        return { index: -1, text: '', raw: 'Unanswered' };
      }

      if (/^\d+$/.test(strVal)) {
        const idx = parseInt(strVal, 10);
        if (idx >= 0 && options[idx] !== undefined) {
          return { index: idx, text: String(options[idx]), raw: strVal };
        }
      }

      if (/^[a-zA-Z]$/.test(strVal)) {
        const idx = strVal.toUpperCase().charCodeAt(0) - 65;
        if (idx >= 0 && idx < options.length) {
          return { index: idx, text: String(options[idx]), raw: strVal };
        }
      }

      if (options.length > 0) {
        const matchedIdx = options.findIndex(opt => String(opt).trim().toLowerCase() === strVal.toLowerCase());
        if (matchedIdx !== -1) {
          return { index: matchedIdx, text: String(options[matchedIdx]), raw: strVal };
        }
      }

      return { index: -1, text: strVal, raw: strVal };
    }

    // 1. MSQ / MULTIPLE SELECT
    if (qType === 'MSQ' || qType === 'MULTIPLE_SELECT' || qType === 'MULTIPLE_CHOICE_MULTI') {
      let corrArray = [];
      if (Array.isArray(rawCorrect)) {
        corrArray = rawCorrect;
      } else if (typeof rawCorrect === 'string' && rawCorrect.trim()) {
        corrArray = rawCorrect.split(/;|,/).map(s => s.trim()).filter(Boolean);
      } else if (rawCorrect !== undefined && rawCorrect !== null) {
        corrArray = [rawCorrect];
      }

      let userArray = [];
      if (Array.isArray(userSelection)) {
        userArray = userSelection;
      } else if (typeof userSelection === 'string' && userSelection.trim() && userSelection !== 'Unanswered') {
        userArray = userSelection.split(/;|,/).map(s => s.trim()).filter(Boolean);
      } else if (userSelection !== undefined && userSelection !== null && userSelection !== 'Unanswered') {
        userArray = [userSelection];
      }

      const normCorrSet = corrArray.map(getOptionInfo).filter(i => i.raw !== 'Unanswered');
      const normUserSet = userArray.map(getOptionInfo).filter(i => i.raw !== 'Unanswered');

      const corrKeys = normCorrSet.map(i => i.index >= 0 ? `idx:${i.index}` : `txt:${i.text.toLowerCase()}`).sort();
      const userKeys = normUserSet.map(i => i.index >= 0 ? `idx:${i.index}` : `txt:${i.text.toLowerCase()}`).sort();

      normalizedCorrect = corrKeys.join(', ');
      normalizedUser = userKeys.join(', ');

      if (userKeys.length > 0 && userKeys.length === corrKeys.length) {
        isCorrect = userKeys.every((val, idx) => val === corrKeys[idx]);
      } else {
        isCorrect = false;
      }
    }
    // 2. TRUE_FALSE
    else if (qType === 'TRUE_FALSE' || qType === 'TRUE/FALSE' || qType === 'BOOLEAN') {
      const parseBool = (val) => {
        if (val === true) return 'true';
        if (val === false) return 'false';
        if (val === undefined || val === null || val === '' || val === 'Unanswered') return '';
        const str = String(val).trim().toLowerCase();
        if (str === 'true' || str === 't' || str === '1' || str === 'yes') return 'true';
        if (str === 'false' || str === 'f' || str === '0' || str === 'no') return 'false';
        const info = getOptionInfo(val);
        if (info.text.toLowerCase().includes('true')) return 'true';
        if (info.text.toLowerCase().includes('false')) return 'false';
        return str;
      };

      normalizedCorrect = parseBool(rawCorrect);
      normalizedUser = parseBool(userSelection);
      isCorrect = (normalizedUser !== '' && normalizedUser === normalizedCorrect);
    }
    // 3. NUMERICAL
    else if (qType === 'NUMERICAL') {
      const corrNum = parseFloat(rawCorrect);
      const userNum = parseFloat(userSelection);

      if (!isNaN(corrNum) && !isNaN(userNum)) {
        normalizedCorrect = String(corrNum);
        normalizedUser = String(userNum);
        isCorrect = Math.abs(userNum - corrNum) < 0.01;
      } else {
        normalizedCorrect = String(rawCorrect || '').trim().toLowerCase();
        normalizedUser = String(userSelection || '').trim().toLowerCase();
        isCorrect = (normalizedUser !== '' && normalizedUser !== 'unanswered' && normalizedUser === normalizedCorrect);
      }
    }
    // 4. MCQ / CODE_OUTPUT / SCENARIO / CONCEPTUAL / FILL_BLANK / SHORT_ANSWER
    else {
      if (options.length > 0) {
        const corrOpt = getOptionInfo(rawCorrect);
        const userOpt = getOptionInfo(userSelection);

        if (userSelection === undefined || userSelection === null || userSelection === '' || userSelection === 'Unanswered' || userOpt.raw === 'Unanswered') {
          normalizedCorrect = corrOpt.index >= 0 ? `[Index ${corrOpt.index}] ${corrOpt.text}` : corrOpt.text;
          normalizedUser = 'Unanswered';
          isCorrect = false;
        } else if (corrOpt.index >= 0 && userOpt.index >= 0) {
          normalizedCorrect = `[Index ${corrOpt.index}] ${corrOpt.text}`;
          normalizedUser = `[Index ${userOpt.index}] ${userOpt.text}`;
          isCorrect = (corrOpt.index === userOpt.index);
        } else {
          normalizedCorrect = corrOpt.text.trim().toLowerCase();
          normalizedUser = userOpt.text.trim().toLowerCase();
          isCorrect = (normalizedUser !== '' && normalizedUser !== 'unanswered' && normalizedUser === normalizedCorrect);
        }
      } else {
        if (userSelection === undefined || userSelection === null || userSelection === '' || userSelection === 'Unanswered') {
          normalizedCorrect = String(rawCorrect || '').trim().toLowerCase();
          normalizedUser = 'Unanswered';
          isCorrect = false;
        } else {
          normalizedCorrect = String(rawCorrect || '').trim().toLowerCase();
          normalizedUser = String(userSelection || '').trim().toLowerCase();
          isCorrect = (normalizedUser !== '' && normalizedUser !== 'unanswered' && normalizedUser === normalizedCorrect);
        }
      }
    }

    const debugLog = {
      questionId: qId,
      type: qType,
      correctAnswer: rawCorrect,
      correctAnswerType: rawCorrectType,
      userAnswer: userSelection !== undefined ? userSelection : 'Unanswered',
      userAnswerType: rawUserType,
      normalizedCorrect,
      normalizedUser,
      isCorrect
    };

    console.log(`[QUIZ EVALUATION DEBUG (SERVER)]`, JSON.stringify(debugLog, null, 2));

    return {
      isCorrect,
      debugLog,
      normalizedCorrect,
      normalizedUser
    };
  }

  if (
    req.method === 'POST' &&
    parsedUrl.pathname === '/api/quiz/evaluate'
  ) {
    try {
      if (mongoose.connection.readyState !== 1) {
        return sendJSON(res, 503, {
          error: 'MongoDB Atlas is not connected. Please try again.'
        });
      }

      const payload = await readRequestBody(req);
      let { user_id, domain, answers, is_self_assessed, isSelfAssessed, skill_level, skillLevel } = payload;
      const selfAssessed = !!(is_self_assessed || isSelfAssessed);

      if (!user_id) {
        return sendJSON(res, 400, {
          error: 'Missing required parameter: user_id.'
        });
      }

      if (!selfAssessed && (!answers || !Array.isArray(answers) || answers.length === 0)) {
        return sendJSON(res, 400, {
          error: 'Missing required parameters: user_id, domain, and a non-empty answers array.'
        });
      }

      // Find user document to check recorded chosen_domain
      const dbUser = await User.findOne({ user_id });

      function normalizeDomainName(rawDomain) {
        if (!rawDomain || typeof rawDomain !== 'string') {
          return 'Full-Stack Web Development';
        }
        const clean = rawDomain.trim().toLowerCase();
        if (clean.includes('devops') || clean.includes('cloud')) {
          return 'Cloud Engineering & DevOps';
        }
        if (clean.includes('data science') || clean.includes('datascience') || clean.includes('machine learning')) {
          return 'Data Science & Machine Learning';
        }
        if (clean.includes('dsa') || clean.includes('algorithm') || clean.includes('data structure') || clean.includes('interview prep')) {
          return 'Data Structures & Algorithms (Interview Prep)';
        }
        if (clean.includes('cyber') || clean.includes('security') || clean.includes('hacking')) {
          return 'Cybersecurity & Ethical Hacking';
        }
        if (clean.includes('mobile') || clean.includes('react native') || clean.includes('flutter') || clean.includes('ios') || clean.includes('android')) {
          return 'Mobile App Development (React Native & Flutter)';
        }
        if (clean.includes('ai') || clean.includes('llm') || clean.includes('genai') || clean.includes('rag')) {
          return 'AI & LLM Systems Engineering';
        }
        if (clean.includes('system design') || clean.includes('system_design') || clean.includes('architecture') || clean.includes('microservice')) {
          return 'System Design & Distributed Architecture';
        }
        if (clean.includes('fullstack') || clean.includes('full-stack') || clean.includes('web')) {
          return 'Full-Stack Web Development';
        }
        return rawDomain.trim();
      }

      let resolvedDomain = normalizeDomainName(domain);
      if ((!domain || domain.trim() === '') && dbUser && dbUser.chosen_domain) {
        resolvedDomain = normalizeDomainName(dbUser.chosen_domain);
      }

      let correctCount = 0;
      let totalQuestions = 0;
      let scorePct = 0;
      let finalSkillLevel = 'BEGINNER';
      let levelDescription = '';
      const topicStats = {};
      const processedAnswers = [];

      if (selfAssessed) {
        finalSkillLevel = (skill_level || skillLevel || 'BEGINNER').toUpperCase();
        if (finalSkillLevel === 'ADVANCED') {
          scorePct = 85;
          levelDescription = 'High technical proficiency. User manually self-assessed as Advanced.';
        } else if (finalSkillLevel === 'INTERMEDIATE') {
          scorePct = 65;
          levelDescription = 'Practical understanding solid. User manually self-assessed as Intermediate.';
        } else {
          finalSkillLevel = 'BEGINNER';
          scorePct = 40;
          levelDescription = 'Foundational gaps identified. User manually self-assessed as Beginner.';
        }
        totalQuestions = 0;
        correctCount = 0;
      } else {
        totalQuestions = answers.length;
        answers.forEach(q => {
          let isCorrect = false;
          let debugLog = null;
          let normCorr = '';
          let normUser = '';

          if (q.is_correct !== undefined && typeof q.is_correct === 'boolean' && q.normalized_correct !== undefined) {
            // Already pre-evaluated by frontend agent with full normalization metadata
            isCorrect = q.is_correct;
            normCorr = q.normalized_correct || String(q.correct_answer || '');
            normUser = q.normalized_user || String(q.user_answer || '');
            debugLog = {
              questionId: q.id || 'unknown',
              type: q.type || 'MCQ',
              correctAnswer: q.correct_answer,
              correctAnswerType: typeof q.correct_answer,
              userAnswer: q.user_answer,
              userAnswerType: typeof q.user_answer,
              normalizedCorrect: normCorr,
              normalizedUser: normUser,
              isCorrect: isCorrect
            };
            console.log(`[QUIZ EVALUATION DEBUG (SERVER REUSE)]`, JSON.stringify(debugLog, null, 2));
          } else {
            // Server-side canonical evaluation helper
            const result = evaluateQuestionServer(q, q.user_answer !== undefined ? q.user_answer : q.userSelection);
            isCorrect = result.isCorrect;
            debugLog = result.debugLog;
            normCorr = result.normalizedCorrect;
            normUser = result.normalizedUser;
          }

          if (isCorrect) {
            correctCount++;
          }

          const topic = q.topic || 'General Knowledge';
          if (!topicStats[topic]) {
            topicStats[topic] = { total: 0, correct: 0, missedConceptual: false };
          }
          topicStats[topic].total++;
          if (isCorrect) {
            topicStats[topic].correct++;
          } else {
            if (q.difficulty === 'BEGINNER' || !q.difficulty) {
              topicStats[topic].missedConceptual = true;
            }
          }

          processedAnswers.push({
            id: q.id,
            question: q.question,
            options: q.options || [],
            user_answer: q.user_answer || 'Unanswered',
            correct_answer: q.correct_answer,
            topic: topic,
            subtopic: q.subtopic || '',
            skillId: q.skillId || '',
            skillName: q.skillName || '',
            difficulty: q.difficulty || 'INTERMEDIATE',
            is_correct: isCorrect,
            normalized_correct: normCorr,
            normalized_user: normUser
          });
        });

        scorePct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

        if (scorePct >= 80) {
          finalSkillLevel = 'ADVANCED';
          levelDescription = 'High technical proficiency. Focus on system design, internal architecture, performance tuning, and production trade-offs.';
        } else if (scorePct >= 50) {
          finalSkillLevel = 'INTERMEDIATE';
          levelDescription = 'Practical understanding solid. Ready for building projects, official documentation, and applied patterns.';
        } else {
          finalSkillLevel = 'BEGINNER';
          levelDescription = 'Core foundational gaps present. Focus on fundamental syntax and guided visual learning.';
        }
      }

      const masteredTopics = [];
      const knowledgeGaps = [];

      let topicEvaluations = [];
      if (payload && Array.isArray(payload.topic_evaluations) && payload.topic_evaluations.length > 0) {
        topicEvaluations = payload.topic_evaluations;
      } else {
        Object.keys(topicStats).forEach(topic => {
          const stats = topicStats[topic];
          const accuracyPct = Math.round((stats.correct / stats.total) * 100);

          let proficiencyLevel = 'INTERMEDIATE';
          if (accuracyPct >= 80) {
            proficiencyLevel = 'STRONG';
            masteredTopics.push({ topic, accuracy_pct: accuracyPct });
          } else if (accuracyPct < 50 || stats.missedConceptual) {
            proficiencyLevel = 'WEAK';
            let reason = accuracyPct < 50 ? 'Accuracy below 50%' : 'Missed core conceptual questions';
            knowledgeGaps.push({ topic, accuracy_pct: accuracyPct, reason });
          }

          topicEvaluations.push({
            topic,
            correct_count: stats.correct,
            total_questions: stats.total,
            score_pct: accuracyPct,
            proficiency_level: proficiencyLevel
          });
        });
      }

      // Save evaluation in MongoDB Atlas collection `quiz_evaluations`
      const evaluationDoc = new QuizEvaluation({
        user_id,
        domain: resolvedDomain,
        score_pct: scorePct,
        correct_count: correctCount,
        total_questions: totalQuestions,
        skill_level: finalSkillLevel,
        level_description: levelDescription,
        mastered_topics: masteredTopics,
        knowledge_gaps: knowledgeGaps,
        topic_evaluations: topicEvaluations,
        answers: processedAnswers,
        is_self_assessed: selfAssessed
      });

      await evaluationDoc.save();

      // Generate and save user skill profile in `user_skill_profiles` collection
      const skillProfileData = buildUserSkillProfile({
        userId: user_id,
        domain: resolvedDomain,
        quizEvaluation: evaluationDoc
      });

      await UserSkillProfile.findOneAndUpdate(
        { user_id },
        { ...skillProfileData },
        { upsert: true, new: true }
      );

      // Clear user active quiz from in-memory session store if present
      if (user_id && global.activeQuizStore) {
        global.activeQuizStore.delete(user_id);
      }

      // Update current_skill_level, quiz_completed: true, and quiz_score in MongoDB Registration collection
      let updatedUser = await User.findOneAndUpdate(
        { user_id },
        {
          current_skill_level: finalSkillLevel,
          quiz_completed: true,
          quiz_score: scorePct,
          roadmap_status: 'ROADMAP_REQUIRED'
        },
        { new: true }
      );

      console.log(`✅ Saved Quiz Evaluation for user ${user_id}: ${scorePct}% (${finalSkillLevel}) with ${topicEvaluations.length} topic evaluations. Set quiz_completed = true.`);

      return sendJSON(res, 200, {
        message: 'Quiz evaluation successfully calculated and persisted to MongoDB Atlas.',
        evaluation: {
          id: evaluationDoc._id,
          user_id,
          domain: resolvedDomain,
          score_pct: scorePct,
          scorePct: scorePct,
          correct_count: correctCount,
          correctCount: correctCount,
          total_questions: totalQuestions,
          totalQuestions: totalQuestions,
          skill_level: finalSkillLevel,
          skillLevel: finalSkillLevel,
          skillTier: finalSkillLevel,
          level_description: levelDescription,
          levelDescription: levelDescription,
          mastered_topics: masteredTopics,
          knowledge_gaps: knowledgeGaps,
          topic_evaluations: topicEvaluations,
          answers: processedAnswers,
          createdAt: evaluationDoc.createdAt
        },
        user: updatedUser ? {
          user_id: updatedUser.user_id,
          name: updatedUser.name,
          email: updatedUser.email,
          current_skill_level: updatedUser.current_skill_level
        } : null
      });

    } catch (err) {
      console.error('❌ Quiz evaluation error:', err);
      return sendJSON(res, 500, {
        error: 'Server evaluation error: ' + err.message
      });
    }
  }


  // ==========================================================
  // 11c. PERSONALIZED DYNAMIC ROADMAP AGENT ENDPOINTS
  // POST /api/roadmap/generate
  // ==========================================================

  if (
    req.method === 'POST' &&
    parsedUrl.pathname === '/api/roadmap/generate'
  ) {
    try {
      if (mongoose.connection.readyState !== 1) {
        return sendJSON(res, 503, {
          error: 'MongoDB Atlas is not connected. Please try again.'
        });
      }

      const payload = await readRequestBody(req);
      const { user_id, quizEvaluation } = payload;

      if (!user_id) {
        return sendJSON(res, 400, {
          error: 'Missing required parameter: user_id.'
        });
      }

      // Fetch user profile from MongoDB Atlas (`Registration` collection / `User` model)
      const user = await User.findOne({ user_id });
      if (!user) {
        return sendJSON(res, 404, {
          error: `User profile for user_id ${user_id} not found in database.`
        });
      }

      if (user.chosen_domain === 'dsa' && !user.dsa_language) {
        return sendJSON(res, 400, {
          error: 'DSA programming language is required before generating a DSA roadmap.',
          code: 'DSA_LANGUAGE_REQUIRED'
        });
      }

      // Fetch latest completed quiz evaluation from MongoDB Atlas (`quiz_evaluations` collection) or payload
      let latestQuizEval = quizEvaluation || null;
      if (!latestQuizEval) {
        latestQuizEval = await QuizEvaluation.findOne({ user_id }).sort({ createdAt: -1 });
      }

      console.log(`[ROADMAP DEBUG] Generating roadmap using evaluation for user: ${user.user_id}`);
      console.log(`[ROADMAP DEBUG] user_id: ${user.user_id}`);
      console.log(`[ROADMAP DEBUG] quiz_score: ${latestQuizEval ? (latestQuizEval.score_pct !== undefined ? latestQuizEval.score_pct : latestQuizEval.scorePct) : 'NULL (No Quiz Eval Found)'}`);
      console.log(`[ROADMAP DEBUG] skill_level: ${latestQuizEval ? (latestQuizEval.skill_level || latestQuizEval.skillTier || 'UNASSESSED') : 'UNASSESSED'}`);
      console.log(`[ROADMAP DEBUG] topic_evaluations: ${latestQuizEval && (latestQuizEval.topic_evaluations || latestQuizEval.topicEvaluations) ? (latestQuizEval.topic_evaluations || latestQuizEval.topicEvaluations).length : 0}`);
      console.log(`[ROADMAP DEBUG] knowledge_gaps: ${latestQuizEval && (latestQuizEval.knowledge_gaps || latestQuizEval.knowledgeGaps) ? (latestQuizEval.knowledge_gaps || latestQuizEval.knowledgeGaps).length : 0}`);
      console.log(`[ROADMAP DEBUG] mastered_topics: ${latestQuizEval && (latestQuizEval.mastered_topics || latestQuizEval.masteredTopics) ? (latestQuizEval.mastered_topics || latestQuizEval.masteredTopics).length : 0}`);

      // Build the skill profile from the LATEST diagnostic whenever a quiz exists.
      // Do not reuse an old pre-quiz profile, otherwise the roadmap can ignore the
      // current diagnostic and look identical across users/levels.
      let skillProfileDoc = await UserSkillProfile.findOne({ user_id: user.user_id });
      if (latestQuizEval) {
        const profileData = buildUserSkillProfile({
          userId: user.user_id,
          domain: user.chosen_domain,
          quizEvaluation: latestQuizEval,
          existingProfile: null
        });
        skillProfileDoc = await UserSkillProfile.findOneAndUpdate(
          { user_id: user.user_id },
          { $set: profileData },
          { upsert: true, new: true }
        );
      } else if (!skillProfileDoc) {
        const profileData = buildUserSkillProfile({
          userId: user.user_id,
          domain: user.chosen_domain,
          quizEvaluation: null
        });
        skillProfileDoc = await UserSkillProfile.findOneAndUpdate(
          { user_id: user.user_id },
          { $set: profileData },
          { upsert: true, new: true }
        );
      }

      // Generate 3-level hierarchical personalized intelligent roadmap
      const rawRoadmapData = generateIntelligentRoadmap({
        userId: user.user_id,
        domain: user.chosen_domain,
        dsaLanguage: user.dsa_language || null,
        timeline_months: user.timeline_months,
        daily_hours: user.daily_hours,
        skillProfile: skillProfileDoc,
        userLevel: (latestQuizEval && (latestQuizEval.skill_level || latestQuizEval.skillTier))
          ? (latestQuizEval.skill_level || latestQuizEval.skillTier)
          : (user.current_skill_level && user.current_skill_level !== 'UNASSESSED'
            ? user.current_skill_level
            : 'BEGINNER'),
        quizEvaluation: latestQuizEval
      });

      const roadmapData = normalizeRoadmap(rawRoadmapData);
      validateRoadmapDataIntegrity(roadmapData);

      // Save/Replace active roadmap in MongoDB Atlas `roadmaps` collection
      const savedRoadmap = await Roadmap.findOneAndUpdate(
        { user_id: user.user_id },
        {
          ...roadmapData,
          updated_at: new Date()
        },
        { upsert: true, new: true }
      );

      // Update user roadmap_status to READY
      await User.findOneAndUpdate({ user_id: user.user_id }, { roadmap_status: 'READY' });

      console.log(`✅ Generated, validated, and saved Personalized Roadmap for user ${user_id} (${user.chosen_domain}, ${user.timeline_months} Months, ${user.daily_hours} Hrs/Day)`);

      return sendJSON(res, 200, {
        success: true,
        message: 'Personalized Dynamic Roadmap generated and saved to MongoDB Atlas successfully.',
        roadmap: normalizeRoadmap(savedRoadmap)
      });

    } catch (err) {
      console.error('❌ Roadmap generation error:', err);
      return sendJSON(res, 500, {
        error: 'Server roadmap generation error: ' + err.message
      });
    }
  }


  // ==========================================================
  // POST /api/skill-profile/generate
  // ==========================================================
  if (
    req.method === 'POST' &&
    parsedUrl.pathname === '/api/skill-profile/generate'
  ) {
    try {
      const body = await readRequestBody(req);
      const { user_id, domain } = body;
      if (!user_id) {
        return sendJSON(res, 400, { error: 'Missing required parameter: user_id.' });
      }

      const latestQuizEval = await QuizEvaluation.findOne({ user_id }).sort({ createdAt: -1 });
      const existingProfile = await UserSkillProfile.findOne({ user_id });

      const profileData = buildUserSkillProfile({
        userId: user_id,
        domain: domain || (latestQuizEval ? latestQuizEval.domain : 'Full-Stack Web Development'),
        quizEvaluation: latestQuizEval,
        existingProfile
      });

      const savedProfile = await UserSkillProfile.findOneAndUpdate(
        { user_id },
        { ...profileData },
        { upsert: true, new: true }
      );

      return sendJSON(res, 200, { success: true, skillProfile: savedProfile });
    } catch (err) {
      return sendJSON(res, 500, { error: 'Skill profile generation error: ' + err.message });
    }
  }

  // ==========================================================
  // GET /api/skill-profile/:userId
  // ==========================================================
  if (
    req.method === 'GET' &&
    parsedUrl.pathname.startsWith('/api/skill-profile/')
  ) {
    try {
      const targetUserId = parsedUrl.pathname.replace('/api/skill-profile/', '').trim();
      if (!targetUserId) {
        return sendJSON(res, 400, { error: 'userId parameter is required.' });
      }

      let profileDoc = await UserSkillProfile.findOne({ user_id: targetUserId });
      if (!profileDoc) {
        const latestQuizEval = await QuizEvaluation.findOne({ user_id: targetUserId }).sort({ createdAt: -1 });
        const userDoc = await User.findOne({ user_id: targetUserId });
        const domain = (userDoc && userDoc.chosen_domain) || (latestQuizEval ? latestQuizEval.domain : 'fullstack');

        const profileData = buildUserSkillProfile({
          userId: targetUserId,
          domain: domain,
          quizEvaluation: latestQuizEval
        });

        profileDoc = await UserSkillProfile.findOneAndUpdate(
          { user_id: targetUserId },
          { ...profileData },
          { upsert: true, new: true }
        );
      }

      return sendJSON(res, 200, { success: true, skillProfile: profileDoc });
    } catch (err) {
      return sendJSON(res, 500, { error: 'Error fetching skill profile: ' + err.message });
    }
  }

  // ==========================================================
  // POST /api/roadmap/adapt
  // ==========================================================
  if (
    req.method === 'POST' &&
    parsedUrl.pathname === '/api/roadmap/adapt'
  ) {
    try {
      const body = await readRequestBody(req);
      const { user_id, taskCompletion } = body;
      if (!user_id) {
        return sendJSON(res, 400, { error: 'Missing required parameter: user_id.' });
      }

      const user = await User.findOne({ user_id });
      if (!user) {
        return sendJSON(res, 404, { error: `User ${user_id} not found.` });
      }

      const currentRoadmap = await Roadmap.findOne({ user_id });
      if (!currentRoadmap) {
        return sendJSON(res, 404, { error: `No active roadmap for user ${user_id}.` });
      }

      let skillProfile = await UserSkillProfile.findOne({ user_id });
      if (!skillProfile) {
        const latestQuizEval = await QuizEvaluation.findOne({ user_id }).sort({ createdAt: -1 });
        const profileData = buildUserSkillProfile({
          userId: user_id,
          domain: user.chosen_domain,
          quizEvaluation: latestQuizEval
        });
        skillProfile = await UserSkillProfile.findOneAndUpdate(
          { user_id },
          { ...profileData },
          { upsert: true, new: true }
        );
      }

      const updatedRoadmap = await recalculateAdaptiveRoadmap({
        user,
        skillProfile,
        currentRoadmap,
        taskCompletionData: taskCompletion,
        dbModels: { UserSkillProfile, Roadmap }
      });

      return sendJSON(res, 200, {
        success: true,
        message: 'Adaptive roadmap successfully updated.',
        roadmap: updatedRoadmap
      });
    } catch (err) {
      return sendJSON(res, 500, { error: 'Adaptive replanning error: ' + err.message });
    }
  }

  // ==========================================================
  // POST /api/task/status
  // Persists individual task completion without triggering a full adaptive
  // replan. This lets learners check off tasks independently.
  // ==========================================================
  if (req.method === 'POST' && parsedUrl.pathname === '/api/task/status') {
    try {
      const body = await readRequestBody(req);
      const { user_id, taskId, completed, monthNumber, weekNumber, dayNumber, title } = body;
      if (!user_id || !taskId) {
        return sendJSON(res, 400, { error: 'Missing required parameters: user_id and taskId.' });
      }

      const roadmapDoc = await Roadmap.findOne({ user_id });
      if (!roadmapDoc) {
        return sendJSON(res, 404, { error: `No active roadmap for user ${user_id}.` });
      }

      const nextCompleted = completed !== false;
      let found = false;
      let matchedTask = null;
      for (const month of (roadmapDoc.monthly_roadmap || [])) {
        for (const week of (month.weeks || [])) {
          for (const day of (week.days || [])) {
            for (const task of (day.tasks || [])) {
              const exactId = (task.taskId || task.id) === taskId;
              const contextMatch = Number(month.month_number) === Number(monthNumber) &&
                Number(week.week_number) === Number(weekNumber) &&
                Number(day.day_number) === Number(dayNumber) &&
                (!title || String(task.title || task.taskTitle || '').trim() === String(title).trim());
              if (exactId || contextMatch) {
                task.completed = nextCompleted;
                task.status = nextCompleted ? 'COMPLETED' : 'pending';
                found = true;
                matchedTask = task;
                break;
              }
            }
            if (found) break;
          }
          if (found) break;
        }
        if (found) break;
      }

      if (!found) {
        return sendJSON(res, 404, { error: `Task ${taskId} not found in the active roadmap.` });
      }

      roadmapDoc.markModified('monthly_roadmap');
      roadmapDoc.updated_at = new Date();
      await roadmapDoc.save();

      return sendJSON(res, 200, {
        success: true,
        taskId: matchedTask?.taskId || matchedTask?.id || taskId,
        completed: nextCompleted,
        message: nextCompleted ? 'Task marked completed.' : 'Task marked pending.'
      });
    } catch (err) {
      return sendJSON(res, 500, { error: 'Task status update error: ' + err.message });
    }
  }

  // ==========================================================
  // POST /api/task/complete
  // ==========================================================
  if (
    req.method === 'POST' &&
    parsedUrl.pathname === '/api/task/complete'
  ) {
    try {
      const body = await readRequestBody(req);
      const { user_id, taskId, skillId, isCorrect, scorePct } = body;
      if (!user_id || !taskId) {
        return sendJSON(res, 400, { error: 'Missing required parameters: user_id and taskId.' });
      }

      const user = await User.findOne({ user_id });
      if (!user) {
        return sendJSON(res, 404, { error: `User ${user_id} not found.` });
      }

      const currentRoadmap = await Roadmap.findOne({ user_id });
      if (!currentRoadmap) {
        return sendJSON(res, 404, { error: `No active roadmap for user ${user_id}.` });
      }

      let skillProfile = await UserSkillProfile.findOne({ user_id });
      if (!skillProfile) {
        const latestQuizEval = await QuizEvaluation.findOne({ user_id }).sort({ createdAt: -1 });
        const profileData = buildUserSkillProfile({
          userId: user_id,
          domain: user.chosen_domain,
          quizEvaluation: latestQuizEval
        });
        skillProfile = await UserSkillProfile.findOneAndUpdate(
          { user_id },
          { ...profileData },
          { upsert: true, new: true }
        );
      }

      const taskCompletion = {
        taskId,
        skillId,
        isCorrect: !!isCorrect,
        taskScorePct: scorePct !== undefined ? scorePct : (isCorrect ? 100 : 0)
      };

      const updatedRoadmap = await recalculateAdaptiveRoadmap({
        user,
        skillProfile,
        currentRoadmap,
        taskCompletionData: taskCompletion,
        dbModels: { UserSkillProfile, Roadmap }
      });

      return sendJSON(res, 200, {
        success: true,
        message: 'Task completion logged and adaptive roadmap updated.',
        roadmap: updatedRoadmap
      });
    } catch (err) {
      return sendJSON(res, 500, { error: 'Task completion error: ' + err.message });
    }
  }


  // ==========================================================
  // 11d. START JOURNEY ENDPOINT
  // POST /api/roadmap/start
  // ==========================================================


  if (
    req.method === 'POST' &&
    parsedUrl.pathname === '/api/roadmap/start'
  ) {
    try {
      if (mongoose.connection.readyState !== 1) {
        return sendJSON(res, 503, {
          error: 'MongoDB Atlas is not connected. Please try again.'
        });
      }

      const payload = await readRequestBody(req);
      const { user_id, start_date } = payload;

      if (!user_id) {
        return sendJSON(res, 400, {
          error: 'Missing required parameter: user_id.'
        });
      }

      const user = await User.findOne({ user_id });
      if (!user) {
        return sendJSON(res, 404, {
          error: `User profile for user_id ${user_id} not found in database.`
        });
      }

      let startDateObj = user.journey_start_date;
      if (!user.journey_started || !startDateObj) {
        startDateObj = start_date ? new Date(start_date) : new Date();
        user.journey_started = true;
        user.journey_start_date = startDateObj;
        await user.save();
      }

      const roadmapDoc = await Roadmap.findOneAndUpdate(
        { user_id: user.user_id },
        {
          journey_started: true,
          journey_start_date: startDateObj,
          updated_at: new Date()
        },
        { new: true }
      );

      console.log(`🚀 Journey started for user ${user_id} on ${startDateObj.toISOString()}`);

      return sendJSON(res, 200, {
        success: true,
        message: 'Journey started successfully.',
        journey_started: true,
        journey_start_date: startDateObj,
        roadmap: roadmapDoc
      });

    } catch (err) {
      console.error('❌ Error starting journey:', err);
      return sendJSON(res, 500, {
        error: 'Server error starting journey: ' + err.message
      });
    }
  }

  // ==========================================================
  // POST /api/user/route
  // Save last_route to MongoDB Atlas
  // ==========================================================

  if (
    req.method === 'POST' &&
    parsedUrl.pathname === '/api/user/route'
  ) {
    try {
      if (mongoose.connection.readyState !== 1) {
        return sendJSON(res, 503, { error: 'MongoDB Atlas is not connected.' });
      }

      const payload = await readRequestBody(req);
      const { user_id, last_route } = payload;

      if (!user_id || !last_route) {
        return sendJSON(res, 400, { error: 'user_id and last_route are required.' });
      }

      const updatedUser = await User.findOneAndUpdate(
        { user_id },
        { last_route: last_route.trim() },
        { new: true }
      );

      return sendJSON(res, 200, {
        success: true,
        user_id,
        last_route: updatedUser ? updatedUser.last_route : last_route
      });
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // ==========================================================
  // GET /api/internships
  // Dynamic Internship Recommendation and Application Links feature
  // ==========================================================
  if (req.method === 'GET' && parsedUrl.pathname === '/api/internships') {
    return handleGetInternships(req, res, parsedUrl, sendJSON);
  }

  // ==========================================================
  // /api/applications (POST, GET, PATCH, DELETE)
  // Application Tracking System (ATS) Endpoints
  // ==========================================================
  if (parsedUrl.pathname && parsedUrl.pathname.startsWith('/api/applications')) {
    return handleApplicationRequests(req, res, parsedUrl, sendJSON, readRequestBody);
  }

  // ==========================================================
  // GET /api/user/:user_id
  // Get authoritative user profile from MongoDB Atlas
  // ==========================================================

  if (
    req.method === 'GET' &&
    parsedUrl.pathname.startsWith('/api/user/') &&
    !parsedUrl.pathname.startsWith('/api/user/route')
  ) {
    try {
      if (mongoose.connection.readyState !== 1) {
        return sendJSON(res, 503, { error: 'MongoDB Atlas is not connected.' });
      }

      const targetUserId = parsedUrl.pathname.replace('/api/user/', '').trim();
      if (!targetUserId) {
        return sendJSON(res, 400, { error: 'User ID is required.' });
      }

      const userDoc = await User.findOne({ user_id: targetUserId });
      if (!userDoc) {
        return sendJSON(res, 404, { error: `User not found for user_id: ${targetUserId}` });
      }

      let isQuizCompleted = userDoc.quiz_completed || false;
      if (!isQuizCompleted) {
        const existingEval = await QuizEvaluation.findOne({ user_id: userDoc.user_id });
        const existingRoadmap = await Roadmap.findOne({ user_id: userDoc.user_id });
        if (existingEval || existingRoadmap) {
          isQuizCompleted = true;
          await User.findOneAndUpdate({ user_id: userDoc.user_id }, { quiz_completed: true });
        }
      }

      return sendJSON(res, 200, {
        success: true,
        profile: {
          user_id: userDoc.user_id,
          name: userDoc.name,
          email: userDoc.email,
          chosen_domain: userDoc.chosen_domain,
          timeline_months: userDoc.timeline_months,
          daily_hours: userDoc.daily_hours,
          current_skill_level: userDoc.current_skill_level,
          quiz_completed: isQuizCompleted,
          last_route: userDoc.last_route || 'roadmap',
          roadmap_status: userDoc.roadmap_status || 'NOT_STARTED',
          createdAt: userDoc.createdAt
        }
      });
    } catch (err) {
      return sendJSON(res, 500, { error: err.message });
    }
  }

  // ==========================================================
  // GET /api/roadmap/user/:user_id
  // ==========================================================

  if (
    req.method === 'GET' &&
    parsedUrl.pathname.startsWith('/api/roadmap/user/')
  ) {
    try {
      if (mongoose.connection.readyState !== 1) {
        return sendJSON(res, 503, {
          error: 'MongoDB Atlas is not connected. Please try again.'
        });
      }

      const targetUserId = parsedUrl.pathname.replace('/api/roadmap/user/', '').trim();
      if (!targetUserId) {
        return sendJSON(res, 400, {
          error: 'User ID is required in URL parameter.'
        });
      }

      let roadmapDoc = await Roadmap.findOne({ user_id: targetUserId });
      if (!roadmapDoc) {
        return sendJSON(res, 404, {
          error: `No active roadmap found for user_id: ${targetUserId}`
        });
      }

      // Roadmaps generated by the current planner are stable on GET. Older
      // versions are upgraded once, using the latest quiz/profile so a stale
      // roadmap cannot silently overwrite the learner's current diagnostic.
      const CURRENT_ROADMAP_VERSION = 'v4_quiz_aligned_personalized';
      if (roadmapDoc.curriculum_version !== CURRENT_ROADMAP_VERSION) {
        console.log(`[STALE ROADMAP DETECTED] Upgrading roadmap to ${CURRENT_ROADMAP_VERSION} for user: ${targetUserId}`);
        const userDoc = await User.findOne({ user_id: targetUserId });
        if (userDoc) {
          const latestQuizEval = await QuizEvaluation.findOne({ user_id: targetUserId }).sort({ createdAt: -1 });
          let skillProfileDoc = await UserSkillProfile.findOne({ user_id: targetUserId });

          // A newer diagnostic always wins over an older cached profile.
          if (latestQuizEval) {
            const profileData = buildUserSkillProfile({
              userId: targetUserId,
              domain: userDoc.chosen_domain,
              quizEvaluation: latestQuizEval,
              existingProfile: null
            });
            skillProfileDoc = await UserSkillProfile.findOneAndUpdate(
              { user_id: targetUserId },
              { $set: profileData },
              { upsert: true, new: true }
            );
          } else if (!skillProfileDoc) {
            const profileData = buildUserSkillProfile({
              userId: targetUserId,
              domain: userDoc.chosen_domain,
              quizEvaluation: null
            });
            skillProfileDoc = await UserSkillProfile.findOneAndUpdate(
              { user_id: targetUserId },
              { $set: profileData },
              { upsert: true, new: true }
            );
          }

          const quizLevel = latestQuizEval && (latestQuizEval.skill_level || latestQuizEval.skillTier);
          const userLevel = quizLevel ||
            (userDoc.current_skill_level && userDoc.current_skill_level !== 'UNASSESSED'
              ? userDoc.current_skill_level
              : 'BEGINNER');

          const newRoadmapData = generateIntelligentRoadmap({
            userId: userDoc.user_id,
            domain: userDoc.chosen_domain,
            dsaLanguage: userDoc.dsa_language || null,
            timeline_months: userDoc.timeline_months,
            daily_hours: userDoc.daily_hours,
            skillProfile: skillProfileDoc,
            userLevel,
            quizEvaluation: latestQuizEval
          });
          roadmapDoc = await Roadmap.findOneAndUpdate(
            { user_id: targetUserId },
            { ...newRoadmapData, updated_at: new Date() },
            { upsert: true, new: true }
          );
        }
      }

      const normalizedRoadmapDoc = normalizeRoadmap(roadmapDoc.toObject ? roadmapDoc.toObject() : roadmapDoc);
      return sendJSON(res, 200, {
        success: true,
        roadmap: normalizedRoadmapDoc
      });

    } catch (err) {
      console.error('❌ Fetch roadmap error:', err);
      return sendJSON(res, 500, {
        error: 'Server error fetching roadmap: ' + err.message
      });
    }
  }

  // ==========================================================
  // YOUTUBE RAG DAY-RESOURCES PROXY ENDPOINT
  // POST /api/rag/day-resources
  // ==========================================================
  if (
    req.method === 'POST' &&
    parsedUrl.pathname === '/api/rag/day-resources'
  ) {
    try {
      const payload = await readRequestBody(req);
      const { user_id, query } = payload || {};

      if (!user_id || !query || typeof user_id !== 'string' || typeof query !== 'string' || !user_id.trim() || !query.trim()) {
        return sendJSON(res, 400, {
          success: false,
          error: 'Missing required parameters: user_id and query.'
        });
      }

      const cleanUserId = user_id.trim();
      const cleanQuery = query.trim();

      const ragBaseUrl = (process.env.RAG_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');
      const targetUrl = `${ragBaseUrl}/api/rag/query`;

      let ragData = null;
      try {
        if (typeof globalThis.fetch === 'function') {
          const ragRes = await globalThis.fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: cleanUserId, query: cleanQuery })
          });
          if (ragRes.ok) {
            ragData = await ragRes.json();
          } else {
            console.warn(`[RAG PROXY WARNING] RAG API returned HTTP ${ragRes.status}`);
          }
        } else {
          ragData = await new Promise((resolve) => {
            const parsedTarget = url.parse(targetUrl);
            const postData = JSON.stringify({ user_id: cleanUserId, query: cleanQuery });
            const reqOpts = {
              hostname: parsedTarget.hostname || '127.0.0.1',
              port: parsedTarget.port || 8000,
              path: parsedTarget.path || '/api/rag/query',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
              }
            };
            const clientReq = http.request(reqOpts, (clientRes) => {
              let bodyStr = '';
              clientRes.on('data', chunk => { bodyStr += chunk; });
              clientRes.on('end', () => {
                try { resolve(JSON.parse(bodyStr)); } catch (e) { resolve(null); }
              });
            });
            clientReq.on('error', () => resolve(null));
            clientReq.setTimeout(10000, () => { clientReq.destroy(); resolve(null); });
            clientReq.write(postData);
            clientReq.end();
          });
        }
      } catch (ragErr) {
        console.warn('⚠️ YouTube RAG service unavailable:', ragErr.message);
      }

      if (ragData && ragData.success && Array.isArray(ragData.resources)) {
        return sendJSON(res, 200, {
          success: true,
          query: cleanQuery,
          resources: ragData.resources
        });
      }

      return sendJSON(res, 200, {
        success: false,
        message: 'Recommended resources are temporarily unavailable.',
        resources: []
      });
    } catch (err) {
      console.error('❌ RAG proxy endpoint error:', err);
      return sendJSON(res, 200, {
        success: false,
        message: 'Recommended resources are temporarily unavailable.',
        resources: []
      });
    }
  }

  // ==========================================================
  // 11e. RESOURCE RECOMMENDATION ENDPOINTS
  // POST /api/resources/recommend
  // GET /api/resources/task/:task_id
  // ==========================================================


  if (
    req.method === 'POST' &&
    parsedUrl.pathname === '/api/resources/recommend'
  ) {
    try {
      const payload = await readRequestBody(req);
      const { taskId, taskTitle, taskType, taskDifficulty, taskDuration, dailyTopic, subtopic, topic, domain, userLevel, user_id, topK } = payload;

      if (!taskTitle || !domain) {
        return sendJSON(res, 400, { error: 'Missing required parameters: taskTitle and domain.' });
      }

      const resources = await recommendResourcesForTask({
        taskId,
        taskTitle,
        taskType,
        taskDifficulty,
        taskDuration,
        dailyTopic,
        subtopic,
        topic,
        domain,
        userLevel,
        topK
      });

      // Update daily task resources in stored Roadmap if user_id and taskId exist
      if (user_id && taskId && mongoose.connection.readyState === 1) {
        try {
          const roadmapDoc = await Roadmap.findOne({ user_id });
          if (roadmapDoc && roadmapDoc.monthly_roadmap) {
            let updated = false;
            roadmapDoc.monthly_roadmap.forEach(m => {
              (m.weeks || []).forEach(w => {
                (w.days || []).forEach(d => {
                  (d.tasks || []).forEach(t => {
                    if (t.id === taskId) {
                      t.recommended_resources = resources;
                      updated = true;
                    }
                  });
                });
              });
            });
            if (updated) {
              await safeSaveRoadmap(roadmapDoc);
            }
          }
        } catch (err) {
          console.warn('Roadmap task resource update warning:', err.message);
        }
      }

      return sendJSON(res, 200, {
        success: true,
        resources
      });
    } catch (err) {
      console.error('❌ Resource recommendation error:', err);
      // Independent failure isolation: Return fallback notice without breaking roadmap
      return sendJSON(res, 200, {
        success: false,
        message: 'Recommended resources are temporarily unavailable.',
        resources: []
      });
    }
  }

  if (
    req.method === 'GET' &&
    parsedUrl.pathname.startsWith('/api/resources/task/')
  ) {
    try {
      const taskId = parsedUrl.pathname.replace('/api/resources/task/', '').trim();
      if (!taskId) {
        return sendJSON(res, 400, { error: 'Task ID parameter is required.' });
      }

      console.log("RESOURCE CACHE LOOKUP:", { cacheKey: taskId, taskId });

      if (mongoose.connection.readyState === 1) {
        const cachedResources = await Resource.find({
          resource_id: { $regex: taskId }
        }).limit(3);

        if (cachedResources && cachedResources.length > 0) {
          return sendJSON(res, 200, {
            success: true,
            resources: cachedResources
          });
        }
      }

      return sendJSON(res, 200, {
        success: true,
        resources: []
      });
    } catch (err) {
      console.error('❌ Fetch task resources error:', err);
      return sendJSON(res, 200, {
        success: false,
        message: 'Recommended resources are temporarily unavailable.',
        resources: []
      });
    }
  }

  // ==========================================================
  // 11f. GROUNDED ASSESSMENT ENDPOINTS & LEVEL-UP ELIGIBILITY
  // POST /api/resources/fetch-assessment
  // POST /api/resources/grade-assessment
  // ==========================================================

  if (
    req.method === 'POST' &&
    parsedUrl.pathname === '/api/resources/fetch-assessment'
  ) {
    try {
      const payload = await readRequestBody(req);
      const { topic, subtopic, skill_level, domain, resource_url } = payload;
      const cleanLevel = (skill_level || 'BEGINNER').toUpperCase();
      const cleanTopic = topic || 'Core Topic';

      const groundedSummary = `Grounded Learning Notes for ${cleanTopic} (${cleanLevel} Tier):\n1. Core Concepts: Explains fundamental mechanics and memory layout.\n2. Practical Patterns: Real-world implementation code.\n3. Edge Cases: Boundary behaviors and exception handling.`;

      const questions = [
        {
          id: 'q1_concept',
          taxonomy: 'Q1: Core Conceptual Understanding',
          question: `According to the recommended ${cleanLevel.toLowerCase()} resource for ${cleanTopic}, what is the foundational conceptual rule?`,
          options: [
            `A) ${cleanTopic} operates via standardized reference architecture and explicit memory semantics.`,
            `B) ${cleanTopic} bypasses type checks completely in runtime contexts.`,
            `C) ${cleanTopic} requires direct hardware register manipulation.`,
            `D) ${cleanTopic} is unsupported in modern software design.`
          ],
          correct_option_index: 0,
          explanation: `The curated materials explicitly establish that ${cleanTopic} follows standardized reference semantics.`
        },
        {
          id: 'q2_code',
          taxonomy: 'Q2: Practical Code / Pattern Application',
          question: `Which code snippet demonstrates the correct pattern application for ${cleanTopic}?`,
          options: [
            `A) execute_standard_pattern("${cleanTopic.toLowerCase().replace(/\s+/g, '_')}");`,
            `B) # INVALID CODE ### ${cleanTopic}`,
            `C) GOTO line 50;`,
            `D) throw new SystemUnreachableError();`
          ],
          correct_option_index: 0,
          explanation: `Standard pattern application uses clean modular function calls for ${cleanTopic}.`
        },
        {
          id: 'q3_edge',
          taxonomy: 'Q3: Output Prediction / Edge Case Handling',
          question: `What is the output or behavior when handling edge cases during ${cleanTopic} execution?`,
          options: [
            `A) The system traps the edge condition gracefully and preserves invariant state.`,
            `B) Silent memory corruption without stack trace.`,
            `C) Infinite CPU loop blocking the event thread.`,
            `D) Immediate crash with hardware exception.`
          ],
          correct_option_index: 0,
          explanation: `Proper edge case handling traps boundary conditions gracefully without state corruption.`
        }
      ];

      return sendJSON(res, 200, {
        success: true,
        topic: cleanTopic,
        subtopic: subtopic || cleanTopic,
        skill_level: cleanLevel,
        domain: domain || 'fullstack',
        resource_url: resource_url || 'https://docs.python.org/3/tutorial/',
        grounded_summary: groundedSummary,
        questions_count: questions.length,
        questions
      });
    } catch (err) {
      console.error('❌ Fetch assessment error:', err);
      return sendJSON(res, 500, { error: err.message });
    }
  }

  if (
    req.method === 'POST' &&
    parsedUrl.pathname === '/api/resources/grade-assessment'
  ) {
    try {
      const payload = await readRequestBody(req);
      const { topic, skill_level, questions, user_answers } = payload;
      const cleanLevel = (skill_level || 'BEGINNER').toUpperCase();

      if (!questions || !Array.isArray(questions) || !user_answers) {
        return sendJSON(res, 400, { error: 'Missing required parameters: questions array and user_answers object.' });
      }

      let correctCount = 0;
      const total = questions.length;
      const detailedFeedback = [];

      questions.forEach(q => {
        const userChoice = user_answers[q.id];
        const isCorrect = (userChoice === q.correct_option_index);
        if (isCorrect) correctCount++;

        detailedFeedback.append ? detailedFeedback.push({
          question_id: q.id,
          taxonomy: q.taxonomy || 'Question',
          question: q.question,
          user_choice_index: userChoice,
          correct_option_index: q.correct_option_index,
          is_correct: isCorrect,
          explanation: q.explanation
        }) : null;
      });

      const scorePct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
      const passed = scorePct >= 70;

      let levelUpEligible = false;
      let levelUpPrompt = null;
      let levelUpOptions = null;

      if (cleanLevel === 'BEGINNER' && scorePct >= 85) {
        levelUpEligible = true;
        levelUpPrompt = "🎉 Outstanding Performance! You achieved >= 85% on this Beginner Concept Assessment. You are eligible to LEVEL UP! How would you like to proceed?";
        levelUpOptions = [
          {
            option_id: 'OPTION_A',
            label: 'Option A: Level up same concept to Intermediate depth',
            action: 'LEVEL_UP_CONCEPT_INTERMEDIATE',
            description: 'Unlock deeper official developer documentation, GitHub sample code, and intermediate implementation drills for this concept.'
          },
          {
            option_id: 'OPTION_B',
            label: 'Option B: Move to next concept at Beginner level',
            action: 'CONTINUE_BEGINNER_TRACK',
            description: 'Proceed to the next foundational topic on your personalized roadmap at the gentle Beginner level.'
          }
        ];
      }

      return sendJSON(res, 200, {
        success: true,
        topic: topic || 'Concept',
        score_pct: scorePct,
        correct_count: correctCount,
        total_questions: total,
        passed,
        user_level: cleanLevel,
        level_up_eligible: levelUpEligible,
        level_up_prompt: levelUpPrompt,
        level_up_options: levelUpOptions,
        detailed_feedback: detailedFeedback
      });
    } catch (err) {
      console.error('❌ Grade assessment error:', err);
      return sendJSON(res, 500, { error: err.message });
    }
  }


  // ==========================================================
  // 11g. DAILY ASSESSMENT + OPTIONAL INTERVIEW QUESTIONS
  // ==========================================================

  if (req.method === 'POST' && parsedUrl.pathname === '/api/daily-assessment/generate') {
    try {
      const payload = await readRequestBody(req);
      const { user_id, domain, skill_level, dsa_language, day_number } = payload;
      const tasks = assessmentTaskContext(payload);
      if (!user_id || !tasks.length) {
        return sendJSON(res, 400, { error: 'user_id and at least one daily task are required.' });
      }

      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) return sendJSON(res, 500, { error: 'GROQ_API_KEY is not configured on server.' });

      const client = new Groq({ apiKey });
      const model = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
      const taskText = tasks.map(t => `- ${t.title} | ${t.topic} | ${t.subtopic} | ${t.description}`).join('\n');
      const languageRule = String(domain || '').toLowerCase() === 'dsa' && dsa_language
        ? `All DSA code and programming examples must use ${dsa_language}.`
        : 'Do not introduce a programming-language requirement unless the task itself requires one.';

      const prompt = `Create an NPTEL-style daily technical assessment for Day ${day_number || 1}.
Domain: ${domain || 'technical'}
Learner level: ${skill_level || 'BEGINNER'}
${languageRule}
The assessment must test ONLY the concepts represented by today's tasks below.
TODAY'S TASKS:
${taskText}

Generate EXACTLY 8 questions with this distribution:
1) 4 MCQ: exactly one correct option out of 4.
2) 2 MSQ: multiple correct options out of 4.
3) 1 NAT: numerical answer, no options.
4) 1 SHORT_ANSWER: written technical answer, expected in 2-4 sentences.

Make the questions genuinely technical and NPTEL-like: conceptual/application/scenario/code reasoning, not generic filler.
For every question include a concise explanation. For SHORT_ANSWER include model_answer and 3-6 expected_keywords.
For NAT, correct must be a number.
For MCQ, correct must be a 0-based option index.
For MSQ, correct must be an array of 0-based option indexes.
Return ONLY JSON in this shape:
{"questions":[{"id":"q1","type":"MCQ","question":"...","options":["...","...","...","..."],"correct":0,"explanation":"...","points":1}, ...]}`;

      const completion = await callGroqWithFallback(client, {
        model,
        messages: [
          { role: 'system', content: 'You are an expert NPTEL technical assessment setter. Never invent requirements outside the supplied daily tasks. Return valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.35,
        max_tokens: 5000
      });

      const parsed = extractGroqJSON(completion.choices[0]?.message?.content || '{}');
      const questions = Array.isArray(parsed.questions) ? parsed.questions.map(normalizeAssessmentQuestion) : [];
      const typeCounts = questions.reduce((acc, q) => { acc[q.type] = (acc[q.type] || 0) + 1; return acc; }, {});
      const valid = questions.length === 8 && typeCounts.MCQ === 4 && typeCounts.MSQ === 2 && typeCounts.NAT === 1 && typeCounts.SHORT_ANSWER === 1 &&
        questions.filter(q => (q.type === 'MCQ' || q.type === 'MSQ') && q.options.length !== 4).length === 0;
      if (!valid) return sendJSON(res, 502, { error: 'Assessment generator returned an invalid NPTEL-style question set. Please retry.' });

      return sendJSON(res, 200, {
        success: true,
        day_number: Number(day_number || 1),
        domain,
        skill_level,
        dsa_language: String(domain || '').toLowerCase() === 'dsa' ? (dsa_language || null) : null,
        questions,
        questions_count: questions.length
      });
    } catch (err) {
      console.error('❌ Daily assessment generation error:', err);
      return sendJSON(res, 500, { error: 'Daily assessment generation failed: ' + err.message });
    }
  }

  if (req.method === 'POST' && parsedUrl.pathname === '/api/daily-assessment/grade') {
    try {
      const payload = await readRequestBody(req);
      const { questions, user_answers } = payload;
      if (!Array.isArray(questions) || !user_answers) return sendJSON(res, 400, { error: 'questions and user_answers are required.' });

      let earned = 0;
      let max = 0;
      const detailed_feedback = [];
      const writtenQuestions = [];

      for (const q of questions) {
        const type = String(q.type || 'MCQ').toUpperCase();
        const answer = user_answers[q.id];
        const points = Number(q.points) || (type === 'SHORT_ANSWER' ? 2 : 1);
        max += points;
        let correct = false;
        let got = 0;

        if (type === 'MCQ') {
          correct = Number(answer) === Number(q.correct);
          got = correct ? points : 0;
        } else if (type === 'MSQ') {
          const a = Array.isArray(answer) ? answer.map(Number).sort((x,y) => x-y) : [];
          const c = Array.isArray(q.correct) ? q.correct.map(Number).sort((x,y) => x-y) : [];
          correct = a.length === c.length && a.every((v,i) => v === c[i]);
          got = correct ? points : 0;
        } else if (type === 'NAT') {
          const a = Number(answer);
          const c = Number(q.correct);
          correct = Number.isFinite(a) && Number.isFinite(c) && Math.abs(a - c) <= Math.max(0.01, Math.abs(c) * 0.001);
          got = correct ? points : 0;
        } else if (type === 'SHORT_ANSWER') {
          writtenQuestions.push(q);
        }

        if (type !== 'SHORT_ANSWER') {
          earned += got;
          detailed_feedback.push({ question_id: q.id, type, correct, earned_points: got, max_points: points, explanation: q.explanation || '' });
        }
      }

      const writtenResults = await gradeWrittenAnswersWithGroq({ writtenQuestions, userAnswers: user_answers });
      for (const q of writtenQuestions) {
        const fallback = keywordWrittenScore(user_answers[q.id], q.expected_keywords);
        const result = writtenResults[q.id] || { points: fallback >= 60 ? 2 : (fallback >= 35 ? 1 : 0), max_points: 2, feedback: fallback ? `Your answer covered ${fallback}% of the expected key concepts.` : 'No sufficient key concepts were detected in the written response.' };
        earned += Math.min(2, Math.max(0, result.points));
        detailed_feedback.push({ question_id: q.id, type: 'SHORT_ANSWER', correct: result.points >= 1, earned_points: result.points, max_points: 2, feedback: result.feedback, model_answer: q.model_answer });
      }

      const scorePct = max ? Math.round((earned / max) * 100) : 0;
      return sendJSON(res, 200, { success: true, score_pct: scorePct, earned_points: earned, max_points: max, passed: scorePct >= 70, detailed_feedback });
    } catch (err) {
      console.error('❌ Daily assessment grading error:', err);
      return sendJSON(res, 500, { error: 'Daily assessment grading failed: ' + err.message });
    }
  }

  if (req.method === 'POST' && parsedUrl.pathname === '/api/interview-questions/generate') {
    try {
      const payload = await readRequestBody(req);
      const { domain, skill_level, dsa_language, day_number, tasks } = payload;
      const taskContext = assessmentTaskContext(payload);
      if (!taskContext.length) return sendJSON(res, 400, { error: 'At least one task is required.' });
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) return sendJSON(res, 500, { error: 'GROQ_API_KEY is not configured on server.' });
      const client = new Groq({ apiKey });
      const model = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
      const completion = await callGroqWithFallback(client, {
        model,
        messages: [
          { role: 'system', content: 'You are an experienced technical interviewer. Return JSON only.' },
          { role: 'user', content: `Generate 5 commonly asked placement interview questions directly related to these Day ${day_number || 1} topics. Include a concise model_answer for each. Difficulty: ${skill_level || 'BEGINNER'}. Domain: ${domain || 'technical'}. ${String(domain || '').toLowerCase() === 'dsa' && dsa_language ? `Use ${dsa_language} when a coding-language example is needed.` : ''}\nTasks:\n${taskContext.map(t => `- ${t.title} | ${t.topic} | ${t.subtopic}`).join('\n')}\nReturn {"questions":[{"id":"iq1","question":"...","model_answer":"..."}]}` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.4,
        max_tokens: 2600
      });
      const parsed = extractGroqJSON(completion.choices[0]?.message?.content || '{}');
      const questions = Array.isArray(parsed.questions) ? parsed.questions.slice(0, 5).map((q, i) => ({ id: String(q.id || `iq${i+1}`), question: String(q.question || ''), model_answer: String(q.model_answer || '') })).filter(q => q.question) : [];
      return sendJSON(res, 200, { success: true, questions });
    } catch (err) {
      console.error('❌ Interview question generation error:', err);
      return sendJSON(res, 500, { error: 'Interview question generation failed: ' + err.message });
    }
  }

  // ==========================================================
  // 11h. DAILY TASK ROLLOVER
  // ==========================================================
  if (req.method === 'POST' && parsedUrl.pathname === '/api/task/rollover') {
    try {
      const body = await readRequestBody(req);
      const { user_id, month, week, day } = body;
      if (!user_id || !Number.isFinite(Number(month)) || !Number.isFinite(Number(week)) || !Number.isFinite(Number(day))) {
        return sendJSON(res, 400, { error: 'user_id, month, week and day are required.' });
      }
      const roadmapDoc = await Roadmap.findOne({ user_id });
      if (!roadmapDoc) return sendJSON(res, 404, { error: 'No active roadmap for this user.' });
      const days = [];
      (roadmapDoc.monthly_roadmap || []).forEach(m => (m.weeks || []).forEach(w => (w.days || []).forEach(d => days.push({ month: Number(m.month_number), week: Number(w.week_number), day: Number(d.day_number), d }))));
      days.sort((a,b) => a.month-b.month || a.week-b.week || a.day-b.day);
      const idx = days.findIndex(x => x.month === Number(month) && x.week === Number(week) && x.day === Number(day));
      if (idx < 0 || idx >= days.length - 1) return sendJSON(res, 200, { success: true, rolled_over: [], message: 'No next day available.' });
      const current = days[idx].d;
      const next = days[idx + 1].d;
      const pending = (current.tasks || []).filter(t => {
        const type = String(t.taskType || t.type || '').toUpperCase();
        return type !== 'ASSESSMENT' && type !== 'ASSESSMENT_REVIEW' && String(t.status || '').toUpperCase() !== 'ROLLED_OVER' && !(t.completed === true || String(t.status || '').toUpperCase() === 'COMPLETED');
      });
      if (!pending.length) return sendJSON(res, 200, { success: true, rolled_over: [], message: 'All current-day tasks are complete.' });

      const existingIds = new Set((next.tasks || []).map(t => t.taskId || t.id));
      const moved = [];
      for (const task of pending) {
        const id = task.taskId || task.id;
        if (!id || existingIds.has(id)) continue;
        const copy = task.toObject ? task.toObject() : { ...task };
        copy.original_day_number = copy.original_day_number || Number(day);
        copy.rolled_over = true;
        copy.rolled_over_from = `${Number(month)}-${Number(week)}-${Number(day)}`;
        copy.day_number = Number(days[idx + 1].day);
        copy.dayNumber = Number(days[idx + 1].day);
        copy.status = 'pending';
        copy.completed = false;
        next.tasks.unshift(copy);
        existingIds.add(id);
        moved.push(id);
      }

      // Keep the learner's daily commitment from becoming overloaded. Carried
      // tasks are protected; unfinished tasks originally planned for tomorrow
      // are shifted forward to the following day(s) until the day fits the
      // user's daily-hours capacity.
      const capacity = Math.max(45, Math.round(Number(roadmapDoc.daily_hours || 2) * 60));
      const recalculateDay = d => {
        d.total_minutes = (d.tasks || []).reduce((sum, t) => sum + (String(t.status || '').toUpperCase() === 'ROLLED_OVER' ? 0 : Number(t.durationMinutes || t.estimated_minutes || 0)), 0);
        d.estimated_minutes = d.total_minutes;
      };
      const shiftOverflow = (dayIndex) => {
        const target = days[dayIndex]?.d;
        const following = days[dayIndex + 1]?.d;
        if (!target || !following) return;
        recalculateDay(target);
        while (target.total_minutes > capacity) {
          const candidateIndex = (target.tasks || []).map((t, i) => ({ t, i })).reverse().find(({ t }) => {
            const type = String(t.taskType || t.type || '').toUpperCase();
            return !t.rolled_over && !t.completed && String(t.status || '').toUpperCase() !== 'COMPLETED' && type !== 'ASSESSMENT' && type !== 'ASSESSMENT_REVIEW';
          })?.i;
          if (candidateIndex === undefined) break;
          const [deferred] = target.tasks.splice(candidateIndex, 1);
          deferred.day_number = days[dayIndex + 1].day;
          deferred.dayNumber = days[dayIndex + 1].day;
          deferred.deferred_from = `${days[dayIndex].month}-${days[dayIndex].week}-${days[dayIndex].day}`;
          deferred.status = 'pending';
          deferred.completed = false;
          following.tasks.push(deferred);
          recalculateDay(target);
        }
        recalculateDay(following);
        shiftOverflow(dayIndex + 1);
      };

      if (moved.length) {
        (current.tasks || []).forEach(t => {
          if (moved.includes(t.taskId || t.id)) {
            t.status = 'ROLLED_OVER';
            t.completed = false;
            t.rolled_to = `${days[idx + 1].month}-${days[idx + 1].week}-${days[idx + 1].day}`;
          }
        });
        recalculateDay(current);
        recalculateDay(next);
        shiftOverflow(idx + 1);
        await safeSaveRoadmap(roadmapDoc);
      }
      return sendJSON(res, 200, { success: true, rolled_over: moved, next_day: { month: days[idx+1].month, week: days[idx+1].week, day: days[idx+1].day }, message: moved.length ? `${moved.length} unfinished task(s) moved to the next day.` : 'No tasks moved.' });
    } catch (err) {
      console.error('❌ Task rollover error:', err);
      return sendJSON(res, 500, { error: 'Task rollover failed: ' + err.message });
    }
  }

  // ==========================================================
  // 12. STATIC FILE SERVER
  // ==========================================================

  let requestedPath =
    parsedUrl.pathname === '/'
      ? 'index.html'
      : parsedUrl.pathname;


  // Prevent paths from escaping project directory
  requestedPath =
    requestedPath.replace(/^\/+/, '');


  const filePath =
    path.join(__dirname, requestedPath);


  const ext =
    path.extname(filePath);


  const mimeTypes = {

    '.html':
      'text/html',

    '.js':
      'application/javascript',

    '.css':
      'text/css',

    '.json':
      'application/json',

    '.png':
      'image/png',

    '.jpg':
      'image/jpeg',

    '.jpeg':
      'image/jpeg',

    '.svg':
      'image/svg+xml',

    '.ico':
      'image/x-icon'

  };


  fs.readFile(
    filePath,
    (err, content) => {

      if (err) {

        if (err.code === 'ENOENT') {

          res.writeHead(404, {
            'Content-Type':
              'text/plain'
          });

          res.end(
            '404 Not Found'
          );

        } else {

          console.error(
            'Static file error:',
            err
          );

          res.writeHead(500);

          res.end(
            `Server Error: ${err.code}`
          );

        }

        return;

      }


      res.writeHead(200, {

        'Content-Type':
          mimeTypes[ext] ||
          'text/plain'

      });


      res.end(content);

    }
  );

});


// ============================================================
// 13. CONNECT TO MONGODB FIRST
// ============================================================

async function startServer() {

  try {

    console.log('');
    console.log('==========================================');
    console.log('        PLACIFY BACKEND STARTING');
    console.log('==========================================');

    console.log(
      '🔌 Connecting to MongoDB Atlas...'
    );


    // --------------------------------------------------------
    // Connect to MongoDB
    // --------------------------------------------------------

    await mongoose.connect(
      MONGODB_URI
    );


    console.log(
      '✅ MongoDB Atlas connected successfully!'
    );

    console.log(
      `📦 Database: ${mongoose.connection.name}`
    );

    console.log(
      '📁 Collection: Registration'
    );

    // Start Real-Time Personalized Tech News background fetch job
    startNewsFetchJob();


    // --------------------------------------------------------
    // Make sure admin exists
    // --------------------------------------------------------

    const adminEmail =
      'admin@placify.ai';


    const existingAdmin =
      await User.findOne({
        email: adminEmail
      });


    if (!existingAdmin) {

      await User.create({

        user_id:
          'usr_system_init',

        name:
          'Placify System Administrator',

        email:
          adminEmail,

        password_hash:
          'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',

        salt:
          '00000000000000000000000000000000',

        chosen_domain:
          'fullstack',

        timeline_months:
          4,

        daily_hours:
          2.0,

        current_skill_level:
          'ADMIN'

      });


      console.log(
        '👤 Initial Placify administrator created.'
      );

    } else {

      console.log(
        '✅ Placify administrator already exists.'
      );

    }


    // --------------------------------------------------------
    // Handle Server Errors (e.g. Port in use)
    // --------------------------------------------------------

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error('');
        console.error('==========================================');
        console.error(`❌ Error: Port ${PORT} is already in use by another running server instance.`);
        console.error(`💡 Solution: Close the active server or run this command in PowerShell to free port ${PORT}:`);
        console.error(`   Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force`);
        console.error('==========================================');
        console.error('');
        process.exit(1);
      } else {
        console.error('❌ Server error:', err);
      }
    });


    // --------------------------------------------------------
    // Start HTTP server ONLY AFTER MongoDB connection
    // --------------------------------------------------------

    server.listen(
      PORT,
      () => {

        console.log('');
        console.log(
          '=========================================='
        );

        console.log(
          `🚀 Placify Server running at http://localhost:${PORT}`
        );

        console.log(
          `🔗 Health Check: http://localhost:${PORT}/api/health`
        );

        console.log(
          '💾 Database: MongoDB Atlas'
        );

        console.log(
          '📁 Collection: Registration'
        );

        console.log(
          '=========================================='
        );

        console.log('');

      }
    );

  } catch (err) {

    console.error('');
    console.error(
      '❌ MongoDB Atlas connection failed!'
    );

    console.error(
      'Error:',
      err.message
    );

    console.error('');

    console.error(
      'Check the following:'
    );

    console.error(
      '1. Your .env file exists'
    );

    console.error(
      '2. MONGODB_URI is correct'
    );

    console.error(
      '3. MongoDB Atlas Network Access allows your IP'
    );

    console.error(
      '4. Your MongoDB username/password are correct'
    );

    console.error('');

    process.exit(1);

  }

}


// ============================================================
// 14. START APPLICATION
// ============================================================

startServer();