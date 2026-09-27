export const PROFILE = {
  handle: "voidstack",
  name: "Haris",
  role: "AI infrastructure & agent systems engineer",
  email: "harismalik2010afridi@gmail.com",
  github: "https://github.com/hariskhan2010",
  site: "https://voidstack-haris.vercel.app/",
};

export type Link = { label: string; href: string };

export type Project = {
  id: string;
  name: string;
  tier: "major" | "product" | "experiment";
  tagline: string;
  summary: string;
  stack: string[];
  status: "public" | "private" | "new" | "in progress";
  href?: string;
  /** case-study fields, major systems only; every line comes from the project's README or code */
  problem?: string;
  solution?: string;
  approach?: string[];
  evidence?: string[];
  links?: Link[];
};

export const CODEGRAPH = {
  name: "codegraph",
  tagline: "Give AI agents a map of your codebase.",
  repo: "https://github.com/hariskhan2010/Codegraph-",
  benchmarkDoc: "https://github.com/hariskhan2010/Codegraph-/blob/main/BENCHMARK.md",
  pypi: "https://pypi.org/project/codegraph-tool/",
  install: "pipx install codegraph-tool",
  problem:
    "A coding agent spends most of its context window locating things: grep, open five files, trace a call, repeat.",
  solution:
    "codegraph does that work once, offline. It builds a persistent SQLite graph of every symbol, call and import, updates it incrementally, and serves bounded, file:line-precise answers over MCP.",
  pipeline: [
    { step: "Repository", detail: "20 languages" },
    { step: "tree-sitter parse", detail: "symbols, calls, imports" },
    { step: "Symbol graph", detail: "SQLite, incremental" },
    { step: "Query engine", detail: "FTS5 + graph expansion" },
    { step: "Agent context", detail: "~2k-token subgraph" },
    { step: "MCP", detail: "Claude · Codex · Qwen" },
  ],
  evidence: [
    ["150", "tests passing (pytest)"],
    ["20", "languages in the AST tier"],
    ["0 / 33", "wrong EXTRACTED edges vs graphify's 18 / 33"],
  ] as const,
  benchmark: { checked: 33, graphifyWrong: 18, codegraphWrong: 0 },
};

