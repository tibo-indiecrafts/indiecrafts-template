import type { MessageKey } from "@/types/messages";

export type ContactChannel = {
  titleKey: MessageKey;
  email: string;

  phone?: string;
};

export type ContactSelectOption = {
  value: string;
  labelKey: MessageKey;
};

export type Contact01Block = {
  type: "contact-01";
  id: string;
  titleKey?: MessageKey;

  channels: ContactChannel[];
  formTitleKey?: MessageKey;
  formIntroKey?: MessageKey;
  nameLabelKey?: MessageKey;
  emailLabelKey?: MessageKey;
  countryLabelKey?: MessageKey;
  countryPlaceholderKey?: MessageKey;
  countries: ContactSelectOption[];
  websiteLabelKey?: MessageKey;
  jobLabelKey?: MessageKey;
  jobPlaceholderKey?: MessageKey;
  jobs: ContactSelectOption[];
  messageLabelKey?: MessageKey;
  submitKey?: MessageKey;
};

export type ContactBlock = Contact01Block;
