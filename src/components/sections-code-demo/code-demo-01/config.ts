import type { CodeDemoBlock } from "./schema";

export const codeDemo01Key = "code-demo-01" as const;
export const codeDemo01Namespace = "blocks.code-demo-01" as const;

export const codeDemo01Sample: Omit<CodeDemoBlock, "id"> = {
  type: "code-demo-01",
};
