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
 * Tailark Pro `integrations-1` — simple integrations grid (6 cards
 * in a 3-col layout at `lg:grid-cols-3`, 2-col at `sm`, 1-col on
 * mobile). Each card carries a 32px brand SVG, a title that doubles
 * as the click target via `before:absolute before:inset-0`, and a
 * 2-line description. Pure composition — no autoplay, no state.
 *
 * Schema accepts an array of integration cards (any length divisible
 * by the visual layout works, but 6 is the structural sweet spot).
 */
export type IntegrationsBlock = {
  type: "integrations-1";
  id: string;
  cards: readonly IntegrationCard[];
};
