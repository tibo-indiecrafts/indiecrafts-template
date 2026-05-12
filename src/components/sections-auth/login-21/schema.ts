import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@tailark/veil-sign-up-2` — sign-up mirror of
 * `veil-login-2` (login-14). Minimal create-account card on a
 * `bg-muted rounded-2xl border p-8` tinted surface. Logo + heading
 * + subtitle, single email field with "Continue with Email" CTA,
 * "or" divider, then stacked full-width Google + GitHub OAuth
 * buttons. "Sign in" prompt centered below. Despite the `login-`
 * slug this is a CREATE-ACCOUNT form (mirroring the `login-09` /
 * `login-17..20` naming convention).
 */
export type LoginBlock = {
  type: "login-21";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  googleHref?: StaticAppPathname | string;
  githubHref?: StaticAppPathname | string;
  signinHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
