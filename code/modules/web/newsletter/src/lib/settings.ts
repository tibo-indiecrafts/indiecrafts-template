import "server-only";

import { cache } from "react";
import { defineQuery } from "next-sanity";
import { client } from "@indiecrafts/packages-web-sanity/client";

const newsletterSettingsQuery = defineQuery(
  `*[_type == "newsletterSettings"][0]{ enabled, heading, description, buttonLabel, consentLabel, successMessage }`,
);

/** Editor-configurable newsletter copy + the Studio `enabled` toggle. */
export const getNewsletterSettings = cache(async () =>
  client.fetch(newsletterSettingsQuery),
);
