import type { MessageKey } from "@/types/messages";

export type QuickActionIcon =
  | "Plus"
  | "UserPlus"
  | "BarChart3"
  | "CreditCard"
  | "Settings"
  | "Upload"
  | "Download"
  | "Mail";

export type QuickActionItem = {
  id: string;

  iconKey: QuickActionIcon;

  href?: string;
};

export type QuickActionsBlock = {
  type: "quick-actions-01";
  id: string;

  titleKey?: MessageKey;

  descriptionKey?: MessageKey;

  actions?: QuickActionItem[];
};
