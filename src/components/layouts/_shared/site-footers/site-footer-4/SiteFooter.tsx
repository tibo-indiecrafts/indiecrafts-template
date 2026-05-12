import Link from "next/link";
import { Logo } from "@/components/layouts/_shared/logo";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { siteFooter4Namespace } from "./config";

export type SiteFooterProps = {
  /**
   * Background utility class applied to the `<footer>` element.
   * Defaults to `bg-background` for clean transitions; consumers
   * can pass `bg-foreground/10` (or similar) to match a tinted
   * page backdrop.
   */
  bgClassName?: string;
};

const PRODUCT_LINKS = [
  { id: "features", href: "#" },
  { id: "integrations", href: "#" },
  { id: "pricing", href: "#" },
  { id: "changelog", href: "#" },
] as const;

const COMPANY_LINKS = [
  { id: "about", href: "#" },
  { id: "blog", href: "#" },
  { id: "careers", href: "#" },
  { id: "contact", href: "#" },
] as const;

const RESOURCES_LINKS = [
  { id: "documentation", href: "#" },
  { id: "helpCenter", href: "#" },
  { id: "community", href: "#" },
  { id: "templates", href: "#" },
] as const;

const LEGAL_LINKS = [
  { id: "privacy", href: "#" },
  { id: "terms", href: "#" },
  { id: "cookiePolicy", href: "#" },
] as const;

type LinkId =
  | (typeof PRODUCT_LINKS)[number]["id"]
  | (typeof COMPANY_LINKS)[number]["id"]
  | (typeof RESOURCES_LINKS)[number]["id"]
  | (typeof LEGAL_LINKS)[number]["id"];

/**
 * Tailark `veil-footer-1` — JSX verbatim. Veil-style footer with
 * a brand block (Logo + tagline) + 3 link groups (`@sm:grid-cols-3`),
 * then a `border-t pt-8 mt-12` row holding copyright + 3 legal
 * links. Constrained to `max-w-2xl` and `bg-background border-t
 * py-12`. Default Tailwind font.
 */
export function SiteFooter({ bgClassName }: SiteFooterProps = {}) {
  const [t] = useScopedT(siteFooter4Namespace);
  const year = new Date().getFullYear();

  return (
    <footer className={cn("bg-background @container border-t py-12", bgClassName)}>
      <div className="mx-auto max-w-2xl px-6">
        <div className="grid grid-cols-2 gap-8 @sm:grid-cols-3">
          <div className="col-span-full">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-5 w-fit" />
            </Link>
            <p className="text-muted-foreground mt-4 max-w-xs text-sm">{t("tagline")}</p>
          </div>
          <LinkGroup t={t} heading={t("groupHeadings.product")} links={PRODUCT_LINKS} />
          <LinkGroup t={t} heading={t("groupHeadings.company")} links={COMPANY_LINKS} />
          <LinkGroup
            t={t}
            heading={t("groupHeadings.resources")}
            links={RESOURCES_LINKS}
          />
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-8">
          <p className="text-muted-foreground text-sm">{t("copyright", { year })}</p>
          <div className="flex gap-4">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t(`links.${link.id}`)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

type T = (key: string) => string;

const LinkGroup = ({
  t,
  heading,
  links,
}: {
  t: T;
  heading: string;
  links: ReadonlyArray<{ id: LinkId; href: string }>;
}) => (
  <div>
    <h3 className="text-foreground mb-3 text-sm font-medium">{heading}</h3>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.id}>
          <Link
            href={link.href}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            {t(`links.${link.id}`)}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
