"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui-primitives/breadcrumb";
import { Button } from "@/components/ui-primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui-primitives/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui-primitives/sidebar";
import {
  settingsDialogDefaultActiveId,
  settingsDialogNamespace,
  settingsDialogNav,
  type SettingsDialogNavItem,
} from "./config";

export type SettingsDialogProps = {
  nav?: readonly SettingsDialogNavItem[];

  activeId?: string;

  defaultOpen?: boolean;

  itemHref?: (item: SettingsDialogNavItem) => string;
};

export function SettingsDialog({
  nav = settingsDialogNav,
  activeId = settingsDialogDefaultActiveId,
  defaultOpen = true,
  itemHref = () => "#",
}: SettingsDialogProps = {}) {
  const t = useTranslations(settingsDialogNamespace);
  const [open, setOpen] = useState(defaultOpen);

  const activeItem = nav.find((item) => item.id === activeId) ?? nav[0];
  const activeName = activeItem ? t(activeItem.nameKey) : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">{t("trigger")}</Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">{t("title")}</DialogTitle>
        <DialogDescription className="sr-only">{t("description")}</DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {nav.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton asChild isActive={item.id === activeId}>
                          <a href={itemHref(item)}>
                            <item.icon />
                            <span>{t(item.nameKey)}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">{t("breadcrumbRoot")}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{activeName}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-muted/50 aspect-video max-w-3xl rounded-xl" />
              ))}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
