import { test } from "node:test";
import assert from "node:assert/strict";
import { FIELDS, fetchSubscribers, toCsv } from "./subscribers-export.mjs";

const noWait = async () => {};

/** A mocked Resend: two language segments (the `en` one spans two pages) + one other segment,
 *  the `News` topic, and each contact's topic subscription. */
function mockResend({ rateLimitOnce = false } = {}) {
  const calls = [];
  let limited = rateLimitOnce;
  const pages = {
    "/segments/seg-en/contacts?limit=100": {
      has_more: true,
      data: [
        { id: "c1", email: "a@x.com", unsubscribed: false, created_at: "2026-10-01" },
        { id: "c2", email: "gone@x.com", unsubscribed: true, created_at: "2026-10-02" },
      ],
    },
    "/segments/seg-en/contacts?limit=100&after=c2": {
      has_more: false,
      data: [
        { id: "c3", email: "b@x.com", unsubscribed: false, created_at: "2026-10-03" },
        {
          id: "c5",
          email: "topic-out@x.com",
          unsubscribed: false,
          created_at: "2026-10-05",
        },
      ],
    },
    "/segments/seg-fr/contacts?limit=100": {
      has_more: false,
      data: [
        { id: "c4", email: "c@x.com", unsubscribed: false, created_at: "2026-10-04" },
      ],
    },
  };
  const news = { c1: "opt_in", c2: "opt_in", c3: "opt_in", c4: "opt_in", c5: "opt_out" };
  const doFetch = async (url, init) => {
    const path = url.replace("https://api.resend.com", "");
    calls.push({ path, auth: init.headers.Authorization });
    if (limited) {
      limited = false;
      return new Response("{}", { status: 429 });
    }
    if (path === "/topics")
      return Response.json({
        data: [
          { id: "t-news", name: "News" },
          { id: "t-offers", name: "Offers" },
        ],
      });
    if (path === "/segments?limit=100")
      return Response.json({
        data: [
          { id: "seg-en", name: "newsletter-en" },
          { id: "seg-fr", name: "newsletter-fr" },
          { id: "seg-vip", name: "vip" },
        ],
      });
    const topics = path.match(/^\/contacts\/(c\d)\/topics/);
    if (topics)
      return Response.json({
        data: [{ id: "t-news", subscription: news[topics[1]] }],
      });
    return pages[path] ? Response.json(pages[path]) : new Response("{}", { status: 404 });
  };
  return { calls, doFetch };
}

test("exports the opted-in contacts of every newsletter segment, locale from the segment name", async () => {
  const { calls, doFetch } = mockResend();
  const rows = await fetchSubscribers("re_k", { doFetch, sleep: noWait });
  assert.deepEqual(rows, [
    {
      email: "a@x.com",
      locale: "en",
      news: "opt_in",
      unsubscribed: false,
      created_at: "2026-10-01",
    },
    {
      email: "b@x.com",
      locale: "en",
      news: "opt_in",
      unsubscribed: false,
      created_at: "2026-10-03",
    },
    {
      email: "c@x.com",
      locale: "fr",
      news: "opt_in",
      unsubscribed: false,
      created_at: "2026-10-04",
    },
  ]);
  assert.ok(calls.every((c) => c.auth === "Bearer re_k"));
  assert.ok(!calls.some((c) => c.path.includes("seg-vip")));
});

test("a contact who opted out of the News topic is never a subscriber", async () => {
  const rows = await fetchSubscribers("re_k", {
    doFetch: mockResend().doFetch,
    sleep: noWait,
  });
  assert.ok(!rows.some((r) => r.email === "topic-out@x.com"));
});

test("--all keeps the unsubscribed and opted-out contacts, with their status", async () => {
  const rows = await fetchSubscribers("re_k", {
    all: true,
    doFetch: mockResend().doFetch,
    sleep: noWait,
  });
  assert.equal(rows.length, 5);
  assert.equal(rows.find((r) => r.email === "gone@x.com").unsubscribed, true);
  assert.equal(rows.find((r) => r.email === "topic-out@x.com").news, "opt_out");
});

test("a Resend rate limit (429) is retried", async () => {
  const rows = await fetchSubscribers("re_k", {
    doFetch: mockResend({ rateLimitOnce: true }).doFetch,
    sleep: noWait,
  });
  assert.equal(rows.length, 3);
});

test("a Resend error throws; a missing News topic says to run the sync", async () => {
  const unauthorized = async () => new Response("{}", { status: 401 });
  await assert.rejects(
    fetchSubscribers("bad", { doFetch: unauthorized, sleep: noWait }),
    /resend GET \/topics 401/,
  );
  const noTopic = async () => Response.json({ data: [] });
  await assert.rejects(
    fetchSubscribers("re_k", { doFetch: noTopic, sleep: noWait }),
    /resend:topics:sync/,
  );
});

test("the CSV has the five columns and formula-injection-safe cells", () => {
  const csv = toCsv(FIELDS, [
    {
      email: "=HYPERLINK(1)",
      locale: "en",
      news: "opt_in",
      unsubscribed: false,
      created_at: "x",
    },
  ]);
  const [head, row] = csv.split("\n");
  assert.equal(head, "email,locale,news,unsubscribed,created_at");
  assert.ok(row.startsWith("'="));
});
