"""
Streaming wrapper around the research pipeline.

This does NOT change any agent/chain logic from agents.py / pipeline.py.
It just wraps the same calls with `yield` statements so the API layer
can push live stage updates to the frontend over SSE.
"""

from agents import build_search_agent, build_search_reader_agent, writer_chain, critic_chain


def stream_research_pipeline(topic: str):
    """
    Generator that yields dicts describing pipeline progress.
    Each event has a `stage`, `status` ("running" | "done" | "error"),
    and optional `data` / `message` payload.
    """
    state = {}

    # ---------------- Search agent ----------------
    yield {"stage": "search", "status": "running", "message": f"Searching the web for: {topic}"}
    try:
        search_agent = build_search_agent()
        search_result = search_agent.invoke({
            "messages": [("user", f"Find recent, reliable and detailed information about: {topic}")]
        })
        state["search_results"] = search_result["messages"][-1].content
        yield {"stage": "search", "status": "done", "data": state["search_results"]}
    except Exception as e:
        yield {"stage": "search", "status": "error", "message": str(e)}
        return

    # ---------------- Reader agent ----------------
    yield {"stage": "reader", "status": "running", "message": "Scraping the most relevant source"}
    try:
        reader_agent = build_search_reader_agent()
        reader_result = reader_agent.invoke({
            "messages": [("user",
                f"Based on the following search results about '{topic}', "
                f"pick the most relevant URL and scrape it for deeper content.\n\n"
                f"Search Results:\n{state['search_results'][:800]}"
            )]
        })
        state["scraped_content"] = reader_result["messages"][-1].content
        yield {"stage": "reader", "status": "done", "data": state["scraped_content"]}
    except Exception as e:
        yield {"stage": "reader", "status": "error", "message": str(e)}
        return

    # ---------------- Writer chain ----------------
    yield {"stage": "writer", "status": "running", "message": "Drafting the report"}
    try:
        research_combined = (
            f"SEARCH RESULTS : \n {state['search_results']} \n\n"
            f"DETAILED SCRAPED CONTENT : \n {state['scraped_content']}"
        )
        state["report"] = writer_chain.invoke({
            "topic": topic,
            "research": research_combined
        })
        yield {"stage": "writer", "status": "done", "data": state["report"]}
    except Exception as e:
        yield {"stage": "writer", "status": "error", "message": str(e)}
        return

    # ---------------- Critic chain ----------------
    yield {"stage": "critic", "status": "running", "message": "Reviewing the report"}
    try:
        state["feedback"] = critic_chain.invoke({
            "report": state["report"]
        })
        yield {"stage": "critic", "status": "done", "data": state["feedback"]}
    except Exception as e:
        yield {"stage": "critic", "status": "error", "message": str(e)}
        return

    yield {"stage": "pipeline", "status": "done", "data": state}
