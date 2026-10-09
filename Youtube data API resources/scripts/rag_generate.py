from pathlib import Path
import json
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass
if hasattr(sys.stderr, 'reconfigure'):
    try:
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

from dotenv import load_dotenv


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

FAISS_INDEX = DATA_DIR / "rag_faiss.index"
EMBEDDING_METADATA = DATA_DIR / "rag_embedding_metadata.json"
RAG_DOCUMENTS = DATA_DIR / "rag_documents_final.json"
PERSONALIZED_RECOMMENDATIONS = DATA_DIR / "personalized_recommendations.csv"

EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

TOP_K = 5


# Load environment variables from the project .env file.
load_dotenv(BASE_DIR / ".env")

# Runtime state is initialized lazily so the API can start even when
# heavy model/data assets have not been loaded yet.
index = None
embedding_metadata = []
rag_documents = []
model = None
personalized_scores = {}
client = None


def get_groq_client():
    global client

    if client is not None:
        return client

    from groq import Groq

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise RuntimeError("GROQ_API_KEY environment variable is not set.")

    client = Groq(api_key=api_key)
    return client


def ensure_runtime_assets():
    global index, embedding_metadata, rag_documents, model, personalized_scores

    if index is not None and model is not None:
        return

    import faiss
    import pandas as pd
    from sentence_transformers import SentenceTransformer

    print("=" * 70)
    print("PLACIFY - RAG GENERATION")
    print("=" * 70)

    print("\nLoading FAISS index...")
    index = faiss.read_index(str(FAISS_INDEX))
    print(f"FAISS vectors: {index.ntotal}")

    print("\nLoading embedding metadata...")
    with open(EMBEDDING_METADATA, "r", encoding="utf-8") as f:
        embedding_metadata = json.load(f)

    print(f"Embedding metadata records: {len(embedding_metadata)}")

    print("\nLoading RAG documents...")
    with open(RAG_DOCUMENTS, "r", encoding="utf-8") as f:
        rag_documents = json.load(f)

    print(f"RAG documents: {len(rag_documents)}")

    print("\nLoading personalized recommendations...")
    personalized_df = pd.read_csv(PERSONALIZED_RECOMMENDATIONS)

    print(f"Personalized recommendations: {len(personalized_df)}")

    personalized_scores = {}
    for _, row in personalized_df.iterrows():
        resource_id = str(row.get("resource_id", ""))
        if resource_id:
            personalized_scores[resource_id] = float(row.get("personalized_score", 0.0))

    print("\nLoading embedding model...")
    model = SentenceTransformer(EMBEDDING_MODEL)
    print(f"Embedding model: {EMBEDDING_MODEL}")


# ============================================================
# BUILD DOCUMENT LOOKUP
# ============================================================

document_lookup = {}


def rebuild_document_lookup():
    global document_lookup

    document_lookup = {}

    for document in rag_documents:
        resource_id = str(document.get("resource_id", ""))

        if resource_id:
            document_lookup[resource_id] = document


# ============================================================
# RETRIEVAL
# ============================================================

def retrieve_resources(query, top_k=TOP_K):
    ensure_runtime_assets()
    rebuild_document_lookup()

    import numpy as np

    query_embedding = model.encode(
        [query],
        normalize_embeddings=True
    )

    query_embedding = np.asarray(
        query_embedding,
        dtype=np.float32
    )

    scores, indices = index.search(
        query_embedding,
        top_k
    )

    results = []

    for score, index_id in zip(scores[0], indices[0]):

        if index_id < 0:
            continue

        if index_id >= len(embedding_metadata):
            continue

        metadata = embedding_metadata[index_id]

        resource_id = str(
            metadata.get("resource_id", "")
        )

        document = document_lookup.get(
            resource_id,
            {}
        )

        results.append({
            "resource_id": resource_id,
            "score": float(score),
            "title": metadata.get("title", ""),
            "url": metadata.get("url", ""),
            "topic": metadata.get("topic", ""),
            "subtopic": metadata.get("subtopic", ""),
            "level": metadata.get("level", ""),
            "language": metadata.get("language", ""),
            "channel": metadata.get("channel", ""),
            "duration_minutes": metadata.get(
                "duration_minutes",
                ""
            ),
            "text": document.get("text", "")
        })

    return results


# ============================================================
# PERSONALIZATION
# ============================================================

def load_personalized_resources():
    ensure_runtime_assets()

    import pandas as pd

    if not PERSONALIZED_RECOMMENDATIONS.exists():
        return {}

    df = pd.read_csv(
        PERSONALIZED_RECOMMENDATIONS
    )

    result = {}

    for _, row in df.iterrows():

        resource_id = str(
            row.get("resource_id", "")
        )

        if resource_id:
            result[resource_id] = float(
                row.get(
                    "personalized_score",
                    0
                )
            )

    return result


def apply_personalization(resources):
    global personalized_scores

    if not personalized_scores:
        personalized_scores = load_personalized_resources()

    for resource in resources:

        resource_id = resource["resource_id"]

        resource["personalized_score"] = personalized_scores.get(
            resource_id,
            0.0
        )

        # Retrieval is the primary signal.
        # Personalization acts as a small additional signal.
        resource["final_score"] = (
            resource["score"] * 0.85
            + resource["personalized_score"] * 0.15
        )

    resources.sort(
        key=lambda x: x["final_score"],
        reverse=True
    )

    return resources


