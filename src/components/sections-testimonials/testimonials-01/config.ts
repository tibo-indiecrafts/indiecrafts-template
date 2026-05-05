/**
 * Sample config for the testimonials-01 block.
 *
 * `config.ts` is the home for ALL non-translation per-block data:
 *   - Translation MessageKey pointers (quoteKey, authorKey, …)
 *   - Image paths or absolute URLs (avatarUrl, logoUrl, posterUrl, …)
 *   - Internal route hrefs (StaticAppPathname)
 *   - Icon enum values (iconKey)
 *   - Visual variants, feature flags, numeric configuration
 *
 * Translatable strings use `blocks.<type>.*` MessageKeys — the English
 * defaults ship in the sibling `en.json` and can be overridden per locale
 * by the client via their main `messages/<locale>.json`.
 *
 * Quotes are id-keyed: each quote's strings live under
 * `blocks.testimonials-01.quotes.<id>.{quote, author, role}` in en.json.
 * Add a quote = append `{ id, quoteKey, authorKey, … }` here AND a
 * matching `quotes.<id>` block in en.json.
 */

import type { TestimonialsBlock } from "./schema";

export const testimonials01Key = "testimonials-01" as const;
export const testimonials01Namespace = "blocks.testimonials-01" as const;

export const testimonials01Sample: Omit<TestimonialsBlock, "id"> = {
  type: "testimonials-01",
  quotes: [
    {
      id: "lovelace",
      quoteKey: "blocks.testimonials-01.quotes.lovelace.quote",
      authorKey: "blocks.testimonials-01.quotes.lovelace.author",
      roleKey: "blocks.testimonials-01.quotes.lovelace.role",
      // Image path lives in config, not translations — assets are locale-agnostic.
      // Replace with the real avatar when forking for a client.
    },
  ],
};
