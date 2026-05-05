import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/dialog-05` — destructive confirm-by-password
 * AlertDialog (delete workspace). All copy resolves through
 * `blocks.dialog-05.*`.
 */
export type DialogBlock = {
  type: "dialog-05";
  id: string;
  defaultOpen?: boolean;
  triggerKey?: MessageKey;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  passwordLabelKey?: MessageKey;
  passwordPlaceholderKey?: MessageKey;
  cancelKey?: MessageKey;
  confirmKey?: MessageKey;
};
