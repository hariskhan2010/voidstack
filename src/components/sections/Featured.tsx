import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { BorderBeam } from "@/components/lightswind/border-beam";
import TerminalCard from "@/components/lightswind/terminal-card";
import { CODEGRAPH } from "@/data/profile";

function Bar({ label, wrong, total, accent }: { label: string; wrong: number; total: number; accent?: boolean }) {
  const reduce = useReducedMotion();
  const pct = Math.round((wrong / total) * 100);
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between font-mono text-sm">
        <span className={accent ? "text-zinc-50" : "text-zinc-400"}>{label}</span>
        <span className={accent ? "text-primarylw-2" : "text-zinc-300"}>
          {wrong}/{total} wrong · <strong className="font-semibold">{pct}%</strong>
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/[0.05]">
        <motion.div
          className={`h-full origin-left rounded-full ${accent ? "bg-primarylw-2" : "bg-zinc-500"}`}
          style={{ width: `${Math.max(pct, 1.5)}%` }}
          initial={reduce ? false : { scaleX: 0.08 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

// Repository → … → agents, drawn as a flow: horizontal on wide screens, vertical on phones.
function Architecture() {
  const steps = CODEGRAPH.pipeline;
  return (
    <figure className="mt-14" aria-labelledby="cg-arch">
      <figcaption id="cg-arch" className="mb-4 font-mono text-xs text-meta">How it works</figcaption>
      <ol className="grid gap-2 md:grid-cols-6 md:gap-0">
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          return (
            <li key={s.step} className="relative flex items-center gap-3 md:flex-col md:items-stretch md:gap-0">
              <div
                className={`flex-1 rounded-lg border px-4 py-3 md:mx-1.5 md:min-h-[88px] ${
                  last ? "border-primarylw-2/50 bg-primarylw-2/[0.08]" : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <div className={`text-sm font-medium ${last ? "text-primarylw-2" : "text-zinc-100"}`}>{s.step}</div>
                <div className="mt-1 font-mono text-[11px] leading-4 text-meta">{s.detail}</div>
              </div>
              {!last && (
                <span aria-hidden className="absolute -bottom-2 left-6 z-10 text-meta md:bottom-auto md:left-auto md:-right-[7px] md:top-1/2 md:-translate-y-1/2">
                  <span className="md:hidden">↓</span>
                  <span className="hidden md:inline">→</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

export default function Featured() {
  const b = CODEGRAPH.benchmark;
  return (
    <section id="work" aria-labelledby="cg-title" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <p className="font-mono text-sm text-primarylw-2">Flagship</p>
        <div className="mt-3 grid items-start gap-14 lg:grid-cols-2">
          <div>
            <h2 id="cg-title" className="text-4xl font-semibold tracking-tighter text-zinc-50 md:text-5xl">codegraph</h2>
            <p className="mt-4 max-w-[40ch] text-2xl leading-snug tracking-tight text-zinc-200">{CODEGRAPH.tagline}</p>

            <dl className="mt-8 space-y-5">
              <div>
                <dt className="text-sm font-medium text-zinc-300">Problem</dt>
                <dd className="mt-1 max-w-[60ch] text-zinc-400">{CODEGRAPH.problem}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-300">Solution</dt>
                <dd className="mt-1 max-w-[60ch] text-zinc-400">{CODEGRAPH.solution}</dd>
              </div>
            </dl>

            <ul className="mt-8 divide-y divide-white/[0.06] border-y border-white/[0.06]" aria-label="Evidence">
              {CODEGRAPH.evidence.map(([n, text]) => (
                <li key={text} className="flex items-baseline gap-5 py-3.5">
                  <span className="w-20 shrink-0 font-mono text-xl text-zinc-50 tabular-nums">{n}</span>
                  <span className="text-sm text-zinc-400">{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 max-w-md">
              <TerminalCard command={CODEGRAPH.install} />
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {[["Source on GitHub", CODEGRAPH.repo], ["PyPI package", CODEGRAPH.pypi], ["Benchmark method", CODEGRAPH.benchmarkDoc]].map(([label, href]) => (
                <a key={href} href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-zinc-200 underline-offset-4 hover:text-primarylw-2 hover:underline">
                  {label} <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-7 md:p-10">
            <BorderBeam size={220} duration={9} colorFrom="#34d399" colorTo="#065f46" borderThickness={1.5} />
            <p className="font-mono text-xs text-meta">benchmark · 192-file Python repo</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50">How often is a "certain" call edge actually wrong?</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Every edge each tool marks EXTRACTED whose target is a common method name, checked by hand against the source line.
            </p>
            <div className="mt-9 space-y-7">
              <Bar label="graphify" wrong={b.graphifyWrong} total={b.checked} />
              <Bar label="codegraph" wrong={b.codegraphWrong} total={b.checked} accent />
            </div>
            <p className="mt-9 border-t border-white/[0.06] pt-5 text-sm text-zinc-400">
              graphify wired every <code className="font-mono text-zinc-200">@router.get</code> to an unrelated <code className="font-mono text-zinc-200">get()</code>. codegraph's
              receiver-aware resolver tells them apart.
            </p>
          </div>
        </div>
        <Architecture />
      </div>
    </section>
  );
}
