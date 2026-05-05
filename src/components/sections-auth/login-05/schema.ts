import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/login-05` — workspace sign-up card with logo,
 * name + email + password + confirm + newsletter checkbox + legal copy
 * + a sign-in link for returning users. Despite the `login-` slug this
 * is a CREATE-ACCOUNT form.
 */
export type LoginBlock = {
  type: "login-05";
  id: string;
  titleKey?: MessageKey;
  signinHref?: StaticAppPathname | string;
  termsHref?: StaticAppPathname | string;
  privacyHref?: StaticAppPathname | string;
};
