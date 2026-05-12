import type { StaticAppPathname } from "@/config/routes.types";

/**
 * Block from `@tailark/mist-login-1` — passwordless sign-in form
 * with a logo + split-color welcome heading, three stacked OAuth
 * buttons (Google / Facebook / Microsoft), divider, single email
 * field, "Continue" CTA, and a "Create account" footer link. No
 * card chrome — the form sits directly on a `from-muted to-background`
 * gradient section. The split-color heading uses `t.rich` with a
 * `<muted>` tag and is therefore always resolved from this section's
 * own namespace (no `headingKey` override — edit `en.json` instead).
 */
export type LoginBlock = {
  type: "login-11";
  id: string;
  googleHref?: StaticAppPathname | string;
  facebookHref?: StaticAppPathname | string;
  microsoftHref?: StaticAppPathname | string;
  signupHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
