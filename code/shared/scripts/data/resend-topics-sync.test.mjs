import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolveKey,
  topicPayload,
  findTopicId,
  TOPICS,
} from "./resend-topics-sync.mjs";

test("resolveKey throws without a key", () => {
  assert.throws(() => resolveKey({}), /RESEND_API_KEY/);
  assert.equal(resolveKey({ RESEND_API_KEY: "k" }), "k");
});

test("topicPayload defaults to private + opt_out", () => {
  const p = topicPayload({ key: "news", name: "News" });
  assert.equal(p.visibility, "private");
  assert.equal(p.default_subscription, "opt_out");
  assert.equal(p.name, "News");
});

test("topicPayload honours per-topic overrides (general = public + opt_in)", () => {
  const p = topicPayload({
    key: "general",
    name: "General",
    default_subscription: "opt_in",
    visibility: "public",
  });
  assert.equal(p.visibility, "public");
  assert.equal(p.default_subscription, "opt_in");
});

test("findTopicId matches by name", () => {
  const list = {
    data: [
      { id: "t1", name: "News" },
      { id: "t2", name: "Win-back (former members)" },
    ],
  };
  assert.equal(findTopicId(list, "Win-back (former members)"), "t2");
  assert.equal(findTopicId(list, "Nope"), undefined);
});

test("TOPICS covers the four categories + churned + general", () => {
  assert.deepEqual(TOPICS.map((t) => t.key).sort(), [
    "churned",
    "general",
    "news",
    "offers",
    "partners",
    "tips",
  ]);
});
