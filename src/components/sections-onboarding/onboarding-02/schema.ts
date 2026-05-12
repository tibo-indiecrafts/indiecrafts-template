import type { Icon } from "@tabler/icons-react";
import type { MessageKey } from "@/types/messages";

export type OnboardingStep = {
  id: string;

  icon: Icon;

  completed?: boolean;
};

export type OnboardingBlock = {
  type: "onboarding-02";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;

  steps?: OnboardingStep[];
};
