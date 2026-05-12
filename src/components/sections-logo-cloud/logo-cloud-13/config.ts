import type { LogoCloudBlock } from "./schema";

export const logoCloud13Key = "logo-cloud-13" as const;
export const logoCloud13Namespace = "blocks.logo-cloud-13" as const;

export const logoCloud13Sample: Omit<LogoCloudBlock, "id"> = {
  type: "logo-cloud-13",
  introLeadKey: "blocks.logo-cloud-13.introLead",
  groups: [
    { id: "ai", labelKey: "blocks.logo-cloud-13.groups.ai" },
    { id: "hosting", labelKey: "blocks.logo-cloud-13.groups.hosting" },
    { id: "payments", labelKey: "blocks.logo-cloud-13.groups.payments" },
    { id: "streaming", labelKey: "blocks.logo-cloud-13.groups.streaming" },
  ],
  rotationMs: 2500,
};
