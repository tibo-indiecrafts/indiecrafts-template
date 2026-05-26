import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/client";
import { token } from "@/sanity/token";

/**
 * Enable draft preview. The Studio's Presentation tool calls this to open
 * a live-editing session. Requires `SANITY_API_READ_TOKEN`.
 *
 *   GET /api/draft-mode/enable?sanity-preview-secret=<token>&sanity-preview-pathname=/blog/hello
 *
 * Disable: GET /api/draft-mode/disable
 */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token }),
});
