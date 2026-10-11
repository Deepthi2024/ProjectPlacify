import os
import json
import time
import math
import pandas as pd
from groq import Groq
from dotenv import load_dotenv


# ============================================================
# CONFIGURATION
# ============================================================

load_dotenv()

INPUT_FILE = "data/resources_enriched.csv"
OUTPUT_FILE = "data/resources_scored.csv"

MODEL = "openai/gpt-oss-20b"

# None = process all unfinished resources
# 30 = useful for testing
TEST_LIMIT = None

# Save after every N successful Groq evaluations
SAVE_EVERY = 10

# Retry configuration
MAX_RETRIES = 3
RETRY_DELAYS = [2, 5, 10]

# Final quality score weights
WEIGHTS = {
    "topic_relevance": 0.25,
    "level_suitability": 0.15,
    "content_quality": 0.20,
    "educational_value": 0.15,
    "engagement_score": 0.10,
    "recency_score": 0.05,
    "duration_score": 0.05,
    "metadata_completeness": 0.05,
}


# ============================================================
# GROQ CLIENT
# ============================================================

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError(
        "GROQ_API_KEY not found. Add it to your .env file."
    )

client = Groq(api_key=GROQ_API_KEY)


# ============================================================
# LOAD ORIGINAL DATA
# ============================================================

def load_input_data():

    print("Loading original dataset...")

    df = pd.read_csv(
        INPUT_FILE,
        dtype=str,
        keep_default_na=False
    )

    # Remove accidental unnamed columns
    unnamed_columns = [
        col
        for col in df.columns
        if col.startswith("Unnamed:")
    ]

    if unnamed_columns:

        print(
            f"Removing accidental columns: "
            f"{unnamed_columns}"
        )

        df = df.drop(
            columns=unnamed_columns
        )

    print(
        f"Resources loaded: {len(df)}"
    )

    return df


# ============================================================
# LOAD PREVIOUS CHECKPOINT
# ============================================================

def load_checkpoint(df):

    if not os.path.exists(OUTPUT_FILE):

        print()
        print(
            "No previous scoring file found."
        )

        print(
            "Starting quality scoring from the beginning."
        )

        return df

    print()
    print(
        "Previous scoring file found."
    )

    print(
        f"Loading checkpoint: {OUTPUT_FILE}"
    )

    scored_df = pd.read_csv(
        OUTPUT_FILE,
        dtype=str,
        keep_default_na=False
    )

    # Remove accidental unnamed columns
    unnamed_columns = [
        col
        for col in scored_df.columns
        if col.startswith("Unnamed:")
    ]

    if unnamed_columns:

        scored_df = scored_df.drop(
            columns=unnamed_columns
        )

    print(
        f"Checkpoint resources: "
        f"{len(scored_df)}"
    )

    # --------------------------------------------------------
    # Match using resource_id
    # --------------------------------------------------------

    if "resource_id" not in scored_df.columns:

        print(
            "WARNING: resource_id not found "
            "in checkpoint."
        )

        print(
            "Starting from original dataset."
        )

        return df

    # Make sure scoring columns exist
    scoring_columns = [
        "engagement_score",
        "recency_score",
        "duration_score",
        "metadata_completeness",
        "topic_relevance",
        "level_suitability",
        "content_quality",
        "educational_value",
        "quality_score",
        "status",
    ]

    for column in scoring_columns:

        if column not in scored_df.columns:

            scored_df[column] = ""

    # --------------------------------------------------------
    # Create lookup by resource_id
    # --------------------------------------------------------

    scored_lookup = scored_df.set_index(
        "resource_id"
    )

    completed_count = 0

    # --------------------------------------------------------
    # Copy previous results into current dataset
    # --------------------------------------------------------

    for index in df.index:

        resource_id = str(
            df.at[index, "resource_id"]
        )

        if resource_id not in scored_lookup.index:
            continue

        previous = scored_lookup.loc[
            resource_id
        ]

        # Copy scoring-related fields
        for column in scoring_columns:

            if column not in previous:
                continue

            value = previous[column]

            if (
                pd.notna(value)
                and str(value).strip() != ""
            ):

                df.at[index, column] = str(value)

        # Check if resource is already complete
        quality_score = str(
            df.at[index, "quality_score"]
        ).strip()

        if quality_score:

            completed_count += 1

    print()
    print(
        f"Previously completed resources: "
        f"{completed_count}"
    )

    print(
        f"Remaining resources: "
        f"{len(df) - completed_count}"
    )

    return df


