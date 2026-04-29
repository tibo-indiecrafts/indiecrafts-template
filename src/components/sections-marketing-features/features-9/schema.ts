import type { MessageKey } from "@/types/messages";

/**
 * Tailark `features-9` — 2×2 bento showing location map, chat support preview,
 * an uptime stat, and an activity chart. Visuals are baked in the component
 * (dotted map, recharts area chart); only headings are config-driven.
 */
export type Features9Block = {
  type: "features-9";
  id: string;
  locationEyebrowKey: MessageKey;
  locationBodyKey: MessageKey;
  supportEyebrowKey: MessageKey;
  supportBodyKey: MessageKey;
  uptimeKey: MessageKey;
  activityEyebrowKey: MessageKey;
  activityBodyKey: MessageKey;
  activityMutedBodyKey: MessageKey;
};
