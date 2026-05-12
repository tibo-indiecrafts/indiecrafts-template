import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@tailark/forgot-password-1` (dusk-kit) — recover-password
 * form sharing the `login-2` / `login-15` shape: `bg-muted` ring with
 * a nested `bg-card -m-px` inner card. Logo + heading + subtitle,
 * email field, "Send Reset Link" submit, helper text, footer
 * "Remembered your password? Log in" in muted gutter.
 */
export type ForgotPasswordBlock = {
  type: "forgot-password-02";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  signinHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
