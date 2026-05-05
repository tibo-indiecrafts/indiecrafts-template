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

/**
 * Tailark `testimonials` — pull-quote section. Renders one centered
 * quote when `quotes.length === 1`; renders a vertically-stacked list
 * with separators when `quotes.length > 1`. Sample defaults to a single
 * quote — pass a longer `quotes` array to render multiple testimonials.
 */
export type TestimonialsBlock = {
  type: "testimonials-01";
  id: string;
  quotes: TestimonialsQuote[];
};
