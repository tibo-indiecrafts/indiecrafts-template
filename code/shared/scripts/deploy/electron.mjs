// Deploy the Electron desktop app (hybrid) via electron-builder. Same
// `deploy:<slug>:<env>` contract; native platform: it builds the installer for the
// HOST OS (electron-builder can't cross-build signed artifacts), reusing the app's
// own `dist:mac|win|linux` scripts. NOT wrangler, and only reached by
// `deploy-all --only all`.
//
//   node ../../../scripts/deploy-electron.mjs <dev|staging|prod> [--yes]
//
// Structure-first: dev/staging/prod all build the installer here. Signing +
// notarizing + publishing to a release provider (prod) are credential-gated
// follow-ups — see code/projects/hybrid/surfaces/main/README.md.

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

await confirmProd("hybrid", env, yes);
run("pnpm", ["run", script]); // electron-vite build + electron-builder for this OS
console.log(`✓ hybrid: built installer via ${script} (${env}).`);
