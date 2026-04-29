/**
 * Per-request i18n config — resolves the active locale and merges three tiers:
 *
 *   1. `messages/<locale>.json`                    — global chrome (nav, cta, footer, common, typography, llms)
 *   2. `src/app/[locale]/<segment>/messages/<locale>.json` (per-page)        merged under `pages.<id>.*`
 *   3. Each converted block's `en.json`                                        merged under `blocks.<type>.*`
 *
 * **Client overrides win.** Block samples (tier 3) are English-only defaults
 * that make a block render standalone. When the client wants to customize a
 * block's copy without editing the block's source, they add a matching
 * `blocks.<type>.*` entry to their main `messages/<locale>.json`. Tier 1 is
 * deep-merged ON TOP of tier 3 so the client always wins, per-key.
 *
 * This means a French site can override `blocks.cta-1.title` in `fr.json`
 * without touching the template. Un-overridden keys fall back to the
 * English sample (good enough for preview, obvious signal that it's not
 * translated yet).
 *
 * next-intl calls this automatically via the plugin in next.config.ts.
 */

import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { loadBlockMessages } from "./block-messages";
import { loadPageMessages } from "@/config/pages/messages";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const globalMessages: Record<string, unknown> = (
    await import(`../../messages/${locale}.json`)
  ).default;
  const pageMessages = loadPageMessages(locale);
  const blockMessages = loadBlockMessages();

  // Deep-merge: block samples are the floor; anything the client ships under
  // `blocks.*` in their root messages wins per-key (and per-nested-key).
  const clientBlockOverrides = isObject(globalMessages.blocks)
    ? globalMessages.blocks
    : {};
  const mergedBlocks = deepMerge(blockMessages, clientBlockOverrides);

  // Strip `blocks` from globalMessages so the merged version is the only one.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { blocks: _clientBlocks, ...globalWithoutBlocks } = globalMessages;

  return {
    locale,
    messages: {
      ...globalWithoutBlocks,
      pages: pageMessages,
      blocks: mergedBlocks,
    },
  };
});

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

/**
 * Recursive merge — `override` wins per key. Scalars and arrays replace;
 * plain objects merge. No external dep needed for this shape.
 */
function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (isObject(value) && isObject(out[key])) {
      out[key] = deepMerge(out[key] as Record<string, unknown>, value);
    } else {
      out[key] = value;
    }
  }
  return out;
}
