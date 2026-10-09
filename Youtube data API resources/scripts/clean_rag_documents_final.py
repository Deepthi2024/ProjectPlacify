import json
import re
from pathlib import Path
from copy import deepcopy


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

INPUT = BASE_DIR / "data" / "rag_documents_cleaned_v4.json"
OUTPUT = BASE_DIR / "data" / "rag_documents_final.json"


# ============================================================
# GENERAL PATTERNS
# ============================================================

URL_RE = re.compile(
    r"https?://\S+|www\.\S+",
    re.IGNORECASE
)

TIMESTAMP_RE = re.compile(
    r"""
    ^
    (?:
        \(?\d{1,2}:\d{2}(?::\d{2})?\)? 
        |
        \d{1,2}:\d{2}(?::\d{2})?
    )
    \s*
    """,
    re.VERBOSE
)

HASHTAG_RE = re.compile(r"(?<!\w)#\w+")

EMAIL_RE = re.compile(
    r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b",
    re.IGNORECASE
)

SEPARATOR_RE = re.compile(
    r"^\s*(?:[-_=~*•·]{3,})\s*$"
)


# ============================================================
# SECTION / BLOCK HEADINGS THAT SHOULD BE REMOVED
# ============================================================

DROP_SECTION_PATTERNS = [
    # Social media
    r"^\s*follow\s+me",
    r"^\s*follow\s+us",
    r"^\s*connect\s+with\s+(?:me|us)",
    r"^\s*socials?\s*:?",
    r"^\s*social\s+media",
    r"^\s*find\s+me\s+on",
    r"^\s*our\s+social",
    r"^\s*join\s+(?:our|the)\s+(?:discord|telegram|community)",
    r"^\s*community\s*:?",
    r"^\s*contact\s+(?:me|us)",
    r"^\s*instructor\s*:?",
    r"^\s*about\s+the\s+instructor",

    # Promotions
    r"^\s*special\s+offer",
    r"^\s*exclusive\s+offer",
    r"^\s*limited\s+offer",
    r"^\s*discount",
    r"^\s*coupon",
    r"^\s*promo(?:tion)?",
    r"^\s*sponsored",
    r"^\s*advertisement",
    r"^\s*affiliate",
    r"^\s*hosting\s+(?:link|offer|deal)",
    r"^\s*hosting\s+offers?",
    r"^\s*buy\s+now",
    r"^\s*get\s+\d+%\s+off",
    r"^\s*use\s+(?:the\s+)?(?:code|coupon)",
    r"^\s*become\s+(?:a\s+)?member",
    r"^\s*membership",
    r"^\s*support\s+(?:my|our|the)\s+channel",

    # Unrelated resources
    r"^\s*best\s+.*videos?\s+for\s+learning",
    r"^\s*other\s+tutorials?",
    r"^\s*other\s+tutorial\s+links",
    r"^\s*related\s+(?:videos?|courses?|resources?)",
    r"^\s*related\s+content",
    r"^\s*recommended\s+(?:videos?|courses?|resources?)",
    r"^\s*also\s+watch",
    r"^\s*watch\s+also",
    r"^\s*you\s+may\s+also\s+like",
    r"^\s*learn\s+in\s+one\s+video",
    r"^\s*learn\s+in\s+one\s+video\s*\[\+{1,2}\]",
    r"^\s*complete\s+course\s*(?:\[playlist\])?",
    r"^\s*complete\s+courses?",
    r"^\s*other\s+courses?",
    r"^\s*our\s+courses?",
    r"^\s*our\s+other\s+courses?",
    r"^\s*check\s+out\s+our\s+(?:other\s+)?courses?",
    r"^\s*more\s+(?:courses?|tutorials?|videos?)",

    # SEO / keyword blocks
    r"^\s*your\s+queries",
    r"^\s*search\s+queries",
    r"^\s*keywords?",
    r"^\s*tags?",
    r"^\s*seo\s+keywords?",
    r"^\s*hashtags?",
    r"^\s*popular\s+searches",
    r"^\s*search\s+terms",

    # Boilerplate
    r"^\s*copyright\s+disclaimer",
    r"^\s*disclaimer",
    r"^\s*legal\s+disclaimer",
    r"^\s*fair\s+use",
]


