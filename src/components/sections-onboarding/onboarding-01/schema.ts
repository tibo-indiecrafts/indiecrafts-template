import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/onboarding-01` — interactive setup checklist
 * with circular progress, expanding step rows, and a dismiss/feedback
 * dropdown menu. All visible strings resolve through
 * `blocks.onboarding-01.*`.
 *
 * Per-step copy is keyed by `id` against
 * `items.<id>.{title,description,actionLabel}` in en.json.
 */
export type OnboardingStep = {
  /** Stable identifier — also the namespace key for translations. */
  id: string;
  /** Initial completion state. */
  completed: boolean;
  /** Action button href. Use a real URL or leave the default `"#"`. */
  actionHref: string;
};

export type OnboardingBlock = {
  type: "onboarding-01";
  id: string;
  titleKey?: MessageKey;
  /** Override the step list. Defaults to `onboarding01Steps`. */
  steps?: OnboardingStep[];
  /** Email address used by the "Give feedback" menu item. */
  feedbackEmail?: string;
};
