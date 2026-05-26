import type { MessageKey } from "@/types/messages";

export type ContactNetlifyBlock = {
  type: "contact-netlify-01";
  id: string;
  eyebrowKey?: MessageKey;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  nameLabelKey?: MessageKey;
  namePlaceholderKey?: MessageKey;
  emailLabelKey?: MessageKey;
  emailPlaceholderKey?: MessageKey;
  messageLabelKey?: MessageKey;
  messagePlaceholderKey?: MessageKey;
  submitLabelKey?: MessageKey;
  successKey?: MessageKey;
  errorKey?: MessageKey;
  privacyNoteKey?: MessageKey;
};
