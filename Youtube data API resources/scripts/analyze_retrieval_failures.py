from pathlib import Path
import pandas as pd
import ast

# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

EVAL_FILE = BASE_DIR / "data" / "retrieval_evaluation_results.csv"
OUTPUT_FILE = BASE_DIR / "data" / "retrieval_failure_analysis.csv"


# ============================================================
# LOAD RESULTS
# ============================================================

if not EVAL_FILE.exists():
    raise FileNotFoundError(
        f"Evaluation results not found:\n{EVAL_FILE}\n\n"
        "Run evaluate_retrieval.py first."
    )

df = pd.read_csv(EVAL_FILE)

print("=" * 70)
print("PLACIFY - RETRIEVAL FAILURE ANALYSIS")
print("=" * 70)

print(f"\nLoaded evaluation results: {len(df)} queries")


# ============================================================
# CHECK REQUIRED COLUMNS
# ============================================================

required_columns = [
    "query",
    "expected_topic",
    "expected_subtopic",
    "expected_level",
    "expected_language",
    "expected_intent",
    "topic_hit_at_5",
    "subtopic_hit_at_5",
    "level_hit_at_5",
    "language_hit_at_5",
    "intent_hit_at_5",
    "cross_topic_success",
    "top_5_resource_ids",
    "top_5_titles",
    "top_5_topics",
    "top_5_levels",
    "top_5_languages"
]

missing_columns = [
    col for col in required_columns
    if col not in df.columns
]

if missing_columns:
    raise ValueError(
        "The following required columns are missing:\n"
        + "\n".join(missing_columns)
    )


# ============================================================
# FIND FAILED QUERIES
# ============================================================

failure_columns = [
    "topic_hit_at_5",
    "subtopic_hit_at_5",
    "level_hit_at_5",
    "language_hit_at_5",
    "intent_hit_at_5"
]

for col in failure_columns:
    df[col] = (
        df[col]
        .astype(str)
        .str.strip()
        .str.lower()
        .isin(["true", "1", "yes", "pass"])
    )


failed = df[
    ~df[failure_columns].all(axis=1)
].copy()

print(f"Failed queries found: {len(failed)}")


# ============================================================
# HELPER FUNCTION
# ============================================================

def parse_list(value):
    """
    Convert CSV list representation back into Python list.
    Handles strings such as:
        ['A', 'B', 'C']
    """

    if pd.isna(value):
        return []

    value = str(value).strip()

    try:
        parsed = ast.literal_eval(value)

        if isinstance(parsed, list):
            return parsed

    except Exception:
        pass

    # Fallback
    return [
        item.strip()
        for item in value.split("|")
        if item.strip()
    ]


# ============================================================
# ANALYZE EACH FAILURE
# ============================================================

analysis_rows = []

