import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@tailark/login-3` (dusk-kit) — minimal passwordless
 * sign-in: logo + heading, a single full-width Google OAuth button,
 * "Or continue with" dashed divider, single email field, "Continue"
 * submit, inline "Create account" footer. No card chrome — plain
 * centered form on the section background.
 */
export type LoginBlock = {
  type: "login-13";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  googleHref?: StaticAppPathname | string;
  signupHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
