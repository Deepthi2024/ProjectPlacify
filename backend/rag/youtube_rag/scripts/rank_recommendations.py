import os
import pandas as pd


# ============================================================
# CONFIGURATION
# ============================================================

INPUT_FILE = "data/candidate_resources.csv"
OUTPUT_FILE = "data/ranked_recommendations_26.csv"

TOP_N = 26

# Maximum number of recommendations from the same channel
MAX_PER_CHANNEL = 2


# ============================================================
# RANKING WEIGHTS
# ============================================================

WEIGHTS = {
    "topic_match": 0.25,
    "subtopic_match": 0.20,
    "level_match": 0.15,
    "language_match": 0.10,
    "quality_score": 0.15,
    "engagement_score": 0.05,
    "recency_score": 0.05,
    "duration_score": 0.05,
}


# ============================================================
# LOAD CANDIDATES
# ============================================================

def load_candidates():

    if not os.path.exists(INPUT_FILE):

        raise FileNotFoundError(
            f"Candidate file not found: {INPUT_FILE}\n"
            "Run candidate_filter.py first."
        )

    df = pd.read_csv(
        INPUT_FILE,
        dtype=str,
        keep_default_na=False
    )

    # Remove accidental unnamed columns
    unnamed_columns = [
        column
        for column in df.columns
        if column.startswith("Unnamed:")
    ]

    if unnamed_columns:

        df = df.drop(
            columns=unnamed_columns
        )

    print("=" * 60)
    print("PLACIFY RECOMMENDATION RANKING")
    print("=" * 60)

    print()
    print(
        f"Candidates loaded: {len(df)}"
    )

    return df


# ============================================================
# NORMALIZATION
# ============================================================

def normalize(value):

    if value is None:
        return ""

    return str(value).strip().lower()


# ============================================================
# NUMERIC CONVERSION
# ============================================================

def prepare_numeric_columns(df):

    numeric_columns = [
        "quality_score",
        "engagement_score",
        "recency_score",
        "duration_score",
    ]

    for column in numeric_columns:

        if column not in df.columns:

            df[column] = 0

        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        ).fillna(0)

    return df


# ============================================================
# SUBTOPIC MATCH
# ============================================================

def calculate_subtopic_match(
    resource_subtopics,
    requested_subtopic
):

    if not requested_subtopic:

        return 100.0

    requested = normalize(
        requested_subtopic
    )

    subtopics = [
        normalize(x)
        for x in str(
            resource_subtopics
        ).split("|")
        if normalize(x)
    ]

    if not subtopics:

        return 0.0

    # Exact subtopic
    if requested in subtopics:

        # Strong exact match
        return 100.0

    # Partial match
    for subtopic in subtopics:

        if (
            requested in subtopic
            or subtopic in requested
        ):

            return 75.0

    return 0.0


# ============================================================
# TOPIC MATCH
# ============================================================

def calculate_topic_match(
    resource_topic,
    requested_topic
):

    if not requested_topic:

        return 100.0

    if (
        normalize(resource_topic)
        == normalize(requested_topic)
    ):

        return 100.0

    return 0.0


# ============================================================
# LEVEL MATCH
# ============================================================

def calculate_level_match(
    resource_level,
    requested_level
):

    if not requested_level:

        return 100.0

    if (
        normalize(resource_level)
        == normalize(requested_level)
    ):

        return 100.0

    return 0.0


# ============================================================
# LANGUAGE MATCH
# ============================================================

def calculate_language_match(
    resource_language,
    requested_language
):

    if not requested_language:

        return 100.0

    if (
        normalize(resource_language)
        == normalize(requested_language)
    ):

        return 100.0

    return 0.0


# ============================================================
# GET USER REQUIREMENTS
# ============================================================

def get_user_requirements():

    print()
    print(
        "Enter the same requirements used "
        "for Phase 4A."
    )

    topic = input(
        "\nTopic: "
    ).strip()

    subtopic = input(
        "Subtopic: "
    ).strip()

    level = input(
        "Level: "
    ).strip()

    language = input(
        "Language: "
    ).strip()

    return {
        "topic": topic,
        "subtopic": subtopic,
        "level": level,
        "language": language,
    }


# ============================================================
# CALCULATE RECOMMENDATION SCORE
# ============================================================

def calculate_recommendation_score(
    row,
    user_requirements
):

    topic_match = calculate_topic_match(
        row["topic"],
        user_requirements["topic"]
    )

    subtopic_match = calculate_subtopic_match(
        row["subtopic"],
        user_requirements["subtopic"]
    )

    level_match = calculate_level_match(
        row["level"],
        user_requirements["level"]
    )

    language_match = calculate_language_match(
        row["language"],
        user_requirements["language"]
    )

    quality_score = float(
        row["quality_score"]
    )

    engagement_score = float(
        row["engagement_score"]
    )

    recency_score = float(
        row["recency_score"]
    )

    duration_score = float(
        row["duration_score"]
    )

    recommendation_score = (

        topic_match
        * WEIGHTS["topic_match"]

        + subtopic_match
        * WEIGHTS["subtopic_match"]

        + level_match
        * WEIGHTS["level_match"]

        + language_match
        * WEIGHTS["language_match"]

        + quality_score
        * WEIGHTS["quality_score"]

        + engagement_score
        * WEIGHTS["engagement_score"]

        + recency_score
        * WEIGHTS["recency_score"]

        + duration_score
        * WEIGHTS["duration_score"]
    )

    return round(
        recommendation_score,
        2
    )


# ============================================================
# CALCULATE ALL SCORES
# ============================================================

