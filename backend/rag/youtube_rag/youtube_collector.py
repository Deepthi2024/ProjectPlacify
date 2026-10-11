import csv
import os
import re
import requests


# ============================================================
# CONFIGURATION
# ============================================================

API_KEY = os.environ.get("YOUTUBE_API_KEY", "").strip()

CSV_FILE = "data/Full_Stack_Youtube_Resources.csv"

DOMAIN = "Full Stack Development"
TOPIC = "Full Stack Projects"
LEVEL = "Advanced"

# Number of videos you want to collect
TARGET_VIDEOS = 50

# Multiple search queries improve the variety of results
SEARCH_QUERIES = [
    "Full Stack project for advanced"
]


# ============================================================
# YOUTUBE API
# ============================================================

SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos"


def search_youtube(query, max_results=25):
    """
    Search YouTube for videos matching a query.
    """

    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": max_results,
        "order": "relevance",
        "relevanceLanguage": "en",
        "regionCode": "IN",
        "key": API_KEY
    }

    response = requests.get(SEARCH_URL, params=params)

    if response.status_code != 200:
        print("YouTube search error:")
        print(response.text)
        return []

    data = response.json()

    return data.get("items", [])


def get_video_details(video_ids):
    """
    Fetch detailed metadata for a list of YouTube video IDs.

    YouTube allows multiple IDs in a single videos.list request.
    """

    if not video_ids:
        return []

    params = {
        "part": "snippet,contentDetails,statistics",
        "id": ",".join(video_ids),
        "key": API_KEY
    }

    response = requests.get(VIDEOS_URL, params=params)

    if response.status_code != 200:
        print("YouTube video details error:")
        print(response.text)
        return []

    data = response.json()

    return data.get("items", [])


# ============================================================
# DURATION CONVERSION
# ============================================================

def duration_to_minutes(duration):
    """
    Convert YouTube ISO 8601 duration.

    Examples:

    PT1H30M       -> 90
    PT45M         -> 45
    PT1H10M30S    -> 71
    PT30S         -> 1
    """

    hours = 0
    minutes = 0
    seconds = 0

    hour_match = re.search(r"(\d+)H", duration)
    minute_match = re.search(r"(\d+)M", duration)
    second_match = re.search(r"(\d+)S", duration)

    if hour_match:
        hours = int(hour_match.group(1))

    if minute_match:
        minutes = int(minute_match.group(1))

    if second_match:
        seconds = int(second_match.group(1))

    total_minutes = hours * 60 + minutes

    if seconds >= 30:
        total_minutes += 1

    return total_minutes


# ============================================================
# CSV FUNCTIONS
# ============================================================

