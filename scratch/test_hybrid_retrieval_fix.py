import os
import sys
import re
import json
import faiss
from sentence_transformers import SentenceTransformer

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = 'Youtube data API resources'
FAISS_INDEX_PATH = os.path.join(BASE_DIR, 'data', 'rag_faiss.index')
METADATA_PATH = os.path.join(BASE_DIR, 'data', 'rag_embedding_metadata.json')
DOCUMENTS_PATH = os.path.join(BASE_DIR, 'data', 'rag_documents_final.json')

index = faiss.read_index(FAISS_INDEX_PATH)
metadata = json.load(open(METADATA_PATH, encoding='utf-8'))
docs = json.load(open(DOCUMENTS_PATH, encoding='utf-8'))
docs_map = {d.get('metadata', {}).get('resource_id', d.get('resource_id')): d for d in docs}
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Import helpers from hybrid_retrieval
sys.path.insert(0, os.path.join(BASE_DIR, 'scripts'))
import hybrid_retrieval as hr

def parse_video_chapters(text, total_duration_minutes):
    if not text:
        return []
    chapters = []
    lines = text.split("\n")
    pattern = re.compile(r'(?:#\(|\b)?(?:(\d{1,2}):)?(\d{2}):(\d{2})\)?(?:\s*[-–:]\s*|\s+)(.+)')
    pattern_alt = re.compile(r'(.+?)\s*[-–:]\s*(?:(\d{1,2}):)?(\d{2}):(\d{2})')

    for line in lines:
        line_clean = line.strip()
        m = pattern.search(line_clean)
        if m:
            h = int(m.group(1)) if m.group(1) else 0
            m_val = int(m.group(2))
            s = int(m.group(3))
            sec = h * 3600 + m_val * 60 + s
            t_str = f"{h:02d}:{m_val:02d}:{s:02d}" if h else f"{m_val:02d}:{s:02d}"
            title = m.group(4).strip()
            title = re.sub(r'^(?:Chapter\s*\d+|Ch[- ]*\d+[-–\d]*|\d+)[\.\s:–-]+', '', title, flags=re.I).strip()
            if title and not any(k in title.lower() for k in ["http", "github", "whatsapp", "instagram", "facebook", "twitter", "subscribe", "social media", "handbook", "notes"]):
                chapters.append({'seconds': sec, 'timestamp': t_str, 'title': title})
        else:
            m2 = pattern_alt.search(line_clean)
            if m2 and not any(k in m2.group(1).lower() for k in ['http', 'duration', 'published', 'github', 'notes']):
                h = int(m2.group(2)) if m2.group(2) else 0
                m_val = int(m2.group(3))
                s = int(m2.group(4))
                sec = h * 3600 + m_val * 60 + s
                t_str = f"{h:02d}:{m_val:02d}:{s:02d}" if h else f"{m_val:02d}:{s:02d}"
                title = m2.group(1).strip()
                title = re.sub(r'^(?:Chapter\s*\d+|Ch[- ]*\d+[-–\d]*|\d+)[\.\s:–-]+', '', title, flags=re.I).strip()
                if title:
                    chapters.append({'seconds': sec, 'timestamp': t_str, 'title': title})

    chapters.sort(key=lambda x: x['seconds'])
    unique = []
    for c in chapters:
        if not unique or unique[-1]['seconds'] != c['seconds']:
            unique.append(c)

    total_sec = max(60, int(total_duration_minutes or 60) * 60)
    for i, c in enumerate(unique):
        next_sec = unique[i+1]['seconds'] if i+1 < len(unique) else total_sec
        c['duration_minutes'] = max(1, round((next_sec - c['seconds']) / 60))
        c['end_timestamp'] = unique[i+1]['timestamp'] if i+1 < len(unique) else ''

    return unique

def extract_specific_concepts(task_title, subtopic, topic):
    combined = f"{task_title} {subtopic}".lower()
    combined = re.sub(r'[:,\-\(\)]', ' ', combined)
    stop_words = {
        'learn', 'practice', 'study', 'module', 'drill', 'task', 'day', 'week',
        'the', 'and', 'for', 'with', 'basics', 'basic', 'core', 'component',
        'structure', 'memory', 'principles', 'syntax', 'flow', 'optimization',
        'failure', 'handling', 'production', 'patterns', 'implementation',
        'javascript', 'python', 'html', 'css', 'programming', 'web', 'development'
    }
    tokens = [w for w in combined.split() if len(w) > 2 and w not in stop_words]
    # Check for multi-word or key concepts
    phrases = []
    if 'dom' in combined: phrases.append('dom')
    if 'queryselector' in combined: phrases.append('queryselector')
    if 'addeventlistener' in combined: phrases.append('addeventlistener')
    if 'event bubbling' in combined or 'bubbling' in combined: phrases.append('bubbling')
    if 'event delegation' in combined or 'delegation' in combined: phrases.append('delegation')
    if 'events' in combined or 'event handling' in combined: phrases.append('event')
    return list(set(phrases + tokens))

task_data = {
    'taskId': 'task_dom_1',
    'taskTitle': 'DOM Selection & Event Handling',
    'topic': 'JavaScript',
    'subtopic': 'DOM element selection, querySelector, addEventListener, event bubbling, and event delegation',
    'domain': 'fullstack',
    'difficulty': 'INTERMEDIATE',
    'taskDuration': 45,
    'taskType': 'LEARN'
}

