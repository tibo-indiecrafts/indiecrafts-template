/**
 * Reads the editor-configurable waitlist settings singleton.
 *
 * @see docs/reference/modules/web/waitlist/src/lib/settings.md
 */
import "server-only";

import { cache } from "react";
import { defineQuery } from "next-sanity";
import { client } from "@indiecrafts/packages-web-sanity/client";

const waitlistSettingsQuery = defineQuery(
  `*[_type == "waitlistSettings"][0]{ enabled, heading, description, nameLabel, buttonLabel, consentLabel, successMessage }`,
);

/** Editor-configurable waitlist form copy + the Studio `enabled` toggle. */
export const getWaitlistSettings = cache(async () =>
  client.fetch(waitlistSettingsQuery),
);
