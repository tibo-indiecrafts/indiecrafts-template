import type { LogoCloudBlock } from "./schema";

export const logoCloud11Key = "logo-cloud-11" as const;
export const logoCloud11Namespace = "blocks.logo-cloud-11" as const;

export const logoCloud11Sample: Omit<LogoCloudBlock, "id"> = {
  type: "logo-cloud-11",
  introLeadKey: "blocks.logo-cloud-11.introLead",
  groups: [
    { id: "ai", labelKey: "blocks.logo-cloud-11.groups.ai" },
    { id: "hosting", labelKey: "blocks.logo-cloud-11.groups.hosting" },
    { id: "payments", labelKey: "blocks.logo-cloud-11.groups.payments" },
    { id: "streaming", labelKey: "blocks.logo-cloud-11.groups.streaming" },
  ],
  rotationMs: 2500,
};
