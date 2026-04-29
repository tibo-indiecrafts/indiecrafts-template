"use client";

import * as React from "react";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { NavDocuments } from "@/components/layouts/DashboardLayout/nav/NavDocuments";
import { NavMain } from "@/components/layouts/DashboardLayout/nav/NavMain";
import { NavSecondary } from "@/components/layouts/DashboardLayout/nav/NavSecondary";
import { NavUser } from "@/components/layouts/DashboardLayout/nav/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui-primitives/sidebar";
import { appSidebarData, appSidebarNamespace, type AppSidebarData } from "./config";

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  /** Override the demo nav + user + documents. Defaults to `appSidebarData`. */
  data?: AppSidebarData;
};

export function AppSidebar({ data = appSidebarData, ...props }: AppSidebarProps) {
  const t = useTranslations(appSidebarNamespace);

  const navMain = data.navMain.map((item) => ({
    title: t(item.titleKey),
    url: item.url,
    icon: item.icon,
  }));
  const navSecondary = data.navSecondary.map((item) => ({
    title: t(item.titleKey),
    url: item.url,
    icon: item.icon,
  }));
  const documents = data.documents.map((item) => ({
    name: t(item.nameKey),
    url: item.url,
    icon: item.icon,
  }));

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href={data.brandHref}>
                <IconInnerShadowTop className="size-5!" aria-hidden="true" />
                <span className="text-base font-semibold">{t("brandLabel")}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavDocuments items={documents} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
