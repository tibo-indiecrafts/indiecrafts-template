import { useTranslations } from "next-intl";
import { skipLinkNamespace } from "./config";

export function SkipLink() {
  const t = useTranslations(skipLinkNamespace);
  return (
    <a
      href="#main"
      className="focus:bg-foreground focus:text-background focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:shadow-lg focus:ring-2 focus:outline-none"
    >
      {t("label")}
    </a>
  );
}
