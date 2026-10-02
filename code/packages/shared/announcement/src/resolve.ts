/**
 * Pure announcement transforms — the SINGLE resolve path, imported by the Next
 * server readers (`@indiecrafts/packages-web-announcement`) AND the `code/shared/api`
 * Worker. Computes "live now" from the enable toggle + date windows, filters by the
 * requesting surface, localizes the copy, resolves links, and hashes the result into a
 * `version` so a NEW announcement re-shows after a prior dismiss. Never throws.
 */

import {
  pickLocale,
  type Locale,
} from "@indiecrafts/packages-shared-config/shared";
import type {
  AnnouncementLink,
  Banner,
  BannerItem,
  RawBanner,
  RawBannerItem,
  RawLink,
  RawLocaleString,
  RawToast,
  Surface,
  Toast,
} from "./types";

const EMPTY_BANNER: Banner = {
  items: [],
  variant: "brand",
  dismissible: true,
  version: "",
};

function localized(value: RawLocaleString, locale: Locale): string {
  return pickLocale(value, locale);
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

/** Empty/unset target list = every surface; otherwise the surface must be listed. */
function targeted(
  surfaces: string[] | null | undefined,
  surface: Surface,
): boolean {
  return !surfaces || surfaces.length === 0 || surfaces.includes(surface);
}

/** Tiny stable hash → the dismiss version key (djb2/imul). */
function hash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++)
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/** Size a Sanity image URL at the CDN (never ship the full-resolution original). */
function sizedImageUrl(url: string, w = 128): string {
  return url.includes("?") ? url : `${url}?w=${w}&auto=format&fit=max&q=75`;
}

/** A site path (`/…`, not protocol-relative `//…`) or an http(s) / mailto / tel URL. */
export const SAFE_HREF = /^(\/(?!\/)|https?:\/\/|mailto:|tel:)/i;

function resolveLink(
  link: RawLink,
  locale: Locale,
): AnnouncementLink | undefined {
  // Editor free text: drop anything else (`javascript:`, `//host`, a typo) — no link beats a bad one.
  if (!link?.href || !SAFE_HREF.test(link.href.trim())) return undefined;
  return {
    href: link.href,
    external: link.linkType === "external",
    newTab: link.newTab === true,
    label: localized(link.label ?? null, locale) || undefined,
  };
}

/** Resolve the banner for one surface + locale. Returns EMPTY when nothing is live. */
export function resolveBanner(
  raw: RawBanner,
  {
    locale,
    surface,
    now = Date.now(),
  }: { locale: Locale; surface: Surface; now?: number },
): Banner {
  if (!raw?.enabled || !live(raw.start, raw.end, now)) return EMPTY_BANNER;
  if (!targeted(raw.surfaces, surface)) return EMPTY_BANNER;

  const items: BannerItem[] = ((raw.items ?? []) as RawBannerItem[])
    .filter(
      (it): it is NonNullable<RawBannerItem> =>
        it != null && live(it.start, it.end, now),
    )
    .map((it) => ({
      message: localized(it.message ?? null, locale),
      discountCode: it.discountCode || undefined,
      link: resolveLink(it.link ?? null, locale),
    }))
    .filter((it) => it.message !== ""); // drop items with no text in any resolved locale

  if (items.length === 0) return EMPTY_BANNER;
  return {
    items,
    variant: (raw.variant as Banner["variant"]) || "brand",
    dismissible: raw.dismissible !== false,
    version: hash(JSON.stringify(items)),
  };
}

/** Resolve the toast for one surface + locale. Returns null when nothing is live. */
export function resolveToast(
  raw: RawToast,
  {
    locale,
    surface,
    now = Date.now(),
  }: { locale: Locale; surface: Surface; now?: number },
): Toast | null {
  if (!raw?.enabled || !live(raw.start, raw.end, now)) return null;
  if (!targeted(raw.surfaces, surface)) return null;

  const title = localized(raw.title ?? null, locale);
  if (!title) return null; // a toast with no title in any resolved locale is nothing to show

  const body = localized(raw.body ?? null, locale) || undefined;
  const imageUrl = raw.image?.url ? sizedImageUrl(raw.image.url) : undefined;
  const imageAlt = localized(raw.imageAlt ?? null, locale) || undefined;
  const link = resolveLink(raw.link ?? null, locale);
  const autoDismissMs =
    typeof raw.autoDismissSeconds === "number" && raw.autoDismissSeconds > 0
      ? raw.autoDismissSeconds * 1000
      : undefined;

  return {
    title,
    body,
    imageUrl,
    imageAlt,
    link,
    autoDismissMs,
    version: hash(JSON.stringify({ title, body, imageUrl, imageAlt, link })),
  };
}
