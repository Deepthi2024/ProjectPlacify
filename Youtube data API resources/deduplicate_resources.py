import csv
import os
from urllib.parse import urlparse, parse_qs


# ============================================================
# FILE PATHS
# ============================================================

INPUT_FILE = "data/Full_Stack_Youtube_Resources.csv"
OUTPUT_FILE = "data/Unique_Resources.csv"


# ============================================================
# EXTRACT YOUTUBE VIDEO ID
# ============================================================

def extract_youtube_video_id(url):

    if not url:
        return None

    url = url.strip()

    try:
        parsed = urlparse(url)

        hostname = parsed.hostname

        if not hostname:
            return None

        hostname = hostname.lower()

        # ----------------------------------------------------
        # youtube.com/watch?v=VIDEO_ID
        # ----------------------------------------------------

        if "youtube.com" in hostname:

            query = parse_qs(parsed.query)

            if "v" in query:

                video_id = query["v"][0]

                if len(video_id) == 11:
                    return video_id

            # ------------------------------------------------
            # youtube.com/shorts/VIDEO_ID
            # ------------------------------------------------

            if parsed.path.startswith("/shorts/"):

                video_id = parsed.path.split("/shorts/")[1].split("/")[0]

                if len(video_id) == 11:
                    return video_id

            # ------------------------------------------------
            # youtube.com/embed/VIDEO_ID
            # ------------------------------------------------

            if parsed.path.startswith("/embed/"):

                video_id = parsed.path.split("/embed/")[1].split("/")[0]

                if len(video_id) == 11:
                    return video_id

        # ----------------------------------------------------
        # youtu.be/VIDEO_ID
        # ----------------------------------------------------

        if "youtu.be" in hostname:

            video_id = parsed.path.strip("/").split("/")[0]

            if len(video_id) == 11:
                return video_id

    except Exception:

        return None

    return None


# ============================================================
# MERGE COMMA-SEPARATED VALUES
# ============================================================

def merge_values(existing, new_value):

    values = []

    # --------------------------------------------------------
    # Existing values
    # --------------------------------------------------------

    if existing:

        for value in existing.split(","):

            value = value.strip()

            if value and value not in values:

                values.append(value)

    # --------------------------------------------------------
    # New values
    # --------------------------------------------------------

    if new_value:

        for value in new_value.split(","):

            value = value.strip()

            if value and value not in values:

                values.append(value)

    return ", ".join(values)


# ============================================================
# MAIN
# ============================================================

def main():

    if not os.path.exists(INPUT_FILE):

        print("ERROR!")
        print(f"File not found: {INPUT_FILE}")
        return


    print("=" * 70)
    print("PLACIFY - YOUTUBE DUPLICATE REMOVER")
    print("=" * 70)

    print()
    print(f"Reading: {INPUT_FILE}")
    print()


    # ========================================================
    # Dictionary
    #
    # KEY   = YouTube video ID
    # VALUE = complete CSV row
    #
    # This guarantees ONE ROW PER VIDEO.
    # ========================================================

    unique_videos = {}


    total_rows = 0
    invalid_urls = 0
    duplicate_videos = 0


    # ========================================================
    # READ CSV
    # ========================================================

    with open(
        INPUT_FILE,
        "r",
        encoding="utf-8-sig",
        newline=""
    ) as file:

        reader = csv.DictReader(file)

        fieldnames = reader.fieldnames

        if not fieldnames:

            print("ERROR: CSV has no columns.")
            return


        for row in reader:

            total_rows += 1


            # ------------------------------------------------
            # Get URL
            # ------------------------------------------------

            url = row.get("url", "")

            video_id = extract_youtube_video_id(url)


            # ------------------------------------------------
            # Invalid URL
            # ------------------------------------------------

            if not video_id:

                invalid_urls += 1

                print(
                    f"WARNING: Could not extract video ID: {url}"
                )

                continue


            # =================================================
            # FIRST TIME SEEING THIS VIDEO
            # =================================================

            if video_id not in unique_videos:

                # Make a copy of the row
                new_row = row.copy()

                # Store normalized URL
                new_row["url"] = (
                    f"https://www.youtube.com/watch?v={video_id}"
                )

                unique_videos[video_id] = new_row

            # =================================================
            # DUPLICATE VIDEO
            # =================================================

            else:

                duplicate_videos += 1

                existing = unique_videos[video_id]


                # ------------------------------------------------
                # Merge TOPIC
                # ------------------------------------------------

                existing["topic"] = merge_values(
                    existing.get("topic", ""),
                    row.get("topic", "")
                )


                # ------------------------------------------------
                # Merge SUBTOPIC
                # ------------------------------------------------

                existing["subtopic"] = merge_values(
                    existing.get("subtopic", ""),
                    row.get("subtopic", "")
                )


                # ------------------------------------------------
                # Keep missing metadata if new row has it
                # ------------------------------------------------

                fields_to_fill = [
                    "domain",
                    "level",
                    "title",
                    "channel",
                    "duration_minutes",
                    "language",
                    "quality_score",
                    "status"
                ]


                for field in fields_to_fill:

                    old_value = existing.get(field, "").strip()
                    new_value = row.get(field, "").strip()


                    if not old_value and new_value:

                        existing[field] = new_value


    # ========================================================
    # WRITE UNIQUE CSV
    # ========================================================

    os.makedirs(
        os.path.dirname(OUTPUT_FILE),
        exist_ok=True
    )


    with open(
        OUTPUT_FILE,
        "w",
        encoding="utf-8",
        newline=""
    ) as file:

        writer = csv.DictWriter(
            file,
            fieldnames=fieldnames
        )

        writer.writeheader()

        for row in unique_videos.values():

            writer.writerow(row)


    # ========================================================
    # SUMMARY
    # ========================================================

    unique_count = len(unique_videos)


    print()
    print("=" * 70)
    print("DEDUPLICATION COMPLETE")
    print("=" * 70)

    print(f"Original rows       : {total_rows}")
    print(f"Unique videos       : {unique_count}")
    print(f"Duplicates removed  : {duplicate_videos}")
    print(f"Invalid URLs        : {invalid_urls}")

    print()
    print(f"Output: {OUTPUT_FILE}")

    print("=" * 70)


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":
    main()