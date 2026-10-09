from pathlib import Path
import sys

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# ============================================================
# PROJECT PATH
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

# Allow imports from the project root and the scripts directory.
# This keeps the app importable whether it's started from the repo root
# or from inside the rag_api directory.
PROJECT_ROOT = BASE_DIR
SCRIPTS_DIR = BASE_DIR / "scripts"

for path in (PROJECT_ROOT, SCRIPTS_DIR):
    path_str = str(path)
    if path_str not in sys.path:
        sys.path.insert(0, path_str)


# ============================================================
# IMPORT EXISTING RAG PIPELINE
# ============================================================

from .rag_generate import run_rag


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Placify RAG API",
    description="RAG service for Placify personalized placement preparation",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from typing import Optional, Dict, Any, List


# ============================================================
# REQUEST MODEL
# ============================================================

class RAGRequest(BaseModel):
    user_id: Optional[str] = "anonymous"
    query: Optional[str] = ""
    taskId: Optional[str] = None
    task_id: Optional[str] = None
    taskTitle: Optional[str] = None
    task_title: Optional[str] = None
    taskType: Optional[str] = None
    task_type: Optional[str] = None
    taskDifficulty: Optional[str] = None
    task_difficulty: Optional[str] = None
    difficulty: Optional[str] = None
    taskDuration: Optional[int] = None
    task_duration: Optional[int] = None
    durationMinutes: Optional[int] = None
    estimated_minutes: Optional[int] = None
    dailyTopic: Optional[str] = None
    topic: Optional[str] = None
    subtopic: Optional[str] = None
    taskSubtopic: Optional[str] = None
    domain: Optional[str] = None
    chosen_domain: Optional[str] = None
    userLevel: Optional[str] = None
    user_level: Optional[str] = None
    topK: Optional[int] = 3
    top_k: Optional[int] = 3
    dailyHours: Optional[float] = None
    daily_hours: Optional[float] = None
    dailyBudgetMinutes: Optional[int] = None
    daily_budget_minutes: Optional[int] = None
    taskDescription: Optional[str] = None
    task_description: Optional[str] = None
    weekNumber: Optional[int] = None
    week_number: Optional[int] = None
    dayNumber: Optional[int] = None
    day_number: Optional[int] = None
    quizTopicPerformance: Optional[Dict[str, Any]] = None
    quiz_topic_performance: Optional[Dict[str, Any]] = None
    learningObjective: Optional[str] = None
    preferredLanguage: Optional[str] = None
    preferred_language: Optional[str] = None
    history_resource_ids: Optional[List[str]] = None
    week_resource_ids: Optional[List[str]] = None


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/api/health")
def health_check():

    return {
        "status": "healthy",
        "service": "Placify RAG API"
    }


# ============================================================
# RAG QUERY
# ============================================================

@app.post("/api/rag/query")
def rag_query(request: RAGRequest):
    req_dict = request.dict()
    query_str = (request.query or request.taskTitle or request.task_title or "").strip()

    if not query_str and not request.taskId and not request.task_id:
        raise HTTPException(
            status_code=400,
            detail="Query or task details cannot be empty"
        )

    try:
        is_task_request = bool(
            request.taskId or
            request.task_id or
            request.taskTitle or
            request.task_title or
            request.taskDuration or
            request.task_duration or
            request.durationMinutes or
            request.dailyTopic or
            request.topic
        )

        if is_task_request:
            result = run_rag(
                query=query_str,
                task_context=req_dict
            )
        else:
            result = run_rag(
                query=query_str
            )

        return {
            "success": True,
            "user_id": request.user_id or "anonymous",
            "query": result["query"],
            "answer": result.get("answer", ""),
            "resources": result.get("resources", [])
        }

    except Exception as e:
        print("RAG ERROR:", str(e))
        import traceback
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=f"RAG generation failed: {str(e)}"
        )


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "message": "Placify RAG API is running",
        "docs": "/docs"
    }