import type { MessageKey } from "@/types/messages";

export type HowItWorksIllustration = "chart" | "ganttChart" | "layout";

export type StatItem = {
  /** Big bold number, e.g. "90+" or "56%". */
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
  /** Single-digit step number (used for the StepNumber pill on the rail). */
  numberKey: MessageKey;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  /** Optional supportive content slot (stats row, testimonial blockquote, or none). */
  supportive?: SupportiveContent;
};

/**
 * Tailark Pro `how-it-works-02` — vertical 3-step composition
 * connected by a decorative S-curve progress rail (`Line` / `LineNode`
 * connector glyphs render the curved transitions between steps).
 * Each step has a numbered pill on the rail and a title + body +
 * illustration on the right; some steps add supportive content
 * (stats row or testimonial) below the body.
 *
 * Three steps is structural — the `Line` connector logic hardcodes
 * positions for steps 1/2/3 and step 3 closes the rail.
 */
export type HowItWorksBlock = {
  type: "how-it-works-02";
  id: string;
  /** Section header above the steps. */
  headerTitleKey: MessageKey;
  headerBodyKey: MessageKey;
  steps: readonly [HowItWorksStep, HowItWorksStep, HowItWorksStep];
};
