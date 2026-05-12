export type IntegrationIcon =
  | "linear"
  | "vercel"
  | "claude"
  | "gemini"
  | "googlePalm"
  | "openai";

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
