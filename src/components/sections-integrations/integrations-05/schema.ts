import type { MessageKey } from "@/types/messages";

export type IntegrationIcon = "gemini" | "claude" | "openai" | "vercel" | "stripe";

export type IntegrationsBlock = {
  type: "integrations-05";
  id: string;
  headerTitleKey: MessageKey;
  headerBodyKey: MessageKey;

  icons: readonly [
    IntegrationIcon,
    IntegrationIcon,
    IntegrationIcon,
    IntegrationIcon,
    IntegrationIcon,
  ];
};
