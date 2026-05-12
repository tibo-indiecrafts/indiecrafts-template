import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@tailark/veil-sign-up-1` — sign-up mirror of
 * `veil-login-1` (login-12): top logo strip + centered "Create an
 * account" card. The card holds email + password, a "Create Account"
 * submit, "or continue with" divider, and a 2-col Google / GitHub
 * OAuth row. Sign-in prompt sits below the card. Despite the
 * `login-` slug this is a CREATE-ACCOUNT form (mirroring `login-09`
 * / `login-17` / `login-18` naming convention).
 */
export type LoginBlock = {
  type: "login-19";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  googleHref?: StaticAppPathname | string;
  githubHref?: StaticAppPathname | string;
  signinHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
