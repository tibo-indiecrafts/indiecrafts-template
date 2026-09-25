"use client";

/**
 * Renders the localized route-level error boundary (the 500 page).
 *
 * @see docs/reference/projects/web/website/src/app/locale/error.md
 */

// Copy stays in `messages/<locale>.json` (NOT Sanity, unlike maintenance + 404):
// this is a Next client error boundary — it can't await a server fetch, and it
// must render even when Sanity is the failure. Keeping it on bundled messages
// guarantees the 500 page never depends on the thing that may have broken.
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ErrorContent } from "@indiecrafts/packages-shared-system-pages/web";
import { logger } from "@indiecrafts/packages-shared-logger";

type Props = { error: Error & { digest?: string }; reset: () => void };

// A client error boundary can't wrap in the server `DefaultLayout` (it uses
// `next/headers`) — and shouldn't: it must render even when the server side is
// the failure. It provides its own `<main id="main">` (pages own their chrome via
// DefaultLayout; the locale layout renders children directly), so no duplicate main.
export default function ErrorBoundary({ error, reset }: Readonly<Props>) {
  const t = useTranslations("pages.error");

  useEffect(() => {
    logger.error("Route error", error, { digest: error.digest });
  }, [error]);

  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-screen flex-col items-center justify-center px-(--gutter) py-16"
    >
      <ErrorContent
        title={t("title")}
        description={t("description")}
        retryLabel={t("retryLabel")}
        onRetry={reset}
      />
    </main>
  );
}
