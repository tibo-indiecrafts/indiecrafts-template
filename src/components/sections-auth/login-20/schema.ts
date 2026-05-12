import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@tailark/sign-up-3` (dusk-kit) — sign-up mirror of
 * `login-3` (login-13). Minimal passwordless create-account form:
 * logo + heading, a single full-width Google OAuth button, "Or
 * continue with" dashed divider, single email field, "Continue"
 * submit, inline "Sign In" footer. No card chrome. Despite the
 * `login-` slug this is a CREATE-ACCOUNT form (mirroring the
 * `login-09` / `login-17..19` naming convention).
 */
export type LoginBlock = {
  type: "login-20";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  googleHref?: StaticAppPathname | string;
  signinHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
