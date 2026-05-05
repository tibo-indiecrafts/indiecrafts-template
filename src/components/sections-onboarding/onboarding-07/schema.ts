import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/onboarding-07` — animated three-bar data
 * migration progress indicator with an expandable logs accordion.
 * All visible strings resolve through `blocks.onboarding-07.*`.
 *
 * Per-step copy is keyed by `id` against
 * `items.<id>.{description,createdLog,inProgressLog}` in en.json.
 */
export type OnboardingStepType = "created" | "in-progress";

export type OnboardingStep = {
  /** Stable identifier — also the namespace key for translations. */
  id: string;
  /** Initial state. */
  type: OnboardingStepType;
  /** Initial percent complete (0–100). */
  value: number;
};

export type OnboardingBlock = {
  type: "onboarding-07";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  /** Override the step list. Defaults to `onboarding07Steps`. */
  steps?: OnboardingStep[];
};
