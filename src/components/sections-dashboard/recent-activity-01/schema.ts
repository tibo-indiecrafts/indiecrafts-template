import type { MessageKey } from "@/types/messages";

/**
 * Recent-activity dashboard section — vertical feed of timestamped
 * events (file edits, comments, sign-ins, etc.). Each entry pairs an
 * icon with an actor + action + target + relative timestamp.
 *
 * Per-item copy is keyed by `id` against `items.<id>.{actor, action,
 * target, timestamp}` in en.json. Icons reference `iconKey` enum
 * values resolved via the component's internal lucide-react map.
 */
export type RecentActivityIcon =
  | "FileText"
  | "MessageCircle"
  | "GitCommit"
  | "UserPlus"
  | "CheckCircle"
  | "Trash2";

export type RecentActivityItem = {
  /** Stable identifier — keys translations under `items.<id>.*`. */
  id: string;
  /** Lucide icon name (from the supported subset). */
  iconKey: RecentActivityIcon;
  /** Optional href for the "View all" link target on this row. */
  href?: string;
};

export type RecentActivityBlock = {
  type: "recent-activity-01";
  id: string;
  /** Section heading override; defaults to `blocks.recent-activity-01.title`. */
  titleKey?: MessageKey;
  /** Description shown under the heading. Optional. */
  descriptionKey?: MessageKey;
  /** Items to render. Defaults to `recentActivity01Items`. */
  items?: RecentActivityItem[];
  /** "View all" footer link target. Hidden when undefined. */
  viewAllHref?: string;
};
