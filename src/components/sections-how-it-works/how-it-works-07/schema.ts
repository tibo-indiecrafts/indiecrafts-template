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

export type HowItWorksBlock = {
  type: "how-it-works-07";
  id: string;
  /** Section title above the grid. */
  headerTitleKey: MessageKey;
  /** Header body — supports inline `<strong>` markup via `t.rich(...)`. */
  headerBodyKey: MessageKey;
  steps: readonly [HowItWorksStep, HowItWorksStep, HowItWorksStep];
};
