import { defineQuery } from "next-sanity";

/**
 * Announcement-bar GROQ — the `announcementBar` singleton (enable/schedule/style +
 * the items array with per-locale text, discount code, and link). Copy is
 * `localeString`, resolved per-request in `getAnnouncement` (`./announcement`).
 */
export const announcementQuery = defineQuery(`
  *[_id == "announcementBar"][0]{
    enabled,
    dismissible,
    variant,
    start,
    end,
    items[]{
      message,
      discountCode,
      start,
      end,
      link{ linkType, href, newTab, label }
    }
  }
`);
