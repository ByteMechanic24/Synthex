<p align="center">
  <img src="https://img.shields.io/badge/PYTHON-3.11%2B-306998?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/REACT-18-149ECA?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/FASTAPI-0.111%2B-009485?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/VITE-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/LANGCHAIN-LCEL-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white" alt="LangChain">
</p>

<h1 align="center">📰 Synthex</h1>

<p align="center"><b>Your topic, reported on.</b></p>
<p align="center"><i>An autonomous research desk — search, read, write, and critique, staged live in a newsprint-styled UI.</i></p>

## 🌐 Live

| Service | URL |
|---|---|
| 🖥️ Frontend | [synthex-live.vercel.app](https://synthex-live.vercel.app) |
| ⚙️ Backend | [synthex-live.onrender.com](https://synthex-live.onrender.com) |
| ❤️ Health check | [/api/health](https://synthex-live.onrender.com/api/health) |

> ⏳ Backend runs on Render's free tier and spins down after ~15 min idle. First request after a break can take 30–60s to wake up before the pipeline starts — expected, not a bug.

---

## ✨ What It Does

Give Synthex a **topic**, and four agents/chains work it like a newsroom desk — searching, reading, writing, and reviewing — while you watch every stage happen live.

| Stage | Role | Description |
|---|---|---|
| 🔍 **Search** | LangChain agent | Uses Tavily to find recent, reliable sources on the topic |
| 📄 **Reader** | LangChain agent | Scrapes the most relevant source for deeper detail |
| ✍️ **Writer** | LCEL chain | Drafts a structured report — intro, key findings, conclusion, sources |
| 🧐 **Critic** | LCEL chain | Scores the report out of 10 with strengths, gaps, and a verdict |

## 🧵 Live, Not Batched

Most pipelines like this run silently and dump a result at the end. Synthex doesn't.

| Feature | How |
|---|---|
| ⚡ Real-time updates | Server-Sent Events (SSE) stream a status the moment each stage starts/finishes |
| 📊 Stage tracker | Four-panel grid lights up live as Search → Reader → Writer → Critic progress |
| 📰 Status ticker | Black marquee strip scrolls each stage's message as it happens |
| 🧾 Instant render | Report and critic review render the moment they're ready — no polling, no refresh |

## 🗞️ Design — "Newsprint"

Built to an explicit editorial design system, not a generic dashboard.

| Token | Value |
|---|---|
| Paper background | `#F9F9F7` |
| Ink (text/borders) | `#111111` |
| Editorial accent | `#CC0000` |
| Headline font | Playfair Display |
| Body font | Lora |
| UI / metadata font | Inter · JetBrains Mono |
| Border radius | `0px` everywhere |

Collapsed grid borders, a drop cap on the report's opening paragraph, and hard-offset hover shadows instead of soft drop shadows — the whole thing is meant to feel like a morning paper, not a SaaS dashboard.

## 🧱 Tech Stack

| Layer | Stack |
|---|---|
| Agents / chains | LangChain, `langchain-mistralai` (Mistral Small) |
| Search tool | Tavily API |
| Scrape tool | BeautifulSoup + Requests |
| Backend | FastAPI, `sse-starlette`, Uvicorn |
| Frontend | React (Vite), Tailwind CSS, `lucide-react` |
| Hosting | Render (backend) · Vercel (frontend) |

## 🚀 Getting Started

### Backend

```powershell
cd backend
uv venv
.venv\Scripts\activate
uv pip install -r requirements.txt
copy .env.example .env    # fill in MISTRAL_API_KEY and TAVILY_API_KEY
uvicorn main:app --reload --port 8000
```

✅ Health check: `http://localhost:8000/api/health` → `{"status": "ok"}`

**Stream endpoint:** `GET /api/research?topic=your+topic`

| Event | Meaning |
|---|---|
| `{"stage": "search", "status": "running", ...}` | Search agent started |
| `{"stage": "search", "status": "done", "data": "..."}` | Search results ready |
| `{"stage": "reader", "status": "done", "data": "..."}` | Scraped content ready |
| `{"stage": "writer", "status": "done", "data": "..."}` | Report drafted |
| `{"stage": "critic", "status": "done", "data": "..."}` | Score + feedback ready |
| `{"stage": "pipeline", "status": "done", "data": {...}}` | Full run complete |

### Frontend

```powershell
cd frontend
npm install
copy .env.example .env    # VITE_API_BASE=http://localhost:8000
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`). Start the backend first — the **Send to press** button opens an `EventSource` connection to `/api/research`.

## 📁 Project Structure

| Path | Purpose |
|---|---|
| `backend/agents.py` | 4 agents/chains — search, reader, writer, critic |
| `backend/tools.py` | `web_search` / `web_scraper` tools |
| `backend/pipeline_stream.py` | Generator wrapper — yields live stage status |
| `backend/main.py` | FastAPI app + SSE endpoint |
| `frontend/src/components/Masthead.jsx` | Header + edition metadata |
| `frontend/src/components/TopicForm.jsx` | Topic input |
| `frontend/src/components/StageTicker.jsx` | Live black marquee status strip |
| `frontend/src/components/StageTracker.jsx` | 4-stage status grid |
| `frontend/src/components/ReportArticle.jsx` | Report body — drop cap, justified text |
| `frontend/src/components/CriticPanel.jsx` | Score + feedback, inverted sidebar |
| `frontend/src/hooks/useResearchStream.js` | SSE client hook |
| `frontend/tailwind.config.js` | Design tokens (color/type) |

---

<p align="center"><i>Search, read, write, critique — four agents, one desk.</i></p>