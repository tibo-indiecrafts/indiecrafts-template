import type { MessageKey } from "@/types/messages";

export type HowItWorksIllustration = "payment" | "invoiceSigning" | "invoiceCard";

export type HowItWorksStep = {
  illustration: HowItWorksIllustration;

  numberKey: MessageKey;
  titleKey: MessageKey;

  bodyKey: MessageKey;
};

export type HowItWorksBlock = {
  type: "how-it-works-01";
  id: string;
  steps: readonly [HowItWorksStep, HowItWorksStep, HowItWorksStep];
};
