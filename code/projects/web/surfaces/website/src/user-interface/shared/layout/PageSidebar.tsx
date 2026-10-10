/**
 * Put a page's content beside its sidebar cards.
 *
 * @see docs/reference/projects/web/website/src/user-interface/shared/layout/PageSidebar.md
 */
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config";
import { getSidebar } from "@/lib/sidebar";
import type { SidebarPage } from "@/sanity/sidebar-pages";
import type { SidebarChoice } from "@indiecrafts/packages-web-page-builder/sanity/sidebar";
import type { AnyModule } from "@indiecrafts/modules-web-blog/sanity/types";
import { WithSidebar } from "@indiecrafts/packages-web-ui-components/web/layout/WithSidebar";
import { Modules } from "@indiecrafts/modules-web-blog/user-interface/renderers/ModuleRenderer";

/**
 * The page's content beside the cards set for its type (`page`) in Site web → Barre
 * latérale, or its own `choice`. No card: the content renders unchanged, full width.
 * Posts build theirs beside the body instead (`postSidebar`).
 */
export async function PageSidebar({
  locale,
  page,
  choice,
  children,
}: {
  locale: Locale;
  page: SidebarPage;
  choice?: SidebarChoice<AnyModule>;
  children: React.ReactNode;
}) {
  const [cards, t] = await Promise.all([
    getSidebar(locale, page, choice),
    getTranslations("common"),
  ]);
  return (
    <WithSidebar
      label={t("sidebarLabel")}
      aside={
        cards.length ? (
          <Modules modules={cards} context={{ locale, sidebar: true }} />
        ) : undefined
      }
    >
      {children}
    </WithSidebar>
  );
}
