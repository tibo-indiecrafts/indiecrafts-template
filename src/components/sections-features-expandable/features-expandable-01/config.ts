import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable01Key = "features-expandable-01" as const;
export const featuresExpandable01Namespace = "blocks.features-expandable-01" as const;

export const featuresExpandable01Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-01",
  titleKey: "blocks.features-expandable-01.title",
  items: [
    {
      illustration: "modelsCredits",
      illustrationClassName: "scale-80",
      cardClassName: "h-96",
      bgImageUrl:
        "https://images.unsplash.com/photo-1684093024920-9d88aaa34a90?q=80&w=3030&auto=format&fit=crop",
      ariaLabelKey: "blocks.features-expandable-01.items.tab1.ariaLabel",
      titleKey: "blocks.features-expandable-01.items.tab1.title",
      bodyKey: "blocks.features-expandable-01.items.tab1.body",
    },
    {
      illustration: "map",

      illustrationClassName: "pt-8",
      bgImageUrl:
        "https://raw.githubusercontent.com/acme/assets/refs/heads/main/c3_fzqepj.png",
      ariaLabelKey: "blocks.features-expandable-01.items.tab2.ariaLabel",
      titleKey: "blocks.features-expandable-01.items.tab2.title",
      bodyKey: "blocks.features-expandable-01.items.tab2.body",
    },
  ],
};
