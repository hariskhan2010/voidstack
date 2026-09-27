import { motion, useReducedMotion } from "motion/react";

// Each principle is lifted from a design decision in one of the projects, and says which.
const PRINCIPLES = [
  {
    title: "Say how sure you are.",
    body: "codegraph tags every edge EXTRACTED, INFERRED or AMBIGUOUS, so an agent knows which facts to trust and which to check.",
    source: "codegraph",
  },
  {
    title: "Nothing fails silently.",
    body: "Every dropped task or failed gate in hydra lands in FAILURES.md and on stdout. If it broke, you hear about it.",
    source: "hydra",
  },
  {
    title: "Verified, not claimed.",
    body: "In overpower a delegate's result only counts with an artifact: a run id, a result block, a new diff. No artifact, no credit.",
    source: "overpower",
  },
  {
    title: "Guardrails before autonomy.",
    body: "ClosedLoop classifies every action and takes a real write lease before it touches a repo. Autonomy is earned per action.",
    source: "ClosedLoop",
  },
];

export default function Philosophy() {
  const reduce = useReducedMotion();
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-16 border-t border-white/[0.06]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-[0.9fr_1.1fr] md:gap-20 md:px-8 md:py-32">
        <div className="md:sticky md:top-28 md:self-start">
          <h2 id="about-title" className="text-4xl font-semibold tracking-tighter text-zinc-50 md:text-5xl">How I build.</h2>
          <p className="mt-5 max-w-[42ch] text-lg leading-relaxed text-zinc-400">
            I'm Haris. I build the plumbing for coding agents: tools that let them read a codebase precisely,
            work in parallel without stepping on each other, and ship changes a human can trust.
          </p>
          <p className="mt-4 max-w-[42ch] text-zinc-500">Four rules I keep coming back to, each one learned the hard way in a real project.</p>
        </div>

        <ol className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {PRINCIPLES.map((p, i) => (
            <motion.li
              key={p.title}
              initial={reduce ? false : { y: 28 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group grid gap-3 py-9 md:py-11"
            >
              <h3 className="text-2xl font-medium tracking-tight text-zinc-100 transition-colors group-hover:text-primarylw-2 md:text-3xl">{p.title}</h3>
              <p className="max-w-[56ch] leading-relaxed text-zinc-400">{p.body}</p>
              <span className="font-mono text-xs text-zinc-600">from {p.source}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
