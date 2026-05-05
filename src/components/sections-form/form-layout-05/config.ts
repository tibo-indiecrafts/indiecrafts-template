import type { FormLayoutBlock, FormLayoutPlan } from "./schema";

export const formLayout05Key = "form-layout-05" as const;
export const formLayout05Namespace = "blocks.form-layout-05" as const;

export const formLayout05Plans: FormLayoutPlan[] = [
  { id: "creator", href: "/pricing#creator" },
  { id: "team", href: "/pricing#team", isRecommended: true },
  { id: "agency", href: "/pricing#agency" },
];

export const formLayout05Sample: Omit<FormLayoutBlock, "id"> = {
  type: "form-layout-05",
  sideHref: "/pricing",
  plans: formLayout05Plans,
};
