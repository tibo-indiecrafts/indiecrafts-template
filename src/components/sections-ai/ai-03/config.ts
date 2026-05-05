import type {
  AiAgentItem,
  AiAttachmentItem,
  AiBlock,
  AiModelItem,
  AiPerformanceItem,
} from "./schema";

export const ai03Key = "ai-03" as const;
export const ai03Namespace = "blocks.ai-03" as const;

export const ai03Attachments: AiAttachmentItem[] = [
  { id: "files", icon: "IconPaperclip" },
  { id: "code", icon: "IconCode" },
  { id: "search", icon: "IconWorld" },
  { id: "history", icon: "IconHistory" },
];

export const ai03Models: AiModelItem[] = [
  { id: "local", icon: "IconDeviceLaptop" },
  { id: "cloud", icon: "IconCloud" },
];

export const ai03Agents: AiAgentItem[] = [
  { id: "agent", icon: "IconUser" },
  { id: "assistant", icon: "IconRobot" },
];

export const ai03Performances: AiPerformanceItem[] = [
  { id: "high", icon: "IconCircle" },
  { id: "medium", icon: "IconProgress" },
  { id: "low", icon: "IconCircleDashed" },
];

export const ai03Sample: Omit<AiBlock, "id"> = {
  type: "ai-03",
  attachments: ai03Attachments,
  models: ai03Models,
  agents: ai03Agents,
  performances: ai03Performances,
};
