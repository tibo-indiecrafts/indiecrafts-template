import type { StaticAppPathname } from "@/config";
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

  spokes: readonly { iconKey: IntegrationIcon; position: IntegrationPosition }[];
};
