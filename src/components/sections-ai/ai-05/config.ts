import type { AiBlock, AiMessage, AiTool } from "./schema";

export const ai05Key = "ai-05" as const;
export const ai05Namespace = "blocks.ai-05" as const;

export const ai05InitialMessages: AiMessage[] = [
  { id: "intro", role: "assistant" },
  { id: "question", role: "user" },
  { id: "answer", role: "assistant" },
];

export const ai05Tools: AiTool[] = [
  { id: "attach", icon: "IconPaperclip" },
  { id: "quick", icon: "IconBolt" },
  { id: "newChat", icon: "IconMessageCircle" },
];

export const ai05Sample: Omit<AiBlock, "id"> = {
  type: "ai-05",
  initialMessages: ai05InitialMessages,
  tools: ai05Tools,
  responseCount: 3,
};
