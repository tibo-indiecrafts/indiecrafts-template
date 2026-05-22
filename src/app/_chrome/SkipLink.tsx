import { useTranslations } from "next-intl";

/**
 * Skip-to-content link. Forked from /components/layouts/_shared/skip-link/
 * so /app stays self-contained for production chrome.
 *
 * Must be the first focusable element in <body> and target `#main` (the
 * `<main>` element rendered by DefaultLayout).
 */
export function SkipLink() {
  const t = useTranslations("common");
  return (
    <a
      href="#main"
      className="focus:bg-foreground focus:text-background focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:shadow-lg focus:ring-2 focus:outline-none"
    >
      {t("skipToContent")}
    </a>
  );
}
