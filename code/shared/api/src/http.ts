/**
 * The api's HTTP edge: request ids, the error envelope, 429 hints, the top-level catch, and
 * timeouts for outbound calls.
 *
 * @see docs/reference/shared/api/src/http.md
 */
// One exit point for every response (`finalize`), so the route handlers keep returning a
// plain `{ error: "<code>" }` and the contract — `message` + `requestId` + `X-Request-Id`,
// the 429 retry hints — is added in one place. See the api brief, "Production-ready contract".
import { logger } from "@indiecrafts/packages-shared-logger";

/** Developer-facing text per error code; a code not listed gets GENERIC. */
export const ERROR_MESSAGES: Record<string, string> = {
  unauthorized: "Missing or invalid credentials.",
  forbidden: "These credentials cannot do this.",
  invalid: "The request body or parameters are invalid.",
  not_found: "Nothing exists at this id.",
  method_not_allowed: "This route does not accept that method.",
  too_large: "The request body is too large.",
  rate_limited: "Too many requests — retry after the Retry-After delay.",
  too_many_attempts: "Too many attempts on this link — request a new one.",
  unavailable: "The api is missing configuration for this route.",
  schema_behind:
    "The database is missing migrations — run the db:migrate script for this env.",
  internal:
    "Unexpected error — retry once; report the requestId if it persists.",
  invalid_idempotency_key:
    "Idempotency-Key must be 1–255 printable characters.",
  idempotency_in_progress:
    "A request with this Idempotency-Key is still running — retry shortly.",
  idempotency_key_reused:
    "This Idempotency-Key was used with a different request.",
};
const GENERIC = "The request failed — see the error code.";

/** Mirrors the `RATELIMIT` binding in wrangler.toml (`simple = { limit = 20, period = 60 }`). */
export const RATE_LIMIT = { limit: 20, period: 60 } as const;

/** Cloudflare's `cf-ray` (searchable in the dashboard logs); a uuid where there is none (local dev). */
export function requestIdOf(request: Request): string {
  return request.headers.get("cf-ray") ?? crypto.randomUUID();
}

/** Every response gets X-Request-Id; a JSON error gains `message` + `requestId`; a
 *  `rate_limited` 429 gains Retry-After + RateLimit-Policy. Other bodies pass through untouched
 *  (never buffered — the export download streams). */
export async function finalize(
  res: Response,
  requestId: string,
): Promise<Response> {
  const headers = new Headers(res.headers);
  headers.set("x-request-id", requestId);
  const isJsonError =
    res.status >= 400 &&
    (headers.get("content-type") ?? "").includes("application/json");
  if (!isJsonError)
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers,
    });

  let body: Record<string, unknown>;
  try {
    body = (await res.clone().json()) as Record<string, unknown>;
  } catch {
    return new Response(res.body, { status: res.status, headers });
  }
  if (typeof body.error !== "string")
    return new Response(JSON.stringify(body), { status: res.status, headers });

  if (res.status === 429 && body.error === "rate_limited") {
    headers.set("retry-after", String(RATE_LIMIT.period));
    headers.set(
      "ratelimit-policy",
      `${RATE_LIMIT.limit};w=${RATE_LIMIT.period}`,
    );
  }
  const message =
    typeof body.message === "string"
      ? body.message
      : (ERROR_MESSAGES[body.error] ?? GENERIC);
  return new Response(JSON.stringify({ ...body, message, requestId }), {
    status: res.status,
    headers,
  });
}

/** The top-level catch: a missing table/column is a deploy that skipped its migrations. */
export function errorFromThrow(error: unknown, requestId: string): Response {
  const text = String((error as Error)?.message ?? error);
  const schema = /no such (table|column)/i.test(text);
  logger.error(schema ? "schema behind" : "unhandled error", {
    requestId,
    name: (error as Error)?.name,
  });
  return new Response(
    JSON.stringify({ error: schema ? "schema_behind" : "internal" }),
    {
      status: schema ? 503 : 500,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
    },
  );
}

/** fetch that aborts after `ms` — an outbound call never outlives its caller. */
export function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  ms = 5000,
): Promise<Response> {
  return fetch(input, { ...init, signal: AbortSignal.timeout(ms) });
}

/** For SDK calls that take no AbortSignal (Clerk): reject after `ms`. */
export function withTimeout<T>(
  p: Promise<T>,
  ms = 5000,
  label = "call",
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return Promise.race([
    p.finally(() => clearTimeout(timer)),
    new Promise<never>((_resolve, reject) => {
      timer = setTimeout(
        () =>
          reject(
            Object.assign(new Error(`${label} timed out`), {
              name: "TimeoutError",
            }),
          ),
        ms,
      );
    }),
  ]);
}
