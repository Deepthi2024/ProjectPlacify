import os
import re
import time
import pandas as pd
import requests
from dotenv import load_dotenv

# ============================================================
# CONFIGURATION
# ============================================================

INPUT_FILE = "data/resources_classified.csv"
OUTPUT_FILE = "data/resources_classified_enriched.csv"

BATCH_SIZE = 50
SAVE_EVERY = 5

YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/videos"

# ============================================================
# LOAD API KEY
# ============================================================

load_dotenv()

API_KEY = os.getenv("YOUTUBE_API_KEY")

if not API_KEY:
    raise ValueError(
        "YOUTUBE_API_KEY not found.\n"
        "Make sure it is present in your .env file."
    )


# ============================================================
# EXTRACT YOUTUBE VIDEO ID
# ============================================================

def extract_video_id(url):
    """
    Extract YouTube video ID from different URL formats.

    Supported:
    - https://www.youtube.com/watch?v=VIDEO_ID
    - https://youtu.be/VIDEO_ID
    - https://www.youtube.com/shorts/VIDEO_ID
    - https://www.youtube.com/embed/VIDEO_ID
    """

    if not url:
        return None

    url = str(url).strip()

    # Standard watch URL
    match = re.search(r"(?:youtube\.com/watch\?v=)([A-Za-z0-9_-]{11})", url)

    if match:
        return match.group(1)

    # Short URL
    match = re.search(r"(?:youtu\.be/)([A-Za-z0-9_-]{11})", url)

    if match:
        return match.group(1)

    # Shorts URL
    match = re.search(r"(?:youtube\.com/shorts/)([A-Za-z0-9_-]{11})", url)

    if match:
        return match.group(1)

    # Embed URL
    match = re.search(r"(?:youtube\.com/embed/)([A-Za-z0-9_-]{11})", url)

    if match:
        return match.group(1)

    return None


# ============================================================
# FETCH YOUTUBE METADATA
# ============================================================

def fetch_video_metadata(video_ids):
    """
    Fetch metadata for up to 50 YouTube videos in one API request.
    """

    if not video_ids:
        return {}

    params = {
        "part": "snippet,contentDetails,statistics",
        "id": ",".join(video_ids),
        "key": API_KEY
    }

    response = requests.get(
        YOUTUBE_API_URL,
        params=params,
        timeout=30
    )

    # Check HTTP errors
    response.raise_for_status()

    data = response.json()

    metadata = {}

    for item in data.get("items", []):

        video_id = item["id"]

        snippet = item.get("snippet", {})
        statistics = item.get("statistics", {})
        content_details = item.get("contentDetails", {})

        thumbnails = snippet.get("thumbnails", {})

        # Prefer high quality thumbnail
        thumbnail_url = ""

        if "maxres" in thumbnails:
            thumbnail_url = thumbnails["maxres"]["url"]

        elif "standard" in thumbnails:
            thumbnail_url = thumbnails["standard"]["url"]

        elif "high" in thumbnails:
            thumbnail_url = thumbnails["high"]["url"]

        elif "medium" in thumbnails:
            thumbnail_url = thumbnails["medium"]["url"]

        elif "default" in thumbnails:
            thumbnail_url = thumbnails["default"]["url"]

        metadata[video_id] = {
            "description": snippet.get("description", ""),

            "tags": "|".join(
                snippet.get("tags", [])
            ),

            "published_at": snippet.get(
                "publishedAt", ""
            ),

            "view_count": statistics.get(
                "viewCount", ""
            ),

            "like_count": statistics.get(
                "likeCount", ""
            ),

            "comment_count": statistics.get(
                "commentCount", ""
            ),

            "thumbnail_url": thumbnail_url,

            "category_id": snippet.get(
                "categoryId", ""
            )
        }

    return metadata


# ============================================================
# LOAD CSV
# ============================================================

def load_csv():

    if not os.path.exists(INPUT_FILE):
        raise FileNotFoundError(
            f"Input file not found: {INPUT_FILE}"
        )

    df = pd.read_csv(
        INPUT_FILE,
        dtype=str,
        keep_default_na=False
    )

    return df


# ============================================================
# PREPARE COLUMNS
# ============================================================

def prepare_columns(df):

    new_columns = [
        "description",
        "tags",
        "published_at",
        "view_count",
        "like_count",
        "comment_count",
        "thumbnail_url",
        "category_id"
    ]

    for column in new_columns:

        if column not in df.columns:
            df[column] = ""

    # Internal column used for tracking
    if "_metadata_status" not in df.columns:
        df["_metadata_status"] = ""

    return df


def save_dataframe(df):
    """Save enrichment progress and report file-locking errors clearly."""

    try:
        df.to_csv(
            OUTPUT_FILE,
            index=False,
            encoding="utf-8-sig"
        )
    except PermissionError:
        print(
            f"ERROR: Cannot write to {OUTPUT_FILE}. "
            "Close it in Excel or another program and try again."
        )
        return False

    return True


