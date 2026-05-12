import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type IntegrationIcon =
  | "intellij"
  | "vsCode"
  | "openai"
  | "claude"
  | "gemini"
  | "cloudflare"
  | "vercel";

/**
 * Tailark Pro `integrations-9` — center hero text + 3 grouped
 * integration buckets (e.g. Development / LLMs / Hosting). Each
 * group is a labelled rounded card containing 2 or 3 brand icon
 * tiles. Decorative grid + dot patterns sit behind the groups.
 *
 * The middle group spans 3 cols at `@xl` (col-span-3) so the LLMs
 * bucket gets more horizontal room for its 3 icons.
 *
 * Three groups is structural — the layout column math (`@xl:grid-
 * cols-9` with 2+3+2 + spacers) balances at exactly three.
 */
export type IntegrationsGroup = {
  labelKey: MessageKey;
  icons: readonly IntegrationIcon[];
  /** Defaults to `2`. The middle group ("LLMs") uses 3 icons in upstream. */
  iconsPerRow?: 2 | 3;
  /** Set on the middle group to span 3 cols at `@xl` width. */
  isWide?: boolean;
};

export type IntegrationsBlock = {
  type: "integrations-9";
  id: string;
  headerTitleKey: MessageKey;
  headerBodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  groups: readonly [IntegrationsGroup, IntegrationsGroup, IntegrationsGroup];
};
