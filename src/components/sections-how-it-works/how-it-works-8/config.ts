import type { HowItWorksBlock } from "./schema";

export const howItWorks8Key = "how-it-works-8" as const;
export const howItWorks8Namespace = "blocks.how-it-works-8" as const;

export const howItWorks8Sample: Omit<HowItWorksBlock, "id"> = {
  type: "how-it-works-8",
  eyebrowKey: "blocks.how-it-works-8.eyebrow",
  titleKey: "blocks.how-it-works-8.title",
  bodyKey: "blocks.how-it-works-8.body",
  steps: [
    {
      titleKey: "blocks.how-it-works-8.steps.step1.title",
      bodyKey: "blocks.how-it-works-8.steps.step1.body",
    },
    {
      titleKey: "blocks.how-it-works-8.steps.step2.title",
      bodyKey: "blocks.how-it-works-8.steps.step2.body",
    },
    {
      titleKey: "blocks.how-it-works-8.steps.step3.title",
      bodyKey: "blocks.how-it-works-8.steps.step3.body",
    },
  ],
};
