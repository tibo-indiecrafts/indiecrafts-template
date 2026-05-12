import type { MessageKey } from "@/types/messages";

export type AiAttachmentAction = {
  id: string;
  icon: "IconPaperclip" | "IconLink" | "IconClipboard" | "IconTemplate";
};

export type AiSettingItem = {
  id: string;
  icon: "IconSparkles" | "IconPlayerPlay" | "IconHistory";

  defaultValue: boolean;
};

export type AiQuickAction = {
  id: string;
  icon: "IconCamera" | "IconBrandFigma" | "IconFileUpload" | "IconLayoutDashboard";
};

export type AiBlock = {
  type: "ai-04";
  id: string;

  titleKey?: MessageKey;

  subtitleKey?: MessageKey;

  attachmentActions?: AiAttachmentAction[];

  settings?: AiSettingItem[];

  quickActions?: AiQuickAction[];
};
