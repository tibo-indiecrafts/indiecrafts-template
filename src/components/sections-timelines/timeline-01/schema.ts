import type { MessageKey } from "@/types/messages";

export type TimelineItemType = "created" | "in-progress";

export type TimelineItem = {
  id: string;

  type: TimelineItemType;

  avatarColor: string;
};

export type TimelineBlock = {
  type: "timeline-01";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;

  items?: TimelineItem[];
};
