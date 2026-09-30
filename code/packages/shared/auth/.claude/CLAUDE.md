# `@indiecrafts/packages-shared-auth` — role contract (DOM-free)

**Stack:** TypeScript. Pure, framework-agnostic (no Clerk/React/Next/DOM import — the
`shared/` scope rule). The portable authorization contract every platform's Clerk SDK reads.
No dependencies. Auto-loads under `code/packages/shared/auth/**`. Subpath-only `exports`.

- **`Roles`** — the gated-role union. One home for the role string; currently just `"admin"`.
  Widen when a second gated role ships (a `moderator`, if added, must NOT pass `isAdmin`).
- **`AppSessionClaims`** — the custom session-token claim shape (`metadata.role`). The single
  home for the shape; each app augments Clerk's ambient `CustomJwtSessionClaims` FROM this type:

  ```ts
  // <app>/src/types/globals.d.ts
  import type { AppSessionClaims } from "@indiecrafts/packages-shared-auth";
  declare global {
    interface CustomJwtSessionClaims extends AppSessionClaims {}
  }
  export {};
  ```

- **`isAdmin(claims)`** — strict `role === "admin"`. The only exported gate. Enforce it
  **server-side** in every admin server action / route handler / protected layout — middleware
  is coarse routing and is bypassable (Next.js CVE-2025-29927), never the sole boundary.

The role rides the signed JWT via the Clerk dashboard claim
`{ "metadata": "{{user.public_metadata}}" }`; `publicMetadata` is backend-writable only, so the
claim is tamper-proof. The web **provider** + Clerk `appearance` theming live in the web-tier brick
**`@indiecrafts/packages-web-auth`** (DOM-coupled) — never here.

Full design → [`code/docs/shared/architecture/auth.md`](../../../../docs/shared/architecture/auth.md).
