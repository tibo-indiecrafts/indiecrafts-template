import type { MessageKey } from "@/types/messages";

/**
 * Tailark Pro `grid-1-landing-one` LogoCloud — JSX verbatim. Same
 * rotator pattern as logo-cloud-11 but wrapped in a `Container`
 * border frame (the grid-1 page's signature look) and 4-column
 * grid (vs 5).
 */
export type LogoCloudGroupId = "ai" | "hosting" | "payments" | "streaming";
export type LogoCloudGroup = { id: LogoCloudGroupId; labelKey: MessageKey };

export type LogoCloudBlock = {
  type: "logo-cloud-12";
  id: string;
  introLeadKey: MessageKey;
  groups: ReadonlyArray<LogoCloudGroup>;
  rotationMs?: number;
};
