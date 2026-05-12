import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `bento-09` — fixed-shape 6-cell composition rendered as
 * a single rounded outline with internal `divide-x` / `divide-y`
 * separators instead of individual cards. Layout flows
 * `@2xl:grid-cols-2` then `@4xl:grid-cols-3`, giving a 3-up
 * desktop layout and 2-up tablet layout. Complex `:nth-child`
 * selectors at `@2xl` / `@4xl` toggle which cells get a right-border
 * and which lose the bottom-border so the dividers form a clean
 * grid at every breakpoint.
 *
 * Each cell renders illustration ABOVE title + body (`grid-rows-
 * [1fr_auto] *:p-8` from the parent). Every body supports inline
 * `<strong>` markup highlights via `t.rich(...)`.
 *
 * Six cells is structural — the `nth-child` rules hardcode positions
 * 2/3/4/5 and the layout balances at 2×3 or 3×2.
 */
export type BentoBlock = {
  type: "bento-09";
  id: string;
  identityCell: { titleKey: MessageKey; bodyKey: MessageKey };
  analyticsCell: { titleKey: MessageKey; bodyKey: MessageKey };
  resourcesCell: { titleKey: MessageKey; bodyKey: MessageKey };
  reliabilityCell: { titleKey: MessageKey; bodyKey: MessageKey };
  feedbackCell: { titleKey: MessageKey; bodyKey: MessageKey };
  communicationCell: { titleKey: MessageKey; bodyKey: MessageKey };
};
