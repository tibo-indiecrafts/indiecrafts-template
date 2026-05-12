import type { MessageKey } from "@/types/messages";

export type DialogBlock = {
  type: "dialog-09";
  id: string;
  defaultOpen?: boolean;

  shareUrl?: string;

  previewHref?: string;
  triggerKey?: MessageKey;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  commentsLabelKey?: MessageKey;
  shareLinkLabelKey?: MessageKey;
  copyLinkKey?: MessageKey;
  previewKey?: MessageKey;
};
