import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable3Key = "features-expandable-3" as const;
export const featuresExpandable3Namespace = "blocks.features-expandable-3" as const;

export const featuresExpandable3Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-3",
  titleKey: "blocks.features-expandable-3.title",
  items: [
    {
      illustration: "workflow",
      bgImageUrl:
        "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/c1_sc01ut.png",
      ariaLabelKey: "blocks.features-expandable-3.items.tab1.ariaLabel",
      titleKey: "blocks.features-expandable-3.items.tab1.title",
      bodyKey: "blocks.features-expandable-3.items.tab1.body",
    },
    {
      illustration: "map",
      bgImageUrl:
        "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/c3_fzqepj.png",
      ariaLabelKey: "blocks.features-expandable-3.items.tab2.ariaLabel",
      titleKey: "blocks.features-expandable-3.items.tab2.title",
      bodyKey: "blocks.features-expandable-3.items.tab2.body",
    },
    {
      illustration: "modelsCredits",
      illustrationClassName: "scale-90",
      bgImageUrl:
        "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/c4_rg6vjt.png",
      ariaLabelKey: "blocks.features-expandable-3.items.tab3.ariaLabel",
      titleKey: "blocks.features-expandable-3.items.tab3.title",
      bodyKey: "blocks.features-expandable-3.items.tab3.body",
    },
  ],
};
