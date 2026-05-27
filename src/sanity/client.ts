import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, studioBasePath } from "./env";

/**
 * Read-only Sanity client for fetching published content in server
 * components. `useCdn: false` is safer for ISR/RSC — keeps revalidation
 * predictable. Flip to `true` if you serve a lot of public read traffic
 * and don't need instant previews.
 *
 * `stega.studioUrl` enables visual-editing pings: when draft mode is on,
 * the Studio Presentation tool can click straight from a rendered field
 * to the source field in the editor. No-op when draft mode is off.
 *
 * Token handling — read inline from `process.env` so this module stays
 * importable from both server and client code:
 *   - On the server (Node), `SANITY_API_READ_TOKEN` resolves and is sent
 *     on every request, satisfying Sanity's per-document permissions
 *     model (which requires auth even for "public" datasets unless an
 *     explicit allow-public access policy is configured).
 *   - On the client (browser bundle), env vars without the
 *     `NEXT_PUBLIC_` prefix are stripped → token is undefined → Sanity
 *     client makes anonymous requests. That's fine because the only
 *     browser consumer is the embedded Studio at /studio, which
 *     authenticates via its own session cookie, not this token.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  stega: { studioUrl: studioBasePath },
});
