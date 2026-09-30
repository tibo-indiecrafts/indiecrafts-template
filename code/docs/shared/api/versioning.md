---
title: "API versioning"
description: "What may change inside /v1, what needs /v2, and how a route is deprecated."
status: stable
---

# API versioning

> `/v1` is a promise: a caller written against it keeps working until a documented sunset date.

## Inside `/v1` (additive — ships any time)

- A new route.
- A new **optional** request field, or a new field in a response.
- A new error `code` (callers branch on the codes they know and treat the rest as the status says).
- A looser limit (larger body, higher rate).
- A new header (`X-Request-Id`, `Idempotent-Replayed`).

## Needs `/v2` (breaking)

- Removing or renaming a route, a field or an error code.
- A field that changes meaning or type, or a new **required** field.
- Stricter validation that rejects a request `/v1` accepted.
- A different status code for the same situation.

## How a breaking change ships

1. The new behaviour ships as `/v2/<route>`; `/v1/<route>` keeps working, unchanged, for **at least
   90 days**.
2. `/v1/<route>` answers with `Deprecation: @<unix time>` ([RFC 9745](https://www.rfc-editor.org/rfc/rfc9745)),
   `Sunset: <HTTP date>` ([RFC 8594](https://www.rfc-editor.org/rfc/rfc8594)) and
   `Link: <https://…/shared/api/versioning>; rel="deprecation"`.
3. The api changelog (`code/shared/api/CHANGELOG.md`) records the change, the new route and the sunset
   date; every first-party caller moves before it.
4. After the sunset date the old route answers `410 Gone` with `{ "error": "gone" }`.

No route is deprecated today.
