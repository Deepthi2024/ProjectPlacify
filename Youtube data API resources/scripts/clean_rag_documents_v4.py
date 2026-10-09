import json, re
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent

INPUT = BASE_DIR / "data" / "rag_documents_cleaned_v3.json"
OUTPUT = BASE_DIR / "data" / "rag_documents_cleaned_v4.json"

# V4: block-aware, conservative semantic cleaning. Metadata is never modified.
SECTION_DROP = [
    r'^(?:►|[-*•])?\s*(?:checkout|check out|follow|connect|socials?|find me|contact|join our|community)\b',
    r'^other\s+(?:tutorial|video|resource|course|links?)\b',
    r'^(?:best|top)\s+(?:hindi|english)?\s*(?:videos?|courses?|resources?|tutorials?)\b',
    r'^(?:learn|watch|check out)\s+(?:in one video|these videos?|the following)\b',
    r'^(?:complete|full)\s+(?:course|playlist)\b',
    r'^(?:related|recommended|more)\s+(?:videos?|courses?|tutorials?|resources?)\b',
    r'^(?:our|my|this)\s+(?:courses?|programs?|bootcamps?)\b',
    r'^(?:queries|keywords?|search queries|seo|hashtags?)\s*[:#-]?$',
    r'^(?:disclaimer|copyright)\b',
    r'^(?:instructor|teacher|trainer|author)\s*[:=-]',
    r'^\s*(?:socials?|social\s+links?|social\s+media\s+links?|follow\s+me|connect\s+with\s+me)\s*[:=-]?\s*$',
    r'^.*\b(?:ai\s+accelerator|microsoft\s+azure|iitb|e-post\s+graduate)\b.*\b(?:program|course|diploma)\b.*$',
    r'^.*\b(?:our|my)\s+world\s+best\s+(?:css|javascript|html)\s+course\b.*$',
    r'^.*\b(?:hosting|source\s+code)\b.*\b(?:offer|offers|update|buy|premium)\b.*$',
    r'^\s*(?:my\s+)?(?:instagram|facebook|twitter|linkedin|telegram|discord|whatsapp)(?:\s+links?)?\s*[:=-]?\s*$',
]

PROMO_LINE = [
    r'^(?:instagram|facebook|twitter|linkedin|telegram|discord|socials?)\s*[:=-]?\s*$', r'\bsubscribe\b', r'\bsubscribed\b', r'\bfree\s+(?:download|resource|resources|cheat\s*sheet)\b',
    r'\bdownload\s+(?:the\s+)?(?:notes?|handbook|cheat\s*sheet|source\s*code|premium|bundle)\b',
    r'\bdiscount\b', r'\bcoupon\b', r'\bpromo(?:tion|code)?\b', r'\baffiliate\b', r'\bsponsored\b',
    r'\bhosting\s+(?:plan|offer|deal|promo)\b', r'\bvisit\s+(?:our|my)\s+website\b', r'\b(?:check|visit)\s+my\s+(?:instagram|facebook|twitter|linkedin)\b', r'\b(?:my\s+)?(?:instagram|facebook|twitter|linkedin|telegram|discord|whatsapp)\s*[:=-]',
    r'\bfollow\s+(?:us|me)\b', r'\bjoin\s+(?:our|the)\s+(?:community|group)\b', r'\b(?:discord|telegram)\s+(?:server|community|group)\b',
    r'\b(?:wix|omn?isend|xstore)\b', r'\bpremium\s+(?:html\s+)?source\s+code\b', r'\b(?:also\s+don.?t\s+forget|don.?t\s+forget\s+to\s+watch)\b', r'^.*\bsponsor(?:ed)?\b.*\bhostinger\b.*$', r'\bfreelanc(?:e|ing)\b', r'\bfree\s+programming\s+cheat\s*sheet',
    r'\b(?:career|placement|job)\s+(?:program|bootcamp|course)\b', r'\b(?:accelerator|e-post graduate|post graduate|ai-powered)\s+(?:program|course)\b', r'^(?:download(?:\s+(?:vs\s*code|visual\s+studio\s+code|the\s+editor))?|source\s+code|handwritten\s+notes?|html\s+cheatsheet|cheatsheet|code|notes?|handbook|resources?|update)\s*[:=-]?\s*.*$',
]
UNRELATED = [
    r'\b(?:python|java|c\+\+|\bc\b|php|ruby|golang|go|kotlin|swift|flutter|django|machine\s+learning|data\s+science)\b',
]
URL_ONLY = re.compile(r'^\s*(?:https?://|www\.|[\w.-]+\.(?:com|org|net|in)(?:/|$))', re.I)
TIMESTAMP = re.compile(r'^\s*(?:\d{1,2}:)?\d{1,2}:\d{2}\b')
HEADING = re.compile(r'^\s*[^.!?]{1,90}:\s*$')
BULLET_LINK = re.compile(r'^\s*(?:[-*•►]|\d+[.)])\s*.*(?:https?://|www\.)', re.I)
HASH = re.compile(r'#\w+')

