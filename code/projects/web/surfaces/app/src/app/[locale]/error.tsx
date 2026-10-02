"use client";

/**
 * Render the app's localized error boundary with the configured logo.
 *
 * @see docs/reference/projects/web/app/src/app/locale/error.md
 */
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ErrorContent } from "@indiecrafts/packages-web-system-pages/web";
import { logger } from "@indiecrafts/packages-shared-logger";
import { BrandMark } from "@/user-interface/BrandMark";
import { useBrand } from "@/user-interface/BrandProvider";

type Props = { error: Error & { digest?: string }; reset: () => void };

/** The error screen (also inside the mobile shell). Copy is bundled (never Sanity) and the
 *  logo comes from the layout's provider — nothing here can fail with the thing that broke. */
export default function ErrorBoundary({ error, reset }: Readonly<Props>) {
  const t = useTranslations("error");
  const brand = useBrand();

  useEffect(() => {
    logger.error("Route error", error, { digest: error.digest });
  }, [error]);

  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-screen flex-col items-center justify-center outline-none"
    >
      <ErrorContent
        brand={<BrandMark brand={brand} />}
        title={t("title")}
        description={t("description")}
        retryLabel={t("retryLabel")}
        onRetry={reset}
      />
    </main>
  );
}
