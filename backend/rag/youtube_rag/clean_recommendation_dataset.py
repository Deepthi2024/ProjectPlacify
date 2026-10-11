import os
import pandas as pd


# ============================================================
# CONFIGURATION
# ============================================================

INPUT_FILE = "data/resources_scored.csv"
OUTPUT_FILE = "data/resources_final.csv"

ALLOWED_LANGUAGES = [
    "English",
    "Hindi"
]

MIN_DURATION = 5


# ============================================================
# LOAD DATA
# ============================================================

def load_data():

    print("=" * 60)
    print("PLACIFY RECOMMENDATION DATASET CLEANING")
    print("=" * 60)

    if not os.path.exists(INPUT_FILE):

        raise FileNotFoundError(
            f"Input file not found: {INPUT_FILE}"
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

        print(
            f"Removing accidental columns: "
            f"{unnamed_columns}"
        )

        df = df.drop(
            columns=unnamed_columns
        )

    print()
    print(
        f"Original resources: {len(df)}"
    )

    return df


# ============================================================
# PREPARE DATA
# ============================================================

def prepare_data(df):

    # Convert duration to numeric
    df["duration_minutes"] = pd.to_numeric(
        df["duration_minutes"],
        errors="coerce"
    )

    # Normalize language and status
    df["language"] = (
        df["language"]
        .astype(str)
        .str.strip()
    )

    df["status"] = (
        df["status"]
        .astype(str)
        .str.strip()
        .str.lower()
    )

    return df


# ============================================================
# VALIDATE REQUIRED COLUMNS
# ============================================================

def validate_columns(df):

    required_columns = [
        "resource_id",
        "title",
        "url",
        "duration_minutes",
        "language",
        "status",
        "quality_score",
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:

        raise ValueError(
            "Missing required columns: "
            + ", ".join(missing_columns)
        )


# ============================================================
# CLEAN DATASET
# ============================================================

def clean_dataset(df):

    print()
    print("=" * 60)
    print("APPLYING CLEANING RULES")
    print("=" * 60)

    original_count = len(df)

    # --------------------------------------------------------
    # Rule 1: Duration >= 5 minutes
    # --------------------------------------------------------

    duration_mask = (
        df["duration_minutes"] >= MIN_DURATION
    )

    removed_duration = (
        ~duration_mask
    ).sum()

    print()
    print(
        f"Removing videos below "
        f"{MIN_DURATION} minutes: "
        f"{removed_duration}"
    )

    df = df[duration_mask].copy()

    # --------------------------------------------------------
    # Rule 2: Remove rejected resources
    # --------------------------------------------------------

    status_mask = (
        df["status"] != "rejected"
    )

    removed_rejected = (
        ~status_mask
    ).sum()

    print(
        f"Removing rejected resources: "
        f"{removed_rejected}"
    )

    df = df[status_mask].copy()

    # --------------------------------------------------------
    # Rule 3: Keep only English and Hindi
    # --------------------------------------------------------

    language_mask = (
        df["language"].isin(
            ALLOWED_LANGUAGES
        )
    )

    removed_language = (
        ~language_mask
    ).sum()

    print(
        f"Removing non-English/Hindi resources: "
        f"{removed_language}"
    )

    df = df[language_mask].copy()

    # --------------------------------------------------------
    # Remove duplicate resource IDs
    # --------------------------------------------------------

    duplicate_mask = (
        df["resource_id"].duplicated(
            keep="first"
        )
    )

    removed_duplicates = (
        duplicate_mask
    ).sum()

    if removed_duplicates > 0:

        print(
            f"Removing duplicate resources: "
            f"{removed_duplicates}"
        )

        df = df[
            ~duplicate_mask
        ].copy()

    # --------------------------------------------------------
    # Remove duplicate URLs
    # --------------------------------------------------------

    duplicate_url_mask = (
        df["url"].duplicated(
            keep="first"
        )
        &
        df["url"].astype(str).str.strip().ne("")
    )

    removed_duplicate_urls = (
        duplicate_url_mask
    ).sum()

    if removed_duplicate_urls > 0:

        print(
            f"Removing duplicate URLs: "
            f"{removed_duplicate_urls}"
        )

        df = df[
            ~duplicate_url_mask
        ].copy()

    # --------------------------------------------------------
    # Reset index
    # --------------------------------------------------------

    df = df.reset_index(
        drop=True
    )

    # --------------------------------------------------------
    # Final count
    # --------------------------------------------------------

    final_count = len(df)

    removed_total = (
        original_count - final_count
    )

    print()
    print("=" * 60)
    print("CLEANING SUMMARY")
    print("=" * 60)

    print(
        f"Original resources: "
        f"{original_count}"
    )

    print(
        f"Final resources: "
        f"{final_count}"
    )

    print(
        f"Total removed: "
        f"{removed_total}"
    )

    return df


# ============================================================
# FINAL VALIDATION
# ============================================================

def validate_final_dataset(df):

    print()
    print("=" * 60)
    print("FINAL DATASET VALIDATION")
    print("=" * 60)

    # --------------------------------------------------------
    # Duration
    # --------------------------------------------------------

    invalid_duration = (
        df["duration_minutes"] < MIN_DURATION
    ).sum()

    print()
    print(
        f"Videos below {MIN_DURATION} minutes: "
        f"{invalid_duration}"
    )

    # --------------------------------------------------------
    # Status
    # --------------------------------------------------------

    rejected_count = (
        df["status"] == "rejected"
    ).sum()

    print(
        f"Rejected resources: "
        f"{rejected_count}"
    )

    # --------------------------------------------------------
    # Languages
    # --------------------------------------------------------

    invalid_languages = (
        ~df["language"].isin(
            ALLOWED_LANGUAGES
        )
    ).sum()

    print(
        f"Non-English/Hindi resources: "
        f"{invalid_languages}"
    )

    # --------------------------------------------------------
    # Duplicate resource IDs
    # --------------------------------------------------------

    duplicate_ids = (
        df["resource_id"]
        .duplicated()
        .sum()
    )

    print(
        f"Duplicate resource IDs: "
        f"{duplicate_ids}"
    )

    # --------------------------------------------------------
    # Duplicate URLs
    # --------------------------------------------------------

    duplicate_urls = (
        df["url"]
        .duplicated()
        .sum()
    )

    print(
        f"Duplicate URLs: "
        f"{duplicate_urls}"
    )

    # --------------------------------------------------------
    # Language distribution
    # --------------------------------------------------------

    print()
    print(
        "Language distribution:"
    )

    print(
        df["language"].value_counts()
    )

    # --------------------------------------------------------
    # Status distribution
    # --------------------------------------------------------

    print()
    print(
        "Status distribution:"
    )

    print(
        df["status"].value_counts()
    )

    # --------------------------------------------------------
    # Topic distribution
    # --------------------------------------------------------

    print()
    print(
        "Topic distribution:"
    )

    print(
        df["topic"].value_counts()
    )

    # --------------------------------------------------------
    # Quality score statistics
    # --------------------------------------------------------

    quality_scores = pd.to_numeric(
        df["quality_score"],
        errors="coerce"
    ).dropna()

    if len(quality_scores) > 0:

        print()
        print(
            "Quality score statistics:"
        )

        print(
            f"Average: "
            f"{quality_scores.mean():.2f}"
        )

        print(
            f"Minimum: "
            f"{quality_scores.min():.2f}"
        )

        print(
            f"Maximum: "
            f"{quality_scores.max():.2f}"
        )

    # --------------------------------------------------------
    # Final safety check
    # --------------------------------------------------------

    assert (
        invalid_duration == 0
    ), "Invalid duration found."

    assert (
        rejected_count == 0
    ), "Rejected resources found."

    assert (
        invalid_languages == 0
    ), "Invalid language found."

    assert (
        duplicate_ids == 0
    ), "Duplicate resource IDs found."

    print()
    print(
        "✓ All final validation checks passed."
    )


# ============================================================
# SAVE
# ============================================================

def save_dataset(df):

    df.to_csv(
        OUTPUT_FILE,
        index=False
    )

    print()
    print("=" * 60)
    print("DATASET SAVED")
    print("=" * 60)

    print(
        f"Output: {OUTPUT_FILE}"
    )

    print(
        f"Resources: {len(df)}"
    )


# ============================================================
# MAIN
# ============================================================

def main():

    df = load_data()

    validate_columns(
        df
    )

    df = prepare_data(
        df
    )

    df = clean_dataset(
        df
    )

    validate_final_dataset(
        df
    )

    save_dataset(
        df
    )

    print()
    print(
        "✓ Recommendation-ready dataset created."
    )


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":

    main()