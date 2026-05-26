"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui-primitives/sidebar";
import { useScopedT } from "@/components/_lib/scoped-t";
import { sidebar01Namespace } from "@/components/layouts/dashboard-layout/sidebars/sidebar-01/config";
import type { NavItem } from "@/components/layouts/dashboard-layout/sidebars/sidebar-01/types";

export function NavMainCollapsible({ items }: { items: NavItem[] }) {
  const [t] = useScopedT(sidebar01Namespace);
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon;
          const label = t(`navMain.${item.id}`);

          return (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton tooltip={label}>
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                <span>{label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
