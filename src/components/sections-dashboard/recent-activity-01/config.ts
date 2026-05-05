import type { RecentActivityBlock, RecentActivityItem } from "./schema";

export const recentActivity01Key = "recent-activity-01" as const;
export const recentActivity01Namespace = "blocks.recent-activity-01" as const;

export const recentActivity01Items: RecentActivityItem[] = [
  { id: "doc-edit", iconKey: "FileText" },
  { id: "comment", iconKey: "MessageCircle" },
  { id: "commit", iconKey: "GitCommit" },
  { id: "invite", iconKey: "UserPlus" },
  { id: "task-done", iconKey: "CheckCircle" },
];

export const recentActivity01Sample: Omit<RecentActivityBlock, "id"> = {
  type: "recent-activity-01",
  items: recentActivity01Items,
  viewAllHref: "/dashboard/activity",
};
