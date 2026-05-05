import type { Icon } from "@tabler/icons-react";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/onboarding-02` — vertical numbered card list
 * with a top-of-page progress bar and per-card primary action. All
 * visible strings resolve through `blocks.onboarding-02.*`.
 *
 * Per-step copy is keyed by `id` against
 * `items.<id>.{title,description,actionLabel}` in en.json.
 */
export type OnboardingStep = {
  /** Stable identifier — also the namespace key for translations. */
  id: string;
  /** Tabler icon used both in the card body and the action button. */
  icon: Icon;
  /** Initial completion state. */
  completed?: boolean;
};

export type OnboardingBlock = {
  type: "onboarding-02";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  /** Override the step list. Defaults to `onboarding02Steps`. */
  steps?: OnboardingStep[];
};
