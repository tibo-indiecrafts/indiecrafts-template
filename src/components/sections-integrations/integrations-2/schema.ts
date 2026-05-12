import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type IntegrationIcon =
  | "gemini"
  | "replit"
  | "mistralAi"
  | "vsCodium"
  | "mediaWiki"
  | "googlePalm";

export type IntegrationCard = {
  iconKey: IntegrationIcon;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  href: StaticAppPathname | `http${string}` | `#${string}`;
};

/**
 * Tailark Pro `integrations-2` — bordered-grid sibling of
 * `integrations-1`. Same 6-card content shape (icon + title + body
 * + clickable card overlay), but rendered as a single grid with
 * internal `divide-x` / `divide-y` separators and 4 PlusDecorator
 * marks at the outer corners. `:nth-child` rules toggle which cells
 * lose their right/bottom border at each breakpoint so the dividers
 * stay clean. Cells highlight on hover via `hover:bg-foreground/3`.
 */
export type IntegrationsBlock = {
  type: "integrations-2";
  id: string;
  cards: readonly IntegrationCard[];
};
