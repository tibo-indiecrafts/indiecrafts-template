import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/form-layout-05` — design-workspace creation
 * form: organization + workspace name + region + plan-card RadioGroup,
 * with a side panel highlighting plan benefits. All copy resolves
 * through `blocks.form-layout-05.*`.
 *
 * Plan + highlight copy is keyed by id/index against the section's
 * en.json (`plans.<id>.title`, `plans.<id>.features` array, `highlights`
 * array). Add a plan = `{ id, href }` here + a matching `plans.<id>`
 * entry in en.json.
 */
export type FormLayoutPlan = {
  /** Stable identifier — also the radio value and the namespace key. */
  id: string;
  /** External href for the per-plan "Learn more" link. */
  href: string;
  isRecommended?: boolean;
};

export type FormLayoutBlock = {
  type: "form-layout-05";
  id: string;
  titleKey?: MessageKey;
  /** Side-card heading + body. */
  sideTitleKey?: MessageKey;
  sideBodyKey?: MessageKey;
  sideHref?: string;
  plans?: FormLayoutPlan[];
};
