/**
 * Sanity-only announcement read path for the WEB surfaces (website, app). Thin
 * adapters over the shared resolver (`@indiecrafts/packages-shared-announcement`) —
 * the SAME transform the `code/shared/api` Worker runs for the non-web clients
 * (mobile, hybrid). `announcementBar` + `announcementToast` are the SOLE runtime
 * source (no config fallback). Returns an empty banner / a null toast on any error.
 */

import { cache } from "react";
import type { Locale } from "@indiecrafts/packages-shared-config";
import {
  resolveBanner,
  resolveToast,
  bannerQuery,
  toastQuery,
  type Banner,
  type Surface,
  type Toast,
} from "@indiecrafts/packages-shared-announcement";
import { client } from "@indiecrafts/packages-web-sanity/client";

const EMPTY_BANNER: Banner = {
  items: [],
  variant: "brand",
  dismissible: true,
  version: "",
};

export const getAnnouncement = cache(
  async (locale: Locale, surface: Surface): Promise<Banner> => {
    try {
      const data = await client.fetch(bannerQuery);
      return resolveBanner(data, { locale, surface });
    } catch {
      return EMPTY_BANNER;
    }
  },
);

export const getAnnouncementToast = cache(
  async (locale: Locale, surface: Surface): Promise<Toast | null> => {
    try {
      const data = await client.fetch(toastQuery);
      return resolveToast(data, { locale, surface });
    } catch {
      return null;
    }
  },
);
