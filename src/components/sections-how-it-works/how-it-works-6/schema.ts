import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type HowItWorksIllustration = "documentBoxed" | "idCheck" | "actionable";

export type HowItWorksStep = {
  illustration: HowItWorksIllustration;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

/**
 * Tailark Pro `how-it-works-6` — formula-style 3-step composition
 * (`Document + IDCheck = Actionable`). Center-aligned 3-col grid
 * with `Plus` connector after step 1 and `Equal` connector after
 * step 2 (mathematical formula reading). Connectors render
 * horizontally at `@3xl` and stack vertically below.
 *
 * Background: subtle `radial-gradient` dot pattern with
 * `mix-blend-overlay`. CTA "Get Started" outline button below the
 * grid.
 *
 * Three steps is structural — the formula reads "input + check =
 * output". The first step's illustration is wrapped in a corner-
 * bracket decorator (`CardDecorator`) for emphasis; the rest render
 * the illustration directly.
 */
export type HowItWorksBlock = {
  type: "how-it-works-6";
  id: string;
  headerTitleKey: MessageKey;
  headerBodyKey: MessageKey;
  steps: readonly [HowItWorksStep, HowItWorksStep, HowItWorksStep];
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
};
