import type { MessageKey } from "@/types/messages";

export type OnboardingStep = {
  id: string;

  label: string;
};

export type OnboardingBlock = {
  type: "onboarding-03";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;

  steps?: OnboardingStep[];

  helpEmail?: string;
};
