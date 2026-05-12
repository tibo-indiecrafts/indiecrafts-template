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

export type IntegrationsGroup = {
  labelKey: MessageKey;
  icons: readonly IntegrationIcon[];
  /** Defaults to `2`. The middle group ("LLMs") uses 3 icons in upstream. */
  iconsPerRow?: 2 | 3;
  /** Set on the middle group to span 3 cols at `@xl` width. */
  isWide?: boolean;
};

export type IntegrationsBlock = {
  type: "integrations-09";
  id: string;
  headerTitleKey: MessageKey;
  headerBodyKey: MessageKey;
  ctaLabelKey: MessageKey;
  ctaHref: StaticAppPathname | `http${string}` | `#${string}`;
  groups: readonly [IntegrationsGroup, IntegrationsGroup, IntegrationsGroup];
};
