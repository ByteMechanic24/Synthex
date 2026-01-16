import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

from pipeline_stream import stream_research_pipeline

app = FastAPI(title="Synthex Research API")

# Allow the Vite dev server (and any other local frontend) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/research")
def research(topic: str):
    """
    SSE endpoint. Connect with:
        new EventSource(`/api/research?topic=...`)
    Streams one JSON event per pipeline stage:
        { stage: "search" | "reader" | "writer" | "critic" | "pipeline",
          status: "running" | "done" | "error",
          message?: string,
          data?: string | object }
    """
    def event_generator():
        for event in stream_research_pipeline(topic):
            yield {"event": "update", "data": json.dumps(event)}

    return EventSourceResponse(event_generator())
