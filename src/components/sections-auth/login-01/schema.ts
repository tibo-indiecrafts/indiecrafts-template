import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

/**
 * Block from `@blocks-so/login-01` — minimal email + Google sign-in form
 * with a footer linking to terms / privacy. All copy resolves through
 * `blocks.login-01.*`; routing destinations are caller-driven so the
 * same block can render under `/login`, `/signin`, or a sub-app variant.
 */
export type LoginBlock = {
  type: "login-01";
  id: string;
  /** Visually-hidden landmark caption + heading for the form. */
  titleKey?: MessageKey;
  /** Where the Google CTA points; leave undefined to render `#` (no-op). */
  googleHref?: string;
  /** Internal route the legal "terms of service" link points at. */
  termsHref?: StaticAppPathname | string;
  /** Internal route the legal "privacy policy" link points at. */
  privacyHref?: StaticAppPathname | string;
};
