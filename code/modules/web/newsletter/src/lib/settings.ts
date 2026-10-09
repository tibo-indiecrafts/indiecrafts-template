/**
 * Reads the editor-configurable newsletter settings singleton.
 *
 * @see docs/reference/modules/web/newsletter/src/lib/settings.md
 */
import "server-only";

import { cache } from "react";
import { defineQuery } from "next-sanity";
import { client } from "@indiecrafts/packages-web-sanity/client";

const newsletterSettingsQuery = defineQuery(
  `*[_type == "newsletterSettings"][0]{ enabled }`,
);

/** The Studio `enabled` toggle — the live newsletter kill switch. */
export const getNewsletterSettings = cache(async () =>
  client.fetch(newsletterSettingsQuery),
);
