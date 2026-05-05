import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/dialog-07` — destructive 2FA-deactivation
 * AlertDialog: read-only email + confirm-password field + cancel/confirm
 * footer. All copy resolves through `blocks.dialog-07.*`.
 */
export type DialogBlock = {
  type: "dialog-07";
  id: string;
  defaultOpen?: boolean;
  triggerKey?: MessageKey;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  email?: string;
  emailLabelKey?: MessageKey;
  passwordLabelKey?: MessageKey;
  passwordPlaceholderKey?: MessageKey;
  cancelKey?: MessageKey;
  confirmKey?: MessageKey;
};
