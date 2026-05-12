import Link from "next/link";
import { Logo } from "@/components/layouts/_shared/logo";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { siteFooter9Namespace } from "./config";

export type SiteFooterProps = {
  bgClassName?: string;
};

const NAV_LINKS = [
  { id: "home", href: "#" },
  { id: "features", href: "#" },
  { id: "pricing", href: "#" },
  { id: "about", href: "#" },
  { id: "blog", href: "#" },
  { id: "contact", href: "#" },
] as const;

const LEGAL_LINKS = [
  { id: "privacy", href: "#" },
  { id: "terms", href: "#" },
  { id: "cookies", href: "#" },
] as const;

/**
 * Tailark `veil-footer-3` — JSX verbatim. Bordered veil footer on
 * `bg-background @container py-12` inside `max-w-2xl`. Top
 * `border-y py-8` row holds the Logo on the left and a 6-link nav
 * rail (`@xl:ml-auto`) on the right. Bottom `pt-8` row stacks
 * `flex-col-reverse @xl:flex-row @xl:justify-between` with
 * copyright (`{year}` interpolation) + 3 legal links.
 */
export function SiteFooter({ bgClassName }: SiteFooterProps = {}) {
  const [t] = useScopedT(siteFooter9Namespace);
  const homeLabel = t("homeLabel");
  const year = new Date().getFullYear();

  return (
    <footer className={cn("bg-background @container py-12", bgClassName)}>
      <div className="mx-auto max-w-2xl px-6">
        <div className="border-y py-8">
          <div className="flex flex-col gap-6 @xl:flex-row @xl:items-center">
            <Link href="/" aria-label={homeLabel}>
              <Logo className="h-5 w-fit" />
            </Link>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 @xl:ml-auto">
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
          </div>
        </div>
        <div className="flex flex-col-reverse gap-4 pt-8 @xl:flex-row @xl:justify-between">
          <p className="text-muted-foreground text-sm">{t("copyright", { year })}</p>
          <div className="flex flex-wrap gap-4">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t(`legal.${link.id}`)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
