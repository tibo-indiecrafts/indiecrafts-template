import type { OnboardingBlock, OnboardingStep } from "./schema";

export const onboarding07Key = "onboarding-07" as const;
export const onboarding07Namespace = "blocks.onboarding-07" as const;

export const onboarding07Steps: OnboardingStep[] = [
  { id: "export", type: "created", value: 100 },
  { id: "transform", type: "created", value: 100 },
  { id: "import", type: "in-progress", value: 45 },
];

export const onboarding07Sample: Omit<OnboardingBlock, "id"> = {
  type: "onboarding-07",
  steps: onboarding07Steps,
};
