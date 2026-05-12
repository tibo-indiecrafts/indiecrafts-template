import type { ComponentType } from "react";
import type { MessageKey } from "@/types/messages";

export type CommandMenuItem = {
  id: string;

  icon: ComponentType<{ className?: string }>;
};

export type CommandMenuBlock = {
  type: "command-menu-01";
  id: string;

  defaultOpen?: boolean;
  triggerKey?: MessageKey;
  titleKey?: MessageKey;
};
