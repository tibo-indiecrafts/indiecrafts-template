import type { TimelineBlock, TimelineItem } from "./schema";

export const timeline02Key = "timeline-02" as const;
export const timeline02Namespace = "blocks.timeline-02" as const;

export const timeline2Items: TimelineItem[] = [
  { id: "repo-connected", type: "done" },
  { id: "build-config-set", type: "done" },
  { id: "domain-configured", type: "done" },
  { id: "health-checks", type: "in-progress" },
  { id: "go-live", type: "open" },
];

export const timeline02Sample: Omit<TimelineBlock, "id"> = {
  type: "timeline-02",
  items: timeline2Items,
};
