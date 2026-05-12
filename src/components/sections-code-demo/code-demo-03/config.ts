import type { CodeDemoBlock } from "./schema";

export const codeDemo03Key = "code-demo-03" as const;
export const codeDemo03Namespace = "blocks.code-demo-03" as const;

export const codeDemo03Sample: Omit<CodeDemoBlock, "id"> = {
  type: "code-demo-03",
};
