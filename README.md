# Synthex UI

Synthex is a newsprint-inspired research desk that combines an interactive
React frontend with a FastAPI SSE backend. The app orchestrates a staged
research pipeline (Search agent → Reader agent → Writer chain → Critic chain)
and presents progress through editorial-style stickers and live status chips.

Your existing `agents.py` / `tools.py` logic is untouched. `pipeline_stream.py`
is a new file that wraps the same calls with `yield` statements so the API can
stream live stage updates to the UI over Server-Sent Events (SSE).

## 1. Backend

```powershell
cd backend
uv venv
.venv\Scripts\activate
uv pip install -r requirements.txt
copy .env.example .env    # then fill in MISTRAL_API_KEY and TAVILY_API_KEY
uvicorn main:app --reload --port 8000
```

Health check: http://localhost:8000/api/health

Stream endpoint (used by the frontend):
`GET /api/research?topic=your+topic` — returns an SSE stream of JSON events:

```json
{ "stage": "search", "status": "running", "message": "Searching the web for: ..." }
{ "stage": "search", "status": "done", "data": "..." }
{ "stage": "reader", "status": "running", "message": "..." }
...
{ "stage": "pipeline", "status": "done", "data": { ...full state... } }
```

## 2. Frontend

```powershell
cd frontend
npm install
copy .env.example .env    # VITE_API_BASE=http://localhost:8000
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). Make sure the
backend is running first — the "Send to press" button opens an `EventSource`
connection to `/api/research`.

## Folder structure

```
backend/
  agents.py            # unchanged — your 4 agents/chains
  tools.py              # unchanged — web_search / web_scraper
  pipeline_stream.py    # NEW — generator wrapper, no logic changes
  main.py               # NEW — FastAPI + SSE endpoint
  requirements.txt

frontend/
  src/
    components/
      Masthead.jsx       # header / edition metadata
      TopicForm.jsx       # topic input
      StageTicker.jsx      # live black marquee status strip
      StageTracker.jsx      # 4-stage status grid (Search/Reader/Writer/Critic)
      ReportArticle.jsx      # final report, drop-cap + justified body
      CriticPanel.jsx         # score + feedback sidebar (inverted black panel)
      Footer.jsx
    hooks/
      useResearchStream.js   # SSE client hook
    App.jsx
    index.css                # Newsprint tokens, fonts, utilities
  tailwind.config.js         # design tokens (paper/ink/accent/divider, fonts)
```

## Design system

Implements the "Newsprint" spec exactly: `#F9F9F7` paper background, `#111111`
ink, `#CC0000` editorial red used sparingly, zero border radius everywhere,
Playfair Display headlines, Lora body, Inter UI, JetBrains Mono for
data/metadata, collapsed grid borders, hard-offset hover shadows, and a
drop cap on the report's opening paragraph.

## Interactive stickers

The UI uses editorial sticker-style status chips to track progress through the
pipeline. Each stage shows a stamped badge with live messages, from search and
reader updates through writer drafts and critic review notes.
