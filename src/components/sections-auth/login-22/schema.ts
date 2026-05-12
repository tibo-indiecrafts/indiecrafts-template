import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@tailark/sign-up-2` (dusk-kit) — sign-up mirror of
 * `login-2` (login-15). Centered create-account form inside a
 * `bg-muted` ring with a nested `bg-card -m-px` inner card; the
 * `-m-px` outdent exposes the muted ring as a hairline frame.
 * Centered logo + heading + subtitle, 2-col Firstname/Lastname,
 * Username (email), Password (with inline forgot link), "Continue"
 * submit (upstream ships "Sign In" — corrected for sign-up context),
 * "Or continue With" dashed divider, 2-col Google + Microsoft OAuth.
 * Footer "Have an account? Sign In" sits in the muted gutter below.
 * Despite the `login-` slug this is a CREATE-ACCOUNT form (mirroring
 * the `login-09` / `login-17..21` naming convention).
 */
export type LoginBlock = {
  type: "login-22";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  googleHref?: StaticAppPathname | string;
  microsoftHref?: StaticAppPathname | string;
  forgotHref?: StaticAppPathname | string;
  signinHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
