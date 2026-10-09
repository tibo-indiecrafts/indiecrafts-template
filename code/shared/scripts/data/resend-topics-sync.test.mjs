import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  resolveKey,
  topicPayload,
  findTopicId,
  TOPICS,
  siteLocales,
  missingSegments,
  localePropertyPayload,
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

test("findTopicId matches by name", () => {
  const list = {
    data: [
      { id: "t1", name: "News" },
      { id: "t2", name: "Win-back (former members)" },
    ],
  };
  assert.equal(findTopicId(list, "Win-back (former members)"), "t2");
  assert.equal(findTopicId(list, "Nope"), undefined);
  // A topic made by hand with another case is the same topic, never a duplicate.
  assert.equal(
    findTopicId({ data: [{ id: "t9", name: "general" }] }, "General"),
    "t9",
  );
});

test("TOPICS covers the five categories + churned", () => {
  assert.deepEqual(TOPICS.map((t) => t.key).sort(), [
    "churned",
    "general",
    "news",
    "offers",
    "partners",
    "tips",
  ]);
});

test("siteLocales reads the codes + default from the real shared config", () => {
  const source = readFileSync(
    new URL(
      "../../../packages/shared/config/src/shared/i18n.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const { codes, defaultLocale } = siteLocales(source);
  assert.ok(codes.length > 0);
  assert.ok(codes.includes(defaultLocale));
});

test("missingSegments lists only the absent newsletter-<code> segments", () => {
  const list = {
    data: [
      { id: "s1", name: "newsletter-en" },
      { id: "s2", name: "vip" },
    ],
  };
  assert.deepEqual(missingSegments(list, ["en", "fr"]), ["newsletter-fr"]);
  assert.deepEqual(missingSegments({ data: [] }, ["en"]), ["newsletter-en"]);
});

test("localePropertyPayload creates the property once, with the default as fallback", () => {
  assert.deepEqual(localePropertyPayload({ data: [] }, "en"), {
    key: "locale",
    type: "string",
    fallback_value: "en",
  });
  assert.equal(
    localePropertyPayload({ data: [{ id: "p1", key: "locale" }] }, "en"),
    null,
  );
});
