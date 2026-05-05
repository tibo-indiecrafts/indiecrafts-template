"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Moon, Sun, Monitor } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui-primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui-primitives/dropdown-menu";
import { cn } from "@/lib/utils";
import { themeToggleNamespace } from "./config";

const subscribe = () => () => {};

export type ThemeToggleProps = {
  /** Trigger size. `"icon"` is 36px square (default); `"sm"` is tighter. */
  size?: "icon" | "sm" | "default";
  /** Button visual treatment. Default `outline` matches the LocaleSwitcher pair. */
  variant?: "outline" | "ghost" | "secondary";
  /** className override forwarded to the trigger. */
  className?: string;
};

/**
 * Theme switcher — dropdown with three explicit options (Light / Dark /
 * System). The trigger icon reflects the *resolved* theme so the user always
 * sees a meaningful state. We use `useSyncExternalStore` instead of
 * `useEffect+setState` to avoid React 19's set-state-in-effect lint and to
 * keep the SSR/CSR mismatch invisible (placeholder until hydration).
 *
 * A simple cycle button (light ↔ dark ↔ system) feels natural until the
 * cycle hits a system-matching state — then clicking produces no visual
 * change. The dropdown removes that ambiguity by surfacing all three.
 *
 * `size` and `variant` mirror `LocaleSwitcher`'s API so headers can
 * compose the pair with one shared visual treatment.
 */
export function ThemeToggle({
  size = "icon",
  variant = "outline",
  className,
}: Readonly<ThemeToggleProps> = {}) {
  const t = useTranslations(themeToggleNamespace);
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
          <DropdownMenuRadioItem value="light">
            <Sun className="mr-2 size-4" aria-hidden="true" />
            {t("themeLight")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon className="mr-2 size-4" aria-hidden="true" />
            {t("themeDark")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Monitor className="mr-2 size-4" aria-hidden="true" />
            {t("themeSystem")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
