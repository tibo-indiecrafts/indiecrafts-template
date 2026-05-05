import type { MessageKey } from "@/types/messages";

/**
 * Quick-actions dashboard section — a grid of icon-labeled CTA cards
 * complementing the KPI cards, charts, and activity feed. Each action
 * pairs an icon with a title + short description and an optional href.
 *
 * Per-item copy is keyed by `id` against `items.<id>.{title,
 * description}` in en.json. Icons reference `iconKey` enum values
 * resolved via the component's internal lucide-react map.
 */
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
  /** Stable identifier — keys translations under `items.<id>.*`. */
  id: string;
  /** Lucide icon name (from the supported subset). */
  iconKey: QuickActionIcon;
  /** Optional href; when set, the card becomes a link. */
  href?: string;
};

export type QuickActionsBlock = {
  type: "quick-actions-01";
  id: string;
  /** Section heading override; defaults to `blocks.quick-actions-01.title`. */
  titleKey?: MessageKey;
  /** Description shown under the heading. Optional. */
  descriptionKey?: MessageKey;
  /** Items to render. Defaults to `quickActions01Items`. */
  actions?: QuickActionItem[];
};
