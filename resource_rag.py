#!/usr/bin/env python3
"""Dynamic web resource retrieval + semantic ranking for Placify.

No resource URLs are hardcoded here. Tavily supplies live search results and
ChromaDB stores embeddings of resources discovered for Placify tasks.
"""

import hashlib
import json
import os
import sys
from typing import Any, Dict, List

import chromadb
import requests
from sentence_transformers import SentenceTransformer

CHROMA_PATH = os.getenv("PLACIFY_CHROMA_PATH", "./placify_chroma")
COLLECTION_NAME = "placify_dynamic_resources"
MODEL_NAME = os.getenv("PLACIFY_EMBEDDING_MODEL", "all-MiniLM-L6-v2")
TAVILY_URL = "https://api.tavily.com/search"


def clean(value: Any) -> str:
    return " ".join(str(value or "").replace("\n", " ").replace("\r", " ").split())


def normalize_level(level: str) -> str:
    level = clean(level).upper()
    return level if level in {"BEGINNER", "INTERMEDIATE", "ADVANCED"} else "BEGINNER"


def build_query(task_title: str, topic: str, subtopic: str, domain: str, level: str, task_type: str) -> str:
    parts = [clean(task_title), clean(topic), clean(subtopic), clean(domain), normalize_level(level), clean(task_type)]
    base = " ".join(p for p in parts if p)
    return f"{base} tutorial documentation examples practice learning resource"


def search_web(query: str) -> List[Dict[str, Any]]:
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        raise RuntimeError("TAVILY_API_KEY is not configured. Add it to .env before using dynamic resources.")

    response = requests.post(
        TAVILY_URL,
        json={
            "api_key": api_key,
            "query": query,
            "search_depth": "advanced",
            "topic": "general",
            "max_results": 10,
            "include_answer": False,
            "include_raw_content": True,
            "include_images": False,
        },
        timeout=45,
    )
    response.raise_for_status()
    return response.json().get("results", [])


def resource_id(url: str) -> str:
    return "web_" + hashlib.sha256(url.encode("utf-8")).hexdigest()[:32]


def document_for(result: Dict[str, Any], task: Dict[str, str]) -> str:
    return "\n".join([
        f"Task: {task['task_title']}",
        f"Topic: {task['topic']}",
        f"Subtopic: {task['subtopic']}",
        f"Domain: {task['domain']}",
        f"Level: {task['level']}",
        f"Task Type: {task['task_type']}",
        f"Title: {clean(result.get('title'))}",
        f"URL: {clean(result.get('url'))}",
        f"Content: {clean(result.get('raw_content') or result.get('content'))}",
    ])


def get_collection():
    client = chromadb.PersistentClient(path=CHROMA_PATH)
    return client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )


def index_results(collection, results: List[Dict[str, Any]], task: Dict[str, str], model):
    documents, ids, metadatas = [], [], []
    seen_urls = set()

    for result in results:
        url = clean(result.get("url"))
        title = clean(result.get("title"))
        content = clean(result.get("raw_content") or result.get("content"))
        if not url or not title or len(content) < 80:
            continue
        if url in seen_urls:
            continue
        seen_urls.add(url)

        documents.append(document_for(result, task))
        ids.append(resource_id(url))
        metadatas.append({
            "title": title[:500],
            "url": url[:2000],
            "topic": task["topic"][:500],
            "subtopic": task["subtopic"][:500],
            "domain": task["domain"][:200],
            "level": task["level"][:50],
            "task_type": task["task_type"][:100],
            "description": clean(result.get("content"))[:1200],
            "source": "Dynamic Web Search",
        })

    if not documents:
        return 0

    embeddings = model.encode(documents, normalize_embeddings=True).tolist()
    collection.upsert(ids=ids, documents=documents, embeddings=embeddings, metadatas=metadatas)
    return len(documents)


def retrieve(collection, task: Dict[str, str], top_k: int, model):
    query = document_for({"title": task["task_title"], "url": "", "content": ""}, task)
    embedding = model.encode(query, normalize_embeddings=True).tolist()

    results = collection.query(
        query_embeddings=[embedding],
        n_results=max(1, top_k),
        include=["metadatas", "distances"],
    )

    metas = (results.get("metadatas") or [[]])[0]
    distances = (results.get("distances") or [[]])[0]
    output = []

    for meta, distance in zip(metas, distances):
        similarity = max(0.0, min(1.0, 1.0 - float(distance)))
        output.append({
            "resource_id": resource_id(meta.get("url", "")),
            "category_label": "PRIMARY" if len(output) == 0 else ("ALTERNATIVE" if len(output) == 1 else "PRACTICE"),
            "title": meta.get("title", ""),
            "platform": meta.get("source", "Dynamic Web Search"),
            "url": meta.get("url", ""),
            "resource_type": "WEB_RESOURCE",
            "description": meta.get("description", ""),
            "topic": meta.get("topic", task["topic"]),
            "subtopic": meta.get("subtopic", task["subtopic"]),
            "domain": meta.get("domain", task["domain"]),
            "difficulty": meta.get("level", task["level"]),
            "estimated_minutes": task.get("duration", 30),
            "relevance_reason": f"Semantically matched to '{task['task_title']}' using the task topic, subtopic, domain and level.",
            "is_official": False,
            "quality_score": round(similarity * 100),
            "similarity": round(similarity, 4),
            "is_dynamic": True,
            "verified_at": None,
            "is_valid": True,
        })
    return output


def main():
    if len(sys.argv) < 7:
        print(json.dumps({"success": False, "error": "Expected taskTitle topic subtopic domain level taskType [topK]"}))
        return

    task = {
        "task_title": clean(sys.argv[1]),
        "topic": clean(sys.argv[2]),
        "subtopic": clean(sys.argv[3]),
        "domain": clean(sys.argv[4]),
        "level": normalize_level(sys.argv[5]),
        "task_type": clean(sys.argv[6]).upper(),
        "duration": 30,
    }
    try:
        top_k = int(sys.argv[7]) if len(sys.argv) > 7 else 3
    except ValueError:
        top_k = 3

    try:
        print(f"Dynamic search: {build_query(**task | {'task_title': task['task_title']})}", file=sys.stderr)
        web_results = search_web(build_query(task["task_title"], task["topic"], task["subtopic"], task["domain"], task["level"], task["task_type"]))
        collection = get_collection()
        model = SentenceTransformer(MODEL_NAME)
        indexed = index_results(collection, web_results, task, model)
        resources = retrieve(collection, task, top_k, model)
        print(json.dumps({"success": True, "resources": resources, "count": len(resources), "indexed": indexed}))
    except Exception as exc:
        print(json.dumps({"success": False, "error": str(exc)}))


if __name__ == "__main__":
    main()
