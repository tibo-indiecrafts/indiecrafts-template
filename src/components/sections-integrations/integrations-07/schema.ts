import type { MessageKey } from "@/types/messages";

export type IntegrationIcon =
  | "gemini"
  | "linear"
  | "replit"
  | "vercel"
  | "openai"
  | "mediaWiki"
  | "claude";

/**
 * Tailark Pro `integrations-07` — center hero text with 7 integration
 * cards scattered around it in a `md:grid-cols-18 md:grid-rows-6`
 * grid plus 4 decorative empty squares (`bg-muted` / `bg-muted/50`)
 * for visual rhythm. Icon placements are hardcoded structurally —
 * the schema only swaps which 7 icons render in those cells.
 *
 * Seven icons is structural — the layout reserves 7 specific grid
 * positions.
 */
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
