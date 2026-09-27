import { useId, useState, type ReactNode } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ChevronDown, Lock } from "lucide-react";
import { PROJECTS, type Project } from "@/data/profile";

const byTier = (t: Project["tier"]) => PROJECTS.filter(p => p.tier === t);

function Status({ p }: { p: Project }) {
  if (p.href)
    return (
      <a href={p.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-primarylw-2/30 px-2.5 py-0.5 font-mono text-[11px] text-primarylw-2 hover:bg-primarylw-2/10">
        GitHub <ArrowUpRight className="h-3 w-3" aria-hidden />
        <span className="sr-only">: {p.name} repository</span>
      </a>
    );
  const label = p.status === "in progress" ? "in progress" : "private repo";
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[11px] text-meta">
      {p.status !== "in progress" && <Lock className="h-3 w-3" aria-hidden />} {label}
    </span>
  );
}

const Stack = ({ items }: { items: string[] }) => (
  <ul className="flex flex-wrap gap-1.5" aria-label="Technology">
    {items.map(s => <li key={s} className="rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[11px] text-zinc-400">{s}</li>)}
  </ul>
);

// ── visuals, one per major system ───────────────────────────────────────────
function Pipeline() {
  return (
    <div aria-hidden className="flex flex-wrap items-center gap-2 gap-y-3 font-mono text-xs">
      {["issue", "index", "plan", "guard", "PR"].map((s, i, a) => (
        <div key={s} className="flex items-center gap-2">
          <span className={`rounded-md border px-2.5 py-1.5 ${i === a.length - 1 ? "border-primarylw-2/50 bg-primarylw-2/10 text-primarylw-2" : "border-white/10 bg-white/[0.03] text-zinc-300"}`}>{s}</span>
          {i < a.length - 1 && <span className="h-px w-4 bg-white/15 md:w-6" />}
        </div>
      ))}
    </div>
  );
}
function Lanes() {
  return (
    <div aria-hidden className="space-y-2.5">
      {[0.62, 0.9, 0.45, 0.78].map((w, i) => (
        <div key={i} className="flex items-center gap-3 font-mono text-[10px] text-meta">
          <span className="w-10">wt-{i + 1}</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
            <div className="h-full origin-left animate-[growIn_1.4s_cubic-bezier(.22,1,.36,1)_both] rounded-full bg-gradient-to-r from-emerald-700 to-primarylw-2 motion-reduce:animate-none" style={{ width: `${w * 100}%`, animationDelay: `${i * 0.15}s` }} />
          </div>
        </div>
      ))}
      <div className="flex items-center gap-3 font-mono text-[10px] text-primarylw-2">
        <span className="w-10">merge</span><span className="h-px flex-1 bg-primarylw-2/40" /><span>✓ gate</span>
      </div>
    </div>
  );
}
function StateFiles() {
  return (
    <pre aria-hidden className="overflow-x-auto font-mono text-xs leading-6 text-meta">
{`.overpower/
  plan.md      `}<span className="text-zinc-300">task sized first</span>{`
  runs/        `}<span className="text-zinc-300">result counts with a run id</span>{`
  impact.md    `}<span className="text-primarylw-2">callers named before a fix</span>
    </pre>
  );
}
const VISUAL: Record<string, ReactNode> = { closedloop: <Pipeline />, hydra: <Lanes />, overpower: <StateFiles /> };

// ── major system: a case study that opens in place ──────────────────────────
function CaseStudy({ p, index }: { p: Project; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const reduce = useReducedMotion();
  const panel = useId();
  return (
    <motion.article
      initial={reduce ? false : { y: 24 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="grid gap-8 border-t border-white/[0.08] py-10 md:grid-cols-[1.2fr_1fr] md:gap-14 md:py-14"
    >
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-3xl font-semibold tracking-tight text-zinc-50">{p.name}</h3>
          <Status p={p} />
        </div>
        <p className="mt-2 text-lg text-zinc-300">{p.tagline}</p>
        <dl className="mt-6 space-y-4">
          <div><dt className="text-sm font-medium text-zinc-300">Problem</dt><dd className="mt-1 max-w-[62ch] text-zinc-400">{p.problem}</dd></div>
          <div><dt className="text-sm font-medium text-zinc-300">Solution</dt><dd className="mt-1 max-w-[62ch] text-zinc-400">{p.solution}</dd></div>
        </dl>

        <button
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-controls={panel}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/10 px-4 text-sm text-zinc-200 transition hover:border-primarylw-2/40 hover:text-white"
        >
          {open ? "Hide details" : "How it works"}
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={panel}
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduce ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <ul className="mt-6 space-y-2.5">
                {p.approach!.map(a => (
                  <li key={a} className="flex gap-3 text-sm leading-relaxed text-zinc-400">
                    <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-primarylw-2" />
                    {a}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-6 self-start rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-6 md:p-7">
        {VISUAL[p.id]}
        <div>
          <p className="font-mono text-xs text-meta">Evidence</p>
          <ul className="mt-2 space-y-1.5">
            {p.evidence!.map(e => <li key={e} className="text-sm text-zinc-200">{e}</li>)}
          </ul>
        </div>
        <div className="mt-auto"><Stack items={p.stack} /></div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="scroll-mt-16 mx-auto max-w-7xl px-5 pb-24 md:px-8 md:pb-32">
      <h2 id="projects-title" className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">Major systems</h2>
      <p className="mt-3 max-w-[60ch] text-zinc-400">Infrastructure for running, coordinating and trusting coding agents.</p>
      <div className="mt-10">
        {byTier("major").map((p, i) => <CaseStudy key={p.id} p={p} index={i} />)}
      </div>

      <h2 className="mt-20 text-2xl font-semibold tracking-tight text-zinc-50 md:text-3xl">Products & agents</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {byTier("product").map(p => (
          <article key={p.id} className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-semibold tracking-tight text-zinc-50">{p.name}</h3>
              <Status p={p} />
            </div>
            <p className="text-[15px] text-zinc-300">{p.tagline}</p>
            <p className="text-sm leading-relaxed text-meta">{p.summary}</p>
            <div className="mt-auto"><Stack items={p.stack} /></div>
          </article>
        ))}
      </div>

      <h2 className="mt-16 text-lg font-semibold tracking-tight text-zinc-300">Experiments</h2>
      <ul className="mt-4 divide-y divide-white/[0.06] border-y border-white/[0.06]">
        {byTier("experiment").map(p => (
          <li key={p.id} className="flex flex-col gap-1 py-4 md:flex-row md:items-baseline md:gap-6">
            <span className="w-32 shrink-0 font-mono text-sm text-zinc-100">{p.name}</span>
            <span className="text-sm text-zinc-400">{p.tagline} {p.summary}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
