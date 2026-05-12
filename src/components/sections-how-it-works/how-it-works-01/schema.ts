import type { MessageKey } from "@/types/messages";

export type HowItWorksIllustration = "payment" | "invoiceSigning" | "invoiceCard";

export type HowItWorksStep = {
  illustration: HowItWorksIllustration;
  /** "1." / "2." / "3." — typically just the digit + period; no trailing space. */
  numberKey: MessageKey;
  titleKey: MessageKey;
  /** Body MAY contain inline `<strong>` markup (rendered as foreground/medium). */
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `how-it-works-01` — fixed-shape 3-step composition in
 * a 3-col grid (`@4xl:grid-cols-3`). Each step is a numbered title +
 * body + perspective-skewed illustration (`rotate-y-3 -skew-y-4`
 * inside a `mask-radial-from-60% mask-radial-at-top-left` wrapper).
 * `grid-rows-subgrid` keeps the title and illustration rows aligned
 * across the three steps.
 *
 * Three steps is structural — the layout balances at exactly three.
 * Bodies support inline `<strong>` markup via `t.rich(...)` so the
 * translation file marks which fragment to highlight.
 */
export type HowItWorksBlock = {
  type: "how-it-works-01";
  id: string;
  steps: readonly [HowItWorksStep, HowItWorksStep, HowItWorksStep];
};
