"use client";

/**
 * Switch the active locale and persist the choice to a signed-in user's profile.
 *
 * @see docs/reference/projects/web/website/src/user-interface/shared/layout/LocaleSwitcher.md
 */

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useLocaleSwitch } from "@indiecrafts/packages-web-i18n";
import { persistLocale } from "@indiecrafts/packages-web-auth/persist-locale";
import { dismissLocaleSuggest } from "@indiecrafts/packages-web-locale-suggest/locale-suggest-store";
import { localeMap, locales, type Locale } from "@/config";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@indiecrafts/packages-web-ui/web/dropdown-menu";
import { cn } from "@indiecrafts/packages-shared-utils/cn";

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
  // `@indiecrafts/packages-web-i18n`; the app's content-route resolver is injected via
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
          onValueChange={(value: string) => {
            // An explicit choice answers the "available in your language" strip too.
            dismissLocaleSuggest();
            void switchTo(value);
            // A signed-in user's emails follow the new language (`user_profiles.locale` via
            // the webhook). No-op when signed out or when Clerk isn't loaded.
            persistLocale(value);
          }}
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
