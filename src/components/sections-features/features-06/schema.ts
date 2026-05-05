import type { MessageKey } from "@/types/messages";
import type {
  ContentInlineFeature,
  ContentInlineFeatureIcon,
} from "@/components/sections-content/content-02/schema";

export type { ContentInlineFeature, ContentInlineFeatureIcon };

/**
 * Tailark `features-6` — layered product image (upper overlay + back) with
 * a 4-column feature grid beneath it.
 *
 * The image is a 3-layer stack: upper overlay card + back image (light and
 * dark variants). The upper layer is constant across themes; the back swaps.
 */
export type FeaturesBlock = {
  type: "features-06";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  upperImageUrl: string;
  backImageLightUrl: string;
  backImageDarkUrl?: string;
  imageAltKey?: MessageKey;
  features: readonly ContentInlineFeature[];
};
