import type { MessageKey } from "@/types/messages";

export type HowItWorksIllustration = "monitoringBarchart" | "scan" | "codeWindow";

export type Testimonial = {
  quoteKey: MessageKey;
  authorNameKey: MessageKey;
  authorHandleKey: MessageKey;
  authorAvatarUrl: string;
};

export type HowItWorksStep = {
  illustration: HowItWorksIllustration;
  numberKey: MessageKey;
  titleKey: MessageKey;
  bodyKey: MessageKey;

  testimonial?: Testimonial;
};

export type HowItWorksBlock = {
  type: "how-it-works-03";
  id: string;
  headerTitleKey: MessageKey;
  headerBodyKey: MessageKey;
  steps: readonly [HowItWorksStep, HowItWorksStep, HowItWorksStep];
};
