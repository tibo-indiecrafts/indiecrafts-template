import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type HowItWorksIllustration = "documentCsv" | "currency" | "documentPair";

export type HowItWorksStep = {
  illustration: HowItWorksIllustration;
  numberKey: MessageKey;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

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
