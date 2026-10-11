# Placify AI — Placement Preparation Platform

Placify AI is an intelligent placement preparation platform featuring AI-guided domain learning, adaptive roadmaps, NPTEL-style diagnostic assessments, Groq-powered technical interview preparation, personalized tech news, internship tracking, and an interactive context-aware floating AI assistant.

---

## Project Architecture & Directory Layout

The codebase is organized into independent `frontend/` and `backend/` layers:

```text
ProjectPlacify/
├── frontend/                     # Standalone Client Application
│   ├── assets/                   # Static media (logos, graphics)
│   │   └── placify-logo.jpg
│   ├── js/                       # Client JavaScript modules
│   │   ├── config.js             # Centralized API Base URL configuration
│   │   ├── data.js               # Domain taxonomies & question banks
│   │   ├── agents.js             # Client multi-agent coordinator
│   │   └── app.js                # Core UI router & event handlers
│   ├── index.html                # Single-page application shell
│   ├── styles.css                # Dark theme & glassmorphic design system
│   ├── server.js                 # Standalone static SPA server (port 3000)
│   ├── package.json              # Frontend scripts
│   └── .env.example              # Client environment variables template
│
├── backend/                      # Standalone API & AI Server
│   ├── controllers/              # Request handlers
│   │   ├── applicationController.js
│   │   ├── internshipController.js
│   │   └── newsController.js
│   ├── models/                   # Mongoose database models
│   │   ├── Application.js
│   │   └── NewsArticle.js
│   ├── services/                 # External service integrations
│   │   ├── internship/           # Internship aggregators
│   │   ├── news/                 # Tech news scrapers & classifiers
│   │   └── resources/            # 4-level resource recommendation pipeline
│   ├── engine/                   # Core recommendation & scoring engines
│   │   ├── adaptiveEngine.js     # Dynamic roadmap re-sequencing
│   │   ├── knowledgeGraph.js     # 8 domain technical taxonomies
│   │   ├── roadmapPlanner.js     # Day-by-day learning generator
│   │   └── skillProfiler.js      # User skill & mastery calculation
│   ├── jobs/                     # Background cron / fetch jobs
│   │   └── newsFetchJob.js
│   ├── rag/                      # RAG pipeline & Python microservices
│   │   ├── resource_fetch.py
│   │   ├── resource_ingest.py
│   │   ├── resource_rag.py
│   │   └── youtube_rag/          # FastAPI RAG microservice (port 8000)
│   ├── tests/                    # Backend automated tests
│   │   └── test_resource_pipeline_comprehensive.js
│   ├── create_db.js              # Database initialization utility
│   ├── server.js                 # Backend entry point (port 5000)
│   ├── package.json              # Backend dependencies & scripts
│   ├── requirements.txt          # Python RAG dependencies
│   ├── .env                      # Local backend configuration (git-ignored)
│   └── .env.example              # Backend environment template
│
├── scripts/
│   └── start-all.js              # Concurrent dev launcher for frontend & backend
│
├── package.json                  # Root orchestrator scripts
├── README.md                     # Documentation
└── .gitignore                    # Version control ignore rules
```

---

## Prerequisites

1. **Node.js**: v18.0.0 or higher
2. **MongoDB Atlas**: An active MongoDB connection URI
3. **Groq API Key**: For LLM generation (`llama-3.3-70b-versatile`)
4. **Python 3.10+** (Optional, for Python RAG vector service):
   ```bash
   pip install -r backend/requirements.txt
   ```

---

## Environment Configuration

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and supply your actual credentials:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/placify?retryWrites=true&w=majority
GROQ_API_KEY=gsk_your_groq_api_key_here
TAVILY_API_KEY=tvly-your_tavily_key_here
RAG_API_URL=http://127.0.0.1:8000
```

### Frontend (`frontend/.env.example`)

The frontend defaults to `http://localhost:5000` when running locally on port 3000. No build-time secrets are exposed to the client.

```env
PORT=3000
PLACIFY_API_BASE_URL=http://localhost:5000
```

---

## How to Start the Application

### Option A: Independent Terminals (Recommended for Development)

#### Terminal 1 — Backend API Server
```bash
cd backend
npm start
```
*Backend runs on `http://localhost:5000`.*
*Health Check: `http://localhost:5000/api/health`.*

#### Terminal 2 — Frontend Application
```bash
cd frontend
npm start
```
*Frontend runs on `http://localhost:3000`.*

#### Terminal 3 — Python RAG Service (Optional)
```bash
cd backend/rag/youtube_rag
uvicorn rag_api.main:app --reload --port 8000
```
*RAG service runs on `http://localhost:8000`.*

---

### Option B: Root Concurrent Launcher

From the root directory, launch both backend and frontend concurrently:

```bash
npm start
```

Or run individually from the root using workspace prefixes:
```bash
npm run start:backend     # Starts backend on :5000
npm run start:frontend    # Starts frontend on :3000
npm run test:backend      # Runs backend test suite
```

---

## Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend status & database connectivity |
| `POST` | `/api/auth/register` | User registration & credential hashing |
| `POST` | `/api/auth/login` | User authentication & profile retrieval |
| `GET` | `/api/user/:userId` | User profile, journey progress & streak |
| `POST` | `/api/user/:userId/domain` | Domain selection & roadmap initialization |
| `POST` | `/api/roadmap/generate` | Generates adaptive multi-month learning roadmap |
| `GET` | `/api/roadmap/user/:userId` | Retrieves active roadmap for user |
| `POST` | `/api/quiz/generate` | Generates domain diagnostic assessment questions |
| `POST` | `/api/quiz/evaluate` | Evaluates assessment & determines baseline level |
| `POST` | `/api/interview-questions/generate` | Generates domain-tailored interview Q&As via Groq |
| `POST` | `/api/chatbot/chat` | Context-aware floating assistant chat completions |
| `GET` | `/api/internships` | Curated active internship postings |
| `GET` | `/api/news/personalized` | Filtered, ranked tech news feed |
| `GET` | `/api/applications` | User internship application tracker records |
| `POST` | `/api/applications` | Create or update tracked application status |

---

## Verification & Testing

Run the automated backend test suite:
```bash
cd backend
npm test
```

This validates:
- Video index timestamp extraction
- Anti-collision resource matching
- Live Tavily search fallback
- URL sanitization & validation
- Curated educational catalog fallback (Level 3)
- Guaranteed 8-domain catalog coverage (Level 4)
- Technical subtopic resolver
- Duplicate URL deduplication