DROP_SECTION_RE = [
    re.compile(pattern, re.IGNORECASE)
    for pattern in DROP_SECTION_PATTERNS
]


# ============================================================
# LINES THAT ARE CLEARLY PROMOTIONAL / NON-EDUCATIONAL
# ============================================================

PROMO_LINE_PATTERNS = [
    # Social
    r"\bsubscribe\b",
    r"\bfollow\s+(?:me|us)\b",
    r"\blike\s+(?:this\s+)?video\b",
    r"\bcomment\s+(?:below|down)\b",
    r"\bnotification\s+bell\b",
    r"\bjoin\s+(?:our|the)\s+(?:discord|telegram|community)\b",
    r"\bdiscord\s+server\b",
    r"\btelegram\b",
    r"\binstagram\b",
    r"\bfacebook\b",
    r"\btwitter\b",
    r"\blinkedin\b",
    r"\btiktok\b",

    # Promotional language
    r"\baffiliate\s+link\b",
    r"\baffiliate\b",
    r"\bsponsored\b",
    r"\bsponsor\b",
    r"\bdiscount\b",
    r"\bcoupon\s+code\b",
    r"\bpromo\s+code\b",
    r"\buse\s+code\b",
    r"\bget\s+\d+%\s+off\b",
    r"\bspecial\s+offer\b",
    r"\bexclusive\s+offer\b",
    r"\blimited\s+offer\b",
    r"\bbuy\s+(?:now|here)\b",
    r"\bfree\s+download\b",
    r"\bfree\s+resource\b",
    r"\bfree\s+cheat\s*sheet\b",
    r"\bdownload\s+(?:our|my|the)\s+(?:notes|course|resource|bundle)\b",
    r"\bjoin\s+(?:my|our)\s+membership\b",

    # Commercial platforms / ads
    r"\bhostinger\b",
    r"\bwix\s+adi\b",
    r"\bwix\b.*\bwebsite\b",
    r"\bomnisend\b",
    r"\bxstore\b",
    r"\benvato\b",
    r"\budemy\b.*\bcourse\b",
    r"\bfreemote\b",
    r"\bmarketing\s+automation\b",
    r"\becommerce\s+businesses\b",

    # Channel/site promotion
    r"\bvisit\s+(?:our|my)\s+website\b",
    r"\bcheck\s+out\s+my\s+(?:website|channel)\b",
    r"\bcheck\s+out\s+our\s+(?:website|channel)\b",
    r"\bmy\s+english\s+channel\b",
    r"\bcheckout\s+my\s+english\s+channel\b",
    r"\bpersonal\s+facebook\b",
    r"\bsupport\s+(?:the|my|our)\s+channel\b",
    r"\bbecome\s+(?:a\s+)?member\b",

    # Generic promotional copy
    r"\bdon'?t\s+miss\s+out\b",
    r"\bgrab\s+(?:your|a)\b.*\b(now|today)\b",
    r"\bget\s+started\s+today\b.*\bfree\b",
]


PROMO_LINE_RE = [
    re.compile(pattern, re.IGNORECASE)
    for pattern in PROMO_LINE_PATTERNS
]


# ============================================================
# EXPLICIT UNRELATED RESOURCE DETECTION
# ============================================================

UNRELATED_TECH = [
    "python",
    "java",
    "c++",
    "c language",
    "ruby",
    "php",
    "kotlin",
    "swift",
    "flutter",
    "django",
    "machine learning",
    "deep learning",
    "data science",
    "numpy",
    "pandas",
    "android development",
    "linux",
    "web scraping",
    "spring boot",
    "jenkins",
    "maven",
    "jdbc",
    "junit",
]


def looks_like_unrelated_resource(line: str) -> bool:
    """
    Detect common YouTube description lines that recommend
    unrelated courses/tutorials/playlists.

    This deliberately avoids deleting ordinary educational
    sentences that merely mention another technology.
    """

    lower = line.lower()

    # A direct URL-only line is never useful inside semantic text.
    if URL_RE.fullmatch(line.strip()):
        return True

    # Strong recommendation phrases.
    recommendation_words = [
        "learn ",
        "tutorial",
        "course",
        "complete course",
        "playlist",
        "full course",
        "watch ",
        "check out",
        "also watch",
    ]

    has_recommendation = any(
        phrase in lower
        for phrase in recommendation_words
    )

    if not has_recommendation:
        return False

    # Explicit unrelated technology recommendation.
    for tech in UNRELATED_TECH:
        if tech in lower:
            return True

    return False


