import type { MessageKey } from "@/types/messages";

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
