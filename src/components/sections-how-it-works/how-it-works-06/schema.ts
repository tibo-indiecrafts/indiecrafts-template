import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type HowItWorksIllustration = "documentBoxed" | "idCheck" | "actionable";

export type HowItWorksStep = {
  illustration: HowItWorksIllustration;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type HowItWorksBlock = {
  type: "how-it-works-06";
  id: string;
  headerTitleKey: MessageKey;
  headerBodyKey: MessageKey;
  steps: readonly [HowItWorksStep, HowItWorksStep, HowItWorksStep];
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
};
