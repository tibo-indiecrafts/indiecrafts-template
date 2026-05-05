import type { FormLayoutBlock } from "./schema";

export const formLayout01Key = "form-layout-01" as const;
export const formLayout01Namespace = "blocks.form-layout-01" as const;

export const formLayout01Sample: Omit<FormLayoutBlock, "id"> = {
  type: "form-layout-01",
};
