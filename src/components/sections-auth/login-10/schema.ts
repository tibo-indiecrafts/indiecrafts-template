import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@tailark/login-1` (dusk-kit) — sign-in card with logo,
 * Google + Microsoft SSO buttons, username + password (with a forgot
 * link inline), submit, and a "Create account" footer in an inset
 * muted box. Form is presented as a self-contained card with a
 * 0.5-unit inner gutter around the footer.
 */
export type LoginBlock = {
  type: "login-10";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  googleHref?: StaticAppPathname | string;
  microsoftHref?: StaticAppPathname | string;
  forgotHref?: StaticAppPathname | string;
  signupHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
