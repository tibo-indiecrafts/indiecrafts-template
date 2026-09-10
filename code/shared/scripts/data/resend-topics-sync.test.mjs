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

test("topicPayload is always private + opt_out", () => {
  const p = topicPayload({ key: "news", name: "News" });
  assert.equal(p.visibility, "private");
  assert.equal(p.default_subscription, "opt_out");
  assert.equal(p.name, "News");
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

test("TOPICS covers the four categories + churned", () => {
  assert.deepEqual(TOPICS.map((t) => t.key).sort(), [
    "churned",
    "news",
    "offers",
    "partners",
    "tips",
  ]);
});
