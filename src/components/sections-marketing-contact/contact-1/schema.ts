import type { MessageKey } from "@/types/messages";

export type ContactChannel = {
  titleKey: MessageKey;
  email: string;
  /** Optional phone display — locale-agnostic, lives in config. */
  phone?: string;
};

export type ContactSelectOption = {
  value: string;
  labelKey: MessageKey;
};

export type Contact1Block = {
  type: "contact-1";
  id: string;
  titleKey: MessageKey;
  /** 1-2 contact channels displayed in the top panels. */
  channels: ContactChannel[];
  formTitleKey: MessageKey;
  formIntroKey: MessageKey;
  nameLabelKey: MessageKey;
  emailLabelKey: MessageKey;
  countryLabelKey: MessageKey;
  countryPlaceholderKey: MessageKey;
  countries: ContactSelectOption[];
  websiteLabelKey: MessageKey;
  jobLabelKey: MessageKey;
  jobPlaceholderKey: MessageKey;
  jobs: ContactSelectOption[];
  messageLabelKey: MessageKey;
  submitKey: MessageKey;
};

/**
 * `ContactBlock` kept as an alias for the registry's consumer-side name.
 * The registry exports `ContactBlock` — we avoid a breaking rename.
 */
export type ContactBlock = Contact1Block;
