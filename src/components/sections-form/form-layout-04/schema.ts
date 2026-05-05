import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/form-layout-04` — early-access application
 * form: name + email + company + size select + workspace package
 * RadioGroup (cards) + footnote disclaimers. All copy resolves
 * through `blocks.form-layout-04.*`.
 *
 * Plan copy is keyed by `id` against `plans.<id>` in en.json, so a
 * new plan = `{ id: "x" }` + a matching `plans.x` entry. Keeps the
 * schema simple and avoids per-plan MessageKey typing.
 */
export type FormLayoutPlan = {
  /** Stable identifier — also the radio value and the namespace key. */
  id: string;
};

export type FormLayoutBlock = {
  type: "form-layout-04";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  /** Override the package list. Defaults to `formLayout04Plans`. */
  plans?: FormLayoutPlan[];
};
