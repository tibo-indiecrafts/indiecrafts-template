import type { MessageKey } from "@/types/messages";

export type DialogBlock = {
  type: "dialog-12";
  id: string;
  defaultOpen?: boolean;

  maxFileSize?: number;

  defaultAuthorName?: string;

  defaultTitle?: string;
  triggerKey?: MessageKey;
  titleKey?: MessageKey;
  uploadHeadingKey?: MessageKey;
  uploadHelpKey?: MessageKey;
  uploadCtaKey?: MessageKey;
  authorLabelKey?: MessageKey;
  titleLabelKey?: MessageKey;
  cancelKey?: MessageKey;
  submitKey?: MessageKey;
};
