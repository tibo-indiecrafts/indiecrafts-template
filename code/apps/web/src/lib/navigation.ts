/**
 * Sanity-only navigation read path. The `navigation` singleton is the SOLE
 * runtime source for the header menu + footer columns — there is NO config
 * fallback. Empty in Sanity → empty menus (the Header/Footer still render logo,
 * social, credit). On any fetch error the fetcher returns the empty shape
 * (never throws), so the site always renders. Wrapped in React `cache()`.
 *
 * Each raw `navItem` resolves per locale:
 *   - label   = `label[locale] ?? label[defaultLocale]` — items with no label drop.
 *   - internal → the typed route key (localized by `<Link>` at render). Routes
 *     whose page is feature-disabled (`isPageVisible`) are SKIPPED, so toggling
 *     `features.legal.*` / `features.blog` hides items with no dead links.
 *   - external → the URL as-is; items with no URL drop.
 */

import { cache } from "react";
import {
  pages,
  isPageVisible,
  defaultLocale,
  type Locale,
  type StaticAppPathname,
  type AppRoute,
} from "@/config";
import { client } from "@indiecrafts/sanity/client";
import { navigationQuery } from "@/sanity/nav-queries";

/** A resolved terminal link — points at an internal route or an external URL. */
export type NavLeaf = (
  | { kind: "internal"; href: StaticAppPathname }
  | { kind: "external"; href: string }
) & {
  label: string;
  newTab: boolean;
  /** Free-text Reicon name (header dropdowns only). */
  icon?: string;
  /** Short description shown under the label (header dropdowns only). */
  description?: string;
};

/** A header item that opens a dropdown of leaf links (no link of its own). */
export type NavGroup = {
  kind: "group";
  label: string;
  icon?: string;
  children: NavLeaf[];
};

/** Header items may be leaves or dropdown groups; footer links are always leaves. */
export type NavItem = NavLeaf | NavGroup;

export type FooterColumn = { title: string; links: NavLeaf[] };
export type Navigation = { header: NavItem[]; footerColumns: FooterColumn[] };

const EMPTY: Navigation = { header: [], footerColumns: [] };

/** `route key → AppRoute`, for visibility gating + route validation. */
const PAGE_BY_KEY = new Map<string, AppRoute>(
  Object.values(pages).map((page) => [page.key, page]),
);

type RawLocaleString = Record<string, string | null> | null;
type RawNavItem = {
  label?: RawLocaleString;
  linkType?: string | null;
  route?: string | null;
  external?: string | null;
  newTab?: boolean | null;
  icon?: string | null;
  description?: RawLocaleString;
  children?: RawNavItem[] | null;
};

function localized(value: RawLocaleString, locale: Locale): string {
  return value?.[locale] ?? value?.[defaultLocale] ?? "";
}

/** Resolve one raw item to a terminal link, or `null` when it has no usable target/label. */
function resolveLeaf(raw: RawNavItem, locale: Locale): NavLeaf | null {
  const label = localized(raw.label ?? null, locale);
  if (!label) return null;
  const newTab = raw.newTab === true;
  const icon = raw.icon ?? undefined;
  const description = localized(raw.description ?? null, locale) || undefined;

  if (raw.linkType === "external") {
    return raw.external
      ? { kind: "external", label, href: raw.external, newTab, icon, description }
      : null;
  }
  // internal (default) — skip flag-disabled routes so there are no dead links.
  const page = raw.route ? PAGE_BY_KEY.get(raw.route) : undefined;
  if (!page || !isPageVisible(page)) return null;
  return { kind: "internal", label, href: page.key, newTab, icon, description };
}

function resolveLeaves(raw: RawNavItem[] | null | undefined, locale: Locale): NavLeaf[] {
  return (raw ?? [])
    .map((item) => resolveLeaf(item, locale))
    .filter((item): item is NavLeaf => item !== null);
}

/** Header items: a group (has children) or a leaf. Groups with no live child drop. */
function resolveHeaderItem(raw: RawNavItem, locale: Locale): NavItem | null {
  if (raw.children && raw.children.length > 0) {
    const label = localized(raw.label ?? null, locale);
    if (!label) return null;
    const children = resolveLeaves(raw.children, locale);
    return children.length
      ? { kind: "group", label, icon: raw.icon ?? undefined, children }
      : null;
  }
  return resolveLeaf(raw, locale);
}

export const getNavigation = cache(async (locale: Locale): Promise<Navigation> => {
  try {
    const data = await client.fetch(navigationQuery);
    if (!data) return EMPTY;
    return {
      header: ((data.header as RawNavItem[] | null | undefined) ?? [])
        .map((item) => resolveHeaderItem(item, locale))
        .filter((item): item is NavItem => item !== null),
      footerColumns: (
        (data.footerColumns ?? []) as { title?: RawLocaleString; links?: RawNavItem[] }[]
      )
        .map((col) => ({
          title: localized(col.title ?? null, locale),
          links: resolveLeaves(col.links, locale),
        }))
        .filter((col) => col.title && col.links.length > 0),
    };
  } catch {
    return EMPTY;
  }
});
