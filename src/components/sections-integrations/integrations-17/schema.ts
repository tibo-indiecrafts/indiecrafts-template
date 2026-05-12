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
  type: "integrations-17";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  /** Pyramid layout: 2 top / 3 middle (center is the project's LogoIcon) / 2 bottom. */
  topRow: readonly IntegrationIcon[];
  middleRow: readonly [IntegrationIcon, IntegrationIcon];
  bottomRow: readonly IntegrationIcon[];
};
