import type { AppSessionClaims } from "@indiecrafts/packages-shared-auth";

// Type Clerk's session-token claims from the one shared home (`shared/auth`), so
// `auth().sessionClaims.metadata.role` is typed and `isAdmin` reads a known shape.
// (Locale typing stays loose here, like the `app` surface — only the website
// narrows next-intl's `AppConfig.Locale`.)
declare global {
  interface CustomJwtSessionClaims extends AppSessionClaims {}
}

export {};
