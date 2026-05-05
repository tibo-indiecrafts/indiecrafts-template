import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable10Key = "features-expandable-10" as const;
export const featuresExpandable10Namespace = "blocks.features-expandable-10" as const;

export const featuresExpandable10Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-10",
  titleKey: "blocks.features-expandable-10.title",
  bodyKey: "blocks.features-expandable-10.body",
  items: [
    {
      titleKey: "blocks.features-expandable-10.items.tab1.title",
      bodyKey: "blocks.features-expandable-10.items.tab1.body",
    },
    {
      titleKey: "blocks.features-expandable-10.items.tab2.title",
      bodyKey: "blocks.features-expandable-10.items.tab2.body",
    },
    {
      titleKey: "blocks.features-expandable-10.items.tab3.title",
      bodyKey: "blocks.features-expandable-10.items.tab3.body",
    },
  ],
};
