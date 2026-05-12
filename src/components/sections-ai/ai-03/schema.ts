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

  attachments?: AiAttachmentItem[];

  models?: AiModelItem[];

  agents?: AiAgentItem[];

  performances?: AiPerformanceItem[];
};
