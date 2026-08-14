"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Moon, Sun, Monitor } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Button } from "@indiecrafts/ui/web/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@indiecrafts/ui/web/dropdown-menu";
import { cn } from "@indiecrafts/utils/cn";
import type { ThemeMode } from "@indiecrafts/config";

const subscribe = () => () => {};

/** Icon + label key for each selectable theme mode. */
const MODE_META: Record<ThemeMode, { Icon: typeof Sun; labelKey: string }> = {
  light: { Icon: Sun, labelKey: "themeLight" },
  dark: { Icon: Moon, labelKey: "themeDark" },
  system: { Icon: Monitor, labelKey: "themeSystem" },
};

export type ThemeToggleProps = {
  /** Selectable modes, in menu order — from `themeModes(cfg)`, resolved server-side. */
  modes: readonly ThemeMode[];
  size?: "icon" | "sm" | "default";
  variant?: "outline" | "ghost" | "secondary";
  className?: string;
};

export function ThemeToggle({
  modes,
  size = "icon",
  variant = "outline",
  className,
}: Readonly<ThemeToggleProps>) {
  const t = useTranslations("common");
  const { theme = "system", setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const Icon = !mounted ? Monitor : resolvedTheme === "dark" ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(size === "icon" && "size-9", className)}
          aria-label={t("switchTheme")}
          title={t("switchTheme")}
        >
          <Icon className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value: string) => setTheme(value)}
        >
          {modes.map((mode) => {
            const { Icon, labelKey } = MODE_META[mode];
            return (
              <DropdownMenuRadioItem key={mode} value={mode}>
                <Icon className="mr-2 size-4" aria-hidden="true" />
                {t(labelKey)}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