def metadata_is_present(row):
    """Recognize metadata already saved in a previous output file."""

    return all(
        str(row.get(column, "")).strip()
        for column in (
            "published_at",
            "view_count",
            "thumbnail_url",
            "category_id"
        )
    )


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 70)
    print("PLACIFY - YOUTUBE METADATA ENRICHMENT")
    print("=" * 70)
    print()

    # --------------------------------------------------------
    # Load existing enriched file if available
    # --------------------------------------------------------

    if os.path.exists(OUTPUT_FILE) and os.path.getsize(OUTPUT_FILE) > 0:

        print(
            f"Existing enriched file found: {OUTPUT_FILE}"
        )

        print("Resuming previous enrichment...")
        print()

        df = pd.read_csv(
            OUTPUT_FILE,
            dtype=str,
            keep_default_na=False
        )

    else:

        print(
            f"Loading input file: {INPUT_FILE}"
        )

        print()

        df = load_csv()

    # --------------------------------------------------------
    # Prepare columns
    # --------------------------------------------------------

    df = prepare_columns(df)

    print(f"Total resources: {len(df)}")
    print()

    # --------------------------------------------------------
    # Extract video IDs
    # --------------------------------------------------------

    print("Extracting YouTube video IDs...")

    df["_video_id"] = df["url"].apply(
        extract_video_id
    )

    invalid_count = df["_video_id"].isna().sum()

    print(
        f"Valid YouTube URLs: "
        f"{len(df) - invalid_count}"
    )

    print(
        f"Invalid YouTube URLs: "
        f"{invalid_count}"
    )

    print()

    # --------------------------------------------------------
    # Determine resources that need enrichment
    # --------------------------------------------------------

    rows_to_process = []

    for index, row in df.iterrows():

        status = row["_metadata_status"].strip()

        if status == "success" or metadata_is_present(row):
            df.at[index, "_metadata_status"] = "success"
            continue

        video_id = row["_video_id"]

        if not video_id:
            df.at[index, "_metadata_status"] = "invalid_url"
            continue

        rows_to_process.append(index)

    print(
        f"Resources requiring enrichment: "
        f"{len(rows_to_process)}"
    )

    print()

    # --------------------------------------------------------
    # Process in batches
    # --------------------------------------------------------

    processed = 0

    for batch_start in range(
        0,
        len(rows_to_process),
        BATCH_SIZE
    ):

        batch_indices = rows_to_process[
            batch_start:
            batch_start + BATCH_SIZE
        ]

        video_ids = []

        for index in batch_indices:

            video_id = df.at[
                index,
                "_video_id"
            ]

            if video_id:
                video_ids.append(video_id)

        # Remove duplicate IDs inside batch
        video_ids = list(
            dict.fromkeys(video_ids)
        )

        print("-" * 70)

        print(
            f"Batch "
            f"{batch_start // BATCH_SIZE + 1}"
        )

        print(
            f"Videos in batch: "
            f"{len(video_ids)}"
        )

        try:

            metadata = fetch_video_metadata(
                video_ids
            )

        except requests.exceptions.HTTPError as error:

            print(
                "YouTube API HTTP error:"
            )

            print(error)

            print(
                "Stopping to avoid losing progress."
            )

            break

        except requests.exceptions.RequestException as error:

            print(
                "Network error:"
            )

            print(error)

            print(
                "Stopping to avoid losing progress."
            )

            break

        except Exception as error:

            print(
                "Unexpected error:"
            )

            print(error)

            print(
                "Stopping to avoid losing progress."
            )

            break

        # ----------------------------------------------------
        # Store metadata
        # ----------------------------------------------------

        for index in batch_indices:

            video_id = df.at[
                index,
                "_video_id"
            ]

            if not video_id:
                continue

            if video_id not in metadata:

                # Video may have been deleted/private
                df.at[
                    index,
                    "_metadata_status"
                ] = "not_found"

                print(
                    f"NOT FOUND: {video_id}"
                )

                continue

            video = metadata[video_id]

            df.at[
                index,
                "description"
            ] = video["description"]

            df.at[
                index,
                "tags"
            ] = video["tags"]

            df.at[
                index,
                "published_at"
            ] = video["published_at"]

            df.at[
                index,
                "view_count"
            ] = video["view_count"]

            df.at[
                index,
                "like_count"
            ] = video["like_count"]

            df.at[
                index,
                "comment_count"
            ] = video["comment_count"]

            df.at[
                index,
                "thumbnail_url"
            ] = video["thumbnail_url"]

            df.at[
                index,
                "category_id"
            ] = video["category_id"]

            df.at[
                index,
                "_metadata_status"
            ] = "success"

            processed += 1

        print(
            f"Successfully enriched: "
            f"{processed}"
        )

        # ----------------------------------------------------
        # Save periodically
        # ----------------------------------------------------

        current_batch = (
            batch_start // BATCH_SIZE
        ) + 1

        if current_batch % SAVE_EVERY == 0:

            print(
                "Saving progress..."
            )

            if save_dataframe(df):
                print(f"Saved: {OUTPUT_FILE}")

        # Small delay between requests
        time.sleep(0.2)

    # --------------------------------------------------------
    # Final save
    # --------------------------------------------------------

    print()
    print("Saving final dataset...")

    # Remove internal columns
    output_df = df.drop(
        columns=[
            "_video_id",
            "_metadata_status"
        ],
        errors="ignore"
    )

    save_dataframe(output_df)

    # --------------------------------------------------------
    # Summary
    # --------------------------------------------------------

    print()
    print("=" * 70)
    print("ENRICHMENT COMPLETE")
    print("=" * 70)

    print(
        f"Total resources: {len(output_df)}"
    )

    print(
        f"Output file: {OUTPUT_FILE}"
    )

    print()
    print("Added metadata:")

    print("  - description")
    print("  - tags")
    print("  - published_at")
    print("  - view_count")
    print("  - like_count")
    print("  - comment_count")
    print("  - thumbnail_url")
    print("  - category_id")

    print("=" * 70)


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":
    main()