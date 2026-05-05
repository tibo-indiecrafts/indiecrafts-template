import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/login-07` — sign-in card with Google CTA,
 * icon-decorated email/password fields with password visibility toggle,
 * remember-me checkbox, forgot-password link, and create-account link.
 */
export type LoginBlock = {
  type: "login-07";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  googleHref?: string;
  forgotHref?: StaticAppPathname | string;
  signupHref?: StaticAppPathname | string;
};
