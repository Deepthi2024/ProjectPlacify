from pathlib import Path
import pandas as pd
import re


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

INPUT_FILE = BASE_DIR / "data" / "resources_metadata_enriched.csv"
OUTPUT_FILE = BASE_DIR / "data" / "resources_metadata_final.csv"
AUDIT_FILE = BASE_DIR / "data" / "metadata_enrichment_audit_final.csv"


# ============================================================
# HELPERS
# ============================================================

def clean(value):
    if pd.isna(value):
        return ""
    return str(value).strip()


def split_subtopics(value):
    value = clean(value)

    if not value:
        return []

    return [
        item.strip()
        for item in value.split("|")
        if item.strip()
    ]


def add_tag(tags, tag):
    existing = {x.lower() for x in tags}

    if tag.lower() not in existing:
        tags.append(tag)
        return True

    return False


# ============================================================
# LOAD
# ============================================================

print("=" * 70)
print("PLACIFY - FINAL METADATA ENRICHMENT")
print("=" * 70)

if not INPUT_FILE.exists():
    raise FileNotFoundError(
        f"Input file not found:\n{INPUT_FILE}"
    )

df = pd.read_csv(INPUT_FILE)

print(f"\nResources loaded: {len(df)}")
print(f"Input: {INPUT_FILE}")


# ============================================================
# VALIDATE
# ============================================================

required = [
    "resource_id",
    "topic",
    "subtopic",
    "title",
    "description"
]

missing = [c for c in required if c not in df.columns]

if missing:
    raise ValueError(f"Missing columns: {missing}")


# ============================================================
# FINAL ENRICHMENT
# ============================================================

audit = []

for index, row in df.iterrows():

    resource_id = clean(row["resource_id"])
    topic = clean(row["topic"])
    title = clean(row["title"])
    description = clean(row["description"])
    old_subtopics = clean(row["subtopic"])

    tags = split_subtopics(old_subtopics)

    title_text = title.lower()
    subtopic_text = old_subtopics.lower()

    added = []

    # ========================================================
    # 1. FRONTEND DEVELOPMENT
    # ========================================================
    #
    # HTML, CSS and React are explicitly frontend technologies
    # in our Placify taxonomy.
    #
    # JavaScript is only tagged when the TITLE or EXISTING
    # SUBTOPICS clearly indicate frontend/browser usage.
    #
    # Description is intentionally NOT used here.
    # ========================================================

    if topic in {"HTML", "CSS", "React"}:

        if add_tag(tags, "Frontend Development"):
            added.append("Frontend Development")

    elif topic == "JavaScript":

        js_frontend_patterns = [
            r"\bfrontend\b",
            r"\bfront-end\b",
            r"\bfront end\b",
            r"\bdom\b",
            r"\bweb api\b",
            r"\bweb apis\b",
            r"\bbrowser\b",
            r"\buser interface\b",
            r"\bui\b",
            r"\bfetch api\b",
        ]

        search_text = f"{title_text} {subtopic_text}"

        if any(
            re.search(pattern, search_text)
            for pattern in js_frontend_patterns
        ):
            if add_tag(tags, "Frontend Development"):
                added.append("Frontend Development")

    # ========================================================
    # 2. useEffect
    # ========================================================
    #
    # VERY STRICT:
    # Only title or existing subtopic can trigger this tag.
    #
    # We do NOT inspect descriptions because course descriptions
    # often mention many concepts that may not be actually taught
    # in depth.
    # ========================================================

    if topic == "React":

        useeffect_patterns = [
            r"\buseeffect\b",
            r"\buse\s+effect\b"
        ]

        search_text = f"{title_text} {subtopic_text}"

        if any(
            re.search(pattern, search_text)
            for pattern in useeffect_patterns
        ):
            if add_tag(tags, "useEffect"):
                added.append("useEffect")

    # ========================================================
    # SAVE CHANGES
    # ========================================================

    new_subtopics = "|".join(tags)

    if added:

        audit.append({
            "resource_id": resource_id,
            "title": title,
            "topic": topic,
            "old_subtopic": old_subtopics,
            "new_subtopic": new_subtopics,
            "added_tags": "|".join(added)
        })

    df.at[index, "subtopic"] = new_subtopics


# ============================================================
# SAVE
# ============================================================

df.to_csv(
    OUTPUT_FILE,
    index=False,
    encoding="utf-8-sig"
)

audit_df = pd.DataFrame(audit)

audit_df.to_csv(
    AUDIT_FILE,
    index=False,
    encoding="utf-8-sig"
)


# ============================================================
# SUMMARY
# ============================================================

print("\n" + "=" * 70)
print("FINAL METADATA ENRICHMENT COMPLETE")
print("=" * 70)

print(f"\nResources loaded : {len(df)}")
print(f"Resources changed: {len(audit_df)}")

if not audit_df.empty:

    print("\nTags added:")

    counts = (
        audit_df["added_tags"]
        .str.split("|")
        .explode()
        .value_counts()
    )

    for tag, count in counts.items():
        print(f"  {tag}: {count}")

else:
    print("\nNo additional tags added.")

print("\nFinal metadata:")
print(OUTPUT_FILE)

print("\nAudit:")
print(AUDIT_FILE)

print("\nOriginal files preserved:")
print("  resources_final.csv")
print("  resources_metadata_enriched.csv")

print("=" * 70)