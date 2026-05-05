import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `bento-8` — fixed-shape 6-card composition in a 3-col
 * × 2-row grid (`@4xl:grid-cols-3 @4xl:grid-rows-2`) with a special
 * left column that spans both rows and stacks two cards.
 *
 * ┌── ai-memory ──┬── campaign ──┬── chart ────┐
 * │               ├── message ───┼── models ───┤
 * ├ fingerprint ──┘
 * └───────────────┘
 *
 * Two cells (`smartHomeCell` and `marketingCell`) support inline
 * `<strong>...</strong>` markup in their body via `t.rich(...)` so
 * the translation file marks which fragment to highlight (rendered
 * as `text-foreground font-medium`).
 */
export type BentoBlock = {
  type: "bento-8";
  id: string;
  /** Top-left card: AI memory dashboard. Body supports inline `<strong>` markup. */
  smartHomeCell: { titleKey: MessageKey; bodyKey: MessageKey };
  /** Bottom-left card: fingerprint side-by-side. */
  biometricCell: { titleKey: MessageKey; bodyKey: MessageKey };
  /** Top-mid card: campaign illustration. Body supports inline `<strong>` markup. */
  marketingCell: { titleKey: MessageKey; bodyKey: MessageKey };
  /** Bottom-mid card: message-chat illustration. */
  messagingCell: { titleKey: MessageKey; bodyKey: MessageKey };
  /** Top-right card: chart illustration. */
  visualizationCell: { titleKey: MessageKey; bodyKey: MessageKey };
  /** Bottom-right card: models-row illustration. */
  feedbackCell: { titleKey: MessageKey; bodyKey: MessageKey };
};