# ============================================================
# SECTION HEADING DETECTION
# ============================================================

def is_drop_heading(line: str) -> bool:
    cleaned = line.strip()

    if not cleaned:
        return False

    for regex in DROP_SECTION_RE:
        if regex.search(cleaned):
            return True

    return False


# ============================================================
# PROMOTIONAL LINE DETECTION
# ============================================================

def is_promotional_line(line: str) -> bool:
    cleaned = line.strip()

    if not cleaned:
        return False

    lower = cleaned.lower()

    # Pure URL
    if URL_RE.fullmatch(cleaned):
        return True

    # Email address
    if EMAIL_RE.fullmatch(cleaned):
        return True

    # Social handle
    if re.fullmatch(r"@[\w.-]+", cleaned):
        return True

    # Promotional patterns
    for regex in PROMO_LINE_RE:
        if regex.search(cleaned):
            return True

    # Lines that consist almost entirely of hashtags.
    hashtags = HASHTAG_RE.findall(cleaned)
    if hashtags and len(hashtags) >= 1:
        remainder = HASHTAG_RE.sub("", cleaned)
        remainder = re.sub(r"[\s|,;•·]+", "", remainder)
        if len(remainder) < 15:
            return True

    # Coupon-code style line.
    if re.search(
        r"\b(?:coupon|discount)\s+code\b",
        lower
    ):
        return True

    return False


# ============================================================
# TIMESTAMP HANDLING
# ============================================================

def is_timestamp_line(line: str) -> bool:
    """
    Preserve timestamp/chapter lines because they are useful
    semantic information for resource retrieval.
    """

    stripped = line.strip()

    if not stripped:
        return False

    return bool(
        re.match(
            r"""
            ^
            (?:
                [#⭐️⌚⏱️🎯🔹➡️👉\s-]*
            )
            (?:
                \[?\d{1,2}:\d{2}(?::\d{2})?\]?
                |
                \(\d{1,2}:\d{2}(?::\d{2})?\)
            )
            """,
            stripped,
            re.VERBOSE
        )
    )


# ============================================================
# CLEAN URL / HASH / SYMBOL NOISE
# ============================================================

def clean_inline_noise(line: str) -> str:
    """
    Remove URLs and hashtags from otherwise useful educational
    sentences.
    """

    line = URL_RE.sub("", line)
    line = HASHTAG_RE.sub("", line)

    # Remove excessive YouTube formatting symbols.
    line = re.sub(
        r"^[\s►➡️👉⭐️🔥🚀🎯📚💻❤️❗️❗📢✨🎁📝🛠️🌐🧑‍💻✌️]+",
        "",
        line
    )

    # Remove dangling punctuation caused by URL removal.
    line = re.sub(r"\s+([,.;:])", r"\1", line)

    # Collapse whitespace.
    line = re.sub(r"[ \t]+", " ", line)

    return line.strip()


# ============================================================
# EDUCATIONAL TIMESTAMP NORMALIZATION
# ============================================================

def normalize_timestamp(line: str) -> str:
    """
    Preserve the original timestamp information while removing
    decorative symbols.
    """

    line = line.strip()

    line = re.sub(
        r"^[#⭐️⌚⏱️🎯🔹➡️👉\s-]+",
        "",
        line
    )

    line = re.sub(
        r"^\((\d{1,2}:\d{2}(?::\d{2})?)\)",
        r"\1",
        line
    )

    line = re.sub(
        r"^\[(\d{1,2}:\d{2}(?::\d{2})?)\]",
        r"\1",
        line
    )

    line = re.sub(r"\s+", " ", line)

    return line.strip()


# ============================================================
# BLOCK CLEANING
# ============================================================

