import activity from "@/data/activity.json";

const LEVELS = ["bg-white/[0.04]", "bg-emerald-900/70", "bg-emerald-700/80", "bg-emerald-500/90", "bg-emerald-300"];
const level = (n: number) => (n === 0 ? 0 : n < 3 ? 1 : n < 8 ? 2 : n < 15 ? 3 : 4);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Static on purpose: these numbers are in the prerendered HTML, so crawlers and no-JS readers see
// the real values (an animated count-up rendered them as 0). Each one names where it comes from.
const STATS = [
  { value: String(activity.total), label: "commits", source: `git log across ${activity.repos} repos` },
  { value: "150", label: "tests passing", source: "codegraph · pytest" },
  { value: "84", label: "tests passing", source: "hydra · pytest" },
  { value: "20", label: "languages parsed", source: "codegraph AST tier" },
];

export default function Stats() {
  const weeks = activity.weeks as { date: string; count: number }[][];
  return (
    <section id="evidence" aria-labelledby="stats-title" className="scroll-mt-16 border-y border-white/[0.06] bg-white/[0.015]">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <h2 id="stats-title" className="max-w-[24ch] text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
          Numbers you can check.
        </h2>
        <p className="mt-3 max-w-[60ch] text-zinc-400">Every figure here comes from a test run or the git history, and says which.</p>

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {STATS.map(s => (
            <div key={s.source} className="flex flex-col-reverse border-l border-white/10 pl-5">
              <dt className="mt-2">
                <span className="block text-sm text-zinc-300">{s.label}</span>
                <span className="block font-mono text-xs text-meta">{s.source}</span>
              </dt>
              <dd className="font-mono text-4xl font-medium tracking-tight text-zinc-50 tabular-nums md:text-5xl">{s.value}</dd>
            </div>
          ))}
        </dl>

        <figure className="mt-16">
          <div className="overflow-x-auto pb-2 [scrollbar-width:thin]">
            <div className="inline-flex min-w-max flex-col gap-2">
              <div className="flex gap-[3px] font-mono text-[10px] text-meta" aria-hidden>
                {weeks.map((w, i) => {
                  const d = new Date(w[0].date);
                  const first = i === 0 || new Date(weeks[i - 1][0].date).getMonth() !== d.getMonth();
                  return <span key={i} className="w-[11px] overflow-visible whitespace-nowrap">{first && i < weeks.length - 2 ? MONTHS[d.getMonth()] : ""}</span>;
                })}
              </div>
              <div className="flex gap-[3px]" role="img" aria-label={`Commit heatmap: ${activity.total} commits on ${activity.activeDays} days in the last year`}>
                {weeks.map((w, i) => (
                  <div key={i} className="flex flex-col gap-[3px]">
                    {w.map(day => (
                      <span
                        key={day.date}
                        title={`${day.count} commit${day.count === 1 ? "" : "s"} · ${day.date}`}
                        className={`h-[11px] w-[11px] rounded-[2px] ${LEVELS[level(day.count)]}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-meta">
            <span>Commit activity across public and private repos, generated from git log on {activity.generatedAt}. Tests run the same day.</span>
            <span className="flex items-center gap-1.5" aria-hidden>
              less {LEVELS.map(l => <span key={l} className={`h-[10px] w-[10px] rounded-[2px] ${l}`} />)} more
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
