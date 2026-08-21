import "server-only";

import { cache } from "react";
import { defineQuery } from "next-sanity";
import { client } from "@indiecrafts/packages-web-sanity/client";

const contactSettingsQuery = defineQuery(
  `*[_type == "contactSettings"][0]{ enabled, heading, description, nameLabel, subjectLabel, messageLabel, buttonLabel, consentLabel, successMessage }`,
);

/** Editor-configurable contact form copy + the Studio `enabled` toggle. */
export const getContactSettings = cache(async () =>
  client.fetch(contactSettingsQuery),
);
