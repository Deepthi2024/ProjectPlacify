import urllib.request
import urllib.error

try:
    req = urllib.request.Request(
        'http://127.0.0.1:8000/api/rag/query',
        data=b'{"taskId": "t1", "taskTitle": "DOM Selection", "topic": "JavaScript", "subtopic": "DOM", "domain": "fullstack"}',
        headers={'Content-Type': 'application/json'}
    )
    res = urllib.request.urlopen(req)
    print("Success:", res.read().decode())
except urllib.error.HTTPError as e:
    print("Error code:", e.code)
    print("Error body:", e.read().decode())
except Exception as e:
    print("Exception:", e)
