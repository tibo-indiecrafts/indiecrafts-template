import type { LogoCloudBlock } from "./schema";

export const logoCloud12Key = "logo-cloud-12" as const;
export const logoCloud12Namespace = "blocks.logo-cloud-12" as const;

export const logoCloud12Sample: Omit<LogoCloudBlock, "id"> = {
  type: "logo-cloud-12",
  introLeadKey: "blocks.logo-cloud-12.introLead",
  groups: [
    { id: "ai", labelKey: "blocks.logo-cloud-12.groups.ai" },
    { id: "hosting", labelKey: "blocks.logo-cloud-12.groups.hosting" },
    { id: "payments", labelKey: "blocks.logo-cloud-12.groups.payments" },
    { id: "streaming", labelKey: "blocks.logo-cloud-12.groups.streaming" },
  ],
  rotationMs: 2500,
};
