function stripMarkdown(str) {
  return str
    .replace(/^#{1,6}\s*/, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .trim();
}

function parseScore(text) {
  const match = text.match(/score:\s*(\d+(?:\.\d+)?)\s*\/\s*10/i);
  return match ? match[1] : null;
}

function renderFeedback(text) {
  // Critic sometimes returns everything as one giant "- " bulleted line
  // (e.g. "- **Strengths:** - point one - point two - **Areas to Improve:** ...").
  // Split on section labels first so headings break onto their own line,
  // then split each section into bullets.
  const withBreaks = text
    .replace(/\*\*(Strengths|Areas to Improve|One line verdict)[:.]?\*\*/gi, "\n\n$1:\n")
    .replace(/^score:.*$/im, "");

  const blocks = withBreaks.trim().split(/\n\s*\n/).filter(Boolean);

  return blocks.map((block, i) => {
    const lines = block
      .trim()
      .split(/\n|(?=- \*\*)|(?<=\.)\s+-\s+/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) return null;

    const isHeading = lines.length === 1 && /^(strengths|areas to improve|one line verdict)/i.test(lines[0]);
    if (isHeading) {
      return (
        <h4 key={i} className="font-mono text-[11px] uppercase tracking-widest text-neutral-500 mt-5 mb-2 first:mt-0">
          {stripMarkdown(lines[0]).replace(":", "")}
        </h4>
      );
    }

    const bulletLines = lines.filter((l) => l.startsWith("-"));
    if (bulletLines.length >= Math.max(1, lines.length - 1)) {
      return (
        <ul key={i} className="space-y-1.5">
          {lines.map((l, j) => (
            <li key={j} className="flex gap-2 font-sans text-sm text-neutral-700">
              <span className="text-accent">&minus;</span>
              <span>{stripMarkdown(l.replace(/^-\s*/, ""))}</span>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={i} className="font-sans text-sm text-neutral-700 leading-relaxed">
        {stripMarkdown(block)}
      </p>
    );
  });
}

export default function CriticPanel({ feedback }) {
  if (!feedback) return null;
  const score = parseScore(feedback);

  return (
    <aside className="border-t lg:border-t-0 lg:border-l border-ink bg-ink text-paper">
      <div className="p-6 sm:p-8 sticky top-0">
        <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
          Editor&rsquo;s Review
        </p>

        {score && (
          <div className="mb-6 border border-paper/40 p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Score</p>
            <p className="font-serif text-6xl font-black leading-none">
              {score}
              <span className="text-2xl text-neutral-400">/10</span>
            </p>
          </div>
        )}

        <div className="[&_h4]:text-neutral-400 [&_p]:text-neutral-200 [&_li]:text-neutral-200">
          {renderFeedback(feedback)}
        </div>
      </div>
    </aside>
  );
}