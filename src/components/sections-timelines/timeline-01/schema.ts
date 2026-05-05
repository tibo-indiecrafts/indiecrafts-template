import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/onboarding-05` — vertical activity timeline
 * with avatar dots and per-event metadata. All visible strings
 * resolve through `blocks.timeline-01.*`.
 *
 * Per-item copy is keyed by `id` against `items.<id>.{description}`
 * in en.json, so adding an item = `{ id: "x", ... }` + a matching
 * `items.x` entry.
 */
export type TimelineItemType = "created" | "in-progress";

export type TimelineItem = {
  /** Stable identifier — also the namespace key for translations. */
  id: string;
  /** Marker style: filled (created) or outline (in progress). */
  type: TimelineItemType;
  /** Tailwind class for the avatar circle background, e.g. `"bg-violet-500"`. */
  avatarColor: string;
};

export type TimelineBlock = {
  type: "timeline-01";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  /** Override the item list. Defaults to `timeline1Items`. */
  items?: TimelineItem[];
};
