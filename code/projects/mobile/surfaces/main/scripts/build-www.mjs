/**
 * Generate the shell's www/ (the bundled offline page) from shell.json + messages.
 *
 * @see docs/reference/projects/mobile/main/scripts/build-www.md
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { renderOfflinePage } from "./offline-page.mjs";

const read = (p) =>
  JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const shell = read("../shell.json");
const messages = {
  en: read("../messages/en.json").offline,
  fr: read("../messages/fr.json").offline,
};
const html = renderOfflinePage({ appName: shell.appName, messages });

// index.html exists because Capacitor requires webDir to hold one; with server.url
// set it is never shown — offline.html is the page users see (server.errorPath).
mkdirSync(new URL("../www/", import.meta.url), { recursive: true });
writeFileSync(new URL("../www/offline.html", import.meta.url), html);
writeFileSync(new URL("../www/index.html", import.meta.url), html);
console.log("✓ www/ generated (offline.html + index.html)");
