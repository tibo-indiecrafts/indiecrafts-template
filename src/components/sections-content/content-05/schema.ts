import type { MessageKey } from "@/types/messages";
import type {
  ContentInlineFeature,
  ContentInlineFeatureIcon,
} from "@/components/sections-content/content-02/schema";

export type { ContentInlineFeature, ContentInlineFeatureIcon };

export type ContentBlock = {
  type: "content-05";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  imageUrl: string;
  imageAltKey?: MessageKey;
  features: readonly ContentInlineFeature[];
};
