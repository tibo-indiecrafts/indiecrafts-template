import type { FormLayoutBlock } from "./schema";

export const formLayout02Key = "form-layout-02" as const;
export const formLayout02Namespace = "blocks.form-layout-02" as const;

export const formLayout02Sample: Omit<FormLayoutBlock, "id"> = {
  type: "form-layout-02",
};
