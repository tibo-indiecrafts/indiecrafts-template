import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable1Key = "features-expandable-1" as const;
export const featuresExpandable1Namespace = "blocks.features-expandable-1" as const;

export const featuresExpandable1Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-1",
  titleKey: "blocks.features-expandable-1.title",
  items: [
    {
      illustration: "modelsCredits",
      illustrationClassName: "scale-80",
      cardClassName: "h-96",
      bgImageUrl:
        "https://images.unsplash.com/photo-1684093024920-9d88aaa34a90?q=80&w=3030&auto=format&fit=crop",
      ariaLabelKey: "blocks.features-expandable-1.items.tab1.ariaLabel",
      titleKey: "blocks.features-expandable-1.items.tab1.title",
      bodyKey: "blocks.features-expandable-1.items.tab1.body",
    },
    {
      illustration: "map",
      // No `cardClassName` — the card sizes to the map's intrinsic SVG
      // dimensions so the avatar pins anchor to the actual map area.
      // Pattern from `@tailark-pro/expandable-features-2`.
      illustrationClassName: "pt-8",
      bgImageUrl:
        "https://raw.githubusercontent.com/tailark/assets/refs/heads/main/c3_fzqepj.png",
      ariaLabelKey: "blocks.features-expandable-1.items.tab2.ariaLabel",
      titleKey: "blocks.features-expandable-1.items.tab2.title",
      bodyKey: "blocks.features-expandable-1.items.tab2.body",
    },
  ],
};
