# @indiecrafts/web-surfaces-app

A lean Next.js web surface (`next-cf`: Next → OpenNext → Cloudflare Workers) with the shared
i18n/compliance/version baseline wired. Not a content surface — add `sanity` or other content
bricks only when a real page needs them.

**Status: sidebar shell shipped.** A shadcn `SidebarProvider` shell (flat nav, a no-flash
light/dark `ThemeToggle`, a `LocaleSwitcher`, `NavUser` with Legal + Sign out) wraps three pages —
Home, Account, Legal — each with the `PageHeader` + `Card` treatment. `sign-in` stays outside the
`(app)` shell, unshelled. Components are app-owned — no Storybook. See `.claude/CLAUDE.md` for the
full layout + wired-baseline notes.

**Deploy:** `pnpm deploy:web:app:<dev|staging|prod>` → the shared `scripts/deploy/next.mjs`; or
`pnpm deploy:all:<env>`. Registry row: [`scripts/lib/apps.mjs`](../../../../shared/scripts/lib/apps.mjs).
