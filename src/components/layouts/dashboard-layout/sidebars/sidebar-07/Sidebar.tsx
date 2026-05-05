"use client";

import * as React from "react";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { DashboardNavDocuments } from "@/components/ui-molecules/dashboard/nav-documents";
import { DashboardNavMain } from "@/components/ui-molecules/dashboard/nav-main";
import { DashboardNavSecondary } from "@/components/ui-molecules/dashboard/nav-secondary";
import { DashboardNavUser } from "@/components/ui-molecules/dashboard/nav-user";
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui-primitives/sidebar";
import { sidebar07Data, sidebar07Namespace, type SidebarData } from "./config";

export type SidebarProps = React.ComponentProps<typeof UISidebar> & {
  /** Override the demo nav + user + documents. Defaults to `sidebar07Data`. */
  data?: SidebarData;
};

export function Sidebar({ data = sidebar07Data, ...props }: SidebarProps) {
  const t = useTranslations(sidebar07Namespace);

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
    <UISidebar collapsible="offcanvas" {...props}>
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
        <DashboardNavMain items={navMain} />
        <DashboardNavDocuments items={documents} />
        <DashboardNavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <DashboardNavUser user={data.user} />
      </SidebarFooter>
    </UISidebar>
  );
}
