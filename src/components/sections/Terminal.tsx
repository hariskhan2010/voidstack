import { useEffect, useRef, useState, type ReactNode } from "react";
import { CODEGRAPH, PROFILE, PROJECTS, STACK } from "@/data/profile";
import activity from "@/data/activity.json";
import { goTo } from "@/lib/bus";

type Line = { kind: "in" | "out"; body: ReactNode };

const G = ({ children }: { children: ReactNode }) => <span className="text-primarylw-2">{children}</span>;
const D = ({ children }: { children: ReactNode }) => <span className="text-meta">{children}</span>;

const COMMANDS = ["help", "whoami", "projects", "open", "stack", "stats", "contact", "email", "github", "ls", "clear", "sudo"] as const;
const HIDDEN = ["snip", "op-viewer", "sudo hire-me", "rm -rf /", "exit", "codegraph"];

function run(raw: string): ReactNode | "clear" {
  const input = raw.trim();
  const [cmd, ...args] = input.split(/\s+/);
  const arg = args.join(" ").toLowerCase();
  switch (cmd?.toLowerCase()) {
    case "":
      return null;
    case "help":
      return (
        <div className="grid grid-cols-[auto_1fr] gap-x-6">
          {[
            ["whoami", "who is behind voidstack"],
            ["projects", "list what I've built"],
            ["open <name>", "details for one project"],
            ["stack", "tools I ship with"],
            ["stats", "numbers from my git history"],
            ["contact", "how to reach me"],
            ["email / github", "copy email, open GitHub"],
            ["clear", "clear the screen"],
          ].map(([c, d]) => (
            <div key={c} className="contents"><G>{c}</G><D>{d}</D></div>
          ))}
          <div className="col-span-2 mt-2 text-meta">psst: there are a few commands not on this list. tab completes, ↑ recalls.</div>
        </div>
      );
    case "whoami":
      return (
        <div>
          <div><G>{PROFILE.name}</G> aka {PROFILE.handle}: {PROFILE.role}.</div>
          <div className="text-zinc-400">I build the infrastructure AI agents run on: code graphs, orchestrators, autonomous fix-to-PR loops.</div>
        </div>
      );
    case "ls":
    case "projects":
      return (
        <div className="grid grid-cols-[auto_auto_1fr] gap-x-4">
          <G>codegraph</G><D>public</D><span className="text-zinc-300">{CODEGRAPH.tagline}</span>
          {PROJECTS.map(p => (
            <div key={p.id} className="contents">
              <G>{p.id}</G><D>{p.status}</D><span className="text-zinc-300">{p.tagline}</span>
            </div>
          ))}
          <div className="col-span-3 mt-1 text-meta">try: open hydra</div>
        </div>
      );
    case "open": {
      if (arg === "codegraph" || arg === "") {
        if (arg === "") return <D>usage: open &lt;project&gt;, e.g. open closedloop</D>;
        goTo("work");
        return <div>{CODEGRAPH.tagline} <D>(scrolled you there)</D></div>;
      }
      const p = PROJECTS.find(x => x.id === arg || x.name.toLowerCase() === arg);
      if (!p) return <span className="text-rose-400">open: no project named '{arg}'. try 'projects'.</span>;
      return (
        <div className="space-y-1">
          <div><G>{p.name}</G> <D>· {p.status}</D></div>
          <div className="max-w-[70ch] text-zinc-300">{p.summary}</div>
          <div className="text-meta">stack: {p.stack.join(", ")}</div>
          {p.href && <a className="text-primarylw-2 underline underline-offset-4" href={p.href} target="_blank" rel="noreferrer">{p.href}</a>}
        </div>
      );
    }
    case "stack":
      return <div className="max-w-[70ch] text-zinc-300">{STACK.map(s => s.label).join(" · ")}</div>;
    case "stats":
      return (
        <div>
          <div><G>{activity.total}</G> commits across <G>{activity.repos}</G> repos, generated from git log on {activity.generatedAt}</div>
          {Object.entries(activity.perRepo).map(([k, v]) => (
            <div key={k} className="flex gap-3 text-zinc-400">
              <span className="w-24">{k}</span>
              <span className="text-primarylw-2">{"▇".repeat(Math.max(1, Math.round((v as number) / 4)))}</span>
              <span>{v as number}</span>
            </div>
          ))}
        </div>
      );
    case "contact":
      return <div>email <G>{PROFILE.email}</G> · github <G>{PROFILE.github.replace("https://", "")}</G></div>;
    case "email":
      navigator.clipboard?.writeText(PROFILE.email);
      return <div><G>✓</G> copied {PROFILE.email} to clipboard</div>;
    case "github":
      window.open(PROFILE.github, "_blank", "noopener");
      return <div>opening {PROFILE.github}…</div>;
    case "codegraph":
      return <div>{CODEGRAPH.install} <D># then: codegraph extract .</D></div>;
    case "snip":
      return <div><G>snip</G>: a zero-dependency local snippet manager. search, tag, copy. your snippets are one JSON file. <D>(side project)</D></div>;
    case "op-viewer":
      return <div><G>op-viewer</G>: a live dashboard for a repo's .overpower/ build state. node stdlib only. <D>(side project)</D></div>;
    case "sudo":
      if (arg === "hire-me" || arg === "hire me")
        return (
          <pre className="leading-tight text-primarylw-2">{String.raw`
 __   _____ ___ ___  ___ _____ _   ___ _  __
 \ \ / / _ \_ _|   \/ __|_   _/_\ / __| |/ /
  \ V / (_) | || |) \__ \ | |/ _ \ (__| ' <
   \_/ \___/___|___/|___/ |_/_/ \_\___|_|\_\
`}<span className="text-zinc-300">permission granted. {PROFILE.email} is waiting for your message.</span></pre>
        );
      return <span className="text-rose-400">{PROFILE.handle} is not in the sudoers file. This incident will be reported. (try: sudo hire-me)</span>;
    case "rm":
      return <span className="text-rose-400">nice try.</span>;
    case "exit":
      return <D>there is no exit. only more void.</D>;
    case "clear":
      return "clear";
    default:
      return <span className="text-rose-400">command not found: {cmd}. type 'help'.</span>;
  }
}

