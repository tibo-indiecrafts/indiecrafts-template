import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@tailark/veil-login-3` — narrow centered sign-in
 * column (no card chrome). Centered logo + "Sign in" heading, email
 * + password form with "Continue" submit, top-border separator with
 * stacked Google + GitHub OAuth buttons, centered "Forgot password?"
 * link, "New here? Create account" footer.
 */
export type LoginBlock = {
  type: "login-16";
  id: string;
  titleKey?: MessageKey;
  googleHref?: StaticAppPathname | string;
  githubHref?: StaticAppPathname | string;
  forgotHref?: StaticAppPathname | string;
  signupHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
