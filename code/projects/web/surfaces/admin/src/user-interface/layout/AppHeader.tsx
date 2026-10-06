/**
 * Render the dashboard's sticky header.
 *
 * @see docs/reference/projects/web/admin/src/user-interface/layout/AppHeader.md
 */
import { getTranslations } from "next-intl/server";
import { SidebarTrigger } from "@indiecrafts/packages-web-ui/web/sidebar";
import { Separator } from "@indiecrafts/packages-web-ui/web/separator";
import { ThemeToggle } from "@/user-interface/layout/ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Breadcrumbs } from "./Breadcrumbs";

/** Sticky dashboard header: sidebar toggle, breadcrumbs, language + theme toggles (pushed right). */
export async function AppHeader() {
  const t = await getTranslations("admin");

  return (
    <header className="bg-background sticky top-0 z-10 flex h-14 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumbs />
      <div className="ml-auto flex items-center gap-1">
        <LocaleSwitcher label={t("locale.label")} />
        <ThemeToggle
          label={{
            toggle: t("theme.toggle"),
            light: t("theme.light"),
            dark: t("theme.dark"),
          }}
        />
      </div>
    </header>
  );
}
