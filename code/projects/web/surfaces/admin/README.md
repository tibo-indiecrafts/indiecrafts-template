# @indiecrafts/web-surfaces-admin

A **separate, auth-gated Next.js admin dashboard** (moderation · ops · content review) over the shared
Sanity dataset. Not public — behind auth, `noindex`, own subdomain.

**Status: dashboard shell shipped.** A shadcn `SidebarProvider` shell (grouped sidebar nav, sticky
header with breadcrumbs, light/dark theme toggle) wraps an Overview landing and every ops page
(Users, Sessions, Data requests, CSP, Backups, System, Settings, Security), each with a consistent
`PageHeader` + `Card` + shadcn `Table`/form treatment. Components are app-owned — no Storybook. See
`.claude/CLAUDE.md` for the full layout + before-shipping notes.
