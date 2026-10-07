/**
 * Measure the landing route's gzipped First-Load JS against a size budget.
 *
 * @see docs/reference/projects/web/website/scripts/check-bundle-size.md
 */
// Marketing bundle-size budget — the First-Load JS a real visitor downloads on the
// landing route. Runs after a PRODUCTION build (`next build`, via `build:cf`).
//
// Next 16 (Turbopack) picks a page's scripts the way `getRequiredScripts` and
// `getLayerAssets` do at render time: the bootstrap files (`build-manifest.json`
// `rootMainFilesTree[page]`, else `rootMainFiles`) plus every layer's `entryJSFiles`
// in the route's client-reference manifest. The `nomodule` polyfills are left out: a
// modern browser never downloads them. The embedded Studio is its own route, so it
// never counts.
//
// `pnpm size` reports the number. `--enforce` (or BUNDLE_ENFORCE=1) fails over budget —
// and fails when a build exists but can't be read, so a manifest change can't silently
// switch the gate off (the old `app-build-manifest.json` is gone in Next 16). No build at
// all (CI's `turbo --affected` skipped the website) is a skip, not a failure.

import { existsSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";
import vm from "node:vm";
import { pathToFileURL } from "node:url";

// Measured 2026-10-07 at ~292 kB: React DOM (~65), next-intl, Radix, the consent banner,
// Turnstile. Clerk loads only for a signed-in visitor (`shouldLoadClerk`), so it is out.
// The ceiling is that + ~15%. Ratchet it down when a dependency leaves the first load.
export const BUDGET_KB = 335;

/** The landing route — the page a first-time visitor most often hits. */
export const LANDING_PAGE = "/[locale]/(home)/page";

/** The `.js` files (relative to `.next/`) a visitor downloads on first load of `page`. */
export function firstLoadFiles({ buildManifest, clientManifest, page }) {
  const root =
    buildManifest.rootMainFilesTree?.[page] ?? buildManifest.rootMainFiles ?? [];
  const entries = Object.values(clientManifest.entryJSFiles ?? {}).flat();
  return [...new Set([...root, ...entries])].filter((f) => f.endsWith(".js"));
}

/** `page`'s client-reference manifest: a script that assigns `globalThis.__RSC_MANIFEST[page]`. */
function readClientManifest(nextDir, page) {
  const file = path.join(
    nextDir,
    "server",
    "app",
    `${page}_client-reference-manifest.js`,
  );
  const sandbox = { globalThis: {} };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(readFileSync(file, "utf8"), sandbox);
  const manifest = sandbox.__RSC_MANIFEST?.[page];
  if (!manifest) throw new Error(`no client-reference manifest for ${page}`);
  return manifest;
}

function main() {
  const NEXT = ".next";
  const enforce =
    process.env.BUNDLE_ENFORCE === "1" || process.argv.includes("--enforce");

  if (!existsSync(path.join(NEXT, "build-manifest.json"))) {
    console.log("[bundle-size] no production build here — skipping.");
    process.exit(0);
  }

  let files;
  try {
    const buildManifest = JSON.parse(
      readFileSync(path.join(NEXT, "build-manifest.json"), "utf8"),
    );
    const clientManifest = readClientManifest(NEXT, LANDING_PAGE);
    files = firstLoadFiles({ buildManifest, clientManifest, page: LANDING_PAGE });
  } catch (error) {
    const msg = `[bundle-size] can't read the production build (${error.message}).`;
    if (enforce) {
      console.error(msg);
      process.exit(1);
    }
    console.log(`${msg} Skipping (report-only).`);
    process.exit(0);
  }

  const bytes = files.reduce(
    (sum, f) => sum + gzipSync(readFileSync(path.join(NEXT, f))).length,
    0,
  );
  const kb = Math.round(bytes / 1024);
  console.log(
    `[bundle-size] landing first-load (${LANDING_PAGE}): ${kb} kB gz across ${files.length} chunks · budget ${BUDGET_KB} kB${enforce ? " (enforced)" : " (report-only)"}`,
  );
  if (kb > BUDGET_KB) {
    const msg = `[bundle-size] OVER budget by ${kb - BUDGET_KB} kB.`;
    if (enforce) {
      console.error(msg);
      process.exit(1);
    }
    console.log(`${msg} (report-only — CI runs it with --enforce.)`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) main();
