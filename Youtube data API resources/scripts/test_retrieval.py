import json
import numpy as np
import faiss
from pathlib import Path
from sentence_transformers import SentenceTransformer


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

INDEX_FILE = BASE_DIR / "data" / "rag_faiss.index"
METADATA_FILE = BASE_DIR / "data" / "rag_embedding_metadata.json"


MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

TOP_K = 5


# ============================================================
# LOAD FAISS INDEX
# ============================================================

def load_index():

    if not INDEX_FILE.exists():
        raise FileNotFoundError(
            f"FAISS index not found:\n{INDEX_FILE}"
        )

    index = faiss.read_index(str(INDEX_FILE))

    return index


# ============================================================
# LOAD METADATA
# ============================================================

def load_metadata():

    if not METADATA_FILE.exists():
        raise FileNotFoundError(
            f"Metadata file not found:\n{METADATA_FILE}"
        )

    with open(METADATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


# ============================================================
# SEARCH
# ============================================================

def search(query, model, index, metadata, top_k=TOP_K):

    # Convert user query into embedding
    query_embedding = model.encode(
        [query],
        normalize_embeddings=True,
        convert_to_numpy=True
    )

    query_embedding = np.asarray(
        query_embedding,
        dtype=np.float32
    )

    # Search FAISS
    scores, indices = index.search(
        query_embedding,
        top_k
    )

    results = []

    for score, index_position in zip(scores[0], indices[0]):

        if index_position < 0:
            continue

        resource = metadata[index_position]

        results.append({
            "score": float(score),
            "resource_id": resource.get("resource_id"),
            "title": resource.get("title"),
            "topic": resource.get("topic"),
            "subtopic": resource.get("subtopic"),
            "level": resource.get("level"),
            "language": resource.get("language"),
            "channel": resource.get("channel"),
            "duration_minutes": resource.get("duration_minutes"),
            "quality_score": resource.get("quality_score"),
            "url": resource.get("url")
        })

    return results


# ============================================================
# DISPLAY RESULTS
# ============================================================

def display_results(query, results):

    print("\n" + "=" * 80)
    print(f"QUERY: {query}")
    print("=" * 80)

    for rank, result in enumerate(results, start=1):

        print(f"\n#{rank}")
        print("-" * 70)

        print(f"Score      : {result['score']:.4f}")
        print(f"Resource ID: {result['resource_id']}")
        print(f"Title      : {result['title']}")
        print(f"Topic      : {result['topic']}")
        print(f"Subtopic   : {result['subtopic']}")
        print(f"Level      : {result['level']}")
        print(f"Language   : {result['language']}")
        print(f"Channel    : {result['channel']}")
        print(f"Duration   : {result['duration_minutes']} minutes")
        print(f"Quality    : {result['quality_score']}")
        print(f"URL        : {result['url']}")


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 80)
    print("Placify - RAG Retrieval Evaluation")
    print("=" * 80)

    print("\nLoading FAISS index...")
    index = load_index()

    print(f"Vectors in index: {index.ntotal}")

    print("\nLoading metadata...")
    metadata = load_metadata()

    print(f"Metadata records: {len(metadata)}")

    print("\nLoading embedding model...")
    model = SentenceTransformer(MODEL_NAME)

    print("Model loaded.")

    print("\n" + "=" * 80)
    print("INTERACTIVE RETRIEVAL TEST")
    print("=" * 80)

    print("\nEnter a query to search Placify resources.")
    print("Type 'exit' to stop.\n")

    while True:

        query = input("Query: ").strip()

        if query.lower() == "exit":
            break

        if not query:
            continue

        results = search(
            query,
            model,
            index,
            metadata,
            TOP_K
        )

        display_results(
            query,
            results
        )


if __name__ == "__main__":
    main()