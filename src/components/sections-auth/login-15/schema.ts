import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@tailark/login-2` (dusk-kit) — centered sign-in form
 * inside a `bg-muted` ring with a nested `bg-card -m-px` inner card
 * (the -m-px trick exposes the muted ring as a hairline frame).
 * Centered logo + heading + subtitle, email + password (with inline
 * forgot link), Sign-In submit, "Or continue With" dashed divider,
 * 2-col Google + Microsoft OAuth. Footer ("Don't have an account?
 * Create account") sits in the muted gutter below the inner card.
 */
export type LoginBlock = {
  type: "login-15";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  googleHref?: StaticAppPathname | string;
  microsoftHref?: StaticAppPathname | string;
  forgotHref?: StaticAppPathname | string;
  signupHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
