#!/usr/bin/env node
/**
 * Export the newsletter subscribers from Resend to CSV.
 *
 *   pnpm export:web:website:subscribers          # who may receive the newsletter
 *   pnpm export:web:website:subscribers --all    # also opted-out contacts, for an audit
 *
 * Resend is the only newsletter list: one `newsletter-<code>` segment per site language. A
 * contact who opted out of the `News` topic (Resend's preference page) stays in its segment,
 * so each contact's topics are read too: by default only the opted-in ones are written.
 * Writes ./backups/subscribers/subscribers-<timestamp>.csv (`email,locale,news,unsubscribed,created_at`).
 * Read-only on Resend. Needs RESEND_API_KEY in .env.local (the package.json script loads it
 * via --env-file).
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { csvCell } from "./lib/csv.mjs";

const RESEND_API = "https://api.resend.com";
const PREFIX = "newsletter-";
/** The topic every newsletter subscriber is opted into (named by `resend:topics:sync`). */
const NEWS_TOPIC = "News";
export const FIELDS = ["email", "locale", "news", "unsubscribed", "created_at"];

/** GET a Resend endpoint; retries a 429 (Resend's low team rate limit), throws on another
 *  non-2xx. `sleep` is injectable so tests never wait. */
async function getList(doFetch, key, path, sleep) {
  for (let attempt = 0; ; attempt++) {
    const res = await doFetch(`${RESEND_API}${path}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (res.status === 429 && attempt < 5) {
      await sleep(1000);
      continue;
    }
    if (!res.ok) throw new Error(`resend GET ${path.split("?")[0]} ${res.status}`);
    return res.json();
  }
}

/** Every contact of every `newsletter-<code>` segment, as CSV rows. `locale` comes from the
 *  segment name; `news` is the contact's `News` topic subscription. A globally unsubscribed
 *  or `News`-opted-out contact is skipped unless `all`. */
export async function fetchSubscribers(
  key,
  {
    all = false,
    doFetch = fetch,
    sleep = (ms) => new Promise((r) => setTimeout(r, ms)),
  } = {},
) {
  const get = (path) => getList(doFetch, key, path, sleep);
  const { data: topics = [] } = await get("/topics");
  const newsId = topics.find((t) => t.name === NEWS_TOPIC)?.id;
  if (!newsId) throw new Error(`no "${NEWS_TOPIC}" topic — run pnpm resend:topics:sync`);
  const { data: segments = [] } = await get("/segments?limit=100");
  const rows = [];
  for (const segment of segments.filter((s) => s.name?.startsWith(PREFIX))) {
    const locale = segment.name.slice(PREFIX.length);
    let after = "";
    for (;;) {
      const page = await get(
        `/segments/${segment.id}/contacts?limit=100${after ? `&after=${after}` : ""}`,
      );
      const contacts = page.data ?? [];
      for (const c of contacts) {
        if (c.unsubscribed && !all) continue;
        const { data: subs = [] } = await get(`/contacts/${c.id}/topics?limit=100`);
        const news = subs.find((t) => t.id === newsId)?.subscription ?? "none";
        if (news !== "opt_in" && !all) continue;
        rows.push({
          email: c.email,
          locale,
          news,
          unsubscribed: Boolean(c.unsubscribed),
          created_at: c.created_at,
        });
      }
      if (!page.has_more || !contacts.length) break;
      after = contacts.at(-1).id;
    }
  }
  return rows;
}

/** Rows → CSV, every cell formula-injection-safe (`csvCell`). */
export function toCsv(fields, rows) {
  return [
    fields.join(","),
    ...rows.map((r) => fields.map((f) => csvCell(r[f])).join(",")),
  ].join("\n");
}

async function main() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("✗ Missing RESEND_API_KEY. Set it in .env.local to export.");
    process.exit(1);
  }
  const all = process.argv.includes("--all");
  const rows = await fetchSubscribers(key, { all });

  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const dir = resolve("backups/subscribers");
  mkdirSync(dir, { recursive: true });
  const file = resolve(dir, `subscribers${all ? "-all" : ""}-${stamp}.csv`);
  writeFileSync(file, `${toCsv(FIELDS, rows)}\n`, "utf8");

  console.log(
    `✓ Exported ${rows.length} ${all ? "contact(s), opted-out included (audit — do not mail)" : "newsletter subscriber(s)"} → ${file}`,
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) await main();
