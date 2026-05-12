import type { MessageKey } from "@/types/messages";

export type CallToActionBlock = {
  type: "cta-01";
  id: string;
  titleKey: MessageKey;
  bodyKey?: MessageKey;
  emailPlaceholderKey?: MessageKey;
  submitLabelKey?: MessageKey;
};
