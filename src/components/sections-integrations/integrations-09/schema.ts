import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type IntegrationIcon =
  | "intellij"
  | "vsCode"
  | "openai"
  | "claude"
  | "gemini"
  | "cloudflare"
  | "vercel";

export type IntegrationsGroup = {
  labelKey: MessageKey;
  icons: readonly IntegrationIcon[];

  iconsPerRow?: 2 | 3;

  isWide?: boolean;
};

export type IntegrationsBlock = {
  type: "integrations-09";
  id: string;
  headerTitleKey: MessageKey;
  headerBodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  groups: readonly [IntegrationsGroup, IntegrationsGroup, IntegrationsGroup];
};
