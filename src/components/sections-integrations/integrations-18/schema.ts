import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type IntegrationIcon =
  | "gemini"
  | "replit"
  | "magicUi"
  | "vsCodium"
  | "mediaWiki"
  | "googlePalm";

export type IntegrationsBlock = {
  type: "integrations-18";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;

  outerRing: readonly [IntegrationIcon, IntegrationIcon, IntegrationIcon];

  innerRing: readonly [IntegrationIcon, IntegrationIcon, IntegrationIcon];
};
