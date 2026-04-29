import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Link } from "@/i18n/routing";
import { notFound1Defaults, notFound1Namespace } from "./config";

export type NotFound1Props = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

/**
 * 404 template — centered card with eyebrow, title, description, and a
 * "back home" link routed through the i18n-aware `Link`. All copy comes
 * from `blocks.not-found-1.*`.
 */
export function NotFound1({
  layout = notFound1Defaults.layout,
  header,
  footer,
}: NotFound1Props = {}) {
  const t = useTranslations(notFound1Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <section className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-4 px-(--gutter) py-24 text-center md:py-32">
        <p className="text-brand text-sm font-medium tracking-widest uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl font-semibold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
        <Link
          href="/"
          className="hover:bg-muted focus-visible:ring-ring mt-4 inline-flex h-10 items-center justify-center rounded-md border px-6 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
        >
          {t("homeLabel")}
        </Link>
      </section>
    </Layout>
  );
}
