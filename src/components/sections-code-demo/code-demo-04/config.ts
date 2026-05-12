import type { CodeDemoBlock } from "./schema";

export const codeDemo04Key = "code-demo-04" as const;
export const codeDemo04Namespace = "blocks.code-demo-04" as const;

export const codeDemo04Sample: Omit<CodeDemoBlock, "id"> = {
  type: "code-demo-04",
};
