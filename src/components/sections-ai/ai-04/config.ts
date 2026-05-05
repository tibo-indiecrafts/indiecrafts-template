import type { AiAttachmentAction, AiBlock, AiQuickAction, AiSettingItem } from "./schema";

export const ai04Key = "ai-04" as const;
export const ai04Namespace = "blocks.ai-04" as const;

export const ai04AttachmentActions: AiAttachmentAction[] = [
  { id: "files", icon: "IconPaperclip" },
  { id: "url", icon: "IconLink" },
  { id: "clipboard", icon: "IconClipboard" },
  { id: "template", icon: "IconTemplate" },
];

export const ai04Settings: AiSettingItem[] = [
  { id: "autoComplete", icon: "IconSparkles", defaultValue: true },
  { id: "streaming", icon: "IconPlayerPlay", defaultValue: false },
  { id: "showHistory", icon: "IconHistory", defaultValue: false },
];

export const ai04QuickActions: AiQuickAction[] = [
  { id: "screenshot", icon: "IconCamera" },
  { id: "figma", icon: "IconBrandFigma" },
  { id: "upload", icon: "IconFileUpload" },
  { id: "landing", icon: "IconLayoutDashboard" },
];

export const ai04Sample: Omit<AiBlock, "id"> = {
  type: "ai-04",
  attachmentActions: ai04AttachmentActions,
  settings: ai04Settings,
  quickActions: ai04QuickActions,
};