concepts = extract_specific_concepts(task_data['taskTitle'], task_data['subtopic'], task_data['topic'])
print("Specific technical concepts for task:", concepts)

# Run test query
structured_query = hr.build_task_rag_query(task_data)
query_embedding = model.encode([structured_query], normalize_embeddings=True)
scores, indices = index.search(query_embedding, 60)

scored_candidates = []
rejected_log = []

for score, idx in zip(scores[0], indices[0]):
    if idx < 0 or idx >= len(metadata): continue
    resource = metadata[idx].copy()
    r_id = str(resource.get("resource_id", ""))
    r_url = str(resource.get("url", "")).strip()
    r_title = str(resource.get("title", "")).strip()
    r_subtopic = str(resource.get("subtopic", "")).strip()
    try:
        r_duration = float(resource.get("duration_minutes") or 0)
    except:
        r_duration = 30

    # Domain consistency
    r_domain_raw = str(resource.get("domain") or "Full Stack Development")
    r_canon = hr.canonicalize_domain_key(r_domain_raw)
    if r_canon != 'fullstack':
        rejected_log.append((r_title, f"Domain mismatch: {r_canon}"))
        continue

    # Level boundary
    r_level = str(resource.get("level") or "INTERMEDIATE").upper()
    if r_level == "BEGINNER" and task_data['difficulty'] == "ADVANCED":
        continue

    doc = docs_map.get(r_id)
    doc_text = doc.get("text", "") if doc else ""
    chapters = parse_video_chapters(doc_text, r_duration)

    # 1. Check if any chapter specifically matches the concepts
    matched_chapters = []
    for c in chapters:
        c_title_low = c['title'].lower()
        # Anti-collision: Reject "event loop" or "call stack" for DOM event task
        if 'event loop' in c_title_low or 'call stack' in c_title_low:
            continue
        c_match = any(cp in c_title_low for cp in concepts)
        if c_match:
            matched_chapters.append(c)

    for ch in matched_chapters:
        ch_dur = ch['duration_minutes']
        if ch_dur <= task_data['taskDuration'] + 15:
            sep = '&' if '?' in r_url else '?'
            ch_url = f"{r_url}{sep}t={ch['seconds']}s"
            ch_cand = {
                "resource_id": f"{r_id}_ch_{ch['seconds']}",
                "title": f"{r_title} - Chapter: {ch['title']}",
                "url": ch_url,
                "platform": resource.get("channel") or "YouTube",
                "resource_type": "VIDEO",
                "topic": resource.get("topic") or task_data['topic'],
                "subtopic": ch['title'],
                "difficulty": resource.get("level") or task_data['difficulty'],
                "duration_minutes": ch_dur,
                "task_id": task_data['taskId'],
                "task_budget_minutes": task_data['taskDuration'],
                "startTimestamp": ch['timestamp'],
                "endTimestamp": ch['end_timestamp'],
                "start_seconds": ch['seconds'],
                "is_chapter": True,
                "verificationStatus": "VERIFIED_CHAPTER",
                "final_score": 0.92,
                "relevance_score": 0.95,
                "relevance_reason": f"Verified chapter '{ch['title']}' ({ch['timestamp']} - {ch['end_timestamp']}) directly covers DOM selection & events within study budget ({ch_dur}m)."
            }
            scored_candidates.append(ch_cand)

    # 2. Check full video if it fits budget
    if r_duration <= task_data['taskDuration']:
        # Hard check: Must match at least one concept in title or subtopic
        full_text_low = f"{r_title} {r_subtopic}".lower()
        # Anti-collision
        if 'event loop' in full_text_low or 'call stack' in full_text_low or 'node.js' in full_text_low:
            rejected_log.append((r_title, "Rejected: Node.js event loop is unrelated to DOM events"))
            continue
        has_concept = any(cp in full_text_low for cp in concepts)
        if not has_concept:
            rejected_log.append((r_title, "Rejected: Generic video does not teach DOM Selection or Events"))
            continue
        # If it does teach DOM:
        scored_candidates.append({
            "resource_id": r_id,
            "title": r_title,
            "url": r_url,
            "platform": resource.get("channel") or "YouTube",
            "resource_type": "VIDEO",
            "topic": resource.get("topic") or task_data['topic'],
            "subtopic": resource.get("subtopic") or task_data['subtopic'],
            "difficulty": r_level,
            "duration_minutes": int(r_duration),
            "task_id": task_data['taskId'],
            "task_budget_minutes": task_data['taskDuration'],
            "startTimestamp": None,
            "endTimestamp": None,
            "is_chapter": False,
            "verificationStatus": "VERIFIED_INDEXED",
            "final_score": 0.88,
            "relevance_score": 0.90,
            "relevance_reason": f"Full video ({int(r_duration)}m) teaches {task_data['taskTitle']} directly."
        })
    else:
        if not matched_chapters:
            rejected_log.append((r_title, f"Duration {r_duration}m exceeds budget and has no matching chapter"))

print("\n--- RESULTS ---")
print(f"Accepted Candidates: {len(scored_candidates)}")
for idx, c in enumerate(scored_candidates[:5], 1):
    print(f"{idx}. {c['title']} ({c['duration_minutes']}m) | Status: {c['verificationStatus']} | URL: {c['url']}")

print("\n--- SAMPLE REJECTIONS ---")
for r_t, reason in rejected_log[:5]:
    print(f" - {r_t[:45]} | {reason}")
