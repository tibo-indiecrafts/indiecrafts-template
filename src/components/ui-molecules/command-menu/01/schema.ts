import type { ComponentType } from "react";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/command-menu-01` — Cmd+K palette with three
 * grouped sections (Workspace / Analytics / Settings), search input,
 * and an Esc footer button. Item icons stay as React component refs;
 * labels resolve via `blocks.command-menu-01.items.<id>.label` and
 * group headings via `blocks.command-menu-01.groups.<groupId>.heading`.
 */
export type CommandMenuItem = {
  /** Stable identifier — also the namespace key for translations. */
  id: string;
  /** Tabler icon component reference. */
  icon: ComponentType<{ className?: string }>;
};

export type CommandMenuBlock = {
  type: "command-menu-01";
  id: string;
  /** Open the palette on mount — defaults `true` so Storybook displays it. */
  defaultOpen?: boolean;
  triggerKey?: MessageKey;
  titleKey?: MessageKey;
};
