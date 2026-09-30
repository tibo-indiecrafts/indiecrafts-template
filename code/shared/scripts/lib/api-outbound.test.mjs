import assert from "node:assert/strict";
import { test } from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// The api brief's contract: every outbound call has a timeout shorter than the caller's.
// Guard: no bare `fetch(` in the api's source (use fetchWithTimeout from src/http.ts), and
// every Clerk SDK call (verifyToken / users.*) sits inside withTimeout(…).
const SRC = fileURLToPath(new URL("../../api/src", import.meta.url));
const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? files(join(dir, e.name))
      : e.name.endsWith(".ts") && !e.name.endsWith(".test.ts")
        ? [join(dir, e.name)]
        : [],
  );

test("the api makes no outbound fetch without a timeout", () => {
  const bad = [];
  for (const f of files(SRC)) {
    if (f.endsWith("/http.ts")) continue;
    readFileSync(f, "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (/^\s*(\/\/|\*)/.test(line)) return;
        // A bare fetch( — not a method (x.fetch, CRON.fetch) and not the handler's own `fetch(` signature.
        if (/(?<![\w.])fetch\(/.test(line) && !/async fetch\(/.test(line))
          bad.push(`${relative(SRC, f)}:${i + 1}: ${line.trim()}`);
      });
  }
  assert.deepEqual(bad, []);
});

test("every Clerk SDK call is wrapped in withTimeout", () => {
  const bad = [];
  for (const f of files(SRC)) {
    const text = readFileSync(f, "utf8");
    for (const m of text.matchAll(
      /(verifyToken\(|\.users\.(getUser|getUserList|deleteUser)\()/g,
    )) {
      const before = text.slice(Math.max(0, m.index - 160), m.index);
      if (!/withTimeout\(\s*[\s\S]*$/.test(before.split(";").pop() ?? ""))
        bad.push(`${relative(SRC, f)}: ${m[0]}`);
    }
  }
  assert.deepEqual(bad, []);
});