# ============================================================
# PREPARE NUMERIC COLUMNS
# ============================================================

def prepare_numeric_columns(df):

    numeric_columns = [
        "duration_minutes",
        "view_count",
        "like_count",
        "comment_count",
        "category_id",
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
# ENGAGEMENT SCORE
# ============================================================

def calculate_engagement_scores(df):

    print(
        "Calculating engagement scores..."
    )

    df["engagement_score"] = 0.0

    for topic, group in df.groupby("topic"):

        indices = group.index

        views = group["view_count"]

        likes = group["like_count"]

        comments = group["comment_count"]

        like_rate = (
            likes /
            views.replace(0, 1)
        )

        comment_rate = (
            comments /
            views.replace(0, 1)
        )

        log_views = views.apply(
            lambda x: math.log10(x + 1)
        )

        def normalize(series):

            min_value = series.min()

            max_value = series.max()

            if max_value == min_value:

                return pd.Series(
                    [50.0] * len(series),
                    index=series.index
                )

            return (
                (series - min_value)
                / (max_value - min_value)
                * 100
            )

        normalized_views = normalize(
            log_views
        )

        normalized_likes = normalize(
            like_rate
        )

        normalized_comments = normalize(
            comment_rate
        )

        engagement = (
            normalized_views * 0.50
            + normalized_likes * 0.30
            + normalized_comments * 0.20
        )

        df.loc[
            indices,
            "engagement_score"
        ] = engagement

    return df


# ============================================================
# RECENCY SCORE
# ============================================================

def calculate_recency_score(
    date_string
):

    if not date_string:
        return 0.0

    try:

        date = pd.to_datetime(
            date_string,
            errors="coerce",
            utc=True
        )

        if pd.isna(date):
            return 0.0

        now = pd.Timestamp.now(
            tz="UTC"
        )

        age_days = (
            now - date
        ).total_seconds() / 86400

        if age_days <= 180:
            return 100.0

        elif age_days <= 365:
            return 90.0

        elif age_days <= 730:
            return 80.0

        elif age_days <= 1095:
            return 70.0

        elif age_days <= 1825:
            return 60.0

        elif age_days <= 3650:
            return 50.0

        else:
            return 40.0

    except Exception:

        return 0.0


def calculate_recency_scores(df):

    print(
        "Calculating recency scores..."
    )

    df["recency_score"] = (
        df["published_at"].apply(
            calculate_recency_score
        )
    )

    return df


# ============================================================
# DURATION SCORE
# ============================================================

def calculate_duration_score(
    duration
):

    try:

        duration = float(duration)

    except:

        return 0.0

    if duration <= 0:

        return 0.0

    elif duration < 5:

        return 55.0

    elif duration < 15:

        return 80.0

    elif duration < 30:

        return 95.0

    elif duration < 60:

        return 100.0

    elif duration < 120:

        return 90.0

    elif duration < 180:

        return 75.0

    else:

        return 60.0


def calculate_duration_scores(df):

    print(
        "Calculating duration scores..."
    )

    df["duration_score"] = (
        df["duration_minutes"].apply(
            calculate_duration_score
        )
    )

    return df


# ============================================================
# METADATA COMPLETENESS
# ============================================================

def calculate_metadata_score(row):

    fields = [
        "title",
        "channel",
        "url",
        "topic",
        "subtopic",
        "level",
        "language",
        "description",
        "published_at",
        "view_count",
        "thumbnail_url",
    ]

    available = 0

    for field in fields:

        if field not in row:
            continue

        value = row[field]

        if (
            pd.notna(value)
            and str(value).strip()
        ):

            available += 1

    return (
        available / len(fields)
    ) * 100


def calculate_metadata_scores(df):

    print(
        "Calculating metadata completeness..."
    )

    df["metadata_completeness"] = (
        df.apply(
            calculate_metadata_score,
            axis=1
        )
    )

    return df


# ============================================================
# GROQ EVALUATION
# ============================================================

def evaluate_with_groq(row):

    title = str(
        row.get("title", "")
    ).strip()

    channel = str(
        row.get("channel", "")
    ).strip()

    topic = str(
        row.get("topic", "")
    ).strip()

    subtopic = str(
        row.get("subtopic", "")
    ).strip()

    level = str(
        row.get("level", "")
    ).strip()

    language = str(
        row.get("language", "")
    ).strip()

    duration = str(
        row.get("duration_minutes", "")
    ).strip()

    description = str(
        row.get("description", "")
    ).strip()

    tags = str(
        row.get("tags", "")
    ).strip()

    system_prompt = """
You are an expert evaluator of educational YouTube resources.

Your task is to evaluate a learning resource using ONLY the
metadata provided.

Do NOT assume information that is not supported by the metadata.

Evaluate these four dimensions:

1. topic_relevance
How strongly the resource matches the assigned topic/subtopic.

2. level_suitability
How appropriate the resource appears for the assigned level.

3. content_quality
How likely the resource is to be technically accurate,
well-structured, clear and useful based on the available metadata.

4. educational_value
How useful the resource is for someone trying to learn
the assigned subject.

Give each score from 0 to 100.

Be conservative when metadata is insufficient.
Do not automatically give high scores.
"""

    user_prompt = f"""
Evaluate this educational resource.

Title:
{title}

Channel:
{channel}

Topic:
{topic}

Subtopic:
{subtopic}

Level:
{level}

Language:
{language}

Duration:
{duration} minutes

Description:
{description}

Tags:
{tags}

Return only the requested JSON structure.
"""

    response = client.chat.completions.create(

        model=MODEL,

        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],

        temperature=0,

        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "resource_quality_evaluation",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {

                        "topic_relevance": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 100
                        },

                        "level_suitability": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 100
                        },

                        "content_quality": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 100
                        },

                        "educational_value": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 100
                        }
                    },

                    "required": [
                        "topic_relevance",
                        "level_suitability",
                        "content_quality",
                        "educational_value"
                    ],

                    "additionalProperties": False
                }
            }
        }
    )

    content = (
        response
        .choices[0]
        .message
        .content
    )

    if not content:

        raise ValueError(
            "Groq returned an empty response."
        )

    return json.loads(content)


