import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { footerNav } from "@/config/navigation.config";
import { siteConfig } from "@/config/site.config";
import { Logo } from "@/components/layouts/_shared/logo";
import { siteFooterNamespace } from "./config";

export function SiteFooter() {
  const tNav = useTranslations("nav");
  const tBlock = useTranslations(siteFooterNamespace);
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto max-w-(--max-container) px-(--gutter) py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Logo />
            <p className="text-muted-foreground mt-2 text-sm">{siteConfig.tagline}</p>
          </div>
          {footerNav.map((group) => (
            <nav key={group.labelKey} aria-label={tNav(group.labelKey)}>
              <h2 className="mb-3 text-sm font-semibold">{tNav(group.labelKey)}</h2>
              <ul className="space-y-2 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded focus-visible:ring-2 focus-visible:outline-none"
                    >
                      {tNav(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="text-muted-foreground mt-12 text-xs">
          © {year} {siteConfig.legal.company}. {tBlock("rights")}
        </p>
      </div>
    </footer>
  );
}