const BOOT: Line[] = [
  { kind: "out", body: <D>voidstack shell 1.0 · type <G>help</G> to begin</D> },
];

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>(BOOT);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const screen = useRef<HTMLDivElement>(null);

  const exec = (cmd: string) => {
    const result = run(cmd);
    if (result === "clear") return setLines([]);
    setLines(l => [...l, { kind: "in", body: cmd }, ...(result ? [{ kind: "out" as const, body: result }] : [])]);
    if (cmd.trim()) setHistory(h => [cmd, ...h].slice(0, 50));
    setCursor(-1);
  };

  useEffect(() => {
    const onRun = (e: Event) => {
      exec((e as CustomEvent<string>).detail);
      setTimeout(() => input.current?.focus({ preventScroll: true }), 400);
    };
    window.addEventListener("vs:terminal", onRun);
    return () => window.removeEventListener("vs:terminal", onRun);
  });

  useEffect(() => {
    screen.current?.scrollTo({ top: screen.current.scrollHeight });
  }, [lines]);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { exec(value); setValue(""); }
    else if (e.key === "ArrowUp") { e.preventDefault(); const c = Math.min(cursor + 1, history.length - 1); if (history[c]) { setCursor(c); setValue(history[c]); } }
    else if (e.key === "ArrowDown") { e.preventDefault(); const c = cursor - 1; setCursor(Math.max(c, -1)); setValue(c >= 0 ? history[c] : ""); }
    else if (e.key === "Tab") {
      e.preventDefault();
      const pool = value.startsWith("open ") ? PROJECTS.map(p => `open ${p.id}`).concat("open codegraph") : [...COMMANDS, ...HIDDEN];
      const hit = pool.find(c => c.startsWith(value) && c !== value);
      if (hit) setValue(hit);
    }
    else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); setLines([]); }
  };

  return (
    <section id="terminal" aria-labelledby="terminal-title" className="scroll-mt-20 mx-auto max-w-5xl px-5 py-24 md:px-8 md:py-32">
      <h2 id="terminal-title" className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">Or skip the scrolling.</h2>
      <p className="mt-3 max-w-[52ch] text-zinc-400">Everything on this page, as a shell. Start with <code className="font-mono text-primarylw-2">help</code>.</p>

      <div className="mt-10 overflow-hidden rounded-xl border border-white/10 bg-[#050607] shadow-[0_30px_120px_-40px_rgba(16,185,129,.35)]" onClick={() => input.current?.focus()}>
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-zinc-700" />
          <span className="h-3 w-3 rounded-full bg-zinc-700" />
          <span className="h-3 w-3 rounded-full bg-zinc-700" />
          <span className="ml-3 font-mono text-xs text-meta">haris@voidstack: ~</span>
        </div>
        <div ref={screen} className="h-[380px] overflow-y-auto p-5 font-mono text-[13px] leading-6 text-zinc-200 md:h-[420px]" role="log" aria-live="polite">
          {lines.map((l, i) => (
            <div key={i} className={l.kind === "in" ? "mt-2" : ""}>
              {l.kind === "in" ? <><G>❯</G> {l.body}</> : l.body}
            </div>
          ))}
          <label className="mt-2 flex items-center gap-2">
            <G>❯</G>
            <span className="sr-only">Terminal command</span>
            <input
              ref={input}
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={onKey}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              className="flex-1 bg-transparent text-zinc-100 caret-primarylw-2 outline-none"
              placeholder="type a command…"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
