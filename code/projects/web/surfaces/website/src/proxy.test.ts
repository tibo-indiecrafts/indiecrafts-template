import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// The catch-all matcher skips any path with a dot, so a locale-aware route handler
// like `/blog/atom.xml` 404s on the default locale unless it is listed by name.
// Reads the source: importing `proxy.ts` pulls next-intl's middleware, which vitest can't resolve.
// The happy-dom env gives `import.meta.url` an http scheme, so resolve from `__dirname`.
const proxySource = readFileSync(join(__dirname, "proxy.ts"), "utf8");
const localeDir = join(__dirname, "app/[locale]");
const dottedRoutes = readdirSync(localeDir, { recursive: true, encoding: "utf8" })
  .filter((f) => f.endsWith("route.ts"))
  .map((f) => `/${f.replace(/\/?route\.ts$/, "")}`)
  .filter((p) => p.includes("."));

describe("proxy matcher", () => {
  it.each(dottedRoutes)("lists the dotted locale route %s", (route) => {
    expect(proxySource).toContain(`"${route}"`);
  });
});
