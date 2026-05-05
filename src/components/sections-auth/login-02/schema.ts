import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/login-02` — email + password sign-in with a
 * Google CTA and legal footer. All copy resolves through
 * `blocks.login-02.*`; routing destinations are caller-driven.
 */
export type LoginBlock = {
  type: "login-02";
  id: string;
  titleKey?: MessageKey;
  googleHref?: string;
  termsHref?: StaticAppPathname | string;
  privacyHref?: StaticAppPathname | string;
};
