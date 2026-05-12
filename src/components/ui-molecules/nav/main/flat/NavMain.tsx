"use client";

import type { ComponentType } from "react";
import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui-primitives/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui-primitives/sidebar";
import { navMainFlatNamespace } from "./config";

type IconComponent = ComponentType<{ className?: string }>;

export type NavMainItem = {
  title: string;
  url: string;
  icon?: IconComponent;
};

export type NavMainProps = {
  items: NavMainItem[];
};

export function NavMain({ items }: NavMainProps) {
  const t = useTranslations(navMainFlatNamespace);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip={t("quickCreate")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>{t("quickCreate")}</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">{t("inbox")}</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
