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
import { SectionCards } from "@/components/ui-molecules/widget/kpi-cards";
import { dashboard01Defaults, dashboard01Namespace } from "./config";
import { dashboard01SampleRows } from "./sample-data";

export type DashboardProps = {
  rows?: typeof dashboard01SampleRows;

  layout?: LayoutName;

  header?: boolean | ReactNode;

  footer?: boolean | ReactNode;
};

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
      <div className="@container/main mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 md:gap-8 md:py-8 lg:px-8">
        <WelcomeBanner01Section {...welcomeBanner01Sample} id="dashboard-01-welcome" />
        <SectionCards />
        <QuickActions01Section
          {...quickActions01Sample}
          id="dashboard-01-quick-actions"
        />
        <ChartAreaInteractive />
        <DataTable data={rows} />
        <RecentActivity01Section {...recentActivity01Sample} id="dashboard-01-activity" />
      </div>
    </Layout>
  );
}
