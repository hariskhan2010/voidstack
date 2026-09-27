import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

const WORDS = ["codegraph", "hydra", "overpower", "ClosedLoop", "StoneWise", "Prism"];

// Scroll-linked, not autoplaying: the strip moves only while the visitor scrolls past it.
function Row({ reverse = false }: { reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], reverse ? ["-30%", "0%"] : ["0%", "-30%"]);
  const items = [...WORDS, ...WORDS, ...WORDS];
  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div style={reduce ? undefined : { x }} className="flex w-max items-center gap-[4vw] whitespace-nowrap">
        {items.map((w, i) => (
          <span key={i} className="flex items-center gap-[4vw]">
            <span
              className={`text-[clamp(3rem,9vw,8.5rem)] font-semibold leading-none tracking-tighter ${
                i % 2 === (reverse ? 1 : 0) ? "text-zinc-100" : "text-transparent [-webkit-text-stroke:1.5px_rgba(161,161,170,.45)]"
              }`}
            >
              {w}
            </span>
            <span className="h-3 w-3 rounded-full bg-primarylw-2 md:h-4 md:w-4" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  return (
    <div aria-hidden className="space-y-3 overflow-hidden border-y border-white/[0.06] py-10 md:space-y-5 md:py-14">
      <Row />
      <Row reverse />
    </div>
  );
}
