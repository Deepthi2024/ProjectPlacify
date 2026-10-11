from pathlib import Path
import pandas as pd
import re

# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

INPUT_FILE = BASE_DIR / "data" / "resources_final.csv"
OUTPUT_FILE = BASE_DIR / "data" / "resources_metadata_enriched.csv"
AUDIT_FILE = BASE_DIR / "data" / "metadata_enrichment_audit.csv"


# ============================================================
# HELPERS
# ============================================================

def normalize_text(value):
    if pd.isna(value):
        return ""
    return str(value).strip()


def split_subtopics(value):
    """
    Convert pipe-separated subtopics into a clean list.
    """
    value = normalize_text(value)

    if not value:
        return []

    return [
        item.strip()
        for item in value.split("|")
        if item.strip()
    ]


def add_subtopic(existing, new_value):
    """
    Add a subtopic only if it does not already exist.
    """
    normalized_existing = {
        item.lower(): item
        for item in existing
    }

    if new_value.lower() not in normalized_existing:
        existing.append(new_value)
        return True

    return False


def contains_any(text, keywords):
    text = text.lower()
    return any(keyword.lower() in text for keyword in keywords)


# ============================================================
# LOAD DATA
# ============================================================

print("=" * 70)
print("SAFE METADATA ENRICHMENT")
print("=" * 70)

if not INPUT_FILE.exists():
    raise FileNotFoundError(
        f"Input file not found:\n{INPUT_FILE}"
    )

df = pd.read_csv(INPUT_FILE)

print(f"\nResources loaded: {len(df)}")
print(f"Input file: {INPUT_FILE}")


# ============================================================
# VALIDATE REQUIRED COLUMNS
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
    "status"
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
# ENRICH METADATA
# ============================================================

audit_rows = []

