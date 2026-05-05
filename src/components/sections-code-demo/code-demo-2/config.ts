import type { CodeDemoBlock } from "./schema";

export const codeDemo2Key = "code-demo-2" as const;
export const codeDemo2Namespace = "blocks.code-demo-2" as const;

export const codeDemo2Sample: Omit<CodeDemoBlock, "id"> = {
  type: "code-demo-2",
};
