import type { QuickActionItem, QuickActionsBlock } from "./schema";

export const quickActions01Key = "quick-actions-01" as const;
export const quickActions01Namespace = "blocks.quick-actions-01" as const;

export const quickActions01Items: QuickActionItem[] = [
  { id: "create-project", iconKey: "Plus", href: "/" },
  { id: "invite-teammate", iconKey: "UserPlus", href: "/" },
  { id: "view-reports", iconKey: "BarChart3", href: "/" },
  { id: "configure-billing", iconKey: "CreditCard", href: "/" },
];

export const quickActions01Sample: Omit<QuickActionsBlock, "id"> = {
  type: "quick-actions-01",
  actions: quickActions01Items,
};
