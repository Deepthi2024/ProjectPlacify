import pandas as pd
import json, re
from pathlib import Path

INPUT_FILE = Path('data/resources_final.csv')
OUTPUT_FILE = Path('data/rag_documents.json')

FIELDS = ['resource_id','domain','topic','subtopic','level','title','channel','url','duration_minutes','language','description','tags','quality_score','educational_value','content_quality']

def clean(v):
    if pd.isna(v): return ''
    return re.sub(r'\s+', ' ', str(v)).strip()

def main():
    if not INPUT_FILE.exists(): raise FileNotFoundError(f'Missing {INPUT_FILE}')
    df = pd.read_csv(INPUT_FILE)
    required = ['resource_id','domain','topic','subtopic','level','title','channel','url','duration_minutes','language','description','tags']
    missing = [c for c in required if c not in df.columns]
    if missing: raise ValueError(f'Missing columns: {missing}')
    docs=[]
    for _,r in df.iterrows():
        vals={c:clean(r[c]) for c in FIELDS if c in df.columns}
        text=f'''Resource Title: {vals["title"]}\nDomain: {vals["domain"]}\nTopic: {vals["topic"]}\nSubtopics: {vals["subtopic"]}\nLevel: {vals["level"]}\nLanguage: {vals["language"]}\nChannel/Provider: {vals["channel"]}\nDuration: {vals["duration_minutes"]} minutes\nDescription: {vals.get("description","")}\nTags: {vals.get("tags","")}'''
        docs.append({'resource_id':vals['resource_id'],'text':text,'metadata':{k:(r[k] if not pd.isna(r[k]) else None) for k in FIELDS if k in df.columns}})
    OUTPUT_FILE.parent.mkdir(parents=True,exist_ok=True)
    with open(OUTPUT_FILE,'w',encoding='utf-8') as f: json.dump(docs,f,ensure_ascii=False,indent=2)
    print(f'Processed {len(docs)} resources -> {OUTPUT_FILE}')
    print('\nSample:\n'+json.dumps(docs[0],ensure_ascii=False,indent=2))
if __name__=='__main__': main()