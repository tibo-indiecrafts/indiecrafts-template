"use client";

import { Sidebar as UISidebar, SidebarContent } from "@/components/ui-primitives/sidebar";
import { NavCollapse } from "@/components/ui-molecules/nav/collapse";
import { NavFooter } from "@/components/ui-molecules/nav/footer";
import { NavHeader } from "@/components/ui-molecules/nav/header";
import { NavMainCollapsible } from "@/components/ui-molecules/nav/main/collapsible";
import { sidebar01Data } from "./config";

export default function Sidebar({ ...props }: React.ComponentProps<typeof UISidebar>) {
  const data = sidebar01Data;
  return (
    <UISidebar {...props}>
      <NavHeader data={data} />
      <SidebarContent>
        <NavMainCollapsible items={data.navMain} />
        <NavCollapse
          favorites={data.navCollapsible.favorites}
          teams={data.navCollapsible.teams}
          topics={data.navCollapsible.topics}
        />
      </SidebarContent>
      <NavFooter user={data.user} />
    </UISidebar>
  );
}
