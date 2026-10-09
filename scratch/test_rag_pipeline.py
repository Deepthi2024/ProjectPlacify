import os
import sys
import json
from pathlib import Path

# Set paths
base_dir = Path(__file__).resolve().parent.parent / "Youtube data API resources"
sys.path.insert(0, str(base_dir))
sys.path.insert(0, str(base_dir / "scripts"))

from scripts.rag_generate import run_task_rag

print("--- Testing Daily Task RAG Resource Retrieval ---")
task_payload = {
    "taskId": "task_m1_w1_d1_1",
    "taskTitle": "Learn: JavaScript Arrays",
    "topic": "JavaScript",
    "subtopic": "Arrays",
    "domain": "fullstack",
    "taskDuration": 45,
    "taskType": "LEARN",
    "userLevel": "BEGINNER"
}

res = run_task_rag(task_payload)
print("\nRESULT SUCCESS:")
print("Resources retrieved count:", len(res.get("resources", [])))
for i, r in enumerate(res.get("resources", []), start=1):
    print(f"\n{i}. {r['title']}")
    print(f"   Platform: {r['platform']}")
    print(f"   Duration: {r['duration_minutes']} min (Budget: {r['task_budget_minutes']} min)")
    print(f"   Category: {r['category_label']}")
    print(f"   Fit Score: {r['duration_fit_score']}")
    print(f"   Final Score: {r['final_score']}")
    print(f"   Reason: {r['relevance_reason']}")
