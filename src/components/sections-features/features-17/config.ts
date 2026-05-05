import type { FeaturesBlock } from "./schema";

export const features17Key = "features-17" as const;
export const features17Namespace = "blocks.features-17" as const;

export const features17Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-17",
  titleKey: "blocks.features-17.title",
  bodyKey: "blocks.features-17.body",
  bodyMutedKey: "blocks.features-17.bodyMuted",
};
