import type { MessageKey } from "@/types/messages";

export type DialogBlock = {
  type: "dialog-01";
  id: string;

  defaultOpen?: boolean;
  triggerKey?: MessageKey;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  ctaKey?: MessageKey;
};
