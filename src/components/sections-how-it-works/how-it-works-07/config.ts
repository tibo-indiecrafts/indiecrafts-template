import type { HowItWorksBlock } from "./schema";

export const howItWorks07Key = "how-it-works-07" as const;
export const howItWorks07Namespace = "blocks.how-it-works-07" as const;

export const howItWorks07Sample: Omit<HowItWorksBlock, "id"> = {
  type: "how-it-works-07",
  headerTitleKey: "blocks.how-it-works-07.headerTitle",
  headerBodyKey: "blocks.how-it-works-07.headerBody",
  steps: [
    {
      illustration: "campaign",
      numberKey: "blocks.how-it-works-07.steps.step1.number",
      titleKey: "blocks.how-it-works-07.steps.step1.title",
      bodyKey: "blocks.how-it-works-07.steps.step1.body",
      verticalAlign: "end",
    },
    {
      illustration: "poll",
      numberKey: "blocks.how-it-works-07.steps.step2.number",
      titleKey: "blocks.how-it-works-07.steps.step2.title",
      bodyKey: "blocks.how-it-works-07.steps.step2.body",
      decoratedBackdrop: true,
    },
    {
      illustration: "memoryUsage",
      numberKey: "blocks.how-it-works-07.steps.step3.number",
      titleKey: "blocks.how-it-works-07.steps.step3.title",
      bodyKey: "blocks.how-it-works-07.steps.step3.body",
    },
  ],
};
