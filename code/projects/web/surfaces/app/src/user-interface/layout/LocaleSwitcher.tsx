"use client";

/**
 * Switch the active locale, preserving the current path.
 *
 * @see docs/reference/projects/web/app/src/user-interface/layout/LocaleSwitcher.md
 */
import { useTransition } from "react";
import { Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { routing, usePathname, useRouter } from "@/i18n/routing";
import { persistLocale } from "@indiecrafts/packages-web-auth/persist-locale";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@indiecrafts/packages-web-ui/web/dropdown-menu";

/** Switch the active locale, preserving the current path (no localized pathnames on this surface). */
export function LocaleSwitcher({ label }: { label: string }) {
  const active = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label} disabled={pending}>
          <Languages className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            disabled={loc === active}
            onClick={() => {
              persistLocale(loc);
              startTransition(() => router.replace(pathname, { locale: loc }));
            }}
          >
            {loc.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
