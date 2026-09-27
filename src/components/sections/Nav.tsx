import { useEffect, useState } from "react";
import { Command } from "lucide-react";
import { openPalette } from "@/lib/bus";

const LINKS = [
  ["Work", "#work"],
  ["About", "#about"],
  ["Stack", "#stack"],
  ["Terminal", "#terminal"],
  ["Contact", "#contact"],
] as const;

export default function Nav() {
  // Detected after hydration so the prerendered HTML and the first client render match.
  const [isMac, setIsMac] = useState(false);
  useEffect(() => setIsMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#07080a]/[0.92]">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <a href="#top" className="font-mono text-sm font-medium tracking-tight text-zinc-100">
          voidstack<span className="animate-pulse text-primarylw-2">_</span>
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} className="text-sm text-zinc-400 transition-colors hover:text-zinc-100">
              {label}
            </a>
          ))}
        </div>
        <button
          onClick={openPalette}
          className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-400 transition hover:border-primarylw-2/40 hover:text-zinc-100 active:scale-[0.98]"
          aria-label="Open command palette"
        >
          <span className="hidden sm:inline">Search</span>
          <kbd className="flex items-center gap-0.5 font-mono text-[11px] text-zinc-500 group-hover:text-primarylw-2">
            {isMac ? <Command className="h-3 w-3" /> : "Ctrl"} K
          </kbd>
        </button>
      </nav>
    </header>
  );
}
