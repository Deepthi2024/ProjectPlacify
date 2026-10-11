import pandas as pd
from pathlib import Path

INPUT_FILE = Path("data/diverse_recommendations.csv")
PROFILE_FILE = Path("data/user_profile.csv")
INTERACTIONS_FILE = Path("data/user_interactions.csv")
OUTPUT_FILE = Path("data/personalized_recommendations.csv")

USER_ID = "U001"
TOP_K = 10

BASE_WEIGHT = 0.70
LANGUAGE_WEIGHT = 0.10
LEVEL_WEIGHT = 0.10
DURATION_WEIGHT = 0.05
TYPE_WEIGHT = 0.05


def preference_match(value, preferred):
    if not preferred or str(preferred).strip().lower() in {"unknown", "any", "nan"}:
        return 0.5

    return 1.0 if str(value).strip().lower() == str(preferred).strip().lower() else 0.0


def duration_match(bucket, preferred):
    if not preferred or str(preferred).lower() in {"unknown", "any", "nan"}:
        return 0.5

    preferred = str(preferred).lower()

    mapping = {
        "short": {"5-15 min"},
        "medium": {"15-30 min", "30-60 min"},
        "long": {"60+ min"},
    }

    return 1.0 if bucket in mapping.get(preferred, {preferred}) else 0.0


def build_history_scores(interactions):
    """
    Convert historical interactions into user-resource signals.

    Positive:
      completed = +1.0
      liked     = +0.8
      saved     = +0.7
      viewed    = +0.2

    Negative:
      skipped   = -0.5
      disliked  = -0.8
    """
    weights = {
        "completed": 1.0,
        "liked": 0.8,
        "saved": 0.7,
        "viewed": 0.2,
        "skipped": -0.5,
        "disliked": -0.8,
    }

    if interactions.empty:
        return {}

    interactions = interactions.copy()
    interactions["interaction"] = (
        interactions["interaction"]
        .fillna("")
        .astype(str)
        .str.lower()
    )

    interactions["signal"] = interactions["interaction"].map(weights).fillna(0)

    return (
        interactions.groupby("resource_id")["signal"]
        .sum()
        .to_dict()
    )


def main():
    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Missing {INPUT_FILE}. Run 4C first."
        )

    if not PROFILE_FILE.exists():
        raise FileNotFoundError(
            f"Missing {PROFILE_FILE}."
        )

    candidates = pd.read_csv(INPUT_FILE)
    profile_df = pd.read_csv(PROFILE_FILE)

    if profile_df.empty:
        raise ValueError("user_profile.csv is empty.")

    user_rows = profile_df[
        profile_df["user_id"].astype(str) == USER_ID
    ]

    if user_rows.empty:
        raise ValueError(
            f"No profile found for user {USER_ID}."
        )

    profile = user_rows.iloc[0]

    if INTERACTIONS_FILE.exists():
        interactions = pd.read_csv(INTERACTIONS_FILE)
        interactions = interactions[
            interactions["user_id"].astype(str) == USER_ID
        ]
    else:
        interactions = pd.DataFrame()

    required = [
        "resource_id",
        "recommendation_score",
        "resource_type",
        "duration_bucket",
        "language",
        "level",
    ]

    missing = [c for c in required if c not in candidates.columns]

    if missing:
        raise ValueError(
            f"Missing columns from 4C output: {missing}"
        )

    # Normalize base recommendation score.
    candidates["recommendation_score"] = pd.to_numeric(
        candidates["recommendation_score"], errors="coerce"
    )

    min_score = candidates["recommendation_score"].min()
    max_score = candidates["recommendation_score"].max()

    if max_score == min_score:
        candidates["base_score_normalized"] = 1.0
    else:
        candidates["base_score_normalized"] = (
            (candidates["recommendation_score"] - min_score)
            / (max_score - min_score)
        )

    # User preference signals.
    candidates["language_match"] = candidates["language"].apply(
        lambda x: preference_match(
            x, profile.get("preferred_language", "")
        )
    )

    candidates["level_match"] = candidates["level"].apply(
        lambda x: preference_match(
            x, profile.get("preferred_level", "")
        )
    )

    candidates["duration_match"] = candidates["duration_bucket"].apply(
        lambda x: duration_match(
            x, profile.get("preferred_duration", "")
        )
    )

    candidates["type_match"] = candidates["resource_type"].apply(
        lambda x: preference_match(
            x, profile.get("preferred_resource_type", "")
        )
    )

    # Historical resource-level signals.
    history_scores = build_history_scores(interactions)

    candidates["history_signal"] = candidates["resource_id"].map(
        history_scores
    ).fillna(0.0)

    # Keep history as a small adjustment so it cannot overwhelm
    # content relevance for the initial version.
    candidates["history_adjustment"] = (
        candidates["history_signal"].clip(-1, 1) * 0.05
    )

    candidates["personalized_score"] = (
        BASE_WEIGHT * candidates["base_score_normalized"]
        + LANGUAGE_WEIGHT * candidates["language_match"]
        + LEVEL_WEIGHT * candidates["level_match"]
        + DURATION_WEIGHT * candidates["duration_match"]
        + TYPE_WEIGHT * candidates["type_match"]
        + candidates["history_adjustment"]
    )

    # Avoid recommending resources explicitly disliked/skipped heavily.
    candidates["eligible"] = candidates["history_signal"] > -0.8

    result = (
        candidates[candidates["eligible"]]
        .sort_values(
            ["personalized_score", "recommendation_score"],
            ascending=False
        )
        .head(TOP_K)
        .copy()
    )

    result.insert(
        0,
        "personalized_rank",
        range(1, len(result) + 1)
    )

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    result.to_csv(OUTPUT_FILE, index=False)

    print("=" * 60)
    print("4D - PERSONALIZED RECOMMENDATIONS")
    print("=" * 60)
    print(f"User: {USER_ID}")
    print(f"Candidate pool: {len(candidates)}")
    print(f"Historical interactions: {len(interactions)}")
    print(f"Recommendations: {len(result)}")

    display_columns = [
        "personalized_rank",
        "title",
        "channel",
        "resource_type",
        "duration_bucket",
        "language",
        "level",
        "recommendation_score",
        "personalized_score",
    ]

    print("\nRecommendations:")
    print(result[display_columns].to_string(index=False))

    print(f"\nSaved to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()