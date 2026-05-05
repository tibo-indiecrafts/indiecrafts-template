import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/login-09` — sign-up card with a role Select,
 * first/last name + username + email + password (with visibility toggle)
 * + a terms checkbox containing two embedded links + a sign-in footer.
 * Despite the `login-` slug this is a CREATE-ACCOUNT form.
 */
export type LoginBlock = {
  type: "login-09";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  signinHref?: StaticAppPathname | string;
  termsHref?: StaticAppPathname | string;
  conditionsHref?: StaticAppPathname | string;
};
