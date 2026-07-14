"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Moon, Sun, Monitor } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { THEME_MODES } from "@/lib/theme";
import type { ThemeMode } from "@/config";

const subscribe = () => () => {};

/** Icon + label key for each selectable theme mode. */
const MODE_META: Record<ThemeMode, { Icon: typeof Sun; labelKey: string }> = {
  light: { Icon: Sun, labelKey: "themeLight" },
  dark: { Icon: Moon, labelKey: "themeDark" },
  system: { Icon: Monitor, labelKey: "themeSystem" },
};

export type ThemeToggleProps = {
  size?: "icon" | "sm" | "default";
  variant?: "outline" | "ghost" | "secondary";
  className?: string;
};

export function ThemeToggle({
  size = "icon",
  variant = "outline",
  className,
}: Readonly<ThemeToggleProps> = {}) {
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
        <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value)}>
          {THEME_MODES.map((mode) => {
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
