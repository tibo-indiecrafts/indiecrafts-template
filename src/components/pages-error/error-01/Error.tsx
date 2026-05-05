"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Button } from "@/components/ui-primitives/button";
import { error01Defaults, error01Namespace } from "./config";

export type ErrorProps = {
  /** Triggered by the retry button. Defaults to a no-op for stories. */
  onRetry?: () => void;
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

/**
 * Generic error template — centered card with title, description, and a
 * retry button. All copy comes from `blocks.error-01.*`. The retry handler
 * is route-supplied (Next.js error boundaries pass a `reset` callback).
 */
export function Error({
  onRetry = () => undefined,
  layout = error01Defaults.layout,
  header,
  footer,
}: ErrorProps = {}) {
  const t = useTranslations(error01Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <section className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-4 px-(--gutter) py-24 text-center md:py-32">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
        <Button type="button" onClick={onRetry} className="mt-4">
          {t("retryLabel")}
        </Button>
      </section>
    </Layout>
  );
}
