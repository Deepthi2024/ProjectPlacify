import json
import numpy as np
import faiss
from pathlib import Path


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

EMBEDDINGS_FILE = BASE_DIR / "data" / "rag_embeddings.npz"
METADATA_FILE = BASE_DIR / "data" / "rag_embedding_metadata.json"
INDEX_FILE = BASE_DIR / "data" / "rag_faiss.index"


# ============================================================
# LOAD EMBEDDINGS
# ============================================================

def load_embeddings():
    if not EMBEDDINGS_FILE.exists():
        raise FileNotFoundError(
            f"Embeddings file not found:\n{EMBEDDINGS_FILE}"
        )

    data = np.load(EMBEDDINGS_FILE)

    if "embeddings" not in data:
        raise ValueError(
            "The NPZ file does not contain an 'embeddings' array."
        )

    embeddings = data["embeddings"]

    return np.asarray(embeddings, dtype=np.float32)


# ============================================================
# LOAD METADATA
# ============================================================

def load_metadata():
    if not METADATA_FILE.exists():
        raise FileNotFoundError(
            f"Metadata file not found:\n{METADATA_FILE}"
        )

    with open(METADATA_FILE, "r", encoding="utf-8") as f:
        metadata = json.load(f)

    return metadata


# ============================================================
# BUILD FAISS INDEX
# ============================================================

def build_index(embeddings):

    dimensions = embeddings.shape[1]

    print(f"\nEmbedding dimensions: {dimensions}")
    print(f"Number of vectors    : {len(embeddings)}")

    # --------------------------------------------------------
    # IndexFlatIP = Inner Product
    #
    # Because embeddings were generated using:
    # normalize_embeddings=True
    #
    # Inner Product between normalized vectors
    # is equivalent to Cosine Similarity.
    # --------------------------------------------------------

    index = faiss.IndexFlatIP(dimensions)

    index.add(embeddings)

    return index


# ============================================================
# VALIDATION
# ============================================================

def validate_index(index, embeddings, metadata):

    print("\nValidation:")
    print("-" * 60)

    print(f"FAISS vectors        : {index.ntotal}")
    print(f"Embedding vectors    : {len(embeddings)}")
    print(f"Metadata records     : {len(metadata)}")

    if index.ntotal != len(embeddings):
        raise ValueError(
            "Mismatch between FAISS vectors and embeddings."
        )

    if len(metadata) != len(embeddings):
        raise ValueError(
            "Mismatch between metadata records and embeddings."
        )

    # Check that embedding indexes are sequential
    for expected_index, record in enumerate(metadata):

        actual_index = record.get("embedding_index")

        if actual_index != expected_index:
            raise ValueError(
                f"Metadata index mismatch at position {expected_index}: "
                f"found {actual_index}"
            )

    print("✓ Vector count matches")
    print("✓ Metadata count matches")
    print("✓ Embedding indices are correctly mapped")


# ============================================================
# SAVE INDEX
# ============================================================

def save_index(index):

    INDEX_FILE.parent.mkdir(parents=True, exist_ok=True)

    faiss.write_index(index, str(INDEX_FILE))

    print(f"\nFAISS index saved to:")
    print(INDEX_FILE)


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 70)
    print("Placify - FAISS Vector Index Builder")
    print("=" * 70)

    print("\nLoading embeddings...")
    embeddings = load_embeddings()

    print(f"Loaded embeddings: {embeddings.shape}")

    print("\nLoading metadata...")
    metadata = load_metadata()

    print(f"Loaded metadata records: {len(metadata)}")

    print("\nBuilding FAISS index...")

    index = build_index(embeddings)

    validate_index(
        index,
        embeddings,
        metadata
    )

    save_index(index)

    print("\n" + "=" * 70)
    print("FAISS INDEX BUILD COMPLETE")
    print("=" * 70)

    print(f"Vectors indexed : {index.ntotal}")
    print(f"Dimensions      : {embeddings.shape[1]}")
    print(f"Index type      : IndexFlatIP")
    print(f"\nIndex:")
    print(INDEX_FILE)

    print("\nSTATUS: VECTOR DATABASE READY")
    print("=" * 70)


if __name__ == "__main__":
    main()