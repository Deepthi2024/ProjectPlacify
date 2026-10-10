import sys
import os
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = 'Youtube data API resources'
metadata = json.load(open(os.path.join(BASE_DIR, 'data', 'rag_embedding_metadata.json'), encoding='utf-8'))
docs = json.load(open(os.path.join(BASE_DIR, 'data', 'rag_documents_final.json'), encoding='utf-8'))
docs_map = {d.get('metadata', {}).get('resource_id', d.get('resource_id')): d for d in docs}

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

# Test for DOM Selection task
task = {
    'taskTitle': 'DOM Selection & Event Handling',
    'topic': 'JavaScript',
    'subtopic': 'DOM element selection, querySelector, addEventListener, event bubbling, and event delegation',
    'domain': 'fullstack',
    'userLevel': 'INTERMEDIATE',
    'taskBudgetMinutes': 45
}

# Find chapters across all videos in index
chapter_matches = []
for res in metadata:
    r_id = res['resource_id']
    doc = docs_map.get(r_id)
    if not doc: continue
    chaps = parse_video_chapters(doc.get('text', ''), res.get('duration_minutes', 0))
    for c in chaps:
        c_title_low = c['title'].lower()
        # Hard check: Must match DOM / Element selection / DOM events
        # And NOT be event loop
        is_event_loop = 'event loop' in c_title_low or 'call stack' in c_title_low
        if is_event_loop:
            continue
        is_dom = any(k in c_title_low for k in ['dom', 'select html', 'queryselector', 'element', 'addeventlistener', 'events', 'event handling', 'event delegation'])
        if is_dom and any(k in c_title_low for k in ['dom', 'select', 'element', 'events', 'delegation']):
            chapter_matches.append({
                'parent_id': r_id,
                'parent_title': res['title'],
                'parent_url': res['url'],
                'chapter_title': c['title'],
                'timestamp': c['timestamp'],
                'end_timestamp': c['end_timestamp'],
                'duration_minutes': c['duration_minutes'],
                'seconds': c['seconds']
            })

print(f"Total matching chapters found for DOM task: {len(chapter_matches)}")
for cm in chapter_matches[:10]:
    url_sep = '&' if '?' in cm['parent_url'] else '?'
    ch_url = f"{cm['parent_url']}{url_sep}t={cm['seconds']}s"
    print(f" - {cm['chapter_title']} ({cm['duration_minutes']}m) | Time: {cm['timestamp']} - {cm['end_timestamp']} | URL: {ch_url}")
