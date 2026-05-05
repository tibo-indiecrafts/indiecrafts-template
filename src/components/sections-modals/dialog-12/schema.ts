import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/dialog-12` — add-writer modal: avatar upload
 * panel + author / title fields + cancel / save footer. All copy
 * resolves through `blocks.dialog-12.*`.
 */
export type DialogBlock = {
  type: "dialog-12";
  id: string;
  defaultOpen?: boolean;
  /** Maximum upload size in bytes; defaults to 1 MiB. */
  maxFileSize?: number;
  /** Initial author-name value. */
  defaultAuthorName?: string;
  /** Initial title value. */
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
