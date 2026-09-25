/**
 * Creates the server-only authenticated Sanity write client.
 *
 * @see docs/reference/packages/web/sanity/src/write.md
 */
import "server-only";

import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

/**
 * Server-only **write** client — the single authenticated write path at runtime
 * (public comment submissions today). Uses the Editor-role
 * `SANITY_API_WRITE_TOKEN`, which was previously seed-only and is now **also a
 * runtime dependency** — set it in production, not just for `pnpm seed`.
 *
 * `import "server-only"` throws if this module is ever pulled into a client
 * bundle, and the token carries no `NEXT_PUBLIC_` prefix, so it can never reach
 * the browser. Sanity tokens are not per-type, so a caller must **hard-code
 * `_type` and whitelist fields** — never spread untrusted request input into a
 * mutation. Prefer a dedicated, independently-rotatable comments token.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
