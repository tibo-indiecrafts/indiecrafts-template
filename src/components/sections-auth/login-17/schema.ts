import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@tailark/sign-up-1` — sign-up form sharing the
 * "card with inset muted footer" shape from `login-1`: top section
 * holds logo + heading + 2-col Google/Microsoft OAuth row + dashed
 * divider + firstname/lastname (2-col) + username + password
 * + "Continue" submit; muted footer holds "Have an account? Sign In"
 * inline link. Despite the `login-` slug this is a CREATE-ACCOUNT
 * form (mirroring `login-09`'s naming convention in this folder).
 */
export type LoginBlock = {
  type: "login-17";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  googleHref?: StaticAppPathname | string;
  microsoftHref?: StaticAppPathname | string;
  signinHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
