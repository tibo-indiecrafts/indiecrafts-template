"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { NavFavorites } from "@/components/ui-molecules/nav/favorites";
import { NavMainFlat } from "@/components/ui-molecules/nav/main/flat";
import { NavSecondary } from "@/components/ui-molecules/nav/secondary";
import { NavWorkspaces } from "@/components/ui-molecules/nav/workspaces";
import { TeamSwitcherFlat } from "@/components/ui-molecules/team-switcher/flat";
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
        <TeamSwitcherFlat teams={data.teams} />
        <NavMainFlat items={navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={data.favorites} />
        <NavWorkspaces workspaces={data.workspaces} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
    </UISidebar>
  );
}
