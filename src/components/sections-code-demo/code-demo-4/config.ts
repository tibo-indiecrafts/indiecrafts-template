import type { CodeDemoBlock } from "./schema";

export const codeDemo4Key = "code-demo-4" as const;
export const codeDemo4Namespace = "blocks.code-demo-4" as const;

export const codeDemo4Sample: Omit<CodeDemoBlock, "id"> = {
  type: "code-demo-4",
};
