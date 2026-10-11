from pathlib import Path
import pandas as pd
import re


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

INPUT_FILE = BASE_DIR / "data" / "resources_metadata_enriched.csv"

OUTPUT_FILE = (
    BASE_DIR / "data" / "resources_metadata_enriched_v2.csv"
)

AUDIT_FILE = (
    BASE_DIR / "data" / "metadata_enrichment_audit_v2.csv"
)


# ============================================================
# HELPERS
# ============================================================

def normalize_text(value):
    if pd.isna(value):
        return ""
    return str(value).strip()


def split_subtopics(value):
    value = normalize_text(value)

    if not value:
        return []

    return [
        item.strip()
        for item in value.split("|")
        if item.strip()
    ]


def add_subtopic(subtopics, new_value):
    existing = {x.lower() for x in subtopics}

    if new_value.lower() not in existing:
        subtopics.append(new_value)
        return True

    return False


# ============================================================
# LOAD
# ============================================================

print("=" * 70)
print("PLACIFY - SAFE METADATA ENRICHMENT V2")
print("=" * 70)

if not INPUT_FILE.exists():
    raise FileNotFoundError(
        f"Input file not found:\n{INPUT_FILE}"
    )

df = pd.read_csv(INPUT_FILE)

print(f"\nResources loaded: {len(df)}")
print(f"Input: {INPUT_FILE}")


# ============================================================
# VALIDATION
# ============================================================

required_columns = [
    "resource_id",
    "topic",
    "subtopic",
    "title",
    "description"
]

missing = [
    col for col in required_columns
    if col not in df.columns
]

if missing:
    raise ValueError(
        f"Missing required columns: {missing}"
    )


# ============================================================
# ENRICHMENT
# ============================================================

audit_rows = []

for index, row in df.iterrows():

    resource_id = normalize_text(row["resource_id"])
    title = normalize_text(row["title"])
    topic = normalize_text(row["topic"])
    description = normalize_text(row["description"])
    old_subtopic = normalize_text(row["subtopic"])

    subtopics = split_subtopics(old_subtopic)

    # We use title + description for detecting explicit concepts.
    searchable_text = (
        f"{title} {description}"
    ).lower()

    added_tags = []

    # ========================================================
    # 1. FRONTEND DEVELOPMENT
    # ========================================================
    #
    # HTML and CSS:
    # Strongly frontend-oriented in this dataset.
    #
    # React:
    # Frontend framework in this dataset.
    #
    # JavaScript:
    # Only add when there are explicit browser/frontend
    # indicators.
    # ========================================================

    if topic in {"HTML", "CSS", "React"}:

        if add_subtopic(
            subtopics,
            "Frontend Development"
        ):
            added_tags.append("Frontend Development")

    elif topic == "JavaScript":

        frontend_indicators = [
            r"\bfrontend\b",
            r"\bfront-end\b",
            r"\bfront end\b",
            r"\bdom\b",
            r"\bweb api\b",
            r"\bweb apis\b",
            r"\bbrowser\b",
            r"\bui\b",
            r"\buser interface\b",
            r"\bfetch api\b",
            r"\bhtml\b",
            r"\bcss\b"
        ]

        if any(
            re.search(pattern, searchable_text)
            for pattern in frontend_indicators
        ):
            if add_subtopic(
                subtopics,
                "Frontend Development"
            ):
                added_tags.append("Frontend Development")

    # ========================================================
    # 2. useEffect
    # ========================================================
    #
    # ONLY explicit useEffect mention.
    #
    # We deliberately do NOT infer it from "Hooks".
    # ========================================================

    if topic == "React":

        useeffect_patterns = [
            r"\buse\s*effect\b",
            r"\buseeffect\b"
        ]

        if any(
            re.search(pattern, searchable_text)
            for pattern in useeffect_patterns
        ):
            if add_subtopic(
                subtopics,
                "useEffect"
            ):
                added_tags.append("useEffect")

    # ========================================================
    # AUDIT
    # ========================================================

    new_subtopic = "|".join(subtopics)

    if added_tags:

        audit_rows.append({
            "resource_id": resource_id,
            "title": title,
            "topic": topic,
            "old_subtopic": old_subtopic,
            "new_subtopic": new_subtopic,
            "added_tags": "|".join(added_tags)
        })

    df.at[index, "subtopic"] = new_subtopic


# ============================================================
# SAVE
# ============================================================

df.to_csv(
    OUTPUT_FILE,
    index=False,
    encoding="utf-8-sig"
)

audit_df = pd.DataFrame(audit_rows)

audit_df.to_csv(
    AUDIT_FILE,
    index=False,
    encoding="utf-8-sig"
)


# ============================================================
# SUMMARY
# ============================================================

print("\n" + "=" * 70)
print("V2 ENRICHMENT COMPLETE")
print("=" * 70)

print(f"\nResources loaded : {len(df)}")
print(f"Resources changed: {len(audit_df)}")

print("\nNew tags added:")

if len(audit_df) > 0:

    tag_counts = {}

    for tags in audit_df["added_tags"]:
        for tag in tags.split("|"):
            tag_counts[tag] = (
                tag_counts.get(tag, 0) + 1
            )

    for tag, count in sorted(
        tag_counts.items(),
        key=lambda x: (-x[1], x[0])
    ):
        print(f"  {tag}: {count}")

else:
    print("  No changes.")

print("\nOutput:")
print(OUTPUT_FILE)

print("\nAudit:")
print(AUDIT_FILE)

print("\nIMPORTANT:")
print("resources_metadata_enriched.csv was NOT modified.")
print("resources_final.csv was NOT modified.")

print("=" * 70)