import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable03Key = "features-expandable-03" as const;
export const featuresExpandable03Namespace = "blocks.features-expandable-03" as const;

export const featuresExpandable03Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-03",
  titleKey: "blocks.features-expandable-03.title",
  items: [
    {
      illustration: "workflow",
      bgImageUrl:
        "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/c1_sc01ut.png",
      ariaLabelKey: "blocks.features-expandable-03.items.tab1.ariaLabel",
      titleKey: "blocks.features-expandable-03.items.tab1.title",
      bodyKey: "blocks.features-expandable-03.items.tab1.body",
    },
    {
      illustration: "map",
      bgImageUrl:
        "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/c3_fzqepj.png",
      ariaLabelKey: "blocks.features-expandable-03.items.tab2.ariaLabel",
      titleKey: "blocks.features-expandable-03.items.tab2.title",
      bodyKey: "blocks.features-expandable-03.items.tab2.body",
    },
    {
      illustration: "modelsCredits",
      illustrationClassName: "scale-90",
      bgImageUrl:
        "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/c4_rg6vjt.png",
      ariaLabelKey: "blocks.features-expandable-03.items.tab3.ariaLabel",
      titleKey: "blocks.features-expandable-03.items.tab3.title",
      bodyKey: "blocks.features-expandable-03.items.tab3.body",
    },
  ],
};
