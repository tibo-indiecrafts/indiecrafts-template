import type { MessageKey } from "@/types/messages";

export type HowItWorksStep = {
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type HowItWorksBlock = {
  type: "how-it-works-08";
  id: string;
  eyebrowKey: MessageKey;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  steps: readonly [HowItWorksStep, HowItWorksStep, HowItWorksStep];
};
