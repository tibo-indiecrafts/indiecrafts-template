import type { HowItWorksBlock } from "./schema";

export const howItWorks02Key = "how-it-works-02" as const;
export const howItWorks02Namespace = "blocks.how-it-works-02" as const;

export const howItWorks02Sample: Omit<HowItWorksBlock, "id"> = {
  type: "how-it-works-02",
  headerTitleKey: "blocks.how-it-works-02.headerTitle",
  headerBodyKey: "blocks.how-it-works-02.headerBody",
  steps: [
    {
      illustration: "chart",
      numberKey: "blocks.how-it-works-02.steps.step1.number",
      titleKey: "blocks.how-it-works-02.steps.step1.title",
      bodyKey: "blocks.how-it-works-02.steps.step1.body",
      supportive: {
        kind: "stats",
        stats: [
          {
            valueKey: "blocks.how-it-works-02.steps.step1.stat1Value",
            labelKey: "blocks.how-it-works-02.steps.step1.stat1Label",
          },
          {
            valueKey: "blocks.how-it-works-02.steps.step1.stat2Value",
            labelKey: "blocks.how-it-works-02.steps.step1.stat2Label",
          },
        ],
      },
    },
    {
      illustration: "ganttChart",
      numberKey: "blocks.how-it-works-02.steps.step2.number",
      titleKey: "blocks.how-it-works-02.steps.step2.title",
      bodyKey: "blocks.how-it-works-02.steps.step2.body",
      supportive: {
        kind: "testimonial",
        testimonial: {
          quoteKey: "blocks.how-it-works-02.steps.step2.testimonialQuote",
          authorNameKey: "blocks.how-it-works-02.steps.step2.testimonialAuthorName",
          authorHandleKey: "blocks.how-it-works-02.steps.step2.testimonialAuthorHandle",
          authorAvatarUrl: "https://avatars.githubusercontent.com/u/99137927?v=4",
        },
      },
    },
    {
      illustration: "layout",
      numberKey: "blocks.how-it-works-02.steps.step3.number",
      titleKey: "blocks.how-it-works-02.steps.step3.title",
      bodyKey: "blocks.how-it-works-02.steps.step3.body",
      supportive: { kind: "none" },
    },
  ],
};
