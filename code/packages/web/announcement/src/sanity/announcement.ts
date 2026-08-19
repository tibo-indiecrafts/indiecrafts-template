/**
 * Sanity-only announcement read path. The `announcementBar` singleton is the SOLE
 * runtime source — no config fallback. This reader computes "live now" from the
 * enable toggle + the date windows (both the bar's and each item's), localizes the
 * copy, resolves each link, and hashes the result into a `version` so a NEW
 * announcement re-shows after a prior dismiss. Returns EMPTY on any error.
 */

import { cache } from "react";
import { defaultLocale, type Locale } from "@indiecrafts/config";
import { client } from "@indiecrafts/sanity/client";
import { announcementQuery } from "./queries";

type RawLocaleString = Record<string, string | null> | null;

export type AnnouncementLink = {
  href: string;
  external: boolean;
  newTab: boolean;
  label?: string;
};
export type AnnouncementItem = {
  message: string;
  discountCode?: string;
  link?: AnnouncementLink;
};
export type Announcement = {
  items: AnnouncementItem[];
  variant: "brand" | "neutral" | "contrast";
  dismissible: boolean;
  /** Short hash of the live items — a new announcement re-shows after a prior dismiss. */
  version: string;
};

const EMPTY: Announcement = {
  items: [],
  variant: "brand",
  dismissible: true,
  version: "",
};

function localized(value: RawLocaleString, locale: Locale): string {
  return value?.[locale] ?? value?.[defaultLocale] ?? "";
}

/** now ∈ [start, end] — a missing bound is open. */
function live(
  start?: string | null,
  end?: string | null,
  now = Date.now(),
): boolean {
  if (start && now < Date.parse(start)) return false;
  if (end && now > Date.parse(end)) return false;
  return true;
}

/** Tiny stable hash → the dismiss version key (djb2/imul). */
function hash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++)
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

export const getAnnouncement = cache(
  async (locale: Locale): Promise<Announcement> => {
    try {
      const data = await client.fetch(announcementQuery);
      if (!data?.enabled || !live(data.start, data.end)) return EMPTY;
      const items: AnnouncementItem[] = ((data.items ?? []) as RawItem[])
        .filter(
          (it): it is NonNullable<RawItem> =>
            it != null && live(it.start, it.end),
        )
        .map((it) => {
          const link = it.link?.href
            ? {
                href: it.link.href,
                external: it.link.linkType === "external",
                newTab: it.link.newTab === true,
                label: localized(it.link.label ?? null, locale) || undefined,
              }
            : undefined;
          return {
            message: localized(it.message ?? null, locale),
            discountCode: it.discountCode || undefined,
            link,
          };
        })
        .filter((it) => it.message !== ""); // drop items with no text in any resolved locale
      if (items.length === 0) return EMPTY;
      return {
        items,
        variant: (data.variant as Announcement["variant"]) || "brand",
        dismissible: data.dismissible !== false,
        version: hash(JSON.stringify(items)),
      };
    } catch {
      return EMPTY;
    }
  },
);

type RawItem = {
  message?: RawLocaleString;
  discountCode?: string | null;
  start?: string | null;
  end?: string | null;
  link?: {
    linkType?: string | null;
    href?: string | null;
    newTab?: boolean | null;
    label?: RawLocaleString;
  } | null;
} | null;
