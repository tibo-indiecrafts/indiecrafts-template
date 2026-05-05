import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/onboarding-03` — numbered click-through
 * setup list with progress meter and a "Need help?" support block.
 * All visible strings resolve through `blocks.onboarding-03.*`.
 *
 * Per-step copy is keyed by `id` against
 * `items.<id>.{title,description}` in en.json. The numeric label
 * shown in the indicator is a raw string on the item ("1.", "2."…).
 */
export type OnboardingStep = {
  /** Stable identifier — also the namespace key for translations. */
  id: string;
  /** Number label shown when the step isn't completed yet. */
  label: string;
};

export type OnboardingBlock = {
  type: "onboarding-03";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  /** Override the step list. Defaults to `onboarding03Steps`. */
  steps?: OnboardingStep[];
  /** Email address for the help block. Defaults to `help@example.com`. */
  helpEmail?: string;
};
