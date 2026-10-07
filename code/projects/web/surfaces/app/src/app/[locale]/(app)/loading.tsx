/**
 * Render the app loading state inside the shell.
 *
 * @see docs/reference/projects/web/app/src/app/locale/(app)/loading.md
 */
import { useTranslations } from "next-intl";
import { Spinner } from "@indiecrafts/packages-web-ui/web/spinner";

/** Shown while an (app) page streams in. The shell stays; a status region names the wait. */
export default function AppLoading() {
  const t = useTranslations("app");
  return (
    <div role="status" className="flex flex-1 items-center justify-center p-6">
      <Spinner aria-hidden className="text-muted-foreground size-6" />
      <span className="sr-only">{t("loading")}</span>
    </div>
  );
}
