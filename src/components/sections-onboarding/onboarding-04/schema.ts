import type { Icon } from "@tabler/icons-react";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/onboarding-04` — accordion-based step list
 * with per-item illustration, subtitle, description, and primary
 * action. All visible strings resolve through `blocks.onboarding-04.*`.
 *
 * Per-step copy is keyed by `id` against
 * `items.<id>.{title,subtitle,description,actionLabel}` in en.json.
 */
export type OnboardingStep = {
  /** Stable identifier — also the namespace key for translations. */
  id: string;
  /** Tabler icon shown inside the open accordion panel. */
  icon: Icon;
};

export type OnboardingBlock = {
  type: "onboarding-04";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  /** Override the step list. Defaults to `onboarding04Steps`. */
  steps?: OnboardingStep[];
  /** Index of the initially active step. Defaults to 1. */
  initialActiveStep?: number;
};
