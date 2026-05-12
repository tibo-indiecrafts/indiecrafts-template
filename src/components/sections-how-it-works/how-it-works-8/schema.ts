import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `dark-landing-one` HowItWorks — JSX held verbatim
 * against upstream (background image stripped per design choice).
 * Eyebrow + 2-col heading/body intro + 3-column subgrid of
 * numbered steps (each: tilted illustration with colored glow,
 * heading, rich body).
 */
export type HowItWorksStep = {
  titleKey: MessageKey;
  bodyKey: MessageKey;
};

export type HowItWorksBlock = {
  type: "how-it-works-8";
  id: string;
  eyebrowKey: MessageKey;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  steps: readonly [HowItWorksStep, HowItWorksStep, HowItWorksStep];
};
