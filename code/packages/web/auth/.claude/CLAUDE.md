# @indiecrafts/packages-web-auth — themed Clerk provider (web tier)

**Stack:** TypeScript + React 19 + `@clerk/nextjs` (v7). DOM-coupled → **web scope** (it
themes DOM sign-in components, so it can't sit in `shared/`). Dep: `@indiecrafts/packages-shared-auth`
(the DOM-free role contract). Auto-loads under `code/packages/web/auth/**`. Subpath-only `exports`.

Consumed by the three Next surfaces (`website`, `admin`, `app`) **and** the Electron
renderer (Chromium/React 19, reuses web bricks) — 4 consumers.

- **`AppClerkProvider`** (`./provider`) — wraps `<ClerkProvider>` with `authAppearance()`.
  Wrap the **root** layout with it so `auth()` + the hosted `<SignIn>`/`<SignUp>` work
  app-wide. Reads `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (public key — allowed under
  `NEXT_PUBLIC_`) from the env. Server-component compatible.
- **`authAppearance()`** (`./appearance`) — Clerk `appearance.variables` mapped to the
  `@indiecrafts/packages-shared-ui-tokens` CSS custom properties (`var(--primary)`, …),
  so sign-in UI is token-themed with **no hard-coded brand color**. A colocated test
  fails if a raw hex/oklch sneaks in.

**Not here:** the role contract (`Roles`, `isAdmin`, claims type) lives in the DOM-free
`@indiecrafts/packages-shared-auth`. Middleware `clerkMiddleware` wrapping + the admin gate
stay in each app's own `src/proxy.ts` (no cross-app import); the admin-gate helper is added
here only when the admin app is wired.

Full design → [`code/docs/shared/architecture/auth.md`](../../../../docs/shared/architecture/auth.md).
