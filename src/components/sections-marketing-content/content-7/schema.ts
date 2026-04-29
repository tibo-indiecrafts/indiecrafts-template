import type { MessageKey } from "@/types/messages";
import type {
  ContentInlineFeature,
  ContentInlineFeatureIcon,
} from "@/components/sections-marketing-content/content-2/schema";

export type { ContentInlineFeature, ContentInlineFeatureIcon };

/**
 * Tailark `content-7` — variant of content-2 with a landscape image
 * (aspect-67/34) sitting inline next to the copy instead of floating.
 */
export type Content7Block = {
  type: "content-7";
  id: string;
  titleKey: MessageKey;
  leadingKey: MessageKey;
  supportingKey: MessageKey;
  features: readonly [ContentInlineFeature, ContentInlineFeature];
  imageLightUrl: string;
  imageDarkUrl?: string;
  imageAltKey: MessageKey;
};
