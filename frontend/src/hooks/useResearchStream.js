import { useCallback, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const INITIAL_STAGES = {
  search: { status: "idle", message: "", data: null },
  reader: { status: "idle", message: "", data: null },
  writer: { status: "idle", message: "", data: null },
  critic: { status: "idle", message: "", data: null },
};

export function useResearchStream() {
  const [stages, setStages] = useState(INITIAL_STAGES);
  const [ticker, setTicker] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const sourceRef = useRef(null);

  const reset = useCallback(() => {
    setStages(INITIAL_STAGES);
    setTicker([]);
    setError(null);
  }, []);

  const start = useCallback((topic) => {
    if (!topic?.trim()) return;
    reset();
    setIsRunning(true);

    const url = `${API_BASE}/api/research?topic=${encodeURIComponent(topic)}`;
    const es = new EventSource(url);
    sourceRef.current = es;

    es.addEventListener("update", (e) => {
      const evt = JSON.parse(e.data);

      if (evt.stage === "pipeline" && evt.status === "done") {
        setIsRunning(false);
        es.close();
        return;
      }

      setStages((prev) => ({
        ...prev,
        [evt.stage]: {
          status: evt.status,
          message: evt.message || prev[evt.stage]?.message || "",
          data: evt.data ?? prev[evt.stage]?.data ?? null,
        },
      }));

      if (evt.message) {
        setTicker((prev) => [...prev.slice(-9), `${evt.stage.toUpperCase()} — ${evt.message}`]);
      }

      if (evt.status === "error") {
        setError(evt.message || `${evt.stage} failed`);
        setIsRunning(false);
        es.close();
      }
    });

    es.onerror = () => {
      setIsRunning(false);
      es.close();
    };
  }, [reset]);

  const stop = useCallback(() => {
    sourceRef.current?.close();
    setIsRunning(false);
  }, []);

  return { stages, ticker, isRunning, error, start, stop };
}
