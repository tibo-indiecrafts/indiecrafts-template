import type { AppSessionClaims } from "@indiecrafts/packages-shared-auth";

// Type Clerk's session-token claims from the one shared home (`shared/auth`).
// (Locale typing stays loose here, like the surface's other pages.)
declare global {
  interface CustomJwtSessionClaims extends AppSessionClaims {}
}

export {};
