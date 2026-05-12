import type { StaticAppPathname } from "@/config/routes.types";
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
  /** Top slider: 6 icons, scroll left-to-right. */
  rowTop: readonly IntegrationIcon[];
  /** Middle slider: 6 icons, scroll right-to-left (reverse). */
  rowMiddle: readonly IntegrationIcon[];
  /** Bottom slider: 6 icons, scroll left-to-right slower. */
  rowBottom: readonly IntegrationIcon[];
  headerTitleKey: MessageKey;
  headerBodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
};
