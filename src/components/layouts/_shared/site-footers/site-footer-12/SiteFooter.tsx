import Link from "next/link";
import { LogoIcon } from "@/components/layouts/_shared/logo";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { siteFooter12Namespace } from "./config";

export type SiteFooterProps = {
  bgClassName?: string;
};

const NAV_LINKS = [
  { id: "features", href: "#" },
  { id: "pricing", href: "#" },
  { id: "about", href: "#" },
  { id: "blog", href: "#" },
  { id: "contact", href: "#" },
] as const;

export function SiteFooter({ bgClassName }: SiteFooterProps = {}) {
  const [t] = useScopedT(siteFooter12Namespace);
  const homeLabel = t("homeLabel");
  const year = new Date().getFullYear();

  return (
    <footer className={cn("bg-background @container py-12", bgClassName)}>
      <div className="mx-auto max-w-2xl px-6">
        <div className="flex flex-col">
          <Link
            href="/"
            aria-label={homeLabel}
            className="hover:bg-foreground/5 -ml-1.5 flex size-8 rounded-lg *:m-auto"
          >
            <LogoIcon className="w-fit" />
          </Link>
          <nav className="my-8 flex flex-wrap gap-x-8 gap-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t(`links.${link.id}`)}
              </Link>
            ))}
          </nav>

          <ThemeSwitcher />

          <p className="text-muted-foreground mt-2 border-t pt-6 text-sm">
            {t("copyright", { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
