import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/onboarding-06` — vertical deployment
 * progress timeline with done / in-progress / open states. All
 * visible strings resolve through `blocks.timeline-02.*`.
 *
 * Per-item copy is keyed by `id` against `items.<id>.{title,
 * description, activityTime}` in en.json.
 */
export type TimelineItemType = "done" | "in-progress" | "open";

export type TimelineItem = {
  /** Stable identifier — also the namespace key for translations. */
  id: string;
  /** Marker style: check / dot / outline. */
  type: TimelineItemType;
};

export type TimelineBlock = {
  type: "timeline-02";
  id: string;
  titleKey?: MessageKey;
  /** Override the item list. Defaults to `timeline2Items`. */
  items?: TimelineItem[];
};
