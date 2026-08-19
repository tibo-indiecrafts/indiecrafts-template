// @vitest-environment node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// The design tokens are CSS custom properties in globals.css (OKLCH is the
// authoritative color source — see DESIGN.md). No component renders them, so the
// contract worth guarding is structural: the light base, the system-dark
// (`@media prefers-color-scheme: dark`) block, and the explicit-toggle
// (`[data-theme="dark"]`) block must stay in agreement, or a theme silently drifts.
// Tokens are GENERATED from shared/tokens.json (DTCG) into generated/tokens.css by
// scripts/build-tokens.mjs. This guards the generated output's light/dark parity; the
// `tokens:check` script guards that the generated file is in sync with the JSON source.
const css = readFileSync(
  fileURLToPath(new URL("./generated/tokens.css", import.meta.url)),
  "utf8",
);

/** Custom-property names declared inside the first CSS block matching `selector`. */
function tokensIn(selector: RegExp): Set<string> {
  const start = css.search(selector);
  if (start === -1) throw new Error(`token block not found: ${selector}`);
  const open = css.indexOf("{", start);
  const close = css.indexOf("\n}", open); // block closes at a column-0 brace
  const body = css.slice(open + 1, close);
  return new Set([...body.matchAll(/--([a-z0-9-]+)\s*:/gi)].map((m) => m[1]));
}

const light = tokensIn(/\n:root\s*\{/); // bare :root — the light base
const systemDark = tokensIn(/:root:not\(\[data-theme="light"\]\)\s*\{/);
const toggleDark = tokensIn(/:root\[data-theme="dark"\]/);

describe("design tokens (globals.css)", () => {
  it("declares the core semantic tokens in the light base", () => {
    for (const token of ["background", "foreground", "brand", "primary"]) {
      expect(light.has(token)).toBe(true);
    }
  });

  it("the system-dark and toggle-dark blocks override the same tokens", () => {
    // A token overridden in one dark mechanism but not the other makes the manual
    // theme toggle diverge from the OS preference.
    expect([...systemDark].sort()).toEqual([...toggleDark].sort());
  });

  it("every dark override has a light base (no orphan token)", () => {
    const orphans = [...toggleDark].filter((token) => !light.has(token));
    expect(orphans).toEqual([]);
  });
});
