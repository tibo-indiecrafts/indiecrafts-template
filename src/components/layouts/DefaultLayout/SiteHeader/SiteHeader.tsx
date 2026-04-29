import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { headerNav } from "@/config/navigation.config";
import { features } from "@/config/features.config";
import { Logo } from "@/components/layouts/_shared/Logo";
import { LocaleSwitcher } from "@/components/layouts/_shared/LocaleSwitcher";
import { ThemeToggle } from "@/components/layouts/_shared/ThemeToggle";
import { siteHeaderNamespace } from "./config";

export function SiteHeader() {
  const t = useTranslations("nav");
  const tBlock = useTranslations(siteHeaderNamespace);
  return (
    <header className="bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-(--max-container) items-center justify-between px-(--gutter)">
        <Link href="/" aria-label={tBlock("brandHomeLabel")} className="font-semibold">
          <Logo />
        </Link>
        <nav aria-label={tBlock("primaryNavLabel")} className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            {headerNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground focus-visible:text-foreground focus-visible:ring-ring rounded transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {features.localeSwitcher ? <LocaleSwitcher /> : null}
        </div>
      </div>
    </header>
  );
}
