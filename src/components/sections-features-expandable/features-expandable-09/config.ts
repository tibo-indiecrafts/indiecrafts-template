import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable09Key = "features-expandable-09" as const;
export const featuresExpandable09Namespace = "blocks.features-expandable-09" as const;

export const featuresExpandable09Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-09",
  titleKey: "blocks.features-expandable-09.title",
  bodyKey: "blocks.features-expandable-09.body",
  items: [
    {
      device: "server",
      titleKey: "blocks.features-expandable-09.items.tab1.title",
      bodyKey: "blocks.features-expandable-09.items.tab1.body",
    },
    {
      device: "router",
      titleKey: "blocks.features-expandable-09.items.tab2.title",
      bodyKey: "blocks.features-expandable-09.items.tab2.body",
    },
    {
      device: "database",
      titleKey: "blocks.features-expandable-09.items.tab3.title",
      bodyKey: "blocks.features-expandable-09.items.tab3.body",
    },
    {
      device: "tab",
      titleKey: "blocks.features-expandable-09.items.tab4.title",
      bodyKey: "blocks.features-expandable-09.items.tab4.body",
    },
    {
      device: "mobile",
      titleKey: "blocks.features-expandable-09.items.tab5.title",
      bodyKey: "blocks.features-expandable-09.items.tab5.body",
    },
  ],
};
