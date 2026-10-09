---
title: "Authentication (Clerk)"
description: "The web-app wiring for Clerk."
status: stable
---

# Authentication (Clerk)

The web-app wiring for Clerk. The cross-platform model — the bricks, the role, the
suspicious-login stance — is in [Authentication (cross-app)](/shared/architecture/auth). This
page covers the Next surfaces (`website`, `admin`, `app`).

## Opt-in

Auth is **off by default**, like Turnstile and Resend. It turns on only when the keys are
bound; with no key the provider and proxy no-op and the site runs exactly as before.

```bash
# .env — both required to turn auth on
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=   # PUBLIC — safe in the browser bundle
CLERK_SECRET_KEY=                    # SERVER-ONLY — never NEXT_PUBLIC_
```

The publishable key is public by design (the SDK reads it in the browser). The `guard.mjs`
pre-write hook allows the `*PUBLISHABLE*` name under `NEXT_PUBLIC_`; every real secret still
blocks.

## Provider

The root layout mounts the themed provider:

```tsx
// src/app/layout.tsx
import { AppClerkProvider } from "@indiecrafts/packages-web-auth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppClerkProvider>{children}</AppClerkProvider>;
}
```

`AppClerkProvider` returns `children` unchanged when no publishable key is set, and wraps
`<ClerkProvider>` (themed from the design tokens via `authAppearance()`) when it is. Admin and
app mount it in their locale layout like this.

### The website loads Clerk only when needed

Clerk costs about 135 kB of JS plus ~300 KiB of ClerkJS from its CDN, and most website visitors
never sign in. So the locale layout mounts it only when `shouldLoadClerk` (`src/lib/clerk-load.ts`)
says so: a **signed-in visitor** (`auth()`) or the **sign-in / sign-up pages**.

- Every Clerk piece the layout or header renders is code-split in `LazyClerk.tsx` (`next/dynamic`):
  the provider, the header's account menu, the signed-in legal notice, the session logger, the
  marketing nudge. Next bundles every client component a layout imports, so a static import would
  put Clerk back on every page.
- A signed-out visitor's header shows a plain **Sign in** link (`AuthMenu`) to
  `/sign-in?redirect_url=<here>` — a full page load, so the sign-in page renders with Clerk.
- Client components check `useClerkActive()` before using Clerk UI (its hooks throw without the
  provider). The locale switcher saves the language through `window.Clerk` (`persistLocale`).
- `RequireClerk` wraps the Clerk UI of the sign-in, sign-up and account pages: reached by a
  client-side navigation from a page rendered without Clerk, it reloads once.
- After sign-in Clerk navigates client-side and the layout keeps Clerk; after sign-out Clerk
  refreshes the route and the layout drops it.

## Middleware

`src/proxy.ts` wraps the existing maintenance → locale pipeline in `clerkMiddleware`, gated
on the same key so it stays inert when unconfigured:

```ts
const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
const proxy = clerkConfigured
  ? clerkMiddleware((_auth, request) => pipeline(request))
  : (request) => pipeline(request);
```

The `website` and `app` surfaces mount the provider for session context but **do not gate**
any route. Login is available; nothing is required.

## Admin gate (admin app only)

The `admin` app is the one surface that enforces the role. Enforcement is **in the data
layer**, not middleware alone:

- `isAdmin(await auth())` / `auth.protect()` in every admin server action, route handler,
  and protected layout.
- The middleware matcher includes admin `/api/*` and protected segments; the gate must
  **fail closed** when the JWT cannot be verified.
- Any authenticated admin endpoint composes `auth()` **and**
  `@indiecrafts/packages-shared-security` `withGuard` (`withGuard` has no auth concept).

The admin app renders sign-in only — no open sign-up on the admin surface.

## Session claims type

`src/global.d.ts` augments Clerk's `CustomJwtSessionClaims` from
`@indiecrafts/packages-shared-auth`, so `auth().sessionClaims.metadata.role` is typed.

## Sign-in UI + redirects

Every web surface renders **one** sign-in surface — `<SignInView>` from
`@indiecrafts/packages-web-auth`, which wraps Clerk's prebuilt `<SignIn>` (email OTP +
social, themed from tokens) at `/[locale]/sign-in/[[...sign-in]]`. The website header
shows a **Sign in** link to that page for a signed-out visitor (Clerk isn't loaded yet), and the
account menu once signed in, via `AuthMenu` (opt-in on the publishable key).

**Redirects (precedence):** a validated `redirect_url` → the app's home
(`fallbackRedirectUrl`, default `/`). A user bounced from a protected page returns there;
otherwise they land on that surface's own homepage. We pass only the fixed home; Clerk reads
and validates `redirect_url` itself against the instance's allowed origins, so an absolute or
cross-origin target never wins (open-redirect guard).

## Session sharing across surfaces

Put the surfaces on **subdomains of one root** (`acme.com`, `admin.acme.com`,
`app.acme.com`) and set the hosts in the `domains` registry
(`code/shared/scripts/lib/domains.mjs`). Clerk drops the session cookie on the parent
domain, so **all subdomains share the session automatically** — sign in once,
recognized everywhere — on the **free plan**, no extra config. Genuinely different
root domains would need Clerk **satellite domains** (a **paid** feature +
`allowedRedirectOrigins` + DNS) — out of scope for the template.
