import type { MessageKey } from "@/types/messages";

export type NewsletterBlock = {
  type: "newsletter-01";
  id: string;
  eyebrowKey?: MessageKey;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  emailPlaceholderKey?: MessageKey;
  submitLabelKey?: MessageKey;
  privacyNoteKey?: MessageKey;
  errorKey?: MessageKey;
};
