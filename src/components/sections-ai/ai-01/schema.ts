import type { MessageKey } from "@/types/messages";

/**
 * Block — chat composer with auto-expanding textarea, attachments
 * dropdown, and voice/send affordances. All visible labels resolve
 * through `blocks.ai-01.*`. The `attachmentItems` list is structural
 * config keyed by `id`; visible `label` text is looked up at render
 * time via `t(\`attachments.${id}.label\`)`.
 */
export type AiAttachmentItem = {
  /** Stable identifier — also the namespace key for translations. */
  id: string;
  /** Tabler icon name (e.g. `"IconPaperclip"`) — kept structural. */
  icon: "IconPaperclip" | "IconSparkles" | "IconSearch";
};

export type AiBlock = {
  type: "ai-01";
  id: string;
  /** Heading shown above the composer. */
  titleKey?: MessageKey;
  /** Override the dropdown attachment list. */
  attachmentItems?: AiAttachmentItem[];
};
