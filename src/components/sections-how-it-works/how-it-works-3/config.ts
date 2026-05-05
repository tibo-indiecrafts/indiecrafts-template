import type { HowItWorksBlock } from "./schema";

export const howItWorks3Key = "how-it-works-3" as const;
export const howItWorks3Namespace = "blocks.how-it-works-3" as const;

export const howItWorks3Sample: Omit<HowItWorksBlock, "id"> = {
  type: "how-it-works-3",
  headerTitleKey: "blocks.how-it-works-3.headerTitle",
  headerBodyKey: "blocks.how-it-works-3.headerBody",
  steps: [
    {
      illustration: "monitoringBarchart",
      numberKey: "blocks.how-it-works-3.steps.step1.number",
      titleKey: "blocks.how-it-works-3.steps.step1.title",
      bodyKey: "blocks.how-it-works-3.steps.step1.body",
    },
    {
      illustration: "scan",
      numberKey: "blocks.how-it-works-3.steps.step2.number",
      titleKey: "blocks.how-it-works-3.steps.step2.title",
      bodyKey: "blocks.how-it-works-3.steps.step2.body",
    },
    {
      illustration: "codeWindow",
      numberKey: "blocks.how-it-works-3.steps.step3.number",
      titleKey: "blocks.how-it-works-3.steps.step3.title",
      bodyKey: "blocks.how-it-works-3.steps.step3.body",
      testimonial: {
        quoteKey: "blocks.how-it-works-3.steps.step3.testimonialQuote",
        authorNameKey: "blocks.how-it-works-3.steps.step3.testimonialAuthorName",
        authorHandleKey: "blocks.how-it-works-3.steps.step3.testimonialAuthorHandle",
        authorAvatarUrl: "https://avatars.githubusercontent.com/u/99137927?v=4",
      },
    },
  ],
};