for _, row in failed.iterrows():

    query = row["query"]

    expected_topic = row["expected_topic"]
    expected_subtopic = row["expected_subtopic"]
    expected_level = row["expected_level"]
    expected_language = row["expected_language"]
    expected_intent = row["expected_intent"]

    topic_hit = row["topic_hit_at_5"]
    subtopic_hit = row["subtopic_hit_at_5"]
    level_hit = row["level_hit_at_5"]
    language_hit = row["language_hit_at_5"]
    intent_hit = row["intent_hit_at_5"]

    # --------------------------------------------------------
    # Parse Top-5 results
    # --------------------------------------------------------

    resource_ids = parse_list(row["top_5_resource_ids"])
    titles = parse_list(row["top_5_titles"])
    topics = parse_list(row["top_5_topics"])
    levels = parse_list(row["top_5_levels"])
    languages = parse_list(row["top_5_languages"])

    # Make sure all lists have 5 positions
    max_len = max(
        len(resource_ids),
        len(titles),
        len(topics),
        len(levels),
        len(languages),
        5
    )

    resource_ids += [""] * (max_len - len(resource_ids))
    titles += [""] * (max_len - len(titles))
    topics += [""] * (max_len - len(topics))
    levels += [""] * (max_len - len(levels))
    languages += [""] * (max_len - len(languages))

    # --------------------------------------------------------
    # Determine failure type
    # --------------------------------------------------------

    failures = []

    if not topic_hit:
        failures.append("Topic")

    if not subtopic_hit:
        failures.append("Subtopic")

    if not level_hit:
        failures.append("Level")

    if not language_hit:
        failures.append("Language")

    if not intent_hit:
        failures.append("Intent")

    failure_type = " + ".join(failures) + " Failure"

    # --------------------------------------------------------
    # Preliminary classification
    # --------------------------------------------------------

    if not topic_hit and not subtopic_hit:
        preliminary_classification = (
            "Needs Top-5 Inspection"
        )

    elif not topic_hit:
        preliminary_classification = (
            "Possible Dataset Coverage / Taxonomy Problem"
        )

    elif not subtopic_hit:
        preliminary_classification = (
            "Possible Subtopic Matching / Metadata Problem"
        )

    else:
        preliminary_classification = (
            "Needs Inspection"
        )

    # --------------------------------------------------------
    # Create one row containing Top-5 information
    # --------------------------------------------------------

    analysis_rows.append({
        "query": query,

        "expected_topic": expected_topic,
        "expected_subtopic": expected_subtopic,
        "expected_level": expected_level,
        "expected_language": expected_language,
        "expected_intent": expected_intent,

        "topic_hit_at_5": topic_hit,
        "subtopic_hit_at_5": subtopic_hit,
        "level_hit_at_5": level_hit,
        "language_hit_at_5": language_hit,
        "intent_hit_at_5": intent_hit,

        "failure_type": failure_type,
        "preliminary_classification": preliminary_classification,

        "top_1_title": titles[0],
        "top_1_topic": topics[0],
        "top_1_level": levels[0],
        "top_1_language": languages[0],

        "top_2_title": titles[1],
        "top_2_topic": topics[1],
        "top_2_level": levels[1],
        "top_2_language": languages[1],

        "top_3_title": titles[2],
        "top_3_topic": topics[2],
        "top_3_level": levels[2],
        "top_3_language": languages[2],

        "top_4_title": titles[3],
        "top_4_topic": topics[3],
        "top_4_level": levels[3],
        "top_4_language": languages[3],

        "top_5_title": titles[4],
        "top_5_topic": topics[4],
        "top_5_level": levels[4],
        "top_5_language": languages[4]
    })


# ============================================================
# CREATE DATAFRAME
# ============================================================

analysis_df = pd.DataFrame(analysis_rows)


# ============================================================
# SAVE
# ============================================================

analysis_df.to_csv(
    OUTPUT_FILE,
    index=False,
    encoding="utf-8-sig"
)


# ============================================================
# PRINT FAILED QUERY DETAILS
# ============================================================

print("\n" + "=" * 70)
print("FAILED QUERY DETAILS")
print("=" * 70)

for i, row in analysis_df.iterrows():

    print(f"\n{'-' * 70}")
    print(f"{i + 1}. {row['query']}")

    print(f"Expected topic    : {row['expected_topic']}")

    if str(row["expected_subtopic"]).strip():
        print(f"Expected subtopic : {row['expected_subtopic']}")

    if str(row["expected_level"]).strip():
        print(f"Expected level    : {row['expected_level']}")

    if str(row["expected_language"]).strip():
        print(f"Expected language : {row['expected_language']}")

    print(f"Failure           : {row['failure_type']}")
    print(f"Initial analysis  : {row['preliminary_classification']}")

    print("\nTop 5 retrieved:")

    for rank in range(1, 6):

        title = row[f"top_{rank}_title"]
        topic = row[f"top_{rank}_topic"]
        level = row[f"top_{rank}_level"]
        language = row[f"top_{rank}_language"]

        print(
            f"  {rank}. {title}\n"
            f"     Topic: {topic} | "
            f"Level: {level} | "
            f"Language: {language}"
        )


# ============================================================
# FAILURE COUNTS
# ============================================================

print("\n" + "=" * 70)
print("FAILURE TYPE COUNTS")
print("=" * 70)

counts = analysis_df["failure_type"].value_counts()

for failure_type, count in counts.items():
    print(f"{failure_type}: {count}")


# ============================================================
# SAVE MESSAGE
# ============================================================

print("\n" + "=" * 70)
print("ANALYSIS COMPLETE")
print("=" * 70)

print(f"\nSaved to:")
print(OUTPUT_FILE)

print(
    "\nNow we can inspect whether each failure is caused by "
    "retrieval, dataset coverage, evaluation, or taxonomy."
)