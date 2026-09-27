import { useEffect, useRef, useState } from "react";
import { Command, Menu, X } from "lucide-react";
import { openPalette } from "@/lib/bus";
import { PROFILE } from "@/data/profile";

const LINKS = [
  ["Work", "#work"],
  ["Projects", "#projects"],
  ["About", "#about"],
  ["Terminal", "#terminal"],
] as const;

export default function Nav() {
  // Detected after hydration so the prerendered HTML and the first client render match.
  const [isMac, setIsMac] = useState(false);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => setIsMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#07080a]/[0.92]">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <a href="#top" className="font-mono text-sm font-medium tracking-tight text-zinc-100">
          voidstack<span className="text-primarylw-2">_</span>
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} className="text-sm text-zinc-400 transition-colors hover:text-zinc-100">
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openPalette}
            className="group hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-400 transition hover:border-primarylw-2/40 hover:text-zinc-100 sm:flex"
            aria-label="Open command palette"
          >
            Search
            <kbd className="flex items-center gap-0.5 font-mono text-[11px] text-meta group-hover:text-primarylw-2">
              {isMac ? <Command className="h-3 w-3" aria-hidden /> : "Ctrl"} K
            </kbd>
          </button>
          <a
            href="#contact"
            className="hidden rounded-lg bg-primarylw-2 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 transition hover:bg-emerald-300 md:inline-flex"
          >
            Contact
          </a>
          <button
            ref={toggle}
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 place-items-center rounded-lg text-zinc-300 hover:text-white md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-white/[0.06] bg-[#07080a] px-5 pb-6 pt-2 md:hidden">
          <ul className="flex flex-col">
            {[...LINKS, ["Contact", "#contact"] as const].map(([label, href]) => (
              <li key={href}>
                <a href={href} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-white/[0.06] text-lg text-zinc-200">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <a href={PROFILE.github} target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 px-4 py-2.5 text-zinc-200">GitHub</a>
            <button onClick={() => { setOpen(false); openPalette(); }} className="rounded-lg border border-white/10 px-4 py-2.5 text-zinc-200">Search</button>
          </div>
        </div>
      )}
    </header>
  );
}
