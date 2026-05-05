import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/login-04` — branded sign-in: logo + brand name
 * + sign-up prompt + GitHub/Google CTAs + email/password + reset link.
 * All copy resolves through `blocks.login-04.*`; routing destinations
 * are caller-driven so the same block plugs into any auth backend.
 */
export type LoginBlock = {
  type: "login-04";
  id: string;
  titleKey?: MessageKey;
  brandKey?: MessageKey;
  signupHref?: StaticAppPathname | string;
  githubHref?: string;
  googleHref?: string;
  resetHref?: StaticAppPathname | string;
};
