import type { MessageKey } from "@/types/messages";

/**
 * Block — hero composer with drag-and-drop file attachments,
 * settings dropdown, and a row of quick-action buttons. All visible
 * labels resolve through `blocks.ai-04.*`. Per-attachment-action and
 * per-quick-action copy is keyed by `id` against
 * `attachmentActions.<id>.label` and `quickActions.<id>.label`.
 */
export type AiAttachmentAction = {
  id: string;
  icon: "IconPaperclip" | "IconLink" | "IconClipboard" | "IconTemplate";
};

export type AiSettingItem = {
  id: string;
  icon: "IconSparkles" | "IconPlayerPlay" | "IconHistory";
  /** Initial toggle state. */
  defaultValue: boolean;
};

export type AiQuickAction = {
  id: string;
  icon: "IconCamera" | "IconBrandFigma" | "IconFileUpload" | "IconLayoutDashboard";
};

export type AiBlock = {
  type: "ai-04";
  id: string;
  /** Hero heading. */
  titleKey?: MessageKey;
  /** Hero subheading. */
  subtitleKey?: MessageKey;
  /** Override the attachment-source dropdown. */
  attachmentActions?: AiAttachmentAction[];
  /** Override the settings toggles. */
  settings?: AiSettingItem[];
  /** Override the quick-action buttons row. */
  quickActions?: AiQuickAction[];
};
