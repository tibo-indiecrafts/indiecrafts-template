import { test } from "node:test";
import assert from "node:assert/strict";
import { FIELDS, fetchSubscribers, toCsv } from "./subscribers-export.mjs";

/** A mocked Resend: two language segments (the `en` one spans two pages) + one other segment. */
function mockResend() {
  const calls = [];
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
      ],
    },
    "/segments/seg-fr/contacts?limit=100": {
      has_more: false,
      data: [
        { id: "c4", email: "c@x.com", unsubscribed: false, created_at: "2026-10-04" },
      ],
    },
  };
  const doFetch = async (url, init) => {
    const path = url.replace("https://api.resend.com", "");
    calls.push({ path, auth: init.headers.Authorization });
    if (path === "/segments?limit=100")
      return Response.json({
        data: [
          { id: "seg-en", name: "newsletter-en" },
          { id: "seg-fr", name: "newsletter-fr" },
          { id: "seg-vip", name: "vip" },
        ],
      });
    return pages[path] ? Response.json(pages[path]) : new Response("{}", { status: 404 });
  };
  return { calls, doFetch };
}

test("exports every newsletter segment's subscribed contacts, locale from the segment name", async () => {
  const { calls, doFetch } = mockResend();
  const rows = await fetchSubscribers("re_k", { doFetch });
  assert.deepEqual(rows, [
    { email: "a@x.com", locale: "en", unsubscribed: false, created_at: "2026-10-01" },
    { email: "b@x.com", locale: "en", unsubscribed: false, created_at: "2026-10-03" },
    { email: "c@x.com", locale: "fr", unsubscribed: false, created_at: "2026-10-04" },
  ]);
  assert.ok(calls.every((c) => c.auth === "Bearer re_k"));
  assert.ok(!calls.some((c) => c.path.includes("seg-vip")));
});

test("--all keeps unsubscribed contacts", async () => {
  const rows = await fetchSubscribers("re_k", {
    all: true,
    doFetch: mockResend().doFetch,
  });
  assert.equal(rows.length, 4);
  assert.equal(rows.find((r) => r.email === "gone@x.com").unsubscribed, true);
});

test("a Resend error throws", async () => {
  const doFetch = async () => new Response("{}", { status: 401 });
  await assert.rejects(fetchSubscribers("bad", { doFetch }), /resend GET \/segments 401/);
});

test("the CSV has the four columns and formula-injection-safe cells", () => {
  const csv = toCsv(FIELDS, [
    { email: "=HYPERLINK(1)", locale: "en", unsubscribed: false, created_at: "x" },
  ]);
  const [head, row] = csv.split("\n");
  assert.equal(head, "email,locale,unsubscribed,created_at");
  assert.ok(row.startsWith("'="));
});
