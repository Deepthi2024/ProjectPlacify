import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

data = json.dumps({
    'taskId': 'task_dom_1',
    'taskTitle': 'DOM Selection & Event Handling',
    'topic': 'JavaScript',
    'subtopic': 'DOM element selection, querySelector, addEventListener, event bubbling, and event delegation',
    'domain': 'fullstack',
    'difficulty': 'INTERMEDIATE',
    'durationMinutes': 45,
    'taskType': 'LEARN'
}).encode()

req = urllib.request.Request('http://127.0.0.1:8000/api/rag/query', data=data, headers={'Content-Type': 'application/json'})
res = urllib.request.urlopen(req)
r = json.loads(res.read().decode('utf-8'))

print('Coverage:', r.get('coverage'))
print('Resources count:', len(r.get('resources', [])))
for idx, res_item in enumerate(r.get('resources', []), 1):
    print(f"{idx}. [{res_item.get('verificationStatus')}] {res_item.get('title')} ({res_item.get('duration_minutes')}m)")
    print(f"   URL: {res_item.get('url')}")
    print(f"   Timestamps: {res_item.get('startTimestamp')} to {res_item.get('endTimestamp')}")
