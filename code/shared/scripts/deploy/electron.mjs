// Deploy the Electron desktop app (hybrid) via electron-builder. Same
// `deploy:<slug>:<env>` contract; native platform: it builds the installer for the
// HOST OS (electron-builder can't cross-build signed artifacts), reusing the app's
// own `dist:mac|win|linux` scripts. NOT wrangler, and only reached by
// `deploy-all --only all`.
//
//   node ../../../scripts/deploy-electron.mjs <dev|staging|prod> [--yes]
//
// Signing + notarization are wired in electron-builder.yml (they read Apple/cert creds
// from the ENV — a local build with none is UNSIGNED, dev-only). This runner BUILDS the
// installer for the host OS; publishing to the Cloudflare R2 feed
// (`downloads.<root>/hybrid`) is a CI step (generic-provider feeds are upload-by-CI, not
// by electron-builder) — see .github/workflows/deploy-native.yml + the app README.

import { ENVS } from "../lib/apps.mjs";
import { run, confirmProd } from "../lib/deploy-shared.mjs";

const env = process.argv[2];
const yes = process.argv.includes("--yes");
if (!ENVS.includes(env)) {
  console.error("Usage: deploy-electron.mjs <dev|staging|prod> [--yes]");
  process.exit(1);
}

// electron-builder builds for the host OS (signed cross-builds aren't portable).
const script =
  { darwin: "dist:mac", win32: "dist:win", linux: "dist:linux" }[
    process.platform
  ] ?? "dist:linux";

await confirmProd("Deploy", "hybrid", env, { yes });
run("pnpm", ["run", script]); // electron-vite build + electron-builder for this OS
console.log(`✓ hybrid: built installer via ${script} (${env}).`);
