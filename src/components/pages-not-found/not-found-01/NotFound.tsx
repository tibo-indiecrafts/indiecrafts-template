import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Link } from "@/i18n/routing";
import { notFound01Defaults, notFound01Namespace } from "./config";

export type NotFoundProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

export function NotFound({
  layout = notFound01Defaults.layout,
  header,
  footer,
}: NotFoundProps = {}) {
  const t = useTranslations(notFound01Namespace);
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
