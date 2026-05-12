import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@tailark/veil-forgot-password-2` — recover-password
 * mirror of `veil-login-2` (login-14) / `veil-sign-up-2` (login-21).
 * Minimal card on a `bg-muted rounded-2xl border p-8` tinted surface.
 * Logo + heading + subtitle, single email field, "Send Reset Link"
 * submit, "Sign in" footer.
 */
export type ForgotPasswordBlock = {
  type: "forgot-password-05";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  signinHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
