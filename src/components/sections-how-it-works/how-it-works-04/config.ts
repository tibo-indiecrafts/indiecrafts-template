import type { HowItWorksBlock } from "./schema";

export const howItWorks04Key = "how-it-works-04" as const;
export const howItWorks04Namespace = "blocks.how-it-works-04" as const;

export const howItWorks04Sample: Omit<HowItWorksBlock, "id"> = {
  type: "how-it-works-04",
  eyebrowKey: "blocks.how-it-works-04.eyebrow",
  headerTitleKey: "blocks.how-it-works-04.headerTitle",
  headerBodyKey: "blocks.how-it-works-04.headerBody",
  steps: [
    {
      illustration: "documentCsv",
      numberKey: "blocks.how-it-works-04.steps.step1.number",
      titleKey: "blocks.how-it-works-04.steps.step1.title",
      bodyKey: "blocks.how-it-works-04.steps.step1.body",
    },
    {
      illustration: "currency",
      numberKey: "blocks.how-it-works-04.steps.step2.number",
      titleKey: "blocks.how-it-works-04.steps.step2.title",
      bodyKey: "blocks.how-it-works-04.steps.step2.body",
    },
    {
      illustration: "documentPair",
      numberKey: "blocks.how-it-works-04.steps.step3.number",
      titleKey: "blocks.how-it-works-04.steps.step3.title",
      bodyKey: "blocks.how-it-works-04.steps.step3.body",
    },
  ],
  ctaLabelKey: "blocks.how-it-works-04.ctaLabel",
  ctaHref: "/signup",
};
