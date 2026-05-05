"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  LOCALE_ABBREVIATIONS,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/config/locales.config";
import { Button } from "@/components/ui-primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui-primitives/dropdown-menu";
import { cn } from "@/lib/utils";
import { localeSwitcherNamespace } from "./config";

export type LocaleSwitcherProps = {
  /**
   * Trigger shape — adapt to the host header's visual density.
   *  - "icon"  — globe-icon button (default; matches ThemeToggle's pair).
   *  - "code"  — uppercase locale code (e.g. "EN") in a tight button. Use
   *              when the right-side rail is already crowded with CTAs.
   */
  shape?: "icon" | "code";
  /** Trigger size. `"icon"` is 36px square (matches ThemeToggle); `"sm"` is tighter. */
  size?: "icon" | "sm" | "default";
  /** Button visual treatment. Default `outline` matches the ThemeToggle pair. */
  variant?: "outline" | "ghost" | "secondary";
  /** className override forwarded to the trigger. */
  className?: string;
};

/**
 * Client-side language switcher. Replaces the `[locale]` prefix on the
 * current URL rather than using next-intl's typed router, which lets us
 * switch without knowing the static pathname ahead of time — important
 * for pages with dynamic segments like /blog/[slug].
 *
 * Visual: matches `ThemeToggle`'s icon-button-with-dropdown shape so
 * the two switchers compose as a uniform pair across headers.
 */
export function LocaleSwitcher({
  shape = "icon",
  size = "icon",
  variant = "outline",
  className,
}: Readonly<LocaleSwitcherProps> = {}) {
  const t = useTranslations(localeSwitcherNamespace);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ locale?: string }>();
  const current = useLocale() as Locale;

  function switchTo(next: Locale) {
    const segments = pathname.split("/");
    // `pathname` starts with "/"; segments[0] is "". When a non-default locale
    // is active, segments[1] is the locale slug. Default locale: no prefix.
    if (params.locale && segments[1] === params.locale) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    router.replace(segments.join("/") || "/");
  }

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
          aria-label={t("label")}
          title={t("label")}
        >
          {isCode ? (
            <span aria-hidden="true">{LOCALE_ABBREVIATIONS[current]}</span>
          ) : (
            <Globe className="size-4" aria-hidden="true" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        <DropdownMenuRadioGroup
          value={current}
          onValueChange={(value) => switchTo(value as Locale)}
        >
          {SUPPORTED_LOCALES.map((l) => (
            <DropdownMenuRadioItem key={l} value={l}>
              <span className="text-muted-foreground mr-2 text-xs font-semibold uppercase tabular-nums">
                {LOCALE_ABBREVIATIONS[l]}
              </span>
              {LOCALE_LABELS[l]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
