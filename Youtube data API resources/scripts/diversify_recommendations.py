import pandas as pd
import re
from pathlib import Path


# ============================================================
# CONFIGURATION
# ============================================================

INPUT_FILE = Path("data/ranked_recommendations_26.csv")
OUTPUT_FILE = Path("data/diverse_recommendations.csv")

TOP_K = 10

# Maximum resources from one channel
MAX_PER_CHANNEL = 2

# Weight given to the original recommendation score
SCORE_WEIGHT = 0.85

# Weight given to diversity
DIVERSITY_WEIGHT = 0.15


# ============================================================
# RESOURCE TYPE CLASSIFICATION
# ============================================================

def classify_resource_type(row):
    """
    Deterministically classify a resource using title,
    description and tags.
    """

    title = str(row.get("title", "")).lower()
    description = str(row.get("description", "")).lower()
    tags = str(row.get("tags", "")).lower()

    text = f"{title} {description} {tags}"

    # Project-related resources
    project_patterns = [
        r"\bproject\b",
        r"\bbuild\b",
        r"\bbuilding\b",
        r"\bclone\b",
        r"\bportfolio\b",
        r"\bapplication\b",
        r"\bapp\b",
        r"\bwebsite\b",
    ]

    # Practice-related resources
    practice_patterns = [
        r"\bpractice\b",
        r"\bexercise\b",
        r"\bchallenge\b",
        r"\bcoding challenge\b",
        r"\bproblem\b",
        r"\bquiz\b",
    ]

    # Concept/explanation resources
    concept_patterns = [
        r"\bexplained\b",
        r"\bexplanation\b",
        r"\bwhat is\b",
        r"\bunderstand\b",
        r"\bconcept\b",
        r"\bconcepts\b",
        r"\bdeep dive\b",
        r"\bhow .* works\b",
    ]

    # Course/full-course resources
    course_patterns = [
        r"\bfull course\b",
        r"\bcomplete course\b",
        r"\bcomplete tutorial\b",
        r"\bcrash course\b",
        r"\bmasterclass\b",
        r"\bcourse\b",
    ]

    # Tutorial resources
    tutorial_patterns = [
        r"\btutorial\b",
        r"\bguide\b",
        r"\bfor beginners\b",
        r"\bbeginners\b",
        r"\bstep by step\b",
        r"\bfrom scratch\b",
    ]

    def matches(patterns):
        return any(re.search(pattern, text) for pattern in patterns)

    # Priority matters because some resources can match
    # multiple categories.

    if matches(project_patterns):
        return "Project"

    if matches(practice_patterns):
        return "Practice"

    if matches(concept_patterns):
        return "Concept"

    if matches(course_patterns):
        return "Course"

    if matches(tutorial_patterns):
        return "Tutorial"

    return "Other"


# ============================================================
# DURATION BUCKET
# ============================================================

def duration_bucket(minutes):
    """
    Group resources by duration.
    """

    try:
        minutes = float(minutes)
    except (ValueError, TypeError):
        return "Unknown"

    if minutes < 15:
        return "5-15 min"

    if minutes < 30:
        return "15-30 min"

    if minutes < 60:
        return "30-60 min"

    return "60+ min"


# ============================================================
# DIVERSITY CALCULATION
# ============================================================

def calculate_diversity_score(row, selected):
    """
    Calculate how different the candidate is from already
    selected recommendations.

    Higher score = more diverse.
    """

    if not selected:
        return 1.0

    score = 0.0

    # --------------------------------------------------------
    # Resource type diversity
    # --------------------------------------------------------

    selected_types = [x["resource_type"] for x in selected]

    if row["resource_type"] not in selected_types:
        score += 0.40
    else:
        # Still allow the same type, but with lower diversity
        score += 0.05

    # --------------------------------------------------------
    # Duration diversity
    # --------------------------------------------------------

    selected_durations = [x["duration_bucket"] for x in selected]

    if row["duration_bucket"] not in selected_durations:
        score += 0.30
    else:
        score += 0.05

    # --------------------------------------------------------
    # Channel diversity
    # --------------------------------------------------------

    selected_channels = [x["channel"] for x in selected]

    if row["channel"] not in selected_channels:
        score += 0.20
    else:
        score += 0.02

    # --------------------------------------------------------
    # Title similarity
    # --------------------------------------------------------

    title = str(row["title"]).lower()

    similar_title_count = 0

    for item in selected:
        previous_title = str(item["title"]).lower()

        # Basic word overlap
        current_words = set(re.findall(r"\b[a-zA-Z]{4,}\b", title))
        previous_words = set(
            re.findall(r"\b[a-zA-Z]{4,}\b", previous_title)
        )

        if current_words and previous_words:
            overlap = len(current_words & previous_words) / len(
                current_words | previous_words
            )

            if overlap >= 0.60:
                similar_title_count += 1

    if similar_title_count == 0:
        score += 0.10

    return min(score, 1.0)


# ============================================================
# MAIN
# ============================================================

