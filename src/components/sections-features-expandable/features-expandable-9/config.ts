import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable9Key = "features-expandable-9" as const;
export const featuresExpandable9Namespace = "blocks.features-expandable-9" as const;

export const featuresExpandable9Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-9",
  titleKey: "blocks.features-expandable-9.title",
  bodyKey: "blocks.features-expandable-9.body",
  items: [
    {
      device: "server",
      titleKey: "blocks.features-expandable-9.items.tab1.title",
      bodyKey: "blocks.features-expandable-9.items.tab1.body",
    },
    {
      device: "router",
      titleKey: "blocks.features-expandable-9.items.tab2.title",
      bodyKey: "blocks.features-expandable-9.items.tab2.body",
    },
    {
      device: "database",
      titleKey: "blocks.features-expandable-9.items.tab3.title",
      bodyKey: "blocks.features-expandable-9.items.tab3.body",
    },
    {
      device: "tab",
      titleKey: "blocks.features-expandable-9.items.tab4.title",
      bodyKey: "blocks.features-expandable-9.items.tab4.body",
    },
    {
      device: "mobile",
      titleKey: "blocks.features-expandable-9.items.tab5.title",
      bodyKey: "blocks.features-expandable-9.items.tab5.body",
    },
  ],
};
