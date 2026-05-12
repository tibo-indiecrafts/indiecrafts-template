import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@tailark/mist-forgot-password-1` — recover-password
 * mirror of `mist-login-1` / `mist-sign-up-1`. Plain centered form
 * on a `from-muted to-background` gradient section (no card chrome).
 * Logo + heading + subtitle, ring-style email field, "Send Reset
 * Link" submit, "Sign In" footer for users who remember.
 */
export type ForgotPasswordBlock = {
  type: "forgot-password-03";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  signinHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
