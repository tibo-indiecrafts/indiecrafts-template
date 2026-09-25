/**
 * Measure the landing route's gzipped First-Load JS against a size budget.
 *
 * @see docs/reference/projects/web/website/scripts/check-bundle-size.md
 */
// Marketing bundle-size budget — the First-Load JS a real visitor downloads on the
// landing route, EXCLUDING the embedded Sanity Studio (whose client bundle dwarfs the
// marketing pages and would make an all-chunks budget meaningless). Runs after a
// PRODUCTION build (`next build`, via `build:cf`), reading `.next/app-build-manifest.json`.
//
// Report-first: by default it PRINTS the number and exits 0, so the first CI runs
// establish the real size. Flip to a hard gate with `--enforce` (or BUNDLE_ENFORCE=1)
// once BUDGET_KB is calibrated. Usage: `pnpm size` (report) · `pnpm size --enforce` (gate).

import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";

// Default budget for the landing route's First-Load JS (gzipped). Anchored to the
// recognized First-Load-JS budgets — Next's "green" threshold ~130 kB and web.dev's
// ~170 kB target — plus headroom for this stack's framework baseline (Next 16 + React 19
// + next-intl + shadcn), which sits above a bare app. 220 kB is a realistic ceiling that
// still catches genuine bloat (a heavy un-code-split dep). Ratchet toward ~170 kB as you
// optimize: each CI run prints the live number, so once you've confirmed a baseline set
// this to `measured + ~15%` and add `--enforce` to the CI step to make it a hard gate.
const BUDGET_KB = 220;

const NEXT = ".next";
const enforce = process.env.BUNDLE_ENFORCE === "1" || process.argv.includes("--enforce");

let manifest;
try {
  manifest = JSON.parse(
    readFileSync(path.join(NEXT, "app-build-manifest.json"), "utf8"),
  ).pages;
} catch {
  console.log(
    "[bundle-size] no production build manifest (.next/app-build-manifest.json) — run a production build first; skipping.",
  );
  process.exit(0); // never block on a missing/dev build
}

const gz = (f) => {
  try {
    return gzipSync(readFileSync(path.join(NEXT, f))).length;
  } catch {
    return 0;
  }
};

// Marketing = app routes, minus the Studio, API, and Next internals.
const marketing = Object.keys(manifest).filter(
  (r) => !/studio/i.test(r) && !/\/(api|_not-found)/.test(r),
);
if (!marketing.length) {
  console.log("[bundle-size] no marketing routes in manifest — skipping.");
  process.exit(0);
}

// The landing route's total First-Load JS = the most visitor-relevant single number.
const home =
  marketing.find((r) => /\(home\)|\[locale\]\/page$|\[locale\]$/.test(r)) ||
  marketing.sort((a, b) => a.length - b.length)[0];
const jsFiles = (manifest[home] || []).filter((f) => f.endsWith(".js"));
const bytes = jsFiles.reduce((a, f) => a + gz(f), 0);
const kb = Math.round(bytes / 1024);

console.log(
  `[bundle-size] landing first-load (${home}): ${kb} kB gz across ${jsFiles.length} chunks · budget ${BUDGET_KB} kB${enforce ? " (enforced)" : " (report-only)"}`,
);

if (kb > BUDGET_KB) {
  const msg = `[bundle-size] OVER budget by ${kb - BUDGET_KB} kB.`;
  if (enforce) {
    console.error(msg);
    process.exit(1);
  }
  console.log(`${msg} (report-only — add --enforce once calibrated.)`);
}
process.exit(0);
