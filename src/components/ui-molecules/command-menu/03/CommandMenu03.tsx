"use client";

import { IconArrowRight, IconCornerDownLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui-primitives/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui-primitives/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui-primitives/dialog";
import { Kbd } from "@/components/ui-primitives/kbd";
import { useScopedT } from "@/i18n/scoped-t";
import {
  commandMenu03ColorGroups,
  commandMenu03Namespace,
  commandMenu03NavItems,
  commandMenu03PageGroups,
} from "./config";
import type { CommandMenuBlock } from "./schema";

/**
 * Documentation-style command palette with top-level pages, doc page
 * groups, and color tokens. Cmd+K (or `/` outside form fields) toggles
 * open. Sourced from `@blocks-so/command-menu-03`.
 */
export default function CommandMenu(props: Readonly<CommandMenuBlock>) {
  const [t, tr] = useScopedT(commandMenu03Namespace);
  const router = useRouter();
  const [open, setOpen] = useState(props.defaultOpen ?? false);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        {tr(props.triggerKey, "trigger")}
      </Button>

      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="rounded-xl border-none bg-clip-padding p-2 pb-11 shadow-2xl ring-4 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800">
          <DialogHeader className="sr-only">
            <DialogTitle>{tr(props.titleKey, "title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>

          <Command className="**:data-[slot=command-input-wrapper]:border-input **:data-[slot=command-input-wrapper]:bg-input/50 rounded-none bg-transparent **:data-[slot=command-input]:h-9! **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:h-9! **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border">
            <CommandInput placeholder={t("searchPlaceholder")} />
            <CommandList className="no-scrollbar min-h-80 scroll-pt-2 scroll-pb-1.5">
              <CommandEmpty className="text-muted-foreground py-12 text-center text-sm">
                {t("noResults")}
              </CommandEmpty>

              {commandMenu03NavItems.length > 0 && (
                <CommandGroup
                  className="p-0! **:[[cmdk-group-heading]]:scroll-mt-16 **:[[cmdk-group-heading]]:p-3! **:[[cmdk-group-heading]]:pb-1!"
                  heading={t("groups.pages.heading")}
                >
                  {commandMenu03NavItems.map((item) => (
                    <CommandItem
                      className="hover:border-input hover:bg-input/50 h-9 rounded-md border border-transparent px-3! font-medium"
                      key={item.href}
                      keywords={[...item.keywords]}
                      onSelect={() => {
                        runCommand(() => router.push(item.href));
                      }}
                      value={`${t("groups.pages.heading")} ${t(`items.${item.id}.label`)}`}
                    >
                      <IconArrowRight aria-hidden="true" className="size-4" />
                      {t(`items.${item.id}.label`)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {commandMenu03PageGroups.map((group) => {
                const groupHeading = t(`groups.${group.id}.heading`);
                return (
                  <CommandGroup
                    className="p-0! **:[[cmdk-group-heading]]:scroll-mt-16 **:[[cmdk-group-heading]]:p-3! **:[[cmdk-group-heading]]:pb-1!"
                    heading={groupHeading}
                    key={group.id}
                  >
                    {group.pages.map((page) => {
                      const isComponent = page.href.includes("/components/");
                      const pageLabel = t(`items.${page.id}.label`);
                      return (
                        <CommandItem
                          className="hover:border-input hover:bg-input/50 h-9 rounded-md border border-transparent px-3! font-medium"
                          key={page.href}
                          keywords={[...page.keywords]}
                          onSelect={() => {
                            runCommand(() => router.push(page.href));
                          }}
                          value={`${groupHeading} ${pageLabel}`}
                        >
                          {isComponent ? (
                            <div className="border-muted-foreground aspect-square size-4 rounded-full border border-dashed" />
                          ) : (
                            <IconArrowRight aria-hidden="true" className="size-4" />
                          )}
                          {pageLabel}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                );
              })}

              {commandMenu03ColorGroups.map((colorGroup) => (
                <CommandGroup
                  className="p-0! **:[[cmdk-group-heading]]:p-3!"
                  heading={t(`groups.${colorGroup.id}.heading`)}
                  key={colorGroup.id}
                >
                  {colorGroup.colors.map((color) => {
                    const colorLabel = t(`items.${color.id}.label`);
                    return (
                      <CommandItem
                        className="hover:border-input hover:bg-input/50 h-9 rounded-md border border-transparent px-3! font-medium"
                        key={color.className}
                        keywords={["color", colorLabel, color.className]}
                        onSelect={() => {
                          runCommand(() => copyToClipboard(color.value));
                        }}
                        value={color.className}
                      >
                        <div
                          className="aspect-square size-4 rounded-sm border"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.className}
                        <span className="text-muted-foreground ml-auto font-mono text-xs font-normal tabular-nums">
                          {color.value}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>

          <div className="text-muted-foreground absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t border-t-neutral-100 bg-neutral-50 px-4 text-xs font-medium dark:border-t-neutral-700 dark:bg-neutral-800">
            <Kbd>
              <IconCornerDownLeft aria-hidden="true" className="size-3" />
            </Kbd>
            {t("select")}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
