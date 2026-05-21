import type { HowItWorksBlock } from "./schema";

export const howItWorks06Key = "how-it-works-06" as const;
export const howItWorks06Namespace = "blocks.how-it-works-06" as const;

export const howItWorks06Sample: Omit<HowItWorksBlock, "id"> = {
  type: "how-it-works-06",
  headerTitleKey: "blocks.how-it-works-06.headerTitle",
  headerBodyKey: "blocks.how-it-works-06.headerBody",
  steps: [
    {
      illustration: "documentBoxed",
      titleKey: "blocks.how-it-works-06.steps.step1.title",
      bodyKey: "blocks.how-it-works-06.steps.step1.body",
    },
    {
      illustration: "idCheck",
      titleKey: "blocks.how-it-works-06.steps.step2.title",
      bodyKey: "blocks.how-it-works-06.steps.step2.body",
    },
    {
      illustration: "actionable",
      titleKey: "blocks.how-it-works-06.steps.step3.title",
      bodyKey: "blocks.how-it-works-06.steps.step3.body",
    },
  ],
  ctaLabelKey: "blocks.how-it-works-06.ctaLabel",
  ctaHref: "/",
};
