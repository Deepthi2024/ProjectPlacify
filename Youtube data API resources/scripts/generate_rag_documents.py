from pathlib import Path
import json
import re
import pandas as pd


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

INPUT_FILE = BASE_DIR / "data" / "resources_metadata_final.csv"
OUTPUT_FILE = BASE_DIR / "data" / "rag_documents_final.json"


# ============================================================
# TEXT CLEANING
# ============================================================

def clean_description(text):
    """
    Clean YouTube descriptions while preserving useful
    educational content.
    """

    if pd.isna(text):
        return ""

    text = str(text)

    # --------------------------------------------------------
    # Remove URLs
    # --------------------------------------------------------

    text = re.sub(
        r'https?://\S+|www\.\S+',
        ' ',
        text,
        flags=re.IGNORECASE
    )

    # --------------------------------------------------------
    # Remove social-media/contact lines
    # --------------------------------------------------------

    social_patterns = [
        r'(?im)^.*\b(instagram|twitter|linkedin|facebook|telegram)\b.*$',
        r'(?im)^.*\b(contact|email|gmail|mail us|reach us)\b.*$',
        r'(?im)^.*\b(join our|follow us|subscribe)\b.*$',
    ]

    for pattern in social_patterns:
        text = re.sub(pattern, ' ', text)

    # --------------------------------------------------------
    # Remove promotional / affiliate language
    # --------------------------------------------------------

    promotional_patterns = [
        r'(?im)^.*\b(affiliate|discount|coupon|promo code)\b.*$',
        r'(?im)^.*\b(buy now|limited offer|special offer)\b.*$',
        r'(?im)^.*\b(enroll now|register now)\b.*$',
        r'(?im)^.*\b(use my code|use code)\b.*$',
    ]

    for pattern in promotional_patterns:
        text = re.sub(pattern, ' ', text)

    # --------------------------------------------------------
    # Remove unrelated course promotions
    # --------------------------------------------------------

    course_patterns = [
        r'(?im)^.*\b(check out my course)\b.*$',
        r'(?im)^.*\b(my course)\b.*$',
        r'(?im)^.*\b(our course)\b.*$',
        r'(?im)^.*\b(complete course available)\b.*$',
    ]

    for pattern in course_patterns:
        text = re.sub(pattern, ' ', text)

    # --------------------------------------------------------
    # Remove hashtag / SEO keyword blocks
    # --------------------------------------------------------

    text = re.sub(
        r'(?im)^.*(?:#\w+\s*){2,}.*$',
        ' ',
        text
    )

    # Remove isolated hashtags
    text = re.sub(
        r'#\w+',
        ' ',
        text
    )

    # --------------------------------------------------------
    # Remove common copyright boilerplate
    # --------------------------------------------------------

    copyright_patterns = [
        r'(?im)^.*\bcopyright\b.*$',
        r'(?im)^.*\ball rights reserved\b.*$',
    ]

    for pattern in copyright_patterns:
        text = re.sub(pattern, ' ', text)

    # --------------------------------------------------------
    # Normalize whitespace
    # --------------------------------------------------------

    text = re.sub(r'\r\n?', '\n', text)

    # Preserve paragraph structure but remove excessive spaces
    lines = []

    for line in text.split('\n'):
        line = re.sub(r'[ \t]+', ' ', line).strip()

        if line:
            lines.append(line)

    text = '\n'.join(lines)

    # Remove excessive blank lines
    text = re.sub(r'\n{3,}', '\n\n', text)

    return text.strip()


# ============================================================
# LOAD DATA
# ============================================================

print("=" * 70)
print("RAG DOCUMENT GENERATION")
print("=" * 70)

if not INPUT_FILE.exists():
    raise FileNotFoundError(
        f"Input file not found:\n{INPUT_FILE}"
    )

df = pd.read_csv(INPUT_FILE)

print(f"\nResources loaded: {len(df)}")
print(f"Input: {INPUT_FILE}")


# ============================================================
# VALIDATE COLUMNS
# ============================================================

required_columns = [
    "resource_id",
    "domain",
    "topic",
    "subtopic",
    "level",
    "title",
    "channel",
    "url",
    "duration_minutes",
    "language",
    "quality_score",
    "status",
    "description"
]

missing_columns = [
    column
    for column in required_columns
    if column not in df.columns
]

if missing_columns:
    raise ValueError(
        f"Missing required columns: {missing_columns}"
    )


# ============================================================
# BUILD RAG DOCUMENTS
# ============================================================

documents = []

empty_documents = 0

for _, row in df.iterrows():

    description = clean_description(
        row["description"]
    )

    # --------------------------------------------------------
    # Metadata
    # --------------------------------------------------------

    metadata = {
        "resource_id": row["resource_id"],
        "domain": row["domain"],
        "topic": row["topic"],
        "subtopic": row["subtopic"],
        "level": row["level"],
        "title": row["title"],
        "channel": row["channel"],
        "url": row["url"],
        "duration_minutes": row["duration_minutes"],
        "language": row["language"],
        "quality_score": row["quality_score"],
        "status": row["status"],
        "engagement_score": row["engagement_score"],
        "recency_score": row["recency_score"],
        "duration_score": row["duration_score"],
        "metadata_completeness": row["metadata_completeness"],
        "topic_relevance": row["topic_relevance"],
        "level_suitability": row["level_suitability"],
        "content_quality": row["content_quality"],
        "educational_value": row["educational_value"],
        "published_at": row["published_at"],
        "view_count": row["view_count"],
        "like_count": row["like_count"],
        "comment_count": row["comment_count"],
    }

    # --------------------------------------------------------
    # Build semantic text
    #
    # quality_score and other numerical scores are deliberately
    # kept in metadata and NOT added to the semantic text.
    # --------------------------------------------------------

    semantic_parts = []

    fields_for_embedding = [
        ("Title", row["title"]),
        ("Domain", row["domain"]),
        ("Topic", row["topic"]),
        ("Subtopics", row["subtopic"]),
        ("Level", row["level"]),
        ("Language", row["language"]),
    ]

    for label, value in fields_for_embedding:

        if pd.notna(value) and str(value).strip():
            semantic_parts.append(
                f"{label}: {str(value).strip()}"
            )

    if description:
        semantic_parts.append(
            f"Educational Content:\n{description}"
        )

    text = "\n".join(semantic_parts).strip()

    # --------------------------------------------------------
    # Skip completely empty documents
    # --------------------------------------------------------

    if not text:
        empty_documents += 1
        continue

    documents.append({
        "resource_id": str(row["resource_id"]),
        "text": text,
        "metadata": metadata
    })


# ============================================================
# SAVE JSON
# ============================================================

with open(
    OUTPUT_FILE,
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        documents,
        f,
        ensure_ascii=False,
        indent=2
    )


# ============================================================
# SUMMARY
# ============================================================

print("\n" + "=" * 70)
print("RAG DOCUMENT GENERATION COMPLETE")
print("=" * 70)

print(f"\nInput resources       : {len(df)}")
print(f"Documents generated   : {len(documents)}")
print(f"Empty documents       : {empty_documents}")

print(f"\nOutput:")
print(OUTPUT_FILE)

print("\nOriginal resources_final.csv was NOT modified.")

print("=" * 70)