// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// Next skips a shared layout on a client navigation, so the `(dashboard)` layout alone does
// not guard a page's data. Every page must call `requireAdminPage` itself — this fails when a
// new page forgets.
const root = fileURLToPath(new URL(".", import.meta.url));
const pages = readdirSync(root, { recursive: true, encoding: "utf8" })
  .filter((f) => f.endsWith("page.tsx"))
  .map((f) => join(root, f));

describe("dashboard pages", () => {
  it("are found", () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  it.each(pages.map((p) => [relative(root, p), p]))(
    "%s calls requireAdminPage",
    (_name, file) => {
      expect(readFileSync(file, "utf8")).toMatch(/await requireAdminPage\(locale\)/);
    },
  );
});
