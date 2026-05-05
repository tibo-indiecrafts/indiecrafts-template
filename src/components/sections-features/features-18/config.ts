import type { FeaturesBlock } from "./schema";

export const features18Key = "features-18" as const;
export const features18Namespace = "blocks.features-18" as const;

export const features18Sample: Omit<FeaturesBlock, "id"> = {
  type: "features-18",
  titleKey: "blocks.features-18.title",
  bodyKey: "blocks.features-18.body",
  ideListLabelKey: "blocks.features-18.ideListLabel",
  ides: ["intellij", "vsCode", "windsurf"],
};
