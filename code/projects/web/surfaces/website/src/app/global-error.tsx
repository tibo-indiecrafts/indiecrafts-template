"use client";

/**
 * Render the last-resort error page when the locale layout itself fails.
 *
 * @see docs/reference/projects/web/website/src/app/global-error.md
 */
import "@indiecrafts/packages-web-ui-tokens/globals.css";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ErrorContent } from "@indiecrafts/packages-web-system-pages/web";
import { logger } from "@indiecrafts/packages-shared-logger";
import { defaultLocale, isLocale, localeCodes, localeDir, type Locale } from "@/config";

type Props = { error: Error & { digest?: string }; reset: () => void };
type ErrorCopy = { title: string; description: string; retryLabel: string };

/** The URL's locale prefix, else the default locale (it has no prefix). */
function pathLocale(pathname: string): Locale {
  const first = pathname.split("/")[1] ?? "";
  return isLocale(first, localeCodes) ? first : defaultLocale;
}

// `[locale]/error.tsx` catches page errors; this catches the locale layout's own,
// so it replaces `<html>` and has no next-intl provider. The copy is the same
// `pages.error` block, loaded on demand: this module ships on every page, and a
// static import would add every locale's messages to it.
export default function GlobalError({ error, reset }: Readonly<Props>) {
  const locale = pathLocale(usePathname() ?? "/");
  const [copy, setCopy] = useState<ErrorCopy | null>(null);

  useEffect(() => {
    logger.error("Root layout error", error, { digest: error.digest });
  }, [error]);

  useEffect(() => {
    import(`../../messages/${locale}.json`)
      .then((messages: { default: { pages: { error: ErrorCopy } } }) =>
        setCopy(messages.default.pages.error),
      )
      .catch((loadError: unknown) =>
        logger.error("Error copy failed to load", loadError, { locale }),
      );
  }, [locale]);

  return (
    <html lang={locale} dir={localeDir(locale)} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <main
          id="main"
          tabIndex={-1}
          className="flex min-h-screen flex-col items-center justify-center px-(--gutter) py-16"
        >
          {copy ? (
            <ErrorContent
              title={copy.title}
              description={copy.description}
              retryLabel={copy.retryLabel}
              onRetry={reset}
            />
          ) : null}
        </main>
      </body>
    </html>
  );
}
