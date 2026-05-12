import type { MessageKey } from "@/types/messages";

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
