import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type IntegrationIcon =
  | "gemini"
  | "replit"
  | "googlePalm"
  | "magicUi"
  | "vsCodium"
  | "mediaWiki";

export type IntegrationCell = {
  iconKey: IntegrationIcon;
  nameKey: MessageKey;
  descriptionKey: MessageKey;
};

export type IntegrationsBlock = {
  type: "integrations-16";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  testimonial: {
    iconKey: IntegrationIcon;
    quoteKey: MessageKey;
    authorKey: MessageKey;
    roleKey: MessageKey;
  };
  cells: readonly IntegrationCell[];
};
