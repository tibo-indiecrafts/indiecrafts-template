/**
 * Sample config for the testimonials-1 block.
 *
 * `config.ts` is the home for ALL non-translation per-block data:
 *   - Translation MessageKey pointers (titleKey, quoteKey, …)
 *   - Image paths or absolute URLs (avatarUrl, logoUrl, posterUrl, …)
 *   - Internal route hrefs (StaticAppPathname)
 *   - Icon enum values (iconKey)
 *   - Visual variants, feature flags, numeric configuration
 *
 * Translatable strings use `blocks.<type>.*` MessageKeys — the English
 * defaults ship in the sibling `en.json` and can be overridden per locale
 * by the client via their main `messages/<locale>.json`.
 */

import type { Testimonials1Block } from "./schema";

export const testimonials1Sample: Omit<Testimonials1Block, "id"> = {
  type: "testimonials-1",
  quoteKey: "blocks.testimonials-1.quote",
  authorKey: "blocks.testimonials-1.author",
  roleKey: "blocks.testimonials-1.role",
  // Image path lives in config, not translations — assets are locale-agnostic.
  // Replace with the real avatar when forking for a client.
};
