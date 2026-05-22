import type { StaticAppPathname } from "@/config";
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

export type IntegrationsBlock = {
  type: "integrations-01";
  id: string;
  cards: readonly IntegrationCard[];
};
