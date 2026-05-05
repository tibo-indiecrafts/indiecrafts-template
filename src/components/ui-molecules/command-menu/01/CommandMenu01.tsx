"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui-primitives/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui-primitives/command";
import { Kbd } from "@/components/ui-primitives/kbd";
import { useScopedT } from "@/i18n/scoped-t";
import {
  commandMenu01AnalyticsItems,
  commandMenu01Namespace,
  commandMenu01SettingsItems,
  commandMenu01WorkspaceItems,
} from "./config";
import type { CommandMenuBlock, CommandMenuItem } from "./schema";

/**
 * Cmd+K palette with Workspace / Analytics / Settings groups, search
 * input, and an Esc footer button. Sourced from `@blocks-so/command-menu-01`.
 */
export default function CommandMenu(props: Readonly<CommandMenuBlock>) {
  const [t, tr] = useScopedT(commandMenu01Namespace);
  const [open, setOpen] = useState(props.defaultOpen ?? false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const renderItems = (items: CommandMenuItem[]) =>
    items.map((item) => (
      <CommandItem key={item.id}>
        <item.icon className="mr-2 h-5 w-5" />
        <span>{t(`items.${item.id}.label`)}</span>
      </CommandItem>
    ));

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        {tr(props.triggerKey, "trigger")}
      </Button>

      <CommandDialog
        onOpenChange={setOpen}
        open={open}
        showCloseButton={false}
        title={tr(props.titleKey, "title")}
      >
        <CommandInput className="h-12" placeholder={t("searchPlaceholder")} />
        <CommandList className="h-[320px] max-h-[320px]">
          <CommandEmpty>{t("noResults")}</CommandEmpty>
          <CommandGroup heading={t("groups.workspace.heading")}>
            {renderItems(commandMenu01WorkspaceItems)}
          </CommandGroup>
          <CommandGroup heading={t("groups.analytics.heading")}>
            {renderItems(commandMenu01AnalyticsItems)}
          </CommandGroup>
          <CommandGroup heading={t("groups.settings.heading")}>
            {renderItems(commandMenu01SettingsItems)}
          </CommandGroup>
        </CommandList>
        <div className="flex h-12 items-center justify-end border-t px-3">
          <button
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
            onClick={() => setOpen(false)}
            type="button"
          >
            <span>{t("close")}</span>
            <Kbd className="ml-1">Esc</Kbd>
          </button>
        </div>
      </CommandDialog>
    </>
  );
}
