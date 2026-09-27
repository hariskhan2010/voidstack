export const PROFILE = {
  handle: "voidstack",
  name: "Haris",
  role: "Full-stack & AI engineer",
  email: "harismalik2010afridi@gmail.com",
  github: "https://github.com/hariskhan2010",
};

export type Project = {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  stack: string[];
  facts: string[];
  status: "public" | "private" | "new";
  href?: string;
};

export const CODEGRAPH = {
  name: "codegraph",
  tagline: "Turn a codebase into a graph your AI agent queries instead of grepping.",
  repo: "https://github.com/hariskhan2010/Codegraph-",
  pypi: "https://pypi.org/project/codegraph-tool/",
  install: "pipx install codegraph-tool",
  points: [
    ["20", "languages parsed with tree-sitter, receiver-aware call resolution"],
    ["~2k", "tokens per answer instead of reading twenty files"],
    ["150", "tests passing, served to agents over MCP"],
  ] as const,
  benchmark: { checked: 33, graphifyWrong: 18, codegraphWrong: 0 },
};

export const PROJECTS: Project[] = [
  {
    id: "closedloop",
    name: "ClosedLoop",
    tagline: "Bug report in, reviewed pull request out.",
    summary:
      "An autonomous fix-to-PR loop. It ingests an issue, indexes the repo into a tree-sitter symbol graph, lets an LLM planner diagnose and propose a fix, and runs it through guardrails with a real write lease before a worker opens the PR.",
    stack: ["TypeScript", "Turborepo", "Next.js", "tree-sitter", "LLM planner"],
    facts: ["ingest", "index", "plan", "guard", "PR"],
    status: "private",
  },
  {
    id: "hydra",
    name: "hydra",
    tagline: "Parallel coding agents across git worktrees.",
    summary:
      "A multi-agent orchestrator for coding-agent CLIs. It proves tasks touch disjoint files, runs them in parallel worktrees capped by free RAM and cores, then reviews and merges in dependency order.",
    stack: ["Python", "git worktrees", "MCP", "Claude / Qwen / Codex"],
    facts: ["v0.9.0", "8 roadmap phases", "no daemon"],
    status: "public",
    href: "https://github.com/hariskhan2010/hydra",
  },
  {
    id: "overpower",
    name: "overpower",
    tagline: "A build methodology for coding agents.",
    summary:
      "Skill files that make any agent work like a disciplined engineer: adaptive process weight, verified subagent runs, durable state and a change-impact gate. Built as an answer to the failure classes in obra/superpowers.",
    stack: ["Agent skills", "Claude Code plugin", "Python"],
    facts: ["any agent that reads skill files", "zero telemetry"],
    status: "public",
    href: "https://github.com/hariskhan2010/overpower",
  },
  {
    id: "stonewise",
    name: "StoneWise",
    tagline: "An AI gemology assistant.",
    summary:
      "A full-stack Next.js app where you chat with a Gemini-powered gemologist. Google sign-in, conversation history on Neon Postgres, AI-generated chat titles and a gem encyclopedia.",
    stack: ["Next.js", "Gemini", "Neon Postgres", "JWT auth"],
    facts: ["78 commits"],
    status: "private",
  },
  {
    id: "seo-agent",
    name: "SEO Intelligence Agent",
    tagline: "An SEO team, as one autonomous agent.",
    summary:
      "Research, strategy, content, audits, tracking and reporting, with self-critique, AI-search (GEO) optimization and a self-learning loop. 28 specialist skills, isolated per client.",
    stack: ["OpenCode", "Python", "28 skills"],
    facts: ["research → report"],
    status: "private",
  },
  {
    id: "prism",
    name: "Prism",
    tagline: "The OpenClaw agent that designed this site.",
    summary:
      "An OpenClaw agent that turns a brief into a working animated React site from Lightswind components, screenshots it in headless Chrome, reviews its own work and iterates.",
    stack: ["OpenClaw", "Lightswind UI", "Chrome DevTools Protocol"],
    facts: ["38 design skills", "6 MCP servers"],
    status: "public",
    href: "https://github.com/hariskhan2010/prism",
  },
];

export const STACK = [
  { slug: "python", label: "Python", used: "codegraph, hydra, SEO agent" },
  { slug: "typescript", label: "TypeScript", used: "ClosedLoop, StoneWise" },
  { slug: "react", label: "React", used: "StoneWise, this site" },
  { slug: "nextdotjs", label: "Next.js", used: "StoneWise, ClosedLoop dashboard" },
  { slug: "nodedotjs", label: "Node.js", used: "snip, op-viewer, ClosedLoop" },
  { slug: "tailwindcss", label: "Tailwind", used: "every frontend" },
  { slug: "sqlite", label: "SQLite", used: "codegraph's graph store" },
  { slug: "postgresql", label: "Postgres", used: "StoneWise on Neon" },
  { slug: "googlegemini", label: "Gemini", used: "StoneWise assistant" },
  { slug: "claude", label: "Claude", used: "hydra, overpower, agents" },
  { slug: "turborepo", label: "Turborepo", used: "ClosedLoop monorepo" },
  { slug: "flutter", label: "Flutter", used: "mobile apps" },
  { slug: "threedotjs", label: "Three.js", used: "this hero graph" },
  { slug: "git", label: "Git", used: "hydra's worktree engine" },
] as const;
