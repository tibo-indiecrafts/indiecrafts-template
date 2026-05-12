import type { MessageKey } from "@/types/messages";

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
