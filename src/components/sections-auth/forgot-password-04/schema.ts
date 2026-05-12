import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@tailark/veil-forgot-password-1` — recover-password
 * mirror of `veil-login-1` (login-12) / `veil-sign-up-1` (login-19):
 * full-viewport 2-row grid (logo strip on top, centered card below).
 * Card holds an email field and "Send Reset Link" submit. Sign-in
 * prompt sits below the card.
 */
export type ForgotPasswordBlock = {
  type: "forgot-password-04";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  signinHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
