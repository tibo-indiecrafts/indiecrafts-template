"use client";

import { useTranslations } from "next-intl";
import { Logo } from "@/app/_chrome/Logo";
import { LocaleSwitcher } from "@/app/_chrome/LocaleSwitcher";
import { ThemeToggle } from "@/app/_chrome/ThemeToggle";
import { Link } from "@/i18n/routing";
import { features } from "@/config";
import { headerNav } from "@/config";

/**
 * Production site header. Slim purpose-built variant — logo, nav links from
 * `headerNav` in `navigation.config.ts`, locale switcher, theme toggle.
 *
 * Forked here (not imported from /components) so the production header can
 * evolve independently of the example header library in
 * /components/layouts/_shared/site-headers/. Atoms (Logo, LocaleSwitcher,
 * ThemeToggle) are still shared from /components — they're widgets, not
 * chrome.
 *
 * Fixed at the top — DefaultLayout's `<main>` adds `pt-14 lg:pt-20` to
 * clear the header height.
 */
export function Header() {
  const tNav = useTranslations("nav");
  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 fixed inset-x-0 top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-(--max-container) items-center justify-between px-(--gutter) lg:h-20">
        <Link
          href="/"
          aria-label={tNav("home")}
          className="focus-visible:ring-ring rounded focus-visible:ring-2 focus-visible:outline-none"
        >
          <Logo />
        </Link>
        <nav className="flex items-center gap-1">
          {headerNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {tNav(link.labelKey)}
            </Link>
          ))}
          {features.localeSwitcher ? <LocaleSwitcher /> : null}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
