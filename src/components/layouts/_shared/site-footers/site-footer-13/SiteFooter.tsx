import Link from "next/link";
import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { Logo } from "@/components/layouts/_shared/logo";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { siteFooter13Namespace } from "./config";

export type SiteFooterProps = {
  bgClassName?: string;
};

const ENTERPRISE_LINKS = [
  { id: "enterpriseAbout", href: "#" },
  { id: "enterpriseCustomers", href: "#" },
  { id: "enterpriseEnterprise", href: "#" },
  { id: "enterprisePartners", href: "#" },
  { id: "enterpriseJobs", href: "#" },
] as const;

const PRODUCT_LINKS = [
  { id: "productSecurity", href: "#" },
  { id: "productCustomization", href: "#" },
  { id: "productEnterprise", href: "#" },
  { id: "productPartners", href: "#" },
] as const;

const DOCS_LINKS = [
  { id: "docsIntroduction", href: "#" },
  { id: "docsInstallation", href: "#" },
  { id: "docsUtils", href: "#" },
  { id: "docsPrinciples", href: "#" },
  { id: "docsJargon", href: "#" },
  { id: "docsPlugin", href: "#" },
  { id: "docsCustomizer", href: "#" },
  { id: "docsBoilerplates", href: "#" },
] as const;

const COMMUNITY_LINKS = [
  { id: "communityGithub", href: "#" },
  { id: "communityDiscord", href: "#" },
  { id: "communitySlack", href: "#" },
  { id: "communityTwitter", href: "#" },
] as const;

const SOCIAL_LINKS = [
  { id: "threads", href: "#" },
  { id: "instagram", href: "#" },
  { id: "tiktok", href: "#" },
] as const;

type LinkId =
  | (typeof ENTERPRISE_LINKS)[number]["id"]
  | (typeof PRODUCT_LINKS)[number]["id"]
  | (typeof DOCS_LINKS)[number]["id"]
  | (typeof COMMUNITY_LINKS)[number]["id"];

/**
 * Tailark `footer-5` — JSX verbatim. Rounded card-style footer
 * (`m-1 rounded-3xl border`) with three regions:
 * 1. Top brand row (`border-b pb-8`): Logo + 3 social icons
 * 2. 4-col link grid (`sm:grid-cols-4`): Enterprise / Product /
 *    Docs / Community + newsletter signup
 * 3. `bg-muted rounded-md` license bar with copyright + Licence link
 */
export function SiteFooter({ bgClassName }: SiteFooterProps = {}) {
  const [t] = useScopedT(siteFooter13Namespace);
  const homeLabel = t("homeLabel");

  return (
    <footer className={cn("m-1 rounded-3xl border", bgClassName)}>
      <div className="mx-auto max-w-5xl space-y-16 px-5 py-16">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-8">
          <Link href="/" aria-label={homeLabel}>
            <Logo />
          </Link>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map(({ id, href }) => (
              <Link
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t(`social.${id}`)}
                className="text-muted-foreground hover:text-primary block"
              >
                <SocialIcon id={id} />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <LinkGroup
            t={t}
            heading={t("groupHeadings.enterprise")}
            links={ENTERPRISE_LINKS}
          />
          <LinkGroup t={t} heading={t("groupHeadings.product")} links={PRODUCT_LINKS} />
          <LinkGroup t={t} heading={t("groupHeadings.docs")} links={DOCS_LINKS} />
          <div>
            <span className="text-sm font-medium">{t("groupHeadings.community")}</span>
            <ul className="mt-4 list-inside space-y-4">
              {COMMUNITY_LINKS.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="hover:text-primary text-muted-foreground text-sm duration-150"
                  >
                    {t(`links.${link.id}`)}
                  </Link>
                </li>
              ))}
            </ul>

            <form className="mt-12 w-full max-w-xs">
              <div className="space-y-2.5">
                <Label
                  className="block text-sm font-medium"
                  htmlFor="footer-newsletter-email"
                >
                  {t("newsletter.label")}
                </Label>
                <Input
                  id="footer-newsletter-email"
                  type="email"
                  required
                  name="email"
                  placeholder={t("newsletter.placeholder")}
                />
              </div>
              <Button type="submit" className="mt-3">
                <span>{t("newsletter.submit")}</span>
              </Button>
            </form>
          </div>
        </div>

        <div className="bg-muted mt-16 flex items-center justify-between rounded-md p-4 px-6 py-3">
          <span>{t("license.copyright")}</span>
          <Link href="#" className="text-muted-foreground hover:text-primary text-sm">
            {t("license.link")}
          </Link>
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
    <span className="font-medium">{heading}</span>
    <ul className="mt-4 list-inside space-y-4">
      {links.map((link) => (
        <li key={link.id}>
          <Link
            href={link.href}
            className="hover:text-primary text-muted-foreground text-sm duration-150"
          >
            {t(`links.${link.id}`)}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const SocialIcon = ({ id }: { id: (typeof SOCIAL_LINKS)[number]["id"] }) => {
  const className = "size-6";
  switch (id) {
    case "threads":
      return (
        <svg
          aria-hidden
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M19.25 8.505c-1.577-5.867-7-5.5-7-5.5s-7.5-.5-7.5 8.995s7.5 8.996 7.5 8.996s4.458.296 6.5-3.918c.667-1.858.5-5.573-6-5.573c0 0-3 0-3 2.5c0 .976 1 2 2.5 2s3.171-1.027 3.5-3c1-6-4.5-6.5-6-4"
            color="currentColor"
          />
        </svg>
      );
    case "instagram":
      return (
        <svg
          aria-hidden
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
          />
        </svg>
      );
    case "tiktok":
      return (
        <svg
          aria-hidden
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48"
          />
        </svg>
      );
  }
};
