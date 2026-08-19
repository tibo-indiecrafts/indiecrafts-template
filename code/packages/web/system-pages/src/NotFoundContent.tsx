import { Link } from "@indiecrafts/i18n";

export type NotFoundContentProps = {
  eyebrow: string;
  title: string;
  description: string;
  homeLabel: string;
};

/**
 * Presentational 404 content — the centered card only. The app's `not-found.tsx`
 * route resolves the copy and wraps this in its own site chrome (`DefaultLayout`).
 * The home link uses the shared locale-aware `@indiecrafts/i18n` navigation.
 */
export function NotFoundContent({
  eyebrow,
  title,
  description,
  homeLabel,
}: NotFoundContentProps) {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-4 px-(--gutter) py-24 text-center md:py-32">
      <p className="text-brand text-sm font-medium tracking-widest uppercase">
        {eyebrow}
      </p>
      <h1 className="text-4xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      <Link
        href="/"
        className="hover:bg-muted focus-visible:ring-ring mt-4 inline-flex h-10 items-center justify-center rounded-md border px-6 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
      >
        {homeLabel}
      </Link>
    </section>
  );
}
