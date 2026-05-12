import type { MessageKey } from "@/types/messages";

export type RecentActivityIcon =
  | "FileText"
  | "MessageCircle"
  | "GitCommit"
  | "UserPlus"
  | "CheckCircle"
  | "Trash2";

export type RecentActivityItem = {
  id: string;

  iconKey: RecentActivityIcon;

  href?: string;
};

export type RecentActivityBlock = {
  type: "recent-activity-01";
  id: string;

  titleKey?: MessageKey;

  descriptionKey?: MessageKey;

  items?: RecentActivityItem[];

  viewAllHref?: string;
};
