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
 * Tailark Pro `how-it-works-04` — center-aligned 3-step workflow
 * inside a rounded-2rem container, with `ArrowBigRight` arrows
 * connecting steps 1→2 and 2→3 (hidden below `@3xl`). Each step
 * is a `grid-rows-subgrid` cell with: numbered circle + illustration
 * + title + body, all centered.
 *
 * Three steps is structural — the arrow connector logic places one
 * arrow after step 1 and one after step 2 (not after step 3). The
 * `documentPair` illustration renders two side-by-side
 * `DocumentIllustration` cards (the upstream's "Actionable Reports"
 * step shows two stacked documents).
 */
export type HowItWorksBlock = {
  type: "how-it-works-04";
  id: string;
  /** Eyebrow above the section title (e.g. "Our Process"). */
  eyebrowKey: MessageKey;
  headerTitleKey: MessageKey;
  headerBodyKey: MessageKey;
  steps: readonly [HowItWorksStep, HowItWorksStep, HowItWorksStep];
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
};
