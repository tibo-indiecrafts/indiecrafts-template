import type { MessageKey } from "@/types/messages";

export type ContentInlineFeatureIcon = "zap" | "cpu" | "lock" | "sparkles";

export type ContentInlineFeature = {
  iconKey: ContentInlineFeatureIcon;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

/**
 * Tailark `content-2` — 1-column heading then 2-column body: copy + inline
 * feature pair on the left, a floating image on the right at md+.
 */
export type ContentBlock = {
  type: "content-02";
  id: string;
  titleKey?: MessageKey;
  leadingKey?: MessageKey;
  supportingKey?: MessageKey;
  features: readonly [ContentInlineFeature, ContentInlineFeature];
  imageLightUrl: string;
  imageDarkUrl?: string;
  imageAltKey?: MessageKey;
};
