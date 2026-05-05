import type { AiAttachmentItem, AiBlock } from "./schema";

export const ai01Key = "ai-01" as const;
export const ai01Namespace = "blocks.ai-01" as const;

export const ai01AttachmentItems: AiAttachmentItem[] = [
  { id: "files", icon: "IconPaperclip" },
  { id: "agent", icon: "IconSparkles" },
  { id: "research", icon: "IconSearch" },
];

export const ai01Sample: Omit<AiBlock, "id"> = {
  type: "ai-01",
  attachmentItems: ai01AttachmentItems,
};
