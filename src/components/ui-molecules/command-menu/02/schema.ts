import type { ComponentType } from "react";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/command-menu-02` — full-screen command palette
 * with nine grouped sections (Account / Documents / Signing / Templates
 * / General / Navigation / Quick Actions / Help / Keyboard Shortcuts),
 * search input, an Esc footer, and per-item keyboard hint chips. Item
 * icons + shortcut symbols stay as data; labels resolve via
 * `blocks.command-menu-02.items.<id>.label` and group headings via
 * `blocks.command-menu-02.groups.<groupId>.heading`.
 */
export type CommandMenuItem = {
  /** Stable identifier — also the namespace key for translations. */
  id: string;
  /** Tabler icon component reference. */
  icon: ComponentType<{ className?: string }>;
  /** Optional keyboard-shortcut chips (literal key symbols, not translated). */
  shortcut?: readonly string[];
};

export type CommandMenuBlock = {
  type: "command-menu-02";
  id: string;
  /** Open the palette on mount — defaults `true` so Storybook displays it. */
  defaultOpen?: boolean;
  triggerKey?: MessageKey;
  titleKey?: MessageKey;
};
