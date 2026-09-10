// @vitest-environment node
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

// The merge/validate/drift logic in scripts/build-tokens.mjs is the contract that
// keeps 89 colocated sidecars honest. These run the real script with TOKENS_CODE_DIR
// pointed at a throwaway fixture dir, so each machine-verifiable rule is proven to
// fire — the "contract rejects malformed" property, not just "reads happy input".
const SCRIPT = fileURLToPath(
  new URL("../scripts/build-tokens.mjs", import.meta.url),
);

const dirs: string[] = [];
afterEach(() => {
  for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true });
});

/** Write `files` into a fresh dir, run `build-tokens.mjs --check` against it, return the result. */
function run(files: Record<string, string>): {
  status: number;
  stderr: string;
} {
  const dir = mkdtempSync(join(tmpdir(), "tokfix-"));
  dirs.push(dir);
  for (const [name, content] of Object.entries(files))
    writeFileSync(join(dir, name), content);
  try {
    execFileSync("node", [SCRIPT], {
      env: { ...process.env, TOKENS_CODE_DIR: dir, TOKENS_VALIDATE_ONLY: "1" },
      encoding: "utf8",
      stdio: "pipe",
    });
    return { status: 0, stderr: "" };
  } catch (e) {
    const err = e as { status?: number; stderr?: string };
    return { status: err.status ?? 1, stderr: err.stderr ?? "" };
  }
}

const frag = (component: Record<string, string>) => ({
  component: Object.fromEntries(
    Object.entries(component).map(([k, v]) => [
      k,
      { $type: "color", $value: v },
    ]),
  ),
});

describe("token sidecar contract (build-tokens.mjs)", () => {
  it("accepts a valid namespaced sidecar", () => {
    expect(
      run({
        "widget.tokens.json": JSON.stringify(
          frag({ "widget-bg": "{semantic.background}" }),
        ),
      }).status,
    ).toBe(0);
  });

  it("rejects a duplicate token name", () => {
    // `primary` already exists in the central component tier.
    const r = run({
      "widget.tokens.json": JSON.stringify(
        frag({ primary: "{semantic.background}" }),
      ),
    });
    expect(r.status).not.toBe(0);
    expect(r.stderr).toMatch(/duplicate component token "primary"/);
  });

  it("rejects a reference to a primitive (tier violation)", () => {
    const r = run({
      "widget.tokens.json": JSON.stringify(
        frag({ "widget-bg": "{primitive.neutral.0}" }),
      ),
    });
    expect(r.status).not.toBe(0);
    expect(r.stderr).toMatch(
      /may reference only \{semantic\.\*\} or \{component\.\*\}/,
    );
  });

  it("rejects a non-component top-level key", () => {
    const r = run({
      "widget.tokens.json": JSON.stringify({
        semantic: { foo: { $type: "color", $value: "x" } },
      }),
    });
    expect(r.status).not.toBe(0);
    expect(r.stderr).toMatch(/may only add to "component"/);
  });

  it("flags drift when the .tsx uses a token the sidecar omits", () => {
    const r = run({
      "Widget.tokens.json": JSON.stringify(
        frag({ "widget-bg": "{semantic.background}" }),
      ),
      "Widget.tsx": `export const W = () => <div className="bg-background text-destructive" />;`,
    });
    expect(r.status).not.toBe(0);
    expect(r.stderr).toMatch(/drift:.*Widget\.tsx uses `destructive`/);
  });

  it("does NOT flag an opacity-modified usage (authoring judgement call)", () => {
    const r = run({
      "Widget.tokens.json": JSON.stringify(
        frag({ "widget-bg": "{semantic.background}" }),
      ),
      "Widget.tsx": `export const W = () => <div className="bg-background text-destructive/40" />;`,
    });
    expect(r.status).toBe(0);
  });
});
