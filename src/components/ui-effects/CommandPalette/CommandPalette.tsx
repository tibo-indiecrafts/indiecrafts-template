"use client";

import { useTranslations } from "next-intl";
import {
  Command as CommandPrimitive,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui-primitives/command";
import { commandPaletteNamespace } from "./config";

export type CommandPaletteProps = React.ComponentProps<typeof CommandDialog>;

/**
 * Wraps `CommandDialog` from `@/components/ui-primitives/command` so the (otherwise
 * English-default) `title` + `description` come from the block's
 * translation namespace. Re-exports the rest of the Command surface so
 * consumers don't import from two paths.
 */
export function CommandPalette(props: CommandPaletteProps) {
  const t = useTranslations(commandPaletteNamespace);
  return <CommandDialog title={t("title")} description={t("description")} {...props} />;
}

export {
  CommandPrimitive as Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
