# Engineering playbook (shared — cross-cutting)

Reusable engineering knowledge that applies to **every** concern. Concern-specific
guidance lives with its concern (see below). Each doc gives the generic best
practice first, then how `indiecrafts-template` does it. Read the docs your change
touches **before** `03_PLAN`.

**Thesis:** a feature is a **vertical slice** — colocated, flag-gated, expandable.
Grow the system by adding one file plus one index line, never by editing a monolith.

## Cross-cutting (here in `shared/`)

| Doc                                                      | Read before     | Covers                                                                                |
| -------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------- |
| [`principles.md`](./principles.md)                       | **every build** | Karpathy rules + simple/hyper-scalable/maintainable doctrine                          |
| [`tech-debt.md`](./tech-debt.md)                         | **every build** | compulsory reduce-while-coding gate — blocks commit                                   |
| [`issue-tags.md`](./issue-tags.md)                       | review/build    | the fixed `@complexity`/`@refactor`/`@debt` triage vocabulary + `tags-report` tooling |
| [`testing.md`](./testing.md)                             | plan/test       | Vitest + Testing Library + Playwright stack, what to test                             |
| [`git-and-pr.md`](./git-and-pr.md)                       | build/ship      | branch · commit · PR convention                                                       |
| [`engineering-standards.md`](./engineering-standards.md) | review/test     | testing, security, perf, a11y, Definition of Done                                     |
| [`../writing-style.md`](../writing-style.md)             | any output      | how the agent writes docs/comments/commits (STE)                                      |

## Concern-specific (mirrors the code)

| Concern                              | Method                                                          | Covers                                                                       |
| ------------------------------------ | --------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `code/projects/web/surfaces/website` | [`../../apps/web/`](../../apps/web/README)                      | frontend rules + repeatable task workflows                                   |
| `code/modules`                       | [`../../modules/architecture.md`](../../modules/architecture)   | vertical-slice feature architecture (RSC, gating, seams)                     |
| `code/packages`                      | [`../../packages/api-and-data.md`](../../packages/api-and-data) | API surface + data layer (validation, one client)                            |
| `code/infra`                         | [`../../infra/`](../../infra/README)                            | infrastructure-and-ops · observability                                       |
| `code/shared/db`                     | [`../../db/database.md`](../../db/database)                     | Cloudflare D1: schema · forward-only migrations · seed · Time Travel backups |

## How to use

1. `03_PLAN` — read the cross-cutting docs + the concern doc(s) your change touches.
2. `04_BUILD` — build to the concern's method; clear the **compulsory** `tech-debt.md` gate before every commit.
3. `05_REVIEW` / `06_TEST` — check against `engineering-standards`.

## Links

- **Live:** `<production URL>` · **Repo:** `<git URL>` · **Deploy:** `<Netlify/Vercel dashboard>`

<!-- Template placeholders — fill per project; canonical URLs live in the root README. -->
