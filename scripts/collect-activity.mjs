#!/usr/bin/env node
// Builds src/data/activity.json from the real git history of the featured repos.
// Re-run whenever you want fresh numbers: `node scripts/collect-activity.mjs`
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const REPOS = {
  codegraph: "E:/codegraph",
  hydra: "E:/hydra",
  overpower: "E:/colibri-patner",
  closedloop: "E:/closedloop",
  stonewise: "E:/StoneWise",
  snip: "E:/snip",
  "op-viewer": "E:/op-viewer",
};
const AUTHOR = /hariskhan2010|^Haris$|^codegraph$/i; // codegraph's commits were made under the tool's name

const days = {};
const perRepo = {};
let total = 0;
for (const [name, dir] of Object.entries(REPOS)) {
  if (!fs.existsSync(path.join(dir, ".git"))) { console.warn(`skip ${name}: no git repo at ${dir}`); continue; }
  const log = execFileSync("git", ["-C", dir, "log", "--format=%an|%cs"], { encoding: "utf8" }).trim().split("\n");
  let n = 0;
  for (const line of log) {
    const [author, date] = line.split("|");
    if (!AUTHOR.test(author)) continue;
    days[date] = (days[date] || 0) + 1;
    n++;
  }
  perRepo[name] = n;
  total += n;
}

// Last 52 full weeks ending today, GitHub-style (columns = weeks, rows = Sun..Sat).
const today = new Date();
const start = new Date(today);
start.setDate(start.getDate() - 364 - start.getDay());
const weeks = [];
for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
  if (d.getDay() === 0) weeks.push([]);
  const key = d.toISOString().slice(0, 10);
  weeks[weeks.length - 1].push({ date: key, count: days[key] || 0 });
}
const activeDays = Object.keys(days).length;

const out = { generatedAt: today.toISOString().slice(0, 10), total, activeDays, repos: Object.keys(perRepo).length, perRepo, weeks };
const dest = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/data/activity.json");
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, JSON.stringify(out));
console.log(`${total} commits across ${out.repos} repos, ${activeDays} active days →`, dest);
console.log(perRepo);
