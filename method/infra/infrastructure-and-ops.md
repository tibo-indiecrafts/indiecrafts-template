# Infrastructure & operations

**Principle:** config is data, secrets are server-only, gates run once. Ship behind
a flag; roll back by flipping it.

## Plan first

- New env vars? public or secret?
- What gates the release — a feature flag?
- What runs in CI vs at commit?
- Cache / CDN implications?
- How do we turn it off fast if it breaks?

| Concern     | Generic rule                                             | In indiecrafts-template                                                                        |
| ----------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Config      | shared primitives + per-app instance data                | `@indiecrafts/config` + `apps/web/src/config/{theme,fonts,features,pages}.ts` (via `@/config`) |
| Secrets     | server-only env; commit the example, never the real file | `.env.example` (never `.env*`)                                                                 |
| Flags       | data flags gate routes + features                        | `features.*`, `pages.<id>.enabled`                                                             |
| CI gate     | typecheck + lint + format + build                        | `pnpm verify`                                                                                  |
| Commit gate | fast staged lint + full typecheck                        | pre-commit `lint-staged && tsc`                                                                |
| Build       | prerender static routes × locales                        | `pnpm build`                                                                                   |
| Logging     | structured logger, never console-swallow                 | `lib/logger.ts`                                                                                |

## Best practice

- **Config-as-data:** read brand / URLs / flags from config, never hardcode.
- **Secrets:** only server env; a public var can never hold a secret; commit
  `.env.example` only.
- **Flags are your kill-switch:** land dark, enable when ready, disable to roll
  back without a deploy.
- **Gate once:** one helper folds flag + page-enabled so routes can't drift.
- **CI is the backstop; the commit hook is the fast local gate.** Don't double-gate
  on push.
- **Give the compulsory gates teeth.** The debt/verify gates (`tech-debt.md`) are
  honor-system until a machine enforces them: install a pre-commit hook
  (husky + lint-staged + `tsc`) and a CI job per repo. Process rules block a careful
  human; the hook blocks everyone. Set this up via `project-bootstrap.md`.
- **Cache / CDN:** pick per-route caching intentionally; know your revalidation.
- **Observability:** log with context; surface errors, don't hide them.

## Expansion seams

- **Flag** → one config field + read at the gate.
- **Env var** → add to `.env.example` + read in one typed accessor.
- **Locale** → one config row + one messages file.

## Anti-patterns

Hardcoded URLs/keys · secret under `NEXT_PUBLIC_` · a route not covered by a gate ·
committing `.env` · checks that run on push but not commit (or vice-versa) · silent
failures.

## Definition of done

Secrets server-only · flag + rollback path exist · `.env.example` updated · verify
pipeline green · logging in place.
