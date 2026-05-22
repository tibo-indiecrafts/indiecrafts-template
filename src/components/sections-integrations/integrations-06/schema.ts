import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type IntegrationIcon =
  | "vsCode"
  | "vsCodium"
  | "windsurf"
  | "claude"
  | "openai"
  | "mistralAi"
  | "mediaWiki"
  | "gemini"
  | "linear"
  | "vercel"
  | "googlePalm"
  | "replit";

export type IntegrationsBlock = {
  type: "integrations-06";
  id: string;

  rowTop: readonly IntegrationIcon[];

  rowMiddle: readonly IntegrationIcon[];

  rowBottom: readonly IntegrationIcon[];
  headerTitleKey: MessageKey;
  headerBodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
};
