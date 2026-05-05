import type { QuickActionItem, QuickActionsBlock } from "./schema";

export const quickActions01Key = "quick-actions-01" as const;
export const quickActions01Namespace = "blocks.quick-actions-01" as const;

export const quickActions01Items: QuickActionItem[] = [
  { id: "create-project", iconKey: "Plus", href: "/dashboard" },
  { id: "invite-teammate", iconKey: "UserPlus", href: "/dashboard" },
  { id: "view-reports", iconKey: "BarChart3", href: "/dashboard" },
  { id: "configure-billing", iconKey: "CreditCard", href: "/dashboard" },
];

export const quickActions01Sample: Omit<QuickActionsBlock, "id"> = {
  type: "quick-actions-01",
  actions: quickActions01Items,
};
