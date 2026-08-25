// Deploy the Expo / React-Native app (mobile) via EAS. Same `deploy:<slug>:<env>`
// contract as the Cloudflare runners, but the platform is native: env maps to an
// EAS build profile, and shipping goes through Expo's build (+ submit) service —
// NOT wrangler, and NOT part of `deploy-all`'s default cloudflare set (only
// `deploy-all --only all` reaches it).
//
//   node ../../../scripts/deploy-expo.mjs <dev|staging|prod> [--yes]
//
// Structure-first: this wires the command + guards. Full EAS setup (eas.json
// profiles + store credentials) is a follow-up — see code/projects/mobile/surfaces/main/README.md.

import { spawnSync } from "node:child_process";
import { ENVS } from "../lib/apps.mjs";
import { run, confirmProd } from "../lib/deploy-shared.mjs";

const env = process.argv[2];
const yes = process.argv.includes("--yes");
if (!ENVS.includes(env)) {
  console.error("Usage: deploy-expo.mjs <dev|staging|prod> [--yes]");
  process.exit(1);
}

// env → EAS build profile.
const profile = { dev: "development", staging: "preview", prod: "production" }[
  env
];

// EAS is a global CLI (not a dep), like the app's own build:ios/build:android scripts.
if (spawnSync("eas", ["--version"], { stdio: "ignore" }).status !== 0) {
  console.error(
    "✗ eas-cli not found. Install + configure EAS first (npm i -g eas-cli; eas login; eas build:configure),\n" +
      "  then re-run. See code/projects/mobile/surfaces/main/README.md.",
  );
  process.exit(1);
}

await confirmProd("Deploy", "mobile", env, { yes });
run("eas", [
  "build",
  "--platform",
  "all",
  "--profile",
  profile,
  "--non-interactive",
]);
if (env === "prod") {
  run("eas", [
    "submit",
    "--platform",
    "all",
    "--profile",
    profile,
    "--non-interactive",
  ]);
}
console.log(
  `✓ mobile: EAS build (${profile})${env === "prod" ? " + submit" : ""}.`,
);
