import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type HowItWorksIllustration = "documentCsv" | "currency" | "documentPair";

export type HowItWorksStep = {
  illustration: HowItWorksIllustration;
  numberKey: MessageKey;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `how-it-works-05` — vertical sibling of `how-it-works-04`.
 * Same content shape (eyebrow + header + 3 steps + CTA) but stacked
 * single-column inside a `md:max-w-1/3` rail with `ArrowBigDown`
 * connectors below steps 1 and 2 (not after step 3). All copy is
 * centered.
 *
 * Three steps is structural — the arrow connector logic places one
 * arrow after step 1 and one after step 2.
 */
export type HowItWorksBlock = {
  type: "how-it-works-05";
  id: string;
  eyebrowKey: MessageKey;
  headerTitleKey: MessageKey;
  headerBodyKey: MessageKey;
  steps: readonly [HowItWorksStep, HowItWorksStep, HowItWorksStep];
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
};
