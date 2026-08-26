import { createElement, type ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@indiecrafts/packages-shared-config";
import { localizedPathname } from "@indiecrafts/packages-web-i18n";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import { getBlogSettings } from "@indiecrafts/modules-web-blog/lib/settings";
import { categoryNavQuery } from "@indiecrafts/modules-web-blog/sanity/queries";
import {
  CategoryNav,
  type CategoryNavItem,
} from "@indiecrafts/packages-web-ui-components/web/layout/CategoryNav";

type RawCategory = { _id: string; title: string; slug: string };
type RawNavCategory = RawCategory & { children?: RawCategory[] };

/**
 * The blog category bar as a ready-to-render node (or `null`). A server helper,
 * not a component: reads the editor's `categoryNav` toggle, fetches the locale's
 * top-level categories + sub-categories, resolves their `/blog/category/<slug>`
 * hrefs, and returns the presentational `CategoryNav` (ui-components) via
 * `createElement`. Renders nothing when the toggle is off or there are no
 * categories — pass it straight into a blog page's `subnav`.
 */
export async function getCategoryNav(locale: Locale): Promise<ReactNode> {
  const display = await getBlogSettings();
  if (!display.taxonomy.categoryNav) return null;
  const [raw, t] = await Promise.all([
    sanityFetchLive<RawNavCategory[]>({
      query: categoryNavQuery,
      params: { locale },
    }),
    getTranslations("pages.blog"),
  ]);
  if (!raw?.length) return null;

  const link = (c: RawCategory) => ({
    _key: c._id,
    title: c.title,
    href: localizedPathname(`/blog/category/${c.slug}`, locale),
  });
  const items: CategoryNavItem[] = raw.map((c) => ({
    ...link(c),
    children: c.children?.map(link),
  }));

  return createElement(CategoryNav, {
    items,
    label: t("categoryNav.label"),
    allLabel: t("categoryNav.all"),
  });
}
