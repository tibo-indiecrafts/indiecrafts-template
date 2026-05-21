import type { HowItWorksBlock } from "./schema";

export const howItWorks05Key = "how-it-works-05" as const;
export const howItWorks05Namespace = "blocks.how-it-works-05" as const;

export const howItWorks05Sample: Omit<HowItWorksBlock, "id"> = {
  type: "how-it-works-05",
  eyebrowKey: "blocks.how-it-works-05.eyebrow",
  headerTitleKey: "blocks.how-it-works-05.headerTitle",
  headerBodyKey: "blocks.how-it-works-05.headerBody",
  steps: [
    {
      illustration: "documentCsv",
      numberKey: "blocks.how-it-works-05.steps.step1.number",
      titleKey: "blocks.how-it-works-05.steps.step1.title",
      bodyKey: "blocks.how-it-works-05.steps.step1.body",
    },
    {
      illustration: "currency",
      numberKey: "blocks.how-it-works-05.steps.step2.number",
      titleKey: "blocks.how-it-works-05.steps.step2.title",
      bodyKey: "blocks.how-it-works-05.steps.step2.body",
    },
    {
      illustration: "documentPair",
      numberKey: "blocks.how-it-works-05.steps.step3.number",
      titleKey: "blocks.how-it-works-05.steps.step3.title",
      bodyKey: "blocks.how-it-works-05.steps.step3.body",
    },
  ],
  ctaLabelKey: "blocks.how-it-works-05.ctaLabel",
  ctaHref: "/",
};
