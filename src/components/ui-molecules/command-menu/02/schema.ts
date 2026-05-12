import type { ComponentType } from "react";
import type { MessageKey } from "@/types/messages";

export type CommandMenuItem = {
  id: string;

  icon: ComponentType<{ className?: string }>;

  shortcut?: readonly string[];
};

export type CommandMenuBlock = {
  type: "command-menu-02";
  id: string;

  defaultOpen?: boolean;
  triggerKey?: MessageKey;
  titleKey?: MessageKey;
};
