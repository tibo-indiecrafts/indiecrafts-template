import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { ChartAreaInteractive } from "@/components/ui-molecules/chart/area/interactive";
import { DataTable } from "@/components/sections-data/data-table";
import {
  QuickActions01Section,
  quickActions01Sample,
} from "@/components/sections-dashboard/quick-actions-01";
import {
  RecentActivity01Section,
  recentActivity01Sample,
} from "@/components/sections-dashboard/recent-activity-01";
import {
  WelcomeBanner01Section,
  welcomeBanner01Sample,
} from "@/components/sections-dashboard/welcome-banner-01";
import { SectionCards } from "@/components/ui-molecules/dashboard/kpi-cards";
import { dashboard01Defaults, dashboard01Namespace } from "./config";
import { dashboard01SampleRows } from "./sample-data";

export type DashboardProps = {
  /** Override sample rows passed to the table. */
  rows?: typeof dashboard01SampleRows;
  /** Override the wrapping layout. Defaults to `dashboard01Defaults.layout`. */
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
 * `blocks.dashboard-01.*`.
 */
export function Dashboard({
  rows = dashboard01SampleRows,
  layout = dashboard01Defaults.layout,
  header,
  footer,
}: DashboardProps = {}) {
  const t = useTranslations(dashboard01Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <WelcomeBanner01Section {...welcomeBanner01Sample} id="dashboard-01-welcome" />
      <SectionCards />
      <QuickActions01Section {...quickActions01Sample} id="dashboard-01-quick-actions" />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={rows} />
      <RecentActivity01Section {...recentActivity01Sample} id="dashboard-01-activity" />
    </Layout>
  );
}
