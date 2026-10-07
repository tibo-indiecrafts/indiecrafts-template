/**
 * Generate the shell's www/ (the bundled offline page) from shell.json + messages +
 * CAP_SERVER_URL (the Retry target), and brand its service screens with the configured logo.
 *
 * @see docs/reference/projects/mobile/main/scripts/build-www.md
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { renderOfflinePage } from "./offline-page.mjs";
import {
  SPLASH_LOGO_SHARE,
  pngDataUri,
  fetchBrand,
  logoUrl,
  renderSplashes,
} from "./brand.mjs";
import { resolveServerUrl } from "../src/server-url.ts";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const read = (p) => JSON.parse(readFileSync(here(p), "utf8"));
const shell = read("../shell.json");
const messages = {
  en: read("../messages/en.json").offline,
  fr: read("../messages/fr.json").offline,
};

// The logo is configured in Sanity (`siteSettings`): the app's PUBLIC project + dataset,
// from the env or else the app surface's .env.local (only these two keys are read).
// No config / no network → the offline page has no logo and the splashes stay as they are.
const appEnv = existsSync(here("../../../../web/surfaces/app/.env.local"))
  ? readFileSync(here("../../../../web/surfaces/app/.env.local"), "utf8")
  : "";
const publicEnv = (key) =>
  process.env[key] ||
  appEnv.match(new RegExp(`^${key}=(.*)$`, "m"))?.[1]?.trim();
mkdirSync(here("../www/"), { recursive: true });
const brand = await fetchBrand({
  projectId: publicEnv("NEXT_PUBLIC_SANITY_PROJECT_ID"),
  dataset: publicEnv("NEXT_PUBLIC_SANITY_DATASET"),
});
let logo, logoDark;
if (brand) {
  // Inline (data: URIs), never a file next to the page — see pngDataUri.
  logo = await pngDataUri(logoUrl(brand.logo));
  if (brand.logoDark) logoDark = await pngDataUri(logoUrl(brand.logoDark));
  await brandSplashes(brand.logo);
} else {
  console.warn(
    "! no Sanity logo (NEXT_PUBLIC_SANITY_* unset or unreachable) — splashes unchanged",
  );
}

const html = renderOfflinePage({
  appName: shell.appName,
  messages,
  serverUrl: resolveServerUrl(process.env),
  logo,
  logoDark,
});

// index.html exists because Capacitor requires webDir to hold one; with server.url
// set it is never shown — offline.html is the page users see (server.errorPath).
writeFileSync(here("../www/offline.html"), html);
writeFileSync(here("../www/index.html"), html);
console.log(
  `✓ www/ generated (offline.html + index.html${logo ? " + logo" : ""})`,
);

/** Re-render the committed native splash images when the configured logo (or its size)
 *  changed. `brand.lock.json` (committed) records what they were made from. */
async function brandSplashes(asset) {
  const lockFile = here("../brand.lock.json");
  const lock = existsSync(lockFile)
    ? JSON.parse(readFileSync(lockFile, "utf8"))
    : {};
  if (lock.logo === asset && lock.logoShare === SPLASH_LOGO_SHARE) return;
  const res = here("../android/app/src/main/res/");
  const ios = here("../ios/App/App/Assets.xcassets/Splash.imageset/");
  const files = [
    ...readdirSync(res)
      .filter(
        (d) => d.startsWith("drawable") && existsSync(`${res}${d}/splash.png`),
      )
      .map((d) => `${res}${d}/splash.png`),
    ...readdirSync(ios)
      .filter((f) => f.endsWith(".png"))
      .map((f) => `${ios}${f}`),
  ];
  await renderSplashes(asset, files);
  writeFileSync(
    lockFile,
    `${JSON.stringify({ logo: asset, logoShare: SPLASH_LOGO_SHARE }, null, 2)}\n`,
  );
  console.log(
    `✓ ${files.length} splash images re-rendered from the Sanity logo`,
  );
}
