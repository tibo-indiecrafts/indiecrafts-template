# Sanity infra — CLAUDE.md

Core, feature-agnostic Sanity wiring. The blog **content model** (schema / queries / types / desk) lives in `src/features/blog/sanity/` — see `src/features/blog/CLAUDE.md`.

## Modules

- `client.ts` — read client for RSC queries (`useCdn: false`).
- `live.ts` — `defineLive`. `<SanityLive />` is mounted in the layout **only when `features.blog`** (it revalidates public pages). `sanityFetchLive` switches to the `drafts` perspective under draft mode.
- `env.ts` / `token.ts` — `NEXT_PUBLIC_SANITY_*` (public) + `SANITY_API_READ_TOKEN` (server-only).
- `Studio.tsx` — `"use client"` wrapper around `<NextStudio>`. `image.ts` — `urlFor(source)`.

## Rules

- **Never** instantiate a new `createClient` per route — fetch through `sanityFetchLive` (draft-mode aware) or `@/sanity/client`.
- **Never** expose `SANITY_API_READ_TOKEN` (or any non-public token) under a `NEXT_PUBLIC_` prefix.
- Draft mode: `/api/draft-mode/{enable,disable}` toggle the perspective — gated by `features.studio`, requires the read token.

## Wiring

Set `NEXT_PUBLIC_SANITY_PROJECT_ID` + `NEXT_PUBLIC_SANITY_DATASET` (`.env.example`). The CSP in `next.config.ts` already allows `https://*.sanity.io` + `wss://*.api.sanity.io`. Root `sanity.config.ts` registers `src/features/blog/sanity/schema` + `structure`.
