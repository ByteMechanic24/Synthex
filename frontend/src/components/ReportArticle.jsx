// Strip markdown bold/italic/heading markers so LLM markdown renders as plain
// styled text instead of literal asterisks.
function stripMarkdown(str) {
  return str
    .replace(/^#{1,6}\s*/, "")       // leading #, ##, ### etc
    .replace(/\*\*(.*?)\*\*/g, "$1") // **bold**
    .replace(/\*(.*?)\*/g, "$1")     // *italic*
    .trim();
}

function renderBlocks(text) {
  const blocks = text.trim().split(/\n\s*\n/);
  let firstParaUsed = false;

  return blocks.map((block, i) => {
    const trimmed = block.trim();
    const lines = trimmed.split("\n").map((l) => l.trim()).filter(Boolean);

    const isList = lines.every((l) => l.startsWith("- ") || l.startsWith("* "));

    const firstClean = stripMarkdown(lines[0] || "");
    const isHeading =
      lines.length === 1 &&
      !isList &&
      (/^(introduction|key findings|conclusion|sources)/i.test(firstClean) ||
        /^\*\*.*\*\*$/.test(lines[0]) ||
        /^#{1,3}\s/.test(lines[0]) ||
        (firstClean === firstClean.toUpperCase() && firstClean.length < 40));

    if (isHeading) {
      return (
        <h3 key={i} className="font-serif text-2xl font-bold mt-8 mb-3 first:mt-0">
          {firstClean}
        </h3>
      );
    }

    if (isList) {
      return (
        <ul key={i} className="space-y-2 my-4 pl-1">
          {lines.map((l, j) => (
            <li key={j} className="flex gap-3 font-body text-[15px] leading-relaxed text-neutral-700">
              <span className="text-accent font-mono mt-1">&#9656;</span>
              <span>{stripMarkdown(l.replace(/^[-*]\s*/, ""))}</span>
            </li>
          ))}
        </ul>
      );
    }

    const applyDropCap = !firstParaUsed;
    if (applyDropCap) firstParaUsed = true;

    return (
      <p
        key={i}
        className={`font-body text-[15px] sm:text-base leading-relaxed text-neutral-700 text-justify mb-4 ${
          applyDropCap ? "drop-cap" : ""
        }`}
      >
        {stripMarkdown(trimmed)}
      </p>
    );
  });
}

export default function ReportArticle({ report, topic }) {
  if (!report) return null;

  return (
    <article className="p-6 sm:p-10">
      <p className="font-mono text-xs uppercase tracking-widest text-accent mb-2">Front Page &middot; Feature</p>
      <h2 className="font-serif text-3xl sm:text-4xl font-black leading-[0.95] tracking-tight mb-6">
        {topic}
      </h2>
      <div className="border-t-4 border-ink pt-6">{renderBlocks(report)}</div>
    </article>
  );
}