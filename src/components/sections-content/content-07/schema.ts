import type { MessageKey } from "@/types/messages";
import type {
  ContentInlineFeature,
  ContentInlineFeatureIcon,
} from "@/components/sections-content/content-02/schema";

export type { ContentInlineFeature, ContentInlineFeatureIcon };

/**
 * Tailark `content-7` — variant of content-2 with a landscape image
 * (aspect-67/34) sitting inline next to the copy instead of floating.
 */
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
