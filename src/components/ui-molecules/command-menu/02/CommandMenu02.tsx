"use client";

import { useEffect, useState } from "react";
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
import { Kbd, KbdGroup } from "@/components/ui-primitives/kbd";
import { useScopedT } from "@/i18n/scoped-t";
import { commandMenu02Groups, commandMenu02Namespace } from "./config";
import type { CommandMenuBlock, CommandMenuItem } from "./schema";

/**
 * Full-screen command palette with nine grouped sections, search input,
 * Esc footer, and per-item keyboard hint chips. Sourced from
 * `@blocks-so/command-menu-02`.
 */
export default function CommandMenu(props: Readonly<CommandMenuBlock>) {
  const [t, tr] = useScopedT(commandMenu02Namespace);
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  const [inputValue, setInputValue] = useState("");

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

  const renderItemLabel = (item: CommandMenuItem) => {
    if (item.id.startsWith("go-")) {
      return (
        <span>
          {t.rich(`items.${item.id}.label`, {
            strong: (chunks) => <strong className="font-semibold">{chunks}</strong>,
          })}
        </span>
      );
    }
    return <>{t(`items.${item.id}.label`)}</>;
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        {tr(props.triggerKey, "trigger")}
      </Button>

      <Dialog onOpenChange={setOpen} open={open}>
        <DialogHeader className="sr-only">
          <DialogTitle>{tr(props.titleKey, "title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <DialogContent
          className="border-border/50 gap-0 overflow-hidden rounded-xl p-0 shadow-lg sm:max-w-lg"
          showCloseButton={false}
        >
          <Command className="bg-popover flex h-full w-full flex-col overflow-hidden **:data-[slot=command-input-wrapper]:h-auto **:data-[slot=command-input-wrapper]:grow **:data-[slot=command-input-wrapper]:border-0 **:data-[slot=command-input-wrapper]:px-0">
            <div className="border-border/50 flex h-12 items-center gap-2 border-b px-4">
              <CommandInput
                className="h-10 text-[15px]"
                onValueChange={setInputValue}
                placeholder={t("searchPlaceholder")}
                value={inputValue}
              />
              <button
                className="flex shrink-0 items-center"
                onClick={() => setOpen(false)}
                type="button"
              >
                <Kbd>Esc</Kbd>
              </button>
            </div>

            <CommandList className="max-h-[400px] py-2">
              <CommandEmpty>{t("noResults")}</CommandEmpty>

              {commandMenu02Groups.map((group) => (
                <CommandGroup
                  key={group.id}
                  heading={group.hasHeading ? t(`groups.${group.id}.heading`) : undefined}
                >
                  {group.items.map((item) => (
                    <CommandItem
                      className="mx-2 rounded-lg py-2.5"
                      key={item.id}
                      onSelect={() => setOpen(false)}
                    >
                      <item.icon aria-hidden="true" />
                      {renderItemLabel(item)}
                      {item.shortcut ? (
                        <KbdGroup className="ml-auto">
                          {item.shortcut.map((key, idx) => (
                            <Kbd key={`${item.id}-${idx}`}>{key}</Kbd>
                          ))}
                        </KbdGroup>
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
