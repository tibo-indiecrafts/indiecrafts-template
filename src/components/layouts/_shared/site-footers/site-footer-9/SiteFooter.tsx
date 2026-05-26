import { Logo } from "@/components/layouts/_shared/logo";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/components/_lib/scoped-t";
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
                <a
                  key={link.id}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {t(`links.${link.id}`)}
                </a>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-4 pt-8 @xl:flex-row @xl:justify-between">
          <p className="text-muted-foreground text-sm">{t("copyright", { year })}</p>
          <div className="flex flex-wrap gap-4">
            {LEGAL_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t(`legal.${link.id}`)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
