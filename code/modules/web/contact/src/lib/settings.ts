/**
 * Read the editor-configurable contact form copy and enabled toggle from Sanity.
 *
 * @see docs/reference/modules/web/contact/src/lib/settings.md
 */
import "server-only";

import { cache } from "react";
import { defineQuery } from "next-sanity";
import { client } from "@indiecrafts/packages-web-sanity/client";

const contactSettingsQuery = defineQuery(
  `*[_type == "contactSettings"][0]{ enabled, heading, description, emailPlaceholder, nameLabel, subjectLabel, messageLabel, buttonLabel, consentLabel, successMessage, errorMessage }`,
);

/** Editor-configurable contact form copy + the Studio `enabled` toggle. */
export const getContactSettings = cache(async () =>
  client.fetch(contactSettingsQuery),
);
