# API & data layer

**Principle:** the boundary is where you validate and type. Inside is trusted;
outside is not. One data-access layer, one client.

## Plan first

- Read or write? public or authed?
- **Route handler** (REST-ish, cacheable, external callers) or **server action**
  (mutation from your own UI)?
- Input shape — validate at the boundary.
- Failure modes — what errors, what status, what gets logged?
- Cache / revalidate strategy?

| Concern       | Generic rule                                                      | In indiecrafts-template                 |
| ------------- | ----------------------------------------------------------------- | --------------------------------------- |
| Read endpoint | route handler under `app/api/...`                                 | `app/api/i18n/translated-slug/route.ts` |
| Data access   | one shared client, typed queries — never `new Client()` per route | `@/sanity/client`, `sanity/queries.ts`  |
| Validation    | parse + validate input at the edge (e.g. zod)                     | query params guarded before use         |
| Errors        | never swallow — log + return typed error/status                   | `logger.error(...)` minimum             |
| Auth          | check on the server, per request                                  | route-gate + server-only token          |
| Secrets       | server-only; never `NEXT_PUBLIC_` a secret                        | `SANITY_API_READ_TOKEN`                 |

## Best practice

- **Handler vs action:** handler for GET/data + external callers; action for
  form/mutation from your own components.
- Validate every external input (params, body, headers) with a schema; reject early.
- Return typed results; map errors to status codes; log with context, never leak
  internals to the caller.
- Keep queries in one module, typed; reuse one client instance.
- Idempotency for writes; pagination for lists; version the contract if external
  consumers exist.
- Cache deliberately: pick `force-cache` / `revalidate` / `no-store` per route and
  say why.

## Expansion seams

- **Endpoint** → one `route.ts` + one query in the data module + one type.
- **Entity** → schema + query + type + (if routed) a gated route.

## Anti-patterns

Business logic in the route file · unvalidated input · per-route client instances ·
swallowed errors · secret under `NEXT_PUBLIC_` · N+1 queries in a loop.

## Definition of done

Input validated · errors logged + typed · auth checked server-side · no secret
client-exposed · query typed and reused.