def main():

    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Input file not found: {INPUT_FILE}"
        )

    print("=" * 60)
    print("4C - DIVERSITY-AWARE RECOMMENDATION")
    print("=" * 60)

    # --------------------------------------------------------
    # Load candidate pool
    # --------------------------------------------------------

    df = pd.read_csv(INPUT_FILE)

    print(f"\nCandidate resources loaded: {len(df)}")

    if df.empty:
        print("No candidates available.")
        return

    # --------------------------------------------------------
    # Validate required columns
    # --------------------------------------------------------

    required_columns = [
        "resource_id",
        "title",
        "channel",
        "url",
        "duration_minutes",
        "recommendation_score",
    ]

    missing = [
        col for col in required_columns
        if col not in df.columns
    ]

    if missing:
        raise ValueError(
            f"Missing required columns: {missing}"
        )

    # --------------------------------------------------------
    # Clean values
    # --------------------------------------------------------

    df["recommendation_score"] = pd.to_numeric(
        df["recommendation_score"],
        errors="coerce"
    )

    df["duration_minutes"] = pd.to_numeric(
        df["duration_minutes"],
        errors="coerce"
    )

    df["channel"] = (
        df["channel"]
        .fillna("Unknown Channel")
        .astype(str)
    )

    df["title"] = (
        df["title"]
        .fillna("")
        .astype(str)
    )

    df = df.dropna(
        subset=["recommendation_score"]
    ).copy()

    # --------------------------------------------------------
    # Classify resources
    # --------------------------------------------------------

    df["resource_type"] = df.apply(
        classify_resource_type,
        axis=1
    )

    df["duration_bucket"] = df[
        "duration_minutes"
    ].apply(duration_bucket)

    # --------------------------------------------------------
    # Sort by original recommendation score
    # --------------------------------------------------------

    df = df.sort_values(
        "recommendation_score",
        ascending=False
    ).reset_index(drop=True)

    # --------------------------------------------------------
    # Normalize recommendation score
    # --------------------------------------------------------

    min_score = df["recommendation_score"].min()
    max_score = df["recommendation_score"].max()

    if max_score == min_score:
        df["normalized_score"] = 1.0
    else:
        df["normalized_score"] = (
            (df["recommendation_score"] - min_score)
            / (max_score - min_score)
        )

    # --------------------------------------------------------
    # Greedy diversity-aware selection
    # --------------------------------------------------------

    selected = []
    selected_ids = set()

    channel_counts = {}

    for _ in range(TOP_K):

        best_candidate = None
        best_final_score = float("-inf")

        for _, row in df.iterrows():

            resource_id = row["resource_id"]

            if resource_id in selected_ids:
                continue

            channel = row["channel"]

            # Hard channel constraint
            if channel_counts.get(channel, 0) >= MAX_PER_CHANNEL:
                continue

            diversity_score = calculate_diversity_score(
                row,
                selected
            )

            final_score = (
                SCORE_WEIGHT * row["normalized_score"]
                + DIVERSITY_WEIGHT * diversity_score
            )

            if final_score > best_final_score:
                best_final_score = final_score
                best_candidate = row

        if best_candidate is None:
            break

        # Add candidate
        candidate = best_candidate.to_dict()

        candidate["diversity_score"] = round(
            calculate_diversity_score(
                best_candidate,
                selected
            ),
            4
        )

        candidate["diversity_adjusted_score"] = round(
            best_final_score,
            4
        )

        selected.append(candidate)

        selected_ids.add(
            best_candidate["resource_id"]
        )

        channel = best_candidate["channel"]

        channel_counts[channel] = (
            channel_counts.get(channel, 0) + 1
        )

    # --------------------------------------------------------
    # Create final dataframe
    # --------------------------------------------------------

    result = pd.DataFrame(selected)

    if result.empty:
        print("\nNo recommendations selected.")
        return

    # Recommendation rank
    result.insert(
        0,
        "recommendation_rank",
        range(1, len(result) + 1)
    )

    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    result.to_csv(
        OUTPUT_FILE,
        index=False
    )

    # --------------------------------------------------------
    # Display results
    # --------------------------------------------------------

    print("\n" + "=" * 60)
    print("4C RESULTS")
    print("=" * 60)

    display_columns = [
        "recommendation_rank",
        "title",
        "channel",
        "resource_type",
        "duration_bucket",
        "recommendation_score",
        "diversity_score",
        "diversity_adjusted_score",
    ]

    print(
        result[display_columns].to_string(
            index=False
        )
    )

    # --------------------------------------------------------
    # Diversity summary
    # --------------------------------------------------------

    print("\n" + "=" * 60)
    print("DIVERSITY SUMMARY")
    print("=" * 60)

    print("\nResource types:")
    print(
        result["resource_type"]
        .value_counts()
        .to_string()
    )

    print("\nDuration buckets:")
    print(
        result["duration_bucket"]
        .value_counts()
        .to_string()
    )

    print("\nChannels:")
    print(
        result["channel"]
        .value_counts()
        .to_string()
    )

    print(
        f"\nSaved to: {OUTPUT_FILE}"
    )


if __name__ == "__main__":
    main()