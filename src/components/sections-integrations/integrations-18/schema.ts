import type { StaticAppPathname } from "@/config/routes.types";
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
  /** 3 outer-ring icons (left, top, right). */
  outerRing: readonly [IntegrationIcon, IntegrationIcon, IntegrationIcon];
  /** 3 inner-ring icons (top, left, right). */
  innerRing: readonly [IntegrationIcon, IntegrationIcon, IntegrationIcon];
};
