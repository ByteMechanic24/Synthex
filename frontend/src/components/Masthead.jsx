function todayEdition() {
  const d = new Date();
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default function Masthead() {
  return (
    <header className="border-b-4 border-ink">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between py-2 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-neutral-500 border-b border-divider">
          <span>Vol. 1 &nbsp;|&nbsp; {todayEdition()}</span>
          <span className="hidden sm:inline">Autonomous Research Desk</span>
        </div>

        <div className="grid grid-cols-12 items-end py-6 sm:py-10">
          <div className="col-span-12 lg:col-span-9 border-r-0 lg:border-r border-divider lg:pr-6">
            <h1 className="font-serif font-black tracking-tighter leading-[0.9] text-5xl sm:text-6xl lg:text-8xl">
              SYNTHEX
            </h1>
            <p className="mt-3 font-body italic text-neutral-600 text-sm sm:text-base">
              Four agents. One desk. Every story, sourced and scrutinized.
            </p>
          </div>
          <div className="hidden lg:flex col-span-3 justify-end">
            <div className="border border-ink px-4 py-3 text-right">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Staff</p>
              <p className="font-serif text-lg leading-tight">Search &middot; Reader</p>
              <p className="font-serif text-lg leading-tight">Writer &middot; Critic</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