for index, row in df.iterrows():

    original_topic = normalize_text(row["topic"])
    original_subtopic = normalize_text(row["subtopic"])
    title = normalize_text(row["title"])

    existing_subtopics = split_subtopics(original_subtopic)

    # Use title + existing subtopics.
    # We deliberately DO NOT use the full description here.
    searchable_text = (
        f"{title} "
        f"{original_subtopic}"
    ).lower()

    added_tags = []

    # --------------------------------------------------------
    # 1. BACKEND DEVELOPMENT
    # --------------------------------------------------------
    #
    # Strong rule:
    # Node.js / Express.js resources that clearly indicate
    # backend/server development.
    #

    if original_topic in {"Node.js", "Express.js"}:

        backend_keywords = [
            "backend",
            "back-end",
            "server side",
            "server-side",
            "server development",
            "backend development"
        ]

        if contains_any(searchable_text, backend_keywords):

            if add_subtopic(
                existing_subtopics,
                "Backend Development"
            ):
                added_tags.append("Backend Development")

    # --------------------------------------------------------
    # 2. FRONTEND DEVELOPMENT
    # --------------------------------------------------------
    #
    # Strong rule:
    # React / HTML / CSS resources clearly describing
    # frontend development.
    #

    if original_topic in {
        "React",
        "HTML",
        "CSS",
        "JavaScript"
    }:

        frontend_keywords = [
            "frontend",
            "front-end",
            "frontend development",
            "front end development"
        ]

        if contains_any(searchable_text, frontend_keywords):

            if add_subtopic(
                existing_subtopics,
                "Frontend Development"
            ):
                added_tags.append("Frontend Development")

    # --------------------------------------------------------
    # 3. REST APIs
    # --------------------------------------------------------
    #
    # Strong explicit REST API detection.
    #

    rest_patterns = [
        r"\brest\s+api\b",
        r"\brestful\s+api\b",
        r"\brest\s+apis\b",
        r"\brestful\s+apis\b"
    ]

    if any(
        re.search(pattern, searchable_text)
        for pattern in rest_patterns
    ):

        if add_subtopic(
            existing_subtopics,
            "REST APIs"
        ):
            added_tags.append("REST APIs")

    # --------------------------------------------------------
    # 4. AUTHENTICATION
    # --------------------------------------------------------
    #
    # Only strong authentication/security signals.
    #

    authentication_keywords = [
        "authentication",
        "authorization",
        "jwt authentication",
        "jwt auth",
        "json web token",
        "login authentication",
        "user authentication",
        "user authorization"
    ]

    if contains_any(
        searchable_text,
        authentication_keywords
    ):

        if add_subtopic(
            existing_subtopics,
            "Authentication"
        ):
            added_tags.append("Authentication")

    # --------------------------------------------------------
    # 5. DEPLOYMENT
    # --------------------------------------------------------
    #
    # Only explicit deployment/hosting signals.
    #

    deployment_keywords = [
        "deployment",
        "deploying",
        "deploy",
        "hosting",
        "host your",
        "deploy your"
    ]

    if contains_any(
        searchable_text,
        deployment_keywords
    ):

        if add_subtopic(
            existing_subtopics,
            "Deployment"
        ):
            added_tags.append("Deployment")

    # --------------------------------------------------------
    # 6. PROJECTS
    # --------------------------------------------------------
    #
    # Be conservative.
    #
    # Only add Projects when:
    # - primary topic is already Full Stack Projects
    # OR
    # - title explicitly contains project-oriented phrases.
    #

    project_title_patterns = [
        r"\bproject\b",
        r"\bprojects\b",
        r"\bbuild an application\b",
        r"\bbuild a website\b",
        r"\bbuild a web app\b",
        r"\bbuild a full stack\b",
        r"\bbuild a full-stack\b",
        r"\bcomplete project\b"
    ]

    is_project = (
        original_topic == "Full Stack Projects"
        or any(
            re.search(pattern, title.lower())
            for pattern in project_title_patterns
        )
    )

    if is_project:

        if add_subtopic(
            existing_subtopics,
            "Projects"
        ):
            added_tags.append("Projects")

    # --------------------------------------------------------
    # 7. ANIMATIONS
    # --------------------------------------------------------
    #
    # Only CSS animation-related resources.
    #

    if original_topic == "CSS":

        animation_keywords = [
            "animation",
            "animations",
            "transitions"
        ]

        if contains_any(
            searchable_text,
            animation_keywords
        ):

            if add_subtopic(
                existing_subtopics,
                "Animations"
            ):
                added_tags.append("Animations")

    # --------------------------------------------------------
    # 8. PROMISES
    # --------------------------------------------------------
    #
    # Only JavaScript resources.
    #

    if original_topic == "JavaScript":

        promise_keywords = [
            "promise",
            "promises",
            "async/await",
            "async await"
        ]

        if contains_any(
            searchable_text,
            promise_keywords
        ):

            if add_subtopic(
                existing_subtopics,
                "Promises"
            ):
                added_tags.append("Promises")

    # --------------------------------------------------------
    # 9. useEffect
    # --------------------------------------------------------
    #
    # Only explicit useEffect mentions.
    # We DO NOT infer useEffect merely from "Hooks".
    #

    if original_topic == "React":

        if re.search(
            r"\buseeffect\b",
            searchable_text.replace(" ", "").lower()
        ):

            if add_subtopic(
                existing_subtopics,
                "useEffect"
            ):
                added_tags.append("useEffect")

    # --------------------------------------------------------
    # 10. CRUD
    # --------------------------------------------------------
    #
    # Strong rule for MongoDB resources.
    #

    if original_topic == "MongoDB":

        crud_keywords = [
            "crud",
            "crud operations",
            "create read update delete"
        ]

        if contains_any(
            searchable_text,
            crud_keywords
        ):

            if add_subtopic(
                existing_subtopics,
                "CRUD"
            ):
                added_tags.append("CRUD")

    # --------------------------------------------------------
    # SAVE AUDIT INFORMATION
    # --------------------------------------------------------

    new_subtopic = "|".join(existing_subtopics)

    if added_tags:

        audit_rows.append({
            "resource_id": row["resource_id"],
            "title": title,
            "topic": original_topic,
            "old_subtopic": original_subtopic,
            "new_subtopic": new_subtopic,
            "added_tags": "|".join(added_tags)
        })

    # Update ONLY the copy in memory.
    df.at[index, "subtopic"] = new_subtopic


# ============================================================
# SAVE OUTPUT
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
print("ENRICHMENT COMPLETE")
print("=" * 70)

print(f"\nOriginal resources : {len(df)}")
print(f"Resources modified : {len(audit_df)}")

print("\nTags added:")

if len(audit_df) > 0:

    tag_counts = {}

    for tags in audit_df["added_tags"]:
        for tag in tags.split("|"):
            tag_counts[tag] = tag_counts.get(tag, 0) + 1

    for tag, count in sorted(
        tag_counts.items(),
        key=lambda x: (-x[1], x[0])
    ):
        print(f"  {tag}: {count}")

else:
    print("  No metadata changes were made.")

print("\nOutput files:")
print(f"  {OUTPUT_FILE}")
print(f"  {AUDIT_FILE}")

print("\nIMPORTANT:")
print("resources_final.csv was NOT modified.")
print("=" * 70)