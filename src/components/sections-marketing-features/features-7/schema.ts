import type { MessageKey } from "@/types/messages";
import type {
  ContentInlineFeature,
  ContentInlineFeatureIcon,
} from "@/components/sections-marketing-content/content-2/schema";

export type { ContentInlineFeature, ContentInlineFeatureIcon };

/**
 * Tailark `features-7` — 3D-tilted layered image variant of features-6.
 * Same content shape, different perspective/skew treatment.
 */
export type Features7Block = {
  type: "features-7";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  upperImageUrl: string;
  backImageLightUrl: string;
  backImageDarkUrl?: string;
  imageAltKey: MessageKey;
  features: readonly ContentInlineFeature[];
};
