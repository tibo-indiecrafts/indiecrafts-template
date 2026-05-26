"use client";

import * as React from "react";

import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui-primitives/sidebar";
import { IconBrandAmongUs } from "@tabler/icons-react";
import { useScopedT } from "@/components/_lib/scoped-t";
import { sidebar04Data, sidebar04Namespace } from "./config";
import { useMail } from "@/components/layouts/dashboard-layout/sidebars/sidebar-04/mail-context";
import { NavUserChevron } from "@/components/ui-molecules/nav/user/chevron";

const data = sidebar04Data;
const brandHref = "#";

export default function Sidebar({ ...props }: React.ComponentProps<typeof UISidebar>) {
  const [t] = useScopedT(sidebar04Namespace);

  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const [mails, setMails] = React.useState(data.mails);
  const [query, setQuery] = React.useState("");
  const { setOpen } = useSidebar();
  const { setSelectedMail } = useMail();

  const filteredMails = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mails;
    return mails.filter((m) =>
      [
        t(`mails.${m.id}.name`),
        m.email,
        t(`mails.${m.id}.subject`),
        t(`mails.${m.id}.teaser`),
      ]
        .join("\n")
        .toLowerCase()
        .includes(q),
    );
  }, [mails, query, t]);

  return (
    <div className="flex">
      {/* This is the first sidebar */}
      <UISidebar
        style={{ "--sidebar-width": "12rem" } as React.CSSProperties}
        collapsible="none"
        className="border-r p-2 px-1"
        {...props}
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href={brandHref}>
                  <div className="bg-sidebar-accent text-sidebar-accent-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <IconBrandAmongUs className="size-4" aria-hidden="true" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{t("brand.name")}</span>
                    <span className="truncate text-xs">{t("brand.plan")}</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => {
                        setActiveItem(item);
                        const mail = data.mails.sort(() => Math.random() - 0.5);
                        setMails(
                          mail.slice(0, Math.max(5, Math.floor(Math.random() * 10) + 1)),
                        );
                        setOpen(true);
                      }}
                      isActive={activeItem?.id === item.id}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{t(`navMain.${item.id}`)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="px-1.5 text-xs md:px-0">
              {t("labelsHeading")}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.labels.map((label) => (
                  <SidebarMenuItem key={label.id}>
                    <SidebarMenuButton asChild className="px-2.5 md:px-2">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded ${label.color}`}></div>
                        <span>{t(`labels.${label.id}`)}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUserChevron user={data.user} />
        </SidebarFooter>
      </UISidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <UISidebar collapsible="none" className="hidden min-w-96 flex-1 border-r md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              {activeItem ? t(`navMain.${activeItem.id}`) : ""}
            </div>
          </div>
          <SidebarInput
            placeholder={t("search.placeholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0 pt-0">
            <SidebarGroupContent>
              {filteredMails.length === 0 && (
                <div className="text-muted-foreground p-4 text-sm">{t("empty")}</div>
              )}
              {filteredMails.map((mail) => {
                const name = t(`mails.${mail.id}.name`);
                const subject = t(`mails.${mail.id}.subject`);
                const date = t(`mails.${mail.id}.date`);
                const teaser = t(`mails.${mail.id}.teaser`);
                return (
                  <button
                    type="button"
                    key={mail.email}
                    onClick={() => {
                      setSelectedMail({
                        name,
                        email: mail.email,
                        subject,
                        date,
                        teaser,
                      });
                    }}
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full flex-col items-start gap-2 border-b p-4 text-left text-sm leading-tight whitespace-nowrap"
                  >
                    <div className="flex w-full items-center gap-2">
                      <span>{name}</span> <span className="ml-auto text-xs">{date}</span>
                    </div>
                    <span className="font-medium">{subject}</span>
                    <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
                      {teaser}
                    </span>
                  </button>
                );
              })}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </UISidebar>
    </div>
  );
}
