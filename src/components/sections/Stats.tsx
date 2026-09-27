import CountUp from "@/components/lightswind/count-up";
import activity from "@/data/activity.json";

const LEVELS = ["bg-white/[0.04]", "bg-emerald-900/70", "bg-emerald-700/80", "bg-emerald-500/90", "bg-emerald-300"];
const level = (n: number) => (n === 0 ? 0 : n < 3 ? 1 : n < 8 ? 2 : n < 15 ? 3 : 4);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const STATS = [
  { value: activity.total, label: "commits", note: `across ${activity.repos} repos` },
  { value: 20, label: "languages", note: "parsed by codegraph" },
  { value: 150, label: "tests", note: "green on codegraph" },
  { value: 28, label: "agent skills", note: "in the SEO agent" },
];

export default function Stats() {
  const weeks = activity.weeks as { date: string; count: number }[][];
  return (
    <section aria-labelledby="stats-title" className="border-y border-white/[0.06] bg-white/[0.015]">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <h2 id="stats-title" className="max-w-[22ch] text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
          Shipping, mostly in private repos.
        </h2>

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {STATS.map(s => (
            <div key={s.label} className="border-l border-white/10 pl-5">
              <dd>
                <CountUp
                  value={s.value}
                  duration={1.6}
                  triggerOnView
                  className="block"
                  numberClassName="font-mono text-4xl font-medium tracking-tight text-zinc-50 md:text-5xl"
                />
              </dd>
              <dt className="mt-2 text-sm text-zinc-300">{s.label}</dt>
              <p className="text-xs text-zinc-500">{s.note}</p>
            </div>
          ))}
        </dl>

        <figure className="mt-16">
          <div className="overflow-x-auto pb-2 [scrollbar-width:thin]">
            <div className="inline-flex min-w-max flex-col gap-2">
              <div className="flex gap-[3px] pl-0 font-mono text-[10px] text-zinc-600">
                {weeks.map((w, i) => {
                  const d = new Date(w[0].date);
                  const first = i === 0 || new Date(weeks[i - 1][0].date).getMonth() !== d.getMonth();
                  return <span key={i} className="w-[11px] overflow-visible whitespace-nowrap">{first && i < weeks.length - 2 ? MONTHS[d.getMonth()] : ""}</span>;
                })}
              </div>
              <div className="flex gap-[3px]" role="img" aria-label={`Commit heatmap: ${activity.total} commits over ${activity.activeDays} active days in the last year`}>
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
          <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
            <span>Real commit history across my repos, public and private. Generated from git log on {activity.generatedAt}.</span>
            <span className="flex items-center gap-1.5">
              less {LEVELS.map(l => <span key={l} className={`h-[10px] w-[10px] rounded-[2px] ${l}`} />)} more
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
