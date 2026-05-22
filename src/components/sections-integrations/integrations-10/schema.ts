import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type IntegrationIcon =
  | "mediaWiki"
  | "replit"
  | "vercel"
  | "linear"
  | "vsCode"
  | "openai"
  | "cloudflare"
  | "claude"
  | "gemini"
  | "googlePalm";

export type IntegrationsRow = {
  reverse?: boolean;

  cells: ReadonlyArray<IntegrationIcon | null>;
};

export type IntegrationsBlock = {
  type: "integrations-10";
  id: string;
  rows: ReadonlyArray<IntegrationsRow>;
  headerTitleKey: MessageKey;
  headerBodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
};
