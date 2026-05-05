import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/dialog-03` — destructive confirmation modal
 * (left-aligned warning icon + title + description + cancel/confirm
 * footer). All copy resolves through `blocks.dialog-03.*`.
 */
export type DialogBlock = {
  type: "dialog-03";
  id: string;
  defaultOpen?: boolean;
  triggerKey?: MessageKey;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  cancelKey?: MessageKey;
  confirmKey?: MessageKey;
};
