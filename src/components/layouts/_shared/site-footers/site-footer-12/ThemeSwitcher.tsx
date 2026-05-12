"use client";

import { useMemo, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui-primitives/button";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { siteFooter12Namespace } from "./config";

type ThemeOption = "system" | "light" | "dark";

/**
 * Tailark `veil-footer-5` companion. 3-button theme switcher
 * (system / light / dark) with a `aria-live="polite"` tooltip
 * line that fades in on hover/focus to announce the action.
 */
export function ThemeSwitcher() {
  const [t] = useScopedT(siteFooter12Namespace);
  const { theme, setTheme } = useTheme();
  const [hoveredTheme, setHoveredTheme] = useState<ThemeOption | null>(null);

  const selectedTheme = (theme ?? "system") as ThemeOption;

  const tooltipLabel = useMemo(() => {
    const activeTheme = hoveredTheme ?? selectedTheme;
    switch (activeTheme) {
      case "light":
        return t("theme.lightTooltip");
      case "dark":
        return t("theme.darkTooltip");
      case "system":
      default:
        return t("theme.systemTooltip");
    }
  }, [hoveredTheme, selectedTheme, t]);

  return (
    <div className="w-fit">
      <div className="mb-2 -ml-2 flex">
        <Button
          size="icon"
          variant="ghost"
          aria-label={t("theme.systemLabel")}
          aria-pressed={selectedTheme === "system"}
          className={cn(selectedTheme === "system" && "text-foreground")}
          onMouseEnter={() => setHoveredTheme("system")}
          onMouseLeave={() => setHoveredTheme(null)}
          onFocus={() => setHoveredTheme("system")}
          onBlur={() => setHoveredTheme(null)}
          onClick={() => setTheme("system")}
        >
          <Monitor />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          aria-label={t("theme.lightLabel")}
          aria-pressed={selectedTheme === "light"}
          className={cn(selectedTheme === "light" && "text-foreground")}
          onMouseEnter={() => setHoveredTheme("light")}
          onMouseLeave={() => setHoveredTheme(null)}
          onFocus={() => setHoveredTheme("light")}
          onBlur={() => setHoveredTheme(null)}
          onClick={() => setTheme("light")}
        >
          <Sun />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          aria-label={t("theme.darkLabel")}
          aria-pressed={selectedTheme === "dark"}
          className={cn(selectedTheme === "dark" && "text-foreground")}
          onMouseEnter={() => setHoveredTheme("dark")}
          onMouseLeave={() => setHoveredTheme(null)}
          onFocus={() => setHoveredTheme("dark")}
          onBlur={() => setHoveredTheme(null)}
          onClick={() => setTheme("dark")}
        >
          <Moon />
        </Button>
      </div>

      <div
        aria-live="polite"
        className={cn(
          "text-muted-foreground w-fit text-xs leading-none transition-opacity",
          hoveredTheme ? "opacity-100" : "opacity-0",
        )}
      >
        {tooltipLabel}
      </div>
    </div>
  );
}
