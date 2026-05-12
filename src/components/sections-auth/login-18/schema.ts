import type { StaticAppPathname } from "@/config/routes.types";

/**
 * Block from `@tailark/mist-sign-up-1` — sign-up mirror of
 * `mist-login-1`: passwordless create-account form with logo +
 * split-color welcome heading, three stacked OAuth buttons (Google
 * / Facebook / Microsoft), divider, single email field, "Continue"
 * CTA, "Already have an account? Sign In" footer. Sits on a
 * `from-muted to-background` gradient section, no card chrome.
 * Despite the `login-` slug this is a CREATE-ACCOUNT form (mirroring
 * `login-09` / `login-17` naming convention).
 */
export type LoginBlock = {
  type: "login-18";
  id: string;
  googleHref?: StaticAppPathname | string;
  facebookHref?: StaticAppPathname | string;
  microsoftHref?: StaticAppPathname | string;
  signinHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
