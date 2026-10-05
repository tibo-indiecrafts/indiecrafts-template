/**
 * Builds the inline snippet that restores a returning visitor's consent before GA's first hit.
 *
 * @see docs/reference/packages/web/compliance/src/consent/consent-restore.md
 */
import { CONSENT_SIGNALS } from "@indiecrafts/packages-shared-compliance/shared";
import type { ConsentCategory } from "./consent-signals";

/**
 * JavaScript for the `gtag-init` inline script, run after `gtag('consent','default',…)`
 * and before `gtag('config',…)`. It reads the stored record and, when it is for the
 * current `version`, sends the matching `consent update` — so a returning visitor who
 * accepted is measured from the first hit, not treated as "denied" on every page.
 * A missing, unreadable or stale record sends nothing (the defaults stay denied and
 * the banner asks again). Values are JSON-encoded with `<` escaped, never spliced raw.
 */
export function consentRestoreScript(input: {
  storageKey: string;
  version: string;
  categories: readonly ConsentCategory[];
}): string {
  // JSON inside a <script>: escape "<" so a value can never close the tag.
  const js = (v: unknown) => JSON.stringify(v).replace(/</g, "\\u003c");
  const cats = input.categories.map((c) => ({
    k: c.key,
    r: c.required === true,
    s: c.signals,
  }));
  return `try{var r=JSON.parse(localStorage.getItem(${js(input.storageKey)})||"null");if(r&&r.v===${js(input.version)}&&r.choices){var g={};${js(cats)}.forEach(function(c){if(c.r||r.choices[c.k]===true)c.s.forEach(function(s){g[s]=1})});var u={};${js(CONSENT_SIGNALS)}.forEach(function(s){u[s]=g[s]?"granted":"denied"});gtag("consent","update",u)}}catch(e){}`;
}
