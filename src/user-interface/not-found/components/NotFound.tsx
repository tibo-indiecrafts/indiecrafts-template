import type { ReactNode } from "react";
import { Link } from "@/i18n/routing";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";

export type NotFoundProps = {
  eyebrow: string;
  title: string;
  description: string;
  homeLabel: string;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

/**
 * Presentational 404. Copy is resolved by the `not-found.tsx` route
 * (Sanity `siteMeta.<locale>.systemPages.notFound` ?? `messages`) and passed in.
 */
export function NotFound({
  eyebrow,
  title,
  description,
  homeLabel,
  header,
  footer,
}: NotFoundProps) {
  return (
    <DefaultLayout header={header} footer={footer}>
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
    </DefaultLayout>
  );
}
