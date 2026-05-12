import type { MessageKey } from "@/types/messages";

export type IntegrationIcon =
  | "gemini"
  | "linear"
  | "replit"
  | "vercel"
  | "openai"
  | "mediaWiki"
  | "claude";

export type IntegrationsBlock = {
  type: "integrations-07";
  id: string;
  headerTitleKey: MessageKey;
  headerBodyKey: MessageKey;

  icons: readonly [
    IntegrationIcon,
    IntegrationIcon,
    IntegrationIcon,
    IntegrationIcon,
    IntegrationIcon,
    IntegrationIcon,
    IntegrationIcon,
  ];
};