def clean_description(description: str) -> str:

    if not description:
        return ""

    lines = description.replace("\r\n", "\n").replace("\r", "\n").split("\n")

    cleaned = []

    drop_mode = False

    for raw_line in lines:

        line = raw_line.strip()

        # ----------------------------------------------------
        # Empty lines
        # ----------------------------------------------------

        if not line:
            # Preserve paragraph boundaries only when useful.
            if cleaned and cleaned[-1] != "":
                cleaned.append("")
            continue

        # ----------------------------------------------------
        # Separators
        # ----------------------------------------------------

        if SEPARATOR_RE.match(line):
            continue

        # ----------------------------------------------------
        # Timestamp / chapter lines MUST survive
        # ----------------------------------------------------

        if is_timestamp_line(line):
            drop_mode = False

            timestamp = normalize_timestamp(line)

            if timestamp:
                cleaned.append(timestamp)

            continue

        # ----------------------------------------------------
        # Detect a section that should be discarded
        # ----------------------------------------------------

        if is_drop_heading(line):
            drop_mode = True
            continue

        # ----------------------------------------------------
        # If inside a promotional/resource section,
        # determine whether the current line still belongs
        # to that block.
        # ----------------------------------------------------

        if drop_mode:

            # A timestamp indicates the beginning of useful
            # educational material again.
            if is_timestamp_line(line):
                drop_mode = False

            # A new obviously educational paragraph should end
            # the drop block.
            elif (
                len(line) > 100
                and not is_promotional_line(line)
                and not looks_like_unrelated_resource(line)
            ):
                drop_mode = False

            else:
                continue

        # ----------------------------------------------------
        # Promotional line
        # ----------------------------------------------------

        if is_promotional_line(line):
            continue

        # ----------------------------------------------------
        # Unrelated course/resource recommendation
        # ----------------------------------------------------

        if looks_like_unrelated_resource(line):
            continue

        # ----------------------------------------------------
        # URL removal from mixed educational text
        # ----------------------------------------------------

        line = clean_inline_noise(line)

        if not line:
            continue

        # ----------------------------------------------------
        # Remove obvious standalone labels whose useful
        # information is already represented by metadata.
        # ----------------------------------------------------

        if re.fullmatch(
            r"(?:download\s+)?(?:notes?|handbook|cheatsheet|"
            r"source\s+code|resources?|resource\s+links?)\s*:?",
            line,
            re.IGNORECASE
        ):
            continue

        # ----------------------------------------------------
        # Remove isolated promotional labels
        # ----------------------------------------------------

        if re.fullmatch(
            r"(?:project\s+preview|your\s+queries|hashtags?|"
            r"socials?|instructor|website|contact)\s*:?",
            line,
            re.IGNORECASE
        ):
            continue

        cleaned.append(line)

    # ========================================================
    # NORMALIZE OUTPUT
    # ========================================================

    final_lines = []

    for line in cleaned:

        line = line.strip()

        if not line:
            if final_lines and final_lines[-1] != "":
                final_lines.append("")
            continue

        # Remove accidental duplicate spaces.
        line = re.sub(r"\s+", " ", line)

        # Remove leftover leading/trailing separators.
        line = line.strip(" |•·")

        if not line:
            continue

        # Avoid exact duplicate consecutive lines.
        if final_lines and final_lines[-1] == line:
            continue

        final_lines.append(line)

    # Remove leading/trailing blank lines.
    while final_lines and final_lines[0] == "":
        final_lines.pop(0)

    while final_lines and final_lines[-1] == "":
        final_lines.pop()

    return "\n".join(final_lines)


# ============================================================
# VALIDATION
# ============================================================

def contains_url(text: str) -> bool:
    return bool(URL_RE.search(text))


def contains_social_noise(text: str) -> bool:

    patterns = [
        r"\binstagram\b",
        r"\bfacebook\b",
        r"\btwitter\b",
        r"\blinkedin\b",
        r"\btelegram\b",
        r"\bdiscord\b",
        r"\bsubscribe\b",
        r"\bfollow\s+me\b",
        r"\bfollow\s+us\b",
    ]

    return any(
        re.search(pattern, text, re.IGNORECASE)
        for pattern in patterns
    )


def contains_promotion_noise(text: str) -> bool:

    patterns = [
        r"\baffiliate\b",
        r"\bsponsored\b",
        r"\bcoupon\s+code\b",
        r"\bdiscount\b",
        r"\bhostinger\b",
        r"\bomnisend\b",
        r"\bxstore\b",
        r"\bwix\b",
        r"\bfreemote\b",
        r"\bmarketing\s+automation\b",
    ]

    return any(
        re.search(pattern, text, re.IGNORECASE)
        for pattern in patterns
    )


