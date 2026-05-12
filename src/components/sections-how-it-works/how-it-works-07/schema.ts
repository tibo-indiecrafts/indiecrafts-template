import type { MessageKey } from "@/types/messages";

export type HowItWorksIllustration = "campaign" | "poll" | "memoryUsage";

export type HowItWorksStep = {
  illustration: HowItWorksIllustration;

  numberKey: MessageKey;
  titleKey: MessageKey;
  bodyKey: MessageKey;

  decoratedBackdrop?: boolean;

  verticalAlign?: "end" | "center";
};

export type HowItWorksBlock = {
  type: "how-it-works-07";
  id: string;

  headerTitleKey: MessageKey;

  headerBodyKey: MessageKey;
  steps: readonly [HowItWorksStep, HowItWorksStep, HowItWorksStep];
};
