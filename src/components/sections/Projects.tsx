import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Lock, Sparkles } from "lucide-react";
import { PROJECTS, type Project } from "@/data/profile";

const byId = Object.fromEntries(PROJECTS.map(p => [p.id, p])) as Record<string, Project>;

function Status({ p }: { p: Project }) {
  if (p.status === "public")
    return (
      <a href={p.href} target="_blank" rel="noreferrer" className="relative z-10 inline-flex items-center gap-1 rounded-full border border-primarylw-2/30 px-2.5 py-0.5 font-mono text-[11px] text-primarylw-2 hover:bg-primarylw-2/10">
        public <ArrowUpRight className="h-3 w-3" />
      </a>
    );
  if (p.status === "new")
    return <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[11px] text-zinc-300"><Sparkles className="h-3 w-3" /> new</span>;
  return <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[11px] text-zinc-500"><Lock className="h-3 w-3" /> private</span>;
}

// Card with a pointer-following spotlight (CSS variables, no React re-renders).
function Tile({ p, className = "", visual, wide }: { p: Project; className?: string; visual?: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    ref.current!.style.setProperty("--x", `${e.clientX - r.left}px`);
    ref.current!.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <motion.article
      ref={ref}
      onPointerMove={onMove}
      initial={reduce ? false : { y: 24 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0d10] p-6 md:p-7 ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(420px_circle_at_var(--x)_var(--y),rgba(52,211,153,.10),transparent_60%)]"
      />
      {visual}
      <div className={`relative mt-auto ${wide ? "md:flex md:items-end md:justify-between md:gap-10" : ""}`}>
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold tracking-tight text-zinc-50">{p.name}</h3>
            <Status p={p} />
          </div>
          <p className="mt-1.5 text-[15px] text-zinc-300">{p.tagline}</p>
          <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-400">{p.summary}</p>
        </div>
        <ul className={`mt-5 flex flex-wrap gap-1.5 ${wide ? "md:mt-0 md:max-w-xs md:justify-end" : ""}`}>
          {p.stack.map(s => (
            <li key={s} className="rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[11px] text-zinc-400">{s}</li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

function Pipeline({ steps }: { steps: string[] }) {
  return (
    <div className="relative mb-10 flex flex-wrap items-center gap-2 gap-y-3 font-mono text-xs md:gap-3">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2 md:gap-3">
          <span className={`rounded-md border px-2.5 py-1.5 md:px-3 ${i === steps.length - 1 ? "border-primarylw-2/50 bg-primarylw-2/10 text-primarylw-2" : "border-white/10 bg-white/[0.03] text-zinc-300"}`}>
            {s}
          </span>
          {i < steps.length - 1 && (
            <span className="relative h-px w-4 overflow-hidden bg-white/15 md:w-10">
              <span className="absolute inset-y-0 left-0 w-3 animate-[flow_1.8s_linear_3] bg-primarylw-2 motion-reduce:hidden" style={{ animationDelay: `${i * 0.3}s` }} />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// Illustrative, and labelled as such: what one pass of the loop looks like.
function RunLog() {
  const lines: [string, string][] = [
    ["issue", "TypeError in applyDiscount() · checkout.ts"],
    ["index", "symbol graph built · 3 candidate call sites"],
    ["plan", "guard the null cart before discounting"],
    ["guard", "action class: edit · write lease acquired"],
    ["PR", "opened for human review"],
  ];
  return (
    <div className="relative -mt-4 mb-8 hidden max-w-xl rounded-lg border border-white/[0.06] bg-black/30 p-4 font-mono text-[12px] leading-6 md:block">
      <div className="mb-1 text-zinc-600">example run</div>
      {lines.map(([k, v], i) => (
        <div key={k} className="flex gap-3">
          <span className={`w-12 shrink-0 ${i === lines.length - 1 ? "text-primarylw-2" : "text-zinc-500"}`}>{k}</span>
          <span className={i === lines.length - 1 ? "text-zinc-200" : "text-zinc-400"}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function Lanes() {
  return (
    <div aria-hidden className="mb-8 space-y-2.5">
      {[0.62, 0.9, 0.45, 0.78].map((w, i) => (
        <div key={i} className="flex items-center gap-3 font-mono text-[10px] text-zinc-600">
          <span className="w-12">wt-{i + 1}</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
            <div className="h-full origin-left animate-[growIn_1.4s_cubic-bezier(.22,1,.36,1)_both] rounded-full bg-gradient-to-r from-emerald-700 to-primarylw-2 motion-reduce:animate-none" style={{ width: `${w * 100}%`, animationDelay: `${i * 0.4}s` }} />
          </div>
        </div>
      ))}
      <div className="flex items-center gap-3 font-mono text-[10px] text-primarylw-2">
        <span className="w-12">merge</span>
        <span className="h-px flex-1 bg-primarylw-2/40" />
        <span>✓ gate</span>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section aria-labelledby="projects-title" className="mx-auto max-w-7xl px-5 pb-24 md:px-8 md:pb-32">
      <h2 id="projects-title" className="max-w-[20ch] text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
        Agents, orchestrators, and the apps around them.
      </h2>
      <div className="mt-12 grid auto-rows-[minmax(0,auto)] grid-cols-1 gap-4 md:grid-cols-6">
        <Tile p={byId.closedloop} className="md:col-span-4 md:row-span-2 md:min-h-[380px]" visual={<><Pipeline steps={byId.closedloop.facts} /><RunLog /></>} />
        <Tile p={byId.hydra} className="md:col-span-2 md:row-span-2" visual={<Lanes />} />
        <Tile p={byId.overpower} className="md:col-span-2" />
        <Tile
          p={byId.stonewise}
          className="md:col-span-2"
          visual={<div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rotate-45 rounded-[28%] bg-gradient-to-br from-emerald-400/25 via-emerald-700/10 to-transparent blur-[2px]" />}
        />
        <Tile p={byId["seo-agent"]} className="md:col-span-2" />
        <Tile
          p={byId.prism}
          wide
          className="md:col-span-6 bg-[linear-gradient(110deg,#0c0d10_40%,rgba(52,211,153,.07))]"
        />
      </div>
    </section>
  );
}
