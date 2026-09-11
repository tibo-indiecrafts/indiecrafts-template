import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolveConfig,
  contactPatchBody,
  findTopicId,
} from "./resend-contacts-backfill.mjs";

const ENV = { RESEND_API_KEY: "k", RESEND_AUDIENCE_ID: "aud_1" };

test("resolveConfig requires key + audience", () => {
  assert.throws(() => resolveConfig({}, []), /RESEND_API_KEY/);
  assert.throws(
    () => resolveConfig({ RESEND_API_KEY: "k" }, []),
    /RESEND_AUDIENCE_ID/,
  );
});

test("resolveConfig defaults: General topic, opt_in, dry-run", () => {
  const c = resolveConfig(ENV, []);
  assert.equal(c.topicName, "General");
  assert.equal(c.subscription, "opt_in");
  assert.equal(c.confirm, false);
});

test("resolveConfig parses --topic / --subscription / --confirm", () => {
  const c = resolveConfig(ENV, [
    "--topic",
    "News",
    "--subscription",
    "opt_out",
    "--confirm",
  ]);
  assert.equal(c.topicName, "News");
  assert.equal(c.subscription, "opt_out");
  assert.equal(c.confirm, true);
});

test("resolveConfig rejects a bad --subscription", () => {
  assert.throws(
    () => resolveConfig(ENV, ["--subscription", "maybe"]),
    /opt_in or opt_out/,
  );
});

test("contactPatchBody sets one topic subscription", () => {
  assert.deepEqual(contactPatchBody("top_1", "opt_in"), {
    topics: [{ id: "top_1", subscription: "opt_in" }],
  });
});

test("findTopicId matches by exact name", () => {
  const list = { data: [{ id: "g1", name: "General" }] };
  assert.equal(findTopicId(list, "General"), "g1");
  assert.equal(findTopicId(list, "Nope"), undefined);
});
