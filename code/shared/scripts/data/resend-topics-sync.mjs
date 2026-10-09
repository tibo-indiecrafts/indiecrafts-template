#!/usr/bin/env node
// Operator-run: ensures every churn/marketing/general Resend topic exists (private,
// opt_out default) and prints its id — paste those into the Sanity
// `emailPreferences` singleton (`resendTopicId` per category).
//
// Canonical (default-locale) names are hardcoded below by design: Resend topics
// are `visibility: private` (users never see the name — they use our own
// localised preference centre), so reading Sanity here would add a dependency
// and a failure mode for zero user-visible benefit. Localised names stay in
// Sanity.
//
// It also ensures the newsletter's language setup: the `locale` contact property
// (fallback = the default site locale) and one `newsletter-<code>` segment per site
// locale. The api puts each newsletter subscriber in its language segment; the
// segments are the Broadcast audiences, one per language.
//
//   node code/shared/scripts/data/resend-topics-sync.mjs
//
// Requires RESEND_API_KEY in env. Idempotent — re-running finds existing
// topics, the property and segments by name instead of creating duplicates.

import { readFileSync } from "node:fs";

const RESEND_API = "https://api.resend.com";
// The site locales live in the shared config source (a .ts file node cannot import from a
// script), so read them the way lib/project.mjs reads DEFAULT_SITE_PREFIX: by pattern.
const I18N_SOURCE = new URL(
  "../../../packages/shared/config/src/shared/i18n.ts",
  import.meta.url,
);

// Every topic is `private` (users manage them in the app's own localised preference
// centre) and default `opt_out`: no contact is ever subscribed without a decision.
export const TOPICS = [
  { key: "news", name: "News" },
  { key: "offers", name: "Offers" },
  { key: "partners", name: "Partners" },
  { key: "tips", name: "Tips" },
  // Waitlist and contact-form people (`POST /v1/contacts/general`).
  { key: "general", name: "General" },
  { key: "churned", name: "Win-back (former members)" },
];

export function resolveKey(env) {
  if (!env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is required");
  return env.RESEND_API_KEY;
}

export function topicPayload(topic) {
  return {
    name: topic.name,
    default_subscription: "opt_out",
    visibility: "private",
  };
}

export function findTopicId(listResponse, name) {
  return listResponse?.data?.find((t) => t.name === name)?.id;
}

/** `{ codes, defaultLocale }` from the `i18n.ts` source text. */
export function siteLocales(source) {
  const block = source.slice(
    source.indexOf("locales:"),
    source.indexOf("defaultLocale:"),
  );
  return {
    codes: [...block.matchAll(/\bcode:\s*"([^"]+)"/g)].map((m) => m[1]),
    defaultLocale: source.match(/\bdefaultLocale:\s*"([^"]+)"/)?.[1],
  };
}

/** The `newsletter-<code>` segment names a `GET /segments` list still lacks. */
export function missingSegments(listResponse, codes) {
  const names = new Set(listResponse?.data?.map((s) => s.name));
  return codes.map((c) => `newsletter-${c}`).filter((n) => !names.has(n));
}

/** `POST /contact-properties` body for the `locale` property, or null if it exists. */
export function localePropertyPayload(listResponse, defaultLocale) {
  if (listResponse?.data?.some((p) => p.key === "locale")) return null;
  return { key: "locale", type: "string", fallback_value: defaultLocale };
}

async function main() {
  const key = resolveKey(process.env);
  const headers = {
    Authorization: `Bearer ${key}`,
    "content-type": "application/json",
  };

  const listRes = await fetch(`${RESEND_API}/topics`, { headers });
  if (!listRes.ok) throw new Error(`resend GET /topics ${listRes.status}`);
  const list = await listRes.json();

  const ids = {};
  let failed = false;
  for (const topic of TOPICS) {
    try {
      let id = findTopicId(list, topic.name);
      if (!id) {
        const res = await fetch(`${RESEND_API}/topics`, {
          method: "POST",
          headers,
          body: JSON.stringify(topicPayload(topic)),
        });
        if (!res.ok) throw new Error(`resend POST /topics ${res.status}`);
        id = (await res.json()).id;
      }
      ids[topic.key] = id;
    } catch (e) {
      console.error(`✗ ${topic.key} (${topic.name}): ${e.message}`);
      failed = true;
    }
  }

  // Newsletter language setup: the `locale` property + one segment per site locale.
  const { codes, defaultLocale } = siteLocales(
    readFileSync(I18N_SOURCE, "utf8"),
  );
  const send = async (path, body) => {
    const res = await fetch(`${RESEND_API}${path}`, {
      method: body ? "POST" : "GET",
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok)
      throw new Error(`resend ${body ? "POST" : "GET"} ${path} ${res.status}`);
    return res.json();
  };
  try {
    const property = localePropertyPayload(
      await send("/contact-properties"),
      defaultLocale,
    );
    if (property) await send("/contact-properties", property);
    console.log(`✓ contact property locale (fallback ${defaultLocale})`);
    for (const name of missingSegments(
      await send("/segments?limit=100"),
      codes,
    ))
      await send("/segments", { name });
    console.log(`✓ segments ${codes.map((c) => `newsletter-${c}`).join(", ")}`);
  } catch (e) {
    console.error(`✗ newsletter language setup: ${e.message}`);
    failed = true;
  }

  console.log("\nPaste these into Sanity emailPreferences (resendTopicId):");
  for (const topic of TOPICS) {
    if (ids[topic.key])
      console.log(`${topic.key.toUpperCase()}=${ids[topic.key]}`);
  }

  process.exit(failed ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
