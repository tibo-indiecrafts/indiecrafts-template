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
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  stega: { studioUrl: studioBasePath },
});
