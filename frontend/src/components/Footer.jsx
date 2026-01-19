export default function Footer() {
  return (
    <footer className="border-t-4 border-ink mt-16">
      <div className="max-w-screen-xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <p className="font-serif text-lg font-bold">SYNTHEX</p>
          <p className="font-sans text-xs text-neutral-500 mt-1">
            Search, read, write, critique &mdash; four agents on one desk.
          </p>
        </div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-neutral-500 sm:text-center">
          Edition: Vol 1.0
        </div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-neutral-500 sm:text-right">
          Model: Mistral Small &middot; LangChain
        </div>
      </div>
    </footer>
  );
}
