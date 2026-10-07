# `@indiecrafts/packages-web-auth` — themed Clerk provider (web tier)

**Stack:** TypeScript + React 19 + `@clerk/nextjs` (v7). DOM-coupled → **web scope** (it
themes DOM sign-in components, so it can't sit in `shared/`). Deps: `@indiecrafts/packages-shared-auth`
(the DOM-free role contract), plus `packages-web-i18n` + `packages-shared-config` for the account
Language tab (`./account`). Auto-loads under `code/packages/web/auth/**`. Subpath-only `exports`.

Consumed by the three Next surfaces (`website`, `admin`, `app`) — 3 consumers.

- **`AppClerkProvider`** (`./provider`) — wraps `<ClerkProvider>` with `authAppearance()`.
  Wrap the **root** layout with it so `auth()` + the hosted `<SignIn>`/`<SignUp>` work
  app-wide. Reads `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (public key — allowed under
  `NEXT_PUBLIC_`) from the env. Server-component compatible.
  `signUpPath="/sign-up"` (website, app) makes Clerk's "Sign up" links open the app's own
  localized page; admin has no sign-up page and omits it.
- **`SignInModalButton`** (`./sign-in-modal-button`) — the header sign-in button. Clerk signs up
  INSIDE its modal with no metadata, so this opens it with `unsafeMetadata.locale` (else the
  welcome email falls back to English). `<SignInButton>` can't pass metadata.
- **`authAppearance()`** (`./appearance`) — Clerk `appearance.variables` mapped to the
  `@indiecrafts/packages-web-ui-tokens` CSS custom properties (`var(--primary)`, …),
  so sign-in UI is token-themed with **no hard-coded brand color**. A colocated test
  fails if a raw hex/oklch sneaks in.
- **`usePersistLocale()`** (`./persist-locale`) — a `(locale) => void` a surface's locale
  switcher calls to mirror an explicit language change to the signed-in user's Clerk
  `unsafeMetadata.locale`. The api's `user.updated` webhook then updates `user_profiles.locale`,
  so transactional/auth emails follow the user's CURRENT language, not just the sign-up one.
  Merges existing metadata, no-ops when signed out / unchanged, best-effort (logs on failure).

**Not here:** the role contract (`Roles`, `isAdmin`, claims type) lives in the DOM-free
`@indiecrafts/packages-shared-auth`. Middleware `clerkMiddleware` wrapping + the admin gate
stay in each app's own `src/proxy.ts` (no cross-app import); the admin-gate helper is added
here only when the admin app is wired.

Full design → [`code/docs/shared/architecture/auth.md`](../../../../docs/shared/architecture/auth.md).
