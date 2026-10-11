import argparse
import csv
import json
import os
import re
import sys
from pathlib import Path
import requests

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass
if hasattr(sys.stderr, 'reconfigure'):
    try:
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

BASE_DIR = Path(__file__).resolve().parent
TAXONOMY_DIR = BASE_DIR / "taxonomy"
DATA_DIR = BASE_DIR / "data"

API_KEY = os.environ.get("YOUTUBE_API_KEY", "").strip()
SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos"

CSV_COLUMNS = [
    "resource_id",
    "domain",
    "topic",
    "subtopic",
    "level",
    "title",
    "channel",
    "url",
    "duration_minutes",
    "language",
    "quality_score",
    "status"
]

DOMAIN_TAXONOMY_MAP = {
    "fullstack": "full_stack_devvelopment.json",
    "datascience": "data_science.json",
    "dsa": "dsa.json",
    "devops": "cloud_devops.json",
    "cybersecurity": "cybersecurity.json",
    "mobile": "mobile_development.json",
    "ai_llm": "ai_llm.json",
    "system_design": "system_design.json"
}

def load_taxonomy(domain_key):
    tax_filename = DOMAIN_TAXONOMY_MAP.get(domain_key, f"{domain_key}.json")
    tax_path = TAXONOMY_DIR / tax_filename
    if not tax_path.exists():
        raise FileNotFoundError(f"Taxonomy not found: {tax_path}")
    with open(tax_path, "r", encoding="utf-8") as f:
        return json.load(f)

def duration_to_minutes(duration):
    hours = 0
    minutes = 0
    seconds = 0
    hour_match = re.search(r"(\d+)H", duration)
    minute_match = re.search(r"(\d+)M", duration)
    second_match = re.search(r"(\d+)S", duration)
    if hour_match:
        hours = int(hour_match.group(1))
    if minute_match:
        minutes = int(minute_match.group(1))
    if second_match:
        seconds = int(second_match.group(1))
    total_minutes = hours * 60 + minutes
    if seconds >= 30:
        total_minutes += 1
    return max(1, total_minutes)

def search_youtube(query, max_results=25):
    if not API_KEY:
        return []
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": max_results,
        "order": "relevance",
        "relevanceLanguage": "en",
        "regionCode": "IN",
        "key": API_KEY
    }
    resp = requests.get(SEARCH_URL, params=params)
    if resp.status_code != 200:
        print(f"YouTube search error: {resp.text}")
        return []
    return [item["id"]["videoId"] for item in resp.json().get("items", []) if "videoId" in item.get("id", {})]

def fetch_video_details(video_ids):
    if not API_KEY or not video_ids:
        return []
    params = {
        "part": "snippet,contentDetails,statistics",
        "id": ",".join(video_ids),
        "key": API_KEY
    }
    resp = requests.get(VIDEOS_URL, params=params)
    if resp.status_code != 200:
        return []
    return resp.json().get("items", [])

def run_collection(domain_key, target_per_topic=10):
    tax = load_taxonomy(domain_key)
    domain_name = tax.get("domain", domain_key)
    out_csv = DATA_DIR / f"{domain_key}_Youtube_Resources.csv"
    
    print(f"==================================================")
    print(f"COLLECTION PIPELINE: {domain_name} ({domain_key})")
    print(f"Taxonomy Topics: {len(tax.get('topics', {}))}")
    print(f"Target Output  : {out_csv}")
    print(f"API Key Present: {bool(API_KEY)}")
    print(f"==================================================")

    rows = []
    rid = 1

    if not API_KEY:
        print("⚠️ No YOUTUBE_API_KEY detected in environment.")
        print("   Generating structured candidate query and catalog placeholders...")
        for topic_name, subtopics in tax.get("topics", {}).items():
            for subtopic_name, desc in subtopics.items():
                for level in ["Beginner", "Intermediate", "Advanced"]:
                    res_id = f"yt_{domain_key}_{rid:03d}"
                    query_template = f"{topic_name} {subtopic_name} tutorial {level.lower()}"
                    rows.append({
                        "resource_id": res_id,
                        "domain": domain_name,
                        "topic": topic_name,
                        "subtopic": subtopic_name,
                        "level": level,
                        "title": f"Placeholder: {topic_name} - {subtopic_name} ({level})",
                        "channel": "Placify Curated Track",
                        "url": f"https://www.youtube.com/results?search_query={query_template.replace(' ', '+')}",
                        "duration_minutes": 30,
                        "language": "English",
                        "quality_score": 75.0,
                        "status": "pending_collection"
                    })
                    rid += 1
    else:
        for topic_name, subtopics in tax.get("topics", {}).items():
            for subtopic_name in subtopics.keys():
                q = f"{domain_name} {topic_name} {subtopic_name} tutorial"
                vids = search_youtube(q, max_results=target_per_topic)
                details = fetch_video_details(vids)
                for item in details:
                    snippet = item.get("snippet", {})
                    content = item.get("contentDetails", {})
                    dur = duration_to_minutes(content.get("duration", "PT30M"))
                    vid_id = item["id"]
                    rows.append({
                        "resource_id": f"yt_{domain_key}_{rid:03d}",
                        "domain": domain_name,
                        "topic": topic_name,
                        "subtopic": subtopic_name,
                        "level": "Intermediate",
                        "title": snippet.get("title", ""),
                        "channel": snippet.get("channelTitle", ""),
                        "url": f"https://www.youtube.com/watch?v={vid_id}",
                        "duration_minutes": dur,
                        "language": "English",
                        "quality_score": 80.0,
                        "status": "approved"
                    })
                    rid += 1

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(out_csv, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS)
        writer.writeheader()
        writer.writerows(rows)

    print(f"✅ Successfully wrote {len(rows)} records to {out_csv}\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Multi-domain YouTube resource collector")
    parser.add_argument("--domain", default="all", help="Domain key or 'all'")
    args = parser.parse_args()

    domains = list(DOMAIN_TAXONOMY_MAP.keys()) if args.domain == "all" else [args.domain]
    for d in domains:
        run_collection(d)