# ============================================================
# CONTEXT CREATION
# ============================================================

def build_context(resources):

    context_parts = []

    for i, resource in enumerate(resources, start=1):

        text = resource.get("text", "").strip()

        # Keep context bounded.
        if len(text) > 3500:
            text = text[:3500]

        context_parts.append(
            f"""
RESOURCE {i}

Title:
{resource.get("title", "")}

Channel:
{resource.get("channel", "")}

Topic:
{resource.get("topic", "")}

Subtopic:
{resource.get("subtopic", "")}

Level:
{resource.get("level", "")}

Language:
{resource.get("language", "")}

Duration:
{resource.get("duration_minutes", "")} minutes

URL:
{resource.get("url", "")}

Educational Content:
{text}
""".strip()
        )

    return "\n\n" + "\n\n".join(context_parts)


# ============================================================
# GROQ GENERATION
# ============================================================

def generate_answer(query, resources):
    client = get_groq_client()

    context = build_context(resources)

    system_prompt = """
You are Placify, an AI placement-preparation assistant.

Your job is to answer the user's technical learning question using
ONLY the retrieved educational resources provided in the context.

Rules:

1. Give a clear and useful answer to the user's question.
2. Do not invent facts that are not supported by the retrieved context.
3. Do not invent YouTube videos.
4. Do not invent URLs.
5. If the retrieved resources do not contain enough information,
   clearly say that the available resources are insufficient.
6. Use the retrieved resources as supporting learning material.
7. Keep the explanation beginner-friendly unless the question clearly
   requires advanced detail.
8. Recommend the most relevant resources at the end.
9. Only recommend resources that appear in the provided context.
10. Preserve the exact URLs provided in the context.
"""

    user_prompt = f"""
User question:

{query}

Retrieved educational resources:

{context}

Provide:

1. A direct answer to the user's question.
2. A short explanation of the important concepts.
3. A practical example or implementation approach when supported
   by the retrieved resources.
4. A "Recommended Resources" section containing the most relevant
   retrieved resources.

Do not create or guess any resource URL.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        temperature=0.2,
        max_tokens=1500,
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ]
    )

    return response.choices[0].message.content


# ============================================================
# MAIN RAG PIPELINE
# ============================================================

def run_task_rag(task_data):
    """
    RAG retrieval tailored for structured daily tasks.
    Uses FAISS index, metadata, semantic embeddings, duration fit, and hybrid ranking.
    """
    ensure_runtime_assets()

    # Import the hybrid retrieval daily task function
    try:
        from hybrid_retrieval import retrieve_daily_task_resources
    except ImportError:
        from scripts.hybrid_retrieval import retrieve_daily_task_resources

    top_k = int(task_data.get("topK") or task_data.get("top_k") or 3)
    resources = retrieve_daily_task_resources(
        task_data=task_data,
        index=index,
        metadata=embedding_metadata,
        model=model,
        personalized_scores=personalized_scores,
        top_k=top_k
    )

    query_str = task_data.get("query") or task_data.get("taskTitle") or task_data.get("task_title") or "Daily Task"

    return {
        "query": query_str,
        "answer": f"Retrieved {len(resources)} highly aligned learning resources for {query_str}.",
        "resources": resources
    }


def run_rag(query, task_context=None):
    ensure_runtime_assets()

    # If structured task context is provided, delegate to task-aware RAG pipeline
    if task_context and isinstance(task_context, dict) and (task_context.get("taskTitle") or task_context.get("task_title") or task_context.get("taskId") or task_context.get("taskDuration")):
        return run_task_rag(task_context)

    print("\n" + "=" * 70)
    print("USER QUERY")
    print("=" * 70)
    print(query)

    print("\nRetrieving resources...")

    resources = retrieve_resources(
        query,
        TOP_K
    )

    print(
        f"Retrieved resources: {len(resources)}"
    )

    resources = apply_personalization(
        resources
    )

    print("\nTop resources:")

    for i, resource in enumerate(
        resources,
        start=1
    ):

        print(
            f"{i}. "
            f"{resource['title']} "
            f"| {resource['topic']} "
            f"| score={resource['final_score']:.4f}"
        )

    # Grounded answer generation with fallback if Groq is unavailable
    answer = "Here are the top recommended resources matching your technical query."
    try:
        answer = generate_answer(
            query,
            resources
        )
    except Exception as groq_err:
        print(f"[RAG NOTE] Groq generation skipped or unavailable: {groq_err}")
        answer = f"Found {len(resources)} relevant educational resources for: '{query}'."

    return {
        "query": query,
        "answer": answer,
        "resources": [
            {
                "resource_id": resource["resource_id"],
                "title": resource["title"],
                "url": resource["url"],
                "topic": resource["topic"],
                "subtopic": resource["subtopic"],
                "level": resource["level"],
                "language": resource["language"],
                "channel": resource["channel"],
                "duration_minutes": resource[
                    "duration_minutes"
                ],
                "score": resource["final_score"]
            }
            for resource in resources
        ]
    }


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    test_query = (
        "How can I connect a React frontend "
        "with a Node.js backend?"
    )

    run_rag(test_query)