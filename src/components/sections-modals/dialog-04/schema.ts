import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/dialog-04` — edit-profile modal: title +
 * description + username field + save CTA. Posts to a caller-supplied
 * action; copy resolves through `blocks.dialog-04.*`.
 */
export type DialogBlock = {
  type: "dialog-04";
  id: string;
  defaultOpen?: boolean;
  triggerKey?: MessageKey;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  usernameLabelKey?: MessageKey;
  usernamePlaceholderKey?: MessageKey;
  submitKey?: MessageKey;
};
