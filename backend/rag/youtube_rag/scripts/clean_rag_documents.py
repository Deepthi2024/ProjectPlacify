import json
import re
from pathlib import Path


# ============================================================
# CONFIGURATION
# ============================================================

INPUT_FILE = Path("data/rag_documents.json")
OUTPUT_FILE = Path("data/rag_documents_cleaned.json")


# ============================================================
# REGEX PATTERNS
# ============================================================

URL_PATTERN = re.compile(
    r"https?://\S+|www\.\S+",
    re.IGNORECASE
)

HASHTAG_PATTERN = re.compile(
    r"(?<!\w)#\w+"
)

MULTIPLE_SPACES = re.compile(r"[ \t]+")
MULTIPLE_NEWLINES = re.compile(r"\n{3,}")


# Lines that are usually promotional/social-media noise.
PROMOTIONAL_PATTERNS = [
    r"\bsubscribe\b",
    r"\bsubscribers\b",
    r"\bfollow me\b",
    r"\bfollow us\b",
    r"\bconnect with me\b",
    r"\bconnect with us\b",
    r"\binstagram\b",
    r"\btwitter\b",
    r"\bx\.com\b",
    r"\bfacebook\b",
    r"\blinkedin\b",
    r"\bdiscord\b",
    r"\btelegram\b",
    r"\bpatreon\b",
    r"\bbuy me a coffee\b",
    r"\bdonate\b",
    r"\bsupport the channel\b",
    r"\bsupport me\b",
    r"\bsponsor\b",
    r"\bsponsorship\b",
    r"\bbusiness inquiries\b",
    r"\baffiliate\b",
    r"\bpromo code\b",
    r"\buse code\b",
    r"\bdiscount code\b",
    r"\bjoin my\b",
    r"\bjoin our\b",
    r"\bcheck out my other\b",
    r"\bcheck out our other\b",
]

PROMOTIONAL_PATTERN = re.compile(
    "|".join(PROMOTIONAL_PATTERNS),
    re.IGNORECASE
)


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def remove_urls(text):
    """
    Remove URLs while preserving surrounding educational text.
    """

    text = URL_PATTERN.sub("", text)

    return text


def clean_hashtags(text):
    """
    Remove hashtags.

    Example:
        #react #javascript #webdevelopment
    becomes empty text.

    Normal words remain untouched.
    """

    text = HASHTAG_PATTERN.sub("", text)

    return text


def is_promotional_line(line):
    """
    Determine whether a complete line is primarily promotional.
    """

    stripped = line.strip()

    if not stripped:
        return False

    # If the line contains promotional language,
    # remove the line.
    if PROMOTIONAL_PATTERN.search(stripped):
        return True

    return False


def clean_description(description):
    """
    Clean a YouTube/resource description while attempting
    to preserve educational information.
    """

    if not description:
        return ""

    # Normalize line endings.
    text = description.replace("\r\n", "\n").replace("\r", "\n")

    cleaned_lines = []

    for line in text.split("\n"):

        stripped = line.strip()

        if not stripped:
            cleaned_lines.append("")
            continue

        # Remove obvious promotional lines.
        if is_promotional_line(stripped):
            continue

        # Remove URLs.
        line = remove_urls(line)

        # Remove hashtags.
        line = clean_hashtags(line)

        # Normalize spaces.
        line = MULTIPLE_SPACES.sub(" ", line).strip()

        # Ignore lines that became empty after cleaning.
        if not line:
            continue

        cleaned_lines.append(line)

    text = "\n".join(cleaned_lines)

    # Remove excessive blank lines.
    text = MULTIPLE_NEWLINES.sub("\n\n", text)

    return text.strip()


def get_description_from_text(text):
    """
    Extract the description portion from the existing RAG text.

    This is intentionally conservative.

    If the text does not contain a recognizable description
    section, return the original text.
    """

    if not text:
        return ""

    # Common headings that may appear in generated RAG text.
    patterns = [
        r"Educational Description:\s*(.*)",
        r"Description:\s*(.*)",
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            text,
            flags=re.IGNORECASE | re.DOTALL
        )

        if match:
            return match.group(1).strip()

    return text.strip()


