import type { MessageKey } from "@/types/messages";

export type HowItWorksIllustration = "monitoringBarchart" | "scan" | "codeWindow";

export type Testimonial = {
  quoteKey: MessageKey;
  authorNameKey: MessageKey;
  authorHandleKey: MessageKey;
  authorAvatarUrl: string;
};

export type HowItWorksStep = {
  illustration: HowItWorksIllustration;
  numberKey: MessageKey;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  /** Optional testimonial blockquote rendered below the illustration. */
  testimonial?: Testimonial;
};

/**
 * Tailark Pro `how-it-works-03` — fixed-shape composition with a
 * `@3xl:grid-cols-3` border-wrapped layout: the left column (1fr)
 * holds a section header (title + body), and the right column
 * (col-span-2) holds three numbered steps stacked vertically with
 * `divide-y` separators. Four `PlusDecorator` glyphs sit at the
 * outer corners.
 *
 * Three steps is structural — the layout balances at 1+(stack-of-3).
 * Each step has a numbered circle (`1` / `2` / `3`) + title + body
 * + illustration; step 3 also embeds a testimonial blockquote.
 */
export type HowItWorksBlock = {
  type: "how-it-works-03";
  id: string;
  headerTitleKey: MessageKey;
  headerBodyKey: MessageKey;
  steps: readonly [HowItWorksStep, HowItWorksStep, HowItWorksStep];
};
