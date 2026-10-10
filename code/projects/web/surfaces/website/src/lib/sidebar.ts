/**
 * Resolve the sidebar cards of a page from Site web → Barre latérale and its own choice.
 *
 * @see docs/reference/projects/web/website/src/lib/sidebar.md
 */
import { cache } from "react";
import { features, type Locale } from "@/config";
import { client } from "@indiecrafts/packages-web-sanity/client";
import { logger } from "@indiecrafts/packages-shared-logger";
import {
  resolveSidebar,
  sidebarSettingsQuery,
  type SidebarChoice,
  type SidebarSettings,
} from "@indiecrafts/packages-web-page-builder/sanity/sidebar";
import { MODULES_FRAGMENT } from "@indiecrafts/modules-web-blog/sanity/queries";
import type { AnyModule } from "@indiecrafts/modules-web-blog/sanity/types";
import { POST_ONLY_TYPES } from "@indiecrafts/modules-web-blog/sanity/block-types";
import { SIDEBAR_PAGES, type SidebarPage } from "@/sanity/sidebar-pages";

const QUERIES = Object.fromEntries(
  SIDEBAR_PAGES.map(({ name }) => [name, sidebarSettingsQuery(MODULES_FRAGMENT, name)]),
) as Record<SidebarPage, string>;

/** The locale's settings for one page type; `null` on error, so a page renders without a sidebar. */
export const getSidebarSettings = cache(
  async (locale: Locale, page: SidebarPage): Promise<SidebarSettings<AnyModule>> => {
    try {
      return await client.fetch<SidebarSettings<AnyModule>>(QUERIES[page], { locale });
    } catch (error) {
      logger.error("getSidebarSettings failed", { locale, page, error });
      return null;
    }
  },
);

/**
 * The blocks this site can render: without the blog, its blocks are dropped (a page or
 * a sidebar may still list them from before the blog was turned off).
 * ponytail: pages dispatch through the blog's `Modules` and filter its blocks by prefix. A
 * second content module (shop, events) → a renderer registry that modules register into.
 */
export function siteBlocks<B extends { _type: string }>(blocks: B[]): B[] {
  return features.blog
    ? blocks
    : blocks.filter((b) => !b._type.startsWith("module.blog-"));
}

/**
 * The cards of a page of type `page` from its `settings` and its document's own `choice`.
 * Off a post, the post's own cards (TOC, related) go: they would render nothing and leave
 * an empty column.
 */
export function pageSidebar(
  page: SidebarPage,
  settings: SidebarSettings<AnyModule>,
  choice?: SidebarChoice<AnyModule>,
): AnyModule[] {
  const cards = siteBlocks(resolveSidebar(choice, settings));
  return page === "post" ? cards : cards.filter((c) => !POST_ONLY_TYPES.has(c._type));
}

/** The sidebar cards of a page of type `page`, its document's own `choice` first. */
export async function getSidebar(
  locale: Locale,
  page: SidebarPage,
  choice?: SidebarChoice<AnyModule>,
): Promise<AnyModule[]> {
  return pageSidebar(page, await getSidebarSettings(locale, page), choice);
}
