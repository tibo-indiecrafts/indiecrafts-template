import type { CodeDemoBlock } from "./schema";

export const codeDemo1Key = "code-demo-1" as const;
export const codeDemo1Namespace = "blocks.code-demo-1" as const;

export const codeDemo1Sample: Omit<CodeDemoBlock, "id"> = {
  type: "code-demo-1",
};
