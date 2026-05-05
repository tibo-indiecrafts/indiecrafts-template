import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable22Key = "features-expandable-22" as const;
export const featuresExpandable22Namespace = "blocks.features-expandable-22" as const;

export const featuresExpandable22Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-22",
  headerTitleKey: "blocks.features-expandable-22.headerTitle",
  headerBodyKey: "blocks.features-expandable-22.headerBody",
  ctaLabelKey: "blocks.features-expandable-22.ctaLabel",
  ctaHref: "#",
  items: [
    {
      bgImageUrl:
        "https://images.unsplash.com/photo-1723869791623-3b6a012f996b?q=80&w=2340&auto=format&fit=crop",
      tabLabelKey: "blocks.features-expandable-22.items.tab1.tabLabel",
      titleKey: "blocks.features-expandable-22.items.tab1.title",
      bodyKey: "blocks.features-expandable-22.items.tab1.body",
    },
    {
      bgImageUrl:
        "https://images.unsplash.com/photo-1721111648084-5e4f18a8635c?q=80&w=2340&auto=format&fit=crop",
      tabLabelKey: "blocks.features-expandable-22.items.tab2.tabLabel",
      titleKey: "blocks.features-expandable-22.items.tab2.title",
      bodyKey: "blocks.features-expandable-22.items.tab2.body",
    },
    {
      bgImageUrl:
        "https://images.unsplash.com/photo-1770106678115-ec9aa241cdf6?q=80&w=2342&auto=format&fit=crop",
      tabLabelKey: "blocks.features-expandable-22.items.tab3.tabLabel",
      titleKey: "blocks.features-expandable-22.items.tab3.title",
      bodyKey: "blocks.features-expandable-22.items.tab3.body",
    },
  ],
};
