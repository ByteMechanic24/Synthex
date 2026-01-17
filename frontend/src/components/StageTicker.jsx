export default function StageTicker({ items, isRunning }) {
  if (!items.length) return null;

  const text = items.join("     \u2727     ");

  return (
    <div className="bg-ink text-paper overflow-hidden border-b border-ink">
      <div className="flex items-center">
        <span className="shrink-0 bg-accent text-paper font-mono text-[10px] uppercase tracking-widest px-3 py-2">
          {isRunning ? "Live" : "Last Run"}
        </span>
        <div className="relative flex-1 overflow-hidden whitespace-nowrap">
          <div className="inline-block py-2 pl-4 font-mono text-xs uppercase tracking-wide animate-marquee">
            <span>{text}</span>
            <span className="pl-4">{text}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
