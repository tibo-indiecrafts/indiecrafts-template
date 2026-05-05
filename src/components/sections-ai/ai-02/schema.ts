/**
 * Block — composer with prompt suggestions and a model selector. All
 * visible labels resolve through `blocks.ai-02.*`. Per-prompt copy is
 * keyed by `id` against `prompts.<id>.{text,prompt}`; per-model copy
 * is keyed by `value` against `models.<value>.{name,description}`.
 */
export type AiPrompt = {
  /** Stable identifier — also the namespace key for translations. */
  id: string;
  /** Tabler icon name. */
  icon: "IconFileSpark" | "IconGauge" | "IconAlertTriangle";
};

export type AiModel = {
  /** Stable identifier — also the namespace key for translations. */
  value: string;
  /** Whether this model gets the "MAX" badge. */
  max?: boolean;
};

export type AiBlock = {
  type: "ai-02";
  id: string;
  /** Override the prompt suggestion list. */
  prompts?: AiPrompt[];
  /** Override the model list. */
  models?: AiModel[];
};
