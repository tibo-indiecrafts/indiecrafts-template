"use client";

/**
 * Render the dashboard breadcrumb trail from the active route.
 *
 * @see docs/reference/projects/web/admin/src/user-interface/layout/Breadcrumbs.md
 */
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@indiecrafts/packages-web-ui/web/breadcrumb";
import { activeKey } from "@/user-interface/lib/nav";

/** Overview (link) › current page label — from `activeKey(pathname)`. On `/`, just "Overview". */
export function Breadcrumbs() {
  const t = useTranslations("admin");
  const key = activeKey(usePathname());
  const isOverview = !key || key === "overview";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {isOverview ? (
            <BreadcrumbPage>{t("nav.overview")}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href="/">{t("nav.overview")}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {isOverview ? null : (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t(`nav.${key}`)}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
