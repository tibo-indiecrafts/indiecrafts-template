import type { HowItWorksBlock } from "./schema";

export const howItWorks5Key = "how-it-works-5" as const;
export const howItWorks5Namespace = "blocks.how-it-works-5" as const;

export const howItWorks5Sample: Omit<HowItWorksBlock, "id"> = {
  type: "how-it-works-5",
  eyebrowKey: "blocks.how-it-works-5.eyebrow",
  headerTitleKey: "blocks.how-it-works-5.headerTitle",
  headerBodyKey: "blocks.how-it-works-5.headerBody",
  steps: [
    {
      illustration: "documentCsv",
      numberKey: "blocks.how-it-works-5.steps.step1.number",
      titleKey: "blocks.how-it-works-5.steps.step1.title",
      bodyKey: "blocks.how-it-works-5.steps.step1.body",
    },
    {
      illustration: "currency",
      numberKey: "blocks.how-it-works-5.steps.step2.number",
      titleKey: "blocks.how-it-works-5.steps.step2.title",
      bodyKey: "blocks.how-it-works-5.steps.step2.body",
    },
    {
      illustration: "documentPair",
      numberKey: "blocks.how-it-works-5.steps.step3.number",
      titleKey: "blocks.how-it-works-5.steps.step3.title",
      bodyKey: "blocks.how-it-works-5.steps.step3.body",
    },
  ],
  ctaLabelKey: "blocks.how-it-works-5.ctaLabel",
  ctaHref: "/signup",
};
