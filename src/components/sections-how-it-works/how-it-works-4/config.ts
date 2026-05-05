import type { HowItWorksBlock } from "./schema";

export const howItWorks4Key = "how-it-works-4" as const;
export const howItWorks4Namespace = "blocks.how-it-works-4" as const;

export const howItWorks4Sample: Omit<HowItWorksBlock, "id"> = {
  type: "how-it-works-4",
  eyebrowKey: "blocks.how-it-works-4.eyebrow",
  headerTitleKey: "blocks.how-it-works-4.headerTitle",
  headerBodyKey: "blocks.how-it-works-4.headerBody",
  steps: [
    {
      illustration: "documentCsv",
      numberKey: "blocks.how-it-works-4.steps.step1.number",
      titleKey: "blocks.how-it-works-4.steps.step1.title",
      bodyKey: "blocks.how-it-works-4.steps.step1.body",
    },
    {
      illustration: "currency",
      numberKey: "blocks.how-it-works-4.steps.step2.number",
      titleKey: "blocks.how-it-works-4.steps.step2.title",
      bodyKey: "blocks.how-it-works-4.steps.step2.body",
    },
    {
      illustration: "documentPair",
      numberKey: "blocks.how-it-works-4.steps.step3.number",
      titleKey: "blocks.how-it-works-4.steps.step3.title",
      bodyKey: "blocks.how-it-works-4.steps.step3.body",
    },
  ],
  ctaLabelKey: "blocks.how-it-works-4.ctaLabel",
  ctaHref: "/signup",
};
