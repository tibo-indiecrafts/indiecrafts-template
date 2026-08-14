"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, usePathname, useRouter } from "next/navigation";
import { defaultLocale, localeMap, locales, type Locale } from "@indiecrafts/config";
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
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ locale?: string }>();
  const current = useLocale() as Locale;

  // Locale-prefixed path — the default locale is served unprefixed (as-needed).
  const withLocale = (loc: Locale, path: string) =>
    loc === defaultLocale ? path || "/" : `/${loc}${path}`;

  async function switchTo(next: Locale) {
    const segments = pathname.split("/");
    const hasLocale = Boolean(params.locale) && segments[1] === params.locale;
    // Path after the locale prefix, e.g. "/blog/my-post".
    const rest = "/" + segments.slice(hasLocale ? 2 : 1).join("/");

    // Post / category / tag detail slugs differ per language. Resolve the
    // translated slug via the doc-i18n links; fall back to the blog homepage
    // when there's no translation. Author pages are global (same slug in every
    // language), so they swap locale like any other route.
    const detailType = /^\/blog\/category\/[^/]+$/.test(rest)
      ? "category"
      : /^\/blog\/tag\/[^/]+$/.test(rest)
        ? "tag"
        : /^\/blog\/[^/]+$/.test(rest) && !/^\/blog\/(category|tag)$/.test(rest)
          ? "post"
          : null;

    if (detailType) {
      const slug = rest.split("/").pop() ?? "";
      // No counterpart in the target locale → send to that locale's homepage
      // (this post/entity simply doesn't exist there).
      let target = withLocale(next, "/");
      try {
        const res = await fetch(
          `/api/i18n/translated-slug?type=${detailType}&slug=${encodeURIComponent(slug)}&from=${current}&to=${next}`,
        );
        const { path } = (await res.json()) as { path: string | null };
        if (path) target = withLocale(next, path);
      } catch {
        // keep the homepage fallback
      }
      router.replace(target);
      return;
    }

    if (hasLocale) {
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
          onValueChange={(value: string) => switchTo(value as Locale)}
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
