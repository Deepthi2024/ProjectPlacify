import json
import os
import time

import pandas as pd
from dotenv import load_dotenv
from groq import Groq


# ============================================================
# CONFIGURATION
# ============================================================

INPUT_FILE = "data/resources_enriched.csv"
OUTPUT_FILE = "data/resources_classified.csv"
TAXONOMY_FILE = "taxonomy/full_stack_devvelopment.json"

MODEL = "openai/gpt-oss-20b"

SAVE_EVERY = 10


# ============================================================
# LOAD GROQ API KEY
# ============================================================

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError(
        "GROQ_API_KEY not found in .env file."
    )

client = Groq(api_key=api_key)


# ============================================================
# LOAD TAXONOMY
# ============================================================

with open(
    TAXONOMY_FILE,
    "r",
    encoding="utf-8"
) as file:

    taxonomy = json.load(file)


DOMAIN = taxonomy["domain"]

LEVELS = taxonomy["levels"]

LANGUAGES = taxonomy["languages"]

TOPICS = taxonomy["topics"]


# ============================================================
# CLASSIFY ONE RESOURCE
# ============================================================

def classify_resource(row):

    topic = str(
        row.get("topic", "")
    ).strip()

    # --------------------------------------------------------
    # Validate topic
    # --------------------------------------------------------

    if topic not in TOPICS:

        print(
            f"WARNING: Topic '{topic}' "
            f"not found in taxonomy."
        )

        return {
            "subtopics": [],
            "level": "Unknown",
            "language": "Unknown"
        }


    # --------------------------------------------------------
    # Allowed subtopics for this topic
    # --------------------------------------------------------

    allowed_subtopics = TOPICS[topic]

    subtopic_text = ""

    for name, description in allowed_subtopics.items():

        subtopic_text += (
            f"- {name}: {description}\n"
        )


    # --------------------------------------------------------
    # Existing values
    # --------------------------------------------------------

    existing_subtopic = str(
        row.get("subtopic", "")
    ).strip()

    existing_level = str(
        row.get("level", "")
    ).strip()

    existing_language = str(
        row.get("language", "")
    ).strip()


    # --------------------------------------------------------
    # Resource information
    # --------------------------------------------------------

    title = str(
        row.get("title", "")
    ).strip()

    channel = str(
        row.get("channel", "")
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


    # --------------------------------------------------------
    # SYSTEM PROMPT
    # --------------------------------------------------------

    system_prompt = f"""
You are a metadata classification system
for Placify, a learning-resource recommendation
platform.

Your task is to classify an educational YouTube
video belonging to the Full Stack Development domain.

DOMAIN:
{DOMAIN}

TOPIC:
{topic}


ALLOWED SUBTOPICS:

{subtopic_text}


ALLOWED LEVELS:

{", ".join(LEVELS)}


ALLOWED LANGUAGES:

{", ".join(LANGUAGES)}


CLASSIFICATION RULES:

1. Select only subtopics from the allowed list.

2. Select all subtopics that are genuinely covered
   by the video.

3. Do NOT select a subtopic merely because it is
   related to the topic.

4. Do NOT invent new subtopics.

5. Use the title, description, tags, channel,
   duration and topic together.

6. A video can have multiple subtopics.

7. Determine the overall learning level.

8. Beginner means the video teaches concepts
   from the beginning or assumes very little
   prior knowledge.

9. Intermediate means the video assumes basic
   knowledge and covers more complex concepts.

10. Advanced means the video assumes substantial
    prior knowledge or focuses on advanced concepts.

11. Use Unknown when the level cannot be
    determined reliably.

12. Determine the actual language used in the
    educational content.

13. Do not assume English simply because programming
    keywords are written in English.

14. Use Unknown when the language cannot be
    determined reliably.

15. Do not use information that is not present
    in the supplied metadata.

16. Return ONLY the requested structured data.
"""


    # --------------------------------------------------------
    # USER PROMPT
    # --------------------------------------------------------

    user_prompt = f"""
Classify this YouTube educational resource.

TITLE:
{title}

CHANNEL:
{channel}

TOPIC:
{topic}

DURATION:
{duration} minutes

DESCRIPTION:
{description}

TAGS:
{tags}

CURRENT SUBTOPIC:
{existing_subtopic}

CURRENT LEVEL:
{existing_level}

CURRENT LANGUAGE:
{existing_language}
"""


    # --------------------------------------------------------
    # GROQ REQUEST
    # --------------------------------------------------------

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

                "name": "resource_classification",

                "strict": True,

                "schema": {

                    "type": "object",

                    "properties": {

                        "subtopics": {
                            "type": "array",

                            "items": {
                                "type": "string",

                                "enum": list(
                                    allowed_subtopics.keys()
                                )
                            }
                        },

                        "level": {
                            "type": "string",

                            "enum": LEVELS
                        },

                        "language": {
                            "type": "string",

                            "enum": LANGUAGES
                        }
                    },

                    "required": [
                        "subtopics",
                        "level",
                        "language"
                    ],

                    "additionalProperties": False
                }
            }
        }
    )


    # --------------------------------------------------------
    # PARSE RESULT
    # --------------------------------------------------------

    content = (
        response.choices[0]
        .message
        .content
    )

    result = json.loads(content)

    return result


# ============================================================
# LOAD INPUT
# ============================================================

