#!/usr/bin/env node
/**
 * Verify every Storybook story renders without runtime errors and produces visible content.
 *
 * Usage: pnpm verify:stories [--filter=<title-substring>] [--limit=N]
 *
 * Reads `storybook-static/index.json`, spins up a tiny static file server,
 * walks each story id via Playwright, and reports:
 *   - console errors / page errors
 *   - blank renders (#storybook-root has no visible children, or zero painted area)
 *   - stories that take longer than the timeout to settle
 */

import { createReadStream, statSync, readFileSync, existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { createServer } from "node:http";
import { chromium } from "playwright";

const ROOT = resolve(process.cwd(), "storybook-static");
const INDEX = JSON.parse(readFileSync(join(ROOT, "index.json"), "utf8"));

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);

const FILTER = args.filter ?? null;
const LIMIT = args.limit ? Number(args.limit) : Infinity;
const HEADED = Boolean(args.headed);
const PORT = Number(args.port ?? 4444);

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".map": "application/json",
  ".txt": "text/plain",
};

function startServer() {
  return new Promise((resolveServer) => {
    const server = createServer((req, res) => {
      try {
        const url = new URL(req.url, `http://localhost:${PORT}`);
        let path = decodeURIComponent(url.pathname);
        if (path.endsWith("/")) path += "index.html";
        const file = join(ROOT, path);
        if (!file.startsWith(ROOT)) {
          res.statusCode = 403;
          return res.end("forbidden");
        }
        const stat = statSync(file);
        const type = MIME[extname(file).toLowerCase()] ?? "application/octet-stream";
        res.statusCode = 200;
        res.setHeader("Content-Type", type);
        res.setHeader("Content-Length", stat.size);
        createReadStream(file).pipe(res);
      } catch {
        res.statusCode = 404;
        res.end("not found");
      }
    });
    server.listen(PORT, () => resolveServer(server));
  });
}

async function verifyStory(page, story, baseUrl) {
  const errors = [];
  const consoleErrors = [];
  const onConsole = (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      // ignore known noise
      if (
        /Failed to load resource/.test(text) ||
        /favicon/.test(text) ||
        /Manifest/.test(text)
      )
        return;
      consoleErrors.push(text);
    }
  };
  const onPageError = (err) => errors.push(err.message);
  page.on("console", onConsole);
  page.on("pageerror", onPageError);

  const url = `${baseUrl}/iframe.html?viewMode=story&id=${story.id}`;
  let blank = false;
  let timedOut = false;
  let painted = 0;

  try {
    await page.goto(url, { waitUntil: "load", timeout: 20000 });
    // give the story a beat to mount + animate
    await page.waitForTimeout(800);
    const result = await page.evaluate(() => {
      const root =
        document.getElementById("storybook-root") ||
        document.getElementById("root");
      if (!root) return { painted: 0, html: "" };
      const rect = root.getBoundingClientRect();
      const painted = Math.max(0, rect.width) * Math.max(0, rect.height);
      const html = root.innerHTML.trim();
      return { painted, html: html.length };
    });
    painted = result.painted;
    blank = result.painted < 100 || result.html < 4;
  } catch (e) {
    timedOut = /Timeout|timeout/.test(e.message);
    errors.push(e.message);
  } finally {
    page.off("console", onConsole);
    page.off("pageerror", onPageError);
  }

  return {
    id: story.id,
    title: story.title,
    name: story.name,
    painted: Math.round(painted),
    blank,
    timedOut,
    errors: errors.concat(consoleErrors).slice(0, 5),
  };
}

async function main() {
  const stories = Object.values(INDEX.entries).filter((e) => e.type === "story");
  let work = stories;
  if (FILTER) work = work.filter((s) => s.title.includes(FILTER) || s.id.includes(FILTER));
  work = work.slice(0, LIMIT);

  console.log(`\nVerifying ${work.length} stories${FILTER ? ` (filter: ${FILTER})` : ""}\n`);

  if (!existsSync(join(ROOT, "iframe.html"))) {
    console.error("ERROR: storybook-static/iframe.html missing — run `pnpm build-storybook` first.");
    process.exit(1);
  }

  const server = await startServer();
  const baseUrl = `http://localhost:${PORT}`;
  const browser = await chromium.launch({ headless: !HEADED });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();

  const results = [];
  let i = 0;
  for (const story of work) {
    i++;
    const r = await verifyStory(page, story, baseUrl);
    results.push(r);
    const tag = r.errors.length
      ? "ERR"
      : r.timedOut
      ? "TMO"
      : r.blank
      ? "BLK"
      : "ok ";
    if (tag !== "ok ") {
      console.log(
        `[${tag}] ${i.toString().padStart(3)}/${work.length}  ${r.id}  ${r.errors[0] ?? "(blank render)"}`
      );
    }
  }

  await browser.close();
  server.close();

  const failures = results.filter((r) => r.errors.length || r.blank || r.timedOut);
  console.log(`\nSummary: ${results.length - failures.length}/${results.length} OK, ${failures.length} failing.`);

  const grouped = {
    errored: failures.filter((r) => r.errors.length && !r.timedOut),
    timedOut: failures.filter((r) => r.timedOut),
    blank: failures.filter((r) => !r.errors.length && r.blank),
  };

  for (const [k, list] of Object.entries(grouped)) {
    if (!list.length) continue;
    console.log(`\n== ${k.toUpperCase()} (${list.length}) ==`);
    for (const r of list) {
      console.log(`  - ${r.title} :: ${r.name} [${r.id}]`);
      for (const e of r.errors) console.log(`      • ${e.split("\n")[0].slice(0, 240)}`);
    }
  }

  // write JSON report
  const out = "storybook-verify-report.json";
  const fs = await import("node:fs");
  fs.writeFileSync(out, JSON.stringify({ summary: { total: results.length, failing: failures.length }, results }, null, 2));
  console.log(`\nFull report written to ${out}`);

  process.exit(failures.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