def calculate_scores(
    df,
    user_requirements
):

    print()
    print(
        "Calculating recommendation scores..."
    )

    df["topic_match_score"] = df.apply(
        lambda row:
        calculate_topic_match(
            row["topic"],
            user_requirements["topic"]
        ),
        axis=1
    )

    df["subtopic_match_score"] = df.apply(
        lambda row:
        calculate_subtopic_match(
            row["subtopic"],
            user_requirements["subtopic"]
        ),
        axis=1
    )

    df["level_match_score"] = df.apply(
        lambda row:
        calculate_level_match(
            row["level"],
            user_requirements["level"]
        ),
        axis=1
    )

    df["language_match_score"] = df.apply(
        lambda row:
        calculate_language_match(
            row["language"],
            user_requirements["language"]
        ),
        axis=1
    )

    df["recommendation_score"] = df.apply(
        lambda row:
        calculate_recommendation_score(
            row,
            user_requirements
        ),
        axis=1
    )

    # Highest score first
    df = df.sort_values(
        by="recommendation_score",
        ascending=False
    ).reset_index(
        drop=True
    )

    return df


# ============================================================
# CHANNEL DIVERSITY
# ============================================================

def apply_channel_diversity(
    df
):

    print()
    print(
        "Applying channel diversity..."
    )

    selected_rows = []

    channel_counts = {}

    # First pass:
    # Pick highest-ranked resources while
    # respecting MAX_PER_CHANNEL.

    for _, row in df.iterrows():

        channel = str(
            row.get(
                "channel",
                ""
            )
        ).strip()

        channel_key = normalize(
            channel
        )

        current_count = (
            channel_counts.get(
                channel_key,
                0
            )
        )

        if (
            current_count
            >= MAX_PER_CHANNEL
        ):

            continue

        selected_rows.append(
            row
        )

        channel_counts[
            channel_key
        ] = current_count + 1

        if len(selected_rows) >= TOP_N:

            break

    # --------------------------------------------------------
    # If diversity constraint prevented enough results,
    # fill remaining slots with highest-ranked resources.
    # --------------------------------------------------------

    if len(selected_rows) < TOP_N:

        selected_ids = {
            row["resource_id"]
            for row in selected_rows
        }

        for _, row in df.iterrows():

            resource_id = row[
                "resource_id"
            ]

            if resource_id in selected_ids:

                continue

            selected_rows.append(
                row
            )

            if len(selected_rows) >= TOP_N:

                break

    result = pd.DataFrame(
        selected_rows
    )

    result = result.reset_index(
        drop=True
    )

    return result


# ============================================================
# DISPLAY RESULTS
# ============================================================

def display_recommendations(
    df
):

    print()
    print("=" * 60)
    print("TOP RECOMMENDATIONS")
    print("=" * 60)

    if df.empty:

        print(
            "\nNo recommendations found."
        )

        return

    for position, (_, row) in enumerate(
        df.iterrows(),
        start=1
    ):

        print()
        print(
            f"{position}. "
            f"{row['title']}"
        )

        print(
            f"   Recommendation Score: "
            f"{row['recommendation_score']}"
        )

        print(
            f"   Quality Score: "
            f"{row['quality_score']}"
        )

        print(
            f"   Topic Match: "
            f"{row['topic_match_score']}"
        )

        print(
            f"   Subtopic Match: "
            f"{row['subtopic_match_score']}"
        )

        print(
            f"   Level Match: "
            f"{row['level_match_score']}"
        )

        print(
            f"   Language Match: "
            f"{row['language_match_score']}"
        )

        print(
            f"   Engagement: "
            f"{row['engagement_score']}"
        )

        print(
            f"   Recency: "
            f"{row['recency_score']}"
        )

        print(
            f"   Duration: "
            f"{row['duration_score']}"
        )

        print(
            f"   Channel: "
            f"{row['channel']}"
        )

        print(
            f"   Duration: "
            f"{row['duration_minutes']} minutes"
        )

        print(
            f"   URL: "
            f"{row['url']}"
        )

        print(
            "-" * 60
        )


# ============================================================
# SAVE RESULTS
# ============================================================

def save_results(
    df
):

    df.to_csv(
        OUTPUT_FILE,
        index=False
    )

    print()
    print(
        f"Ranked recommendations saved to:"
    )

    print(
        OUTPUT_FILE
    )


# ============================================================
# MAIN
# ============================================================

def main():

    # --------------------------------------------------------
    # Load
    # --------------------------------------------------------

    df = load_candidates()

    if df.empty:

        print(
            "No candidates available."
        )

        return

    # --------------------------------------------------------
    # Prepare
    # --------------------------------------------------------

    df = prepare_numeric_columns(
        df
    )

    # --------------------------------------------------------
    # User requirements
    # --------------------------------------------------------

    user_requirements = (
        get_user_requirements()
    )

    # --------------------------------------------------------
    # Calculate ranking
    # --------------------------------------------------------

    df = calculate_scores(
        df,
        user_requirements
    )

    # --------------------------------------------------------
    # Apply diversity
    # --------------------------------------------------------

    recommendations = (
        apply_channel_diversity(
            df
        )
    )

    # --------------------------------------------------------
    # Display
    # --------------------------------------------------------

    display_recommendations(
        recommendations
    )

    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    save_results(
        recommendations
    )

    # --------------------------------------------------------
    # Summary
    # --------------------------------------------------------

    print()
    print("=" * 60)
    print("PHASE 4B COMPLETE")
    print("=" * 60)

    print(
        f"Candidates evaluated: "
        f"{len(df)}"
    )

    print(
        f"Recommendations returned: "
        f"{len(recommendations)}"
    )


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":

    main()