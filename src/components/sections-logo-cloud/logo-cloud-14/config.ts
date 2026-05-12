import type { LogoCloudBlock } from "./schema";

export const logoCloud14Key = "logo-cloud-14" as const;
export const logoCloud14Namespace = "blocks.logo-cloud-14" as const;

export const logoCloud14Sample: Omit<LogoCloudBlock, "id"> = {
  type: "logo-cloud-14",
  introKey: "blocks.logo-cloud-14.intro",
  caseStudyLabelKey: "blocks.logo-cloud-14.caseStudy",
  caseStudyHref: "#",
};
