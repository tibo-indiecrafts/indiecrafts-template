import { Logo } from "@/components/layouts/_shared/logo";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/components/_lib/scoped-t";
import { siteFooter8Namespace } from "./config";

export type SiteFooterProps = {
  bgClassName?: string;
};

const PRODUCT_LINKS = [
  { id: "features", href: "#" },
  { id: "solution", href: "#" },
] as const;

const COMPANY_LINKS = [
  { id: "about", href: "#" },
  { id: "licence", href: "#" },
  { id: "privacy", href: "#" },
  { id: "cookies", href: "#" },
] as const;

const SOCIAL_LINKS = [
  { id: "twitter", href: "#" },
  { id: "linkedin", href: "#" },
] as const;

type LinkId = (typeof PRODUCT_LINKS)[number]["id"] | (typeof COMPANY_LINKS)[number]["id"];

export function SiteFooter({ bgClassName }: SiteFooterProps = {}) {
  const [t] = useScopedT(siteFooter8Namespace);
  const homeLabel = t("homeLabel");

  return (
    <footer className={cn("bg-background border-b py-8 sm:py-20", bgClassName)}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="space-y-6 md:col-span-2">
            <Link href="/" aria-label={homeLabel} className="block size-fit">
              <Logo />
            </Link>

            <div className="order-first flex flex-wrap gap-6 text-sm md:order-last">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(`social.${social.id}`)}
                  className="text-muted-foreground hover:text-primary block"
                >
                  <SocialIcon id={social.id} />
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-3 grid gap-6 sm:grid-cols-3">
            <LinkGroup t={t} heading={t("groupHeadings.product")} links={PRODUCT_LINKS} />
            <LinkGroup t={t} heading={t("groupHeadings.company")} links={COMPANY_LINKS} />
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
  <div className="space-y-4">
    <span className="block font-medium">{heading}</span>
    <div className="flex flex-wrap gap-4 sm:flex-col">
      {links.map((link) => (
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
);

const SocialIcon = ({ id }: { id: (typeof SOCIAL_LINKS)[number]["id"] }) => {
  const className = "size-6";
  switch (id) {
    case "twitter":
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
            d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"
          />
        </svg>
      );
    case "linkedin":
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
            d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
          />
        </svg>
      );
  }
};
