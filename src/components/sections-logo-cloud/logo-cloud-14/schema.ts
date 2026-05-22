import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type LogoCloudBlock = {
  type: "logo-cloud-14";
  id: string;
  introKey: MessageKey;
  caseStudyLabelKey: MessageKey;
  caseStudyHref: StaticAppPathname | `http${string}` | `#${string}`;
  verticalAligned?: boolean;
};
