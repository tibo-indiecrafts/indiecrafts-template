import type { MessageKey } from "@/types/messages";

export type HowItWorksIllustration = "chart" | "ganttChart" | "layout";

export type StatItem = {
  valueKey: MessageKey;
  labelKey: MessageKey;
};

export type Testimonial = {
  quoteKey: MessageKey;
  authorNameKey: MessageKey;
  authorHandleKey: MessageKey;
  authorAvatarUrl: string;
};

export type SupportiveContent =
  | { kind: "stats"; stats: readonly StatItem[] }
  | { kind: "testimonial"; testimonial: Testimonial }
  | { kind: "none" };

export type HowItWorksStep = {
  illustration: HowItWorksIllustration;

  numberKey: MessageKey;
  titleKey: MessageKey;
  bodyKey: MessageKey;

  supportive?: SupportiveContent;
};

export type HowItWorksBlock = {
  type: "how-it-works-02";
  id: string;

  headerTitleKey: MessageKey;
  headerBodyKey: MessageKey;
  steps: readonly [HowItWorksStep, HowItWorksStep, HowItWorksStep];
};
