import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { ChartAreaInteractive } from "@/components/sections-app-charts/ChartAreaInteractive";
import { DataTable } from "@/components/sections-app-data/DataTable";
import { SectionCards } from "@/components/sections-app-dashboard/SectionCards";
import { dashboard1Defaults, dashboard1Namespace } from "./config";
import { dashboard1SampleRows } from "./sample-data";

export type Dashboard1Props = {
  /** Override sample rows passed to the table. */
  rows?: typeof dashboard1SampleRows;
  /** Override the wrapping layout. Defaults to `dashboard1Defaults.layout`. */
  layout?: LayoutName;
  /** Forwarded to the layout's header slot. */
  header?: boolean | ReactNode;
  /** Forwarded to the layout's footer slot. */
  footer?: boolean | ReactNode;
};

/**
 * Admin dashboard template — kpi cards → interactive chart → data table.
 * Layout defaults to `"dashboard"` (sidebar + DashboardHeader + main); pass
 * `layout="default"` to render the same content under marketing chrome.
 *
 * `rows` is overridable so a real route can swap in production data without
 * forking the template. Page-scoped strings live in `./en.json` under
 * `blocks.dashboard-1.*`.
 */
export function Dashboard1({
  rows = dashboard1SampleRows,
  layout = dashboard1Defaults.layout,
  header,
  footer,
}: Dashboard1Props = {}) {
  const t = useTranslations(dashboard1Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={rows} />
    </Layout>
  );
}
