import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Logo } from "@/app/layout/Logo";
import { footerNav } from "@/config";
import { site } from "@/config";

/**
 * Production site footer. Forked from
 * /components/layouts/default-layout/site-footer/ so /app/layout owns the
 * production chrome end-to-end.
 *
 * Renders nav groups from `footerNav` in `navigation.config.ts` (empty for
 * the template — pages-pricing/contact/etc. get added there when wired).
 * Always uses `Link` from `@/i18n/routing` so locale prefixes resolve.
 */
export function Footer() {
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto max-w-(--max-container) px-(--gutter) py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Logo />
            <p className="text-muted-foreground mt-2 text-sm">{site.tagline}</p>
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
          © {year} {site.legal.company}. {tFooter("rights")}
        </p>
      </div>
    </footer>
  );
}