def load_input_csv():

    if not os.path.exists(INPUT_FILE):

        raise FileNotFoundError(
            f"Input file not found: {INPUT_FILE}"
        )

    return pd.read_csv(
        INPUT_FILE,
        dtype=str,
        keep_default_na=False
    )


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 70)
    print("PLACIFY - COMPLETE MISSING METADATA")
    print("=" * 70)
    print()


    # --------------------------------------------------------
    # Resume if output already exists
    # --------------------------------------------------------

    if os.path.exists(OUTPUT_FILE):

        print(
            f"Existing output found: {OUTPUT_FILE}"
        )

        print(
            "Resuming previous classification..."
        )

        print()

        df = pd.read_csv(
            OUTPUT_FILE,
            dtype=str,
            keep_default_na=False
        )

    else:

        print(
            f"Loading: {INPUT_FILE}"
        )

        print()

        df = load_input_csv()


    # --------------------------------------------------------
    # Ensure required columns exist
    # --------------------------------------------------------

    required_columns = [

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
        "status",

        "description",
        "tags",
        "published_at",
        "view_count",
        "like_count",
        "comment_count",
        "thumbnail_url",
        "category_id"
    ]


    for column in required_columns:

        if column not in df.columns:

            df[column] = ""


    # --------------------------------------------------------
    # Remove accidental empty columns
    # --------------------------------------------------------

    unwanted_columns = [
        "Unnamed: 9",
        "Unnamed: 19"
    ]

    df = df.drop(
        columns=unwanted_columns,
        errors="ignore"
    )


    # --------------------------------------------------------
    # Find rows with missing metadata
    # --------------------------------------------------------

    rows_to_process = []

    for index, row in df.iterrows():

        subtopic = str(
            row["subtopic"]
        ).strip()

        level = str(
            row["level"]
        ).strip()

        language = str(
            row["language"]
        ).strip()


        # Only process rows where at least
        # one field is missing

        if (
            not subtopic
            or not level
            or not language
        ):

            rows_to_process.append(index)


    print(
        f"Total resources: {len(df)}"
    )

    print(
        f"Resources requiring classification: "
        f"{len(rows_to_process)}"
    )

    print()


    # --------------------------------------------------------
    # Classification
    # --------------------------------------------------------

    processed = 0

    failed = 0


    for index in rows_to_process:

        row = df.loc[index]

        print("-" * 70)

        print(
            f"[{processed + failed + 1}/"
            f"{len(rows_to_process)}]"
        )

        print(
            f"Resource ID: "
            f"{row['resource_id']}"
        )

        print(
            f"Title: "
            f"{row['title']}"
        )

        print(
            f"Topic: "
            f"{row['topic']}"
        )


        try:

            result = classify_resource(row)


            # ------------------------------------------------
            # IMPORTANT:
            # Only fill missing fields.
            # Existing values are preserved.
            # ------------------------------------------------

            if not str(
                df.at[index, "subtopic"]
            ).strip():

                df.at[index, "subtopic"] = (
                    "|".join(
                        result["subtopics"]
                    )
                )


            if not str(
                df.at[index, "level"]
            ).strip():

                df.at[index, "level"] = (
                    result["level"]
                )


            if not str(
                df.at[index, "language"]
            ).strip():

                df.at[index, "language"] = (
                    result["language"]
                )


            print(
                "Subtopic:",
                df.at[index, "subtopic"]
            )

            print(
                "Level:",
                df.at[index, "level"]
            )

            print(
                "Language:",
                df.at[index, "language"]
            )


            processed += 1


            # ------------------------------------------------
            # Save progress
            # ------------------------------------------------

            if processed % SAVE_EVERY == 0:

                df.to_csv(
                    OUTPUT_FILE,
                    index=False,
                    encoding="utf-8-sig"
                )

                print(
                    "Progress saved."
                )


            # Small delay
            time.sleep(0.5)


        except Exception as error:

            failed += 1

            print(
                "ERROR:",
                error
            )

            print(
                "Skipping this resource."
            )


    # --------------------------------------------------------
    # Final save
    # --------------------------------------------------------

    df.to_csv(
        OUTPUT_FILE,
        index=False,
        encoding="utf-8-sig"
    )


    # --------------------------------------------------------
    # Final statistics
    # --------------------------------------------------------

    remaining_subtopics = (
        df["subtopic"]
        .astype(str)
        .str.strip()
        .eq("")
        .sum()
    )

    remaining_levels = (
        df["level"]
        .astype(str)
        .str.strip()
        .eq("")
        .sum()
    )

    remaining_languages = (
        df["language"]
        .astype(str)
        .str.strip()
        .eq("")
        .sum()
    )


    print()

    print("=" * 70)
    print("CLASSIFICATION COMPLETE")
    print("=" * 70)

    print(
        f"Total resources: {len(df)}"
    )

    print(
        f"Successfully processed: {processed}"
    )

    print(
        f"Failed: {failed}"
    )

    print()

    print(
        f"Missing subtopics: "
        f"{remaining_subtopics}"
    )

    print(
        f"Missing levels: "
        f"{remaining_levels}"
    )

    print(
        f"Missing languages: "
        f"{remaining_languages}"
    )

    print()

    print(
        f"Output: {OUTPUT_FILE}"
    )

    print("=" * 70)


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":
    main()