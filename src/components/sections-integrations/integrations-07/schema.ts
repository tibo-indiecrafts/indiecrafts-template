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
  /**
   * Seven icons in placement order:
   *   0. top-left (col-start-3)
   *   1. mid-bottom (col-start-9, row-start-8, translate-x-1/2)
   *   2. mid-left (row-start-3)
   *   3. bottom-left (col-start-3, row-start-5)
   *   4. top-right (col-start-16)
   *   5. far-right (col-start-18, row-start-3)
   *   6. mid-right (col-start-16, row-start-5)
   */
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
