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
import { SIDEBAR_PAGES, type SidebarPage } from "@/sanity/sidebar-pages";

const QUERIES = Object.fromEntries(
  SIDEBAR_PAGES.map(({ name }) => [name, sidebarSettingsQuery(MODULES_FRAGMENT, name)]),
) as Record<SidebarPage, string>;

/** The locale's settings for one page type; `null` on error, so a page renders without a sidebar. */
const getSidebarSettings = cache(
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
 */
export function siteBlocks<B extends { _type: string }>(blocks: B[]): B[] {
  return features.blog
    ? blocks
    : blocks.filter((b) => !b._type.startsWith("module.blog-"));
}

/** The sidebar cards of a page of type `page`, its document's own `choice` first. */
export async function getSidebar(
  locale: Locale,
  page: SidebarPage,
  choice?: SidebarChoice<AnyModule>,
): Promise<AnyModule[]> {
  return siteBlocks(resolveSidebar(choice, await getSidebarSettings(locale, page)));
}
