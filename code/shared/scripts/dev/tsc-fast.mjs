// tsc:fast — typecheck via tsgo (@typescript/native-preview, the TS 7 Go port): ~10x faster
// and ~half the memory of tsc. For the LOCAL inner loop; CI + the commit hook keep the real
// `tsc` until TS 7 is fully feature-complete. tsgo lacks project references, but we don't use
// them, so `tsgo --noEmit` is a drop-in for our typecheck. Runs each app's tsconfig serially —
// tsgo is fast, and serial keeps peak memory flat (one graph at a time).
//
//   node code/shared/scripts/dev/tsc-fast.mjs
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { APPS } from "../lib/apps.mjs";

const ROOT = resolve(
  fileURLToPath(new URL(".", import.meta.url)),
  "../../../..",
);
// tsgo (TS 7 preview) doesn't auto-discover some ambient test/story globals yet, so the
// storybook (vitest/storybook globals) tsconfig reports false errors real `tsc` doesn't.
// Exclude it from the fast path — `pnpm tsc` (real) still covers it in CI, and
// `pnpm --filter <pkg> tsc` covers it on demand.
const TSGO_UNSUPPORTED = new Set(["code/projects/web/tools/storybook"]);
const dirs = [...new Set(APPS.map((a) => a.dir))]
  .filter((d) => !TSGO_UNSUPPORTED.has(d))
  .filter((d) => existsSync(resolve(ROOT, d, "tsconfig.json")));

let failed = 0;
const t0 = Date.now();
for (const dir of dirs) {
  process.stdout.write(`tsgo  ${dir}  … `);
  const r = spawnSync("pnpm", ["exec", "tsgo", "--noEmit"], {
    cwd: resolve(ROOT, dir),
    encoding: "utf8",
  });
  if (r.status === 0) {
    console.log("✓");
  } else {
    console.log("✗");
    process.stdout.write((r.stdout ?? "") + (r.stderr ?? "") + "\n");
    failed++;
  }
}
console.log(
  `\n${dirs.length - failed}/${dirs.length} typechecked in ${((Date.now() - t0) / 1000).toFixed(1)}s (tsgo)`,
);
process.exit(failed ? 1 : 0);
