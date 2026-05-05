import type { FormLayoutBlock } from "./schema";

export const formLayout03Key = "form-layout-03" as const;
export const formLayout03Namespace = "blocks.form-layout-03" as const;

export const formLayout03Sample: Omit<FormLayoutBlock, "id"> = {
  type: "form-layout-03",
};
