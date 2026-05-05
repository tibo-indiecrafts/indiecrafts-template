"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { DashboardNavFavorites } from "@/components/ui-molecules/dashboard/nav-favorites";
import { DashboardNavMain } from "@/components/ui-molecules/dashboard/nav-main";
import { DashboardNavSecondary } from "@/components/ui-molecules/dashboard/nav-secondary";
import { DashboardNavWorkspaces } from "@/components/ui-molecules/dashboard/nav-workspaces";
import { DashboardTeamSwitcher } from "@/components/ui-molecules/dashboard/team-switcher";
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui-primitives/sidebar";
import { sidebar08Data, sidebar08Namespace, type SidebarData } from "./config";

export type SidebarProps = React.ComponentProps<typeof UISidebar> & {
  data?: SidebarData;
};

export function Sidebar({ data = sidebar08Data, ...props }: SidebarProps) {
  const t = useTranslations(sidebar08Namespace);

  const navMain = data.navMain.map((item) => ({
    title: t(item.titleKey),
    url: item.url,
    icon: item.icon,
    isActive: item.isActive,
    badge: item.badge,
  }));
  const navSecondary = data.navSecondary.map((item) => ({
    title: t(item.titleKey),
    url: item.url,
    icon: item.icon,
  }));

  return (
    <UISidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <DashboardTeamSwitcher teams={data.teams} />
        <DashboardNavMain items={navMain} />
      </SidebarHeader>
      <SidebarContent>
        <DashboardNavFavorites favorites={data.favorites} />
        <DashboardNavWorkspaces workspaces={data.workspaces} />
        <DashboardNavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
    </UISidebar>
  );
}
