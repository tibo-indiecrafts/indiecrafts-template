/**
 * Fetch the per-locale UI chrome-string dictionary an editor owns in Sanity.
 *
 * @see docs/reference/projects/web/website/src/lib/ui-messages.md
 */

import { cache } from "react";
import type { Locale } from "@/config";
import { client } from "@indiecrafts/packages-web-sanity/client";
import { logger } from "@indiecrafts/packages-shared-logger";
import { uiMessagesQuery } from "@/sanity/ui-messages-queries";

/**
 * The per-locale UI dictionary from Sanity (`uiMessages.<locale>`) — the chrome
 * strings (nav, cookies, validation, blog UI, system pages) an editor now owns.
 * The **primary** source; `src/i18n/request.ts` overlays it on the bundled
 * `messages/<locale>.json` fallback so a Sanity hiccup never blanks the chrome.
 * React `cache()` dedupes it within a request; empty-on-error.
 */
type MessageTree = Record<string, unknown>;

const SYSTEM_FIELDS = new Set([
  "_id",
  "_type",
  "_rev",
  "_createdAt",
  "_updatedAt",
  "language",
]);

export const getUiMessages = cache(async (locale: Locale): Promise<MessageTree> => {
  try {
    const doc = (await client.fetch(uiMessagesQuery, {
      id: `uiMessages.${locale}`,
    })) as MessageTree | null;
    if (!doc) return {};
    return Object.fromEntries(Object.entries(doc).filter(([k]) => !SYSTEM_FIELDS.has(k)));
  } catch (error) {
    logger.error("getUiMessages failed", { locale, error });
    return {};
  }
});
