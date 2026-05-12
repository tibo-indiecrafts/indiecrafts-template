import type { MessageKey } from "@/types/messages";

export type CommandMenuNavItem = {
  id: string;

  href: string;

  keywords: readonly string[];
};

export type CommandMenuPageGroup = {
  id: string;
  pages: readonly CommandMenuNavItem[];
};

export type CommandMenuColor = {
  id: string;

  className: string;

  value: string;
};

export type CommandMenuColorGroup = {
  id: string;
  colors: readonly CommandMenuColor[];
};

export type CommandMenuBlock = {
  type: "command-menu-03";
  id: string;

  defaultOpen?: boolean;
  triggerKey?: MessageKey;
  titleKey?: MessageKey;
};
