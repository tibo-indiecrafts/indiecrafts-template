import type { MessageKey } from "@/types/messages";

/**
 * Block — full chat-card composition with conversation transcript,
 * status header, and `ai-elements` prompt input. All visible labels
 * resolve through `blocks.ai-05.*`. Per-message copy is keyed by `id`
 * against `messages.<id>.content`. Per-quick-tool button copy is
 * keyed by `id` against `tools.<id>.label`. Demo response variants
 * are keyed against `responses.<index>` (zero-indexed strings).
 */
export type AiMessage = {
  /** Stable identifier — also the namespace key for translations. */
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
  /** Header chat label. */
  titleKey?: MessageKey;
  /** Header status text. */
  statusKey?: MessageKey;
  /** Header subtle subtitle, e.g. "Powered by shadcn/ui". */
  subtitleKey?: MessageKey;
  /** Override the seed message list. */
  initialMessages?: AiMessage[];
  /** Override the prompt-footer tool buttons. */
  tools?: AiTool[];
  /** Number of response variants to cycle through. */
  responseCount?: number;
};
