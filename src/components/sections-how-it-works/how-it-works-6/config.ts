import type { HowItWorksBlock } from "./schema";

export const howItWorks6Key = "how-it-works-6" as const;
export const howItWorks6Namespace = "blocks.how-it-works-6" as const;

export const howItWorks6Sample: Omit<HowItWorksBlock, "id"> = {
  type: "how-it-works-6",
  headerTitleKey: "blocks.how-it-works-6.headerTitle",
  headerBodyKey: "blocks.how-it-works-6.headerBody",
  steps: [
    {
      illustration: "documentBoxed",
      titleKey: "blocks.how-it-works-6.steps.step1.title",
      bodyKey: "blocks.how-it-works-6.steps.step1.body",
    },
    {
      illustration: "idCheck",
      titleKey: "blocks.how-it-works-6.steps.step2.title",
      bodyKey: "blocks.how-it-works-6.steps.step2.body",
    },
    {
      illustration: "actionable",
      titleKey: "blocks.how-it-works-6.steps.step3.title",
      bodyKey: "blocks.how-it-works-6.steps.step3.body",
    },
  ],
  ctaLabelKey: "blocks.how-it-works-6.ctaLabel",
  ctaHref: "/signup",
};
