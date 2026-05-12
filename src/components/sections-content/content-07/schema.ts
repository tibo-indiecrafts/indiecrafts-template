import type { MessageKey } from "@/types/messages";
import type {
  ContentInlineFeature,
  ContentInlineFeatureIcon,
} from "@/components/sections-content/content-02/schema";

export type { ContentInlineFeature, ContentInlineFeatureIcon };

export type ContentBlock = {
  type: "content-07";
  id: string;
  titleKey?: MessageKey;
  leadingKey?: MessageKey;
  supportingKey?: MessageKey;
  features: readonly [ContentInlineFeature, ContentInlineFeature];
  imageLightUrl: string;
  imageDarkUrl?: string;
  imageAltKey?: MessageKey;
};
