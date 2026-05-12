import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@tailark/veil-login-1` — full-screen sign-in with a
 * top logo strip and a centered "Welcome back" card. The card holds
 * email + password (with inline forgot link), a Sign-In submit, an
 * "or continue with" divider, and a 2-col Google / GitHub OAuth row.
 * Sign-up prompt sits below the card on the section background.
 */
export type LoginBlock = {
  type: "login-12";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  googleHref?: StaticAppPathname | string;
  githubHref?: StaticAppPathname | string;
  forgotHref?: StaticAppPathname | string;
  signupHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
