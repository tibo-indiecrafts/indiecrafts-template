export type IntegrationIcon =
  | "linear"
  | "vercel"
  | "claude"
  | "gemini"
  | "googlePalm"
  | "openai";

/**
 * Tailark Pro `integrations-11` — minimal grid-only constellation
 * with no header text or CTA. A 3-row × 10-col (8-col on mobile)
 * grid of square ringed cells. Most cells are empty rings; 6 cells
 * carry brand icons. The first and last cell of each row are
 * `max-sm:hidden` so the visible grid collapses to 8 cols on mobile.
 *
 * Three rows × ten cells is structural — the layout is purely the
 * constellation. Schema accepts a 3-tuple of rows, each a 10-tuple
 * of `IntegrationIcon | null`.
 */
export type IntegrationsRow = readonly [
  IntegrationIcon | null,
  IntegrationIcon | null,
  IntegrationIcon | null,
  IntegrationIcon | null,
  IntegrationIcon | null,
  IntegrationIcon | null,
  IntegrationIcon | null,
  IntegrationIcon | null,
  IntegrationIcon | null,
  IntegrationIcon | null,
];

export type IntegrationsBlock = {
  type: "integrations-11";
  id: string;
  rows: readonly [IntegrationsRow, IntegrationsRow, IntegrationsRow];
};
