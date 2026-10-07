"use client";

/**
 * Load the Clerk-dependent pieces only where they render.
 *
 * @see docs/reference/projects/web/website/src/user-interface/account/LazyClerk.md
 */
import dynamic from "next/dynamic";

// The website mounts Clerk only for a signed-in visitor or on the sign-in / sign-up pages
// (`shouldLoadClerk`, decided by the locale layout). Next bundles every client component a
// layout imports, rendered or not, so each Clerk piece is code-split here: its chunk — and
// Clerk's own scripts from its CDN — load only when it renders. Import Clerk UI through this
// module, never statically, from anything the layout or the header reaches.

/** `AppClerkProvider`, client-side (here `ClerkProvider` is Clerk's client provider). */
export const LazyClerkProvider = dynamic(() =>
  import("@indiecrafts/packages-web-auth/provider").then((m) => m.AppClerkProvider),
);

/** The header's signed-in account menu / signed-out sign-in modal. */
export const LazyClerkAuthMenu = dynamic(() =>
  import("@/user-interface/shared/layout/ClerkAuthMenu").then((m) => m.ClerkAuthMenu),
);

/** The "policies updated" banner with the cross-surface (api) acceptance sync. */
export const LazySignedInLegalNotice = dynamic(() =>
  import("@/user-interface/legal/SignedInLegalNotice").then((m) => m.SignedInLegalNotice),
);

/** Logs session starts to the api (security audit). */
export const LazySessionLogger = dynamic(() =>
  import("@indiecrafts/packages-web-auth/session-logger").then((m) => m.SessionLogger),
);

/** The signed-in marketing-email opt-in nudge. */
export const LazyMarketingNudgeMount = dynamic(() =>
  import("@indiecrafts/packages-web-auth/marketing-nudge").then(
    (m) => m.MarketingNudgeMount,
  ),
);
