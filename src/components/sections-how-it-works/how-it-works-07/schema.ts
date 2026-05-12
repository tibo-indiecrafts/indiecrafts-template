import type { MessageKey } from "@/types/messages";

export type HowItWorksIllustration = "campaign" | "poll" | "memoryUsage";

export type HowItWorksStep = {
  illustration: HowItWorksIllustration;
  /** Numeric counter shown in the diagonal-stripe pill on each step. */
  numberKey: MessageKey;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  /** When true, wrap the illustration in a decorative gradient + grid backdrop (used by step 2). */
  decoratedBackdrop?: boolean;
  /** Default `"center"`. Step 1 in upstream uses `"end"` so the campaign card sits flush at the bottom; step 2/3 center for visual breathing room. */
  verticalAlign?: "end" | "center";
};

/**
 * Tailark Pro `how-it-works-07` — 3-step composition rendered as a
 * single bordered grid (`@4xl:grid-cols-3` with `@4xl:divide-x`).
 * Header above the grid carries the section title + a body with
 * `<strong>` highlight via `t.rich(...)`. Four PlusDecorator marks
 * sit at the outer corners.
 *
 * Each step has a `Counter` pill (diagonal-stripe filled, mono font)
 * pinned at the top and an illustration below. Step 2 adds a
 * decorated backdrop (radial gradient blur + cross-grid pattern)
 * behind its illustration via `decoratedBackdrop: true`.
 *
 * Three steps is structural — the grid + nth-child border logic
 * balances at exactly three.
 */
export type HowItWorksBlock = {
  type: "how-it-works-07";
  id: string;
  /** Section title above the grid. */
  headerTitleKey: MessageKey;
  /** Header body — supports inline `<strong>` markup via `t.rich(...)`. */
  headerBodyKey: MessageKey;
  steps: readonly [HowItWorksStep, HowItWorksStep, HowItWorksStep];
};
