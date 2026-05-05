import type { MessageKey } from "@/types/messages";
import type {
  ContentInlineFeature,
  ContentInlineFeatureIcon,
} from "@/components/sections-content/content-02/schema";

export type { ContentInlineFeature, ContentInlineFeatureIcon };

/**
 * Tailark `content-5` — centered headline/intro, wide image, then a
 * 4-column inline feature grid. Shares the feature schema with `content-2`.
 */
export type ContentBlock = {
  type: "content-05";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  imageUrl: string;
  imageAltKey?: MessageKey;
  features: readonly ContentInlineFeature[];
};
