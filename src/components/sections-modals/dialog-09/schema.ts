import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/dialog-09` — share & collaborate modal:
 * comments toggle, read-only share link with copy-to-clipboard, and
 * copy / preview action buttons. All copy resolves through
 * `blocks.dialog-09.*`.
 */
export type DialogBlock = {
  type: "dialog-09";
  id: string;
  defaultOpen?: boolean;
  /** Read-only share URL displayed in the input. */
  shareUrl?: string;
  /** External href for the "Preview" action; defaults to the share URL. */
  previewHref?: string;
  triggerKey?: MessageKey;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  commentsLabelKey?: MessageKey;
  shareLinkLabelKey?: MessageKey;
  copyLinkKey?: MessageKey;
  previewKey?: MessageKey;
};
