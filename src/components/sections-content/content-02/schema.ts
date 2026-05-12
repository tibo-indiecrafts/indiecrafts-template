import type { MessageKey } from "@/types/messages";

export type ContentInlineFeatureIcon = "zap" | "cpu" | "lock" | "sparkles";

export type ContentInlineFeature = {
  iconKey: ContentInlineFeatureIcon;
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

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
