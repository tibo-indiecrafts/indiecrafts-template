import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable2Key = "features-expandable-2" as const;
export const featuresExpandable2Namespace = "blocks.features-expandable-2" as const;

export const featuresExpandable2Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-2",
  titleKey: "blocks.features-expandable-2.title",
  items: [
    {
      illustration: "modelsCredits",
      illustrationClassName: "scale-80",
      cardClassName: "h-96",
      bgImageUrl:
        "https://images.unsplash.com/photo-1684093024920-9d88aaa34a90?q=80&w=3030&auto=format&fit=crop",
      ariaLabelKey: "blocks.features-expandable-2.items.tab1.ariaLabel",
      titleKey: "blocks.features-expandable-2.items.tab1.title",
      bodyKey: "blocks.features-expandable-2.items.tab1.body",
    },
    {
      illustration: "map",
      // No `cardClassName` — card sizes to the map's intrinsic SVG.
      illustrationClassName: "pt-8",
      bgImageUrl:
        "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/c3_fzqepj.png",
      ariaLabelKey: "blocks.features-expandable-2.items.tab2.ariaLabel",
      titleKey: "blocks.features-expandable-2.items.tab2.title",
      bodyKey: "blocks.features-expandable-2.items.tab2.body",
    },
  ],
};
