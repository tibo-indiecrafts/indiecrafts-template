import {
  IconAdjustments,
  IconCalculator,
  IconChartBar,
  IconDatabase,
} from "@tabler/icons-react";
import type { OnboardingBlock, OnboardingStep } from "./schema";

export const onboarding04Key = "onboarding-04" as const;
export const onboarding04Namespace = "blocks.onboarding-04" as const;

export const onboarding04Steps: OnboardingStep[] = [
  { id: "environment", icon: IconAdjustments },
  { id: "database", icon: IconDatabase },
  { id: "schema", icon: IconCalculator },
  { id: "api", icon: IconChartBar },
];

export const onboarding04Sample: Omit<OnboardingBlock, "id"> = {
  type: "onboarding-04",
  steps: onboarding04Steps,
  initialActiveStep: 1,
};
