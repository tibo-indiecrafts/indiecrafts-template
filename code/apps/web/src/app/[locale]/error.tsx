"use client";

// Copy stays in `messages/<locale>.json` (NOT Sanity, unlike maintenance + 404):
// this is a Next client error boundary — it can't await a server fetch, and it
// must render even when Sanity is the failure. Keeping it on bundled messages
// guarantees the 500 page never depends on the thing that may have broken.
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ErrorContent } from "@indiecrafts/system-pages";
import { logger } from "@indiecrafts/logger";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";

type Props = { error: Error & { digest?: string }; reset: () => void };

export default function ErrorBoundary({ error, reset }: Readonly<Props>) {
  const t = useTranslations("pages.error");

  useEffect(() => {
    logger.error("Route error", error, { digest: error.digest });
  }, [error]);

  return (
    <DefaultLayout>
      <ErrorContent
        title={t("title")}
        description={t("description")}
        retryLabel={t("retryLabel")}
        onRetry={reset}
      />
    </DefaultLayout>
  );
}
