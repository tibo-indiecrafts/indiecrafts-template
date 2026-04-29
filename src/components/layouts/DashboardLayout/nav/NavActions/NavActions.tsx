"use client";

import { useState } from "react";
import { MoreHorizontal, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui-primitives/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui-primitives/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui-primitives/sidebar";
import {
  navActionsGroups,
  navActionsNamespace,
  type NavActionItem,
} from "./config";

export type NavActionsProps = {
  groups?: readonly (readonly NavActionItem[])[];
  defaultOpen?: boolean;
};

export function NavActions({
  groups = navActionsGroups,
  defaultOpen = true,
}: NavActionsProps = {}) {
  const t = useTranslations(navActionsNamespace);
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="text-muted-foreground hidden font-medium md:inline-block">
        {t("editedAt")}
      </div>
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <Star />
      </Button>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="data-[state=open]:bg-accent h-7 w-7"
          >
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 overflow-hidden rounded-lg p-0" align="end">
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              {groups.map((group, index) => (
                <SidebarGroup key={index} className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, i) => (
                        <SidebarMenuItem key={i}>
                          <SidebarMenuButton>
                            <item.icon /> <span>{t(item.labelKey)}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  );
}
