import "server-only";

import { draftMode } from "next/headers";
import { defineLive } from "next-sanity/live";
import { apiVersion } from "./env";
import { client } from "./client";
import { token } from "./token";

/**
 * Live content + draft preview wrapper.
 *
 * `<SanityLive />` mounted in the layout subscribes to Sanity's listen API
 * and revalidates pages when content changes (only when a token is set).
 *
 * `sanityFetchLive` is a thin wrapper that switches the perspective to
 * `drafts` when draft mode is enabled — call it from blog routes instead
 * of `client.fetch` to make preview-mode editing work.
 *
 * `server-only` (not `"use server"`) — this module exports both a React
 * component (`SanityLive`) and async helpers; marking it as Server
 * Actions would force every export to be async + serializable. The
 * `server-only` import just stops it from accidentally being imported
 * into a client component.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({ apiVersion }),
  serverToken: token,
  browserToken: token,
});

export async function sanityFetchLive<T>(args: Parameters<typeof sanityFetch>[0]) {
  const preview = (await draftMode()).isEnabled;
  const { data } = await sanityFetch({
    ...args,
    perspective: preview ? "drafts" : "published",
  });
  return data as T;
}
