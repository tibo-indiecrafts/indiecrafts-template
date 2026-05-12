import type { HowItWorksBlock } from "./schema";

export const howItWorks08Key = "how-it-works-08" as const;
export const howItWorks08Namespace = "blocks.how-it-works-08" as const;

export const howItWorks08Sample: Omit<HowItWorksBlock, "id"> = {
  type: "how-it-works-08",
  eyebrowKey: "blocks.how-it-works-08.eyebrow",
  titleKey: "blocks.how-it-works-08.title",
  bodyKey: "blocks.how-it-works-08.body",
  steps: [
    {
      titleKey: "blocks.how-it-works-08.steps.step1.title",
      bodyKey: "blocks.how-it-works-08.steps.step1.body",
    },
    {
      titleKey: "blocks.how-it-works-08.steps.step2.title",
      bodyKey: "blocks.how-it-works-08.steps.step2.body",
    },
    {
      titleKey: "blocks.how-it-works-08.steps.step3.title",
      bodyKey: "blocks.how-it-works-08.steps.step3.body",
    },
  ],
};
