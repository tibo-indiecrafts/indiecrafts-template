/**
 * Block — composer with attachments dropdown, auto-mode toggle, and a
 * trio of selector dropdowns (model / agent / performance). All
 * visible labels resolve through `blocks.ai-03.*`. Per-attachment,
 * per-model, per-agent, and per-performance copy is keyed by `id`
 * against `attachments.<id>.label`, `models.<id>.label`, etc.
 */
export type AiAttachmentItem = {
  id: string;
  icon: "IconPaperclip" | "IconCode" | "IconWorld" | "IconHistory";
};

export type AiModelItem = {
  id: string;
  icon: "IconDeviceLaptop" | "IconCloud";
};

export type AiAgentItem = {
  id: string;
  icon: "IconUser" | "IconRobot";
};

export type AiPerformanceItem = {
  id: string;
  icon: "IconCircle" | "IconProgress" | "IconCircleDashed";
};

export type AiBlock = {
  type: "ai-03";
  id: string;
  /** Override the attachment list. */
  attachments?: AiAttachmentItem[];
  /** Override the model list. First entry is the initial selection. */
  models?: AiModelItem[];
  /** Override the agent list. First entry is the initial selection. */
  agents?: AiAgentItem[];
  /** Override the performance list. First entry is the initial selection. */
  performances?: AiPerformanceItem[];
};
