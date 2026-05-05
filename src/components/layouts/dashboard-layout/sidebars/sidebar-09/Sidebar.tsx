"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { DashboardCalendars } from "@/components/ui-molecules/dashboard/calendars";
import { DashboardDatePicker } from "@/components/ui-molecules/dashboard/date-picker";
import { DashboardNavUser } from "@/components/ui-molecules/dashboard/nav-user";
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui-primitives/sidebar";
import { sidebar09Data, sidebar09Namespace, type SidebarData } from "./config";

export type SidebarProps = React.ComponentProps<typeof UISidebar> & {
  data?: SidebarData;
};

export function Sidebar({ data = sidebar09Data, ...props }: SidebarProps) {
  const t = useTranslations(sidebar09Namespace);

  return (
    <UISidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh border-l lg:flex"
      {...props}
    >
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <DashboardNavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <DashboardDatePicker />
        <SidebarSeparator className="mx-0" />
        <DashboardCalendars calendars={data.calendars} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus aria-hidden="true" />
              <span>{t("newCalendar")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </UISidebar>
  );
}
