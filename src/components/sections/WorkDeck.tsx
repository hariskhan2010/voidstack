import type { ReactNode } from "react";
import StackSpread, { type StackSpreadCard } from "@/components/ui/stack-spread";

// Each project as a physical card: name, one mark, one visual only that project would have.
function Face({ name, kind, children, tone = "base" }: { name: string; kind: string; children: ReactNode; tone?: "base" | "accent" | "deep" }) {
  const bg = {
    base: "bg-[#101216] border-white/[0.09]",
    accent: "bg-[radial-gradient(120%_90%_at_80%_0%,rgba(52,211,153,.22),#0d1512_60%)] border-emerald-400/25",
    deep: "bg-[#0b0c0f] border-white/[0.06]",
  }[tone];
  return (
    // The outer box is the size container; cqw units resolve against it from the inner box.
    <div className={`@container absolute inset-0 rounded-[inherit] border ${bg}`}>
      <div className="flex h-full flex-col p-[6cqw]">
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-[max(12px,7cqw)] font-semibold tracking-tight text-zinc-50">{name}</span>
        <span className="shrink-0 font-mono text-[max(9px,3.6cqw)] uppercase tracking-wider text-meta">{kind}</span>
      </div>
      <div className="relative mt-[5cqw] min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

const GraphMark = () => (
  <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden>
    {[[30, 30, 70, 58], [70, 58, 120, 30], [70, 58, 110, 88], [120, 30, 170, 52], [110, 88, 170, 52], [30, 30, 30, 84], [30, 84, 70, 58]].map(([a, b, c, d], i) => (
      <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="rgba(161,161,170,.35)" strokeWidth="1.2" />
    ))}
    {[[30, 30, 4], [70, 58, 7], [120, 30, 4], [110, 88, 4], [170, 52, 7], [30, 84, 4]].map(([x, y, r], i) => (
      <circle key={i} cx={x} cy={y} r={r} fill={r > 5 ? "#34d399" : "#a1a1aa"} />
    ))}
    <text x="200" y="108" textAnchor="end" fill="#34d399" fontFamily="Geist Mono, monospace" fontSize="15">0/33 wrong</text>
  </svg>
);

const Lanes = () => (
  <div className="flex h-full items-end gap-[6%]" aria-hidden>
    {[0.55, 0.9, 0.4, 0.75].map((h, i) => (
      <div key={i} className="flex flex-1 flex-col justify-end rounded-sm bg-white/[0.04]" style={{ height: "100%" }}>
        <div className="rounded-sm bg-gradient-to-t from-emerald-700 to-emerald-400" style={{ height: `${h * 100}%` }} />
      </div>
    ))}
  </div>
);

const Loop = () => (
  <ol className="flex h-full flex-col justify-between font-mono text-[max(9px,4.4cqw)] text-meta" aria-hidden>
    {["observe", "research", "plan", "verify", "learn"].map((s, i, a) => (
      <li key={s} className={i === a.length - 1 ? "text-emerald-400" : ""}>{String(i + 1).padStart(2, "0")} {s}</li>
    ))}
  </ol>
);

const Pipeline = () => (
  <div className="flex h-full flex-wrap content-center gap-[3cqw] font-mono text-[max(9px,4.2cqw)]" aria-hidden>
    {["issue", "index", "plan", "guard", "PR"].map((s, i) => (
      <span key={s} className={`rounded border px-[3cqw] py-[1.5cqw] ${i === 4 ? "border-emerald-400/50 text-emerald-300" : "border-white/10 text-zinc-300"}`}>{s}</span>
    ))}
  </div>
);

const Gem = () => (
  <div className="grid h-full place-items-center" aria-hidden>
    <div className="aspect-square w-[55%] rotate-45 rounded-[22%] bg-gradient-to-br from-emerald-300 via-emerald-600 to-emerald-950 shadow-[0_0_60px_rgba(52,211,153,.35)]" />
  </div>
);

const Skill = () => (
  <pre className="h-full overflow-hidden font-mono text-[max(9px,4.4cqw)] leading-[1.55] text-zinc-400" aria-hidden>
{`---
name: overpower
---
`}<span className="text-emerald-400">size the task first.</span>{`
verify every run.
state survives.`}
  </pre>
);

const Shell = () => (
  <pre className="h-full overflow-hidden font-mono text-[max(9px,4.6cqw)] leading-[1.6] text-zinc-400" aria-hidden>
    <span className="text-emerald-400">❯</span> sudo hire-me{"\n"}
    <span className="text-zinc-200">permission granted.</span>{"\n"}
    <span className="text-emerald-400">❯</span> <span className="inline-block h-[1em] w-[0.5em] translate-y-[2px] bg-emerald-400" />
  </pre>
);

const Brief = () => (
  <div className="flex h-full flex-col justify-between font-mono text-[max(9px,4.6cqw)]" aria-hidden>
    <span className="text-meta">brief →</span>
    <span className="text-zinc-300">scaffold · build · screenshot</span>
    <span className="text-emerald-400">→ site</span>
  </div>
);

// Geometry (stack offsets, scatter targets, sizes) follows the original component's layout.
const CARDS: StackSpreadCard[] = [
  { item: { node: <Face name="overpower" kind="method"><Skill /></Face> }, stackOffset: { x: -8, y: -10 }, stackRotate: -18, target: { x: -20, y: -27, rotate: 0, scale: 0.8, w: 17, h: 22 }, targetSm: { x: -22, y: -34 }, z: 2 },
  { item: { node: <Face name="SEO agent" kind="loop" tone="deep"><Loop /></Face> }, stackOffset: { x: 14, y: -10 }, stackRotate: 20, target: { x: 32, y: -24, rotate: 0, scale: 0.9, w: 18, h: 32 }, targetSm: { x: 22, y: -34 }, z: 3 },
  { item: { node: <Face name="hydra" kind="orchestrator"><Lanes /></Face> }, stackOffset: { x: -16, y: 0 }, stackRotate: -4, target: { x: -36, y: -2, rotate: 0, scale: 0.9, w: 15, h: 32 }, targetSm: { x: -22, y: -16.5 }, z: 4 },
  { item: { node: <Face name="codegraph" kind="flagship" tone="accent"><GraphMark /></Face> }, stackOffset: { x: 1, y: -10 }, stackRotate: -2, target: { x: 6, y: -26, rotate: 0, scale: 0.85, w: 25, h: 30 }, targetSm: { x: 22, y: -16.5 }, z: 5 },
  { item: { node: <Face name="StoneWise" kind="app" tone="deep"><Gem /></Face> }, stackOffset: { x: 18, y: 1 }, stackRotate: 6, target: { x: 37, y: 5, rotate: 0, scale: 0.85, w: 18, h: 32 }, targetSm: { x: -22, y: 17 }, z: 6 },
  { item: { node: <Face name="ClosedLoop" kind="autonomy"><Pipeline /></Face> }, stackOffset: { x: -6, y: 10 }, stackRotate: 6, target: { x: -24, y: 29, rotate: 0, scale: 0.9, w: 22, h: 25 }, targetSm: { x: 22, y: 17 }, z: 7 },
  { item: { node: <Face name="voidstack" kind="shell" tone="deep"><Shell /></Face> }, stackOffset: { x: 8, y: 7 }, stackRotate: 3, target: { x: 2, y: 30, rotate: 0, scale: 0.85, w: 20, h: 26 }, targetSm: { x: -22, y: 34 }, z: 8 },
  { item: { node: <Face name="Prism" kind="agent" tone="accent"><Brief /></Face> }, stackOffset: { x: 20, y: 12 }, stackRotate: -7, target: { x: 30, y: 29, rotate: 0, scale: 0.9, w: 16, h: 20 }, targetSm: { x: 22, y: 34 }, z: 9 },
];

export default function WorkDeck() {
  return (
    <StackSpread
      id="deck"
      cards={CARDS}
      scrollLength={240}
      bgColor="#07080a"
      textColor="#fafafa"
      cardRadius={14}
      title={<>Eight systems.<br /><span className="text-primarylw-2">One obsession.</span></>}
      subtitle="Tools that make AI agents faster, more honest about what they know, and safe to ship."
    />
  );
}
