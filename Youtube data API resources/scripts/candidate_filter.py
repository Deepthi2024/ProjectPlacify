import os
import pandas as pd


# ============================================================
# CONFIGURATION
# ============================================================

INPUT_FILE = "data/resources_final.csv"

# Number of candidates to display
MAX_RESULTS = 50


# ============================================================
# LOAD DATASET
# ============================================================

def load_resources():

    if not os.path.exists(INPUT_FILE):
        raise FileNotFoundError(
            f"Dataset not found: {INPUT_FILE}"
        )

    df = pd.read_csv(
        INPUT_FILE,
        dtype=str,
        keep_default_na=False
    )

    # Remove accidental unnamed columns
    unnamed_columns = [
        col for col in df.columns
        if col.startswith("Unnamed:")
    ]

    if unnamed_columns:
        df = df.drop(
            columns=unnamed_columns
        )

    print(
        f"\nLoaded {len(df)} resources."
    )

    return df


# ============================================================
# NORMALIZATION
# ============================================================

def normalize(value):

    if value is None:
        return ""

    return str(value).strip().lower()


def subtopic_matches(resource_subtopics, requested_subtopic):

    if not requested_subtopic:
        return True

    requested = normalize(
        requested_subtopic
    )

    # A resource can have multiple subtopics
    # separated by "|"
    subtopics = [
        normalize(x)
        for x in str(resource_subtopics).split("|")
    ]

    return requested in subtopics


# ============================================================
# USER INPUT
# ============================================================

def get_user_profile():

    print()
    print("=" * 60)
    print("PLACIFY CANDIDATE FILTER")
    print("=" * 60)

    print()
    print("Enter the user's learning requirements.")
    print("Press Enter to skip an optional field.")

    domain = input(
        "\nDomain: "
    ).strip()

    topic = input(
        "Topic: "
    ).strip()

    subtopic = input(
        "Subtopic: "
    ).strip()

    level = input(
        "Level (Beginner/Intermediate/Advanced): "
    ).strip()

    language = input(
        "Language (English/Hindi): "
    ).strip()

    return {
        "domain": domain,
        "topic": topic,
        "subtopic": subtopic,
        "level": level,
        "language": language,
    }


# ============================================================
# DOMAIN FILTER
# ============================================================

def filter_domain(df, domain):

    if not domain:
        return df

    mask = (
        df["domain"].apply(normalize)
        == normalize(domain)
    )

    return df[mask].copy()


# ============================================================
# TOPIC FILTER
# ============================================================

def filter_topic(df, topic):

    if not topic:
        return df

    mask = (
        df["topic"].apply(normalize)
        == normalize(topic)
    )

    return df[mask].copy()


# ============================================================
# SUBTOPIC FILTER
# ============================================================

def filter_subtopic(df, subtopic):

    if not subtopic:
        return df

    mask = df["subtopic"].apply(
        lambda value:
        subtopic_matches(
            value,
            subtopic
        )
    )

    return df[mask].copy()


# ============================================================
# LEVEL FILTER
# ============================================================

def filter_level(df, level):

    if not level:
        return df

    mask = (
        df["level"].apply(normalize)
        == normalize(level)
    )

    return df[mask].copy()


# ============================================================
# LANGUAGE FILTER
# ============================================================

def filter_language(df, language):

    if not language:
        return df

    mask = (
        df["language"].apply(normalize)
        == normalize(language)
    )

    return df[mask].copy()


# ============================================================
# CANDIDATE FILTERING
# ============================================================

def get_candidates(
    df,
    user_profile
):

    candidates = df.copy()

    print()
    print("=" * 60)
    print("FILTERING CANDIDATES")
    print("=" * 60)

    # --------------------------------------------------------
    # Domain
    # --------------------------------------------------------

    before = len(candidates)

    candidates = filter_domain(
        candidates,
        user_profile["domain"]
    )

    print(
        f"Domain filter: "
        f"{before} -> {len(candidates)}"
    )

    # --------------------------------------------------------
    # Topic
    # --------------------------------------------------------

    before = len(candidates)

    candidates = filter_topic(
        candidates,
        user_profile["topic"]
    )

    print(
        f"Topic filter: "
        f"{before} -> {len(candidates)}"
    )

    # --------------------------------------------------------
    # Subtopic
    # --------------------------------------------------------

    before = len(candidates)

    candidates = filter_subtopic(
        candidates,
        user_profile["subtopic"]
    )

    print(
        f"Subtopic filter: "
        f"{before} -> {len(candidates)}"
    )

    # --------------------------------------------------------
    # Level
    # --------------------------------------------------------

    before = len(candidates)

    candidates = filter_level(
        candidates,
        user_profile["level"]
    )

    print(
        f"Level filter: "
        f"{before} -> {len(candidates)}"
    )

    # --------------------------------------------------------
    # Language
    # --------------------------------------------------------

    before = len(candidates)

    candidates = filter_language(
        candidates,
        user_profile["language"]
    )

    print(
        f"Language filter: "
        f"{before} -> {len(candidates)}"
    )

    return candidates


# ============================================================
# DISPLAY RESULTS
# ============================================================

def display_candidates(
    candidates
):

    print()
    print("=" * 60)
    print("CANDIDATE RESOURCES")
    print("=" * 60)

    if candidates.empty:

        print()
        print(
            "No resources matched "
            "the specified requirements."
        )

        return

    print()
    print(
        f"Total candidates: "
        f"{len(candidates)}"
    )

    print()

    display_count = min(
        len(candidates),
        MAX_RESULTS
    )

    for position, (_, row) in enumerate(
        candidates.head(display_count).iterrows(),
        start=1
    ):

        print(
            f"{position}. "
            f"{row.get('title', '')}"
        )

        print(
            f"   Resource ID: "
            f"{row.get('resource_id', '')}"
        )

        print(
            f"   Topic: "
            f"{row.get('topic', '')}"
        )

        print(
            f"   Subtopic: "
            f"{row.get('subtopic', '')}"
        )

        print(
            f"   Level: "
            f"{row.get('level', '')}"
        )

        print(
            f"   Language: "
            f"{row.get('language', '')}"
        )

        print(
            f"   Duration: "
            f"{row.get('duration_minutes', '')} minutes"
        )

        print(
            f"   Quality Score: "
            f"{row.get('quality_score', '')}"
        )

        print(
            f"   Channel: "
            f"{row.get('channel', '')}"
        )

        print(
            f"   URL: "
            f"{row.get('url', '')}"
        )

        print("-" * 60)


# ============================================================
# SAVE CANDIDATES
# ============================================================

def save_candidates(
    candidates
):

    if candidates.empty:
        return

    output_file = (
        "data/candidate_resources.csv"
    )

    candidates.to_csv(
        output_file,
        index=False
    )

    print()
    print(
        f"Candidates saved to: "
        f"{output_file}"
    )


# ============================================================
# MAIN
# ============================================================

def main():

    # --------------------------------------------------------
    # Load resources
    # --------------------------------------------------------

    df = load_resources()

    # --------------------------------------------------------
    # Get user requirements
    # --------------------------------------------------------

    user_profile = get_user_profile()

    # --------------------------------------------------------
    # Filter
    # --------------------------------------------------------

    candidates = get_candidates(
        df,
        user_profile
    )

    # --------------------------------------------------------
    # Display
    # --------------------------------------------------------

    display_candidates(
        candidates
    )

    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    save_candidates(
        candidates
    )

    print()
    print("=" * 60)
    print("PHASE 4A COMPLETE")
    print("=" * 60)


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    main()