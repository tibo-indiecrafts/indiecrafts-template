import type { MessageKey } from "@/types/messages";

export type OnboardingStepType = "created" | "in-progress";

export type OnboardingStep = {
  id: string;

  type: OnboardingStepType;

  value: number;
};

export type OnboardingBlock = {
  type: "onboarding-07";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;

  steps?: OnboardingStep[];
};
