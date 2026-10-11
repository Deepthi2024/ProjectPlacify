from pathlib import Path
import pandas as pd
import re

# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

INPUT_FILE = BASE_DIR / "data" / "resources_final.csv"
OUTPUT_FILE = BASE_DIR / "data" / "metadata_audit.csv"


# ============================================================
# LOAD DATA
# ============================================================

if not INPUT_FILE.exists():
    raise FileNotFoundError(
        f"Could not find:\n{INPUT_FILE}"
    )

df = pd.read_csv(INPUT_FILE)

print("=" * 70)
print("PLACIFY - METADATA AUDIT")
print("=" * 70)

print(f"\nResources loaded: {len(df)}")


# ============================================================
# NORMALIZE TEXT
# ============================================================

TEXT_COLUMNS = [
    "title",
    "description",
    "tags",
    "topic",
    "subtopic"
]

for col in TEXT_COLUMNS:
    if col not in df.columns:
        df[col] = ""

    df[col] = df[col].fillna("").astype(str)

df["search_text"] = (
    df["title"] + " " +
    df["description"] + " " +
    df["tags"] + " " +
    df["topic"] + " " +
    df["subtopic"]
).str.lower()


# ============================================================
# KEYWORD GROUPS
# ============================================================

AUDIT_RULES = {

    # --------------------------------------------------------
    # Broad development categories
    # --------------------------------------------------------

    "Frontend Development": [
        "frontend",
        "front end",
        "front-end",
        "ui development",
        "user interface",
        "web development",
        "client side",
        "client-side"
    ],

    "Backend Development": [
        "backend",
        "back end",
        "back-end",
        "server side",
        "server-side",
        "server development"
    ],

    # --------------------------------------------------------
    # REST APIs
    # --------------------------------------------------------

    "REST APIs": [
        "rest api",
        "restful api",
        "rest api",
        "restful",
        "api endpoint",
        "api endpoints",
        "http api",
        "build an api",
        "building api"
    ],

    # --------------------------------------------------------
    # Authentication
    # --------------------------------------------------------

    "Authentication": [
        "authentication",
        "authorization",
        "login",
        "sign in",
        "signup",
        "sign up",
        "jwt",
        "json web token",
        "session authentication",
        "user authentication",
        "password authentication"
    ],

    # --------------------------------------------------------
    # Deployment
    # --------------------------------------------------------

    "Deployment": [
        "deploy",
        "deployment",
        "deploying",
        "hosting",
        "host a website",
        "vercel",
        "netlify",
        "render",
        "railway",
        "aws deployment",
        "deployment tutorial"
    ],

    # --------------------------------------------------------
    # Projects
    # --------------------------------------------------------

    "Projects": [
        "project",
        "projects",
        "build an app",
        "build a website",
        "build an application",
        "real world project",
        "real-world project",
        "full stack project",
        "full-stack project"
    ],

    # --------------------------------------------------------
    # Specific subtopics
    # --------------------------------------------------------

    "Animations": [
        "css animation",
        "css animations",
        "animation",
        "animations",
        "keyframes",
        "transition",
        "transitions"
    ],

    "Promises": [
        "promise",
        "promises",
        "async await",
        "async/await"
    ],

    "useEffect": [
        "useeffect",
        "use effect"
    ],

    "CRUD": [
        "crud",
        "create read update delete",
        "create, read, update, delete"
    ]
}


# ============================================================
# FIND CANDIDATES
# ============================================================

audit_rows = []

for category, keywords in AUDIT_RULES.items():

    pattern = "|".join(
        re.escape(keyword)
        for keyword in keywords
    )

    mask = df["search_text"].str.contains(
        pattern,
        case=False,
        regex=True,
        na=False
    )

    matches = df[mask].copy()

    for _, row in matches.iterrows():

        audit_rows.append({
            "audit_category": category,
            "resource_id": row.get("resource_id", ""),
            "title": row.get("title", ""),
            "current_topic": row.get("topic", ""),
            "current_subtopic": row.get("subtopic", ""),
            "current_level": row.get("level", ""),
            "current_language": row.get("language", ""),
            "quality_score": row.get("quality_score", ""),
            "channel": row.get("channel", ""),
            "url": row.get("url", "")
        })


# ============================================================
# CREATE AUDIT DATAFRAME
# ============================================================

audit_df = pd.DataFrame(audit_rows)

if len(audit_df) > 0:

    audit_df = audit_df.drop_duplicates(
        subset=[
            "audit_category",
            "resource_id"
        ]
    )

    audit_df = audit_df.sort_values(
        by=[
            "audit_category",
            "quality_score"
        ],
        ascending=[
            True,
            False
        ]
    )


# ============================================================
# SAVE
# ============================================================

audit_df.to_csv(
    OUTPUT_FILE,
    index=False,
    encoding="utf-8-sig"
)


# ============================================================
# PRINT SUMMARY
# ============================================================

print("\n" + "=" * 70)
print("CURRENT TOPIC COVERAGE")
print("=" * 70)

topic_counts = (
    df["topic"]
    .replace("", pd.NA)
    .value_counts(dropna=False)
)

for topic, count in topic_counts.items():

    topic_name = (
        "EMPTY"
        if pd.isna(topic)
        else str(topic)
    )

    print(f"{topic_name}: {count}")


print("\n" + "=" * 70)
print("AUDIT CANDIDATE COUNTS")
print("=" * 70)

candidate_counts = (
    audit_df["audit_category"]
    .value_counts()
)

for category, count in candidate_counts.items():

    print(f"{category}: {count}")


# ============================================================
# SHOW IMPORTANT CANDIDATES
# ============================================================

IMPORTANT_CATEGORIES = [
    "Frontend Development",
    "Backend Development",
    "REST APIs",
    "Authentication",
    "Deployment",
    "Projects",
    "Animations",
    "Promises",
    "useEffect",
    "CRUD"
]


for category in IMPORTANT_CATEGORIES:

    matches = audit_df[
        audit_df["audit_category"] == category
    ]

    print("\n" + "-" * 70)
    print(f"{category} — {len(matches)} candidates")
    print("-" * 70)

    for _, row in matches.head(10).iterrows():

        print(
            f"\n{row['resource_id']} | "
            f"{row['title']}"
        )

        print(
            f"  Current topic    : {row['current_topic']}"
        )

        print(
            f"  Current subtopic : {row['current_subtopic']}"
        )

        print(
            f"  Level            : {row['current_level']}"
        )

        print(
            f"  Quality          : {row['quality_score']}"
        )


# ============================================================
# FINAL MESSAGE
# ============================================================

print("\n" + "=" * 70)
print("METADATA AUDIT COMPLETE")
print("=" * 70)

print(f"\nSaved to:")
print(OUTPUT_FILE)

print(
    "\nNo resources were modified. "
    "This is an audit-only step."
)