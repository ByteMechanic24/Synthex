import { CircleDashed, LoaderCircle, Check, X } from "lucide-react";

const STAGE_META = [
  { key: "search", num: "01", title: "Search", desc: "Tavily web search agent" },
  { key: "reader", num: "02", title: "Reader", desc: "Scrapes the lead source" },
  { key: "writer", num: "03", title: "Writer", desc: "Drafts the full report" },
  { key: "critic", num: "04", title: "Critic", desc: "Scores & reviews the draft" },
];

function StatusIcon({ status }) {
  if (status === "done") return <Check className="h-5 w-5" strokeWidth={1.5} />;
  if (status === "running") return <LoaderCircle className="h-5 w-5 animate-spin" strokeWidth={1.5} />;
  if (status === "error") return <X className="h-5 w-5 text-accent" strokeWidth={1.5} />;
  return <CircleDashed className="h-5 w-5 text-neutral-400" strokeWidth={1.5} />;
}

export default function StageTracker({ stages }) {
  return (
    <section className="border-b border-ink newsprint-texture">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {STAGE_META.map((s, i) => {
          const state = stages[s.key];
          const isLast = i === STAGE_META.length - 1;
          return (
            <div
              key={s.key}
              className={`p-6 border-b border-ink lg:border-b-0 ${!isLast ? "sm:border-r" : ""} ${
                i % 2 === 0 ? "border-r sm:border-r-0" : ""
              } border-ink transition-colors duration-200 ${
                state.status === "running" ? "bg-neutral-100" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-neutral-500">{s.num}</span>
                <StatusIcon status={state.status} />
              </div>
              <h3 className="font-serif text-xl font-bold">{s.title}</h3>
              <p className="mt-1 font-sans text-xs text-neutral-500">{s.desc}</p>
              {state.message && (
                <p className="mt-3 font-mono text-[11px] text-neutral-600 leading-snug">
                  {state.message}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
