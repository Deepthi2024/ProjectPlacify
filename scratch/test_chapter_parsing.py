import sys
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

docs = json.load(open('Youtube data API resources/data/rag_documents_final.json', encoding='utf-8'))

def parse_chapters(text, total_duration_mins):
    chapters = []
    lines = text.split('\n')
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
            title = re.sub(r'^[0-9]+[\.\s]+', '', title)
            chapters.append({'seconds': sec, 'timestamp': t_str, 'title': title})
        else:
            m2 = pattern_alt.search(line_clean)
            if m2 and not any(k in m2.group(1).lower() for k in ['http', 'duration', 'published']):
                h = int(m2.group(2)) if m2.group(2) else 0
                m_val = int(m2.group(3))
                s = int(m2.group(4))
                sec = h * 3600 + m_val * 60 + s
                t_str = f"{h:02d}:{m_val:02d}:{s:02d}" if h else f"{m_val:02d}:{s:02d}"
                title = m2.group(1).strip()
                title = re.sub(r'^[0-9]+[\.\s]+', '', title)
                chapters.append({'seconds': sec, 'timestamp': t_str, 'title': title})

    chapters.sort(key=lambda x: x['seconds'])
    unique = []
    for c in chapters:
        if not unique or unique[-1]['seconds'] != c['seconds']:
            unique.append(c)

    total_sec = (total_duration_mins or 60) * 60
    for i, c in enumerate(unique):
        next_sec = unique[i+1]['seconds'] if i+1 < len(unique) else total_sec
        c['duration_minutes'] = max(1, round((next_sec - c['seconds']) / 60))
        c['end_timestamp'] = unique[i+1]['timestamp'] if i+1 < len(unique) else ''

    return unique

d = [x for x in docs if x['metadata']['resource_id'] == 'yt_html_161'][0]
chaps = parse_chapters(d['text'], d['metadata']['duration_minutes'])
print('Parsed chapters from yt_html_161:', len(chaps))
for c in chaps:
    if any(k in c['title'].lower() for k in ['dom', 'select', 'event', 'element']):
        print(f" - {c['timestamp']} to {c['end_timestamp']} : {c['title']} ({c['duration_minutes']}m, start_sec={c['seconds']})")
