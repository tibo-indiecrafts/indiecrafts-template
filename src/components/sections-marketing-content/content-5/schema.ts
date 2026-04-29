import type { MessageKey } from "@/types/messages";
import type {
  ContentInlineFeature,
  ContentInlineFeatureIcon,
} from "@/components/sections-marketing-content/content-2/schema";

export type { ContentInlineFeature, ContentInlineFeatureIcon };

/**
 * Tailark `content-5` — centered headline/intro, wide image, then a
 * 4-column inline feature grid. Shares the feature schema with `content-2`.
 */
export type Content5Block = {
  type: "content-5";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  imageUrl: string;
  imageAltKey: MessageKey;
  features: readonly ContentInlineFeature[];
};
