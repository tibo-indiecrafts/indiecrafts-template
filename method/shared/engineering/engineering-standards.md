# Engineering standards (cross-cutting)

Applies to every slice. Check at `05_REVIEW` / `06_TEST`.

## Testing pyramid

Many fast unit tests, fewer integration, few end-to-end. A bug fix starts with a
failing repro. Test behavior, not implementation.

## Security (trust boundaries)

- Validate all external input at the boundary.
- Secrets server-only; least privilege on tokens.
- Authorize on the server, per request; never trust the client.
- No sensitive data in URLs or logs.

## Performance budgets

Server-render by default; ship less JS; lazy-load heavy client parts; measure Core
Web Vitals; avoid N+1 data access.

## Accessibility baseline

Semantic HTML; keyboard + `focus-visible`; never color alone for state; contrast
AA; verify at 375/768/1280. `jsx-a11y` as errors.

## Code review

Every changed line traces to the request; surgical diffs; reuse before adding; no
dead code left behind.

## Definition of done (feature)

- Route gated · strings externalized · tokens not raw values.
- Input validated · errors logged · no client-exposed secret.
- Responsive + a11y checked · tests for the new behavior pass.
- **Debt reduced in-change** — touched files left cleaner, `ponytail-audit` run,
  deliberate corners marked `ponytail:` (`tech-debt.md` gate green).
- Docs + index updated · typecheck + lint clean · rollback path (flag) exists.
