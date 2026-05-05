import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/dialog-06` — create-workspace modal: title +
 * description + workspace-name field + private-toggle panel. All copy
 * resolves through `blocks.dialog-06.*`.
 */
export type DialogBlock = {
  type: "dialog-06";
  id: string;
  defaultOpen?: boolean;
  triggerKey?: MessageKey;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  nameLabelKey?: MessageKey;
  namePlaceholderKey?: MessageKey;
  submitKey?: MessageKey;
  privateLabelKey?: MessageKey;
  privateDescriptionKey?: MessageKey;
};
