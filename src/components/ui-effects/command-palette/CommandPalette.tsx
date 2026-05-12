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
