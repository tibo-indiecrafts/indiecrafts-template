import type { MessageKey } from "@/types/messages";

export type IntegrationIcon = "gemini" | "claude" | "openai" | "vercel" | "stripe";

export type IntegrationsBlock = {
  type: "integrations-05";
  id: string;
  headerTitleKey: MessageKey;
  headerBodyKey: MessageKey;
  /** Five icons in placement order: top-right, mid-left, mid-right, bottom-left, bottom-wide (Stripe slot). */
  icons: readonly [
    IntegrationIcon,
    IntegrationIcon,
    IntegrationIcon,
    IntegrationIcon,
    IntegrationIcon,
  ];
};
