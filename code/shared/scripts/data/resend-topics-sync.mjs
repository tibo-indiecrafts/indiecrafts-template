#!/usr/bin/env node
// Operator-run: ensures every churn/marketing Resend topic exists (private,
// opt_out default) and prints its id — paste those into the Sanity
// `emailPreferences` singleton (`resendTopicId` per category).
//
// Canonical (default-locale) names are hardcoded below by design: Resend topics
// are `visibility: private` (users never see the name — they use our own
// localised preference centre), so reading Sanity here would add a dependency
// and a failure mode for zero user-visible benefit. Localised names stay in
// Sanity.
//
//   node code/shared/scripts/data/resend-topics-sync.mjs
//
// Requires RESEND_API_KEY in env. Idempotent — re-running finds existing
// topics by name instead of creating duplicates.

const RESEND_API = "https://api.resend.com";

// The 4 categories + churned are `private` (users manage them in the app's own
// localised preference centre) and default `opt_out`. `general` is the exception:
// a standalone marketing topic for existing/imported contacts (NOT a Sanity
// category), `public` so recipients can self-unsubscribe on Resend's hosted page,
// and `opt_in` per the operator's choice. Its id feeds resend-contacts-backfill.
export const TOPICS = [
  { key: "news", name: "News" },
  { key: "offers", name: "Offers" },
  { key: "partners", name: "Partners" },
  { key: "tips", name: "Tips" },
  { key: "churned", name: "Win-back (former members)" },
  {
    key: "general",
    name: "general",
    default_subscription: "opt_in",
    visibility: "public",
  },
];

export function resolveKey(env) {
  if (!env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is required");
  return env.RESEND_API_KEY;
}

export function topicPayload(topic) {
  return {
    name: topic.name,
    default_subscription: topic.default_subscription ?? "opt_out",
    visibility: topic.visibility ?? "private",
  };
}

export function findTopicId(listResponse, name) {
  return listResponse?.data?.find((t) => t.name === name)?.id;
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

  console.log("\nPaste these into Sanity emailPreferences (resendTopicId):");
  for (const topic of TOPICS) {
    if (topic.key !== "general" && ids[topic.key])
      console.log(`${topic.key.toUpperCase()}=${ids[topic.key]}`);
  }
  if (ids.general)
    console.log(
      `\nGENERAL=${ids.general}  (standalone marketing topic — not a Sanity category; feeds resend-contacts-backfill)`,
    );

  process.exit(failed ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
