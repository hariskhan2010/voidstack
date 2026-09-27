#!/usr/bin/env node
// After `vite build` (client) and `vite build --ssr src/entry-server.tsx --outDir dist-ssr`,
// render the app to HTML and inject it into dist/index.html.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { render } = await import(pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href);

const file = path.join(root, "dist", "index.html");
const html = fs.readFileSync(file, "utf8");
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error(`dist/index.html has no ${marker}`);

const app = render();
fs.writeFileSync(file, html.replace(marker, `<div id="root">${app}</div>`));
fs.rmSync(path.join(root, "dist-ssr"), { recursive: true, force: true });
console.log(`prerendered ${(app.length / 1024).toFixed(1)} kB of HTML into dist/index.html`);
