import type { CodeDemoBlock } from "./schema";

export const codeDemo3Key = "code-demo-3" as const;
export const codeDemo3Namespace = "blocks.code-demo-3" as const;

export const codeDemo3Sample: Omit<CodeDemoBlock, "id"> = {
  type: "code-demo-3",
};
