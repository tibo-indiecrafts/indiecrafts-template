/**
 * Announcement GROQ — plain strings (no `next-sanity` `defineQuery`, so this stays
 * importable from the bare `code/shared/api` Worker as well as the Next readers).
 * Copy is `localeString`/`localeText`, resolved per-request in `./resolve`.
 */

/** The `announcementBar` singleton — enable/schedule/style/surfaces + the items array. */
export const bannerQuery = `
  *[_id == "announcementBar"][0]{
    enabled,
    dismissible,
    variant,
    start,
    end,
    surfaces,
    items[]{
      message,
      discountCode,
      start,
      end,
      link{ linkType, href, newTab, label }
    }
  }
`;

/** The `announcementToast` singleton — title/body/image/link/surfaces/window/dismiss. */
export const toastQuery = `
  *[_id == "announcementToast"][0]{
    enabled,
    start,
    end,
    surfaces,
    title,
    body,
    "image": image.asset->{ url },
    imageAlt,
    link{ linkType, href, newTab, label },
    autoDismissSeconds
  }
`;
