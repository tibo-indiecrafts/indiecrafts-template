import type { StaticAppPathname } from "@/config/routes.types";
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
  /** When true, reverse cell order (`flex-row-reverse`). */
  reverse?: boolean;
  /** Array of icon keys or null (empty muted circle slot). */
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
