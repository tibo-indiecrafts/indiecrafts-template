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
  const t = useTranslations(localeSwitcherNamespace);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ locale?: string }>();
  const current = useLocale() as Locale;

  function switchTo(next: Locale) {
    const segments = pathname.split("/");

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
