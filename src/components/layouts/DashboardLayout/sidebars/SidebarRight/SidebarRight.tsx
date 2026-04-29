"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Calendars } from "@/components/layouts/DashboardLayout/widgets/Calendars";
import { DatePicker } from "@/components/layouts/DashboardLayout/widgets/DatePicker";
import { NavUser } from "@/components/layouts/DashboardLayout/nav/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui-primitives/sidebar";
import {
  sidebarRightData,
  sidebarRightNamespace,
  type SidebarRightData,
} from "./config";

export type SidebarRightProps = React.ComponentProps<typeof Sidebar> & {
  data?: SidebarRightData;
};

export function SidebarRight({ data = sidebarRightData, ...props }: SidebarRightProps) {
  const t = useTranslations(sidebarRightNamespace);

  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh border-l lg:flex"
      {...props}
    >
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <NavUser user={data.user} />
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
    </Sidebar>
  );
}
