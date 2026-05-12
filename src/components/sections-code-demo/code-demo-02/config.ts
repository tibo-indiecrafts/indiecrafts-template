import type { CodeDemoBlock } from "./schema";

export const codeDemo02Key = "code-demo-02" as const;
export const codeDemo02Namespace = "blocks.code-demo-02" as const;

export const codeDemo02Sample: Omit<CodeDemoBlock, "id"> = {
  type: "code-demo-02",
};
