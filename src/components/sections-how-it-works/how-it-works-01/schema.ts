import type { MessageKey } from "@/types/messages";

export type HowItWorksIllustration = "payment" | "invoiceSigning" | "invoiceCard";

export type HowItWorksStep = {
  illustration: HowItWorksIllustration;
  /** "1." / "2." / "3." — typically just the digit + period; no trailing space. */
  numberKey: MessageKey;
  titleKey: MessageKey;
  /** Body MAY contain inline `<strong>` markup (rendered as foreground/medium). */
  bodyKey: MessageKey;
};

export type HowItWorksBlock = {
  type: "how-it-works-01";
  id: string;
  steps: readonly [HowItWorksStep, HowItWorksStep, HowItWorksStep];
};
