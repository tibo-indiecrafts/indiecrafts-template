"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useLocaleSwitch } from "@indiecrafts/i18n";
import { localeMap, locales, type Locale } from "@/config";
import { Button } from "@indiecrafts/ui/web/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@indiecrafts/ui/web/dropdown-menu";
import { cn } from "@indiecrafts/utils/cn";

export type LocaleSwitcherProps = {
  shape?: "icon" | "code";
  size?: "icon" | "sm" | "default";
  variant?: "outline" | "ghost" | "secondary";
  className?: string;
};

export function LocaleSwitcher({
  shape = "icon",
  size = "icon",
  variant = "outline",
  className,
}: Readonly<LocaleSwitcherProps> = {}) {
  const t = useTranslations("common");
  const current = useLocale() as Locale;
  // Shared locale-switch logic (prefix swap + blog translated-slug) lives in
  // `@indiecrafts/i18n`; the app's content-route resolver is injected via
  // `LocaleSwitchProvider` (in `LocaleSwitchBoundary`), read from context here.
  const switchTo = useLocaleSwitch();

  const isCode = shape === "code";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={isCode ? "sm" : size}
          className={cn(
            !isCode && size === "icon" && "size-9",
            isCode && "px-2.5 text-xs font-semibold uppercase tabular-nums",
            className,
          )}
          aria-label={t("changeLanguage")}
          title={t("changeLanguage")}
        >
          {isCode ? (
            <span aria-hidden="true">
              {localeMap[current]?.abbr ?? current.toUpperCase()}
            </span>
          ) : (
            <Globe className="size-4" aria-hidden="true" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        <DropdownMenuRadioGroup
          value={current}
          onValueChange={(value: string) => void switchTo(value)}
        >
          {locales.map((l) => (
            <DropdownMenuRadioItem key={l.code} value={l.code}>
              <span className="text-muted-foreground mr-2 text-xs font-semibold uppercase tabular-nums">
                {l.abbr}
              </span>
              {l.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
