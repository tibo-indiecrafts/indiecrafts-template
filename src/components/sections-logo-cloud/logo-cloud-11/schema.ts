import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `dark-landing-one` LogoCloud — JSX kept verbatim.
 * Single intro line whose inline category accents flip color based
 * on the currently-shown logo group, and a 5-column motion grid
 * that rotates between four groups every `rotationMs` (default
 * 2500ms). The actual logo set is hard-coded inside `LogoCloud.tsx`
 * (matching the upstream staging file 1:1) — schema only carries
 * intro + group labels.
 */
export type LogoCloudGroupId = "ai" | "hosting" | "payments" | "streaming";

export type LogoCloudGroup = {
  id: LogoCloudGroupId;
  labelKey: MessageKey;
};

export type LogoCloudBlock = {
  type: "logo-cloud-11";
  id: string;
  introLeadKey: MessageKey;
  groups: ReadonlyArray<LogoCloudGroup>;
  rotationMs?: number;
};
