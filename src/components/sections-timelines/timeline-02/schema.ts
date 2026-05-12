import type { MessageKey } from "@/types/messages";

export type TimelineItemType = "done" | "in-progress" | "open";

export type TimelineItem = {
  id: string;

  type: TimelineItemType;
};

export type TimelineBlock = {
  type: "timeline-02";
  id: string;
  titleKey?: MessageKey;

  items?: TimelineItem[];
};
