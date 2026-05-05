import type { MessageKey } from "@/types/messages";
import type {
  ContentInlineFeature,
  ContentInlineFeatureIcon,
} from "@/components/sections-content/content-02/schema";

export type { ContentInlineFeature, ContentInlineFeatureIcon };

/**
 * Tailark `features-7` — 3D-tilted layered image variant of features-6.
 * Same content shape, different perspective/skew treatment.
 */
export type FeaturesBlock = {
  type: "features-07";
  id: string;
  titleKey?: MessageKey;
  bodyKey?: MessageKey;
  upperImageUrl: string;
  backImageLightUrl: string;
  backImageDarkUrl?: string;
  imageAltKey?: MessageKey;
  features: readonly ContentInlineFeature[];
};