# ============================================================
# GROQ RETRY
# ============================================================

def evaluate_with_retry(row):

    resource_id = row.get(
        "resource_id",
        "unknown"
    )

    for attempt in range(
        MAX_RETRIES + 1
    ):

        try:

            result = evaluate_with_groq(
                row
            )

            return result

        except Exception as error:

            if attempt < MAX_RETRIES:

                delay = RETRY_DELAYS[
                    min(
                        attempt,
                        len(RETRY_DELAYS) - 1
                    )
                ]

                print()
                print(
                    f"  Groq request failed."
                )

                print(
                    f"  Attempt "
                    f"{attempt + 1}/"
                    f"{MAX_RETRIES + 1}"
                )

                print(
                    f"  Error: {error}"
                )

                print(
                    f"  Retrying in "
                    f"{delay} seconds..."
                )

                time.sleep(delay)

            else:

                print()
                print(
                    f"  FAILED after "
                    f"{MAX_RETRIES + 1} attempts."
                )

                print(
                    f"  Resource: "
                    f"{resource_id}"
                )

                print(
                    f"  Error: {error}"
                )

    return None


# ============================================================
# FINAL QUALITY SCORE
# ============================================================

def calculate_final_score(row):

    required_fields = [
        "topic_relevance",
        "level_suitability",
        "content_quality",
        "educational_value",
    ]

    for field in required_fields:

        value = row.get(
            field,
            ""
        )

        if (
            value is None
            or str(value).strip() == ""
        ):

            return None

    try:

        topic_relevance = float(
            row["topic_relevance"]
        )

        level_suitability = float(
            row["level_suitability"]
        )

        content_quality = float(
            row["content_quality"]
        )

        educational_value = float(
            row["educational_value"]
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

        metadata_completeness = float(
            row["metadata_completeness"]
        )

    except Exception:

        return None

    score = (

        topic_relevance
        * WEIGHTS["topic_relevance"]

        + level_suitability
        * WEIGHTS["level_suitability"]

        + content_quality
        * WEIGHTS["content_quality"]

        + educational_value
        * WEIGHTS["educational_value"]

        + engagement_score
        * WEIGHTS["engagement_score"]

        + recency_score
        * WEIGHTS["recency_score"]

        + duration_score
        * WEIGHTS["duration_score"]

        + metadata_completeness
        * WEIGHTS["metadata_completeness"]
    )

    return round(
        score,
        2
    )


# ============================================================
# STATUS
# ============================================================

def determine_status(score):

    if score is None:

        return ""

    if score >= 80:

        return "approved"

    elif score >= 60:

        return "review"

    else:

        return "rejected"


# ============================================================
# SAVE CHECKPOINT
# ============================================================

def save_checkpoint(df):

    df.to_csv(
        OUTPUT_FILE,
        index=False
    )

    print()
    print(
        f"Checkpoint saved → "
        f"{OUTPUT_FILE}"
    )


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 60)
    print(
        "PLACIFY RESOURCE QUALITY SCORING"
    )
    print("=" * 60)

    # --------------------------------------------------------
    # Load original dataset
    # --------------------------------------------------------

    df = load_input_data()

    # --------------------------------------------------------
    # Prepare numeric columns
    # --------------------------------------------------------

    df = prepare_numeric_columns(
        df
    )

    # --------------------------------------------------------
    # Load previous checkpoint
    # --------------------------------------------------------

    df = load_checkpoint(
        df
    )

    # --------------------------------------------------------
    # Calculate objective scores
    # --------------------------------------------------------

    df = calculate_engagement_scores(
        df
    )

    df = calculate_recency_scores(
        df
    )

    df = calculate_duration_scores(
        df
    )

    df = calculate_metadata_scores(
        df
    )

    # --------------------------------------------------------
    # Ensure Groq columns exist
    # --------------------------------------------------------

    groq_columns = [
        "topic_relevance",
        "level_suitability",
        "content_quality",
        "educational_value",
    ]

    for column in groq_columns:

        if column not in df.columns:

            df[column] = ""

    if "quality_score" not in df.columns:

        df["quality_score"] = ""

    if "status" not in df.columns:

        df["status"] = ""

    # --------------------------------------------------------
    # Find unfinished resources
    # --------------------------------------------------------

    unfinished_indices = []

    for index in df.index:

        quality_score = str(
            df.at[index, "quality_score"]
        ).strip()

        if not quality_score:

            unfinished_indices.append(
                index
            )

    print()
    print(
        "=" * 60
    )

    print(
        f"Total resources: {len(df)}"
    )

    print(
        f"Already completed: "
        f"{len(df) - len(unfinished_indices)}"
    )

    print(
        f"Remaining: "
        f"{len(unfinished_indices)}"
    )

    print(
        "=" * 60
    )

    # --------------------------------------------------------
    # Apply test limit
    # --------------------------------------------------------

    if TEST_LIMIT is not None:

        process_indices = (
            unfinished_indices[:TEST_LIMIT]
        )

        print()
        print(
            f"TEST MODE: Processing "
            f"{len(process_indices)} "
            f"unfinished resources."
        )

    else:

        process_indices = (
            unfinished_indices
        )

        print()
        print(
            f"FULL MODE: Processing all "
            f"{len(process_indices)} "
            f"unfinished resources."
        )

    # --------------------------------------------------------
    # Process with Groq
    # --------------------------------------------------------

    successful = 0
    failed = 0

    total = len(process_indices)

    for position, index in enumerate(
        process_indices,
        start=1
    ):

        row = df.loc[index]

        resource_id = row.get(
            "resource_id",
            "unknown"
        )

        title = row.get(
            "title",
            ""
        )

        topic = row.get(
            "topic",
            ""
        )

        print()
        print(
            f"[{position}/{total}]"
        )

        print(
            f"Resource ID: "
            f"{resource_id}"
        )

        print(
            f"Title: "
            f"{title}"
        )

        print(
            f"Topic: "
            f"{topic}"
        )

        result = evaluate_with_retry(
            row
        )

        if result is not None:

            # ----------------------------------------------
            # Store Groq scores
            # ----------------------------------------------

            df.at[
                index,
                "topic_relevance"
            ] = str(
                result["topic_relevance"]
            )

            df.at[
                index,
                "level_suitability"
            ] = str(
                result["level_suitability"]
            )

            df.at[
                index,
                "content_quality"
            ] = str(
                result["content_quality"]
            )

            df.at[
                index,
                "educational_value"
            ] = str(
                result["educational_value"]
            )

            # ----------------------------------------------
            # Calculate final score
            # ----------------------------------------------

            score = calculate_final_score(
                df.loc[index]
            )

            df.at[
                index,
                "quality_score"
            ] = (
                str(score)
                if score is not None
                else ""
            )

            status = determine_status(
                score
            )

            df.at[
                index,
                "status"
            ] = status

            print()
            print(
                "  Groq evaluation successful."
            )

            print(
                f"  Topic relevance: "
                f"{result['topic_relevance']}"
            )

            print(
                f"  Level suitability: "
                f"{result['level_suitability']}"
            )

            print(
                f"  Content quality: "
                f"{result['content_quality']}"
            )

            print(
                f"  Educational value: "
                f"{result['educational_value']}"
            )

            print(
                f"  Final score: "
                f"{score}"
            )

            print(
                f"  Status: "
                f"{status}"
            )

            successful += 1

        else:

            failed += 1

            print(
                "  Resource was not scored."
            )

        # ----------------------------------------------------
        # Periodic checkpoint
        # ----------------------------------------------------

        if (
            successful > 0
            and successful % SAVE_EVERY == 0
        ):

            save_checkpoint(
                df
            )

    # --------------------------------------------------------
    # Final save
    # --------------------------------------------------------

    print()
    print(
        "Saving final checkpoint..."
    )

    save_checkpoint(
        df
    )

    # --------------------------------------------------------
    # Convert score columns
    # --------------------------------------------------------

    numeric_score_columns = [
        "engagement_score",
        "recency_score",
        "duration_score",
        "metadata_completeness",
        "topic_relevance",
        "level_suitability",
        "content_quality",
        "educational_value",
        "quality_score",
    ]

    for column in numeric_score_columns:

        if column in df.columns:

            df[column] = pd.to_numeric(
                df[column],
                errors="coerce"
            )

            df[column] = df[
                column
            ].round(2)

    # Save once more after numeric conversion
    save_checkpoint(
        df
    )

    # --------------------------------------------------------
    # Statistics
    # --------------------------------------------------------

    valid_scores = df[
        "quality_score"
    ].dropna()

    print()
    print("=" * 60)
    print(
        "QUALITY SCORING COMPLETE"
    )
    print("=" * 60)

    print(
        f"Resources in dataset: "
        f"{len(df)}"
    )

    print(
        f"Processed this run: "
        f"{successful}"
    )

    print(
        f"Failed this run: "
        f"{failed}"
    )

    print(
        f"Total completed: "
        f"{len(valid_scores)}"
    )

    print(
        f"Remaining: "
        f"{len(df) - len(valid_scores)}"
    )

    print()

    print(
        "Status distribution:"
    )

    print(
        df["status"].value_counts(
            dropna=False
        )
    )

    if len(valid_scores) > 0:

        print()

        print(
            "Average quality score:"
        )

        print(
            round(
                valid_scores.mean(),
                2
            )
        )

        print()

        print(
            "Minimum quality score:"
        )

        print(
            round(
                valid_scores.min(),
                2
            )
        )

        print()

        print(
            "Maximum quality score:"
        )

        print(
            round(
                valid_scores.max(),
                2
            )
        )

    print()

    print(
        f"Output: "
        f"{OUTPUT_FILE}"
    )


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":

    main()