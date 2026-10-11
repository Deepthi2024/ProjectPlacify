
import json
import re
from pathlib import Path

INPUT_FILE = Path("data/rag_documents_cleaned.json")
OUTPUT_FILE = Path("data/rag_documents_cleaned_v2.json")

URL_RE = re.compile(r"https?://\S+|www\.\S+", re.I)
HASHTAG_RE = re.compile(r"(?<!\w)#\w+")

# Strong indicators of promotional/social/unrelated content.
REMOVE_LINE_RE = re.compile(
    r"(subscribe|follow me|follow us|social media|instagram|twitter|facebook|"
    r"linkedin|discord|telegram|patreon|donate|support the channel|support me|"
    r"business inquiries|sponsor|sponsorship|affiliate|promo code|discount code|"
    r"coupon code|use code|become member|join this channel|join our channel|"
    r"membership|premium course|paid course|buy .*course|check out .*course|"
    r"earn .*income|side income|advertis|hostinger|udemy|skillshare)",
    re.I
)

# Lines that are mostly SEO/query keyword blocks.
QUERY_HEADING_RE = re.compile(
    r"^\s*(your queries|queries|search queries|keywords|seo keywords|"
    r"tags|hashtags|related searches)\s*:?\s*$",
    re.I
)

# Decorative separators.
SEPARATOR_RE = re.compile(r"^\s*[-_=*#]{5,}\s*$")

# Common copyright boilerplate.
COPYRIGHT_RE = re.compile(
    r"^\s*(copyright|all rights reserved|copyright disclaimer)\b",
    re.I
)

# Lines that explicitly point to unrelated videos/resources.
UNRELATED_HEADING_RE = re.compile(
    r"^\s*(other tutorials?|other videos?|also watch|recommended videos?|"
    r"more tutorials?|best .* videos?|learn .* in one video|"
    r"complete course|complete courses?)\s*:?\s*$",
    re.I
)

def strip_url_preserving_label(line):
    return URL_RE.sub("", line)

def clean_text(text):
    if not text:
        return ""

    lines = text.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    out = []
    skip_keyword_block = False
    skip_unrelated_block = False

    for raw in lines:
        line = raw.strip()

        if not line:
            if out and out[-1] != "":
                out.append("")
            continue

        if SEPARATOR_RE.match(line):
            continue

        if QUERY_HEADING_RE.match(line):
            skip_keyword_block = True
            continue

        if skip_keyword_block:
            # End the block when a meaningful prose/timestamp section starts.
            if re.search(r"(timestamp|time ?stamp|timeline|course contents|"
                         r"what is|in this|we will|learn|chapter|section)", line, re.I):
                skip_keyword_block = False
            else:
                continue

        if UNRELATED_HEADING_RE.match(line):
            skip_unrelated_block = True
            continue

        if skip_unrelated_block:
            # Usually a list of unrelated URLs/titles. Stop when educational
            # prose or timestamps resume.
            if re.search(r"(timestamp|timeline|course contents|"
                         r"what is|in this tutorial|we will cover|"
                         r"learn|chapter|section)", line, re.I):
                skip_unrelated_block = False
            else:
                continue

        if COPYRIGHT_RE.match(line):
            continue

        # Remove explicit promotional/social lines.
        if REMOVE_LINE_RE.search(line):
            continue

        # Remove lines that are only URLs.
        if URL_RE.fullmatch(line):
            continue

        # Remove SEO hashtags, but preserve surrounding educational text.
        line = HASHTAG_RE.sub("", line)
        line = strip_url_preserving_label(line)

        # Remove common decorative markers left behind.
        line = re.sub(r"^\s*[►➡️🔥⭐️✨📢🚀🎁❤️💻📝🌟]+\s*", "", line)
        line = re.sub(r"[ \t]+", " ", line).strip()

        if not line:
            continue

        # Drop obvious URL-only / social handle remnants.
        if re.fullmatch(r"[@#]?[A-Za-z0-9_.-]+", line) and (
            "@" in line or line.lower() in {"website", "socials", "links"}
        ):
            continue

        out.append(line)

    # Collapse blank lines.
    result = re.sub(r"\n{3,}", "\n\n", "\n".join(out)).strip()
    return result

def build_document(doc):
    md = doc.get("metadata", {})
    title = md.get("title", "")
    domain = md.get("domain", "")
    topic = md.get("topic", "")
    subtopic = md.get("subtopic", md.get("subtopics", ""))
    level = md.get("level", "")
    language = md.get("language", "")
    channel = md.get("channel", "")
    duration = md.get("duration_minutes", "")
    description = clean_text(md.get("description", ""))

    sections = [
        f"Resource Title: {title}",
        f"Domain: {domain}",
        f"Topic: {topic}",
        f"Subtopics: {subtopic}",
        f"Level: {level}",
        f"Language: {language}",
        f"Channel/Provider: {channel}",
        f"Duration: {duration} minutes",
    ]

    if description:
        sections.append(f"Educational Description:\n{description}")

    return {
        "resource_id": doc.get("resource_id"),
        "text": "\n".join(sections),
        "metadata": md.copy(),
    }

def main():
    if not INPUT_FILE.exists():
        raise FileNotFoundError(f"Missing {INPUT_FILE}")

    with INPUT_FILE.open("r", encoding="utf-8") as f:
        docs = json.load(f)

    cleaned = [build_document(d) for d in docs]

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_FILE.open("w", encoding="utf-8") as f:
        json.dump(cleaned, f, ensure_ascii=False, indent=2)

    print(f"Documents processed: {len(docs)}")
    print(f"Output: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
