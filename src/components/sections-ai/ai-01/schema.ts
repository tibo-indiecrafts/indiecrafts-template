import type { MessageKey } from "@/types/messages";

export type AiAttachmentItem = {
  id: string;

  icon: "IconPaperclip" | "IconSparkles" | "IconSearch";
};

export type AiBlock = {
  type: "ai-01";
  id: string;

  titleKey?: MessageKey;

  attachmentItems?: AiAttachmentItem[];
};
