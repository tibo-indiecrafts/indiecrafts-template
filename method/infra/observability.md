# Observability & operations signal

**Principle:** you can't operate what you can't see. Stand up error tracking + logs
at ship so `/canary` and `/retro` have signal.

## Best practice

- **Error tracking** (e.g. Sentry) — capture exceptions with context (user, release,
  request). Alert on new or spiking errors.
- **Structured logs** — one logger, levels, correlation id; never `console.log`-
  swallow. No secrets or PII in logs.
- **Metrics** — Core Web Vitals + key business events; a release marker so a
  regression maps to a deploy.
- **Health / canary** — a smoke check post-deploy; `/canary` baselines; roll back on
  regression.

## Plan first (at `03_PLAN` infra design)

What errors go where · what logs · what metrics · what alerts · who is paged.

Provision at `07_SHIP`; review at `08_REFLECT`.

## Anti-patterns

Ship with no error tracking · logs with secrets · no release marker · alerts nobody
sees.
