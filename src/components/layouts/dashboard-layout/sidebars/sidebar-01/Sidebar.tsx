"use client";

import { Sidebar as UISidebar, SidebarContent } from "@/components/ui-primitives/sidebar";
import { SidebarNavCollapse } from "@/components/ui-molecules/sidebar/nav-collapse";
import { SidebarNavFooter } from "@/components/ui-molecules/sidebar/nav-footer";
import { SidebarNavHeader } from "@/components/ui-molecules/sidebar/nav-header";
import { SidebarNavMainCollapsible } from "@/components/ui-molecules/sidebar/nav-main/collapsible";
import { sidebar01Data } from "./config";

export default function Sidebar({ ...props }: React.ComponentProps<typeof UISidebar>) {
  const data = sidebar01Data;
  return (
    <UISidebar {...props}>
      <SidebarNavHeader data={data} />
      <SidebarContent>
        <SidebarNavMainCollapsible items={data.navMain} />
        <SidebarNavCollapse
          favorites={data.navCollapsible.favorites}
          teams={data.navCollapsible.teams}
          topics={data.navCollapsible.topics}
        />
      </SidebarContent>
      <SidebarNavFooter user={data.user} />
    </UISidebar>
  );
}
