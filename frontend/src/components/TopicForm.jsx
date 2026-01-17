import { useState } from "react";
import { Search } from "lucide-react";

export default function TopicForm({ onSubmit, isRunning }) {
  const [topic, setTopic] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim() || isRunning) return;
    onSubmit(topic.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="border-b border-ink">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <label htmlFor="topic" className="block font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">
          Assign a story
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. The state of solid-state batteries in 2026"
            disabled={isRunning}
            className="flex-1 border-b-2 border-ink bg-transparent px-1 py-3 font-body text-lg placeholder:text-neutral-400 focus-visible:bg-neutral-100 focus-visible:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isRunning || !topic.trim()}
            className="min-h-[44px] shrink-0 flex items-center justify-center gap-2 bg-ink text-paper border border-transparent px-6 uppercase tracking-widest text-xs font-sans font-semibold hover:bg-paper hover:text-ink hover:border-ink transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-ink disabled:hover:text-paper"
          >
            <Search className="h-4 w-4" strokeWidth={1.5} />
            {isRunning ? "Reporting..." : "Send to press"}
          </button>
        </div>
      </div>
    </form>
  );
}
