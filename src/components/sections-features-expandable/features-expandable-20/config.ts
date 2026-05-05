import type { FeaturesExpandableBlock } from "./schema";

export const featuresExpandable20Key = "features-expandable-20" as const;
export const featuresExpandable20Namespace = "blocks.features-expandable-20" as const;

export const featuresExpandable20Sample: Omit<FeaturesExpandableBlock, "id"> = {
  type: "features-expandable-20",
  titleKey: "blocks.features-expandable-20.title",
  bodyKey: "blocks.features-expandable-20.body",
  items: [
    {
      illustration: "email",
      iconKey: "lassoSelect",
      titleKey: "blocks.features-expandable-20.items.tab1.title",
      bodyKey: "blocks.features-expandable-20.items.tab1.body",
      ariaSlug: "smart-email-composition",
    },
    {
      illustration: "kanbanTasks",
      iconKey: "brain",
      titleKey: "blocks.features-expandable-20.items.tab2.title",
      bodyKey: "blocks.features-expandable-20.items.tab2.body",
      ariaSlug: "visual-task-management",
    },
  ],
};
