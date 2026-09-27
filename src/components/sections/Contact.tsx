import { ArrowUpRight, Mail } from "lucide-react";
import { AnimatedCopyButton } from "@/components/lightswind/animated-copy-button";
import { PROFILE } from "@/data/profile";
import { openPalette } from "@/lib/bus";

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative scroll-mt-16 overflow-hidden border-t border-white/[0.06]">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-36">
        <h2 id="contact-title" className="max-w-[14ch] text-5xl font-semibold leading-[1.02] tracking-tighter text-zinc-50 md:text-7xl">
          Got a hard problem for agents?
        </h2>
        <p className="mt-6 max-w-[48ch] text-lg text-zinc-400">
          Tooling, orchestration, or a product that needs an AI engineer who ships. I reply within a day.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${PROFILE.email}`}
            className="inline-flex items-center gap-2 rounded-lg bg-primarylw-2 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 active:scale-[0.98]"
          >
            <Mail className="h-4 w-4" /> Email me
          </a>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] py-1.5 pl-4 pr-1.5 font-mono text-sm text-zinc-300">
            {PROFILE.email}
            <AnimatedCopyButton textToCopy={PROFILE.email} size="sm" />
          </div>
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-3 text-sm text-zinc-300 underline-offset-4 hover:text-primarylw-2 hover:underline"
          >
            GitHub <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
      <footer className="border-t border-white/[0.06]" aria-label="Footer">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 font-mono text-xs text-meta md:px-8">
          <span>© 2026 Haris · voidstack</span>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li><a href={PROFILE.github} target="_blank" rel="noreferrer" className="hover:text-zinc-300">GitHub</a></li>
            <li><a href={`mailto:${PROFILE.email}`} className="hover:text-zinc-300">{PROFILE.email}</a></li>
            <li><a href="https://github.com/hariskhan2010/voidstack" target="_blank" rel="noreferrer" className="hover:text-zinc-300">Source of this site</a></li>
            <li><button onClick={openPalette} className="hover:text-zinc-300">⌘K / Ctrl K</button></li>
          </ul>
        </div>
      </footer>
    </section>
  );
}
