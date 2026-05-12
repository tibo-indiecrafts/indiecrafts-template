import type { MessageKey } from "@/types/messages";

export type IntegrationIcon = "gemini" | "claude" | "openai" | "vercel" | "stripe";

/**
 * Tailark Pro `integrations-5` — hero-style integrations section.
 * Hero text (title + body) occupies the left `col-span-7` at `md+`
 * (or full row on mobile), and 5 brand icon cells are scattered
 * across the remaining grid columns/rows with explicit `col-start`
 * / `row-start` positions and `*:border-dashed` grid lines between
 * them.
 *
 * The grid is `grid-cols-4 grid-rows-6` on mobile and `md:grid-cols-10
 * md:grid-rows-3` at md+. Icon placements are hardcoded structurally
 * — the schema only swaps which 5 icons render in those cells.
 *
 * Five icons is structural — the layout reserves five specific grid
 * positions. The 5th cell renders a wider Stripe wordmark via
 * `h-6 w-16` instead of square `size-6`.
 */
export type IntegrationsBlock = {
  type: "integrations-5";
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
