"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@indiecrafts/packages-web-ui/web/sidebar";
import { NAV, activeKey } from "@/user-interface/lib/nav";
import { NavUser } from "./NavUser";

/** The dashboard's left rail — brand link, `NAV` groups, and the user menu. Icon-collapsible. */
export function AppSidebar() {
  const t = useTranslations("admin");
  const current = activeKey(usePathname());

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/">
                <span className="text-base font-semibold">{t("title")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <nav aria-label={t("nav.label")}>
          {NAV.map((group) => (
            <SidebarGroup key={group.labelKey ?? "top"}>
              {group.labelKey ? (
                <SidebarGroupLabel>{t(`nav.groups.${group.labelKey}`)}</SidebarGroupLabel>
              ) : null}
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton asChild isActive={current === item.key}>
                        <Link href={item.href}>
                          <item.icon aria-hidden="true" />
                          <span>{t(`nav.${item.key}`)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
