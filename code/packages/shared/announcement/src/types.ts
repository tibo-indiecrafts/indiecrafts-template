/**
 * Announcement types — the resolved, platform-agnostic shapes shared by every
 * surface (website · app · mobile · hybrid) and the `code/shared/api` Worker that
 * serves the non-web clients. React/Next-free: only data.
 */

/** The surfaces an announcement can target. Admin is intentionally NOT a surface. */
export const SURFACES = ["website", "app", "mobile", "hybrid"] as const;
export type Surface = (typeof SURFACES)[number];

/** A per-locale string as authored in Sanity (`localeString`/`localeText`). */
export type RawLocaleString = Record<string, string | null> | null;

/** One resolved announcement link — an internal path or an external URL. */
export type AnnouncementLink = {
  href: string;
  external: boolean;
  newTab: boolean;
  label?: string;
};

/** One resolved banner item — text + optional copyable discount code + optional link. */
export type BannerItem = {
  message: string;
  discountCode?: string;
  link?: AnnouncementLink;
};

/** The resolved banner (the strip under the nav). Empty `items` = show nothing. */
export type Banner = {
  items: BannerItem[];
  variant: "brand" | "neutral" | "contrast";
  dismissible: boolean;
  /** Short hash of the live items — a new announcement re-shows after a prior dismiss. */
  version: string;
};

/** The resolved rich toast — title + body + optional image + optional link. */
export type Toast = {
  title: string;
  body?: string;
  imageUrl?: string;
  imageAlt?: string;
  link?: AnnouncementLink;
  /** Auto-dismiss delay in ms; omitted = persist until the user closes it. */
  autoDismissMs?: number;
  /** Short hash of the live content — a new toast re-shows after a prior dismiss. */
  version: string;
};

/** The endpoint payload the Worker returns and the non-web clients consume. */
export type AnnouncementPayload = {
  banner: Banner;
  toast: Toast | null;
};

// ── Raw Sanity shapes (GROQ result, pre-transform) ──────────────────────────

export type RawLink = {
  linkType?: string | null;
  href?: string | null;
  newTab?: boolean | null;
  label?: RawLocaleString;
} | null;

export type RawBannerItem = {
  message?: RawLocaleString;
  discountCode?: string | null;
  start?: string | null;
  end?: string | null;
  link?: RawLink;
} | null;

export type RawBanner = {
  enabled?: boolean | null;
  dismissible?: boolean | null;
  variant?: string | null;
  start?: string | null;
  end?: string | null;
  surfaces?: string[] | null;
  items?: RawBannerItem[] | null;
} | null;

export type RawToast = {
  enabled?: boolean | null;
  start?: string | null;
  end?: string | null;
  surfaces?: string[] | null;
  title?: RawLocaleString;
  body?: RawLocaleString;
  image?: { url?: string | null } | null;
  imageAlt?: RawLocaleString;
  link?: RawLink;
  autoDismissSeconds?: number | null;
} | null;
