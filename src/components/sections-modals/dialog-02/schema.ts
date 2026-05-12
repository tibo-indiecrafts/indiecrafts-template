import type { MessageKey } from "@/types/messages";

export type DialogBlock = {
  type: "dialog-02";
  id: string;
  defaultOpen?: boolean;
  triggerKey?: MessageKey;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  primaryCtaKey?: MessageKey;
  secondaryCtaKey?: MessageKey;
};
