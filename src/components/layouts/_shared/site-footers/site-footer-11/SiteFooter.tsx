import { LogoIcon } from "@/components/layouts/_shared/logo";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { siteFooter11Namespace } from "./config";

export type SiteFooterProps = {
  bgClassName?: string;
};

const NAV_LINKS = [
  { id: "features", href: "#" },
  { id: "solution", href: "#" },
  { id: "customers", href: "#" },
  { id: "pricing", href: "#" },
  { id: "help", href: "#" },
  { id: "about", href: "#" },
] as const;

export function SiteFooter({ bgClassName }: SiteFooterProps = {}) {
  const [t] = useScopedT(siteFooter11Namespace);
  const homeLabel = t("homeLabel");
  const year = new Date().getFullYear();

  return (
    <footer className={cn("bg-background border-b py-12", bgClassName)}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap justify-between gap-12">
          <div className="order-last flex items-center gap-3 md:order-first">
            <a href="#" aria-label={homeLabel}>
              <LogoIcon />
            </a>
            <span className="text-muted-foreground block text-center text-sm">
              {t("copyright", { year })}
            </span>
          </div>

          <div className="order-first flex flex-wrap gap-x-6 gap-y-4 md:order-last">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-muted-foreground hover:text-primary block duration-150"
              >
                <span>{t(`links.${link.id}`)}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
