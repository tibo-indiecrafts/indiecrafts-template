import type { AiBlock, AiModel, AiPrompt } from "./schema";

export const ai02Key = "ai-02" as const;
export const ai02Namespace = "blocks.ai-02" as const;

export const ai02Prompts: AiPrompt[] = [
  { id: "docs", icon: "IconFileSpark" },
  { id: "performance", icon: "IconGauge" },
  { id: "bugs", icon: "IconAlertTriangle" },
];

export const ai02Models: AiModel[] = [
  { value: "gpt-5", max: true },
  { value: "gpt-4o" },
  { value: "gpt-4" },
  { value: "claude-3-5" },
];

export const ai02Sample: Omit<AiBlock, "id"> = {
  type: "ai-02",
  prompts: ai02Prompts,
  models: ai02Models,
};
