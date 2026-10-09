import json
import numpy as np
from pathlib import Path
from sentence_transformers import SentenceTransformer


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

INPUT = BASE_DIR / "data" / "rag_documents_final.json"
OUTPUT = BASE_DIR / "data" / "rag_embeddings.npz"
METADATA_OUTPUT = BASE_DIR / "data" / "rag_embedding_metadata.json"


# ============================================================
# CONFIGURATION
# ============================================================

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


# ============================================================
# LOAD DOCUMENTS
# ============================================================

def load_documents():

    if not INPUT.exists():
        raise FileNotFoundError(
            f"Input file not found:\n{INPUT}"
        )

    with open(INPUT, "r", encoding="utf-8") as f:
        documents = json.load(f)

    return documents


# ============================================================
# BUILD EMBEDDING TEXT
# ============================================================

def build_embedding_text(doc):

    text = (doc.get("text") or "").strip()

    if not text:
        return None

    metadata = doc.get("metadata", {})

    title = metadata.get("title", "")
    topic = metadata.get("topic", "")
    subtopic = metadata.get("subtopic", "")
    level = metadata.get("level", "")
    language = metadata.get("language", "")

    # Metadata is included as context for semantic retrieval.
    #
    # URL, channel, quality score and other ranking fields
    # are NOT embedded because they are not useful semantic
    # content.

    parts = []

    if title:
        parts.append(f"Title: {title}")

    if topic:
        parts.append(f"Topic: {topic}")

    if subtopic:
        parts.append(f"Subtopics: {subtopic}")

    if level:
        parts.append(f"Level: {level}")

    if language:
        parts.append(f"Language: {language}")

    parts.append(f"Educational Content:\n{text}")

    return "\n\n".join(parts)


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 70)
    print("Placify - Embedding Generation")
    print("=" * 70)

    print(f"\nInput file : {INPUT}")
    print(f"Model      : {MODEL_NAME}")

    # --------------------------------------------------------
    # Load
    # --------------------------------------------------------

    documents = load_documents()

    print(f"Total documents: {len(documents)}")

    # --------------------------------------------------------
    # Prepare texts
    # --------------------------------------------------------

    valid_documents = []
    embedding_texts = []

    skipped = 0

    for doc in documents:

        embedding_text = build_embedding_text(doc)

        if embedding_text is None:
            skipped += 1
            continue

        valid_documents.append(doc)
        embedding_texts.append(embedding_text)

    print(f"Documents to embed: {len(embedding_texts)}")
    print(f"Documents skipped : {skipped}")

    if not embedding_texts:
        raise ValueError(
            "No non-empty documents available for embedding."
        )

    # --------------------------------------------------------
    # Load model
    # --------------------------------------------------------

    print("\nLoading embedding model...")

    model = SentenceTransformer(MODEL_NAME)

    print("Model loaded.")

    # --------------------------------------------------------
    # Generate embeddings
    # --------------------------------------------------------

    print("\nGenerating embeddings...")

    embeddings = model.encode(
        embedding_texts,
        batch_size=32,
        show_progress_bar=True,
        normalize_embeddings=True,
        convert_to_numpy=True
    )

    embeddings = np.asarray(
        embeddings,
        dtype=np.float32
    )

    # --------------------------------------------------------
    # Validation
    # --------------------------------------------------------

    print("\nEmbedding validation:")
    print(f"Shape      : {embeddings.shape}")
    print(f"Dimensions : {embeddings.shape[1]}")
    print(f"Data type  : {embeddings.dtype}")

    # --------------------------------------------------------
    # Save vectors
    # --------------------------------------------------------

    OUTPUT.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    np.savez_compressed(
        OUTPUT,
        embeddings=embeddings
    )

    # --------------------------------------------------------
    # Save metadata mapping
    # --------------------------------------------------------

    metadata_records = []

    for index, doc in enumerate(valid_documents):

        metadata = doc.get("metadata", {})

        metadata_records.append({
            "embedding_index": index,
            "resource_id": doc.get(
                "resource_id"
            ),
            "title": metadata.get(
                "title"
            ),
            "topic": metadata.get(
                "topic"
            ),
            "subtopic": metadata.get(
                "subtopic"
            ),
            "level": metadata.get(
                "level"
            ),
            "language": metadata.get(
                "language"
            ),
            "channel": metadata.get(
                "channel"
            ),
            "url": metadata.get(
                "url"
            ),
            "duration_minutes": metadata.get(
                "duration_minutes"
            ),
            "quality_score": metadata.get(
                "quality_score"
            )
        })

    with open(
        METADATA_OUTPUT,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            metadata_records,
            f,
            ensure_ascii=False,
            indent=2
        )

    # --------------------------------------------------------
    # Final report
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("EMBEDDING GENERATION COMPLETE")
    print("=" * 70)

    print(f"Total documents      : {len(documents)}")
    print(f"Embedded documents   : {len(valid_documents)}")
    print(f"Skipped empty docs   : {skipped}")
    print(f"Embedding dimensions : {embeddings.shape[1]}")

    print(f"\nVectors:")
    print(OUTPUT)

    print(f"\nMetadata mapping:")
    print(METADATA_OUTPUT)

    print("\nSTATUS: EMBEDDINGS READY")
    print("=" * 70)


if __name__ == "__main__":
    main()