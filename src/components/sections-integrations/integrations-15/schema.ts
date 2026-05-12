import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type IntegrationIcon =
  | "gemini"
  | "replit"
  | "magicUi"
  | "vsCodium"
  | "mediaWiki"
  | "googlePalm";

export type IntegrationPosition =
  | "left-top"
  | "left-middle"
  | "left-bottom"
  | "right-top"
  | "right-middle"
  | "right-bottom";

export type IntegrationsBlock = {
  type: "integrations-15";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  /** Six spokes around the central LogoIcon — order is left-top, left-middle, left-bottom, right-top, right-middle, right-bottom. */
  spokes: readonly { iconKey: IntegrationIcon; position: IntegrationPosition }[];
};
