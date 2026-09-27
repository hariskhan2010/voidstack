import { useEffect, useMemo, useState, type ReactNode } from "react";
import { siGithub } from "simple-icons";
import { ArrowUpRight, AtSign, Boxes, FolderGit2, Hash, LayoutGrid, Mail, Orbit, TerminalSquare } from "lucide-react";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut,
} from "@/components/lightswind/command";
import { CODEGRAPH, PROFILE, PROJECTS } from "@/data/profile";
import { goTo, runInTerminal } from "@/lib/bus";

type Entry = { id: string; label: string; hint?: ReactNode; icon: ReactNode; keywords: string[]; run: () => void; external?: boolean };

const ic = "h-4 w-4 text-zinc-500";
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-zinc-500" aria-hidden><path d={siGithub.path} /></svg>
);

// Lightswind's Command only matches plain-string children and always renders Empty/group headings,
// so the palette does its own filtering and renders only the groups that have matches.
const GROUPS: { heading: string; items: Entry[] }[] = [
  {
    heading: "Go to",
    items: [
      { id: "top", label: "Top", icon: <Hash className={ic} />, keywords: ["home", "hero"], run: () => goTo("top") },
      { id: "work", label: "Work", icon: <LayoutGrid className={ic} />, keywords: ["codegraph", "projects"], run: () => goTo("work") },
      { id: "about", label: "About", icon: <Hash className={ic} />, keywords: ["philosophy", "principles", "haris"], run: () => goTo("about") },
      { id: "stack", label: "Stack", icon: <Orbit className={ic} />, keywords: ["skills", "tech", "orbit"], run: () => goTo("stack") },
      { id: "terminal", label: "Terminal", icon: <TerminalSquare className={ic} />, keywords: ["shell", "cli"], run: () => goTo("terminal") },
      { id: "contact", label: "Contact", icon: <AtSign className={ic} />, keywords: ["hire", "email"], run: () => goTo("contact") },
    ],
  },
  {
    heading: "Actions",
    items: [
      { id: "copy-email", label: "Copy email", hint: <CommandShortcut>{PROFILE.email}</CommandShortcut>, icon: <Mail className={ic} />, keywords: ["mail", "contact"], run: () => navigator.clipboard?.writeText(PROFILE.email) },
      { id: "github", label: "Open GitHub", icon: <GithubIcon />, keywords: ["code", "repos"], run: () => window.open(PROFILE.github, "_blank", "noopener"), external: true },
      { id: "codegraph-repo", label: "codegraph on GitHub", icon: <FolderGit2 className={ic} />, keywords: ["repo", "source"], run: () => window.open(CODEGRAPH.repo, "_blank", "noopener"), external: true },
      { id: "whoami", label: "Run whoami in the terminal", icon: <TerminalSquare className={ic} />, keywords: ["about", "shell"], run: () => runInTerminal("whoami") },
    ],
  },
  {
    heading: "Projects",
    items: PROJECTS.map(p => ({
      id: p.id, label: p.name, hint: <span className="ml-2 truncate text-xs text-zinc-500">{p.tagline}</span>,
      icon: <Boxes className={ic} />, keywords: [p.id, ...p.stack], run: () => runInTerminal(`open ${p.id}`),
    })),
  },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(o => !o); }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("vs:palette", onOpen);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("vs:palette", onOpen); };
  }, []);

  useEffect(() => { if (!open) setQuery(""); }, [open]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GROUPS.map(g => ({
      ...g,
      items: q ? g.items.filter(i => [i.label, ...i.keywords].join(" ").toLowerCase().includes(q)) : g.items,
    })).filter(g => g.items.length);
  }, [query]);

  const act = (fn: () => void) => () => { setOpen(false); setTimeout(fn, 120); };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} className="border-white/10 bg-[#0c0d10]">
      <CommandInput value={query} onValueChange={setQuery} placeholder="Jump to a section, open a project, run a command…" />
      <CommandList>
        {groups.length === 0 && <CommandEmpty>Nothing matches. Try "terminal" or a project name.</CommandEmpty>}
        {groups.map((g, gi) => (
          <div key={g.heading}>
            {gi > 0 && <CommandSeparator />}
            <CommandGroup heading={g.heading}>
              {g.items.map(i => (
                <CommandItem key={i.id} onSelect={act(i.run)}>
                  <span className="mr-1">{i.icon}</span>
                  {i.label}
                  {i.hint}
                  {i.external && <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-zinc-600" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
