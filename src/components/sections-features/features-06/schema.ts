import type { MessageKey } from "@/types/messages";
import type {
  ContentInlineFeature,
  ContentInlineFeatureIcon,
} from "@/components/sections-content/content-02/schema";

export type { ContentInlineFeature, ContentInlineFeatureIcon };

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
