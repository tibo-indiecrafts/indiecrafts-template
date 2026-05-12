import type { MessageKey } from "@/types/messages";

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
