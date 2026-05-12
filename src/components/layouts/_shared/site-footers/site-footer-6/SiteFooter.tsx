import Link from "next/link";
import { Logo } from "@/components/layouts/_shared/logo";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { siteFooter6Namespace } from "./config";

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

type SocialId = "twitter" | "github" | "linkedin";

const SOCIAL_LINKS: ReadonlyArray<{ id: SocialId; href: string }> = [
  { id: "twitter", href: "#" },
  { id: "github", href: "#" },
  { id: "linkedin", href: "#" },
];

/**
 * Tailark `veil-footer-2` — JSX verbatim. Minimal centered veil
 * footer on `bg-background border-t py-12 @container` inside
 * `max-w-2xl`: Logo at top, nav row of 5 links, then 3 lucide
 * social icon buttons (Twitter / GitHub / LinkedIn), and a single-
 * line copyright with `next-intl` `{year}` interpolation.
 */
export function SiteFooter({ bgClassName }: SiteFooterProps = {}) {
  const [t] = useScopedT(siteFooter6Namespace);
  const year = new Date().getFullYear();

  return (
    <footer className={cn("bg-background @container border-t py-12", bgClassName)}>
      <div className="mx-auto max-w-2xl px-6">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-5" />
          </Link>
          <nav className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
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
          <div className="mt-8 flex gap-4">
            {SOCIAL_LINKS.map(({ id, href }) => (
              <Link
                key={id}
                href={href}
                className="text-muted-foreground hover:text-foreground inline-flex size-8 items-center justify-center rounded-full transition-colors"
                aria-label={t(`social.${id}`)}
              >
                <SocialIcon id={id} />
              </Link>
            ))}
          </div>
          <p className="text-muted-foreground mt-8 text-sm">{t("copyright", { year })}</p>
        </div>
      </div>
    </footer>
  );
}

const SocialIcon = ({ id }: { id: SocialId }) => {
  const className = "size-4";
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
    case "github":
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
            d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.94c0-1.1.39-1.99 1.03-2.69c-.1-.25-.45-1.27.1-2.65c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.38.2 2.4.1 2.65c.64.7 1.03 1.59 1.03 2.69c0 3.84-2.34 4.68-4.57 4.93c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
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
