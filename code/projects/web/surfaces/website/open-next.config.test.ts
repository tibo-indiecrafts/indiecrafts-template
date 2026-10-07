import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import config from "./open-next.config";

// The tag cache has two halves that must agree: `open-next.config.ts` picks the Durable
// Object tag cache, and `wrangler.toml` binds it in every environment. A missing half fails
// silently (OpenNext's default tag cache is a no-op), so a published edit never shows.
const toml = readFileSync(join(__dirname, "wrangler.toml"), "utf8");

/** The text of `[env.<name>]` up to the next env, or the top-level part for "base". */
function section(name: string): string {
  const parts = toml.split(/^(?=\[env\.[a-z]+\]$)/m);
  return (
    (name === "base" ? parts[0] : parts.find((p) => p.startsWith(`[env.${name}]`))) ?? ""
  );
}

describe("OpenNext tag cache", () => {
  it("uses a real tag cache, not the no-op default", () => {
    expect(typeof config.default.override?.tagCache).toBe("function");
  });

  it.each(["base", "dev", "staging", "prod"])("binds the Durable Object in %s", (env) => {
    const prefix = env === "base" ? "" : `env\\.${env}\\.`;
    expect(section(env)).toMatch(
      new RegExp(
        `^\\[\\[${prefix}durable_objects\\.bindings\\]\\]\\nname = "NEXT_TAG_CACHE_DO_SHARDED"\\nclass_name = "DOShardedTagCache"$`,
        "m",
      ),
    );
  });

  it("declares the class once, in the top-level migrations", () => {
    expect(section("base")).toMatch(/new_sqlite_classes = \["DOShardedTagCache"\]/);
  });
});
