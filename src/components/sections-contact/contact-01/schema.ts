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

/**
 * Section-level MessageKey props are all optional — they fall back to the
 * `blocks.contact-01.*` namespace when omitted. Item-array keys
 * (channels, countries, jobs) stay required full paths (data, not overrides).
 */
export type Contact01Block = {
  type: "contact-01";
  id: string;
  titleKey?: MessageKey;
  /** 1-2 contact channels displayed in the top panels. */
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

/**
 * `ContactBlock` kept as an alias for the registry's consumer-side name.
 * The registry exports `ContactBlock` — we avoid a breaking rename.
 */
export type ContactBlock = Contact01Block;
