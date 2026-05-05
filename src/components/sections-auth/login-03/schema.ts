import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/login-03` — minimal email + password sign-in
 * with a centered welcome heading and a "reset password" link in the
 * footer. All copy resolves through `blocks.login-03.*`.
 */
export type LoginBlock = {
  type: "login-03";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  resetHref?: StaticAppPathname | string;
};
