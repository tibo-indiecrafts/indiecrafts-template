#!/usr/bin/env node
// Operator-run ONE-OFF: subscribe every existing contact to a topic (default:
// the "general" topic, opt_in). Creating a topic does NOT retroactively
// subscribe already-imported contacts — this backfills them.
//
// Uses Resend's CURRENT model: Contacts are GLOBAL (GET /contacts — no
// audience id). Audiences were renamed to Segments and contacts left them, so
// the old /audiences/{id}/contacts path returns nothing on a migrated account.
//
// ⚠️  CONSENT (GDPR / ePrivacy): `opt_in` means these contacts WILL receive
//     marketing for this topic. Only run with opt_in if you have a lawful basis
//     (they consented). To group them without subscribing, use
//     `--subscription opt_out`.
//
//   node code/shared/scripts/data/resend-contacts-backfill.mjs \
//        [--topic general] [--subscription opt_in|opt_out] [--confirm]
//
// DRY-RUN by default: prints how many contacts it WOULD change and stops.
// Pass --confirm to actually PATCH each contact. Requires RESEND_API_KEY in env.

const RESEND_API = "https://api.resend.com";

/** Parse env + argv into a config; throws on a missing key or a bad flag. */
export function resolveConfig(env, argv) {
  if (!env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is required");
  const flag = (name, def) => {
    const i = argv.indexOf(name);
    return i >= 0 && argv[i + 1] ? argv[i + 1] : def;
  };
  const subscription = flag("--subscription", "opt_in");
  if (subscription !== "opt_in" && subscription !== "opt_out")
    throw new Error("--subscription must be opt_in or opt_out");
  return {
    key: env.RESEND_API_KEY,
    topicName: flag("--topic", "general"),
    subscription,
    confirm: argv.includes("--confirm"),
  };
}

/** The PATCH body that sets one topic's subscription on a contact. */
export function contactPatchBody(topicId, subscription) {
  return { topics: [{ id: topicId, subscription }] };
}

/** Find a topic's id by exact name in a Resend list response. */
export function findTopicId(listResponse, name) {
  return listResponse?.data?.find((t) => t.name === name)?.id;
}

async function main() {
  const cfg = resolveConfig(process.env, process.argv.slice(2));
  const headers = {
    Authorization: `Bearer ${cfg.key}`,
    "content-type": "application/json",
  };

  const topicsRes = await fetch(`${RESEND_API}/topics`, { headers });
  if (!topicsRes.ok) throw new Error(`resend GET /topics ${topicsRes.status}`);
  const topicId = findTopicId(await topicsRes.json(), cfg.topicName);
  if (!topicId) throw new Error(`topic "${cfg.topicName}" not found`);

  // Paginate the global Contacts list: <=100/page, cursor via `after` + has_more.
  const contacts = [];
  let after;
  do {
    const url = new URL(`${RESEND_API}/contacts`);
    url.searchParams.set("limit", "100");
    if (after) url.searchParams.set("after", after);
    const listRes = await fetch(url, { headers });
    if (!listRes.ok) throw new Error(`resend GET /contacts ${listRes.status}`);
    const page = await listRes.json();
    const rows = page?.data ?? [];
    contacts.push(...rows);
    after =
      page?.has_more && rows.length ? rows[rows.length - 1].id : undefined;
  } while (after);

  console.log(
    `${contacts.length} contacts · topic "${cfg.topicName}" (${topicId}) · ${cfg.subscription} · ${cfg.confirm ? "LIVE" : "DRY-RUN"}`,
  );
  if (!cfg.confirm) {
    console.log(
      "dry-run — verify the count, then re-run with --confirm to apply.",
    );
    process.exit(0);
  }
  if (cfg.subscription === "opt_in")
    console.log(
      "⚠️  opt_in — subscribing these contacts to marketing. Ensure you have consent.",
    );

  let ok = 0;
  let failed = 0;
  for (const c of contacts) {
    try {
      const res = await fetch(`${RESEND_API}/contacts/${c.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(contactPatchBody(topicId, cfg.subscription)),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      ok++;
    } catch (e) {
      console.error(`✗ ${c.email ?? c.id}: ${e.message}`);
      failed++;
    }
  }
  console.log(`done — ${ok} updated, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