CSV_COLUMNS = [
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


def load_existing_video_ids():
    """
    Read existing CSV and return YouTube video IDs.

    This prevents the script from adding the same video again
    if you run the collector multiple times.
    """

    existing_ids = set()

    if not os.path.exists(CSV_FILE):
        return existing_ids

    with open(CSV_FILE, "r", encoding="utf-8", newline="") as file:

        reader = csv.DictReader(file)

        for row in reader:

            url = row.get("url", "")

            match = re.search(r"(?:v=|youtu\.be/)([A-Za-z0-9_-]{11})", url)

            if match:
                existing_ids.add(match.group(1))

    return existing_ids


def get_next_resource_number():
    """
    Find the next resource number.

    Example:
    yt_html_001
    yt_html_002
    yt_html_003
    """

    max_number = 0

    if not os.path.exists(CSV_FILE):
        return 1

    with open(CSV_FILE, "r", encoding="utf-8", newline="") as file:

        reader = csv.DictReader(file)

        for row in reader:

            resource_id = row.get("resource_id", "")

            match = re.search(r"yt_html_(\d+)", resource_id)

            if match:
                number = int(match.group(1))
                max_number = max(max_number, number)

    return max_number + 1


def save_to_csv(videos, existing_ids):
    """
    Append videos to the existing CSV.
    """

    file_exists = os.path.exists(CSV_FILE)

    # Make sure directory exists
    os.makedirs(os.path.dirname(CSV_FILE), exist_ok=True)

    next_number = get_next_resource_number()

    with open(
        CSV_FILE,
        "a",
        encoding="utf-8",
        newline=""
    ) as file:

        writer = csv.DictWriter(
            file,
            fieldnames=CSV_COLUMNS
        )

        # Create header if CSV doesn't exist
        if not file_exists or os.path.getsize(CSV_FILE) == 0:
            writer.writeheader()

        added = 0

        for video in videos:

            video_id = video["id"]

            # Skip duplicates
            if video_id in existing_ids:
                continue

            snippet = video.get("snippet", {})
            content_details = video.get("contentDetails", {})

            title = snippet.get("title", "")
            channel = snippet.get("channelTitle", "")

            duration = content_details.get(
                "duration",
                ""
            )

            duration_minutes = duration_to_minutes(duration)

            resource_id = f"yt_html_{next_number:03d}"

            row = {
                "resource_id": resource_id,

                "domain": DOMAIN,

                "topic": TOPIC,

                "subtopic": "",

                "level": LEVEL,

                "title": title,

                "channel": channel,

                "url": f"https://www.youtube.com/watch?v={video_id}",

                "duration_minutes": duration_minutes,

                "language": "English",

                # These will be determined later
                "quality_score": "",

                "status": ""
            }

            writer.writerow(row)

            existing_ids.add(video_id)

            next_number += 1
            added += 1

    return added


# ============================================================
# MAIN PROGRAM
# ============================================================

def main():

    print("=" * 60)
    print("PLACIFY - YouTube HTML Advanced Resource Collector")
    print("=" * 60)

    print()

    if not API_KEY:
        print("ERROR: Set the YOUTUBE_API_KEY environment variable first.")
        return

    print("Target videos:", TARGET_VIDEOS)
    print()

    # --------------------------------------------------------
    # Load existing videos
    # --------------------------------------------------------

    existing_ids = load_existing_video_ids()

    print(
        f"Existing YouTube videos in CSV: {len(existing_ids)}"
    )

    print()

    # --------------------------------------------------------
    # Search YouTube
    # --------------------------------------------------------

    video_ids = set()

    for query in SEARCH_QUERIES:

        print(f"Searching: {query}")

        results = search_youtube(
            query,
            max_results=50
        )

        for item in results:

            video_id = item.get(
                "id",
                {}
            ).get(
                "videoId"
            )

            if video_id:
                video_ids.add(video_id)

        print(
            f"  Results received: {len(results)}"
        )

        print(
            f"  Unique videos so far: {len(video_ids)}"
        )

        print()

        if len(video_ids) >= TARGET_VIDEOS:
            break

    # --------------------------------------------------------
    # Remove videos already present in CSV
    # --------------------------------------------------------

    new_video_ids = [
        video_id
        for video_id in video_ids
        if video_id not in existing_ids
    ]

    print(
        f"New videos to process: {len(new_video_ids)}"
    )

    print()

    if not new_video_ids:
        print("No new videos found.")
        return

    # Limit to requested target
    new_video_ids = new_video_ids[:TARGET_VIDEOS]

    # --------------------------------------------------------
    # Fetch detailed metadata
    # --------------------------------------------------------

    print("Fetching detailed metadata...")

    all_videos = []

    # Process in batches of 50
    for i in range(0, len(new_video_ids), 50):

        batch = new_video_ids[i:i + 50]

        videos = get_video_details(batch)

        all_videos.extend(videos)

        print(
            f"  Metadata received: {len(videos)}"
        )

    print()

    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    added = save_to_csv(
        all_videos,
        existing_ids
    )

    print("=" * 60)
    print("COLLECTION COMPLETE")
    print("=" * 60)

    print(
        f"Videos added to CSV: {added}"
    )

    print(
        f"CSV file: {CSV_FILE}"
    )

    print()


if __name__ == "__main__":
    main()