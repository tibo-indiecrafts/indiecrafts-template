import type { routing } from "@/i18n/routing";
import type { AppSessionClaims } from "@indiecrafts/packages-shared-auth";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    // Messages type intentionally left loose so config-driven `t(key)` calls
    // with runtime-dynamic keys compile. Missing translations are surfaced by
    // next-intl at request time (warnings) and covered by lint rules.
  }
}

// Type Clerk's session-token claims from the one shared home (`shared/auth`), so
// `auth().sessionClaims.metadata.role` is typed and `isAdmin` reads a known shape.
declare global {
  interface CustomJwtSessionClaims extends AppSessionClaims {}
}
