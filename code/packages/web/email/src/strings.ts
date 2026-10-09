/**
 * Reads the emailStrings singleton and resolves a locale value to one string.
 *
 * @see docs/reference/packages/web/email/src/strings.md
 */
import "server-only";

import { cache } from "react";
import { defineQuery } from "next-sanity";
import { pickLocale } from "@indiecrafts/packages-shared-config";
import { client } from "@indiecrafts/packages-web-sanity/client";

/** A `localeString`/`localeText` value — one string per locale. */
export type LocaleValue = Record<string, string | undefined> | null | undefined;

/**
 * The stored shape of an `ownerAlertGroup` — an internal alert to the site team
 * (recipients + a plain, untranslated subject). Read-side mirror of the factory.
 */
export type OwnerAlertConfig = {
  enabled?: boolean | null;
  to?: string[] | null;
  cc?: string[] | null;
  bcc?: string[] | null;
  from?: string | null;
  replyTo?: string | null;
  subject?: string | null;
  /** Translated body copy (resolved via `pick`); empty → the template default. */
  heading?: LocaleValue;
  intro?: LocaleValue;
  outro?: LocaleValue;
  moderationButtons?: boolean | null;
} | null;

/**
 * The stored shape of a `confirmationGroup` — a subscriber-facing email whose
 * copy is translated (`localeString`/`localeText`, resolved via `pick`).
 */
export type ConfirmationConfig = {
  enabled?: boolean | null;
  /** Blind-copy the global `supportEmail` (the group's "copie à l'adresse de support"). */
  copySupport?: boolean | null;
  from?: string | null;
  replyTo?: string | null;
  bcc?: string[] | null;
  subject?: LocaleValue;
  heading?: LocaleValue;
  intro?: LocaleValue;
  buttonLabel?: LocaleValue;
  outro?: LocaleValue;
} | null;

/**
 * The `emailStrings` singleton — one object field per email group. Groups are
 * contributed by each feature (its `emailGroups`), so this brick does not name
 * them: the read is a generic index of the two factory shapes. A feature narrows
 * to its own group(s) with a small local view type, e.g.
 * `(await getEmailStrings()) as { newsletterOwner?: OwnerAlertConfig }`.
 */
export type EmailStrings = Record<
  string,
  OwnerAlertConfig | ConfirmationConfig
> | null;

// Whole-doc read — no field projection, so a feature adding a group never edits
// this brick. `defineQuery` keeps it typegen-discoverable; the explicit generic
// types the result independent of the generated query map.
const emailStringsQuery = defineQuery(`*[_type == "emailStrings"][0]`);

/**
 * Read the `emailStrings` singleton (config + translated copy for every email).
 * Request-deduped via React `cache`; published client (build-safe). Every sender
 * reads this one entity and narrows to its own group.
 */
export const getEmailStrings = cache(async (): Promise<EmailStrings> =>
  client.fetch<EmailStrings>(emailStringsQuery),
);

/** Resolve a `localeString`/`localeText` to one string: the locale, else default, else empty. */
export function pick(value: LocaleValue, locale: string): string {
  return pickLocale(value, locale).trim();
}

/** The support-address blind copy for one send: `[supportEmail]` when the group opts in. */
export function supportCopy(
  cfg: { copySupport?: boolean | null } | null | undefined,
  supportEmail: string | null | undefined,
): string[] {
  const address = supportEmail?.trim();
  return cfg?.copySupport && address ? [address] : [];
}
