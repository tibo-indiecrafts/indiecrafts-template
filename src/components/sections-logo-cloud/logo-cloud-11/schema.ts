import type { MessageKey } from "@/types/messages";

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
