import type { OnboardingBlock, OnboardingStep } from "./schema";

export const onboarding03Key = "onboarding-03" as const;
export const onboarding03Namespace = "blocks.onboarding-03" as const;

export const onboarding03Steps: OnboardingStep[] = [
  { id: "store", label: "1." },
  { id: "products", label: "2." },
  { id: "payments", label: "3." },
  { id: "launch", label: "4." },
];

export const onboarding03Sample: Omit<OnboardingBlock, "id"> = {
  type: "onboarding-03",
  steps: onboarding03Steps,
  helpEmail: "help@example.com",
};
