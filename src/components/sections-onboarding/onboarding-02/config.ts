import { IconFolder, IconPlug, IconRocket, IconUsers } from "@tabler/icons-react";
import type { OnboardingBlock, OnboardingStep } from "./schema";

export const onboarding02Key = "onboarding-02" as const;
export const onboarding02Namespace = "blocks.onboarding-02" as const;

export const onboarding02Steps: OnboardingStep[] = [
  { id: "workspace", icon: IconRocket, completed: true },
  { id: "team", icon: IconUsers },
  { id: "project", icon: IconFolder },
  { id: "tools", icon: IconPlug },
];

export const onboarding02Sample: Omit<OnboardingBlock, "id"> = {
  type: "onboarding-02",
  steps: onboarding02Steps,
};