# Lines that introduce a list of external links. Once encountered, drop until a clearly educational
# section/timestamp appears. This handles common YouTube description layouts better than line regexes alone.
LIST_START = [
    r'\bother\s+(?:tutorial|video|resource|course)\s+links?\b',
    r'\bview\s+the\s+(?:whole|full)\s+playlist\b',
    r'\b(?:best|top)\s+(?:hindi|english)?\s*(?:videos?|courses?|resources?|tutorials?)\b',
    r'\b(?:learn|watch)\s+(?:more|these|the following)\b',
    r'\brelated\s+(?:videos?|courses?|tutorials?|resources?)\b',
    r'\b(?:complete|full)\s+(?:course|playlist)\b',
    r'\b(?:also\s+don.?t\s+forget|don.?t\s+forget\s+to\s+watch)\b',
    r'\b(?:our|my)\s+world\s+best\s+(?:css|javascript|html)\s+course\b',
]
EDU_ANCHOR = [
    r'^\s*(?:timestamps?|chapters?|course\s+content|what\s+you.?ll\s+learn|learning\s+objectives?|highlights?|curriculum|contents?)\b',
    r'^\s*(?:\d{1,2}:)?\d{1,2}:\d{2}\b',
    r'^\s*(?:what is|what are|how to|in this video|in this tutorial|welcome to|this course|this tutorial|html stands for|css stands for|javascript stands for)\b',
]

def matches_any(text, patterns):
    return any(re.search(p, text, re.I) for p in patterns)

def clean_description(text):
    if not text:
        return ''
    lines = [re.sub(r'\s+', ' ', x).strip() for x in text.splitlines()]
    out=[]
    drop_block=False
    for raw in lines:
        if not raw:
            if out and out[-1] != '': out.append('')
            continue
        line = raw
        # Remove URLs and hashtags from retained educational prose.
        line = re.sub(r'https?://\S+|www\.\S+', '', line, flags=re.I).strip()
        line = HASH.sub('', line).strip()
        line = re.sub(r'\s{2,}', ' ', line).strip(' -|•►')
        if not line:
            continue

        # Timestamp lines are highly valuable for retrieval; always preserve.
        if TIMESTAMP.match(line):
            drop_block=False
            out.append(line)
            continue

        # Start/drop external-resource blocks.
        if matches_any(line, LIST_START) or matches_any(line, SECTION_DROP):
            drop_block=True
            continue

        # A strong educational anchor ends a dropped list/block.
        if drop_block and matches_any(line, EDU_ANCHOR):
            drop_block=False
        elif drop_block:
            continue

        # Drop standalone headings whose purpose is clearly non-educational.
        if matches_any(line, SECTION_DROP):
            continue

        # Drop obvious promotional lines/ads and resource-link labels.
        if matches_any(line, PROMO_LINE):
            continue
        # Social/contact link lines: drop short link labels and community/contact calls,
        # but preserve genuine technical phrases such as 'Twitter card' or 'social media website'.
        if len(line) <= 140 and re.search(r'\b(?:social(?:s|\s+media)?|instagram|facebook|twitter|linkedin|telegram|discord|whatsapp)\b', line, re.I):
            if re.search(r'\b(?:link|links|page|id|channel|community|server|contact|follow|join|chat|connect|find me|updates|number)\b', line, re.I):
                continue
        if URL_ONLY.match(raw) or BULLET_LINK.match(raw):
            continue

        # Lines that are just a resource label, even after URL removal.
        if re.match(r'^(?:download|get|grab|access|buy|use|claim)\s+(?:the\s+)?(?:notes?|handbook|cheat\s*sheet|source\s*code|bundle|course|template)\s*[:\-]?$' , line, re.I):
            continue

        # Remove isolated SEO/keyword dumps.
        if (line.count(',') >= 5 or line.count('|') >= 3) and len(line) < 600:
            if matches_any(line, [r'\b(?:keywords?|queries|seo|hashtags?)\b', r'\b(?:html|css|javascript)\s+tutorial\b.*\b(?:python|java|php)\b']):
                continue

        # Remove unrelated-course recommendation lines/lists. Do not drop normal technical prose merely
        # because it contains a common language name; require recommendation/list framing.
        if matches_any(line, [r'\b(?:learn|watch|check out|also watch|course|tutorial|playlist)\b']) and matches_any(line, UNRELATED):
            continue

        # Copyright/legal boilerplate.
        if re.search(r'\b(?:all rights reserved|copyright\s+\d{4}|for educational purposes only|disclaimer)\b', line, re.I):
            continue

        # Keep meaningful educational text. Remove decorative separators.
        if re.fullmatch(r'[-_=|•►~*]+', line):
            continue
        out.append(line)

    # Collapse blanks and adjacent duplicate lines.
    cleaned=[]
    prev=None
    for x in out:
        if not x: 
            if cleaned and cleaned[-1] != '': cleaned.append('')
            continue
        if x.lower() == (prev.lower() if prev else None):
            continue
        cleaned.append(x); prev=x
    while cleaned and cleaned[-1]=='': cleaned.pop()
    return '\n'.join(cleaned)

def main():
    docs=json.loads(INPUT.read_text(encoding='utf-8'))
    result=[]
    for doc in docs:
        meta=dict(doc.get('metadata') or {})
        # Source from original description when available; v3/v2 text may already have lost useful context.
        source=meta.get('description') or doc.get('text','')
        text=clean_description(source)
        result.append({'resource_id':doc.get('resource_id'), 'text':text, 'metadata':meta})
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Wrote {len(result)} documents -> {OUTPUT}')
    print('Empty text:', sum(not d['text'].strip() for d in result))
    print('Avg chars:', round(sum(len(d['text']) for d in result)/len(result),1))

if __name__=='__main__': main()