def build_clean_text(document):
    """
    Construct a clean semantic text representation for RAG.

    Structured metadata is included because it helps the embedding
    model understand what the resource is about.

    Quality score is intentionally NOT included in the semantic text.
    """

    metadata = document.get("metadata", {})

    title = metadata.get("title", "")
    domain = metadata.get("domain", "")
    topic = metadata.get("topic", "")
    subtopics = metadata.get("subtopics", "")
    level = metadata.get("level", "")
    language = metadata.get("language", "")
    channel = metadata.get("channel", "")
    duration = metadata.get("duration_minutes", "")

    original_text = document.get("text", "")

    description = get_description_from_text(original_text)
    description = clean_description(description)

    sections = []

    if title:
        sections.append(f"Resource Title: {title}")

    if domain:
        sections.append(f"Domain: {domain}")

    if topic:
        sections.append(f"Topic: {topic}")

    if subtopics:
        sections.append(f"Subtopics: {subtopics}")

    if level:
        sections.append(f"Level: {level}")

    if language:
        sections.append(f"Language: {language}")

    if channel:
        sections.append(f"Channel/Provider: {channel}")

    if duration:
        sections.append(f"Duration: {duration} minutes")

    if description:
        sections.append(
            f"Educational Description:\n{description}"
        )

    return "\n".join(sections).strip()


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 60)
    print("PLACIFY - RAG DOCUMENT CLEANING")
    print("=" * 60)

    # --------------------------------------------------------
    # Check input file
    # --------------------------------------------------------

    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Input file not found: {INPUT_FILE}"
        )

    print(f"\nInput : {INPUT_FILE}")
    print(f"Output: {OUTPUT_FILE}")

    # --------------------------------------------------------
    # Load documents
    # --------------------------------------------------------

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        documents = json.load(f)

    if not isinstance(documents, list):
        raise ValueError(
            "Expected rag_documents.json to contain a list of documents."
        )

    print(f"\nDocuments loaded: {len(documents)}")

    # --------------------------------------------------------
    # Clean documents
    # --------------------------------------------------------

    cleaned_documents = []

    original_chars = 0
    cleaned_chars = 0

    urls_removed = 0
    promotional_lines_removed = 0
    empty_descriptions = 0

    for document in documents:

        original_text = document.get("text", "")

        original_chars += len(original_text)

        # Count URLs before cleaning.
        urls_before = len(
            URL_PATTERN.findall(original_text)
        )

        # Count promotional lines before cleaning.
        promotional_before = sum(
            1
            for line in original_text.splitlines()
            if is_promotional_line(line)
        )

        clean_text = build_clean_text(document)

        cleaned_chars += len(clean_text)

        urls_removed += urls_before
        promotional_lines_removed += promotional_before

        if not clean_text:
            empty_descriptions += 1

        # ----------------------------------------------------
        # Preserve original document structure
        # ----------------------------------------------------

        cleaned_document = {
            "resource_id": document.get("resource_id"),
            "text": clean_text,
            "metadata": document.get("metadata", {}).copy()
        }

        cleaned_documents.append(cleaned_document)

    # --------------------------------------------------------
    # Save cleaned documents
    # --------------------------------------------------------

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with open(
        OUTPUT_FILE,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            cleaned_documents,
            f,
            ensure_ascii=False,
            indent=2
        )

    # --------------------------------------------------------
    # Statistics
    # --------------------------------------------------------

    reduction = 0

    if original_chars > 0:
        reduction = (
            (original_chars - cleaned_chars)
            / original_chars
        ) * 100

    print("\n" + "=" * 60)
    print("CLEANING COMPLETE")
    print("=" * 60)

    print(f"\nDocuments processed       : {len(documents):,}")
    print(f"URLs removed              : {urls_removed:,}")
    print(
        f"Promotional lines removed : "
        f"{promotional_lines_removed:,}"
    )
    print(f"Empty cleaned documents   : {empty_descriptions:,}")

    print(f"\nOriginal characters       : {original_chars:,}")
    print(f"Cleaned characters        : {cleaned_chars:,}")
    print(f"Text reduction            : {reduction:.2f}%")

    print(f"\nCleaned file created:")
    print(OUTPUT_FILE)

    print("\nNext step:")
    print("Inspect rag_documents_cleaned.json before embeddings.")


if __name__ == "__main__":
    main()