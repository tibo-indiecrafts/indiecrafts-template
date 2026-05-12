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

/**
 * Tailark Pro `integrations-6` — perspective-tilted 3-row infinite
 * slider of integration cards (`rotate-x-6` at rest, restoring to
 * 0 on hover) with a center brand-logo card sitting on top. Three
 * rows scroll continuously: top row left-to-right (`speed: 20`),
 * middle row right-to-left (`reverse`), bottom row left-to-right
 * (`speed: 15`). Hovering slows scroll to `speedOnHover: 10`.
 *
 * Background: a faint radial-dot grid masked at the edges.
 *
 * Below the slider mosaic: a centered title + body + outline CTA.
 */
export type IntegrationsBlock = {
  type: "integrations-6";
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