export const PROJECTS: Project[] = [
  // ── Major systems ─────────────────────────────────────────────────────────
  {
    id: "closedloop",
    name: "ClosedLoop",
    tier: "major",
    tagline: "Bug report in, reviewed pull request out.",
    summary:
      "An autonomous fix-to-PR loop: ingest an issue, index the repo, plan a fix with an LLM, pass guardrails, open a PR for human review.",
    problem: "Most bug reports sit in a queue until someone has time to find the code, write the fix and open the PR.",
    solution:
      "A pipeline that takes a report from a browser capture extension or the API and carries it all the way to a pull request that a human reviews.",
    approach: [
      "repo-index clones the repo and builds a tree-sitter symbol graph for retrieval",
      "planner uses an LLM to diagnose the bug and propose a fix",
      "guardrails classify each action, dedupe, and take a real write lease before touching the repo",
      "execution + worker run the loop end to end and open the PR",
    ],
    evidence: ["4 apps (api, worker, dashboard, capture extension) + 7 packages", "ingestion rate limiting and secret-scanning CI"],
    stack: ["TypeScript", "Turborepo", "Next.js", "tree-sitter", "Postgres", "Redis"],
    status: "private",
  },
  {
    id: "hydra",
    name: "hydra",
    tier: "major",
    tagline: "Parallel coding agents across git worktrees.",
    summary:
      "A multi-agent orchestrator for coding-agent CLIs. It proves tasks touch disjoint files, runs them in parallel worktrees capped by free RAM and cores, then reviews and merges in dependency order.",
    problem: "Running several coding agents at once collides on the same files and silently drops failed work.",
    solution:
      "An agent-agnostic orchestrator that only parallelizes tasks with provably disjoint file sets and records every failure.",
    approach: [
      "hydra plan proves file independence and batches tasks before anything runs",
      "each task gets its own git worktree; a governor caps concurrency to free RAM and cores",
      "a review gate merges in dependency order; failures land in FAILURES.md and on stdout",
      "works with claude -p, qwen -p, codex or any OpenAI-compatible CLI; no daemon",
    ],
    evidence: ["84 tests passing (pytest)", "v0.9.0: all 8 roadmap phases implemented"],
    stack: ["Python", "git worktrees", "MCP"],
    status: "public",
    href: "https://github.com/hariskhan2010/hydra",
  },
  {
    id: "overpower",
    name: "overpower",
    tier: "major",
    tagline: "A build methodology for coding agents.",
    summary:
      "Skill files that make an agent work like a disciplined engineer: adaptive process weight, verified subagent runs, durable state and a change-impact gate.",
    problem:
      "Agent methodologies like obra/superpowers break across harnesses, run full ceremony on trivial tasks, and accept subagent results nobody verified.",
    solution: "One set of skill files with thin per-harness adapters, where every guarantee is either automated or checked in review.",
    approach: [
      "the agent sizes the task first: a typo is not a project",
      "a delegate's result counts only with an artifact: a run id, a result block, a new diff",
      "state lives in append-only .overpower/ files that survive compaction and interrupts",
      "before a fix, name the callers and dependencies it touches",
    ],
    evidence: ["13 skills, 14 eval cases", "Claude Code, Cursor, Codex, Gemini CLI, Copilot, Aider", "no telemetry"],
    stack: ["Agent skills", "Claude Code plugin", "Python"],
    status: "public",
    href: "https://github.com/hariskhan2010/overpower",
  },
  // ── Products & agents ─────────────────────────────────────────────────────
  {
    id: "stonewise",
    name: "StoneWise",
    tier: "product",
    tagline: "An AI gemology assistant.",
    summary:
      "A full-stack Next.js app where you chat with a Gemini-powered gemologist. Google sign-in, conversation history on Neon Postgres, AI-generated chat titles and a gem encyclopedia.",
    stack: ["Next.js", "Gemini", "Neon Postgres", "JWT auth"],
    status: "private",
  },
  {
    id: "prism",
    name: "Prism",
    tier: "product",
    tagline: "The OpenClaw agent that designed this site.",
    summary:
      "Turns a brief into a working React site from Lightswind components, screenshots it in headless Chrome, runs a QA pass and fixes what it finds.",
    stack: ["OpenClaw", "Lightswind UI", "Chrome DevTools Protocol"],
    status: "public",
    href: "https://github.com/hariskhan2010/prism",
  },
  {
    id: "seo-agent",
    name: "autonomous-seo-agent",
    tier: "product",
    tagline: "An SEO system where every change is traceable and reversible.",
    summary:
      "Runs the loop observe → crawl → research → plan → execute → verify → learn, with every action producing evidence. Architecture and scaffolding stage.",
    stack: ["Python", "FastAPI", "Postgres", "MCP"],
    status: "in progress",
  },
  // ── Experiments ───────────────────────────────────────────────────────────
  {
    id: "snip",
    name: "snip",
    tier: "experiment",
    tagline: "A local snippet manager: search, tag, copy.",
    summary: "Zero dependencies, Node stdlib only. Your snippets are one JSON file you can grep or commit.",
    stack: ["Node.js"],
    status: "private",
  },
  {
    id: "op-viewer",
    name: "op-viewer",
    tier: "experiment",
    tagline: "A live dashboard for overpower's build state.",
    summary: "Reads a repo's .overpower/ folder and renders it live. Node stdlib only, no build step.",
    stack: ["Node.js"],
    status: "private",
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
  { slug: "postgresql", label: "Postgres", used: "StoneWise, ClosedLoop, SEO agent" },
  { slug: "googlegemini", label: "Gemini", used: "StoneWise assistant" },
  { slug: "claude", label: "Claude", used: "hydra, overpower, agents" },
  { slug: "turborepo", label: "Turborepo", used: "ClosedLoop monorepo" },
  { slug: "fastapi", label: "FastAPI", used: "SEO agent API" },
  { slug: "threedotjs", label: "Three.js", used: "this hero graph" },
  { slug: "git", label: "Git", used: "hydra's worktree engine" },
] as const;
