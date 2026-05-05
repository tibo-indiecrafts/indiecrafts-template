"use client";

import { Search } from "lucide-react";
import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui-primitives/command";
import { SidebarHeader } from "@/components/ui-primitives/sidebar";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useScopedT } from "@/i18n/scoped-t";
import { sidebar01Namespace } from "@/components/layouts/dashboard-layout/sidebars/sidebar-01/config";
import { sidebarNavHeaderNamespace } from "./config";
import type { SidebarData } from "@/components/layouts/dashboard-layout/sidebars/sidebar-01/types";

interface NavHeaderProps {
  data: SidebarData;
}

export function NavHeader({ data }: NavHeaderProps) {
  const [t] = useScopedT(sidebar01Namespace);
  const [tSelf] = useScopedT(sidebarNavHeaderNamespace);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <SidebarHeader>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-between px-2 pt-3 pb-0 text-left"
          onClick={() => setOpen(true)}
        >
          <div className="flex flex-1 items-center gap-3">
            <Search className="text-muted-foreground h-4 w-4" aria-hidden="true" />
            <span className="text-muted-foreground text-sm font-normal">
              {tSelf("trigger")}
            </span>
          </div>
          <div className="border-border flex items-center justify-center rounded-md border px-2 py-1">
            <kbd className="text-muted-foreground inline-flex font-[inherit] text-xs font-medium">
              <span className="opacity-70">⌘K</span>
            </kbd>
          </div>
        </button>
      </SidebarHeader>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={tSelf("placeholder")} />
        <CommandList>
          <CommandEmpty>{tSelf("empty")}</CommandEmpty>
          <CommandGroup heading={tSelf("groups.navigation")}>
            {data.navMain.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  className="py-2!"
                  key={item.id}
                  onSelect={() => {
                    setOpen(false);
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{t(`navMain.${item.id}`)}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandSeparator className="my-2" />
          <CommandGroup heading={tSelf("groups.favorites")}>
            {data.navCollapsible.favorites.map((item) => (
              <CommandItem
                className="py-2!"
                key={item.id}
                onSelect={() => {
                  setOpen(false);
                }}
              >
                <div className={cn("mr-2 h-3 w-3 rounded-full", item.color)} />
                <span>{t(`favorites.${item.id}`)}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator className="my-2" />
          <CommandGroup heading={tSelf("groups.teams")}>
            {data.navCollapsible.teams.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  className="py-2!"
                  key={item.id}
                  onSelect={() => {
                    setOpen(false);
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{t(`teams.${item.id}`)}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandSeparator className="my-2" />
          <CommandGroup heading={tSelf("groups.topics")}>
            {data.navCollapsible.topics.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  className="py-2!"
                  key={item.id}
                  onSelect={() => {
                    setOpen(false);
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{t(`topics.${item.id}`)}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
