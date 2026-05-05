import type { FormLayoutBlock, FormLayoutPlan } from "./schema";

export const formLayout04Key = "form-layout-04" as const;
export const formLayout04Namespace = "blocks.form-layout-04" as const;

export const formLayout04Plans: FormLayoutPlan[] = [
  { id: "starter" },
  { id: "premium" },
  { id: "enterprise" },
];

export const formLayout04Sample: Omit<FormLayoutBlock, "id"> = {
  type: "form-layout-04",
  plans: formLayout04Plans,
};
