import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@tailark/veil-login-2` — minimal sign-in card on a
 * `bg-muted rounded-2xl border p-8` tinted surface. Logo + heading
 * + subtitle, single email field with "Continue with Email" CTA,
 * "or" divider, then stacked full-width Google + GitHub OAuth
 * buttons. Sign-up prompt centered below.
 */
export type LoginBlock = {
  type: "login-14";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  googleHref?: StaticAppPathname | string;
  githubHref?: StaticAppPathname | string;
  signupHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
