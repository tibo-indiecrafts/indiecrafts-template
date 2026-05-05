import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/login-06` — passwordless-first card: magic
 * link primary, password fallback, SSO. Includes a "first time here?
 * Sign up" prompt and legal copy. All copy resolves through
 * `blocks.login-06.*`.
 */
export type LoginBlock = {
  type: "login-06";
  id: string;
  titleKey?: MessageKey;
  signupHref?: StaticAppPathname | string;
  passwordSigninHref?: StaticAppPathname | string;
  ssoHref?: StaticAppPathname | string;
  termsHref?: StaticAppPathname | string;
  privacyHref?: StaticAppPathname | string;
};
