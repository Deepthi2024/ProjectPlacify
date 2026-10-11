import json
import re
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
INPUT_CANDIDATES = [
    BASE / "rag_documents_cleaned_v2.json",
    BASE / "data" / "rag_documents_cleaned_v2.json",
    BASE / "scripts" / "rag_documents_cleaned_v2.json",
]

def find_input_file():
    for candidate in INPUT_CANDIDATES:
        if candidate.exists():
            return candidate

    matches = sorted(BASE.rglob("rag_documents_cleaned*.json"))
    if matches:
        return matches[0]

    searched = "\n".join(str(p) for p in INPUT_CANDIDATES)
    raise FileNotFoundError(
        "Could not find the input JSON file.\n"
        f"Searched:\n{searched}\n"
        f"Also checked under: {BASE}\n"
        "Make sure rag_documents_cleaned_v2.json exists in the project root or update the path."
    )

INPUT = find_input_file()
OUTPUT = BASE / "rag_documents_cleaned_v3.json"

# Section headings whose contents are generally navigation, promotion,
# social/SEO material, or unrelated-resource lists rather than the lesson itself.
DROP_SECTION_PATTERNS = [
    r"^\s*(socials?|social media|follow me|follow us|connect with us)\b",
    r"^\s*(other tutorial links?|other tutorials?|related tutorials?)\b",
    r"^\s*(best .*videos? for learning programming)\b",
    r"^\s*(learn in one video|complete course\s*\[?playlist\]?)\b",
    r"^\s*(your queries|queries|keywords?|seo|hashtags?)\b",
    r"^\s*(offers?|special offers?|discounts?|coupon|promo(?:tion)?s?)\b",
    r"^\s*(copyright|copyright disclaimer|disclaimer)\b",
    r"^\s*(related courses?|recommended courses?|more courses?)\b",
    r"^\s*(our courses?|courses? offered)\b",
    r"^\s*(instructor|contact|contact us)\b",
]

# Section headings that are useful labels but should not cause us to discard
# the following educational material.
KEEP_SECTION_PATTERNS = [
    r"^\s*(project preview|assignments?|assignment|source code|notes?|handbook|cheat ?sheet)\s*:?\s*$",
    r"^\s*(highlights?|what you will learn|learning objectives?|course content|contents?)\s*:?\s*$",
    r"^\s*(chapters?|timestamps?|time stamps?)\s*:?\s*$",
]

PROMO_LINE_PATTERNS = [
    r"\bsubscribe\b", r"\bsubscribers?\b", r"\bjoin (our|the) (community|telegram|discord)\b",
    r"\bfree (download|resource|cheat ?sheet)\b",
    r"\b(get|grab|claim) (this|the) (course|resource).{0,50}\b(discount|% off|coupon)\b",
    r"\b(use|apply) (code|coupon)\b",
    r"\b\d{1,3}%\s*(off|discount)\b",
    r"\baffiliate\b", r"\bsponsored\b", r"\bpartner(ed)? with\b",
    r"\bhosting\b.{0,60}\b(discount|offer|coupon)\b",
    r"\b(omnisend|wix adi|hostinger)\b",
    r"\bvisit our website\b", r"\bfollow us\b", r"\bfollow me\b",
    r"\bcomment below\b", r"\blet me know in the comments\b",
]

UNRELATED_RESOURCE_PATTERNS = [
    r"^\s*(python|c|c\+\+|java|php|ruby|go|golang|kotlin|swift|flutter|django|machine learning|data science)\b.*\b(course|tutorial|playlist)\b",
    r"^\s*(learn|watch|check out|also watch).{0,40}\b(python|c language|java|php|django|machine learning|data science)\b",
]

URL_ONLY = re.compile(r"^\s*(?:https?://|www\.)\S+\s*$", re.I)
TIMESTAMP = re.compile(r"^\s*(?:\d{1,2}:)?\d{1,2}:\d{2}\b")
HEADING = re.compile(r"^\s*(?:#{1,6}\s*)?([A-Za-z][A-Za-z0-9 &'’+/\-\[\]\(\),.:]{1,100})\s*:?\s*$")

def matches_any(text, patterns):
    return any(re.search(p, text, re.I) for p in patterns)

def normalize(line):
    line = re.sub(r"\s+", " ", line).strip()
    line = re.sub(r"^\s*[-•*]\s*", "", line)
    return line

def clean_description(text):
    if not text:
        return ""

    lines = text.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    result = []
    drop_mode = False

    for raw in lines:
        line = normalize(raw)
        if not line:
            if result and result[-1] != "":
                result.append("")
            continue

        # Timestamps are high-value curriculum structure. Never discard them
        # merely because their topic name contains a common promo word.
        if TIMESTAMP.match(line):
            drop_mode = False
            result.append(line)
            continue

        # URL-only lines are noise; labels such as "Source code:" are retained.
        if URL_ONLY.match(line):
            continue

        # Detect explicit section headings.
        if matches_any(line, DROP_SECTION_PATTERNS):
            drop_mode = True
            continue

        if matches_any(line, KEEP_SECTION_PATTERNS):
            drop_mode = False
            result.append(line.rstrip(":"))
            continue

        # A new heading-like line can end a dropped section if it is not itself
        # a known promotional heading. This prevents over-dropping later lesson text.
        if drop_mode:
            if HEADING.match(line) and not re.search(r"https?://|www\.", line, re.I):
                if len(line.split()) <= 10 and not matches_any(line, PROMO_LINE_PATTERNS):
                    drop_mode = False
                else:
                    continue
            else:
                continue

        # Remove obvious standalone promo/social lines.
        if matches_any(line, PROMO_LINE_PATTERNS):
            continue

        # Remove SEO/query lists and unrelated-resource bullets.
        if matches_any(line, UNRELATED_RESOURCE_PATTERNS):
            continue

        # Hashtag-heavy / keyword-heavy blocks.
        if len(re.findall(r"#[A-Za-z0-9_]+", line)) >= 2:
            continue
        if re.match(r"^\s*(keywords?|tags?|search queries?)\s*[:\-]", line, re.I):
            continue

        # Strip hashtags from otherwise useful prose.
        line = re.sub(r"#[A-Za-z0-9_]+", "", line).strip()

        # Remove obvious URL fragments while preserving surrounding text.
        line = re.sub(r"https?://\S+|www\.\S+", "", line, flags=re.I).strip()
        line = re.sub(r"\s{2,}", " ", line)

        if line:
            result.append(line)

    # Collapse blank lines and remove duplicate adjacent lines.
    cleaned = []
    for line in result:
        if line == "" and (not cleaned or cleaned[-1] == ""):
            continue
        if line and cleaned and line == cleaned[-1]:
            continue
        cleaned.append(line)

    while cleaned and cleaned[0] == "":
        cleaned.pop(0)
    while cleaned and cleaned[-1] == "":
        cleaned.pop()

    return "\n".join(cleaned)

def main():
    with INPUT.open("r", encoding="utf-8") as f:
        docs = json.load(f)

    cleaned_docs = []
    for doc in docs:
        metadata = doc.get("metadata", {})
        source = metadata.get("description") or doc.get("text", "")
        new_doc = {
            "resource_id": doc.get("resource_id"),
            "text": clean_description(source),
            "metadata": metadata,
        }
        cleaned_docs.append(new_doc)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", encoding="utf-8") as f:
        json.dump(cleaned_docs, f, ensure_ascii=False, indent=2)

    print(f"Input documents: {len(docs)}")
    print(f"Output documents: {len(cleaned_docs)}")
    print(f"Saved: {OUTPUT}")

if __name__ == "__main__":
    main()