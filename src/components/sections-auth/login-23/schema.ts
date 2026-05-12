import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@tailark/veil-sign-up-3` — sign-up mirror of
 * `veil-login-3` (login-16). Narrow centered create-account column
 * (no card chrome): centered logo + "Sign up" heading, email +
 * password form with "Continue" submit, top-border separator with
 * stacked Google + GitHub OAuth buttons, "Already have an account?
 * Sign in" footer. Despite the `login-` slug this is a
 * CREATE-ACCOUNT form (mirroring the `login-09` / `login-17..22`
 * naming convention).
 */
export type LoginBlock = {
  type: "login-23";
  id: string;
  titleKey?: MessageKey;
  googleHref?: StaticAppPathname | string;
  githubHref?: StaticAppPathname | string;
  signinHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
