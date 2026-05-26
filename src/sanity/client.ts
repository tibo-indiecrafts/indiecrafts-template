import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

/**
 * Read-only Sanity client for fetching published content in server
 * components. `useCdn: false` is safer for ISR/RSC — keeps revalidation
 * predictable. Flip to `true` if you serve a lot of public read traffic
 * and don't need instant previews.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});
