import type { MessageKey } from "@/types/messages";

export type AiMessage = {
  id: string;
  role: "user" | "assistant";
};

export type AiTool = {
  id: string;
  icon: "IconPaperclip" | "IconBolt" | "IconMessageCircle";
};

export type AiBlock = {
  type: "ai-05";
  id: string;

  titleKey?: MessageKey;

  statusKey?: MessageKey;

  subtitleKey?: MessageKey;

  initialMessages?: AiMessage[];

  tools?: AiTool[];

  responseCount?: number;
};
