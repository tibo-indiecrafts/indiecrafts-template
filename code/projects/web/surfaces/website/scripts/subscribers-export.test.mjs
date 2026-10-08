import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { exportQuery, toCsv } from "./subscribers-export.mjs";

// The real GROQ evaluator (groq-js, a website dependency) runs the export filter on fixtures.
const require = createRequire(new URL("../package.json", import.meta.url));
const { parse, evaluate } = require("groq-js");
const docs = [
  {
    _type: "subscriber",
    email: "ok@x.com",
    status: "confirmed",
    newsletter: true,
    createdAt: "3",
  },
  {
    _type: "subscriber",
    email: "legacy@x.com",
    status: "confirmed",
    source: "/blog",
    createdAt: "2",
  },
  {
    _type: "subscriber",
    email: "magnet@x.com",
    status: "confirmed",
    newsletter: false,
    source: "lead-magnet",
    createdAt: "1",
  },
  {
    _type: "subscriber",
    email: "oldmagnet@x.com",
    status: "confirmed",
    source: "lead-magnet",
    createdAt: "1",
  },
  {
    _type: "subscriber",
    email: "pending@x.com",
    status: "pending",
    newsletter: true,
    createdAt: "1",
  },
  {
    _type: "subscriber",
    email: "gone@x.com",
    status: "unsubscribed",
    newsletter: true,
    createdAt: "1",
  },
];
const run = async (all) =>
  (await (await evaluate(parse(exportQuery(all).query), { dataset: docs })).get()).map(
    (r) => r.email,
  );

test("the default export holds only confirmed newsletter subscribers", async () => {
  assert.deepEqual(await run(false), ["ok@x.com", "legacy@x.com"]);
});

test("--all lists every doc, with status and consent columns", async () => {
  assert.equal((await run(true)).length, docs.length);
  assert.ok(exportQuery(true).fields.includes("status"));
  assert.ok(exportQuery(true).fields.includes("newsletter"));
});

test("cells are formula-injection-safe", () => {
  const csv = toCsv(["email"], [{ email: "=HYPERLINK(1)" }]);
  assert.ok(!csv.split("\n")[1].startsWith('"='));
});
