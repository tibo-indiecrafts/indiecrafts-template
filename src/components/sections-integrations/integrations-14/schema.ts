import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type IntegrationIcon = "gemini" | "replit" | "googlePalm";

export type IntegrationRow = {
  iconKey: IntegrationIcon;
  nameKey: MessageKey;
  descriptionKey: MessageKey;
};

export type IntegrationsBlock = {
  type: "integrations-14";
  id: string;
  titleKey: MessageKey;
  bodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  rows: readonly IntegrationRow[];
};
