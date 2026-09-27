import { motion, useReducedMotion } from "framer-motion";
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
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export default function Featured() {
  const b = CODEGRAPH.benchmark;
  return (
    <section id="work" className="scroll-mt-20">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-2">
        <div>
          <p className="font-mono text-sm text-primarylw-2">01 / flagship</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tighter text-zinc-50 md:text-5xl">codegraph</h2>
          <p className="mt-4 max-w-[48ch] text-lg leading-relaxed text-zinc-300">{CODEGRAPH.tagline}</p>
          <p className="mt-3 max-w-[58ch] text-zinc-400">
            A persistent SQLite graph of every symbol, call and import in a repo, built once and updated incrementally.
            An agent asks <em className="text-zinc-200">"what breaks if I change login?"</em> and gets a file:line-precise answer.
          </p>

          <ul className="mt-8 divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {CODEGRAPH.points.map(([n, text]) => (
              <li key={text} className="flex items-baseline gap-5 py-3.5">
                <span className="w-14 shrink-0 font-mono text-xl text-zinc-50">{n}</span>
                <span className="text-sm text-zinc-400">{text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 max-w-md">
            <TerminalCard command={CODEGRAPH.install} />
          </div>
          <div className="mt-6 flex gap-6 text-sm">
            <a href={CODEGRAPH.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-zinc-200 underline-offset-4 hover:text-primarylw-2 hover:underline">
              Source on GitHub <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href={CODEGRAPH.pypi} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-zinc-200 underline-offset-4 hover:text-primarylw-2 hover:underline">
              PyPI <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-7 md:p-10">
          <BorderBeam size={220} duration={9} colorFrom="#34d399" colorTo="#065f46" borderThickness={1.5} />
          <p className="font-mono text-xs text-zinc-500">benchmark · 192-file Python repo</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50">
            How often is a "certain" call edge actually wrong?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Every edge each tool marks as EXTRACTED whose target is a common method name, checked by hand against the source line.
          </p>
          <div className="mt-9 space-y-7">
            <Bar label="graphify" wrong={b.graphifyWrong} total={b.checked} />
            <Bar label="codegraph" wrong={b.codegraphWrong} total={b.checked} accent />
          </div>
          <p className="mt-9 border-t border-white/[0.06] pt-5 text-sm text-zinc-400">
            graphify wired every <code className="font-mono text-zinc-200">@router.get</code> to an unrelated <code className="font-mono text-zinc-200">get()</code>.
            codegraph's receiver-aware resolver tells them apart.
          </p>
        </div>
      </div>
    </section>
  );
}
