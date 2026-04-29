"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { NavFavorites } from "@/components/layouts/DashboardLayout/nav/NavFavorites";
import { NavMain } from "@/components/layouts/DashboardLayout/nav/NavMain";
import { NavSecondary } from "@/components/layouts/DashboardLayout/nav/NavSecondary";
import { NavWorkspaces } from "@/components/layouts/DashboardLayout/nav/NavWorkspaces";
import { TeamSwitcher } from "@/components/layouts/DashboardLayout/widgets/TeamSwitcher";
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui-primitives/sidebar";
import { sidebarLeftData, sidebarLeftNamespace, type SidebarLeftData } from "./config";

export type SidebarLeftProps = React.ComponentProps<typeof Sidebar> & {
  data?: SidebarLeftData;
};

export function SidebarLeft({ data = sidebarLeftData, ...props }: SidebarLeftProps) {
  const t = useTranslations(sidebarLeftNamespace);

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
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <NavMain items={navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={data.favorites} />
        <NavWorkspaces workspaces={data.workspaces} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
