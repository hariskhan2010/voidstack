import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, TerminalSquare } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
// Three.js is the heaviest dependency; load it after the hero text has painted.
const VoidGraph = lazy(() => import("@/components/VoidGraph"));
import { runInTerminal } from "@/lib/bus";

export default function Hero() {
  const reduce = useReducedMotion();
  // WebGL only exists in the browser: skip the graph in the prerendered HTML and mount it after
  // hydration (renderToString can't wait for a lazy chunk, which otherwise throws React #419).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Scroll parallax: as the hero leaves, the copy drifts up and the graph sinks back into the void.
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const copyFade = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);
  const graphScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const graphFade = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const rise = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <section ref={ref} id="top" className="relative overflow-hidden pt-16">
      {/* faint grid, fades out towards the bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_60%_40%,black,transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-2 lg:min-h-[calc(100svh-4rem)] lg:gap-6 px-5 md:px-8 lg:grid-cols-[1.05fr_1fr]">
        <motion.div style={reduce ? undefined : { y: copyY, opacity: copyFade }} className="relative z-10 order-2 pb-12 lg:order-1 lg:pb-0">
          <motion.div {...rise(0)} className="mb-4 inline-flex items-center gap-2 rounded-full md:mb-6 border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-zinc-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primarylw-2 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primarylw-2" />
            </span>
            voidstack · open to work
          </motion.div>
          <motion.h1 {...rise(0.08)} className="max-w-[16ch] text-[2.6rem] font-semibold leading-[1.02] tracking-tighter text-zinc-50 sm:text-5xl md:text-6xl xl:text-7xl">
            I build the <span className="text-primarylw-2">infrastructure</span> AI agents run on.
          </motion.h1>
          <motion.p {...rise(0.16)} className="mt-4 max-w-[46ch] text-base leading-relaxed text-zinc-400 md:mt-6 md:text-lg">
            Haris, full-stack & AI engineer. Code graphs, multi-agent orchestrators, and systems that turn bug reports into pull requests.
          </motion.p>
          <motion.div {...rise(0.24)} className="mt-7 flex flex-wrap items-center gap-3 md:mt-9">
            <a
              href="#work"
              className="inline-flex items-center gap-2 rounded-lg bg-primarylw-2 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 active:scale-[0.98]"
            >
              View work <ArrowDown className="h-4 w-4" />
            </a>
            <button
              onClick={() => runInTerminal("help")}
              className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-medium text-zinc-200 transition hover:border-primarylw-2/50 hover:text-white active:scale-[0.98]"
            >
              <TerminalSquare className="h-4 w-4 text-primarylw-2" /> Open terminal
            </button>
          </motion.div>
        </motion.div>

        <motion.div style={reduce ? undefined : { scale: graphScale, opacity: graphFade }} className="relative order-1 -mx-5 h-[30svh] min-h-[220px] lg:order-2 lg:mx-0 lg:h-[78svh]">
          {mounted && (
            <Suspense fallback={null}>
              <VoidGraph className="absolute inset-0" />
            </Suspense>
          )}
          <div className="pointer-events-none absolute bottom-4 right-2 hidden font-mono text-[11px] leading-5 text-zinc-600 lg:block">
            <div>140 nodes · 5 communities</div>
            <div>live WebGL render</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
