"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Calendars } from "@/components/ui-molecules/widget/calendars";
import { DatePicker } from "@/components/ui-molecules/widget/date-picker";
import { NavUserDots } from "@/components/ui-molecules/nav/user/dots";
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
        <NavUserDots user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        <Calendars calendars={data.calendars} />
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
