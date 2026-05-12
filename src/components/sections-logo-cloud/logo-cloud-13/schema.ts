import type { MessageKey } from "@/types/messages";

export type LogoCloudGroupId = "ai" | "hosting" | "payments" | "streaming";
export type LogoCloudGroup = { id: LogoCloudGroupId; labelKey: MessageKey };

/**
 * Tailark Pro `grid-2-landing-one` LogoCloud — JSX verbatim. 4-col
 * card grid (each cell its own card) with motion rotation between
 * 4 groups. Active accent color is `text-indigo-500` (vs theme
 * `text-foreground` in earlier variants).
 */
export type LogoCloudBlock = {
  type: "logo-cloud-13";
  id: string;
  introLeadKey: MessageKey;
  groups: ReadonlyArray<LogoCloudGroup>;
  rotationMs?: number;
};