def contains_seo_noise(text: str) -> bool:

    patterns = [
        r"\byour queries\b",
        r"\bsearch queries\b",
        r"\bkeywords?\s*:",
        r"\bhashtags?\s*:",
    ]

    if any(
        re.search(pattern, text, re.IGNORECASE)
        for pattern in patterns
    ):
        return True

    # Hashtag blocks
    lines = text.splitlines()

    for line in lines:
        tags = HASHTAG_RE.findall(line)

        if len(tags) >= 3:
            return True

    return False


def contains_copyright_noise(text: str) -> bool:

    patterns = [
        r"\bcopyright disclaimer\b",
        r"\bintellectual property\b",
        r"\ball rights reserved\b",
        r"\bmay not be reproduced\b",
    ]

    return any(
        re.search(pattern, text, re.IGNORECASE)
        for pattern in patterns
    )


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 70)
    print("Placify - FINAL RAG Document Cleaning")
    print("=" * 70)

    print(f"Input : {INPUT}")
    print(f"Output: {OUTPUT}")

    if not INPUT.exists():
        raise FileNotFoundError(
            f"\nInput file not found:\n{INPUT}\n\n"
            "Make sure rag_documents_cleaned_v4.json exists "
            "inside the data folder."
        )

    # --------------------------------------------------------
    # Load
    # --------------------------------------------------------

    docs = json.loads(
        INPUT.read_text(encoding="utf-8")
    )

    print(f"\nInput documents: {len(docs)}")

    output_docs = []

    # Statistics
    empty_before = 0
    empty_after = 0

    for doc in docs:

        # Deep copy guarantees metadata remains unchanged.
        new_doc = deepcopy(doc)

        metadata = new_doc.get("metadata", {})

        description = metadata.get(
            "description",
            ""
        ) or ""

        old_text = new_doc.get(
            "text",
            ""
        ) or ""

        if not old_text.strip():
            empty_before += 1

        # IMPORTANT:
        # Always clean from ORIGINAL metadata.description,
        # rather than repeatedly cleaning previous output.
        cleaned_text = clean_description(description)

        new_doc["text"] = cleaned_text

        if not cleaned_text.strip():
            empty_after += 1

        output_docs.append(new_doc)

    # --------------------------------------------------------
    # Validation
    # --------------------------------------------------------

    url_count = 0
    social_count = 0
    promo_count = 0
    seo_count = 0
    copyright_count = 0

    non_empty = 0
    total_chars = 0

    for doc in output_docs:

        text = doc.get("text", "") or ""

        if text.strip():
            non_empty += 1
            total_chars += len(text)

        if contains_url(text):
            url_count += 1

        if contains_social_noise(text):
            social_count += 1

        if contains_promotion_noise(text):
            promo_count += 1

        if contains_seo_noise(text):
            seo_count += 1

        if contains_copyright_noise(text):
            copyright_count += 1

    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    OUTPUT.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    OUTPUT.write_text(
        json.dumps(
            output_docs,
            ensure_ascii=False,
            indent=2
        ),
        encoding="utf-8"
    )

    # --------------------------------------------------------
    # Report
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("FINAL CLEANING REPORT")
    print("=" * 70)

    print(f"Documents                    : {len(output_docs)}")
    print(f"Non-empty educational texts  : {non_empty}")
    print(f"Empty texts                  : {len(output_docs) - non_empty}")
    print(f"Total educational characters : {total_chars}")

    print("\nResidual-noise validation:")
    print(f"URLs in text                 : {url_count}")
    print(f"Social noise                 : {social_count}")
    print(f"Promotional noise            : {promo_count}")
    print(f"SEO/query noise              : {seo_count}")
    print(f"Copyright noise              : {copyright_count}")

    print("\n" + "=" * 70)

    if (
        url_count == 0
        and social_count == 0
        and promo_count == 0
        and seo_count == 0
        and copyright_count == 0
    ):
        print("STATUS: EMBEDDING READY")
    else:
        print(
            "STATUS: REVIEW REQUIRED"
        )

    print("=" * 70)

    print(f"\nFinal file:")
    print(OUTPUT)


if __name__ == "__main__":
    main()