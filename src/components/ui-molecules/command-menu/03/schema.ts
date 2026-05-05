import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/command-menu-03` — documentation-style command
 * palette with top-level pages, doc page groups, and color tokens. Cmd+K
 * (or `/` outside form fields) toggles open. Item labels and group
 * headings resolve via `blocks.command-menu-03.{items,groups}.<id>.*`;
 * color class names + oklch values stay as literal data.
 */
export type CommandMenuNavItem = {
  /** Stable identifier — also the namespace key for translations. */
  id: string;
  /** Internal href the menu pushes onto the router. */
  href: string;
  /** Search keywords (English; not translated). */
  keywords: readonly string[];
};

export type CommandMenuPageGroup = {
  /** Stable identifier — also the namespace key for translations. */
  id: string;
  pages: readonly CommandMenuNavItem[];
};

export type CommandMenuColor = {
  /** Display name AND translation id. */
  id: string;
  /** Tailwind class slug (literal). */
  className: string;
  /** oklch() literal copied to clipboard on select. */
  value: string;
};

export type CommandMenuColorGroup = {
  /** Stable identifier — also the namespace key for translations. */
  id: string;
  colors: readonly CommandMenuColor[];
};

export type CommandMenuBlock = {
  type: "command-menu-03";
  id: string;
  /** Open the palette on mount — defaults `true` so Storybook displays it. */
  defaultOpen?: boolean;
  triggerKey?: MessageKey;
  titleKey?: MessageKey;
};
