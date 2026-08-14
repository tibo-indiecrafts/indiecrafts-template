import "server-only";

import { cache } from "react";
import { defineQuery } from "next-sanity";
import { defaultLocale } from "@indiecrafts/config";
import { client } from "@indiecrafts/sanity/client";

/** A `localeString`/`localeText` value — one string per locale. */
export type LocaleValue = Record<string, string | undefined> | null | undefined;

export type EmailStrings = {
  commentNotification?: {
    enabled?: boolean | null;
    to?: string[] | null;
    cc?: string[] | null;
    bcc?: string[] | null;
    from?: string | null;
    replyTo?: string | null;
    subject?: string | null;
    moderationButtons?: boolean | null;
  } | null;
  newsletterConfirm?: {
    enabled?: boolean | null;
    from?: string | null;
    replyTo?: string | null;
    bcc?: string[] | null;
    subject?: LocaleValue;
    heading?: LocaleValue;
    intro?: LocaleValue;
    buttonLabel?: LocaleValue;
    outro?: LocaleValue;
  } | null;
  newsletterOwner?: {
    enabled?: boolean | null;
    to?: string[] | null;
    cc?: string[] | null;
    bcc?: string[] | null;
    from?: string | null;
    subject?: string | null;
  } | null;
  waitlistConfirm?: {
    enabled?: boolean | null;
    from?: string | null;
    replyTo?: string | null;
    bcc?: string[] | null;
    subject?: LocaleValue;
    heading?: LocaleValue;
    intro?: LocaleValue;
    outro?: LocaleValue;
  } | null;
  waitlistOwner?: {
    enabled?: boolean | null;
    to?: string[] | null;
    cc?: string[] | null;
    bcc?: string[] | null;
    from?: string | null;
    subject?: string | null;
  } | null;
} | null;

const emailStringsQuery = defineQuery(
  `*[_type == "emailStrings"][0]{ commentNotification, newsletterConfirm, newsletterOwner, waitlistConfirm, waitlistOwner }`,
);

/**
 * Read the `emailStrings` singleton (config + translated copy for every email).
 * Request-deduped via React `cache`; published client (build-safe). Every sender
 * reads this one entity and picks its own group.
 */
export const getEmailStrings = cache(async (): Promise<EmailStrings> => client.fetch(emailStringsQuery));

/** Resolve a `localeString`/`localeText` to one string: the locale, else default, else empty. */
export function pick(value: LocaleValue, locale: string): string {
  return (value?.[locale] ?? value?.[defaultLocale] ?? "").trim();
}
