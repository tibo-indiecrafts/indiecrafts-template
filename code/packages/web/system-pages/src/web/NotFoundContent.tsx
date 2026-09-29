/**
 * Render the web 404 content card.
 *
 * @see docs/reference/packages/web/system-pages/src/web/NotFoundContent.md
 */
import type { ComponentType, ReactNode } from "react";
import type { NotFoundContentProps as BaseProps } from "../shared/types";

/** The home-link component (e.g. next-intl `Link`). Defaults to a plain `<a href>`. */
type LinkLike = ComponentType<{
  href: string;
  className?: string;
  children: ReactNode;
}>;

export type NotFoundContentProps = BaseProps & {
  /**
   * Locale-aware link for the "go home" action — the website passes its
   * `@/i18n/routing` `Link`; a plain-React host gets the
   * default `<a>`. Injecting it keeps this brick **Next-agnostic** (no `next-intl`
   * dep), so the same `web` component serves Next + plain React.
   */
  LinkComponent?: LinkLike;
  /** Home href (default `/`). */
  homeHref?: string;
};

const DefaultLink: LinkLike = ({ href, className, children }) => (
  <a href={href} className={className}>
    {children}
  </a>
);

/**
 * Presentational 404 content — the centered card only. The app's `not-found.tsx`
 * route resolves the copy and wraps this in its own site chrome (`DefaultLayout`).
 */
export function NotFoundContent({
  eyebrow,
  title,
  description,
  homeLabel,
  LinkComponent = DefaultLink,
  homeHref = "/",
}: NotFoundContentProps) {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-4 px-(--gutter) py-24 text-center md:py-32">
      <p className="text-brand text-sm font-medium tracking-widest uppercase">
        {eyebrow}
      </p>
      <h1 className="text-4xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      <LinkComponent
        href={homeHref}
        className="hover:bg-muted focus-visible:ring-ring mt-4 inline-flex h-10 items-center justify-center rounded-md border px-6 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
      >
        {homeLabel}
      </LinkComponent>
    </section>
  );
}
