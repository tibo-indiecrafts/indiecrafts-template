import type { TimelineBlock, TimelineItem } from "./schema";

export const timeline01Key = "timeline-01" as const;
export const timeline01Namespace = "blocks.timeline-01" as const;

export const timeline1Items: TimelineItem[] = [
  { id: "project-created", type: "created", avatarColor: "bg-violet-500" },
  { id: "assets-uploaded", type: "created", avatarColor: "bg-orange-500" },
  { id: "prototype-shared", type: "created", avatarColor: "bg-emerald-500" },
  { id: "feedback-left", type: "created", avatarColor: "bg-fuchsia-500" },
  { id: "review-scheduled", type: "in-progress", avatarColor: "bg-blue-500" },
];

export const timeline01Sample: Omit<TimelineBlock, "id"> = {
  type: "timeline-01",
  items: timeline1Items,
};
