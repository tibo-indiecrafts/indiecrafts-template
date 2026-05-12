import type { MessageKey } from "@/types/messages";

export type OnboardingStep = {
  id: string;

  completed: boolean;

  actionHref: string;
};

export type OnboardingBlock = {
  type: "onboarding-01";
  id: string;
  titleKey?: MessageKey;

  steps?: OnboardingStep[];

  feedbackEmail?: string;
};
