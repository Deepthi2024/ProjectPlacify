# Placify Dynamic Resource RAG

Placify now retrieves learning resources dynamically from the web instead of using a hardcoded resource catalog.

## Install

```bash
pip install -r requirements.txt
```

Add a Tavily API key to `.env`:

```env
TAVILY_API_KEY=your_key_here
```

Do not commit the real key.

## Run

```bash
node server.js
```

The Node server calls `resource_rag.py` for each personalized task. Tavily performs the live search, the returned resource content is embedded with Sentence Transformers, ChromaDB stores the vectors, and the top semantic matches are returned to the UI and cached in MongoDB.

## Test directly

```bash
python resource_rag.py "Learn Python Functions" "Python" "Functions" "datascience" "BEGINNER" "LEARNING" 3 45
```

The command requires `TAVILY_API_KEY` to be available in the environment.
