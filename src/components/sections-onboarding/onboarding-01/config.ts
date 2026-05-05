import type { OnboardingBlock, OnboardingStep } from "./schema";

export const onboarding01Key = "onboarding-01" as const;
export const onboarding01Namespace = "blocks.onboarding-01" as const;

export const onboarding01Steps: OnboardingStep[] = [
  { id: "profile", completed: true, actionHref: "#" },
  { id: "workspace", completed: false, actionHref: "#" },
  { id: "invite", completed: false, actionHref: "#" },
  { id: "integrations", completed: false, actionHref: "#" },
  { id: "workflow", completed: false, actionHref: "#" },
  { id: "notifications", completed: false, actionHref: "#" },
];

export const onboarding01Sample: Omit<OnboardingBlock, "id"> = {
  type: "onboarding-01",
  steps: onboarding01Steps,
  feedbackEmail: "support@example.com",
};
