import type { MessageKey } from "@/types/messages";

/**
 * One quote in the testimonials block. Each quote is keyed by a stable
 * `id` against `blocks.testimonials-01.quotes.<id>.{quote, author, role}`
 * in en.json. Add a quote = `{ id, quoteKey, authorKey, ... }` here +
 * matching `quotes.<id>` block in en.json.
 */
export type TestimonialsQuote = {
  /** Stable identifier — keys translations under `quotes.<id>.*`. */
  id: string;
  quoteKey: MessageKey;
  authorKey: MessageKey;
  roleKey?: MessageKey;
  /** Root-relative or absolute URL for the avatar image. */
  avatarUrl?: string;
};

export type TestimonialsBlock = {
  type: "testimonials-01";
  id: string;
  quotes: TestimonialsQuote[];
};
