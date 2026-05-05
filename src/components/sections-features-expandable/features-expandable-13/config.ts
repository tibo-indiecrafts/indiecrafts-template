import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable13Key = "features-expandable-13" as const;
export const featuresExpandable13Namespace = "blocks.features-expandable-13" as const;

export const featuresExpandable13Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-13",
  titleKey: "blocks.features-expandable-13.title",
  bodyKey: "blocks.features-expandable-13.body",
  items: [
    {
      illustration: "notesMeeting",
      bgImageUrl:
        "https://images.unsplash.com/photo-1664398557235-f2a18403f68a?q=80&w=2338&auto=format&fit=crop",
      tabLabelKey: "blocks.features-expandable-13.items.tab1.tabLabel",
      titleKey: "blocks.features-expandable-13.items.tab1.title",
      bodyKey: "blocks.features-expandable-13.items.tab1.body",
    },
    {
      illustration: "calendarMeeting",
      bgImageUrl:
        "https://images.unsplash.com/photo-1721111648084-5e4f18a8635c?q=80&w=2340&auto=format&fit=crop",
      tabLabelKey: "blocks.features-expandable-13.items.tab2.tabLabel",
      titleKey: "blocks.features-expandable-13.items.tab2.title",
      bodyKey: "blocks.features-expandable-13.items.tab2.body",
    },
    {
      illustration: "agentTaskPlanning",
      bgImageUrl:
        "https://images.unsplash.com/photo-1770106678115-ec9aa241cdf6?q=80&w=2342&auto=format&fit=crop",
      tabLabelKey: "blocks.features-expandable-13.items.tab3.tabLabel",
      titleKey: "blocks.features-expandable-13.items.tab3.title",
      bodyKey: "blocks.features-expandable-13.items.tab3.body",
    },
  ],
};
