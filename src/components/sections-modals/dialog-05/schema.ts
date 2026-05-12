import type { MessageKey } from "@/types/messages";

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
