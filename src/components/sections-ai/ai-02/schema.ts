export type AiPrompt = {
  id: string;

  icon: "IconFileSpark" | "IconGauge" | "IconAlertTriangle";
};

export type AiModel = {
  value: string;

  max?: boolean;
};

export type AiBlock = {
  type: "ai-02";
  id: string;

  prompts?: AiPrompt[];

  models?: AiModel[];
};
