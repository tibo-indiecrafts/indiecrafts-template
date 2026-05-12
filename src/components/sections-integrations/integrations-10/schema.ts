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

/**
 * Tailark Pro `integrations-10` — constellation of brand-icon
 * circles scattered through a varying-width grid of empty slots.
 * 7 rows that pyramid out (4 → 5 → 6 → 7 → 6 → 5 → 4 cells) with
 * `flex-row-reverse` on the first two and last row. Each cell is
 * either a real `IntegrationCard` (icon key) or an empty muted
 * circle (`bg-foreground/3`).
 *
 * Below the constellation: centered title + body + outline CTA.
 */
export type IntegrationsBlock = {
  type: "integrations-10";
  id: string;
  rows: ReadonlyArray<IntegrationsRow>;
  headerTitleKey: MessageKey;
  headerBodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
};
