import type { HowItWorksBlock } from "./schema";

export const howItWorks01Key = "how-it-works-01" as const;
export const howItWorks01Namespace = "blocks.how-it-works-01" as const;

export const howItWorks01Sample: Omit<HowItWorksBlock, "id"> = {
  type: "how-it-works-01",
  steps: [
    {
      illustration: "payment",
      numberKey: "blocks.how-it-works-01.steps.step1.number",
      titleKey: "blocks.how-it-works-01.steps.step1.title",
      bodyKey: "blocks.how-it-works-01.steps.step1.body",
    },
    {
      illustration: "invoiceSigning",
      numberKey: "blocks.how-it-works-01.steps.step2.number",
      titleKey: "blocks.how-it-works-01.steps.step2.title",
      bodyKey: "blocks.how-it-works-01.steps.step2.body",
    },
    {
      illustration: "invoiceCard",
      numberKey: "blocks.how-it-works-01.steps.step3.number",
      titleKey: "blocks.how-it-works-01.steps.step3.title",
      bodyKey: "blocks.how-it-works-01.steps.step3.body",
    },
  ],
};
