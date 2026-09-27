import { useEffect, useRef, useState } from "react";
// Named imports only: `import * as` pulls all ~3,000 brand icons (≈6 MB) into the bundle.
import {
  siClaude, siFastapi, siGit, siGooglegemini, siNextdotjs, siNodedotjs, siPostgresql, siPython,
  siReact, siSqlite, siTailwindcss, siThreedotjs, siTurborepo, siTypescript,
} from "simple-icons";
const icons = {
  siClaude, siFastapi, siGit, siGooglegemini, siNextdotjs, siNodedotjs, siPostgresql, siPython,
  siReact, siSqlite, siTailwindcss, siThreedotjs, siTurborepo, siTypescript,
};
import { STACK } from "@/data/profile";

type Item = (typeof STACK)[number];
const iconOf = (slug: string) => (icons as unknown as Record<string, { path: string }>)[`si${slug[0].toUpperCase()}${slug.slice(1)}`];

// Three tilted rings. Rings spin; each chip counter-spins and un-tilts so it always faces the viewer.
const RINGS = [
  { items: STACK.slice(0, 4), radius: 0.42, duration: 38 },
  { items: STACK.slice(4, 9), radius: 0.7, duration: 58 },
  { items: STACK.slice(9), radius: 0.98, duration: 80 },
];

function Chip({ item, onActive, active }: { item: Item; onActive: (i: Item | null) => void; active: boolean }) {
  const icon = iconOf(item.slug);
  return (
    <button
      onMouseEnter={() => onActive(item)}
      onMouseLeave={() => onActive(null)}
      onFocus={() => onActive(item)}
      onBlur={() => onActive(null)}
      aria-label={`${item.label}: ${item.used}`}
      className={`grid h-11 w-11 place-items-center rounded-xl border transition md:h-14 md:w-14 ${
        active ? "scale-110 border-primarylw-2/70 bg-primarylw-2/15 text-primarylw-2" : "border-white/10 bg-[#0c0d10] text-zinc-300 hover:text-primarylw-2"
      }`}
    >
      {icon && (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current md:h-6 md:w-6" aria-hidden>
          <path d={icon.path} />
        </svg>
      )}
    </button>
  );
}

export default function StackOrbit() {
  const [active, setActive] = useState<Item | null>(null);
  const [onScreen, setOnScreen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  // 3D-transformed layers are expensive to keep animating; only spin while the section is visible.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "100px" });
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={sectionRef} data-paused={onScreen ? undefined : ""} id="stack" aria-labelledby="stack-title" className="scroll-mt-16 overflow-hidden border-y border-white/[0.06] bg-white/[0.015] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 text-center md:px-8">
        <h2 id="stack-title" className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">The stack, in orbit.</h2>
        <p className="mx-auto mt-4 max-w-[52ch] text-zinc-400">Hover a planet to see where I've actually shipped it.</p>
      </div>

      {/* The rings are tilted 64°, so they only need ~55% of their width in height. */}
      <div className="relative mx-auto mt-10 h-[calc(min(92vw,640px)*0.62)] w-[min(92vw,640px)]">
      <div className="orbit absolute left-0 top-1/2 aspect-square w-full -translate-y-1/2 [perspective:1400px]" onMouseLeave={() => setActive(null)}>
        <div className="absolute inset-0 [transform-style:preserve-3d] [transform:rotateX(64deg)]">
          {RINGS.map((ring, r) => (
            <div
              key={r}
              className="orbit-spin absolute left-1/2 top-1/2 rounded-full border border-white/[0.08] [transform-style:preserve-3d]"
              style={{
                width: `${ring.radius * 100}%`, height: `${ring.radius * 100}%`,
                marginLeft: `${-ring.radius * 50}%`, marginTop: `${-ring.radius * 50}%`,
                animation: `spin ${ring.duration}s linear infinite${r % 2 ? " reverse" : ""}`,
              }}
            >
              {ring.items.map((item, i) => {
                // Position on the ring in % of the ring's own box, so it scales with the viewport.
                const a = ((2 * Math.PI) / ring.items.length) * i + r;
                return (
                  <div
                    key={item.slug}
                    className="absolute h-0 w-0 [transform-style:preserve-3d]"
                    style={{ left: `${50 + 50 * Math.cos(a)}%`, top: `${50 + 50 * Math.sin(a)}%` }}
                  >
                    <div className="orbit-spin [transform-style:preserve-3d]" style={{ animation: `spin ${ring.duration}s linear infinite${r % 2 ? "" : " reverse"}` }}>
                      <div className="[transform:rotateX(-64deg)_translate(-50%,-50%)] [transform-origin:0_0]">
                        <Chip item={item} onActive={setActive} active={active?.slug === item.slug} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* core */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#6ee7b7,#059669_45%,#022c22_80%)] shadow-[0_0_80px_20px_rgba(16,185,129,.25)] md:h-28 md:w-28">
          <span className="font-mono text-[11px] font-semibold text-emerald-950">voidstack</span>
        </div>
      </div>
      </div>

      <div className="mx-auto mt-4 h-16 max-w-md px-5 text-center" aria-live="polite">
        {active ? (
          <>
            <p className="font-mono text-lg text-primarylw-2">{active.label}</p>
            <p className="text-sm text-zinc-400">{active.used}</p>
          </>
        ) : (
          <p className="font-mono text-xs text-meta">{STACK.length} tools · 3 orbits</p>
        )}
      </div>
    </section>
  );
}
