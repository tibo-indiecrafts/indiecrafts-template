/**
 * Render the production home page from editor-composed blocks and featured posts.
 *
 * @see docs/reference/projects/web/website/src/app/locale/(home)/page.md
 */
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isPageVisible, pages } from "@/config";
import type { Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { getHomePage } from "@/lib/home";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { PageSidebar } from "@/user-interface/shared/layout/PageSidebar";
import { Modules } from "@indiecrafts/modules-web-blog/user-interface/renderers/ModuleRenderer";

/**
 * Production home page — an editor-composed page-builder: the home `page` (the `page`
 * with `isHome` on, read by `getHomePage`), painted by the blog's `Modules`, so it holds
 * the generic blocks and the blog blocks (e.g. "Articles à la une" to promote the blog).
 * One page model everywhere. Add / reorder / hide sections from Studio → Accueil, no
 * code change. The sidebar follows Site web → Barre latérale (« Accueil »).
 */

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.home, locale });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isPageVisible(pages.home)) notFound();
  setRequestLocale(locale);

  const { pageModules, sidebar } = await getHomePage(locale);

  return (
    <DefaultLayout>
      <PageSchemas page={pages.home} locale={locale} />
      <PageSidebar locale={locale} page="home" choice={sidebar}>
        <Modules modules={pageModules} context={{ locale }} />
      </PageSidebar>
    </DefaultLayout>
  );
}
