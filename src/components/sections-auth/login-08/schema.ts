import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/login-08` — branded sign-in card with email,
 * password (with visibility toggle), remember-me, SSO button, reset
 * link, and a sign-up footer. All copy resolves through
 * `blocks.login-08.*`.
 */
export type LoginBlock = {
  type: "login-08";
  id: string;
  titleKey?: MessageKey;
  brandKey?: MessageKey;
  descriptionKey?: MessageKey;
  resetHref?: StaticAppPathname | string;
  ssoHref?: StaticAppPathname | string;
  signupHref?: StaticAppPathname | string;
};
